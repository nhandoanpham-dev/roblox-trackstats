export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return Response.json({ error: 'Vui lòng nhập Username Roblox' }, { status: 400 });
  }

  try {
    const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
    });
    const userData = await userRes.json();

    if (!userData.data || userData.data.length === 0) {
      return Response.json({ error: 'Không tìm thấy tài khoản Roblox này' }, { status: 404 });
    }

    const userId = userData.data[0].id;

    const [detailsRes, friendsRes, followersRes, followingsRes, avatarRes] = await Promise.all([
      fetch(`https://users.roblox.com/v1/users/${userId}`),
      fetch(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
      fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`),
      fetch(`https://friends.roblox.com/v1/users/${userId}/followings/count`),
      fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`)
    ]);

    const details = await detailsRes.json();
    const friends = await friendsRes.json();
    const followers = await followersRes.json();
    const followings = await followingsRes.json();
    const avatarData = await avatarRes.json();

    return Response.json({
      id: userId,
      username: details.name,
      displayName: details.displayName,
      description: details.description || 'Không có mô tả.',
      created: details.created,
      isBanned: details.isBanned,
      friendsCount: friends.count || 0,
      followersCount: followers.count || 0,
      followingsCount: followings.count || 0,
      avatarUrl: avatarData.data?.[0]?.imageUrl || ''
    });
  } catch (err) {
    return Response.json({ error: 'Lỗi khi kết nối với máy chủ Roblox' }, { status: 500 });
  }
}
