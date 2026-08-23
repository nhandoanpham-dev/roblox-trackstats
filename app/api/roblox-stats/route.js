export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return Response.json({ error: 'Vui lòng nhập Username Roblox' }, { status: 400 });
  }

  try {
    // 1. Chuyển Username -> User ID
    const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
    });

    if (!userRes.ok) {
      return Response.json({ error: 'Không thể kết nối với Roblox API. Thử lại sau!' }, { status: 502 });
    }

    const userData = await userRes.json();
    if (!userData.data || userData.data.length === 0) {
      return Response.json({ error: 'Không tìm thấy tài khoản Roblox này!' }, { status: 404 });
    }

    const userId = userData.data[0].id;

    // Hàm gọi API an toàn
    const fetchSafe = async (url, options = {}) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    };

    // 2. Lấy dữ liệu song song
    const [details, avatar, presence, friendsCount, followersCount, groups, badges, rolimons] = await Promise.all([
      fetchSafe(`https://users.roblox.com/v1/users/${userId}`),
      fetchSafe(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=352x352&format=Png`),
      fetchSafe('https://presence.roblox.com/v1/presence/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: [userId] }),
      }),
      fetchSafe(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
      fetchSafe(`https://friends.roblox.com/v1/users/${userId}/followers/count`),
      fetchSafe(`https://groups.roblox.com/v1/users/${userId}/groups/roles`),
      fetchSafe(`https://badges.roblox.com/v1/users/${userId}/badges?limit=50&sortOrder=Desc`),
      fetchSafe(`https://www.rolimons.com/playerapi/player/${userId}`)
    ]);

    if (!details) {
      return Response.json({ error: 'Tài khoản này bị khóa hoặc Roblox chặn truy cập.' }, { status: 400 });
    }

    const createdDate = new Date(details.created);
    const accountAgeDays = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));

    const userPresence = presence?.userPresences?.[0] || {};
    let statusText = 'Offline';
    let isPlaying = false;
    let gameTitle = '';

    if (userPresence.userPresenceType === 2) {
      statusText = 'Đang trong Game';
      isPlaying = true;
      gameTitle = userPresence.lastLocation || 'Trò chơi Roblox';
    } else if (userPresence.userPresenceType === 1) {
      statusText = 'Đang Online Roblox Website';
    }

    const allBadges = badges?.data || [];
    const hasSea3 = allBadges.some(b => b.name?.toLowerCase().includes('third sea'));
    const hasSea2 = allBadges.some(b => b.name?.toLowerCase().includes('second sea'));

    let bloxFruitsSea = 'Sea 1 (First Sea)';
    if (hasSea3) bloxFruitsSea = 'Sea 3 (Third Sea)';
    else if (hasSea2) bloxFruitsSea = 'Sea 2 (Second Sea)';

    return Response.json({
      success: true,
      user: {
        id: userId,
        username: details.name,
        displayName: details.displayName,
        description: details.description || 'Không có tiểu sử',
        created: createdDate.toLocaleDateString('vi-VN'),
        accountAgeDays,
        isBanned: details.isBanned || false,
        avatarUrl: avatar?.data?.[0]?.imageUrl || '',
      },
      presence: { statusText, isPlaying, gameTitle },
      social: {
        friends: friendsCount?.count || 0,
        followers: followersCount?.count || 0,
        followings: 0,
      },
      trading: {
        rap: rolimons?.rap || 0,
        value: rolimons?.value || 0,
      },
      gameMilestones: {
        bloxFruitsSea,
        totalBadges: allBadges.length,
      },
      groups: (groups?.data || []).slice(0, 6).map(g => ({
        id: g.group.id,
        name: g.group.name,
        role: g.role.name,
        memberCount: g.group.memberCount,
      })),
      recentBadges: allBadges.slice(0, 8).map(b => ({
        id: b.id,
        name: b.name,
        description: b.description || 'Thành tựu trong game',
      })),
    });
  } catch (err) {
    return Response.json({ error: 'Lỗi máy chủ khi tra cứu' }, { status: 500 });
  }
}
