'use client';

import { useState, useEffect } from 'react';
import { Key, RefreshCw, Radio, Gamepad2, Layers, DollarSign, Clock, ShieldCheck, Copy, Check } from 'lucide-react';

export default function Home() {
  const [userKey, setUserKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState('');

  // Tự động load dữ liệu mỗi 10 giây nếu đã nhập Key
  useEffect(() => {
    if (!activeKey) return;

    const fetchAccounts = async () => {
      try {
        const res = await fetch(`/api/ping?key=${encodeURIComponent(activeKey)}`);
        const data = await res.json();
        if (data.accounts) {
          setAccounts(data.accounts);
        }
      } catch (err) {
        console.error('Lỗi lấy danh sách acc:', err);
      }
    };

    fetchAccounts();
    const interval = setInterval(fetchAccounts, 10000); // 10s auto update
    return () => clearInterval(interval);
  }, [activeKey]);

  const handleConnectKey = (e) => {
    e.preventDefault();
    if (!userKey.trim()) return;
    setActiveKey(userKey.trim());
  };

  const isOnline = (lastPing) => {
    // Nếu ping trong vòng 2 phút (120,000 ms) -> Online
    return Date.now() - lastPing < 120000;
  };

  const copyScript = (account) => {
    const script = `game:GetService("TeleportService"):TeleportToPlaceInstance(${account.placeId}, "${account.jobId}", game.Players.LocalPlayer)`;
    navigator.clipboard.writeText(script);
    setCopiedId(account.userId);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1 rounded-full text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" /> QUẢN LÝ TÀI KHOẢN RBL
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            AOTWING <span className="text-amber-400">UdumXBoT</span>
          </h1>
          <p className="text-xs text-slate-400">Nhập Key cá nhân để theo dõi tất cả các tài khoản đang chạy Script.</p>
        </div>

        {/* Input Key Form */}
        <form onSubmit={handleConnectKey} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={userKey}
              onChange={(e) => setUserKey(e.target.value)}
              placeholder="Nhập Key của bạn (Ví dụ: mysecretkey123)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <Key className="absolute left-3 top-3.5 text-slate-500 w-4 h-4" />
          </div>
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition flex items-center gap-1.5"
          >
            Kết nối
          </button>
        </form>

        {/* Active Accounts Dashboard */}
        {activeKey && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <div>
                <p className="text-xs text-slate-400">Đang theo dõi với Key:</p>
                <p className="text-sm font-bold text-amber-400 font-mono">{activeKey}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Tổng tài khoản đang treo:</p>
                <p className="text-lg font-black text-white">{accounts.length} Acc</p>
              </div>
            </div>

            {/* Account List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((acc) => {
                const online = isOnline(acc.lastPing);
                return (
                  <div key={acc.userId} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                    {/* Header Acc Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://www.roblox.com/headshot-thumbnail/image?userId=${acc.userId}&width=150&height=150&format=png`}
                        alt={acc.username}
                        className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-white truncate">{acc.username}</p>
                        <p className="text-[10px] text-slate-500 font-mono">ID: {acc.userId}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                        online 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                        {online ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>

                    {/* Stats Info */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Cấp độ (Level)</p>
                        <p className="font-bold text-amber-400">Lv. {acc.level}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Trái quỷ (Fruit)</p>
                        <p className="font-bold text-emerald-400 truncate">{acc.fruit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Beli</p>
                        <p className="font-bold text-slate-200">${acc.beli.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Fragments</p>
                        <p className="font-bold text-purple-400">ƒ {acc.fragments.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> 
                        {Math.floor((Date.now() - acc.lastPing) / 1000)}s trước
                      </span>

                      {acc.jobId && (
                        <button
                          onClick={() => copyScript(acc)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 text-[10px] font-bold transition"
                        >
                          {copiedId === acc.userId ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          {copiedId === acc.userId ? 'Đã chép Job Script' : 'Chép Join Script'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {accounts.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
                Chưa có tài khoản nào gửi Ping về với Key <span className="text-amber-400 font-mono font-bold">{activeKey}</span>. Hãy chạy Script trong Roblox!
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
