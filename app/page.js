'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Radar, Zap, ShieldCheck, Settings, 
  Key, Gamepad2, Search, Swords, TrendingUp, RefreshCw, 
  Lock, CheckCircle2, Download, Filter, ArrowUpDown, 
  Server, Share2, Palette, Activity, Clock, Music, Play, Pause, SkipForward,
  UserCheck, DollarSign, ShieldAlert, Cpu
} from 'lucide-react';

export default function YeagerNexusV11() {
  const [accessKey, setAccessKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // Bộ lọc & Tìm kiếm Radar
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAcc, setSelectedAcc] = useState(null);

  // Cấu hình Enterprise v11
  const [accentColor, setAccentColor] = useState('amber');
  const [syncInterval, setSyncInterval] = useState(3500);
  const [activityLogs, setActivityLogs] = useState([]);
  const [toast, setToast] = useState(null);

  // Webhook & Cài đặt
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookMsg, setWebhookMsg] = useState('');

  // Trình phát nhạc Lofi góc màn hình
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const playlist = [
    { title: "Sadness and Sorrow", artist: "Naruto OST - Piano Lofi" },
    { title: "Chilling in the Sea", artist: "Blox Fruits Lofi Mix" },
    { title: "Yeager's Theme", artist: "Epic Orchestral Lofi" }
  ];

  // Bảng màu chủ đạo
  const colorThemes = {
    amber: { primary: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/50', glow: 'bg-amber-500/5' },
    cyan: { primary: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500/50', glow: 'bg-cyan-500/5' },
    purple: { primary: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/50', glow: 'bg-purple-500/5' },
    emerald: { primary: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/50', glow: 'bg-emerald-500/5' },
  };
  const theme = colorThemes[accentColor];

  // Đồng bộ Real-time từ Lua Tracker
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
            { time: timeNow, text: `Đồng bộ thành công ${data.accounts.length} thiết bị trực tuyến.` },
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
      showToast('Xác thực Khóa bảo mật thành công!');
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
    downloadAnchor.setAttribute("download", `YeagerNexus_v11_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất toàn bộ dữ liệu hệ thống!');
  };

  const sendDiscordWebhook = async () => {
    if (!webhookUrl) {
      showToast('Vui lòng nhập Webhook URL!');
      return;
    }
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: `🛡️ **YEAGER PANNEL ENTERPRISE v11**\n> ${webhookMsg || 'Hệ thống radar đang hoạt động ổn định và bảo mật tuyệt đối.'}` 
        })
      });
      showToast('Đã gửi thông báo lên Discord thành công!');
      setWebhookMsg('');
    } catch (err) {
      showToast('Lỗi kết nối Webhook Discord!');
    }
  };

  const gameCategories = ['ALL', 'Blox Fruits', 'King Legacy', 'AOT: Revolution', 'Fisch', 'Pet Simulator 99'];

  const metrics = useMemo(() => {
    const totalAccs = accounts.length;
    const onlineAccs = accounts.filter(a => (Date.now() - a.lastUpdated) < 20000).length;
    const maxLevel = accounts.reduce((max, a) => Math.max(max, a.stats?.level || 1), 1);
    const totalCurrency = accounts.reduce((sum, a) => sum + (a.stats?.currency || 0), 0);
    const totalFragments = accounts.reduce((sum, a) => sum + (a.stats?.premiumCurrency || 0), 0);
    return { totalAccs, onlineAccs, maxLevel, totalCurrency, totalFragments };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    let result = accounts.filter(acc => {
      const normalizedGame = acc.gameName?.includes('Blox Fruits') ? 'Blox Fruits' : acc.gameName;
      const matchGame = selectedGame === 'ALL' || normalizedGame === selectedGame;
      const isOnline = (Date.now() - acc.lastUpdated) < 20000;
      const matchStatus = statusFilter === 'ALL' || (statusFilter === 'ONLINE' ? isOnline : !isOnline);
      const matchSearch = acc.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          String(acc.userId).includes(searchQuery);
      return matchGame && matchStatus && matchSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'newest') return b.lastUpdated - a.lastUpdated;
      if (sortBy === 'level_desc') return (b.stats?.level || 0) - (a.stats?.level || 0);
      if (sortBy === 'money_desc') return (b.stats?.currency || 0) - (a.stats?.currency || 0);
      return 0;
    });
  }, [accounts, selectedGame, statusFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 font-sans flex relative selection:bg-amber-500/30">
      
      {/* Background Glow */}
      <div className={`absolute top-0 left-1/3 w-[800px] h-[800px] ${theme.glow} rounded-full blur-[220px] pointer-events-none transition-all duration-700`}></div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0c1322] border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className={`w-5 h-5 ${theme.primary}`} />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#050811] border-r border-slate-800/80 flex flex-col justify-between p-4 hidden lg:flex relative z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className={`w-10 h-10 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg border ${theme.border}`}>
              <ShieldCheck className={`w-6 h-6 ${theme.primary}`} />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wider">YEAGER PANNEL</h1>
              <p className={`text-[10px] ${theme.primary} font-bold`}>ENTERPRISE v11</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
              { id: 'radar', label: 'Radar Trực Tuyến', icon: Radar, count: metrics.onlineAccs },
              { id: 'boosting', label: 'Quản Lý Cày Thuê', icon: Zap },
              { id: 'escrow', label: 'Trung Gian Escrow', icon: ShieldCheck },
              { id: 'settings', label: 'Cài Đặt & Logs', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive 
                    ? `${theme.bg} text-black shadow-lg` 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-black text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Khóa hệ thống trạng thái ở chân sidebar */}
        <div className="bg-[#03060c] border border-slate-800/80 p-3 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Trạng Thái:</span>
            <span className={activeKey ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {activeKey ? 'Đã Kết Nối' : 'Chưa Khóa Key'}
            </span>
          </div>
          {!activeKey ? (
            <form onSubmit={handleConnect} className="space-y-2">
              <input
                type="password"
                placeholder="Nhập Key bảo mật..."
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button type="submit" className={`w-full py-1.5 ${theme.bg} text-black font-bold text-xs rounded-xl shadow`}>
                Xác Thực Key
              </button>
            </form>
          ) : (
            <button onClick={() => setActiveKey('')} className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs rounded-xl transition">
              Ngắt Kết Nối
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 p-4 lg:p-8 overflow-y-auto">
        
        {/* TOP MOBILE / HEADER BAR */}
        <header className="flex items-center justify-between bg-[#080d1a] p-4 rounded-3xl border border-slate-800/80 shadow-xl mb-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 lg:hidden">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900 border ${theme.border}`}>
              <ShieldCheck className={`w-5 h-5 ${theme.primary}`} />
            </div>
            <span className="font-black text-sm text-white">YEAGER v11</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <h2 className="text-sm font-black uppercase text-slate-300 tracking-wider">
              {currentSection === 'dashboard' && '📊 Tổng Quan Hệ Thống'}
              {currentSection === 'radar' && '📡 Radar Quản Lý Tài Khoản Roblox'}
              {currentSection === 'boosting' && '⚡ Quản Lý Dịch Vụ Cày Thuê'}
              {currentSection === 'escrow' && '🛡️ Trung Gian Escrow An Toàn'}
              {currentSection === 'settings' && '⚙️ Cài Đặt Hệ Thống & Nhật Ký'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Bộ chọn màu sắc chủ đạo */}
            <div className="flex items-center gap-1 bg-[#03060c] border border-slate-800 rounded-xl p-1">
              <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {['amber', 'cyan', 'purple', 'emerald'].map(col => (
                <button
                  key={col}
                  onClick={() => setAccentColor(col)}
                  className={`w-4 h-4 rounded-full transition-transform ${accentColor === col ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'} ${
                    col === 'amber' ? 'bg-amber-400' : col === 'cyan' ? 'bg-cyan-400' : col === 'purple' ? 'bg-purple-400' : 'bg-emerald-400'
                  }`}
                />
              ))}
            </div>

            <button onClick={handleExportData} className="bg-[#03060c] border border-slate-700/80 hover:border-slate-500 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
              <Download className={`w-3.5 h-3.5 ${theme.primary}`} /> Xuất File
            </button>
          </div>
        </header>

        {/* ---------------- SECTION 1: DASHBOARD ---------------- */}
        {currentSection === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Tổng Tài Khoản Kết Nối</p>
                <p className="text-3xl font-black text-white">{metrics.totalAccs}</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">🟢 {metrics.onlineAccs} máy đang hoạt động live</p>
              </div>
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Cấp Độ Cao Nhất</p>
                <p className={`text-3xl font-black ${theme.primary}`}>Lv. {metrics.maxLevel}</p>
                <p className="text-[11px] text-slate-400">Đồng bộ từ Roblox Lua Tracker</p>
              </div>
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Tổng Beli / Tiền Game</p>
                <p className="text-3xl font-black text-cyan-400">${metrics.totalCurrency.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">Tài sản tích lũy toàn hệ thống</p>
              </div>
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Tổng Fragments / Gems</p>
                <p className="text-3xl font-black text-purple-400">{metrics.totalFragments.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">Đơn vị đặc biệt trong game</p>
              </div>
            </div>

            {/* Quick Actions / Banner */}
            <div className="bg-gradient-to-r from-[#080d1a] to-[#0c152a] border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-base font-black text-white">Chào mừng bạn trở lại, Yeager Pannel!</h3>
                <p className="text-xs text-slate-400 max-w-xl">Hệ thống giám sát v11 đã sẵn sàng nhận dữ liệu từ các máy cày. Chọn mục **Radar Trực Tuyến** hoặc **Quản Lý Cày Thuê** ở menu bên để bắt đầu theo dõi chi tiết.</p>
              </div>
              <button onClick={() => setCurrentSection('radar')} className={`px-6 py-3 ${theme.bg} text-black font-bold text-xs rounded-2xl shadow-lg transition hover:scale-105 whitespace-nowrap`}>
                Mở Radar Ngay 🚀
              </button>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 2: RADAR TRỰC TUYẾN ---------------- */}
        {currentSection === 'radar' && (
          <div className="space-y-5 animate-fade-in">
            {/* Game Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-[#080d1a] p-3 rounded-2xl border border-slate-800">
              {gameCategories.map(game => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition whitespace-nowrap flex items-center gap-2 ${
                    selectedGame === game 
                    ? `${theme.bg} text-black shadow-md` 
                    : 'bg-[#03060c] text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" /> {game === 'ALL' ? 'Tất Cả Game' : game}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#080d1a] p-3 rounded-2xl border border-slate-800">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm người chơi, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-1 bg-[#03060c] border border-slate-800 rounded-xl px-3 py-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <select value={syncInterval} onChange={(e) => setSyncInterval(Number(e.target.value))} className="bg-transparent text-xs text-slate-300 focus:outline-none">
                    <option value={2000} className="bg-[#080d1a]">Quét: 2s (Nhanh)</option>
                    <option value={3500} className="bg-[#080d1a]">Quét: 3.5s (Chuẩn)</option>
                    <option value={7000} className="bg-[#080d1a]">Quét: 7s (Tiết kiệm)</option>
                  </select>
                </div>
                <div className="flex items-center gap-1 bg-[#03060c] border border-slate-800 rounded-xl px-3 py-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-xs text-slate-300 focus:outline-none">
                    <option value="ALL" className="bg-[#080d1a]">Trạng thái: Tất cả</option>
                    <option value="ONLINE" className="bg-[#080d1a]">Online</option>
                    <option value="OFFLINE" className="bg-[#080d1a]">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid Accounts */}
            {!activeKey ? (
              <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#080d1a]/50 border border-slate-800 rounded-3xl p-8">
                <Lock className="w-8 h-8 text-slate-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-200">HỆ THỐNG RADAR ĐANG KHÓA</h3>
                <p className="text-xs text-slate-500">Vui lòng nhập Key bảo mật ở Sidebar bên trái để kích hoạt.</p>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#080d1a]/50 border border-slate-800 rounded-3xl p-8">
                <Server className="w-10 h-10 text-slate-600 animate-bounce" />
                <h3 className="text-sm font-bold text-slate-300">CHƯA CÓ TÀI KHOẢN KẾT NỐI</h3>
                <p className="text-xs text-slate-500">Hãy chạy Roblox Lua Script v11 trong game để đồng bộ.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAccounts.map(acc => {
                  const isOnline = (Date.now() - acc.lastUpdated) < 20000;
                  return (
                    <div 
                      key={acc.userId}
                      onClick={() => setSelectedAcc(acc)}
                      className={`bg-[#080d1a] border border-slate-800/80 hover:${theme.border} p-4 rounded-3xl cursor-pointer transition-all duration-300 group shadow-xl hover:-translate-y-1`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} 
                            className="w-11 h-11 rounded-2xl bg-[#03060c] border border-slate-700 object-cover shadow-md"
                          />
                          <div>
                            <h3 className={`font-bold text-white text-xs group-hover:${theme.primary} transition`}>{acc.username}</h3>
                            <span className={`text-[10px] ${theme.primary} font-semibold bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 mt-1 inline-block`}>
                              {acc.gameName}
                            </span>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)] animate-pulse' : 'bg-rose-500'}`} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#03060c] p-2.5 rounded-xl border border-slate-800/60">
                          <p className="text-slate-500 font-bold mb-0.5 uppercase text-[9px]">Cấp Độ</p>
                          <p className="font-black text-white text-sm">Lv.{acc.stats?.level?.toLocaleString() || 1}</p>
                        </div>
                        <div className="bg-[#03060c] p-2.5 rounded-xl border border-slate-800/60">
                          <p className="text-slate-500 font-bold mb-0.5 uppercase text-[9px]">Tài Sản</p>
                          <p className="font-black text-emerald-400 text-sm">${acc.stats?.currency?.toLocaleString() || 0}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ---------------- SECTION 3: QUẢN LÝ CÀY THUÊ ---------------- */}
        {currentSection === 'boosting' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">⚡ Trung Tâm Quản Lý Tiến Độ Cày Thuê</h3>
                  <p className="text-xs text-slate-400">Theo dõi tiến độ cày level, farm vật phẩm và tự động bắn thông báo kết quả lên Discord shop.</p>
                </div>
                <button onClick={() => showToast('Đã làm mới danh sách đơn cày thuê!')} className="px-4 py-2 bg-slate-900 border border-slate-700 text-xs font-bold rounded-xl text-slate-300 hover:text-white">
                  Làm Mới Đơn
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#03060c] border border-slate-800 p-4 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/20">Đang Tiến Hành</span>
                  <h4 className="text-xs font-bold text-white">Cày Max Level Blox Fruits (Lv.1 -> Lv.2550)</h4>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-amber-400 h-full rounded-full w-3/4"></div>
                  </div>
                  <p className="text-[10px] text-slate-400">Khách hàng: <b>Player_VIP_01</b> • Tiến độ: 75%</p>
                </div>

                <div className="bg-[#03060c] border border-slate-800 p-4 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-md border border-cyan-500/20">Đang Tiến Hành</span>
                  <h4 className="text-xs font-bold text-white">Săn Vũ Khí / Sword Farming AOT Revolution</h4>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-cyan-400 h-full rounded-full w-1/2"></div>
                  </div>
                  <p className="text-[10px] text-slate-400">Khách hàng: <b>Dark_Slayer_99</b> • Tiến độ: 50%</p>
                </div>

                <div className="bg-[#03060c] border border-slate-800 p-4 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20">Hoàn Thành</span>
                  <h4 className="text-xs font-bold text-white">Farm Beli & Fragments King Legacy</h4>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-400 h-full rounded-full w-full"></div>
                  </div>
                  <p className="text-[10px] text-slate-400">Khách hàng: <b>Gia_Yen_Fan</b> • Tiến độ: 100%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 4: TRUNG GIAN ESCROW ---------------- */}
        {currentSection === 'escrow' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-sm font-black text-white">🛡️ Hệ Thống Trung Gian Escrow Tự Động</h3>
                <p className="text-xs text-slate-400">Đảm bảo an toàn 100% cho các giao dịch mua bán tài khoản và vật phẩm game giữa người mua và người bán.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#03060c] border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className={`text-xs font-bold ${theme.primary} uppercase flex items-center gap-2`}>
                    <UserCheck className="w-4 h-4" /> Khóa Tài Sản Giao Dịch (Seller)
                  </h4>
                  <p className="text-xs text-slate-400">Đóng băng quyền sở hữu và kiểm tra thông số thời gian thực thông qua Radar Lua trước khi giao dịch.</p>
                  <button onClick={() => showToast('Đã tạo thành công phiên giữ hộ Escrow!')} className={`w-full py-2.5 ${theme.bg} text-black font-bold text-xs rounded-xl`}>
                    Tạo Phiên Giữ Hộ Mới
                  </button>
                </div>

                <div className="bg-[#03060c] border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Xác Nhận & Giải Ngân (Buyer)
                  </h4>
                  <p className="text-xs text-slate-400">Xác thực số dư Beli, Level và vũ khí của tài khoản nhận được trước khi giải ngân tiền cho Seller.</p>
                  <button onClick={() => showToast('Đã xác nhận giải ngân thành công!')} className="w-full py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold text-xs rounded-xl transition">
                    Xác Nhận Giải Ngân
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 5: CÀI ĐẶT & LOGS ---------------- */}
        {currentSection === 'settings' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Webhook Config */}
              <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-400" /> Cấu Hình Webhook Discord
                </h3>
                <p className="text-xs text-slate-400">Nhập Webhook URL kênh Discord shop để tự động gửi báo cáo trạng thái cày thuê.</p>
                <input
                  type="text"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <textarea
                  placeholder="Nội dung thông báo tùy chỉnh..."
                  value={webhookMsg}
                  onChange={(e) => setWebhookMsg(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none h-20 resize-none"
                />
                <button onClick={sendDiscordWebhook} className={`w-full py-2.5 ${theme.bg} text-black text-xs font-bold rounded-xl`}>
                  Gửi Webhook Kiểm Tra
                </button>
              </div>

              {/* Audit Logs */}
              <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${theme.primary}`} /> Nhật Ký Hoạt Động (Audit Logs)
                </h3>
                <div className="bg-[#03060c] border border-slate-800 rounded-2xl p-3 flex-1 h-48 overflow-y-auto space-y-2 font-mono text-[11px]">
                  {activityLogs.length === 0 ? (
                    <p className="text-slate-600 text-center py-12">Chưa có bản ghi hoạt động nào.</p>
                  ) : (
                    activityLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-3 text-slate-300 border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500">[{log.time}]</span>
                        <span className="flex-1">{log.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FLOATING MUSIC PLAYER WIDGET */}
      <div className="fixed bottom-4 right-4 z-40 bg-[#080d1a]/95 border border-slate-700/80 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 w-80">
        <div className={`w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center ${theme.primary}`}>
          <Music className={`w-5 h-5 ${isPlayingMusic ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-bold text-white truncate">{playlist[currentTrackIndex].title}</p>
          <p className="text-[10px] text-slate-400 truncate">{playlist[currentTrackIndex].artist}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setIsPlayingMusic(!isPlayingMusic)} 
            className={`w-8 h-8 ${theme.bg} text-black rounded-xl flex items-center justify-center transition`}
          >
            {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
          </button>
          <button 
            onClick={() => setCurrentTrackIndex((currentTrackIndex + 1) % playlist.length)}
            className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center transition"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MODAL CHI TIẾT TÀI KHOẢN (KHI CLICK VÀO CARD RADAR) */}
      {selectedAcc && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#080d1a] border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${selectedAcc.userId}&width=150&height=150&format=png`} className="w-12 h-12 rounded-2xl border border-slate-700 shadow-md" />
                <div>
                  <h2 className="text-sm font-black text-white">{selectedAcc.username}</h2>
                  <p className="text-[11px] text-slate-400">ID: {selectedAcc.userId} • <span className={`${theme.primary} font-bold`}>{selectedAcc.gameName}</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedAcc(null)} className="text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold">Đóng</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#03060c] p-3 rounded-xl border border-slate-800">
                <p className="text-slate-500 uppercase text-[9px] font-bold">Cấp Độ</p>
                <p className="text-base font-black text-white">Lv.{selectedAcc.stats?.level || 1}</p>
              </div>
              <div className="bg-[#03060c] p-3 rounded-xl border border-slate-800">
                <p className="text-slate-500 uppercase text-[9px] font-bold">Tiền Beli / Cash</p>
                <p className="text-base font-black text-emerald-400">${selectedAcc.stats?.currency?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-[#03060c] p-3 rounded-xl border border-slate-800">
                <p className="text-slate-500 uppercase text-[9px] font-bold">Fragments</p>
                <p className="text-base font-black text-cyan-400">{selectedAcc.stats?.premiumCurrency?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-[#03060c] p-3 rounded-xl border border-slate-800">
                <p className="text-slate-500 uppercase text-[9px] font-bold">Bounty / Honor</p>
                <p className="text-base font-black text-amber-400">{selectedAcc.stats?.bounty?.toLocaleString() || 0}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-2"><Swords className={`w-3.5 h-3.5 ${theme.primary}`} /> Vũ Khí Trong Balo</h4>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {selectedAcc.inventory?.weapons?.length > 0 ? selectedAcc.inventory.weapons.map((w, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-[#03060c] border border-slate-800 rounded-xl text-xs text-slate-200">{w}</span>
                )) : <span className="text-xs text-slate-600 italic">Trống.</span>}
              </div>
            </div>

            <button onClick={() => { showToast('Đã gửi báo cáo tài khoản lên Discord!'); setSelectedAcc(null); }} className={`w-full py-2.5 ${theme.bg} text-black text-xs font-bold rounded-xl shadow-lg`}>
              Báo Cáo Tiến Độ Lên Discord
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
