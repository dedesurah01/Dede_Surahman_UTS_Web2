import User from '../models/User.js';

// ─── REGISTER ─────────────────────────────────────────────────
// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? lastUser.id + 1 : 1;

    const user = new User({ id: newId, name, email, password, role: 'user' });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── LOGIN ─────────────────────────────────────────────────────
// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const session = { id: user.id, name: user.name, email: user.email, role: user.role };

    res.json({
      success: true,
      user: session,
      message: `Selamat datang, ${user.name}!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET PROFILE ───────────────────────────────────────────────
// GET /api/auth/profile/:userId
export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.params.userId) }, '-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL USERS (Admin) ─────────────────────────────────────
// GET /api/auth/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
