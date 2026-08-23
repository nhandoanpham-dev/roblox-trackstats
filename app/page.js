'use client';

import { useState } from 'react';
import { Search, Users, UserPlus, UserCheck, Calendar, ShieldAlert } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/roblox?username=${encodeURIComponent(username)}`);
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Đã có lỗi xảy ra');
      }

      setData(resData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          ROBLOX <span className="text-red-500">TRACKSTATS</span>
        </h1>
        <p className="text-slate-400">Tra cứu chỉ số và thông tin người chơi Roblox nhanh chóng</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-10">
        <div className="relative flex-1">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập Username Roblox..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
          />
          <Search className="absolute left-3.5 top-3.5 text-slate-500 w-5 h-5" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium px-6 py-3 rounded-xl transition flex items-center justify-center min-w-[100px]"
        >
          {loading ? 'Đang tải...' : 'Tra cứu'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-center mb-8 max-w-lg mx-auto">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={data.avatarUrl || 'https://via.placeholder.com/150'}
              alt={data.username}
              className="w-28 h-28 rounded-2xl bg-slate-800 border-2 border-slate-700 object-cover"
            />
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-white">{data.displayName}</h2>
                {data.isBanned && (
                  <span className="bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Banned
                  </span>
                )}
              </div>
              <p className="text-slate-400">@{data.username}</p>
              <p className="text-xs text-slate-500 font-mono pt-1">ID: {data.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 text-center">
              <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{data.friendsCount.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Bạn bè</p>
            </div>
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 text-center">
              <UserPlus className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{data.followersCount.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Người theo dõi</p>
            </div>
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 text-center">
              <UserCheck className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{data.followingsCount.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Đang theo dõi</p>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mô tả tài khoản</h3>
              <p className="text-sm text-slate-300 bg-slate-950/30 rounded-xl p-4 border border-slate-800/50 whitespace-pre-wrap">
                {data.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Ngày tạo tài khoản: {new Date(data.created).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
