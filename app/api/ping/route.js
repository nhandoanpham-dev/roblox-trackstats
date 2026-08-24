import { NextResponse } from 'next/server';

// Bộ nhớ đệm Global chống tràn RAM và mất dữ liệu
if (!global.yeagerCoreData) {
  global.yeagerCoreData = {};
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { key, userId, username, gameName, stats, inventory } = payload;

    if (!key || !userId) {
      return NextResponse.json({ success: false, error: 'Thiếu định danh bảo mật!' }, { status: 400 });
    }

    const secureKey = key.trim();
    if (!global.yeagerCoreData[secureKey]) {
      global.yeagerCoreData[secureKey] = {};
    }

    // Cập nhật dữ liệu mượt mà, ghi đè chính xác không làm mất các trường cũ
    global.yeagerCoreData[secureKey][userId] = {
      userId,
      username,
      gameName: gameName || 'Roblox Global',
      stats: stats || { level: 1, currency: 0, premiumCurrency: 0, bounty: 0 },
      inventory: inventory || { weapons: [], items: [], accessories: [] },
      lastUpdated: Date.now(),
    };

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi đồng bộ máy chủ' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) return NextResponse.json({ accounts: [] });

  const secureKey = key.trim();
  const dataMap = global.yeagerCoreData[secureKey] || {};
  
  // Trả về danh sách tài khoản, tự động đẩy tài khoản đang online lên đầu
  const accounts = Object.values(dataMap).sort((a, b) => b.lastUpdated - a.lastUpdated);

  return NextResponse.json({ accounts });
}
