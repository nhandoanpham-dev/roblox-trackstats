'use client';

import { useState, useEffect } from 'react';
import { Search, Server, Activity, DollarSign, Award, RefreshCw, Bell, Zap, Radio, Shield, Copy, Check } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({ accounts: [], onlineCount: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Auto-refresh dữ liệu mỗi 3 giây
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/tracker');
      const resData = await res.json();
      if (resData.success) {
        setData(resData);
      }
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  // Tính tổng chỉ số
  const totalLevel = data.accounts.reduce((sum, a) => sum + (a.level || 0), 0);
  const totalBeli = data.accounts.reduce((sum, a) => sum + (a.beli || 0), 0);

  const filteredAccounts = data.accounts.filter(a =>
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    a.gameName.toLowerCase().includes(search.toLowerCase())
  );

  // Script Lua mẫu để người dùng copy
  const luaCodeSnippet = `_G.SERVER_API = "${typeof window !== 'undefined' ? window.location.origin : ''}/api/tracker"
_G.DISCORD_WEBHOOK = "${webhookUrl || 'NHAP_DISCORD_WEBHOOK_TAI_DAY'}"
loadstring(game:HttpGet("https://raw.githubusercontent.com/nhandoanpham-dev/roblox-trackstats/main/tracker.lua"))()`;

  const copyLuaScript = () => {
    navigator.clipboard.writeText(luaCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE TRACKER SYSTEM
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            ROBLOX <span className="text-amber-500">ACCOUNT MANAGER</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Theo dõi trạng thái, chỉ số & tự động báo cáo các Acc đang treo</p>
        </div>

        <button
          onClick={fetchStats}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Đang kết nối</span>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-black text-white">{data.onlineCount} <span className="text-xs font-normal text-slate-500">/ {data.count} Acc</span></p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng Beli / Tiền</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">${totalBeli.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng Level</span>
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalLevel.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Máy chủ Game</span>
            <Server className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white">{new Set(data.accounts.map(a => a.gameName)).size} <span className="text-xs font-normal text-slate-500">Games</span></p>
        </div>
      </div>

      {/* Search & Configuration Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Cấu hình Script gửi về Game
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Dán Discord Webhook URL (Tùy chọn)..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <button
            onClick={copyLuaScript}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Đã copy Script!' : 'Copy Script Lua nhúng vào Executor'}
          </button>
        </div>
      </div>

      {/* Accounts List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" /> Danh sách Tài khoản ({filteredAccounts.length})
          </h2>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm theo Username hoặc Game..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 pl-9 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-500 w-3.5 h-3.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Tài khoản</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Trò chơi</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Beli / Tiền</th>
                <th className="py-3.5 px-4">Trái / Item</th>
                <th className="py-3.5 px-4 text-right">Cập nhật cuối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((acc) => {
                  const secondsAgo = Math.floor((Date.now() - acc.lastSeen) / 1000);
                  return (
                    <tr key={acc.userId} className="hover:bg-slate-800/30 transition">
                      {/* Avatar & User */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={acc.avatarUrl}
                            alt={acc.username}
                            className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 object-cover"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{acc.username}</p>
                            <p className="text-[11px] text-slate-500">ID: {acc.userId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          acc.isOnline
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${acc.isOnline ? 'bg-green-400 animate-ping' : 'bg-red-400'}`}></span>
                          {acc.status}
                        </span>
                      </td>

                      {/* Game */}
                      <td className="py-3 px-4 font-medium text-slate-300">
                        {acc.gameName}
                      </td>

                      {/* Level */}
                      <td className="py-3 px-4">
                        <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-bold text-amber-400">
                          Lv. {acc.level.toLocaleString()}
                        </span>
                      </td>

                      {/* Beli */}
                      <td className="py-3 px-4 font-bold text-green-400">
                        ${acc.beli.toLocaleString()}
                      </td>

                      {/* Fruit / Item */}
                      <td className="py-3 px-4 text-xs text-slate-300">
                        {acc.fruit}
                      </td>

                      {/* Last Seen */}
                      <td className="py-3 px-4 text-right text-xs text-slate-500">
                        {secondsAgo < 5 ? 'Vừa xong' : `${secondsAgo}s trước`}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-500 text-sm">
                    Chưa có tài khoản nào kết nối. Hãy chạy Script Lua trong Game để bắt đầu nhận dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
