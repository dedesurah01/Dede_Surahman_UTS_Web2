// Authentication module — integrated with Railway API

const Auth = {
  SESSION_KEY: 'cireng_session',

  async register(name, email, password) {
    if (password.length < 6) {
      return { success: false, message: 'Password minimal 6 karakter.' };
    }
    try {
      const res = await apiFetch(API.register, {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      return res;
    } catch {
      return { success: false, message: 'Gagal terhubung ke server.' };
    }
  },

  async login(email, password) {
    try {
      const res = await apiFetch(API.login, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.success) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(res.user));
      }
      return res;
    } catch {
      return { success: false, message: 'Gagal terhubung ke server.' };
    }
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'index.html';
  },

  getUsers() {
    // Hanya untuk kompatibilitas admin lokal
    return JSON.parse(localStorage.getItem('cireng_users') || '[]');
  }
};
