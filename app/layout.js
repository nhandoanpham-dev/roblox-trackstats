export const metadata = {
  title: 'UdumXBot',
  description: 'Quản Lý Tài Khoản Roblox Của Bạn',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
