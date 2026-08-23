import { NextResponse } from 'next/server';

if (!global.accountStore) {
  global.accountStore = new Map();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, username, userId, level, beli, fragments, fruit, placeId, jobId } = body;

    if (!key || !username || !userId) {
      return NextResponse.json({ error: 'Thiếu tham số' }, { status: 400 });
    }

    const accountData = {
      username,
      userId,
      level: level || 1,
      beli: beli || 0,
      fragments: fragments || 0,
      fruit: fruit || 'Không xác định',
      placeId: placeId || 0,
      jobId: jobId || '',
      lastPing: Date.now(),
    };

    if (!global.accountStore.has(key)) {
      global.accountStore.set(key, new Map());
    }
    
    global.accountStore.get(key).set(userId, accountData);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Cần nhập Key' }, { status: 400 });
  }

  const userMap = global.accountStore.get(key);
  if (!userMap) {
    return NextResponse.json({ accounts: [] });
  }

  return NextResponse.json({ accounts: Array.from(userMap.values()) });
}
