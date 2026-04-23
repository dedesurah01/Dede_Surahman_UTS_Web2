// Authentication module

const Auth = {
  USERS_KEY: 'cireng_users',
  SESSION_KEY: 'cireng_session',

  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },

  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  register(name, email, password) {
    const users = this.getUsers();

    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Password minimal 6 karakter.' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    return { success: true, message: 'Registrasi berhasil! Silakan login.' };
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Email atau password salah.' };
    }

    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session };
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'index.html';
  },

  // Seed default admin account
  seedAdmin() {
    const users = this.getUsers();
    if (!users.find(u => u.email === 'admin@cireng.com')) {
      users.push({
        id: 1,
        name: 'Admin Cireng',
        email: 'admin@cireng.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      this.saveUsers(users);
    }
  }
};

// Seed admin on load
Auth.seedAdmin();
