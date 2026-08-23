import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { action, userId, robloxCookie, newPassword } = await request.json();

    if (action === 'CHANGE_PASSWORD') {
      if (!robloxCookie || !newPassword) {
        return NextResponse.json({ success: false, message: 'Thiếu Cookie hoặc Mật khẩu mới!' }, { status: 400 });
      }

      const authRes = await fetch('https://auth.roblox.com/v2/passwords/change', {
        method: 'POST',
        headers: {
          'Cookie': `.ROBLOSECURITY=${robloxCookie}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword: "", newPassword: newPassword })
      });

      const csrfToken = authRes.headers.get('x-csrf-token');

      if (csrfToken) {
        const changeRes = await fetch('https://auth.roblox.com/v2/passwords/change', {
          method: 'POST',
          headers: {
            'Cookie': `.ROBLOSECURITY=${robloxCookie}`,
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ currentPassword: "", newPassword: newPassword })
        });

        if (changeRes.ok) {
          return NextResponse.json({ success: true, message: 'Đổi mật khẩu tài khoản thành công!' });
        }
      }

      return NextResponse.json({ success: false, message: 'Yêu cầu thất bại! Vui lòng kiểm tra lại Cookie.' });
    }

    return NextResponse.json({ success: false, message: 'Hành động không hợp lệ' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
