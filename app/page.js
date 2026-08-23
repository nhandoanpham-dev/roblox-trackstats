'use client';

import { useState } from 'react';
import { 
  Search, UserCheck, Calendar, Users, DollarSign, Award, Radio, 
  Compass, Layers, AlertCircle, Sparkles, ExternalLink, Copy, Check, 
  Gamepad2, ShieldCheck, Terminal, Globe, UserPlus 
} from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/tracker?username=${encodeURIComponent(username.trim())}`);
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Hệ thống đang khởi động lại API, vui lòng thử lại sau 3 giây!');
      }

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Có lỗi xảy ra khi tra cứu');
      }

      setData(resData);
      setActiveTab('overview');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 px-4 py-8 md:py-12 selection:bg-amber-500 selection:text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg shadow-amber-500/5">
            <Sparkles className="w-4 h-4 text-amber-400" /> KURINIAN TRACKSTAT INSPECTOR
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">
            TRA CỨU <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">THỐNG KÊ ROBLOX</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Kiểm tra thông tin chi tiết Tài khoản, Tiến trình Blox Fruits, RAP Rolimons & Nhóm Roblox.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập Username Roblox (vd: huunghi124)..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm shadow-inner transition"
            />
            <Search className="absolute left-3.5 top-4 text-slate-500 w-4 h-4" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 text-slate-950 font-extrabold px-7 py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {loading ? 'Đang tải...' : 'Tra cứu'}
          </button>
        </form>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-center max-w-xl mx-auto text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Results Container */}
        {data && (
          <div className="space-y-6">
            
            {/* Top Profile Banner Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <img
                    src={data.user.avatarUrl || data.user.headshotUrl}
                    alt={data.user.username}
                    className="w-32 h-32 rounded-2xl bg-slate-950 border-2 border-amber-500/40 object-cover shadow-xl"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-2xl font-black text-white">{data.user.displayName}</h2>
                      {data.user.isBanned && (
                        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] px-2 py-0.5 rounded font-bold">BANNED</span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400 font-medium">
                      @{data.user.username} • ID: <span className="text-slate-200 font-mono">{data.user.id}</span>
                    </p>

                    {/* Online Status Badge */}
                    <div>
                      <span className={`inline-flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full font-bold ${
                        data.presence.presenceType === 2 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse' 
                          : data.presence.presenceType === 1
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <Radio className="w-3.5 h-3.5" />
                        {data.presence.statusText} {data.presence.gameTitle ? `(${data.presence.gameTitle})` : ''}
                      </span>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        onClick={() => copyToClipboard(data.user.id.toString(), 'id')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId ? 'Đã chép ID' : 'Sao chép ID'}
                      </button>

                      <a
                        href={data.user.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-1.5 transition"
                      >
                        <Globe className="w-3.5 h-3.5" /> Roblox Profile <ExternalLink className="w-3 h-3" />
                      </a>

                      <a
                        href={data.user.rolimonsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs px-3 py-1.5 rounded-lg border border-purple-500/30 flex items-center gap-1.5 transition"
                      >
                        <DollarSign className="w-3.5 h-3.5" /> Rolimons <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Registration Metadata */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-center md:text-right w-full md:w-auto">
                  <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Tham gia ngày:
                  </div>
                  <p className="text-sm font-bold text-white">{data.user.created}</p>
                  <p className="text-xs text-amber-400 font-semibold">{data.user.accountAgeDays.toLocaleString()} ngày ({data.user.accountAgeYears} năm)</p>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION BAR */}
            <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1">
              {[
                { id: 'overview', label: '📊 Tổng quan', icon: Layers },
                { id: 'bloxfruits', label: '⚔️ Blox Fruits & Badges', icon: Gamepad2 },
                { id: 'rolimons', label: '💎 Rolimons RAP', icon: DollarSign },
                { id: 'groups', label: '🏰 Nhóm Roblox', icon: Users },
                { id: 'tools', label: '⚡ Công cụ', icon: Terminal },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Bạn bè</p>
                    <p className="text-2xl font-black text-white mt-1">{data.social.friends} <span className="text-xs text-slate-500 font-normal">/ 200</span></p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Người theo dõi</p>
                    <p className="text-2xl font-black text-white mt-1">{data.social.followers.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Đang theo dõi</p>
                    <p className="text-2xl font-black text-white mt-1">{data.social.followings.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Blox Fruits Sea</p>
                    <p className="text-sm font-black text-emerald-400 mt-2 truncate">{data.gameMilestones.bloxFruitsSea}</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiểu sử (Bio)</h3>
                  <p className="text-sm text-slate-200 whitespace-pre-wrap bg-slate-950/60 border border-slate-800 rounded-xl p-4 italic">
                    "{data.user.description}"
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: BLOX FRUITS & BADGES */}
            {activeTab === 'bloxfruits' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                      <Compass className="w-4 h-4 text-amber-400" /> Tiến trình Blox Fruits
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold">
                      {data.gameMilestones.bloxFruitsSea}
                    </span>
                  </div>

                  {data.gameMilestones.keyBadges.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {data.gameMilestones.keyBadges.map((badge) => (
                        <div key={badge.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1">
                          <p className="font-bold text-xs text-amber-400">{badge.name}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-2">{badge.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Chưa phát hiện badge quan trọng công khai.</p>
                  )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-400" /> Huy hiệu vừa đạt được ({data.gameMilestones.totalBadges})
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {data.badges.map((b) => (
                      <div key={b.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between text-xs space-y-1">
                        <p className="font-bold text-slate-200 line-clamp-1">{b.name}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-2">{b.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ROLIMONS & RAP */}
            {activeTab === 'rolimons' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase">Tổng RAP</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">R$ {data.trading.rap.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase">Giá trị Đồ (Value)</p>
                    <p className="text-2xl font-black text-purple-400 mt-1">R$ {data.trading.value.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase">Trạng thái Kho Đồ</p>
                    <p className="text-lg font-bold text-white mt-1">{data.trading.tradeStatus}</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
                  <p className="text-xs text-slate-400">Xem bảng xếp hạng & chi tiết các vật phẩm Limited của người chơi này trên Rolimons:</p>
                  <a
                    href={data.user.rolimonsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/20"
                  >
                    Xem trên Rolimons.com <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* TAB 4: GROUPS */}
            {activeTab === 'groups' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-amber-400" /> Nhóm đã tham gia ({data.groups.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {data.groups.map((g) => (
                    <div key={g.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                      <p className="font-bold text-sm text-white truncate">{g.name}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Chức vụ:</span>
                        <span className="text-amber-400 font-bold">{g.role}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800/80">
                        <span className="text-slate-500">Thành viên:</span>
                        <span className="text-slate-300 font-mono">{g.memberCount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: TOOLS */}
            {activeTab === 'tools' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Terminal className="w-4 h-4 text-amber-400" /> Công cụ Nhanh cho Người chơi / Middleman
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-300">1. Script Teleport đến cùng Server Game (Nếu đang mở Join):</p>
                    <div className="relative">
                      <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-amber-400 font-mono overflow-x-auto">
                        {data.presence.jobId 
                          ? `game:GetService("TeleportService"):TeleportToPlaceInstance(${data.presence.placeId}, "${data.presence.jobId}", game.Players.LocalPlayer)` 
                          : `-- Người chơi hiện không ở trong Game hoặc ẩn Server Join`}
                      </pre>
                      {data.presence.jobId && (
                        <button
                          onClick={() => copyToClipboard(`game:GetService("TeleportService"):TeleportToPlaceInstance(${data.presence.placeId}, "${data.presence.jobId}", game.Players.LocalPlayer)`, 'script')}
                          className="absolute right-3 top-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1"
                        >
                          {copiedScript ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedScript ? 'Đã sao chép' : 'Sao chép Script'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}
