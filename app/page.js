'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Home() {
  const [userKey, setUserKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState(null);

  useEffect(() => {
    if (!activeKey) return;
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`/api/ping?key=${encodeURIComponent(activeKey)}`);
        const data = await res.json();
        if (data.accounts) setAccounts(data.accounts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccounts();
    const interval = setInterval(fetchAccounts, 5000);
    return () => clearInterval(interval);
  }, [activeKey]);

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-amber-400 tracking-wide uppercase">AOTWING UDUMXBOT</h1>
          <p className="text-xs text-slate-400">Quản Lý Trạng Thái Tài Khoản RBL Của Bạn</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (userKey.trim()) setActiveKey(userKey.trim()); }} className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={userKey}
            onChange={(e) => setUserKey(e.target.value)}
            placeholder="Nhập Key cá nhân..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs">
            Kết nối
          </button>
        </form>

        {activeKey && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map((acc) => {
              const isOnline = Date.now() - acc.lastPing < 60000;
              return (
                <div
                  key={acc.userId}
                  onClick={() => setSelectedAcc(acc)}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-3 cursor-pointer transition shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`} className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white truncate">{acc.username}</p>
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
        )}
      </div>

      {/* POPUP MODAL ĐỒNG BỘ ĐẦY ĐỦ VẬT PHẨM & PHỤ KIỆN */}
      {selectedAcc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-slate-200 relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${selectedAcc.userId}&width=150&height=150&format=png`} className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedAcc.username}</h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">ONLINE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Game: <span className="text-white">Blox Fruits</span> • Note: <span className="text-amber-400">{selectedAcc.note || 'PC-01'}</span> • ID: {selectedAcc.userId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAcc(null)} className="p-1.5 bg-slate-800/60 hover:bg-slate-700 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Overview */}
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

            {/* Character Specs */}
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

            {/* Inventory & Gear Details */}
            <div className="space-y-3 pt-2 text-xs">
              {/* Kho trái ác quỷ */}
              <div>
                <p className="text-[11px] font-bold text-amber-400 mb-2">🍍 KHO TRÁI ÁC QUỶ ({selectedAcc.inventoryFruits?.length || 0}):</p>
                <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-400 text-[11px]">
                  {selectedAcc.inventoryFruits?.length > 0 ? selectedAcc.inventoryFruits.map(f => `${f.name} x${f.count}`).join(', ') : 'Không có trái ác quỷ nào trong kho'}
                </div>
              </div>

              {/* Kiếm & Súng */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-300 mb-1">⚔️ KIẾM ĐÃ SỞ HỮU ({selectedAcc.swords?.length || 0}):</p>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-400 text-[11px] min-h-[50px]">
                    {selectedAcc.swords?.length > 0 ? selectedAcc.swords.map(s => s.name).join(', ') : 'Không có kiếm'}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-300 mb-1">🔫 SÚNG ĐÃ SỞ HỮU ({selectedAcc.guns?.length || 0}):</p>
                  <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-400 text-[11px] min-h-[50px]">
                    {selectedAcc.guns?.length > 0 ? selectedAcc.guns.map(g => g.name).join(', ') : 'Không có súng'}
                  </div>
                </div>
              </div>

              {/* Phụ kiện (Accessories) */}
              <div>
                <p className="text-[11px] font-bold text-cyan-400 mb-2">👑 PHỤ KIỆN ĐÃ SỞ HỮU ({selectedAcc.accessories?.length || 0}):</p>
                <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-400 text-[11px]">
                  {selectedAcc.accessories?.length > 0 ? selectedAcc.accessories.map(a => a.name).join(', ') : 'Không có phụ kiện nào'}
                </div>
              </div>

              {/* Nguyên liệu */}
              <div>
                <p className="text-[11px] font-bold text-purple-400 mb-2">💎 NGUYÊN LIỆU ĐÃ THU THẬP ({selectedAcc.materials?.length || 0}):</p>
                <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 flex flex-wrap gap-2">
                  {selectedAcc.materials?.length > 0 ? selectedAcc.materials.map((m, i) => (
                    <span key={i} className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-mono">
                      {m.name} <span className="text-amber-400 font-bold">x{m.count}</span>
                    </span>
                  )) : <span className="text-slate-500 text-[11px]">Chưa có nguyên liệu</span>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
              <p>Last sync: {new Date(selectedAcc.lastPing).toLocaleString('sv-SE')}</p>
              <button onClick={() => setSelectedAcc(null)} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-1.5 rounded-lg">
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
