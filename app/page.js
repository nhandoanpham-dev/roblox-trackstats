'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Radar, Settings, Gamepad2, Search, 
  Download, ShieldCheck, Palette, Activity, Music, Play, Pause, SkipForward,
  Lock, CheckCircle2, User, Sword, Shield, Coins, Sparkles, ExternalLink, RefreshCw
} from 'lucide-react';

export default function YeagerRobloxHub() {
  const [accessKey, setAccessKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // Bộ lọc & Chi tiết tài khoản
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedAccount, setInspectedAccount] = useState(null);

  // Cấu hình giao diện
  const [accentColor, setAccentColor] = useState('amber');
  const [syncInterval, setSyncInterval] = useState(3000);
  const [activityLogs, setActivityLogs] = useState([]);
  const [toast, setToast] = useState(null);

  // Trình phát nhạc Lofi
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const playlist = [
    { title: "Sadness and Sorrow", artist: "Naruto OST - Piano Lofi" },
    { title: "Blox Fruits Sea Theme", artist: "Roblox Lofi Mix" },
    { title: "Yeager's Telemetry", artist: "Epic Synthwave" }
  ];

  const colorThemes = {
    amber: { primary: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/50', glow: 'bg-amber-500/5' },
    cyan: { primary: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500/50', glow: 'bg-cyan-500/5' },
    purple: { primary: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/50', glow: 'bg-purple-500/5' },
    emerald: { primary: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/50', glow: 'bg-emerald-500/5' },
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
            { time: timeNow, text: `Đồng bộ thành công dữ liệu từ ${data.accounts.length} thiết bị Roblox.` },
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
    downloadAnchor.setAttribute("download", `Roblox_Accounts_Data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất toàn bộ dữ liệu tài khoản Roblox!');
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
    <div className="min-h-screen bg-[#020408] text-slate-100 font-sans flex relative selection:bg-amber-500/30">
      
      {/* Glow Background */}
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
              <Gamepad2 className={`w-6 h-6 ${theme.primary}`} />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wider">ROBLOX HUB</h1>
              <p className={`text-[10px] ${theme.primary} font-bold`}>TELEMETRY v14 PRO</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Tổng Quan Dữ Liệu', icon: LayoutDashboard },
              { id: 'radar', label: 'Radar Tài Khoản', icon: Radar, count: metrics.onlineAccs },
              { id: 'settings', label: 'Nhật Ký & Cài Đặt', icon: Settings },
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

        {/* Khóa hệ thống */}
        <div className="bg-[#03060c] border border-slate-800/80 p-3 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Trạng Thái Key:</span>
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 p-4 lg:p-8 overflow-y-auto">
        
        {/* HEADER */}
        <header className="flex items-center justify-between bg-[#080d1a] p-4 rounded-3xl border border-slate-800/80 shadow-xl mb-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 lg:hidden">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900 border ${theme.border}`}>
              <Gamepad2 className={`w-5 h-5 ${theme.primary}`} />
            </div>
            <span className="font-black text-sm text-white">ROBLOX HUB</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <h2 className="text-sm font-black uppercase text-slate-300 tracking-wider">
              {currentSection === 'dashboard' && '📊 Thống Kê Tổng Quan Tài Khoản Game'}
              {currentSection === 'radar' && '📡 Radar Trực Tuyến & Kiểm Tra Kho Đồ'}
              {currentSection === 'settings' && '⚙️ Nhật Ký Hệ Thống & Đồng Bộ'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
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
              <Download className={`w-3.5 h-3.5 ${theme.primary}`} /> Xuất File JSON
            </button>
          </div>
        </header>

        {/* 1. DASHBOARD */}
        {currentSection === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Tài Khoản Theo Dõi</p>
                <p className="text-3xl font-black text-white">{metrics.totalAccs}</p>
                <p className="text-[11px] text-emerald-400">🟢 {metrics.onlineAccs} đang online trong game</p>
              </div>
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Cấp Độ Cao Nhất</p>
                <p className={`text-3xl font-black ${theme.primary}`}>Lv.{metrics.maxLevel}</p>
                <p className="text-[11px] text-slate-400">Cập nhật tự động từ Lua Script</p>
              </div>
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Tổng Tiền / Beli</p>
                <p className="text-3xl font-black text-cyan-400">${metrics.totalCurrency.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">Tài nguyên toàn bộ hệ thống</p>
              </div>
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Tần Suất Đồng Bộ</p>
                <p className="text-3xl font-black text-purple-400">{syncInterval / 1000}s</p>
                <p className="text-[11px] text-slate-400">Độ trễ thời gian thực thấp</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. RADAR TÀI KHOẢN & INSPECTOR */}
        {currentSection === 'radar' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#080d1a] p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-none">
                {gameCategories.map(game => (
                  <button
                    key={game}
                    onClick={() => setSelectedGame(game)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition whitespace-nowrap flex items-center gap-2 ${
                      selectedGame === game ? `${theme.bg} text-black shadow-md` : 'bg-[#03060c] text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" /> {game === 'ALL' ? 'Tất Cả Game' : game}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tên hoặc ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {!activeKey ? (
              <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#080d1a]/50 border border-slate-800 rounded-3xl p-8">
                <Lock className="w-8 h-8 text-slate-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-200">CHƯA XÁC THỰC KHÓA BẢO MẬT</h3>
                <p className="text-xs text-slate-500">Vui lòng nhập Key bảo mật ở Sidebar để xem dữ liệu tài khoản.</p>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#080d1a]/50 border border-slate-800 rounded-3xl p-8">
                <RefreshCw className="w-10 h-10 text-slate-600 animate-spin" />
                <h3 className="text-sm font-bold text-slate-300">ĐANG CHỜ TÍN HIỆU TỪ ROBLOX SCRIPT</h3>
                <p className="text-xs text-slate-500">Hãy chạy Lua Script trong game Roblox để truyền dữ liệu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccounts.map(acc => {
                  const isOnline = (Date.now() - acc.lastUpdated) < 20000;
                  return (
                    <div key={acc.userId} className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4 hover:border-slate-700 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} className="w-12 h-12 rounded-2xl bg-[#03060c] border border-slate-700 object-cover" />
                          <div>
                            <h3 className="font-bold text-white text-xs">{acc.username}</h3>
                            <span className={`text-[10px] ${theme.primary} font-semibold flex items-center gap-1`}>
                              <Gamepad2 className="w-3 h-3" /> {acc.gameName}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {isOnline ? 'ONLINE' : 'OFFLINE'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#03060c] p-3 rounded-2xl border border-slate-800/80">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Cấp Độ (Level)</p>
                          <p className="font-black text-white text-sm">Lv.{acc.stats?.level || 1}</p>
                        </div>
                        <div className="bg-[#03060c] p-3 rounded-2xl border border-slate-800/80">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Tiền / Beli</p>
                          <p className="font-black text-emerald-400 text-sm">${acc.stats?.currency?.toLocaleString() || 0}</p>
                        </div>
                      </div>

                      {acc.inventory?.weapons && (
                        <div className="bg-[#03060c] p-3 rounded-2xl border border-slate-800/80 space-y-1.5">
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Sword className="w-3 h-3 text-amber-400" /> Vũ khí nổi bật:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {acc.inventory.weapons.map((w, idx) => (
                              <span key={idx} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-lg">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                        <span>User ID: {acc.userId}</span>
                        <span>Cập nhật: {new Date(acc.lastUpdated).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. SETTINGS & LOGS */}
        {currentSection === 'settings' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Activity className={`w-4 h-4 ${theme.primary}`} /> Nhật Ký Đồng Bộ Dữ Liệu Roblox
              </h3>
              <div className="bg-[#03060c] border border-slate-800 rounded-2xl p-3 h-64 overflow-y-auto space-y-2 font-mono text-[11px]">
                {activityLogs.length === 0 ? (
                  <p className="text-slate-600 text-center py-16">Chưa có sự kiện đồng bộ nào được ghi nhận.</p>
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
        )}

      </main>

      {/* FLOATING MUSIC PLAYER */}
      <div className="fixed bottom-4 right-4 z-40 bg-[#080d1a]/95 border border-slate-700/80 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 w-80">
        <div className={`w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center ${theme.primary}`}>
          <Music className={`w-5 h-5 ${isPlayingMusic ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-bold text-white truncate">{playlist[currentTrackIndex].title}</p>
          <p className="text-[10px] text-slate-400 truncate">{playlist[currentTrackIndex].artist}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setIsPlayingMusic(!isPlayingMusic)} className={`w-8 h-8 ${theme.bg} text-black rounded-xl flex items-center justify-center`}>
            {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
          </button>
          <button onClick={() => setCurrentTrackIndex((currentTrackIndex + 1) % playlist.length)} className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center">
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
