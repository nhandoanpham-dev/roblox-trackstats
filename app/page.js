'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Radar, Zap, ShieldCheck, Settings, 
  Gamepad2, Search, Swords, Download, Filter, 
  Server, Share2, Palette, Activity, Clock, Music, Play, Pause, SkipForward,
  UserCheck, DollarSign, Plus, Trash2, Edit3, CheckCircle2, Lock, ShieldAlert
} from 'lucide-react';

export default function YeagerNexusV13() {
  const [accessKey, setAccessKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // Bộ lọc Radar
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAcc, setSelectedAcc] = useState(null);

  // Quản lý Đơn hàng (Orders)
  const [orders, setOrders] = useState([
    { id: 'ORD-01', customer: 'Player_VIP_01', service: 'Cày Max Level Blox Fruits', price: '150K', status: 'Đang làm', booster: 'Thợ A' },
    { id: 'ORD-02', customer: 'Dark_Slayer_99', service: 'Săn Đồ AOT Revolution', price: '200K', status: 'Hoàn thành', booster: 'Thợ B' }
  ]);
  const [newOrder, setNewOrder] = useState({ customer: '', service: '', price: '', booster: '' });

  // Quản lý Trung Gian Escrow (Escrow Hub)
  const [escrows, setEscrows] = useState([
    { id: 'ESC-101', seller: 'Shop_A', buyer: 'Gamer_B', item: 'Acc Max Level + Full Quà', value: '500K', status: 'Đang giữ tài sản' }
  ]);
  const [newEscrow, setNewEscrow] = useState({ seller: '', buyer: '', item: '', value: '' });

  // Cấu hình Enterprise v13
  const [accentColor, setAccentColor] = useState('amber');
  const [syncInterval, setSyncInterval] = useState(3500);
  const [activityLogs, setActivityLogs] = useState([]);
  const [toast, setToast] = useState(null);

  // Webhook Discord Embed Builder
  const [webhookUrl, setWebhookUrl] = useState('');
  const [embedTitle, setEmbedTitle] = useState('🛡️ YEAGER PANNEL - THÔNG BÁO GIAO DỊCH');
  const [embedDesc, setEmbedDesc] = useState('Hệ thống trung gian uy tín, cày thuê nhanh chóng, bảo mật tuyệt đối.');
  const [embedColor, setEmbedColor] = useState('#f59e0b');

  // Trình phát nhạc Lofi
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const playlist = [
    { title: "Sadness and Sorrow", artist: "Naruto OST - Piano Lofi" },
    { title: "Chilling in the Sea", artist: "Blox Fruits Lofi Mix" },
    { title: "Yeager's Theme", artist: "Epic Orchestral Lofi" }
  ];

  const colorThemes = {
    amber: { primary: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/50', glow: 'bg-amber-500/5' },
    cyan: { primary: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500/50', glow: 'bg-cyan-500/5' },
    purple: { primary: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/50', glow: 'bg-purple-500/5' },
    emerald: { primary: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/50', glow: 'bg-emerald-500/5' },
  };
  const theme = colorThemes[accentColor];

  // Đồng bộ API Real-time
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
            { time: timeNow, text: `Đồng bộ thành công ${data.accounts.length} thiết bị từ Roblox Tracker.` },
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
    downloadAnchor.setAttribute("download", `YeagerNexus_v13_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất toàn bộ dữ liệu hệ thống!');
  };

  const sendDiscordEmbedWebhook = async () => {
    if (!webhookUrl) {
      showToast('Vui lòng nhập Webhook URL!');
      return;
    }
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: embedTitle,
            description: embedDesc,
            color: parseInt(embedColor.replace('#', ''), 16),
            footer: { text: "Yeager Pannel Enterprise v13 Pro" },
            timestamp: new Date().toISOString()
          }]
        })
      });
      showToast('Đã bắn Embed lên Discord thành công!');
    } catch (err) {
      showToast('Lỗi gửi Webhook Discord!');
    }
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!newOrder.customer || !newOrder.service) {
      showToast('Vui lòng nhập tên khách và dịch vụ!');
      return;
    }
    const orderItem = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      ...newOrder,
      status: 'Đang làm'
    };
    setOrders([orderItem, ...orders]);
    setNewOrder({ customer: '', service: '', price: '', booster: '' });
    showToast('Đã tạo đơn hàng mới!');
  };

  const handleAddEscrow = (e) => {
    e.preventDefault();
    if (!newEscrow.seller || !newEscrow.buyer) {
      showToast('Vui lòng nhập người bán và người mua!');
      return;
    }
    const escrowItem = {
      id: `ESC-${Date.now().toString().slice(-4)}`,
      ...newEscrow,
      status: 'Đang giữ tài sản'
    };
    setEscrows([escrowItem, ...escrows]);
    setNewEscrow({ seller: '', buyer: '', item: '', value: '' });
    showToast('Đã tạo phiên trung gian mới thành công!');
  };

  const gameCategories = ['ALL', 'Blox Fruits', 'King Legacy', 'AOT: Revolution', 'Fisch'];

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
      const isOnline = (Date.now() - acc.lastUpdated) < 20000;
      const matchStatus = statusFilter === 'ALL' || (statusFilter === 'ONLINE' ? isOnline : !isOnline);
      const matchSearch = acc.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          String(acc.userId).includes(searchQuery);
      return matchGame && matchStatus && matchSearch;
    });
  }, [accounts, selectedGame, statusFilter, searchQuery]);

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
              <p className={`text-[10px] ${theme.primary} font-bold`}>ENTERPRISE v13 PRO</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
              { id: 'radar', label: 'Radar Trực Tuyến', icon: Radar, count: metrics.onlineAccs },
              { id: 'orders', label: 'Quản Lý Đơn Hàng', icon: Zap, count: orders.length },
              { id: 'escrow', label: 'Trung Gian Escrow', icon: ShieldAlert, count: escrows.length },
              { id: 'builder', label: 'Discord Embed Builder', icon: Share2 },
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

        {/* Khóa hệ thống */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 p-4 lg:p-8 overflow-y-auto">
        
        {/* HEADER */}
        <header className="flex items-center justify-between bg-[#080d1a] p-4 rounded-3xl border border-slate-800/80 shadow-xl mb-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 lg:hidden">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900 border ${theme.border}`}>
              <ShieldCheck className={`w-5 h-5 ${theme.primary}`} />
            </div>
            <span className="font-black text-sm text-white">YEAGER v13</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <h2 className="text-sm font-black uppercase text-slate-300 tracking-wider">
              {currentSection === 'dashboard' && '📊 Tổng Quan Hệ Thống'}
              {currentSection === 'radar' && '📡 Radar Trực Tuyến Tài Khoản Game'}
              {currentSection === 'orders' && '⚡ Quản Lý Đơn Hàng Cày Thuê'}
              {currentSection === 'escrow' && '🛡️ Hệ Thống Trung Gian Escrow'}
              {currentSection === 'builder' && '🎨 Trình Tạo Discord Embed Builder'}
              {currentSection === 'settings' && '⚙️ Cài Đặt Hệ Thống & Logs'}
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
              <Download className={`w-3.5 h-3.5 ${theme.primary}`} /> Xuất File
            </button>
          </div>
        </header>

        {/* 1. DASHBOARD */}
        {currentSection === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Máy Trực Tuyến</p>
                <p className="text-3xl font-black text-white">{metrics.totalAccs}</p>
                <p className="text-[11px] text-emerald-400">🟢 {metrics.onlineAccs} đang hoạt động</p>
              </div>
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Đơn Cày Thuê</p>
                <p className={`text-3xl font-black ${theme.primary}`}>{orders.length} Đơn</p>
                <p className="text-[11px] text-slate-400">Đang xử lý tự động</p>
              </div>
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Giao Dịch Trung Gian</p>
                <p className="text-3xl font-black text-cyan-400">{escrows.length} Phiên</p>
                <p className="text-[11px] text-slate-400">Đảm bảo an toàn 100%</p>
              </div>
              <div className="bg-[#080d1a] border border-slate-800 p-5 rounded-3xl space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Tổng Beli / Tài Sản</p>
                <p className="text-3xl font-black text-purple-400">${metrics.totalCurrency.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">Đồng bộ từ Lua Tracker</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. RADAR TRỰC TUYẾN */}
        {currentSection === 'radar' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-[#080d1a] p-3 rounded-2xl border border-slate-800">
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

            {!activeKey ? (
              <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#080d1a]/50 border border-slate-800 rounded-3xl p-8">
                <Lock className="w-8 h-8 text-slate-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-200">HỆ THỐNG RADAR ĐANG KHÓA</h3>
                <p className="text-xs text-slate-500">Vui lòng nhập Key bảo mật ở Sidebar bên trái.</p>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-3 bg-[#080d1a]/50 border border-slate-800 rounded-3xl p-8">
                <Server className="w-10 h-10 text-slate-600 animate-bounce" />
                <h3 className="text-sm font-bold text-slate-300">CHƯA CÓ DỮ LIỆU GAME KẾT NỐI</h3>
                <p className="text-xs text-slate-500">Hãy chạy Script Roblox để gửi dữ liệu về đây.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredAccounts.map(acc => {
                  const isOnline = (Date.now() - acc.lastUpdated) < 20000;
                  return (
                    <div key={acc.userId} className="bg-[#080d1a] border border-slate-800 p-4 rounded-3xl shadow-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} className="w-11 h-11 rounded-2xl bg-[#03060c] border border-slate-700 object-cover" />
                          <div>
                            <h3 className="font-bold text-white text-xs">{acc.username}</h3>
                            <span className={`text-[10px] ${theme.primary} font-semibold`}>{acc.gameName}</span>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#03060c] p-2.5 rounded-xl border border-slate-800">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Cấp Độ</p>
                          <p className="font-black text-white text-sm">Lv.{acc.stats?.level || 1}</p>
                        </div>
                        <div className="bg-[#03060c] p-2.5 rounded-xl border border-slate-800">
                          <p className="text-slate-500 text-[9px] uppercase font-bold">Tiền / Beli</p>
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

        {/* 3. QUẢN LÝ ĐƠN HÀNG */}
        {currentSection === 'orders' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <form onSubmit={handleAddOrder} className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Plus className={`w-4 h-4 ${theme.primary}`} /> Tạo Đơn Cày Thuê
                </h3>
                <input type="text" placeholder="Tên khách hàng..." value={newOrder.customer} onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <input type="text" placeholder="Gói dịch vụ..." value={newOrder.service} onChange={(e) => setNewOrder({ ...newOrder, service: e.target.value })} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <input type="text" placeholder="Giá tiền..." value={newOrder.price} onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <input type="text" placeholder="Thợ cày..." value={newOrder.booster} onChange={(e) => setNewOrder({ ...newOrder, booster: e.target.value })} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <button type="submit" className={`w-full py-2.5 ${theme.bg} text-black font-bold text-xs rounded-xl shadow`}>Thêm Đơn</button>
              </form>

              <div className="lg:col-span-2 bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white">📋 Danh Sách Đơn Đang Xử Lý</h3>
                <div className="space-y-2.5">
                  {orders.map(ord => (
                    <div key={ord.id} className="bg-[#03060c] border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${theme.primary}`}>{ord.id}</span>
                          <span className="text-white font-semibold">• {ord.customer}</span>
                        </div>
                        <p className="text-slate-300 font-medium">{ord.service}</p>
                        <p className="text-[10px] text-slate-500">Thợ: {ord.booster} • Giá: <b className="text-emerald-400">{ord.price}</b></p>
                      </div>
                      <button onClick={() => setOrders(orders.filter(o => o.id !== ord.id))} className="text-slate-500 hover:text-rose-400 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TRUNG GIAN ESCROW */}
        {currentSection === 'escrow' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <form onSubmit={handleAddEscrow} className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldAlert className={`w-4 h-4 ${theme.primary}`} /> Tạo Phiên Trung Gian Mới
                </h3>
                <input type="text" placeholder="Người bán (Seller)..." value={newEscrow.seller} onChange={(e) => setNewEscrow({ ...newEscrow, seller: e.target.value })} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <input type="text" placeholder="Người mua (Buyer)..." value={newEscrow.buyer} onChange={(e) => setNewEscrow({ ...newEscrow, buyer: e.target.value })} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <input type="text" placeholder="Tài sản / Vật phẩm giao dịch..." value={newEscrow.item} onChange={(e) => setNewEscrow({ ...newEscrow, item: e.target.value })} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <input type="text" placeholder="Giá trị giao dịch (VD: 200K)..." value={newEscrow.value} onChange={(e) => setNewEscrow({ ...newEscrow, value: e.target.value })} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <button type="submit" className={`w-full py-2.5 ${theme.bg} text-black font-bold text-xs rounded-xl shadow`}>Khởi Tạo Escrow</button>
              </form>

              <div className="lg:col-span-2 bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white">🛡️ Các Phiên Trung Gian Đang Hoạt Động</h3>
                <div className="space-y-2.5">
                  {escrows.map(esc => (
                    <div key={esc.id} className="bg-[#03060c] border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${theme.primary}`}>{esc.id}</span>
                          <span className="text-white font-semibold">• Bán: {esc.seller} | Mua: {esc.buyer}</span>
                        </div>
                        <p className="text-slate-300 font-medium">{esc.item}</p>
                        <p className="text-[10px] text-emerald-400 font-bold">Giá trị: {esc.value} • Trạng thái: {esc.status}</p>
                      </div>
                      <button onClick={() => setEscrows(escrows.filter(e => e.id !== esc.id))} className="text-slate-500 hover:text-rose-400 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. DISCORD EMBED BUILDER */}
        {currentSection === 'builder' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-400" /> Thiết Kế Khung Discord Embed
                </h3>
                <input type="text" placeholder="Webhook URL kênh Discord..." value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <input type="text" placeholder="Tiêu đề Embed..." value={embedTitle} onChange={(e) => setEmbedTitle(e.target.value)} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                <textarea placeholder="Nội dung mô tả Embed..." value={embedDesc} onChange={(e) => setEmbedDesc(e.target.value)} className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none h-24 resize-none" />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Màu Khung:</span>
                  <input type="color" value={embedColor} onChange={(e) => setEmbedColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer" />
                </div>
                <button onClick={sendDiscordEmbedWebhook} className={`w-full py-2.5 ${theme.bg} text-black font-bold text-xs rounded-xl shadow`}>Bắn Embed Lên Discord 🚀</button>
              </div>

              <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col">
                <h3 className="text-sm font-black text-white">👁️ Xem Trước Giao Diện Discord</h3>
                <div className="bg-[#313338] p-4 rounded-2xl border-l-4 shadow-xl flex-1 space-y-2" style={{ borderLeftColor: embedColor }}>
                  <p className="text-xs font-bold text-white">{embedTitle}</p>
                  <p className="text-[11px] text-slate-300 whitespace-pre-wrap">{embedDesc}</p>
                  <p className="text-[9px] text-slate-400 pt-2 border-t border-[#3f4147]">Yeager Pannel Enterprise v13 Pro</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. SETTINGS & LOGS */}
        {currentSection === 'settings' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Activity className={`w-4 h-4 ${theme.primary}`} /> Nhật Ký Hoạt Động Hệ Thống
              </h3>
              <div className="bg-[#03060c] border border-slate-800 rounded-2xl p-3 h-48 overflow-y-auto space-y-2 font-mono text-[11px]">
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
