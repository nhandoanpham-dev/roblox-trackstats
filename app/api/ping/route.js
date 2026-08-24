import { NextResponse } from 'next/server';

if (!globalThis.nexusStore) {
  globalThis.nexusStore = {
    accounts: new Map(),
    commandQueues: new Map() // Lưu trữ lệnh chờ gửi xuống Script cho từng User/Key
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const userId = searchParams.get('userId');

    // Nếu script gọi GET để lấy lệnh chờ (Commands Queue)
    if (userId && globalThis.nexusStore.commandQueues.has(String(userId))) {
      const queue = globalThis.nexusStore.commandQueues.get(String(userId));
      globalThis.nexusStore.commandQueues.set(String(userId), []); // Xóa lệnh sau khi lấy
      return NextResponse.json({ success: true, commands: queue });
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

    const accountData = {
      userId: String(userId),
      username,
      gameName: gameName || 'Blox Fruits',
      stats: stats || { level: 1, currency: 0 },
      inventory: inventory || { weapons: [] },
      lastUpdated: lastUpdated || Date.now()
    };

    globalThis.nexusStore.accounts.set(String(userId), accountData);

    // Kiểm tra xem có lệnh nào đang chờ cho userId này không để trả về luôn trong POST response
    const pendingCommands = globalThis.nexusStore.commandQueues.get(String(userId)) || [];
    if (pendingCommands.length > 0) {
      globalThis.nexusStore.commandQueues.set(String(userId), []);
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

// API Phụ để Web Dashboard gửi lệnh xuống Script
export async function PUT(request) {
  try {
    const { userId, command, payload } = await request.json();
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
