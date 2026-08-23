export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return Response.json({ error: 'Vui lòng nhập Username Roblox' }, { status: 400 });
  }

  try {
    // 1. Chuyển Username -> User ID qua RoProxy
    const userRes = await fetch('https://users.roproxy.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
    });

    if (!userRes.ok) {
      return Response.json({ error: 'Không thể kết nối đến máy chủ Roblox.' }, { status: 502 });
    }

    const userData = await userRes.json();
    if (!userData.data || userData.data.length === 0) {
      return Response.json({ error: 'Không tìm thấy Username Roblox này!' }, { status: 404 });
    }

    const userId = userData.data[0].id;

    const safeFetch = async (url, options = {}) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    };

    // 2. Lấy toàn bộ thông tin song song từ Roblox & Rolimons
    const [details, avatar, headshot, presence, friends, followers, followings, groups, badges, rolimons] = await Promise.all([
      safeFetch(`https://users.roproxy.com/v1/users/${userId}`),
      safeFetch(`https://thumbnails.roproxy.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png`),
      safeFetch(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`),
      safeFetch('https://presence.roproxy.com/v1/presence/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: [userId] }),
      }),
      safeFetch(`https://friends.roproxy.com/v1/users/${userId}/friends/count`),
      safeFetch(`https://friends.roproxy.com/v1/users/${userId}/followers/count`),
      safeFetch(`https://friends.roproxy.com/v1/users/${userId}/followings/count`),
      safeFetch(`https://groups.roproxy.com/v1/users/${userId}/groups/roles`),
      safeFetch(`https://badges.roproxy.com/v1/users/${userId}/badges?limit=100&sortOrder=Desc`),
      safeFetch(`https://www.rolimons.com/playerapi/player/${userId}`)
    ]);

    if (!details) {
      return Response.json({ error: 'Tài khoản này đã bị khóa hoặc cài đặt riêng tư.' }, { status: 400 });
    }

    const createdDate = new Date(details.created);
    const accountAgeDays = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
    const accountAgeYears = (accountAgeDays / 365).toFixed(1);

    // Xử lý Trạng thái Online
    const userPresence = presence?.userPresences?.[0] || {};
    let presenceType = userPresence.userPresenceType || 0; // 0: Offline, 1: Web, 2: InGame, 3: Studio
    let statusText = 'Offline';
    let gameTitle = userPresence.lastLocation || '';
    let placeId = userPresence.placeId || null;
    let jobId = userPresence.gameId || null;

    if (presenceType === 2) {
      statusText = 'Đang chơi Game';
    } else if (presenceType === 1) {
      statusText = 'Trực tuyến (Roblox Website)';
    } else if (presenceType === 3) {
      statusText = 'Đang trong Roblox Studio';
    }

    // Rolimons RAP & Value
    let rolimonsData = {
      rap: rolimons?.rap || 0,
      value: rolimons?.value || 0,
      limitedsCount: rolimons?.limiteds_count || 0,
      tradeStatus: rolimons?.privacy_enabled ? 'Ẩn kho đồ' : 'Công khai',
    };

    // Kiểm tra Tiến trình Blox Fruits qua Badges
    const allBadges = badges?.data || [];
    const hasSea3 = allBadges.some(b => b.name?.toLowerCase().includes('third sea') || b.name?.toLowerCase().includes('sea 3'));
    const hasSea2 = allBadges.some(b => b.name?.toLowerCase().includes('second sea') || b.name?.toLowerCase().includes('sea 2'));

    let bloxFruitsSea = 'Sea 1 (First Sea)';
    if (hasSea3) bloxFruitsSea = 'Sea 3 (Third Sea)';
    else if (hasSea2) bloxFruitsSea = 'Sea 2 (Second Sea)';

    // Lọc các Badge quan trọng
    const keyBadges = allBadges.filter(b => {
      const name = b.name?.toLowerCase() || '';
      return name.includes('sea') || name.includes('v4') || name.includes('godhuman') || name.includes('level') || name.includes('awakened');
    });

    return Response.json({
      success: true,
      user: {
        id: userId,
        username: details.name,
        displayName: details.displayName,
        description: details.description || 'Chưa cập nhật tiểu sử.',
        created: createdDate.toLocaleDateString('vi-VN'),
        accountAgeDays,
        accountAgeYears,
        isBanned: details.isBanned || false,
        avatarUrl: avatar?.data?.[0]?.imageUrl || '',
        headshotUrl: headshot?.data?.[0]?.imageUrl || '',
        profileUrl: `https://www.roblox.com/users/${userId}/profile`,
        rolimonsUrl: `https://www.rolimons.com/player/${userId}`,
      },
      presence: {
        statusText,
        presenceType,
        gameTitle,
        placeId,
        jobId,
      },
      social: {
        friends: friends?.count || 0,
        followers: followers?.count || 0,
        followings: followings?.count || 0,
      },
      trading: rolimonsData,
      gameMilestones: {
        bloxFruitsSea,
        totalBadges: allBadges.length,
        keyBadges: keyBadges.slice(0, 6),
      },
      groups: (groups?.data || []).map(g => ({
        id: g.group.id,
        name: g.group.name,
        role: g.role.name,
        memberCount: g.group.memberCount,
      })),
      badges: allBadges.slice(0, 24).map(b => ({
        id: b.id,
        name: b.name,
        description: b.description || 'Thành tựu trong Roblox',
      })),
    });
  } catch (err) {
    return Response.json({ error: 'Lỗi hệ thống khi xử lý dữ liệu.' }, { status: 500 });
  }
}
