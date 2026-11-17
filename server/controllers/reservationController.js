import { readDb, writeDb } from '../utils/db.js';

export const getReservations = (req, res) => {
  try {
    const db = readDb();
    const user = req.user;

    // Security: Students only see their own reservations, Caretakers see all
    let reservations = db.reservations;
    if (user.role !== 'caretaker') {
      reservations = reservations.filter(r => r.userId === user.id);
    }

    // Sort by createdAt descending
    reservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error('getReservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania rezerwacji.'
    });
  }
};

export const createReservation = (req, res) => {
  try {
    const { equipmentId, startDate, endDate, purpose } = req.body;
    const user = req.user;
    const db = readDb();

    // Verify equipment exists
    const equipment = db.equipment.find(e => e.id === equipmentId);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Wybrany sprzęt nie istnieje.'
      });
    }

    if (equipment.status === 'maintenance') {
      return res.status(400).json({
        success: false,
        message: 'Sprzęt znajduje się obecnie w serwisie/konserwacji i nie może zostać zarezerwowany.'
      });
    }

    // Conflict detection: check overlapping approved or pending reservations for this equipment
    const isConflict = db.reservations.some(r => {
      if (r.equipmentId !== equipmentId) return false;
      if (r.status === 'rejected' || r.status === 'cancelled' || r.status === 'returned') return false;

      // Overlap condition: startA <= endB and endA >= startB
      const hasOverlap = (startDate <= r.endDate && endDate >= r.startDate);
      return hasOverlap;
    });

    if (isConflict) {
      return res.status(409).json({
        success: false,
        message: 'Konflikt terminów: Sprzęt jest już zarezerwowany w wybranym przedziale czasowym.'
      });
    }

    const newReservation = {
      id: `res-${Date.now()}`,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      startDate,
      endDate,
      purpose,
      status: 'pending',
      caretakerNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.reservations.push(newReservation);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Rezerwacja została pomyślnie złożona i oczekuje na zatwierdzenie przez opiekuna pracowni.',
      data: newReservation
    });
  } catch (error) {
    console.error('createReservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas tworzenia rezerwacji.'
    });
  }
};

export const cancelReservation = (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const db = readDb();

    const reservation = db.reservations.find(r => r.id === id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezerwacja o podanym ID nie została odnaleziona.'
      });
    }

    // Security check: Only the reservation owner or a caretaker can cancel it!
    if (reservation.userId !== user.id && user.role !== 'caretaker') {
      return res.status(403).json({
        success: false,
        message: 'Odmowa dostępu: Brak uprawnień do anulowania rezerwacji innego użytkownika.'
      });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Ta rezerwacja jest już anulowana.'
      });
    }

    if (reservation.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Nie można anulować zakończonej i zwróconej rezerwacji.'
      });
    }

    reservation.status = 'cancelled';
    reservation.updatedAt = new Date().toISOString();
    writeDb(db);

    res.json({
      success: true,
      message: 'Rezerwacja została pomyślnie anulowana.',
      data: reservation
    });
  } catch (error) {
    console.error('cancelReservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas anulowania rezerwacji.'
    });
  }
};

export const updateReservationStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, caretakerNotes } = req.body;
    const db = readDb();

    const allowedStatuses = ['pending', 'approved', 'rejected', 'returned', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Nieprawidłowy status. Dozwolone: ${allowedStatuses.join(', ')}`
      });
    }

    const reservation = db.reservations.find(r => r.id === id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezerwacja nie została odnaleziona.'
      });
    }

    reservation.status = status;
    if (caretakerNotes !== undefined) {
      reservation.caretakerNotes = typeof caretakerNotes === 'string' ? caretakerNotes.trim() : '';
    }
    reservation.updatedAt = new Date().toISOString();

    writeDb(db);

    res.json({
      success: true,
      message: `Status rezerwacji został zmieniony na: ${status}.`,
      data: reservation
    });
  } catch (error) {
    console.error('updateReservationStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas aktualizacji statusu rezerwacji.'
    });
  }
};
