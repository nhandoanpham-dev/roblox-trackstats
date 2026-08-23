'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Wifi, X } from 'lucide-react';

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
        if (data.accounts) setAccounts(data.accounts);
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchAccounts();

    const interval = setInterval(fetchAccounts, 5000);
    return () => clearInterval(interval);
  }, [activeKey]);

  const handleConnect = (e) => {
    e.preventDefault();
    if (userKey.trim()) {
      setActiveKey(userKey.trim());
    }
  };

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-amber-400 tracking-wide uppercase">AOTWING UDUMXBOT</h1>
          <p className="text-xs text-slate-400">Quản Lý Trạng Thái Tài Khoản RBL Của Bạn</p>
        </div>

        {/* Form nhập Key */}
        <form onSubmit={handleConnect} className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={userKey}
            onChange={(e) => setUserKey(e.target.value)}
            placeholder="Nhập Key cá nhân (ví dụ: aotwing5612)..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition">
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            Kết nối
          </button>
        </form>

        {/* Trạng thái Kết nối */}
        {activeKey && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-3 rounded-xl max-w-md mx-auto text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <Wifi className="w-4 h-4 text-emerald-400" /> Key đang xem: <strong className="text-amber-400 font-mono">{activeKey}</strong>
              </span>
              <span className="text-[10px] text-slate-500">Tự động làm mới mỗi 5s</span>
            </div>

            {/* Trường hợp đang kết nối lần đầu */}
            {loading && accounts.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> Đang tải dữ liệu từ server...
              </div>
            )}

            {/* Trường hợp chưa nhận được dữ liệu từ Roblox */}
            {!loading && accounts.length === 0 && (
              <div className="max-w-md mx-auto bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center space-y-2 text-xs text-amber-200">
                <AlertCircle className="w-5 h-5 mx-auto text-amber-400" />
                <p className="font-bold">Chưa tìm thấy tài khoản nào cho Key "{activeKey}"</p>
                <p className="text-[11px] text-slate-400">
                  Hãy mở game Roblox, chạy Script Lua và nhập chính xác Key <span className="text-amber-400 font-mono">{activeKey}</span> để gửi dữ liệu về đây.
                </p>
              </div>
            )}

            {/* Danh sách tài khoản khi đã có dữ liệu */}
            {accounts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {accounts.map((acc) => {
                  const isOnline = Date.now() - acc.lastPing < 60000;
                  return (
                    <div
                      key={acc.userId}
                      onClick={() => setSelectedAcc(acc)}
                      className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-3 cursor-pointer transition shadow-lg relative overflow-hidden"
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
        )}
      </div>

      {/* POPUP MODAL xem chi tiết */}
      {selectedAcc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <img src={`https://www.roblox.com/headshot-thumbnail/image?userId=${selectedAcc.userId}&width=150&height=150&format=png`} className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedAcc.username}</h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">ONLINE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Game: Blox Fruits • ID: {selectedAcc.userId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAcc(null)} className="p-1.5 bg-slate-800/60 hover:bg-slate-700 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-500 font-bold">LEVEL</p>
                <p className="text-lg font-black text-white">{selectedAcc.level}</p>
              </div>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-500 font-bold">BELI</p>
                <p className="text-lg font-black text-emerald-400">${(selectedAcc.beli || 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-500 font-bold">FRAGMENTS</p>
                <p className="text-lg font-black text-purple-400">ƒ {(selectedAcc.fragments || 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-500 font-bold">BOUNTY</p>
                <p className="text-lg font-black text-amber-400">{(selectedAcc.bounty || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-amber-400 font-bold">🍍 Trái ác quỷ trong kho:</p>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-400">
                {selectedAcc.inventoryFruits?.length > 0 ? selectedAcc.inventoryFruits.map(f => `${f.name} x${f.count}`).join(', ') : 'Trống'}
              </div>

              <p className="text-cyan-400 font-bold">👑 Phụ kiện đã sở hữu:</p>
              <div className="bg-[#111625] p-3 rounded-xl border border-slate-800/80 text-slate-400">
                {selectedAcc.accessories?.length > 0 ? selectedAcc.accessories.map(a => a.name).join(', ') : 'Trống'}
              </div>
            </div>

            <div className="text-right pt-2">
              <button onClick={() => setSelectedAcc(null)} className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
