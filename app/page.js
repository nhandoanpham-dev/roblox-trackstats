'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Radar, Settings, Gamepad2, Search, 
  Download, ShieldCheck, Palette, Activity, Music, Play, Pause, SkipForward,
  Lock, CheckCircle2, User, Sword, Shield, Coins, Sparkles, RefreshCw, Terminal, Cpu, Zap
} from 'lucide-react';

export default function YeagerRobloxNexus() {
  const [accessKey, setAccessKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [currentTab, setCurrentTab] = useState('radar');
  
  // Bộ lọc & Tìm kiếm
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Tùy chỉnh giao diện
  const [accentColor, setAccentColor] = useState('cyan');
  const [syncInterval, setSyncInterval] = useState(3000);
  const [activityLogs, setActivityLogs] = useState([]);
  const [toast, setToast] = useState(null);

  // Trình phát nhạc Lofi
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const playlist = [
    { title: "Cybernetic Dreams", artist: "Roblox Lofi Beats" },
    { title: "Blox Fruits Sea Breeze", artist: "Ambient Chill" },
    { title: "Yeager Telemetry Core", artist: "Synthwave Mix" }
  ];

  const colorThemes = {
    cyan: { primary: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500/30', glow: 'from-cyan-500/20 to-blue-500/0', badge: 'bg-cyan-500/10 text-cyan-300' },
    amber: { primary: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/30', glow: 'from-amber-500/20 to-orange-500/0', badge: 'bg-amber-500/10 text-amber-300' },
    purple: { primary: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/30', glow: 'from-purple-500/20 to-pink-500/0', badge: 'bg-purple-500/10 text-purple-300' },
    emerald: { primary: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/30', glow: 'from-emerald-500/20 to-teal-500/0', badge: 'bg-emerald-500/10 text-emerald-300' },
  };
  const theme = colorThemes[accentColor];

  // Đồng bộ Real-time API
  useEffect(() => {
    if (!activeKey) return;
    let isMounted = true;

    const fetchSync = async () => {
      try {
        const res = await fetch(`/api/ping?key=${encodeURIComponent(activeKey)}`);
        const data = await res.json();
        if (isMounted && data.accounts) {
          setAccounts(data.accounts);
          const timeNow = new Date().toLocaleTimeString();
          setActivityLogs(prev => [
            { time: timeNow, text: `Đồng bộ thành công telemetry từ ${data.accounts.length} thiết bị Roblox.` },
            ...prev.slice(0, 30)
          ]);
        }
      } catch (err) {
        console.error("Lỗi đồng bộ API:", err);
      }
    };

    fetchSync();
    const interval = setInterval(fetchSync, syncInterval);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeKey, syncInterval]);

  const handleConnect = (e) => {
    e.preventDefault();
    if (accessKey.trim()) {
      setActiveKey(accessKey.trim());
      showToast('Xác thực Key bảo mật thành công!');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(accounts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Roblox_Telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất toàn bộ dữ liệu JSON!');
  };

  const gameCategories = ['ALL', 'Blox Fruits', 'AOT: Revolution', 'King Legacy', 'Fisch'];

  const metrics = useMemo(() => {
    const totalAccs = accounts.length;
    const onlineAccs = accounts.filter(a => (Date.now() - a.lastUpdated) < 20000).length;
    const maxLevel = accounts.reduce((max, a) => Math.max(max, a.stats?.level || 1), 1);
    const totalCurrency = accounts.reduce((sum, a) => sum + (a.stats?.currency || 0), 0);
    return { totalAccs, onlineAccs, maxLevel, totalCurrency };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const matchGame = selectedGame === 'ALL' || acc.gameName?.includes(selectedGame);
      const matchSearch = acc.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          String(acc.userId).includes(searchQuery);
      return matchGame && matchSearch;
    });
  }, [accounts, selectedGame, searchQuery]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Dynamic Ambient Background Glows */}
      <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br ${theme.glow} rounded-full blur-[180px] pointer-events-none transition-all duration-700`}></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0b0f19]/90 border border-slate-700/80 backdrop-blur-xl text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className={`w-5 h-5 ${theme.primary}`} />
          <span className="text-xs font-bold tracking-wide">{toast}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col gap-6 relative z-10">

        {/* TOP HEADER NAVIGATION */}
        <header className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl flex items-center justify-center shadow-inner border ${theme.border}`}>
              <Cpu className={`w-6 h-6 ${theme.primary} animate-pulse`} />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-widest uppercase">ROBLOX TELEMETRY HUB</h1>
              <p className={`text-[10px] ${theme.primary} font-bold tracking-wider`}>YEAGER NEXUS v15 ULTIMATE</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-[#050811] p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'radar', label: 'Radar Trực Tuyến', icon: Radar },
              { id: 'dashboard', label: 'Thống Kê', icon: LayoutDashboard },
              { id: 'logs', label: 'Nhật Ký Hệ Thống', icon: Terminal }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive ? `${theme.bg} text-slate-950 shadow-lg` : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Tools: Theme Picker & Export */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#050811] border border-slate-800 rounded-xl p-1">
              <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {['cyan', 'amber', 'purple', 'emerald'].map(col => (
                <button
                  key={col}
                  onClick={() => setAccentColor(col)}
                  className={`w-4 h-4 rounded-full transition-transform ${accentColor === col ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-50 hover:opacity-100'} ${
                    col === 'cyan' ? 'bg-cyan-400' : col === 'amber' ? 'bg-amber-400' : col === 'purple' ? 'bg-purple-400' : 'bg-emerald-400'
                  }`}
                />
              ))}
            </div>

            <button onClick={handleExportData} className="bg-[#050811] hover:bg-slate-900 border border-slate-800 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow">
              <Download className={`w-3.5 h-3.5 ${theme.primary}`} /> Export
            </button>
          </div>
        </header>

        {/* KEY AUTHENTICATION BANNER (IF NOT CONNECTED) */}
        {!activeKey && (
          <div className="bg-gradient-to-r from-[#0b0f19] to-[#0f172a] border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">YÊU CẦU XÁC THỰC BẢO MẬT</h3>
                <p className="text-xs text-slate-400">Nhập Key bảo mật để kết nối luồng dữ liệu thời gian thực từ Lua Script Roblox.</p>
              </div>
            </div>
            <form onSubmit={handleConnect} className="flex items-center gap-2 w-full md:w-auto">
              <input 
                type="password"
                placeholder="Nhập Key (VD: yeager2026)..."
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="bg-[#030712] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none w-full md:w-64"
              />
              <button type="submit" className={`px-5 py-2.5 ${theme.bg} text-slate-950 font-bold text-xs rounded-xl shadow-lg whitespace-nowrap`}>
                Xác Thực
              </button>
            </form>
          </div>
        )}

        {/* TAB 1: RADAR TRỰC TUYẾN & KHO ĐỒ */}
        {currentTab === 'radar' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-[#0b0f19]/70 backdrop-blur-xl p-4 rounded-3xl border border-slate-800/80 shadow-xl">
              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 lg:pb-0 scrollbar-none">
                {gameCategories.map(game => (
                  <button
                    key={game}
                    onClick={() => setSelectedGame(game)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap flex items-center gap-2 ${
                      selectedGame === game ? `${theme.bg} text-slate-950 shadow-md` : 'bg-[#030712] text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" /> {game === 'ALL' ? 'Tất Cả Game' : game}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Tìm tên nhân vật hoặc User ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Accounts Grid */}
            {!activeKey ? (
              <div className="h-[45vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#0b0f19]/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md">
                <Lock className="w-10 h-10 text-slate-600 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-300">HỆ THỐNG ĐANG BỊ KHÓA</h3>
                <p className="text-xs text-slate-500">Vui lòng nhập Key bảo mật ở phía trên để mở khóa Radar.</p>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="h-[45vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#0b0f19]/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md">
                <RefreshCw className="w-10 h-10 text-slate-500 animate-spin" />
                <h3 className="text-sm font-bold text-slate-300">CHƯA CÓ TÍN HIỆU TỪ GAME</h3>
                <p className="text-xs text-slate-500">Đang chờ Lua Script gửi dữ liệu telemetry từ Roblox...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAccounts.map(acc => {
                  const isOnline = (Date.now() - acc.lastUpdated) < 20000;
                  return (
                    <div key={acc.userId} className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl space-y-4 hover:border-slate-700 transition group relative overflow-hidden">
                      
                      {/* Glow Header Accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.glow}`}></div>

                      {/* User Info Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} 
                            className="w-12 h-12 rounded-2xl bg-[#030712] border border-slate-700 object-cover shadow-lg group-hover:scale-105 transition" 
                          />
                          <div>
                            <h3 className="font-black text-white text-xs tracking-wide">{acc.username}</h3>
                            <span className={`text-[10px] ${theme.primary} font-bold flex items-center gap-1 mt-0.5`}>
                              <Gamepad2 className="w-3 h-3" /> {acc.gameName}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-black tracking-wider ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                          {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-[#030712]/80 p-3 rounded-2xl border border-slate-800/80">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Cấp Độ Nhân Vật</p>
                          <p className="font-black text-white text-base mt-0.5">Lv.{acc.stats?.level || 1}</p>
                        </div>
                        <div className="bg-[#030712]/80 p-3 rounded-2xl border border-slate-800/80">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Tiền / Beli</p>
                          <p className="font-black text-emerald-400 text-base mt-0.5">${acc.stats?.currency?.toLocaleString() || 0}</p>
                        </div>
                      </div>

                      {/* Weapons / Inventory */}
                      {acc.inventory?.weapons && (
                        <div className="bg-[#030712]/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Sword className="w-3.5 h-3.5 text-amber-400" /> Kho Vũ Khí / Vật Phẩm:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {acc.inventory.weapons.map((w, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-900 border border-slate-800/80 text-slate-300 px-2.5 py-1 rounded-xl font-medium shadow-sm">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Details */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-500">
                        <span>ID: {acc.userId}</span>
                        <span>Synced: {new Date(acc.lastUpdated).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: THỐNG KÊ (DASHBOARD) */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Tổng Thiết Bị</p>
                <p className="text-4xl font-black text-white">{metrics.totalAccs}</p>
                <p className={`text-xs ${theme.primary} font-bold`}>🟢 {metrics.onlineAccs} đang hoạt động</p>
              </div>
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Cấp Độ Cao Nhất</p>
                <p className={`text-4xl font-black ${theme.primary}`}>Lv.{metrics.maxLevel}</p>
                <p className="text-xs text-slate-400">Đỉnh cao toàn hệ thống</p>
              </div>
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Tổng Tài Nguyên / Beli</p>
                <p className="text-4xl font-black text-cyan-400">${metrics.totalCurrency.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Tổng tích lũy game thủ</p>
              </div>
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Tần Suất Sync</p>
                <p className="text-4xl font-black text-purple-400">{syncInterval / 1000}s</p>
                <p className="text-xs text-slate-400">Độ trễ thấp tối đa</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NHẬT KÝ HỆ THỐNG (LOGS) */}
        {currentTab === 'logs' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                <Terminal className={`w-4 h-4 ${theme.primary}`} /> Nhật Ký Telemetry Thời Gian Thực
              </h3>
              <div className="bg-[#030712] border border-slate-900 rounded-2xl p-4 h-96 overflow-y-auto space-y-2 font-mono text-xs shadow-inner">
                {activityLogs.length === 0 ? (
                  <p className="text-slate-600 text-center py-32">Chưa có sự kiện nào được ghi nhận.</p>
                ) : (
                  activityLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-4 text-slate-300 border-b border-slate-900/60 pb-2">
                      <span className="text-slate-500">[{log.time}]</span>
                      <span className="flex-1 text-cyan-300">{log.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FLOATING MUSIC PLAYER */}
      <div className="fixed bottom-5 right-5 z-40 bg-[#0b0f19]/90 border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-2xl flex items-center gap-3.5 w-80">
        <div className={`w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center ${theme.primary}`}>
          <Music className={`w-5 h-5 ${isPlayingMusic ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-black text-white truncate">{playlist[currentTrackIndex].title}</p>
          <p className="text-[10px] text-slate-400 truncate">{playlist[currentTrackIndex].artist}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setIsPlayingMusic(!isPlayingMusic)} className={`w-8 h-8 ${theme.bg} text-slate-950 rounded-xl flex items-center justify-center shadow`}>
            {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
          </button>
          <button onClick={() => setCurrentTrackIndex((currentTrackIndex + 1) % playlist.length)} className="w-8 h-8 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center border border-slate-800">
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
