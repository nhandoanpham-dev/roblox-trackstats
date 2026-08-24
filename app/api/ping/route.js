import { NextResponse } from 'next/server';

// Bộ nhớ tạm lưu trữ danh sách tài khoản và nhật ký (Trong môi trường production lớn, bạn có thể thay bằng MongoDB/Redis)
let globalAccounts = [
  {
    userId: 12345678,
    username: "Player_VIP_01",
    gameName: "Blox Fruits",
    lastUpdated: Date.now(),
    stats: { level: 2550, currency: 45000000, premiumCurrency: 12500, bounty: 3500000 },
    inventory: { weapons: ["Cursed Dual Katana", "Soul Guitar", "Dark Blade", "Tushita"] }
  },
  {
    userId: 87654321,
    username: "Dark_Slayer_99",
    gameName: "AOT: Revolution",
    lastUpdated: Date.now(),
    stats: { level: 120, currency: 1800000, premiumCurrency: 3400, bounty: 1200000 },
    inventory: { weapons: ["Ultimate Blade", "ODM Gear Mk.II", "Thunder Spears"] }
  }
];

let systemLogs = [
  { time: "Hệ Thống", text: "Khởi động Yeager Pannel Enterprise v11 Backend thành công." }
];

// Các Key bảo mật được phép truy cập hệ thống (Bạn có thể đổi tùy ý)
const VALID_KEYS = ["yeager2026", "admin123", "vipkey"];

// 1. GET: Cung cấp dữ liệu tài khoản và log cho giao diện Web khi nhập Key
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

// 2. POST: Nhận dữ liệu cập nhật từ Script Roblox hoặc công cụ quản lý shop
export async function POST(request) {
  try {
    const body = await request.json();
    const { key, action, accountData } = body;

    // Kiểm tra tính hợp lệ của Key
    if (!key || !VALID_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Unauthorized: Sai khóa xác thực!' }, { status: 401 });
    }

    // Hành động cập nhật thông tin tài khoản cày thuê
    if (action === 'update_account' && accountData) {
      const index = globalAccounts.findIndex(acc => acc.userId === accountData.userId);
      
      const processedAccount = {
        ...accountData,
        lastUpdated: Date.now()
      };

      if (index !== -1) {
        globalAccounts[index] = processedAccount;
      } else {
        globalAccounts.push(processedAccount);
      }

      // Thêm vào nhật ký hoạt động hệ thống
      const timeNow = new Date().toLocaleTimeString();
      systemLogs.unshift({
        time: timeNow,
        text: `Đồng bộ thành công tài khoản [${accountData.username}] - Game: ${accountData.gameName}`
      });
      if (systemLogs.length > 50) systemLogs.pop(); // Giới hạn 50 log gần nhất

      return NextResponse.json({ 
        success: true, 
        message: `Đã cập nhật dữ liệu cho ${accountData.username} thành công!` 
      });
    }

    return NextResponse.json({ success: false, message: 'Action không được hỗ trợ!' }, { status: 400 });

  } catch (err) {
    return NextResponse.json({ error: 'Lỗi xử lý POST: ' + err.message }, { status: 500 });
  }
}
