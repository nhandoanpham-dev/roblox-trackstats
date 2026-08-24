import { NextResponse } from 'next/server';

// Khởi tạo bộ nhớ tạm toàn cục cho Serverless
if (!globalThis.nexusStore) {
  globalThis.nexusStore = {
    accounts: new Map()
  };
}

export async function GET(request) {
  try {
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

    // Lưu trữ dữ liệu telemetry chi tiết của tài khoản
    const accountData = {
      userId,
      username,
      gameName: gameName || 'Blox Fruits',
      stats: stats || { level: 1, currency: 0 },
      inventory: inventory || { weapons: [] },
      lastUpdated: lastUpdated || Date.now()
    };

    globalThis.nexusStore.accounts.set(String(userId), accountData);

    return NextResponse.json({ 
      success: true, 
      message: `Telemetry synced successfully for ${username}` 
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
