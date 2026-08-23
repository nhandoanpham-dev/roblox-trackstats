'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Wifi, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function Home() {
  const [userKey, setUserKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState(null);

  useEffect(() => {
    if (!activeKey) return;
    
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`/api/ping?key=${encodeURIComponent(activeKey)}`);
        const data = await res.json();
        if (data.accounts) {
          setAccounts(data.accounts);
          // Cập nhật dữ liệu real-time nếu popup đang mở
          if (selectedAcc) {
            const updated = data.accounts.find(a => a.userId === selectedAcc.userId);
            if (updated) setSelectedAcc(updated);
          }
        }
      } catch (err) {
        console.error("Lỗi đồng bộ:", err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchAccounts();
    const interval = setInterval(fetchAccounts, 4000);
    return () => clearInterval(interval);
  }, [activeKey]);

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Dashboard */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-amber-400 tracking-wider uppercase">AOTWING UDUMXBOT</h1>
          <p className="text-xs text-slate-400">Vì Yêu Mà Em Thấu Hiểu, Trả Lại Anh Của EM Lúc Ban Đầu, Vậy Tại Sao, Tình Yêu Mà ANh đã Trao</p>
        </div>

        {/* Input Key */}
        <form onSubmit={(e) => { e.preventDefault(); if (userKey.trim()) setActiveKey(userKey.trim()); }} className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={userKey}
            onChange={(e) => setUserKey(e.target.value)}
            placeholder="Nhập Key cá nhân..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
          />
          <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition">
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            Kết nối
          </button>
        </form>

        {/* Status Bar */}
        {activeKey && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3 rounded-xl max-w-md mx-auto text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <Wifi className="w-4 h-4 text-emerald-400" /> Key: <strong className="text-amber-400 font-mono">{activeKey}</strong>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Tự động đồng bộ mỗi 4s</span>
            </div>

            {/* Thẻ Tài Khoản */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accounts.map((acc) => {
                const isOnline = Date.now() - acc.lastPing < 60000;
                return (
                  <div
                    key={acc.userId}
                    onClick={() => setSelectedAcc(acc)}
                    className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-3 cursor-pointer transition shadow-lg group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} 
                        onError={(e) => { e.target.src = 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-Placeholder-Png'; }}
                        className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 object-cover" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-white group-hover:text-amber-400 transition truncate">{acc.username}</p>
                        <p className="text-[10px] text-slate-500 font-mono">ID: {acc.userId}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl text-xs">
                      <div><p className="text-[10px] text-slate-500">LEVEL</p><p className="font-bold text-amber-400">Lv. {acc.level}</p></div>
                      <div><p className="text-[10px] text-slate-500">BELI</p><p className="font-bold text-emerald-400">${(acc.beli || 0).toLocaleString()}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* POPUP MODAL HOÀN CHỈNH ĐẦY ĐỦ THÔNG TIN */}
      {selectedAcc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-slate-200 relative max-h-[92vh] overflow-y-auto shadow-2xl">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <img 
                  src={`https://www.roblox.com/headshot-thumbnail/image?userId=${selectedAcc.userId}&width=150&height=150&format=png`} 
                  onError={(e) => { e.target.src = 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-Placeholder-Png'; }}
                  className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 object-cover" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedAcc.username}</h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">ONLINE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Game: <span className="text-white">Blox Fruits</span> • ID: {selectedAcc.userId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAcc(null)} className="p-1.5 bg-slate-800/60 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chỉ Số 4 Khung */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase">LEVEL</p>
                <p className="text-lg font-black text-white">{selectedAcc.level}</p>
              </div>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase">BELI / MONEY</p>
                <p className="text-lg font-black text-emerald-400">${(selectedAcc.beli || 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase">FRAGMENTS</p>
                <p className="text-lg font-black text-purple-400">ƒ {(selectedAcc.fragments || 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase">BOUNTY / HONOR</p>
                <p className="text-lg font-black text-amber-400">{(selectedAcc.bounty || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Chi tiết Nhân vật */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">TRÁI ÁC QUỶ ĐANG DÙNG</p>
                <p className="text-xs font-bold text-amber-400">{selectedAcc.fruit || 'None'}</p>
              </div>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">VÕ & CHỦNG TỘC</p>
                <p className="text-xs font-bold text-white">{selectedAcc.melee || 'Combat'}</p>
                <p className="text-[10px] text-cyan-400 font-mono">Chủng tộc: {selectedAcc.race || 'Human'}</p>
              </div>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">GẠT CẦN & TIẾN TRÌNH V4</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${selectedAcc.hasPulledLever ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                  {selectedAcc.hasPulledLever ? 'Đã gạt cần' : 'Chưa gạt cần'}
                </span>
              </div>
            </div>

            {/* Chi tiết Kho Đồ */}
            <div className="space-y-3 pt-1 text-xs">
              {/* Trái Ác Quỷ */}
              <div>
                <p className="text-[11px] font-bold text-amber-400 mb-1.5">🍍 TRÁI ÁC QUỶ TRONG KHO ({selectedAcc.inventoryFruits?.length || 0}):</p>
                <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-300 min-h-[42px] flex flex-wrap gap-2">
                  {selectedAcc.inventoryFruits?.length > 0 ? selectedAcc.inventoryFruits.map((f, i) => (
                    <span key={i} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-1 rounded text-[11px]">
                      {f.name} <strong className="text-amber-400">x{f.count}</strong>
                    </span>
                  )) : <span className="text-slate-500 italic">Trống</span>}
                </div>
              </div>

              {/* Kiếm & Súng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-300 mb-1.5">⚔️ KIẾM ĐÃ SỞ HỮU ({selectedAcc.swords?.length || 0}):</p>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-300 min-h-[42px] flex flex-wrap gap-1.5">
                    {selectedAcc.swords?.length > 0 ? selectedAcc.swords.map((s, i) => (
                      <span key={i} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px]">{s.name}</span>
                    )) : <span className="text-slate-500 italic">Trống</span>}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-300 mb-1.5">🔫 SÚNG ĐÃ SỞ HỮU ({selectedAcc.guns?.length || 0}):</p>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-300 min-h-[42px] flex flex-wrap gap-1.5">
                    {selectedAcc.guns?.length > 0 ? selectedAcc.guns.map((g, i) => (
                      <span key={i} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px]">{g.name}</span>
                    )) : <span className="text-slate-500 italic">Trống</span>}
                  </div>
                </div>
              </div>

              {/* Phụ Kiện */}
              <div>
                <p className="text-[11px] font-bold text-cyan-400 mb-1.5">👑 PHỤ KIỆN ĐÃ SỞ HỮU ({selectedAcc.accessories?.length || 0}):</p>
                <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-300 min-h-[42px] flex flex-wrap gap-1.5">
                  {selectedAcc.accessories?.length > 0 ? selectedAcc.accessories.map((a, i) => (
                    <span key={i} className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px]">{a.name}</span>
                  )) : <span className="text-slate-500 italic">Trống</span>}
                </div>
              </div>

              {/* Nguyên Liệu */}
              <div>
                <p className="text-[11px] font-bold text-purple-400 mb-1.5">💎 NGUYÊN LIỆU ĐÃ THU THẬP ({selectedAcc.materials?.length || 0}):</p>
                <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 flex flex-wrap gap-1.5 min-h-[42px]">
                  {selectedAcc.materials?.length > 0 ? selectedAcc.materials.map((m, i) => (
                    <span key={i} className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded text-[10px]">
                      {m.name} <strong className="text-purple-400">x{m.count}</strong>
                    </span>
                  )) : <span className="text-slate-500 italic">Trống</span>}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
              <p>Đồng bộ lúc: {new Date(selectedAcc.lastPing).toLocaleTimeString('vi-VN')}</p>
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
