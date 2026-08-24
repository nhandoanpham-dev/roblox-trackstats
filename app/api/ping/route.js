import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

let globalAccounts = [
  {
    userId: 12345678,
    username: "Player_VIP_01",
    gameName: "Blox Fruits",
    lastUpdated: Date.now(),
    stats: { 
      level: 2550, 
      currency: 45000000, 
      bounty: 3500000,
      currentFruit: "Leopard / Kitsune" 
    },
    inventory: { 
      weapons: ["Cursed Dual Katana", "Soul Guitar", "Dark Blade", "Tushita"],
      accessories: ["Valkyrie Helm", "Leviathan Shield"]
    },
    serverInfo: { jobId: "job_a1b2c3_roblox_server", playersCount: 12 }
  }
];

let systemLogs = [
  { time: "Hệ Thống", text: "Khởi động Roblox Telemetry Hub v14 thành công." }
];

const VALID_KEYS = ["yeager2026", "admin123", "vipkey"];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key || !VALID_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Unauthorized: Khóa bảo mật không hợp lệ!' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      serverTime: Date.now(),
      accounts: globalAccounts,
      logs: systemLogs
    });
  } catch (err) {
    return NextResponse.json({ error: 'Lỗi server GET: ' + err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, action, accountData } = body;

    if (!key || !VALID_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Unauthorized: Sai khóa xác thực!' }, { status: 401 });
    }

    if (action === 'update_account' && accountData) {
      const index = globalAccounts.findIndex(acc => acc.userId === accountData.userId);
      const processedAccount = { ...accountData, lastUpdated: Date.now() };

      if (index !== -1) {
        globalAccounts[index] = processedAccount;
      } else {
        globalAccounts.push(processedAccount);
      }

      systemLogs.unshift({
        time: new Date().toLocaleTimeString(),
        text: `Đồng bộ dữ liệu tài khoản [${accountData.username}] - Lv.${accountData.stats?.level || 1}`
      });

      return NextResponse.json({ success: true, message: 'Cập nhật dữ liệu Roblox thành công!' });
    }

    return NextResponse.json({ success: false, message: 'Action không hợp lệ!' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Lỗi xử lý POST: ' + err.message }, { status: 500 });
  }
}
