// Khởi tạo bộ nhớ tạm lưu danh sách tài khoản active
if (!globalThis.accountsStore) {
  globalThis.accountsStore = new Map();
}

// POST: Nhận dữ liệu cập nhật từ Script Lua trong Game Roblox
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      username,
      userId,
      gameName,
      placeId,
      jobId,
      level = 0,
      beli = 0,
      fruit = 'Không có',
      status = 'Farming',
      discordWebhook = ''
    } = body;

    if (!username || !userId) {
      return Response.json({ error: 'Thiếu Username hoặc UserId' }, { status: 400 });
    }

    const now = Date.now();
    const key = String(userId);

    const accountData = {
      username,
      userId: key,
      gameName: gameName || 'Roblox Game',
      placeId: placeId || 0,
      jobId: jobId || '',
      level: Number(level),
      beli: Number(beli),
      fruit: fruit || 'Không có',
      status: status || 'Farming',
      lastSeen: now,
      avatarUrl: `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`
    };

    // Lưu / Cập nhật vào Bộ nhớ
    globalThis.accountsStore.set(key, accountData);

    // Gửi thông báo tới Discord Webhook (nếu được cấu hình trong Script)
    if (discordWebhook && discordWebhook.startsWith('https://discord.com/api/webhooks/')) {
      fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: `📊 Báo cáo tài khoản: ${username}`,
            color: status === 'Offline' ? 15158332 : 3066993,
            thumbnail: { url: accountData.avatarUrl },
            fields: [
              { name: '👤 Tài khoản', value: `\`${username}\``, inline: true },
              { name: '🎮 Trò chơi', value: `${gameName}`, inline: true },
              { name: '⚡ Trạng thái', value: `\`${status}\``, inline: true },
              { name: '📈 Level', value: `${level.toLocaleString()}`, inline: true },
              { name: '💰 Beli / Tiền', value: `$${beli.toLocaleString()}`, inline: true },
              { name: '🍎 Trái / Trang bị', value: `${fruit}`, inline: true }
            ],
            footer: { text: 'Roblox Realtime Account Tracker' },
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(() => {});
    }

    return Response.json({ success: true, message: 'Đã cập nhật dữ liệu thành công', timestamp: now });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// GET: Lấy danh sách toàn bộ các tài khoản để hiển thị trên Dashboard
export async function GET() {
  try {
    const now = Date.now();
    const accounts = [];
    const STALE_TIMEOUT = 90 * 1000; // Sau 90s không nhận tín hiệu -> Coi như Offline/Văng game

    for (const [userId, acc] of globalThis.accountsStore.entries()) {
      const isOnline = (now - acc.lastSeen) < STALE_TIMEOUT;
      accounts.push({
        ...acc,
        isOnline,
        status: isOnline ? acc.status : 'Đã ngắt kết nối / Văng Game'
      });
    }

    accounts.sort((a, b) => b.lastSeen - a.lastSeen);

    return Response.json({
      success: true,
      count: accounts.length,
      onlineCount: accounts.filter(a => a.isOnline).length,
      accounts
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
