'use client';

import { useState } from 'react';
import { Search, UserCheck, ShieldCheck, Calendar, Users, DollarSign, Award, Radio, Compass, Layers, AlertCircle } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/roblox-stats?username=${encodeURIComponent(username)}`);
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Có lỗi xảy ra');
      }

      setData(resData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> ROBLOX ACCOUNT INSPECTOR
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white uppercase">
          TRA CỨU <span className="text-amber-500">THỐNG KÊ ROBLOX</span>
        </h1>
        <p className="text-slate-400 text-sm">Xem chi tiết Chỉ số, Giá trị Vật phẩm, Lịch sử Badges & Trạng thái tài khoản</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
        <div className="relative flex-1">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập Roblox Username..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
          />
          <Search className="absolute left-3.5 top-3.5 text-slate-500 w-4 h-4" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-slate-950 font-bold px-6 py-3 rounded-xl transition text-sm flex items-center justify-center min-w-[110px]"
        >
          {loading ? 'Đang tải...' : 'Tra cứu'}
        </button>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-center max-w-lg mx-auto text-sm flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Main Stats Display */}
      {data && (
        <div className="space-y-6">
          {/* Main Profile Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <img
                src={data.user.avatarUrl}
                alt={data.user.username}
                className="w-28 h-28 rounded-2xl bg-slate-950 border-2 border-amber-500/40 object-cover shadow-lg"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-black text-white">{data.user.displayName}</h2>
                  {data.user.isBanned && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] px-2 py-0.5 rounded font-bold">BANNED</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">@{data.user.username} • User ID: {data.user.id}</p>
                <p className="text-xs text-slate-500 line-clamp-2 max-w-md pt-1">{data.user.description}</p>
                
                <div className="pt-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${
                    data.presence.isPlaying 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    <Radio className={`w-3 h-3 ${data.presence.isPlaying ? 'animate-ping text-green-400' : ''}`} />
                    {data.presence.statusText} {data.presence.gameTitle ? `(${data.presence.gameTitle})` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Creation Metadata */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-center md:text-right w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-amber-500" /> Ngày tham gia:
              </div>
              <p className="text-sm font-bold text-white">{data.user.created}</p>
              <p className="text-xs text-amber-400 font-semibold">{data.user.accountAgeDays.toLocaleString()} ngày tuổi</p>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Social Friends */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">Bạn bè</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xl font-black text-white">{data.social.friends} <span className="text-xs text-slate-500 font-normal">/ 200</span></p>
            </div>

            {/* Followers */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">Người theo dõi</span>
                <UserCheck className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xl font-black text-white">{data.social.followers.toLocaleString()}</p>
            </div>

            {/* Rolimons RAP */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">Giá trị Đồ (RAP)</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xl font-black text-amber-400">R$ {data.trading.rap.toLocaleString()}</p>
            </div>

            {/* Blox Fruits Sea */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">Blox Fruits Sea</span>
                <Compass className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-sm font-black text-green-400 truncate">{data.gameMilestones.bloxFruitsSea}</p>
            </div>
          </div>

          {/* Group & Badges Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Groups Joined */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-amber-500" /> Nhóm đã tham gia ({data.groups.length})
              </h3>
              <div className="space-y-2.5">
                {data.groups.length > 0 ? (
                  data.groups.map((g) => (
                    <div key={g.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{g.name}</p>
                        <p className="text-slate-500">Chức vụ: <span className="text-amber-400 font-medium">{g.role}</span></p>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md">
                        {g.memberCount.toLocaleString()} thành viên
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">Tài khoản này chưa tham gia nhóm nào.</p>
                )}
              </div>
            </div>

            {/* Recent Badges / Achievements */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-500" /> Huy hiệu / Thành tựu gần đây ({data.gameMilestones.totalBadges})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {data.recentBadges.length > 0 ? (
                  data.recentBadges.map((badge) => (
                    <div key={badge.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between text-xs">
                      <p className="font-bold text-slate-200 line-clamp-1">{badge.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{badge.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">Không tìm thấy huy hiệu công khai.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
