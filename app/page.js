'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, Key, RefreshCw, Wifi, X, Gamepad2, 
  Lock, Settings, ShieldAlert, Package, Sword, Crown, Sparkles, CheckCircle2
} from 'lucide-react';

export default function MultiGameDashboard() {
  const [userKey, setUserKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedGameFilter, setSelectedGameFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState(null);
  
  // State quản trị tài khoản
  const [activeTab, setActiveTab] = useState('STATS'); // 'STATS' | 'INVENTORY' | 'SECURITY'
  const [robloxCookie, setRobloxCookie] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [actionStatus, setActionStatus] = useState('');

  useEffect(() => {
    if (!activeKey) return;
    
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`/api/ping?key=${encodeURIComponent(activeKey)}`);
        const data = await res.json();
        if (data.accounts) {
          setAccounts(data.accounts);
          if (selectedAcc) {
            const updated = data.accounts.find(a => a.userId === selectedAcc.userId);
            if (updated) setSelectedAcc(updated);
          }
        }
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchAccounts();
    const interval = setInterval(fetchAccounts, 4000);
    return () => clearInterval(interval);
  }, [activeKey]);

  // Lọc game
  const gamesList = ['ALL', ...Array.from(new Set(accounts.map(a => a.gameName || 'Chưa rõ')))];
  const filteredAccounts = selectedGameFilter === 'ALL' 
    ? accounts 
    : accounts.filter(a => a.gameName === selectedGameFilter);

  // Xử lý Đổi mật khẩu
  const handleChangePassword = async () => {
    if (!robloxCookie || !newPassword) {
      setActionStatus('⚠️ Vui lòng nhập đầy đủ Cookie và Mật khẩu mới!');
      return;
    }
    setActionStatus('⏳ Đang xử lý yêu cầu đổi mật khẩu...');
    try {
      const res = await fetch('/api/account/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHANGE_PASSWORD',
          userId: selectedAcc.userId,
          robloxCookie,
          newPassword
        })
      });
      const data = await res.json();
      setActionStatus(data.message);
    } catch (err) {
      setActionStatus('❌ Lỗi hệ thống khi gửi yêu cầu!');
    }
  };

  return (
    <main className="min-h-screen bg-[#070a13] text-slate-100 p-4 md:p-8 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER BRANDING */}
        <div className="text-center space-y-2 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AOTWING UDUMXBOT
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-200 tracking-wider uppercase">
            AOTWING UDUMXBOT
          </h1>
          <p className="text-xs md:text-sm text-slate-400">Hệ Thống Quản Lý Panel udum</p>
        </div>

        {/* INPUT KEY & CHỌN GAME */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl max-w-xl mx-auto space-y-3 backdrop-blur-md">
          <form onSubmit={(e) => { e.preventDefault(); if (userKey.trim()) setActiveKey(userKey.trim()); }} className="flex gap-2">
            <div className="relative flex-1">
              <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                value={userKey}
                onChange={(e) => setUserKey(e.target.value)}
                placeholder="Nhập Key từ Discord Bot (AOT-XXXX)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/20">
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              Kết nối
            </button>
          </form>

          {activeKey && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Active Key: <strong className="text-amber-400 font-mono">{activeKey}</strong>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Realtime Sync Active</span>
            </div>
          )}
        </div>

        {/* BỘ LỌC DANH MỤC GAME */}
        {activeKey && accounts.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {gamesList.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGameFilter(g)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedGameFilter === g 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" /> {g}
              </button>
            ))}
          </div>
        )}

        {/* DANH SÁCH THẺ TÀI KHOẢN */}
        {activeKey && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {filteredAccounts.map((acc) => {
              const isOnline = Date.now() - acc.lastPing < 60000;
              return (
                <div
                  key={acc.userId}
                  onClick={() => { setSelectedAcc(acc); setActiveTab('STATS'); }}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-3 cursor-pointer transition shadow-xl group relative overflow-hidden backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} 
                      onError={(e) => { e.target.src = 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-Placeholder-Png'; }}
                      className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 object-cover" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white group-hover:text-amber-400 transition truncate">{acc.username}</p>
                      <p className="text-[10px] text-amber-400/90 font-semibold">{acc.gameName || 'Roblox Game'}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                      {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-xl text-xs font-mono">
                    <div><p className="text-[9px] text-slate-500 uppercase">LEVEL</p><p className="font-bold text-amber-400">Lv. {acc.stats?.level || 1}</p></div>
                    <div><p className="text-[9px] text-slate-500 uppercase">TIỀN / BELI</p><p className="font-bold text-emerald-400">${(acc.stats?.beli || 0).toLocaleString()}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* POPUP MODAL ĐA TÍNH NĂNG HOÀN CHỈNH */}
      {selectedAcc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 text-slate-200 relative max-h-[92vh] overflow-y-auto shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <img 
                  src={`https://www.roblox.com/headshot-thumbnail/image?userId=${selectedAcc.userId}&width=150&height=150&format=png`} 
                  className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 object-cover" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedAcc.username}</h2>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                      {selectedAcc.gameName || 'Roblox'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {selectedAcc.userId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAcc(null)} className="p-1.5 bg-slate-800/60 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB SELECTOR IN MODAL */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs">
              <button 
                onClick={() => setActiveTab('STATS')}
                className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${activeTab === 'STATS' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                <Gamepad2 className="w-3.5 h-3.5" /> Chỉ Số Game
              </button>
              <button 
                onClick={() => setActiveTab('INVENTORY')}
                className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${activeTab === 'INVENTORY' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                <Package className="w-3.5 h-3.5" /> Kho Đồ & Vật Phẩm
              </button>
              <button 
                onClick={() => setActiveTab('SECURITY')}
                className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${activeTab === 'SECURITY' ? 'bg-red-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                <Lock className="w-3.5 h-3.5" /> Quản Trị & Đổi Mật Khẩu
              </button>
            </div>

            {/* TAB 1: CHỈ SỐ GAME */}
            {activeTab === 'STATS' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">LEVEL</p>
                    <p className="text-lg font-black text-white">{selectedAcc.stats?.level || 1}</p>
                  </div>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">TIỀN / BELI</p>
                    <p className="text-lg font-black text-emerald-400">${(selectedAcc.stats?.beli || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">GEMS / FRAGMENTS</p>
                    <p className="text-lg font-black text-purple-400">💎 {(selectedAcc.stats?.gems || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">BOUNTY / HONOR</p>
                    <p className="text-lg font-black text-amber-400">{(selectedAcc.stats?.bounty || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-bold">CHỦNG TỘC / CLASS</p>
                    <p className="text-sm font-bold text-cyan-400 mt-1">{selectedAcc.stats?.classOrRace || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-bold">SỨC MẠNH / NĂNG LỰC CHÍNH</p>
                    <p className="text-sm font-bold text-amber-400 mt-1">{selectedAcc.stats?.primaryAbility || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KHO ĐỒ FULL */}
            {activeTab === 'INVENTORY' && (
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-[11px] font-bold text-amber-400 mb-1.5 flex items-center gap-1">🍍 TRÁI ÁC QUỶ / ITEM KHO ({selectedAcc.inventoryFruits?.length || 0}):</p>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 flex flex-wrap gap-1.5">
                    {selectedAcc.inventoryFruits?.length > 0 ? selectedAcc.inventoryFruits.map((f, i) => (
                      <span key={i} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                        {f.name} <strong className="text-amber-400">x{f.count}</strong>
                      </span>
                    )) : <span className="text-slate-500 italic">Trống</span>}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1"><Sword className="w-3.5 h-3.5" /> VŨ KHÍ / KIẾM / SÚNG ({selectedAcc.weapons?.length || 0}):</p>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 flex flex-wrap gap-1.5">
                    {selectedAcc.weapons?.length > 0 ? selectedAcc.weapons.map((w, i) => (
                      <span key={i} className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">{w.name}</span>
                    )) : <span className="text-slate-500 italic">Trống</span>}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-cyan-400 mb-1.5 flex items-center gap-1"><Crown className="w-3.5 h-3.5" /> PHỤ KIỆN ({selectedAcc.accessories?.length || 0}):</p>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 flex flex-wrap gap-1.5">
                    {selectedAcc.accessories?.length > 0 ? selectedAcc.accessories.map((a, i) => (
                      <span key={i} className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-lg">{a.name}</span>
                    )) : <span className="text-slate-500 italic">Trống</span>}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: QUẢN TRỊ TÀI KHOẢN (ĐỔI MẬT KHẨU) */}
            {activeTab === 'SECURITY' && (
              <div className="bg-[#111625] p-4 rounded-xl border border-red-500/30 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-red-400 font-bold border-b border-slate-800 pb-2">
                  <ShieldAlert className="w-4 h-4" /> QUẢN TRỊ VÀ BẢO MẬT TÀI KHOẢN ROBLOX
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">MẬT KHẨU MỚI:</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">ROBLOX COOKIE (.ROBLOSECURITY):</label>
                    <textarea 
                      rows={3}
                      value={robloxCookie}
                      onChange={(e) => setRobloxCookie(e.target.value)}
                      placeholder="Dán mã Cookie .ROBLOSECURITY của tài khoản vào đây..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {actionStatus && (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-semibold text-[11px]">
                      {actionStatus}
                    </div>
                  )}

                  <button 
                    onClick={handleChangePassword}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-lg transition"
                  >
                    XÁC NHẬN ĐỔI MẬT KHẨU TÀI KHOẢN
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
              <p>Sync: {new Date(selectedAcc.lastPing).toLocaleTimeString('vi-VN')}</p>
              <button onClick={() => setSelectedAcc(null)} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-1.5 rounded-lg transition">
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
