import { readDb, writeDb } from '../utils/db.js';

export const getAllEquipment = (req, res) => {
  try {
    const { category, search, status } = req.query;
    const db = readDb();
    let items = [...db.equipment];

    if (category && category !== 'all') {
      items = items.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'all') {
      items = items.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.location && e.location.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('getAllEquipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania listy sprzętu.'
    });
  }
};

export const getEquipmentById = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const item = db.equipment.find(e => e.id === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Sprzęt o podanym ID nie został znaleziony.'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('getEquipmentById error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania szczegółów sprzętu.'
    });
  }
};

export const addEquipment = (req, res) => {
  try {
    const { name, category, description, serialNumber, location, imageUrl } = req.body;
    const db = readDb();

    // Check duplicate serial number
    const existing = db.equipment.find(e => e.serialNumber.toLowerCase() === serialNumber.toLowerCase());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Sprzęt o tym numerze seryjnym już istnieje w bazie.'
      });
    }

    const newItem = {
      id: `eq-${Date.now()}`,
      name,
      category,
      description,
      status: 'available',
      serialNumber,
      location,
      imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    db.equipment.push(newItem);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Nowy sprzęt został pomyślnie dodany do pracowni.',
      data: newItem
    });
  } catch (error) {
    console.error('addEquipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd serwera podczas dodawania sprzętu.'
    });
  }
};

export const updateEquipment = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const index = db.equipment.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sprzęt nie został znaleziony.'
      });
    }

    const allowedUpdates = ['name', 'category', 'description', 'status', 'location', 'imageUrl'];
    const current = db.equipment[index];

    allowedUpdates.forEach(key => {
      if (req.body[key] !== undefined) {
        current[key] = req.body[key];
      }
    });

    db.equipment[index] = current;
    writeDb(db);

    res.json({
      success: true,
      message: 'Dane sprzętu zostały zaktualizowane.',
      data: current
    });
  } catch (error) {
    console.error('updateEquipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas aktualizacji sprzętu.'
    });
  }
};

export const deleteEquipment = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const index = db.equipment.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sprzęt nie został znaleziony.'
      });
    }

    // Check if active reservations exist
    const hasActiveReservation = db.reservations.some(
      r => r.equipmentId === id && (r.status === 'pending' || r.status === 'approved')
    );

    if (hasActiveReservation) {
      return res.status(400).json({
        success: false,
        message: 'Nie można usunąć sprzętu z aktywnymi lub oczekującymi rezerwacjami.'
      });
    }

    db.equipment.splice(index, 1);
    writeDb(db);

    res.json({
      success: true,
      message: 'Sprzęt został usunięty z inwentarza.'
    });
  } catch (error) {
    console.error('deleteEquipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas usuwania sprzętu.'
    });
  }
};
