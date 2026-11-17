import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDb, writeDb } from '../utils/db.js';
import { JWT_SECRET } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    const db = readDb();

    // Check if user already exists
    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Konto z podanym adresem e-mail już istnieje w systemie.'
      });
    }

    // Security: Password hashing with bcrypt salt rounds = 10
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === 'caretaker' ? 'caretaker' : 'student',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDb(db);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return safe user object (excluding password hash)
    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Konto zostało pomyślnie utworzone!',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił wewnętrzny błąd serwera podczas rejestracji.'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDb();

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Nieprawidłowy adres e-mail lub hasło.'
      });
    }

    // Compare provided password with stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Nieprawidłowy adres e-mail lub hasło.'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Zalogowano pomyślnie.',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił wewnętrzny błąd serwera podczas logowania.'
    });
  }
};

export const getCurrentUser = (req, res) => {
  try {
    const db = readDb();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Użytkownik nie został znaleziony.'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania profilu użytkownika.'
    });
  }
};
