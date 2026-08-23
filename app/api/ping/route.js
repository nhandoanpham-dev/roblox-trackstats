import { NextResponse } from 'next/server';

if (!global.multiGameStore) {
  global.multiGameStore = {};
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, userId, gameName, ...data } = body;

    if (!key || !userId) {
      return NextResponse.json({ success: false, error: 'Thiếu Key hoặc UserId' }, { status: 400 });
    }

    const cleanKey = key.trim();

    if (!global.multiGameStore[cleanKey]) {
      global.multiGameStore[cleanKey] = {};
    }

    global.multiGameStore[cleanKey][userId] = {
      userId,
      gameName: gameName || 'Khác',
      ...data,
      lastPing: Date.now(),
    };

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ accounts: [] });
  }

  const cleanKey = key.trim();
  const userMap = global.multiGameStore?.[cleanKey] || {};
  const accounts = Object.values(userMap);

  return NextResponse.json({ accounts });
}
