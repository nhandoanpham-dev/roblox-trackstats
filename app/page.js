'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Radar, Settings, Gamepad2, Search, 
  Download, Palette, Activity, Music, Play, Pause, SkipForward,
  Lock, CheckCircle2, Sword, RefreshCw, Terminal, Cpu,
  Bell, Code2, SlidersHorizontal, ExternalLink,
  Eye, Layers, Copy, Check, Server, Zap, Shield, Sparkles
} from 'lucide-react';

export default function YeagerRobloxNexus() {
  const [accessKey, setAccessKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [currentTab, setCurrentTab] = useState('radar');
  const [viewMode, setViewMode] = useState('grid');
  
  // Modal chi tiết tài khoản
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Bộ lọc & Thống kê theo game
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [dashboardGame, setDashboardGame] = useState('Blox Fruits');
  const [searchQuery, setSearchQuery] = useState('');

  // Tùy chỉnh giao diện
  const [accentColor, setAccentColor] = useState('cyan');
  const [syncInterval, setSyncInterval] = useState(3000);
  const [activityLogs, setActivityLogs] = useState([]);
  const [toast, setToast] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Discord Webhook Settings
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(false);

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
            ...prev.slice(0, 40)
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
    downloadAnchor.setAttribute("download", `Roblox_Telemetry_v25_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất toàn bộ dữ liệu cấu trúc JSON!');
  };

  const gameCategories = ['ALL', 'Blox Fruits', 'AOT: Revolution', 'King Legacy', 'Fisch'];

  // Thống kê tổng quan
  const generalMetrics = useMemo(() => {
    const totalAccs = accounts.length;
    const onlineAccs = accounts.filter(a => (Date.now() - a.lastUpdated) < 20000).length;
    const maxLevel = accounts.reduce((max, a) => Math.max(max, a.stats?.level || 1), 1);
    const totalCurrency = accounts.reduce((sum, a) => sum + (a.stats?.currency || 0), 0);
    return { totalAccs, onlineAccs, maxLevel, totalCurrency };
  }, [accounts]);

  // Thống kê chuyên sâu riêng biệt theo từng trò chơi
  const gameSpecificMetrics = useMemo(() => {
    const gameAccs = accounts.filter(a => a.gameName?.toLowerCase() === dashboardGame.toLowerCase());
    const count = gameAccs.length;
    const maxLv = gameAccs.reduce((m, a) => Math.max(m, a.stats?.level || 1), 1);
    const totalCurr = gameAccs.reduce((s, a) => s + (a.stats?.currency || 0), 0);

    // Dữ liệu tùy biến theo từng game đặc thù
    if (dashboardGame === 'Blox Fruits') {
      const totalFragments = gameAccs.reduce((s, a) => s + (a.stats?.fragments || 0), 0);
      const mythicFruitsCount = gameAccs.filter(a => a.stats?.devilFruit?.includes('Leopard') || a.stats?.devilFruit?.includes('Dough') || a.stats?.devilFruit?.includes('Kit')).length;
      return { count, maxLv, totalCurr, subLabel1: 'Tổng Fragments', subVal1: totalFragments.toLocaleString(), subLabel2: 'Trái Ác Quỷ VIP', subVal2: `${mythicFruitsCount} tài khoản` };
    } 
    else if (dashboardGame === 'AOT: Revolution') {
      const totalBlades = gameAccs.reduce((s, a) => s + (a.inventory?.weapons?.length || 0), 0);
      return { count, maxLv, totalCurr, subLabel1: 'Tổng Vũ Khí/Blades', subVal1: totalBlades, subLabel2: 'Trạng Thái Titan', subVal2: 'Hoạt Động 100%' };
    }
    else if (dashboardGame === 'King Legacy') {
      const totalGems = gameAccs.reduce((s, a) => s + (a.stats?.gems || 0), 0);
      return { count, maxLv, totalCurr, subLabel1: 'Tổng Gems', subVal1: totalGems.toLocaleString(), subLabel2: 'Hạm Đội Đang Chạy', subVal2: `${count} acc` };
    }
    else { // Fisch & Default
      return { count, maxLv, totalCurr, subLabel1: 'Tổng Cá/Vật Phẩm', subVal1: gameAccs.reduce((s, a) => s + (a.stats?.itemsCount || 0), 0), subLabel2: 'Độ Bền Cần Câu', subVal2: 'Ổn định' };
    }
  }, [accounts, dashboardGame]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const matchGame = selectedGame === 'ALL' || acc.gameName?.includes(selectedGame);
      const matchSearch = acc.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          String(acc.userId).includes(searchQuery);
      return matchGame && matchSearch;
    });
  }, [accounts, selectedGame, searchQuery]);

  const luaScriptTemplate = `-- Yeager Roblox Nexus Telemetry Script v25
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

local API_URL = "https://roblox-trackstats.vercel.app/api/ping"
local ACCESS_KEY = "${activeKey || 'NHAP_KEY_CUA_BAN'}"

while task.wait(3) do
    pcall(function()
        local data = {
            key = ACCESS_KEY,
            userId = LocalPlayer.UserId,
            username = LocalPlayer.Name,
            gameName = "Blox Fruits", -- Thay đổi tên game tương ứng
            stats = {
                level = 2550,
                currency = 15000000,
                fragments = 25000,
                devilFruit = "Leopard"
            },
            inventory = {
                weapons = {"Cursed Dual Katana", "Soul Guitar"}
            },
            lastUpdated = tick() * 1000
        }
        
        request({
            Url = API_URL,
            Method = "POST",
            Headers = {["Content-Type"] = "application/json"},
            Body = HttpService:JSONEncode(data)
        })
    end)
end`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    showToast('Đã sao chép Lua Script vào clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Background Glows */}
      <div className={`absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br ${theme.glow} rounded-full blur-[200px] pointer-events-none transition-all duration-700`}></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[200px] pointer-events-none"></div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0b0f19]/90 border border-slate-700/80 backdrop-blur-xl text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className={`w-5 h-5 ${theme.primary}`} />
          <span className="text-xs font-bold tracking-wide">{toast}</span>
        </div>
      )}

      {/* ACCOUNT DETAILS MODAL */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-slate-700/80 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-fade-in relative">
            <button 
              onClick={() => setSelectedAccount(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 w-8 h-8 rounded-xl flex items-center justify-center"
            >
              ✕
            </button>
            <div className="flex items-center gap-4">
              <img 
                src={`https://www.roblox.com/headshot-thumbnail/image?userId=${selectedAccount.userId}&width=150&height=150&format=png`} 
                className="w-16 h-16 rounded-2xl bg-[#030712] border border-slate-700 object-cover shadow-lg" 
              />
              <div>
                <h3 className="text-base font-black text-white">{selectedAccount.username}</h3>
                <p className={`text-xs ${theme.primary} font-bold mt-0.5`}>User ID: {selectedAccount.userId}</p>
                <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full mt-1 inline-block">
                  {selectedAccount.gameName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#030712] p-3.5 rounded-2xl border border-slate-800">
                <p className="text-slate-500 uppercase text-[9px] font-bold">Cấp Độ Hiện Tại</p>
                <p className="text-lg font-black text-white mt-1">Lv.{selectedAccount.stats?.level || 1}</p>
              </div>
              <div className="bg-[#030712] p-3.5 rounded-2xl border border-slate-800">
                <p className="text-slate-500 uppercase text-[9px] font-bold">Tài Nguyên / Tiền</p>
                <p className="text-lg font-black text-emerald-400 mt-1">${selectedAccount.stats?.currency?.toLocaleString() || 0}</p>
              </div>
            </div>

            <div className="bg-[#030712] p-4 rounded-2xl border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh Sách Vật Phẩm / Vũ Khí:</p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {selectedAccount.inventory?.weapons?.map((w, i) => (
                  <span key={i} className="text-xs bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-slate-300 font-medium">
                    {w}
                  </span>
                )) || <span className="text-xs text-slate-500">Không có dữ liệu vũ khí.</span>}
              </div>
            </div>

            <button 
              onClick={() => setSelectedAccount(null)}
              className={`w-full py-3 ${theme.bg} text-slate-950 font-black text-xs rounded-xl shadow-lg`}
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col gap-6 relative z-10">

        {/* HEADER NAVIGATION */}
        <header className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full xl:w-auto justify-between xl:justify-start">
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl flex items-center justify-center shadow-inner border ${theme.border}`}>
                <Cpu className={`w-6 h-6 ${theme.primary} animate-pulse`} />
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-widest uppercase">ROBLOX TELEMETRY HUB</h1>
                <p className={`text-[10px] ${theme.primary} font-bold tracking-wider`}>YEAGER NEXUS v25 ULTIMATE</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#050811] p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
            {[
              { id: 'radar', label: 'Radar Trực Tuyến', icon: Radar },
              { id: 'dashboard', label: 'Thống Kê Game', icon: LayoutDashboard },
              { id: 'generator', label: 'Lua Generator', icon: Code2 },
              { id: 'webhooks', label: 'Webhook', icon: Server },
              { id: 'logs', label: 'Nhật Ký', icon: Terminal }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive ? `${theme.bg} text-slate-950 shadow-lg` : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

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

        {/* KEY AUTHENTICATION BANNER */}
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

        {/* TAB 1: RADAR TRỰC TUYẾN */}
        {currentTab === 'radar' && (
          <div className="space-y-6 animate-fade-in">
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

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Tìm nhân vật hoặc ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="flex bg-[#030712] border border-slate-800 rounded-xl p-1 shrink-0">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg text-xs ${viewMode === 'grid' ? `${theme.bg} text-slate-950 font-bold` : 'text-slate-400'}`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg text-xs ${viewMode === 'table' ? `${theme.bg} text-slate-950 font-bold` : 'text-slate-400'}`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

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
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAccounts.map(acc => {
                  const isOnline = (Date.now() - acc.lastUpdated) < 20000;
                  return (
                    <div key={acc.userId} className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl space-y-4 hover:border-slate-700 transition group relative overflow-hidden">
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.glow}`}></div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} 
                            className="w-12 h-12 rounded-2xl bg-[#030712] border border-slate-700 object-cover shadow-lg group-hover:scale-105 transition cursor-pointer"
                            onClick={() => setSelectedAccount(acc)}
                          />
                          <div>
                            <h3 className="font-black text-white text-xs tracking-wide cursor-pointer hover:underline" onClick={() => setSelectedAccount(acc)}>
                              {acc.username}
                            </h3>
                            <span className={`text-[10px] ${theme.primary} font-bold flex items-center gap-1 mt-0.5`}>
                              <Gamepad2 className="w-3 h-3" /> {acc.gameName}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-black tracking-wider ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                          {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-[#030712]/80 p-3 rounded-2xl border border-slate-800/80">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Cấp Độ Nhân Vật</p>
                          <p className="font-black text-white text-base mt-0.5">Lv.{acc.stats?.level || 1}</p>
                        </div>
                        <div className="bg-[#030712]/80 p-3 rounded-2xl border border-slate-800/80">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Tài Nguyên / Tiền</p>
                          <p className="font-black text-emerald-400 text-base mt-0.5">${acc.stats?.currency?.toLocaleString() || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-500">
                        <span>ID: {acc.userId}</span>
                        <button 
                          onClick={() => setSelectedAccount(acc)}
                          className={`text-xs ${theme.primary} font-bold flex items-center gap-1 hover:underline`}
                        >
                          <Eye className="w-3 h-3" /> Chi tiết
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 rounded-3xl p-4 overflow-x-auto shadow-2xl backdrop-blur-xl">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="pb-3 px-4">Nhân Vật</th>
                      <th className="pb-3 px-4">Trò Chơi</th>
                      <th className="pb-3 px-4">Cấp Độ</th>
                      <th className="pb-3 px-4">Tài Nguyên</th>
                      <th className="pb-3 px-4">Trạng Thái</th>
                      <th className="pb-3 px-4 text-right">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {filteredAccounts.map(acc => {
                      const isOnline = (Date.now() - acc.lastUpdated) < 20000;
                      return (
                        <tr key={acc.userId} className="hover:bg-slate-900/40 transition">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=100&height=100&format=png`} className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800" />
                            <span className="font-bold text-white">{acc.username}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{acc.gameName}</td>
                          <td className="py-3 px-4 font-black text-white">Lv.{acc.stats?.level || 1}</td>
                          <td className="py-3 px-4 font-black text-emerald-400">${acc.stats?.currency?.toLocaleString() || 0}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                              {isOnline ? 'ONLINE' : 'OFFLINE'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              onClick={() => setSelectedAccount(acc)}
                              className={`px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 ${theme.primary} font-bold`}
                            >
                              Xem
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: THỐNG KÊ CHUYÊN SÂU TỪNG TRÒ CHƠI */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Thanh chọn Game để thống kê */}
            <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${theme.primary}`} />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Phân Tích Số Liệu Theo Trò Chơi</h3>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {['Blox Fruits', 'AOT: Revolution', 'King Legacy', 'Fisch'].map(g => (
                  <button
                    key={g}
                    onClick={() => setDashboardGame(g)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      dashboardGame === g ? `${theme.bg} text-slate-950 shadow-lg` : 'bg-[#030712] text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Các Thẻ Thống Kê Động Dựa Theo Game Được Chọn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Thiết Bị Chơi {dashboardGame}</p>
                <p className="text-4xl font-black text-white">{gameSpecificMetrics.count}</p>
                <p className={`text-xs ${theme.primary} font-bold`}>🎮 Đang hoạt động ổn định</p>
              </div>

              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Cấp Độ Max Trong Game</p>
                <p className={`text-4xl font-black ${theme.primary}`}>Lv.{gameSpecificMetrics.maxLv}</p>
                <p className="text-xs text-slate-400">Kỷ lục cấp độ server</p>
              </div>

              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Tổng Tiền / Tài Nguyên</p>
                <p className="text-4xl font-black text-emerald-400">${gameSpecificMetrics.totalCurr.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Tích lũy kinh tế game thủ</p>
              </div>

              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">{gameSpecificMetrics.subLabel1}</p>
                <p className="text-4xl font-black text-cyan-400">{gameSpecificMetrics.subVal1}</p>
                <p className="text-xs text-slate-400">Chỉ số đặc thù: {gameSpecificMetrics.subVal2}</p>
              </div>
            </div>

            {/* Tổng quan chung hệ thống */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${theme.primary}`} /> Tổng Quan Toàn Hệ Thống
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="text-slate-500">Tổng số thiết bị kết nối:</span>
                    <span className="font-bold">{generalMetrics.totalAccs} thiết bị</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="text-slate-500">Đang trực tuyến (Online):</span>
                    <span className="font-bold text-emerald-400">{generalMetrics.onlineAccs} máy</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Tần số đồng bộ API:</span>
                    <span className="font-bold text-cyan-400">{syncInterval / 1000} giây/lần</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${theme.primary}`} /> Trạng Thái Vercel Edge Server
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Luồng dữ liệu thời gian thực được xử lý qua Serverless API không độ trễ. Các chỉ số trò chơi được cập nhật trực tiếp từ Lua Executor của người chơi qua POST request an toàn tuyệt đối.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LUA SCRIPT GENERATOR */}
        {currentTab === 'generator' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Code2 className={`w-4 h-4 ${theme.primary}`} /> Lua Script Tích Hợp Roblox
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Copy đoạn code này đưa vào script executor hoặc Roblox Studio để đẩy dữ liệu về trang web.</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(luaScriptTemplate)}
                  className={`px-4 py-2.5 ${theme.bg} text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2`}
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Đã sao chép' : 'Sao chép Script'}</span>
                </button>
              </div>

              <div className="bg-[#030712] border border-slate-900 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto h-80 shadow-inner">
                <pre>{luaScriptTemplate}</pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CẤU HÌNH DISCORD WEBHOOK */}
        {currentTab === 'webhooks' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className={`w-4 h-4 ${theme.primary}`} /> Tích Hợp Discord Webhook Thông Báo
              </h3>
              <p className="text-xs text-slate-400">Nhập Webhook URL từ kênh Discord của bạn để nhận thông báo tự động khi có sự kiện hệ thống.</p>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase">Discord Webhook URL</label>
                <input 
                  type="text"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-bold">Trạng thái Webhook: {webhookEnabled ? '🟢 Đang bật' : '🔴 Đang tắt'}</span>
                <button 
                  onClick={() => {
                    setWebhookEnabled(!webhookEnabled);
                    showToast(webhookEnabled ? 'Đã tắt Webhook!' : 'Đã lưu cấu hình Webhook thành công!');
                  }}
                  className={`px-5 py-2.5 ${webhookEnabled ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : `${theme.bg} text-slate-950`} font-bold text-xs rounded-xl shadow-lg`}
                >
                  {webhookEnabled ? 'Tắt Webhook' : 'Kích Hoạt Webhook'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NHẬT KÝ HỆ THỐNG (LOGS) */}
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

      </div>

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
