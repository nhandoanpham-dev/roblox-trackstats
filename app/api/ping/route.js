import { NextResponse } from 'next/server';

if (!globalThis.nexusStore) {
  globalThis.nexusStore = {
    accounts: new Map(),
    commandQueues: new Map(),
    globalQueue: [], // Hàng đợi lệnh toàn cục cho tất cả các máy
    settings: { webhookUrl: '' }
  };
}

// Hàm phụ trợ gửi Discord Webhook
async function sendDiscordWebhook(url, title, description, color = 3066993) {
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: title,
          description: description,
          color: color,
          footer: { text: "Yeager Roblox Nexus v33 • Automated Telemetry" },
          timestamp: new Date().toISOString()
        }]
      })
    });
  } catch (err) {
    console.error("Lỗi gửi Discord Webhook:", err);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Nếu script gọi để lấy lệnh chờ (cả lệnh cá nhân lẫn lệnh Broadcast toàn cục)
    if (userId) {
      const strUserId = String(userId);
      let userQueue = globalThis.nexusStore.commandQueues.get(strUserId) || [];
      
      // Thêm các lệnh toàn cục chưa nhận
      if (globalThis.nexusStore.globalQueue.length > 0) {
        userQueue = [...userQueue, ...globalThis.nexusStore.globalQueue];
      }

      globalThis.nexusStore.commandQueues.set(strUserId, []);
      return NextResponse.json({ success: true, commands: userQueue });
    }

    const accountsList = Array.from(globalThis.nexusStore.accounts.values());
    return NextResponse.json({
      success: true,
      accounts: accountsList,
      serverTime: Date.now()
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, userId, username, gameName, stats, inventory, lastUpdated } = body;

    if (!userId || !username) {
      return NextResponse.json({ success: false, error: 'Missing userId or username' }, { status: 400 });
    }

    const strUserId = String(userId);
    const isNewAccount = !globalThis.nexusStore.accounts.has(strUserId);
    
    const accountData = {
      userId: strUserId,
      username,
      gameName: gameName || 'Blox Fruits',
      stats: stats || { level: 1, currency: 0 },
      inventory: inventory || { weapons: [] },
      lastUpdated: lastUpdated || Date.now()
    };

    globalThis.nexusStore.accounts.set(strUserId, accountData);

    // Nếu là tài khoản mới kết nối, bắn Webhook thông báo
    if (isNewAccount && globalThis.nexusStore.settings.webhookUrl) {
      await sendDiscordWebhook(
        globalThis.nexusStore.settings.webhookUrl,
        "🟢 Tài Khoản Roblox Đã Kết Nối",
        `**User:** ${username} (ID: ${userId})\n**Game:** ${gameName}\n**Level:** ${stats?.level || 1}`,
        5763719
      );
    }

    // Lấy lệnh chờ riêng cho user này
    let pendingCommands = globalThis.nexusStore.commandQueues.get(strUserId) || [];
    if (globalThis.nexusStore.globalQueue.length > 0) {
      pendingCommands = [...pendingCommands, ...globalThis.nexusStore.globalQueue];
      globalThis.nexusStore.globalQueue = []; // Clear global queue sau khi đã cấp phát
    }
    
    if (pendingCommands.length > 0) {
      globalThis.nexusStore.commandQueues.set(strUserId, []);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Synced successfully`,
      commands: pendingCommands
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// API RCON & Cấu hình Webhook từ Web Dashboard
export async function PUT(request) {
  try {
    const body = await request.json();
    const { action, userId, command, payload, webhookUrl } = body;

    // Cập nhật cấu hình Webhook
    if (action === 'update_webhook') {
      globalThis.nexusStore.settings.webhookUrl = webhookUrl || '';
      return NextResponse.json({ success: true, message: 'Đã cập nhật cấu hình Webhook thành công!' });
    }

    // Gửi lệnh Broadcast toàn cục cho tất cả máy
    if (action === 'broadcast') {
      if (!command) return;
      globalThis.nexusStore.globalQueue.push({ command, payload, time: Date.now() });
      return NextResponse.json({ success: true, message: `Đã phát lệnh Broadcast [${command}] tới toàn bộ hệ thống!` });
    }

    // Gửi lệnh cho 1 User cụ thể
    if (!userId || !command) {
      return NextResponse.json({ success: false, error: 'Missing userId or command' }, { status: 400 });
    }

    if (!globalThis.nexusStore.commandQueues.has(String(userId))) {
      globalThis.nexusStore.commandQueues.set(String(userId), []);
    }

    globalThis.nexusStore.commandQueues.get(String(userId)).push({ command, payload, time: Date.now() });

    return NextResponse.json({ success: true, message: `Đã đưa lệnh [${command}] vào hàng đợi cho User ${userId}` });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
