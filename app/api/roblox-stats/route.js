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
    const userData = await userRes.json();

    if (!userData.data || userData.data.length === 0) {
      return Response.json({ error: 'Không tìm thấy tài khoản Roblox này!' }, { status: 404 });
    }

    const userId = userData.data[0].id;

    // 2. Gọi API Roblox & Rolimons
    const [
      detailsRes,
      avatarRes,
      headshotRes,
      presenceRes,
      friendsCountRes,
      followersCountRes,
      followingsCountRes,
      groupsRes,
      badgesRes,
      rolimonsRes
    ] = await Promise.all([
      fetch(`https://users.roblox.com/v1/users/${userId}`),
      fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=352x352&format=Png`),
      fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`),
      fetch('https://presence.roblox.com/v1/presence/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: [userId] }),
      }),
      fetch(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
      fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`),
      fetch(`https://friends.roblox.com/v1/users/${userId}/followings/count`),
      fetch(`https://groups.roblox.com/v1/users/${userId}/groups/roles`),
      fetch(`https://badges.roblox.com/v1/users/${userId}/badges?limit=50&sortOrder=Desc`),
      fetch(`https://www.rolimons.com/playerapi/player/${userId}`).catch(() => null)
    ]);

    const details = await detailsRes.json();
    const avatar = await avatarRes.json();
    const headshot = await headshotRes.json();
    const presence = await presenceRes.json();
    const friendsCount = await friendsCountRes.json();
    const followersCount = await followersCountRes.json();
    const followingsCount = await followingsCountRes.json();
    const groups = await groupsRes.json();
    const badges = await badgesRes.json();

    let rolimonsData = { rap: 0, value: 0, limitedsCount: 0 };
    if (rolimonsRes && rolimonsRes.ok) {
      const roli = await rolimonsRes.json();
      if (roli.success) {
        rolimonsData = {
          rap: roli.rap || 0,
          value: roli.value || 0,
          limitedsCount: roli.limiteds_count || 0,
        };
      }
    }

    const createdDate = new Date(details.created);
    const accountAgeDays = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));

    const userPresence = presence.userPresences?.[0] || {};
    let statusText = 'Offline';
    let isPlaying = false;
    let gameTitle = '';

    if (userPresence.userPresenceType === 2) {
      statusText = 'Đang trong Game';
      isPlaying = true;
      gameTitle = userPresence.lastLocation || 'Trò chơi Roblox';
    } else if (userPresence.userPresenceType === 1) {
      statusText = 'Đang Online Roblox Website';
    } else if (userPresence.userPresenceType === 3) {
      statusText = 'Đang tạo Game (Roblox Studio)';
    }

    const allBadges = badges.data || [];
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
        avatarUrl: avatar.data?.[0]?.imageUrl || '',
        headshotUrl: headshot.data?.[0]?.imageUrl || '',
      },
      presence: {
        statusText,
        isPlaying,
        gameTitle,
      },
      social: {
        friends: friendsCount.count || 0,
        followers: followersCount.count || 0,
        followings: followingsCount.count || 0,
      },
      trading: rolimonsData,
      gameMilestones: {
        bloxFruitsSea,
        totalBadges: allBadges.length,
      },
      groups: (groups.data || []).slice(0, 6).map(g => ({
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
    return Response.json({ error: 'Lỗi khi kết nối với Server Roblox API' }, { status: 500 });
  }
}
