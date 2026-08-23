import { NextResponse } from 'next/server';

// Khởi tạo bộ nhớ lưu trữ tạm thời trên Server
if (!global.accountDataStore) {
  global.accountDataStore = {};
}

// POST: Roblox gửi dữ liệu lên
export async function POST(request) {
  try {
    const body = await request.json();
    const { key, userId, ...data } = body;

    if (!key || !userId) {
      return NextResponse.json({ success: false, error: 'Thiếu Key hoặc UserId' }, { status: 400 });
    }

    const cleanKey = key.trim();

    if (!global.accountDataStore[cleanKey]) {
      global.accountDataStore[cleanKey] = {};
    }

    global.accountDataStore[cleanKey][userId] = {
      userId,
      ...data,
      lastPing: Date.now(),
    };

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET: Web lấy dữ liệu về hiển thị
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ accounts: [] });
  }

  const cleanKey = key.trim();
  const userMap = global.accountDataStore?.[cleanKey] || {};
  const accounts = Object.values(userMap);

  return NextResponse.json({ accounts });
}
