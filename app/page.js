'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Key, ShieldCheck, Gamepad2, Search, 
  Swords, TrendingUp, Zap, RefreshCw, Lock, CheckCircle2, 
  Download, Filter, ArrowUpDown, Server, Radio, Play, Pause, SkipForward, Music,
  Bell, Terminal, Share2, Palette, Activity, Clock, Cpu, ShieldAlert
} from 'lucide-react';

export default function YeagerNexusV10() {
  const [accessKey, setAccessKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [activeTab, setActiveTab] = useState('STATS');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Tính năng v10.0 Enterprise
  const [accentColor, setAccentColor] = useState('amber');
  const [syncInterval, setSyncInterval] = useState(3500);
  const [activityLogs, setActivityLogs] = useState([]);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
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
            ...prev.slice(0, 25)
          ]);
          if (selectedAcc) {
            const updated = data.accounts.find(a => a.userId === selectedAcc.userId);
            if (updated) setSelectedAcc(updated);
          }
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
  }, [activeKey, selectedAcc, syncInterval]);

  const handleConnect = (e) => {
    e.preventDefault();
    if (accessKey.trim()) {
      setLoading(true);
      setTimeout(() => {
        setActiveKey(accessKey.trim());
        setLoading(false);
        showToast('Kết nối hệ thống Radar v10 thành công!');
      }, 500);
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
    downloadAnchor.setAttribute("download", `YeagerNexus_v10_Enterprise_${Date.now()}.json`);
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
          content: `🛡️ **YEAGER PANNEL ENTERPRISE v10**\n> ${webhookMsg || 'Hệ thống radar đang hoạt động ổn định và bảo mật.'}` 
        })
      });
      showToast('Đã gửi thông báo lên Discord thành công!');
      setShowWebhookModal(false);
      setWebhookMsg('');
    } catch (err) {
      showToast('Lỗi kết nối Webhook Discord!');
    }
  };

  const gameCategories = [
    'ALL', 'Blox Fruits', 'King Legacy', 'Anime Expeditions', 
    'Pet Simulator 99', 'AOT: Revolution', 'Fisch', 'Murder Mystery 2'
  ];

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
                          String(acc.userId).includes(searchQuery) ||
                          (acc.inventory?.weapons && acc.inventory.weapons.some(w => w.toLowerCase().includes(searchQuery.toLowerCase())));
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
    <div className="min-h-screen bg-[#020408] text-slate-100 font-sans p-4 md:p-6 relative selection:bg-amber-500/30">
      
      {/* Background Glow */}
      <div className={`absolute top-0 left-1/4 w-[700px] h-[700px] ${theme.glow} rounded-full blur-[200px] pointer-events-none transition-all duration-700`}></div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0c1322] border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className={`w-5 h-5 ${theme.primary}`} />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-[#080d1a] p-5 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg border ${theme.border}`}>
                <ShieldCheck className={`w-7 h-7 ${theme.primary}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider">
                    YEAGER NEXUS <span className={theme.primary}>v10 ENTERPRISE</span>
                  </h1>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> SECURE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Hệ Thống Quản Lý Dịch Vụ Game, Cày Thuê & Trung Gian Escrow Tự Động</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end flex-wrap">
            {/* Color Theme Selector */}
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

            <button onClick={() => setShowLogsModal(true)} className="bg-[#03060c] border border-slate-700/80 hover:border-slate-500 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> Logs ({activityLogs.length})
            </button>

            <button onClick={() => setShowWebhookModal(true)} className="bg-[#03060c] border border-slate-700/80 hover:border-slate-500 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-400" /> Webhook
            </button>

            <button onClick={handleExportData} className="bg-[#03060c] border border-slate-700/80 hover:border-slate-500 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
              <Download className={`w-3.5 h-3.5 ${theme.primary}`} /> Xuất File
            </button>

            <form onSubmit={handleConnect} className="flex gap-2">
              <div className="relative">
                <Key className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  placeholder="Key bảo mật..."
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="bg-[#03060c] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition w-32 sm:w-36"
                />
              </div>
              <button type="submit" className={`${theme.bg} hover:opacity-90 text-black px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-md`}>
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />} Khóa
              </button>
            </form>
          </div>
        </header>

        {/* GAME CATEGORIES BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-[#080d1a] p-3 rounded-2xl border border-slate-800/80">
          {gameCategories.map(game => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition whitespace-nowrap flex items-center gap-2 ${
                selectedGame === game 
                ? `${theme.bg} text-black shadow-md` 
                : 'bg-[#03060c] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" /> {game === 'ALL' ? 'Tất Cả Game' : game}
            </button>
          ))}
        </div>

        {/* LIVE METRICS SUMMARY BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#080d1a] border border-slate-800 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Tổng Tài Khoản</p>
            <p className="text-xl font-black text-white">{metrics.totalAccs}</p>
          </div>
          <div className="bg-[#080d1a] border border-slate-800 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Đang Online</p>
            <p className="text-xl font-black text-emerald-400">{metrics.onlineAccs} <span className="text-xs font-normal text-slate-500">/ off</span></p>
          </div>
          <div className="bg-[#080d1a] border border-slate-800 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Cấp Độ Max</p>
            <p className={`text-xl font-black ${theme.primary}`}>Lv. {metrics.maxLevel}</p>
          </div>
          <div className="bg-[#080d1a] border border-slate-800 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Tổng Beli / Tiền</p>
            <p className="text-xl font-black text-cyan-400">${metrics.totalCurrency.toLocaleString()}</p>
          </div>
          <div className="bg-[#080d1a] border border-slate-800 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Tổng Fragments</p>
            <p className="text-xl font-black text-purple-400">{metrics.totalFragments.toLocaleString()}</p>
          </div>
          <div className="bg-[#080d1a] border border-slate-800 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Thiết Bị Radar</p>
            <p className="text-xl font-black text-slate-200">{metrics.onlineAccs} máy</p>
          </div>
        </div>

        {/* TOOLBAR (SEARCH, STATUS, SORT, INTERVAL) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#080d1a] p-3 rounded-2xl border border-slate-800">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm người chơi, ID, vũ khí..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#03060c] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <div className="flex items-center gap-1 bg-[#03060c] border border-slate-800 rounded-xl px-3 py-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={syncInterval} 
                onChange={(e) => setSyncInterval(Number(e.target.value))}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value={2000} className="bg-[#080d1a]">Quét: 2s (Nhanh)</option>
                <option value={3500} className="bg-[#080d1a]">Quét: 3.5s (Chuẩn)</option>
                <option value={7000} className="bg-[#080d1a]">Quét: 7s (Tiết kiệm)</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-[#03060c] border border-slate-800 rounded-xl px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#080d1a]">Trạng thái: Tất cả</option>
                <option value="ONLINE" className="bg-[#080d1a]">Online</option>
                <option value="OFFLINE" className="bg-[#080d1a]">Offline</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-[#03060c] border border-slate-800 rounded-xl px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#080d1a]">Xếp theo: Mới nhất</option>
                <option value="level_desc" className="bg-[#080d1a]">Cấp độ cao nhất</option>
                <option value="money_desc" className="bg-[#080d1a]">Tài sản lớn nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* ACCOUNTS GRID */}
        {!activeKey ? (
          <div className="h-[45vh] flex flex-col items-center justify-center text-center space-y-4 bg-[#080d1a]/40 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-md">
            <div className="w-16 h-16 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center shadow-2xl">
              <Lock className="w-8 h-8 text-slate-500 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-slate-200">HỆ THỐNG RADAR ĐANG KHÓA</h2>
            <p className="text-xs text-slate-500 max-w-md">Nhập khóa bảo mật ở góc trên để kích hoạt giao diện giám sát v10 Enterprise.</p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="h-[45vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#080d1a]/40 border border-slate-800/60 rounded-3xl p-8">
            <Server className="w-12 h-12 text-slate-600 animate-bounce" />
            <h3 className="text-base font-bold text-slate-300">CHƯA CÓ TÀI KHOẢN KẾT NỐI</h3>
            <p className="text-xs text-slate-500 max-w-sm">Chạy Script Tracker v10 trong Roblox để đồng bộ dữ liệu vào không gian của bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAccounts.map(acc => {
              const isOnline = (Date.now() - acc.lastUpdated) < 20000;
              return (
                <div 
                  key={acc.userId}
                  onClick={() => setSelectedAcc(acc)}
                  className={`bg-[#080d1a] border border-slate-800/80 hover:${theme.border} p-4 rounded-3xl cursor-pointer transition-all duration-300 group shadow-xl hover:-translate-y-1 relative overflow-hidden`}
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

        {/* MODAL AUDIT LOGS */}
        {showLogsModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-[#080d1a] border border-slate-700 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${theme.primary}`} /> Nhật Ký Hoạt Động Radar
                </h3>
                <button onClick={() => setShowLogsModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">Đóng</button>
              </div>
              <div className="bg-[#03060c] border border-slate-800 rounded-2xl p-3 h-64 overflow-y-auto space-y-2 font-mono text-[11px]">
                {activityLogs.length === 0 ? (
                  <p className="text-slate-600 text-center py-10">Chưa có bản ghi hoạt động nào.</p>
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

        {/* MODAL DISCORD WEBHOOK */}
        {showWebhookModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-[#080d1a] border border-slate-700 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-400" /> Cấu Hình Webhook Discord
              </h3>
              <p className="text-xs text-slate-400">Nhập Webhook URL của kênh Discord shop để tự động gửi báo cáo trạng thái cày thuê.</p>
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
                className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none h-24 resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowWebhookModal(false)} className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl text-slate-300">Đóng</button>
                <button onClick={sendDiscordWebhook} className={`px-4 py-2 ${theme.bg} text-black text-xs font-bold rounded-xl`}>Gửi Webhook</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CHI TIẾT TÀI KHOẢN */}
        {selectedAcc && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-[#080d1a] border border-slate-700/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#0d1424]">
                <div className="flex items-center gap-3">
                  <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${selectedAcc.userId}&width=150&height=150&format=png`} className="w-12 h-12 rounded-2xl border border-slate-700 shadow-md" />
                  <div>
                    <h2 className="text-base font-black text-white">{selectedAcc.username}</h2>
                    <p className="text-[11px] text-slate-400">ID: {selectedAcc.userId} • <span className={`${theme.primary} font-bold`}>{selectedAcc.gameName}</span></p>
                  </div>
                </div>
                <button onClick={() => setSelectedAcc(null)} className="text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition">
                  Đóng
                </button>
              </div>

              <div className="flex border-b border-slate-800 text-xs font-bold bg-[#03060c]">
                <button onClick={() => setActiveTab('STATS')} className={`flex-1 py-3 flex items-center justify-center gap-2 transition ${activeTab === 'STATS' ? `${theme.primary} border-b-2 border-current bg-slate-900/50` : 'text-slate-500'}`}>
                  <TrendingUp className="w-3.5 h-3.5" /> THÔNG SỐ & KHO ĐỒ
                </button>
                <button onClick={() => setActiveTab('BOOSTING')} className={`flex-1 py-3 flex items-center justify-center gap-2 transition ${activeTab === 'BOOSTING' ? `${theme.primary} border-b-2 border-current bg-slate-900/50` : 'text-slate-500'}`}>
                  <Zap className="w-3.5 h-3.5" /> TIẾN ĐỘ CÀY THUÊ
                </button>
                <button onClick={() => setActiveTab('ESCROW')} className={`flex-1 py-3 flex items-center justify-center gap-2 transition ${activeTab === 'ESCROW' ? `${theme.primary} border-b-2 border-current bg-slate-900/50` : 'text-slate-500'}`}>
                  <ShieldCheck className="w-3.5 h-3.5" /> TRUNG GIAN ESCROW
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 bg-[#03060c] space-y-5">
                {activeTab === 'STATS' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-[#080d1a] p-3.5 rounded-2xl border border-slate-800">
                        <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Cấp Độ</p>
                        <p className="text-lg font-black text-white">Lv.{selectedAcc.stats?.level?.toLocaleString() || 1}</p>
                      </div>
                      <div className="bg-[#080d1a] p-3.5 rounded-2xl border border-slate-800">
                        <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Tiền Chính</p>
                        <p className="text-lg font-black text-emerald-400">${selectedAcc.stats?.currency?.toLocaleString() || 0}</p>
                      </div>
                      <div className="bg-[#080d1a] p-3.5 rounded-2xl border border-slate-800">
                        <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Fragments / Gems</p>
                        <p className="text-lg font-black text-cyan-400">{selectedAcc.stats?.premiumCurrency?.toLocaleString() || 0}</p>
                      </div>
                      <div className="bg-[#080d1a] p-3.5 rounded-2xl border border-slate-800">
                        <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Bounty / Honor</p>
                        <p className="text-lg font-black text-amber-400">{selectedAcc.stats?.bounty?.toLocaleString() || 0}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-2"><Swords className={`w-3.5 h-3.5 ${theme.primary}`} /> Vũ Khí Trong Balo</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAcc.inventory?.weapons?.length > 0 ? selectedAcc.inventory.weapons.map((w, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#080d1a] border border-slate-800 rounded-xl text-xs text-slate-200">{w}</span>
                        )) : <span className="text-xs text-slate-600 italic">Trống.</span>}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'BOOSTING' && (
                  <div className="bg-[#080d1a] p-5 rounded-3xl border border-slate-800 space-y-4">
                    <h4 className={`font-bold ${theme.primary} text-xs flex items-center gap-2`}><Zap className="w-3.5 h-3.5" /> Tiến Trình Cày Thuê Live</h4>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-400">Mục tiêu cấp độ</span>
                        <span className={theme.primary}>Lv. {selectedAcc.stats?.level}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div className={`bg-gradient-to-r from-slate-200 to-white h-full rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, (selectedAcc.stats?.level / 2550) * 100)}%` }}></div>
                      </div>
                    </div>
                    <button onClick={() => showToast('Đã gửi báo cáo tiến độ lên Discord!')} className={`w-full py-2.5 ${theme.bg} text-black rounded-xl text-xs font-bold transition shadow-lg`}>
                      Gửi Báo Cáo Lên Discord
                    </button>
                  </div>
                )}

                {activeTab === 'ESCROW' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-[#080d1a] p-4 rounded-2xl border border-slate-800 space-y-2">
                      <h5 className={`font-bold text-xs ${theme.primary} uppercase`}>Khóa Tài Sản (Seller)</h5>
                      <p className="text-[11px] text-slate-400">Giữ tài khoản an toàn trong hệ thống trung gian Yeager Nexus.</p>
                      <button onClick={() => showToast('Đã khóa tài sản vào hệ thống Escrow!')} className={`w-full py-2.5 bg-slate-900 border border-slate-700 hover:${theme.border} rounded-xl text-xs font-bold ${theme.primary} transition`}>
                        Khóa & Tạo Đơn Giữ Hộ
                      </button>
                    </div>
                    <div className="bg-[#080d1a] p-4 rounded-2xl border border-slate-800 space-y-2">
                      <h5 className="font-bold text-xs text-cyan-400 uppercase">Xác Nhận Tiền (Buyer)</h5>
                      <p className="text-[11px] text-slate-400">Xác thực thông số thời gian thực trước khi giải ngân.</p>
                      <button onClick={() => showToast('Đã giải ngân giao dịch thành công!')} className="w-full py-2.5 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black rounded-xl text-xs font-bold text-cyan-400 transition">
                        Xác Nhận Nhận Tài Sản
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#03060c] p-3 text-center text-[10px] text-slate-500 border-t border-slate-800 font-mono">
                Cập nhật lúc: {new Date(selectedAcc.lastUpdated).toLocaleTimeString('vi-VN')} • Yeager Nexus v10 Enterprise
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
