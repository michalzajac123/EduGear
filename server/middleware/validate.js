// Input sanitization helper to prevent XSS
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Strip basic HTML tags
    .substring(0, 1000); // Prevent payload overload
};

export const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Imię i nazwisko musi zawierać co najmniej 2 znaki.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Podaj poprawny adres e-mail (np. jan@szkola.pl).'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Hasło musi zawierać co najmniej 6 znaków.'
    });
  }

  const allowedRoles = ['student', 'caretaker'];
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Nieprawidłowa rola użytkownika. Dostępne: student, caretaker.'
    });
  }

  req.body.name = sanitizeString(name);
  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Wszystkie pola (email i hasło) są wymagane.'
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateReservation = (req, res, next) => {
  const { equipmentId, startDate, endDate, purpose } = req.body;

  if (!equipmentId) {
    return res.status(400).json({
      success: false,
      message: 'Wybierz sprzęt do rezerwacji.'
    });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!startDate || !dateRegex.test(startDate)) {
    return res.status(400).json({
      success: false,
      message: 'Niepoprawny format daty początkowej (oczekiwany: RRRR-MM-DD).'
    });
  }

  if (!endDate || !dateRegex.test(endDate)) {
    return res.status(400).json({
      success: false,
      message: 'Niepoprawny format daty końcowej (oczekiwany: RRRR-MM-DD).'
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Podano nieprawidłową datę.'
    });
  }

  // Security check: Start date cannot be before today
  if (start < today) {
    return res.status(400).json({
      success: false,
      message: 'Data początkowa nie może być wcześniejsza niż dzisiejsza.'
    });
  }

  // Security check: End date cannot be before start date
  if (end < start) {
    return res.status(400).json({
      success: false,
      message: 'Błąd walidacji: Data końcowa nie może być wcześniejsza niż data początkowa.'
    });
  }

  if (!purpose || sanitizeString(purpose).length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Cel rezerwacji musi zawierać co najmniej 5 znaków.'
    });
  }

  req.body.purpose = sanitizeString(purpose);
  next();
};

export const validateEquipment = (req, res, next) => {
  const { name, category, description, serialNumber, location } = req.body;

  if (!name || sanitizeString(name).length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Nazwa sprzętu musi zawierać co najmniej 3 znaki.'
    });
  }

  if (!category || sanitizeString(category).length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Kategoria sprzętu jest wymagana.'
    });
  }

  if (!serialNumber || sanitizeString(serialNumber).length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Numer seryjny sprzętu jest wymagany.'
    });
  }

  req.body.name = sanitizeString(name);
  req.body.category = sanitizeString(category);
  req.body.description = sanitizeString(description || '');
  req.body.serialNumber = sanitizeString(serialNumber);
  req.body.location = sanitizeString(location || 'Pracownia szkolna');
  next();
};
