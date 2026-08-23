import './globals.css';

export const metadata = {
  title: 'Roblox TrackStats',
  description: 'Tra cứu thông tin và chỉ số người chơi Roblox',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
