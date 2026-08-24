'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Radar, Settings, Gamepad2, Search, 
  Download, Palette, Activity, Music, Play, Pause, SkipForward,
  Lock, CheckCircle2, Sword, RefreshCw, Terminal, Cpu,
  Bell, Code2, SlidersHorizontal, ExternalLink,
  Eye, Layers, Copy, Check, Server, Zap, Shield, Sparkles, Send, Radio
} from 'lucide-react';

export default function YeagerRobloxNexus() {
  const [accessKey, setAccessKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [currentTab, setCurrentTab] = useState('radar');
  const [viewMode, setViewMode] = useState('grid');
  
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [dashboardGame, setDashboardGame] = useState('Blox Fruits');
  const [searchQuery, setSearchQuery] = useState('');

  const [accentColor, setAccentColor] = useState('cyan');
  const [syncInterval, setSyncInterval] = useState(3000);
  const [activityLogs, setActivityLogs] = useState([]);
  const [toast, setToast] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // RCON Remote Commands State
  const [targetUserId, setTargetUserId] = useState('');
  const [customNotification, setCustomNotification] = useState('');

  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(false);

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
          if (data.accounts.length > 0) {
            setActivityLogs(prev => [
              { time: timeNow, text: `Đã đồng bộ telemetry thành công cho ${data.accounts.length} thiết bị Roblox.` },
              ...prev.slice(0, 40)
            ]);
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
  }, [activeKey, syncInterval]);

  const handleConnect = (e) => {
    e.preventDefault();
    if (accessKey.trim()) {
      setActiveKey(accessKey.trim());
      showToast('Xác thực Key thành công! Đang kết nối mạng lưới Script...');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const sendRconCommand = async (commandType, payloadData = {}) => {
    if (!targetUserId) {
      showToast('Vui lòng chọn hoặc nhập User ID cần điều khiển!');
      return;
    }
    try {
      const res = await fetch('/api/ping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, command: commandType, payload: payloadData })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã gửi lệnh [${commandType}] đến User ID: ${targetUserId}!`);
        setCustomNotification('');
      } else {
        showToast(`Lỗi: ${data.error}`);
      }
    } catch (err) {
      showToast('Không thể gửi lệnh RCON!');
    }
  };

  const gameCategories = ['ALL', 'Blox Fruits', 'AOT: Revolution', 'King Legacy', 'Fisch'];

  const gameSpecificMetrics = useMemo(() => {
    const gameAccs = accounts.filter(a => a.gameName?.toLowerCase() === dashboardGame.toLowerCase());
    const count = gameAccs.length;
    const maxLv = gameAccs.reduce((m, a) => Math.max(m, a.stats?.level || 1), 1);
    const totalCurr = gameAccs.reduce((s, a) => s + (a.stats?.currency || 0), 0);

    if (dashboardGame === 'Blox Fruits') {
      const totalFragments = gameAccs.reduce((s, a) => s + (a.stats?.fragments || 0), 0);
      const rareFruits = gameAccs.filter(a => a.stats?.devilFruit).length;
      return { count, maxLv, totalCurr, subLabel1: 'Tổng Fragments', subVal1: totalFragments.toLocaleString(), subLabel2: 'Trái Quỷ sở hữu', subVal2: `${rareFruits} acc` };
    } 
    else {
      return { count, maxLv, totalCurr, subLabel1: 'Trạng thái Script', subVal1: 'Hoạt động 100%', subLabel2: 'Độ trễ', subVal2: '< 50ms' };
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

  // Lua Script Nâng Cấp tích hợp cả Telemetry & Xử lý Lệnh RCON từ Web
  const luaScriptTemplate = `-- Yeager Roblox Nexus Telemetry & RCON Script v32
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local StarterGui = game:GetService("StarterGui")
local LocalPlayer = Players.LocalPlayer

local API_URL = "https://aotwing-dusky.vercel.app//api/ping"
local ACCESS_KEY = "${activeKey || 'yeager2026'}"

print("Yeager Nexus Client Started for: " .. LocalPlayer.Name)

while task.wait(3) do
    pcall(function()
        local data = {
            key = ACCESS_KEY,
            userId = LocalPlayer.UserId,
            username = LocalPlayer.Name,
            gameName = "Blox Fruits",
            stats = {
                level = 2550,
                currency = 15000000,
                fragments = 25000
            },
            inventory = {
                weapons = {"Cursed Dual Katana", "Soul Guitar"}
            },
            lastUpdated = tick() * 1000
        }
        
        local response = request({
            Url = API_URL .. "?userId=" .. LocalPlayer.UserId,
            Method = "POST",
            Headers = {["Content-Type"] = "application/json"},
            Body = HttpService:JSONEncode(data)
        })

        if response and response.StatusCode == 200 then
            local decoded = HttpService:JSONDecode(response.Body)
            if decoded.commands and #decoded.commands > 0 then
                for _, cmdObj in ipairs(decoded.commands) do
                    if cmdObj.command == "NOTIFY" then
                        StarterGui:SetCore("SendNotification", {
                            Title = "Yeager Nexus Admin",
                            Text = cmdObj.payload.message or "Lệnh từ Web Dashboard!",
                            Duration = 5
                        })
                    elseif cmdObj.command == "RECONNECT" then
                        game:GetService("TeleportService"):Teleport(game.PlaceId, LocalPlayer)
                    end
                end
            end
        end
    end)
end`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    showToast('Đã sao chép Lua Script nâng cao vào clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      <div className={`absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br ${theme.glow} rounded-full blur-[200px] pointer-events-none transition-all duration-700`}></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[200px] pointer-events-none"></div>

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
                <p className="text-slate-500 uppercase text-[9px] font-bold">Số Tiền</p>
                <p className="text-lg font-black text-emerald-400 mt-1">${selectedAccount.stats?.currency?.toLocaleString() || 0}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => { setTargetUserId(selectedAccount.userId); setCurrentTab('rcon'); setSelectedAccount(null); }}
                className={`flex-1 py-3 ${theme.bg} text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2`}
              >
                <Radio className="w-4 h-4" /> Điều Khiển RCON Nhanh
              </button>
              <button 
                onClick={() => setSelectedAccount(null)}
                className="px-5 py-3 bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Đóng
              </button>
            </div>
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
                <h1 className="text-sm font-black text-white tracking-widest uppercase">ROBLOX NEXUS HUB</h1>
                <p className={`text-[10px] ${theme.primary} font-bold tracking-wider`}>V32 RCON ULTIMATE EDITION</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#050811] p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
            {[
              { id: 'radar', label: 'Radar Trực Tuyến', icon: Radar },
              { id: 'dashboard', label: 'Thống Kê Game', icon: LayoutDashboard },
              { id: 'rcon', label: 'Điều Khiển RCON', icon: Radio },
              { id: 'generator', label: 'Lua Script Generator', icon: Code2 },
              { id: 'webhooks', label: 'Webhook', icon: Server }
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
                <h3 className="text-sm font-black text-white">XÁC THỰC KẾT NỐI HỆ THỐNG</h3>
                <p className="text-xs text-slate-400">Nhập Key bảo mật để kích hoạt mạng lưới Radar và điều khiển RCON.</p>
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

              <div className="relative w-full lg:w-64">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Tìm nhân vật..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {!activeKey ? (
              <div className="h-[45vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#0b0f19]/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md">
                <Lock className="w-10 h-10 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-300">VUI LÒNG NHẬP KEY XÁC THỰC</h3>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="h-[45vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#0b0f19]/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md">
                <RefreshCw className="w-10 h-10 text-slate-500 animate-spin" />
                <h3 className="text-sm font-bold text-slate-300">ĐANG CHỜ TÍN HIỆU TỪ LUA SCRIPT...</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAccounts.map(acc => {
                  const isOnline = (Date.now() - acc.lastUpdated) < 25000;
                  return (
                    <div key={acc.userId} className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl space-y-4 hover:border-slate-700 transition relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} 
                            className="w-12 h-12 rounded-2xl bg-[#030712] border border-slate-700 object-cover shadow-lg cursor-pointer"
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
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-black ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                          {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-[#030712]/80 p-3 rounded-2xl border border-slate-800/80">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Cấp Độ</p>
                          <p className="font-black text-white text-base mt-0.5">Lv.{acc.stats?.level || 1}</p>
                        </div>
                        <div className="bg-[#030712]/80 p-3 rounded-2xl border border-slate-800/80">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Tài Nguyên</p>
                          <p className="font-black text-emerald-400 text-base mt-0.5">${acc.stats?.currency?.toLocaleString() || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                        <span className="text-[10px] text-slate-500">ID: {acc.userId}</span>
                        <button 
                          onClick={() => { setTargetUserId(acc.userId); setCurrentTab('rcon'); }}
                          className={`${theme.primary} font-bold flex items-center gap-1 hover:underline text-[11px]`}
                        >
                          <Radio className="w-3 h-3" /> Điều khiển RCON
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: THỐNG KÊ GAME */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${theme.primary}`} /> Thống Kê Chuyên Sâu
              </h3>
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {['Blox Fruits', 'AOT: Revolution', 'King Legacy'].map(g => (
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black text-slate-500">Máy Chạy {dashboardGame}</p>
                <p className="text-4xl font-black text-white">{gameSpecificMetrics.count}</p>
              </div>
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black text-slate-500">Cấp Độ Cao Nhất</p>
                <p className={`text-4xl font-black ${theme.primary}`}>Lv.{gameSpecificMetrics.maxLv}</p>
              </div>
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black text-slate-500">Tổng Tiền / Tài Nguyên</p>
                <p className="text-4xl font-black text-emerald-400">${gameSpecificMetrics.totalCurr.toLocaleString()}</p>
              </div>
              <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-2">
                <p className="text-[10px] uppercase font-black text-slate-500">{gameSpecificMetrics.subLabel1}</p>
                <p className="text-4xl font-black text-cyan-400">{gameSpecificMetrics.subVal1}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ĐIỀU KHIỂN RCON (MỚI) */}
        {currentTab === 'rcon' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${theme.primary}`}>
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Hệ Thống Điều Khiển RCON Trực Tiếp Xuống Script</h3>
                  <p className="text-xs text-slate-400">Gửi lệnh hành động trực tiếp từ trang web đến các tài khoản Roblox đang chạy script.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Nhập User ID Mục Tiêu</label>
                  <input 
                    type="text"
                    placeholder="VD: 123456789..."
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Chọn Tài Khoản Nhanh</label>
                  <select 
                    onChange={(e) => setTargetUserId(e.target.value)}
                    value={targetUserId}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  >
                    <option value="">-- Chọn nhân vật từ danh sách online --</option>
                    {accounts.map(acc => (
                      <option key={acc.userId} value={acc.userId}>{acc.username} (Lv.{acc.stats?.level})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-300 uppercase">Gửi Thông Báo Vào Màn Hình Game (Notification)</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Nhập nội dung thông báo hiển thị trong game Roblox..."
                    value={customNotification}
                    onChange={(e) => setCustomNotification(e.target.value)}
                    className="flex-1 bg-[#030712] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                  <button 
                    onClick={() => sendRconCommand('NOTIFY', { message: customNotification || 'Xin chào từ Yeager Hub!' })}
                    className={`px-6 py-3 ${theme.bg} text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2`}
                  >
                    <Send className="w-4 h-4" /> Gửi Thông Báo
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Buộc Reconnect (Tải Lại Server)</p>
                  <p className="text-[10px] text-slate-500">Lệnh này sẽ khiến client Roblox tự động kết nối lại game ngay lập tức.</p>
                </div>
                <button 
                  onClick={() => sendRconCommand('RECONNECT')}
                  className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 font-bold text-xs rounded-xl transition"
                >
                  Buộc Reconnect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LUA SCRIPT GENERATOR */}
        {currentTab === 'generator' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Code2 className={`w-4 h-4 ${theme.primary}`} /> Lua Script Hỗ Trợ RCON v32
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Script này vừa gửi telemetry vừa kiểm tra và thực thi các lệnh từ Web gửi xuống.</p>
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

        {/* TAB 5: WEBHOOKS */}
        {currentTab === 'webhooks' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0b0f19]/80 border border-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className={`w-4 h-4 ${theme.primary}`} /> Cấu Hình Discord Webhook
              </h3>
              <input 
                type="text"
                placeholder="https://discord.com/api/webhooks/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
              />
              <button 
                onClick={() => {
                  setWebhookEnabled(!webhookEnabled);
                  showToast(webhookEnabled ? 'Đã tắt Webhook!' : 'Đã kích hoạt Webhook!');
                }}
                className={`px-5 py-2.5 ${webhookEnabled ? 'bg-rose-500/20 text-rose-400' : `${theme.bg} text-slate-950`} font-bold text-xs rounded-xl shadow-lg`}
              >
                {webhookEnabled ? 'Tắt Webhook' : 'Bật Webhook'}
              </button>
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
