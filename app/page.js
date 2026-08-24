'use client';

import { useState, useEffect } from 'react';
import { 
  Key, ShieldCheck, Gamepad2, Package, Search, 
  Swords, Crown, RefreshCw, Zap, TrendingUp 
} from 'lucide-react';

export default function YeagerDashboard() {
  const [accessKey, setAccessKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [activeTab, setActiveTab] = useState('STATS');

  // Động cơ đồng bộ (Polling Engine)
  useEffect(() => {
    if (!activeKey) return;
    const syncData = async () => {
      try {
        const res = await fetch(`/api/ping?key=${encodeURIComponent(activeKey)}`);
        const data = await res.json();
        if (data.accounts) {
          setAccounts(data.accounts);
          if (selectedAcc) {
            const update = data.accounts.find(a => a.userId === selectedAcc.userId);
            if (update) setSelectedAcc(update);
          }
        }
      } catch (err) {
        console.error("Lỗi đồng bộ", err);
      }
    };

    syncData();
    const interval = setInterval(syncData, 4000); // Tối ưu mượt mà mỗi 4 giây
    return () => clearInterval(interval);
  }, [activeKey, selectedAcc]);

  // Bộ lọc Game động
  const availableGames = ['ALL', ...Array.from(new Set(accounts.map(a => a.gameName)))];
  const displayAccounts = selectedGame === 'ALL' 
    ? accounts 
    : accounts.filter(a => a.gameName === selectedGame);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 font-sans p-4 md:p-8 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP NAVIGATION TACTICAL */}
        <header className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-[#0f131d] p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 tracking-wider">
                YEAGER PANNEL CORE
              </h1>
              <p className="text-sm text-slate-400 font-medium">Hệ thống đồng bộ dữ liệu Real-time</p>
            </div>
          </div>

          <div className="flex w-full lg:w-auto gap-3">
            <div className="relative w-full lg:w-80">
              <Key className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                placeholder="Nhập Key Bảo Mật Hệ Thống..."
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full bg-[#07090e] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <button 
              onClick={() => { if(accessKey.trim()) setActiveKey(accessKey.trim()) }}
              className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> TRUY CẬP
            </button>
          </div>
        </header>

        {/* KHÔNG CÓ DỮ LIỆU */}
        {!activeKey && (
          <div className="h-[50vh] flex flex-col items-center justify-center text-slate-600 space-y-4">
            <ShieldCheck className="w-24 h-24 opacity-20" />
            <h2 className="text-xl font-bold text-slate-400">HỆ THỐNG ĐANG KHÓA</h2>
            <p className="text-sm">Vui lòng nhập Key bảo mật để kích hoạt Radar quét dữ liệu.</p>
          </div>
        )}

        {/* KHU VỰC DỮ LIỆU CHÍNH */}
        {activeKey && (
          <div className="space-y-6">
            
            {/* THAY ĐỔI MỤC GAME (GAME TABS) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {availableGames.map(game => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition flex items-center gap-2 ${
                    selectedGame === game 
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                    : 'bg-[#0f131d] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" /> {game === 'ALL' ? 'Tất cả các Game' : game}
                </button>
              ))}
            </div>

            {/* DANH SÁCH TÀI KHOẢN (GRID) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayAccounts.map(acc => {
                const isOnline = (Date.now() - acc.lastUpdated) < 15000;
                return (
                  <div 
                    key={acc.userId}
                    onClick={() => setSelectedAcc(acc)}
                    className="bg-[#0f131d] border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl cursor-pointer transition group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} className="w-12 h-12 rounded-xl bg-[#07090e] border border-slate-700" />
                        <div>
                          <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition">{acc.username}</h3>
                          <p className="text-[10px] text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded mt-1 inline-block">{acc.gameName}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-[#07090e] p-3 rounded-xl border border-slate-800/80">
                        <p className="text-slate-500 font-bold mb-1 uppercase text-[9px]">Cấp độ</p>
                        <p className="font-black text-white text-lg">Lv.{acc.stats?.level?.toLocaleString() || 1}</p>
                      </div>
                      <div className="bg-[#07090e] p-3 rounded-xl border border-slate-800/80">
                        <p className="text-slate-500 font-bold mb-1 uppercase text-[9px]">Tài sản</p>
                        <p className="font-black text-emerald-400 text-lg">${acc.stats?.currency?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* BẢNG ĐIỀU KHIỂN CHI TIẾT (ADVANCED MODAL) */}
        {selectedAcc && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f131d] border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* HEADER MODAL */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-[#131825]">
                <div className="flex items-center gap-4">
                  <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${selectedAcc.userId}&width=150&height=150&format=png`} className="w-16 h-16 rounded-2xl border-2 border-slate-700" />
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      {selectedAcc.username}
                      <span className="text-[10px] bg-amber-500 text-black px-2 py-1 rounded font-bold uppercase">{selectedAcc.gameName}</span>
                    </h2>
                    <p className="text-sm text-slate-400 font-mono mt-1">Player ID: {selectedAcc.userId}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAcc(null)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition">
                  Đóng Panel
                </button>
              </div>

              {/* TABS ĐIỀU HƯỚNG BÊN TRONG */}
              <div className="flex border-b border-slate-800 text-sm font-bold">
                <button onClick={() => setActiveTab('STATS')} className={`flex-1 py-4 flex items-center justify-center gap-2 transition ${activeTab === 'STATS' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}>
                  <TrendingUp className="w-4 h-4" /> THÔNG SỐ CHUYÊN SÂU
                </button>
                <button onClick={() => setActiveTab('INVENTORY')} className={`flex-1 py-4 flex items-center justify-center gap-2 transition ${activeTab === 'INVENTORY' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}>
                  <Package className="w-4 h-4" /> KHO ĐỒ & VẬT PHẨM
                </button>
              </div>

              {/* NỘI DUNG TABS */}
              <div className="p-6 overflow-y-auto flex-1 bg-[#0a0c13]">
                {activeTab === 'STATS' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#131825] p-5 rounded-xl border border-slate-800">
                      <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Cấp độ hiện tại</p>
                      <p className="text-2xl font-black text-white">{selectedAcc.stats?.level?.toLocaleString() || 1}</p>
                    </div>
                    <div className="bg-[#131825] p-5 rounded-xl border border-slate-800">
                      <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Tiền chính (Beli/Cash)</p>
                      <p className="text-2xl font-black text-emerald-400">${selectedAcc.stats?.currency?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-[#131825] p-5 rounded-xl border border-slate-800">
                      <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Tiền phụ (Gems/Frags)</p>
                      <p className="text-2xl font-black text-cyan-400">{selectedAcc.stats?.premiumCurrency?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-[#131825] p-5 rounded-xl border border-slate-800">
                      <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Bounty / Điểm danh dự</p>
                      <p className="text-2xl font-black text-amber-400">{selectedAcc.stats?.bounty?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'INVENTORY' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><Swords className="w-4 h-4 text-amber-400" /> VŨ KHÍ HIỆN CÓ ({selectedAcc.inventory?.weapons?.length || 0})</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAcc.inventory?.weapons?.length > 0 ? selectedAcc.inventory.weapons.map((w, i) => (
                          <span key={i} className="px-3 py-1.5 bg-[#131825] border border-slate-700 rounded-lg text-sm text-slate-200 font-medium">{w}</span>
                        )) : <span className="text-sm text-slate-600 italic">Kho đồ trống...</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-[#0f131d] p-4 text-center text-xs font-mono text-slate-500 border-t border-slate-800">
                Tín hiệu cập nhật: {new Date(selectedAcc.lastUpdated).toLocaleTimeString('vi-VN')}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
