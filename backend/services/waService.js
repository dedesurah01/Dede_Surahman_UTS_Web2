// WhatsApp Notification Service via Fonnte
import https from 'https';
import querystring from 'querystring';

/**
 * Kirim pesan WA via Fonnte menggunakan https native Node.js
 */
const sendWA = (target, message) => {
  return new Promise((resolve, reject) => {
    // Baca token saat fungsi dipanggil (bukan saat module load)
    const token = process.env.FONNTE_TOKEN;

    if (!token) {
      console.warn('⚠️  FONNTE_TOKEN belum diset di .env');
      return resolve({ success: false, reason: 'token_missing' });
    }

    const postData = querystring.stringify({ target, message, countryCode: '62' });

    const options = {
      hostname: 'api.fonnte.com',
      path: '/send',
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.status === true || parsed.status === 'true') {
            console.log(`✅ Notif WA terkirim ke ${target}`);
            resolve({ success: true, data: parsed });
          } else {
            console.error('❌ Fonnte response:', data);
            resolve({ success: false, data: parsed });
          }
        } catch (e) {
          console.error('❌ Fonnte parse error:', data);
          resolve({ success: false, reason: data });
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ WA send error:', err.message);
      resolve({ success: false, reason: err.message });
    });

    req.write(postData);
    req.end();
  });
};

/**
 * Format & kirim notifikasi order baru ke nomor owner
 */
export const notifyNewOrder = async (order) => {
  // Baca target saat fungsi dipanggil
  const target = process.env.WA_NOTIF_NUMBER;
  const itemList = order.items
    .map(i => `  • ${i.nama} x${i.qty} = Rp ${(i.price * i.qty).toLocaleString('id-ID')}`)
    .join('\n');

  const message =
`🥟 *ORDERAN BARU MASUK!*
━━━━━━━━━━━━━━━━━━
📋 *ID:* ${order.orderId}
🕐 *Waktu:* ${new Date(order.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

👤 *Pemesan:* ${order.customer.name}
📱 *No. HP:* ${order.customer.phone}
📍 *Alamat:* ${order.customer.address}
💳 *Pembayaran:* ${order.customer.payment}

🛍 *Item:*
${itemList}

━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* Rp ${order.subtotal.toLocaleString('id-ID')}
🚚 *Ongkir:* ${order.shipping === 0 ? 'Gratis' : 'Rp ' + order.shipping.toLocaleString('id-ID')}
✅ *TOTAL: Rp ${order.total.toLocaleString('id-ID')}*
━━━━━━━━━━━━━━━━━━
Segera proses pesanan ini! 🔥`;

  console.log(`📤 Mengirim notif WA ke ${target}...`);
  return await sendWA(target, message);
};
