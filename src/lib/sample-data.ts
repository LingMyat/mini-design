export function generateRandomToken(length = 25): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') || 'showcase';
}

// Sample HTML screens matching the user's uploaded mockup:
export const samplePagesHtml = [
  {
    name: "Cyberpunk - Storefront",
    html_code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .neon-glow { box-shadow: 0 0 15px rgba(217, 70, 239, 0.4); }
  </style>
</head>
<body class="bg-[#0b0c16] text-white min-h-screen p-4 pb-20 select-none">
  <!-- Top Bar -->
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-xs">CM</div>
      <span class="font-bold text-sm tracking-wide">CM Digital Store</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="bg-[#17192b] border border-purple-900/50 px-2.5 py-1 rounded-full text-xs font-semibold text-purple-300">
        🪙 24,500 <span class="text-gray-400 text-[10px]">MMK</span>
      </div>
      <button class="w-8 h-8 rounded-full bg-[#17192b] border border-gray-800 flex items-center justify-center text-gray-300">🔍</button>
    </div>
  </div>

  <!-- Hero Promo Banner -->
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/80 via-indigo-950 to-pink-900/80 p-4 border border-purple-500/30 mb-4 shadow-xl">
    <div class="relative z-10">
      <span class="bg-pink-600/90 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Hot Promo</span>
      <h2 class="text-lg font-black mt-2 leading-tight">Cyberpunk 2077: Phantom Liberty</h2>
      <p class="text-xs text-purple-200 mt-1">Instant delivery · 20% Cashback</p>
      <button class="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg neon-glow">
        Top Up Now
      </button>
    </div>
    <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
  </div>

  <!-- Quick Action Grid -->
  <div class="grid grid-cols-4 gap-2 mb-5">
    <div class="bg-[#141627] border border-gray-800/80 rounded-xl p-2.5 text-center">
      <div class="w-9 h-9 mx-auto rounded-lg bg-purple-950/80 flex items-center justify-center text-lg mb-1">🎮</div>
      <span class="text-[10px] text-gray-300">Games</span>
    </div>
    <div class="bg-[#141627] border border-gray-800/80 rounded-xl p-2.5 text-center">
      <div class="w-9 h-9 mx-auto rounded-lg bg-pink-950/80 flex items-center justify-center text-lg mb-1">💳</div>
      <span class="text-[10px] text-gray-300">Cards</span>
    </div>
    <div class="bg-[#141627] border border-gray-800/80 rounded-xl p-2.5 text-center">
      <div class="w-9 h-9 mx-auto rounded-lg bg-indigo-950/80 flex items-center justify-center text-lg mb-1">⚡</div>
      <span class="text-[10px] text-gray-300">Direct</span>
    </div>
    <div class="bg-[#141627] border border-gray-800/80 rounded-xl p-2.5 text-center">
      <div class="w-9 h-9 mx-auto rounded-lg bg-blue-950/80 flex items-center justify-center text-lg mb-1">🎁</div>
      <span class="text-[10px] text-gray-300">Voucher</span>
    </div>
  </div>

  <!-- Popular Games Section -->
  <div class="mb-3 flex items-center justify-between">
    <h3 class="text-sm font-bold text-gray-200">Popular Games</h3>
    <span class="text-xs text-purple-400 font-medium">View all</span>
  </div>

  <div class="grid grid-cols-3 gap-2.5">
    <div class="bg-[#131525] border border-gray-800/70 rounded-xl p-2 flex flex-col items-center">
      <div class="w-full h-20 rounded-lg bg-gradient-to-b from-indigo-800 to-purple-950 flex items-center justify-center text-2xl shadow-inner mb-2">⚔️</div>
      <span class="text-[11px] font-bold text-gray-200 text-center">MLBB</span>
      <span class="text-[9px] text-purple-400 mt-0.5">Instant</span>
    </div>
    <div class="bg-[#131525] border border-gray-800/70 rounded-xl p-2 flex flex-col items-center">
      <div class="w-full h-20 rounded-lg bg-gradient-to-b from-red-900 to-zinc-950 flex items-center justify-center text-2xl shadow-inner mb-2">🎯</div>
      <span class="text-[11px] font-bold text-gray-200 text-center">PUBG Mobile</span>
      <span class="text-[9px] text-purple-400 mt-0.5">Fast ID</span>
    </div>
    <div class="bg-[#131525] border border-gray-800/70 rounded-xl p-2 flex flex-col items-center">
      <div class="w-full h-20 rounded-lg bg-gradient-to-b from-emerald-800 to-teal-950 flex items-center justify-center text-2xl shadow-inner mb-2">✨</div>
      <span class="text-[11px] font-bold text-gray-200 text-center">Genshin</span>
      <span class="text-[9px] text-purple-400 mt-0.5">Blessing</span>
    </div>
  </div>

  <!-- Bottom Navigation -->
  <div class="fixed bottom-0 left-0 right-0 bg-[#0d0e1c]/95 backdrop-blur-md border-t border-gray-800/80 px-6 py-2.5 flex justify-between items-center text-[10px] text-gray-400">
    <div class="flex flex-col items-center text-purple-400 font-bold">
      <span class="text-base">🏠</span>
      <span>Home</span>
    </div>
    <div class="flex flex-col items-center">
      <span class="text-base">💳</span>
      <span>Top Up</span>
    </div>
    <div class="flex flex-col items-center">
      <span class="text-base">📜</span>
      <span>Orders</span>
    </div>
    <div class="flex flex-col items-center">
      <span class="text-base">💬</span>
      <span>Messages</span>
    </div>
    <div class="flex flex-col items-center">
      <span class="text-base">👤</span>
      <span>Account</span>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: "Design 1 - Top Up Wallet",
    html_code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0b0c16] text-white min-h-screen p-4 pb-20 select-none">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-5">
    <button class="w-8 h-8 rounded-full bg-[#17192b] border border-gray-800 flex items-center justify-center text-sm">←</button>
    <h1 class="text-base font-bold">Top up your wallet</h1>
  </div>

  <!-- Current Balance Card -->
  <div class="bg-gradient-to-br from-[#181a30] to-[#121424] border border-purple-900/40 rounded-2xl p-4 mb-4 shadow-lg">
    <span class="text-xs text-gray-400">Current Balance</span>
    <div class="text-2xl font-black mt-1 text-white flex items-baseline gap-1">
      24,500 <span class="text-sm font-normal text-purple-400">MMK</span>
    </div>
  </div>

  <!-- Choose Amount -->
  <h3 class="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Select Amount</h3>
  <div class="grid grid-cols-3 gap-2.5 mb-5">
    <div class="bg-[#141629] border border-purple-500/60 rounded-xl p-3 text-center cursor-pointer shadow-md bg-purple-950/20">
      <div class="text-sm font-bold text-white">5,000</div>
      <div class="text-[10px] text-purple-300 mt-0.5">MMK</div>
    </div>
    <div class="bg-[#141629] border border-gray-800 rounded-xl p-3 text-center cursor-pointer hover:border-gray-700">
      <div class="text-sm font-bold text-white">10,000</div>
      <div class="text-[10px] text-gray-400 mt-0.5">MMK</div>
    </div>
    <div class="bg-[#141629] border border-gray-800 rounded-xl p-3 text-center cursor-pointer hover:border-gray-700">
      <div class="text-sm font-bold text-white">25,000</div>
      <div class="text-[10px] text-gray-400 mt-0.5">MMK</div>
    </div>
    <div class="bg-[#141629] border border-gray-800 rounded-xl p-3 text-center cursor-pointer hover:border-gray-700">
      <div class="text-sm font-bold text-white">50,000</div>
      <div class="text-[10px] text-gray-400 mt-0.5">MMK</div>
    </div>
    <div class="bg-[#141629] border border-gray-800 rounded-xl p-3 text-center cursor-pointer hover:border-gray-700">
      <div class="text-sm font-bold text-white">100,000</div>
      <div class="text-[10px] text-gray-400 mt-0.5">MMK</div>
    </div>
    <div class="bg-[#141629] border border-gray-800 rounded-xl p-3 text-center cursor-pointer hover:border-gray-700 flex flex-col justify-center">
      <div class="text-xs font-semibold text-purple-400">Custom</div>
    </div>
  </div>

  <!-- Payment Method -->
  <h3 class="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Payment Method</h3>
  <div class="bg-[#141629] border border-purple-500/50 rounded-xl p-3 mb-2 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs">KBZ</div>
      <div>
        <div class="text-xs font-bold">KBZPay</div>
        <div class="text-[10px] text-gray-400">09 987 **** 321</div>
      </div>
    </div>
    <span class="text-purple-400 text-xs">● Active</span>
  </div>

  <!-- Upload Payment Proof -->
  <div class="border-2 border-dashed border-gray-800 hover:border-purple-600/50 rounded-2xl p-5 text-center mt-4">
    <div class="text-2xl mb-1">📤</div>
    <div class="text-xs font-semibold text-gray-300">Upload payment receipt screenshot</div>
    <div class="text-[10px] text-gray-500 mt-0.5">JPG or PNG up to 5MB</div>
  </div>

  <!-- Action Button -->
  <button class="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-purple-900/30">
    Confirm & Top Up
  </button>
</body>
</html>`
  },
  {
    name: "Design 1 - Orders History",
    html_code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0b0c16] text-white min-h-screen p-4 pb-20 select-none">
  <!-- Header -->
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-base font-bold">Your orders</h1>
    <button class="text-xs text-purple-400">Filter</button>
  </div>

  <!-- Filter Tabs -->
  <div class="flex gap-2 mb-4 overflow-x-auto pb-1 text-xs">
    <button class="bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium">All (14)</button>
    <button class="bg-[#15172b] border border-gray-800 text-gray-300 px-3 py-1.5 rounded-lg font-medium">Completed</button>
    <button class="bg-[#15172b] border border-gray-800 text-gray-300 px-3 py-1.5 rounded-lg font-medium">Processing</button>
  </div>

  <!-- Order Items List -->
  <div class="space-y-3">
    <!-- Item 1 -->
    <div class="bg-[#131526] border border-gray-800/80 rounded-xl p-3">
      <div class="flex justify-between items-start mb-2">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-lg bg-indigo-950 flex items-center justify-center text-lg">⚔️</div>
          <div>
            <div class="text-xs font-bold text-white">Mobile Legends 296 Diamonds</div>
            <div class="text-[10px] text-gray-400">Zone ID: 8943 · User: Kaung_99</div>
          </div>
        </div>
        <span class="text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">Done</span>
      </div>
      <div class="border-t border-gray-800/60 pt-2 flex justify-between items-center text-[11px] text-gray-400">
        <span>Today, 14:20</span>
        <span class="font-bold text-white">12,500 MMK</span>
      </div>
    </div>

    <!-- Item 2 -->
    <div class="bg-[#131526] border border-gray-800/80 rounded-xl p-3">
      <div class="flex justify-between items-start mb-2">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-lg bg-amber-950 flex items-center justify-center text-lg">🎯</div>
          <div>
            <div class="text-xs font-bold text-white">PUBG Mobile 660 UC</div>
            <div class="text-[10px] text-gray-400">Player ID: 51209384</div>
          </div>
        </div>
        <span class="text-[10px] bg-yellow-950/80 border border-yellow-500/40 text-yellow-300 px-2 py-0.5 rounded-full font-semibold">Pending</span>
      </div>
      <div class="border-t border-gray-800/60 pt-2 flex justify-between items-center text-[11px] text-gray-400">
        <span>Yesterday, 21:05</span>
        <span class="font-bold text-white">28,000 MMK</span>
      </div>
    </div>

    <!-- Item 3 -->
    <div class="bg-[#131526] border border-gray-800/80 rounded-xl p-3">
      <div class="flex justify-between items-start mb-2">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-lg bg-red-950 flex items-center justify-center text-lg">🔥</div>
          <div>
            <div class="text-xs font-bold text-white">Free Fire 1080 Diamonds</div>
            <div class="text-[10px] text-gray-400">UID: 93821049</div>
          </div>
        </div>
        <span class="text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">Done</span>
      </div>
      <div class="border-t border-gray-800/60 pt-2 flex justify-between items-center text-[11px] text-gray-400">
        <span>Nov 15, 11:30</span>
        <span class="font-bold text-white">16,000 MMK</span>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: "Design 1 - Messages & Inbox",
    html_code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0b0c16] text-white min-h-screen p-4 pb-20 select-none">
  <!-- Header -->
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-base font-bold">Messages</h1>
    <span class="text-xs text-gray-400">Mark all read</span>
  </div>

  <div class="space-y-3">
    <!-- Notice 1 -->
    <div class="bg-[#131526] border border-purple-500/30 rounded-xl p-3.5 flex gap-3">
      <div class="w-9 h-9 rounded-full bg-purple-900/60 flex items-center justify-center text-base shrink-0">📦</div>
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <div class="text-xs font-bold text-purple-200">Your order is ready</div>
          <span class="text-[9px] text-gray-500">2m ago</span>
        </div>
        <p class="text-[11px] text-gray-400 mt-1 leading-snug">Top up 296 Diamonds for MLBB is completed and credited to your account Kaung_99.</p>
      </div>
    </div>

    <!-- Notice 2 -->
    <div class="bg-[#131526] border border-gray-800/70 rounded-xl p-3.5 flex gap-3">
      <div class="w-9 h-9 rounded-full bg-emerald-950 flex items-center justify-center text-base shrink-0">✅</div>
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <div class="text-xs font-bold text-white">Top-up Approved</div>
          <span class="text-[9px] text-gray-500">1h ago</span>
        </div>
        <p class="text-[11px] text-gray-400 mt-1 leading-snug">KBZPay payment of 24,500 MMK was verified successfully.</p>
      </div>
    </div>

    <!-- Notice 3 -->
    <div class="bg-[#131526] border border-gray-800/70 rounded-xl p-3.5 flex gap-3">
      <div class="w-9 h-9 rounded-full bg-pink-950 flex items-center justify-center text-base shrink-0">🎁</div>
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <div class="text-xs font-bold text-white">Weekend Special Discount</div>
          <span class="text-[9px] text-gray-500">1d ago</span>
        </div>
        <p class="text-[11px] text-gray-400 mt-1 leading-snug">Get up to 15% bonus diamonds when topping up through WavePay this weekend.</p>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: "Design 1 - Account & Settings",
    html_code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0b0c16] text-white min-h-screen p-4 pb-20 select-none">
  <!-- Header -->
  <div class="flex items-center justify-between mb-5">
    <h1 class="text-base font-bold">Your account</h1>
    <button class="text-gray-400 text-lg">⚙️</button>
  </div>

  <!-- Profile Card -->
  <div class="bg-[#131527] border border-gray-800 rounded-2xl p-4 mb-4 flex items-center gap-3.5">
    <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-lg font-bold">
      AL
    </div>
    <div class="flex-1">
      <div class="text-sm font-bold text-white">Alex Lin</div>
      <div class="text-xs text-gray-400">alexlin.gaming@gmail.com</div>
    </div>
  </div>

  <!-- Balance Quick Actions -->
  <div class="bg-[#14162a] border border-purple-900/40 rounded-xl p-3.5 mb-5 flex items-center justify-between">
    <div>
      <div class="text-[10px] text-gray-400">Available Wallet</div>
      <div class="text-lg font-black text-white mt-0.5">24,500 <span class="text-xs text-purple-400">MMK</span></div>
    </div>
    <button class="bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow">Top Up</button>
  </div>

  <!-- Settings Menu -->
  <div class="space-y-2">
    <div class="bg-[#131527] border border-gray-800/80 rounded-xl p-3 flex justify-between items-center text-xs">
      <div class="flex items-center gap-3">
        <span>🛡️</span>
        <span>Account security</span>
      </div>
      <span class="text-gray-500">→</span>
    </div>

    <div class="bg-[#131527] border border-gray-800/80 rounded-xl p-3 flex justify-between items-center text-xs">
      <div class="flex items-center gap-3">
        <span>💳</span>
        <span>Manage payment accounts</span>
      </div>
      <span class="text-gray-500">→</span>
    </div>

    <div class="bg-[#131527] border border-gray-800/80 rounded-xl p-3 flex justify-between items-center text-xs">
      <div class="flex items-center gap-3">
        <span>📱</span>
        <span>Signed-in devices</span>
      </div>
      <span class="text-gray-500">→</span>
    </div>

    <div class="bg-[#131527] border border-gray-800/80 rounded-xl p-3 flex justify-between items-center text-xs">
      <div class="flex items-center gap-3">
        <span>🎧</span>
        <span>Contact support</span>
      </div>
      <span class="text-gray-500">→</span>
    </div>
  </div>
</body>
</html>`
  }
];

export const initialDemoTemplate = {
  id: "demo-cyberpunk-store",
  name: "Cyberpunk Digital Store",
  slug: "cyberpunk-store",
  token: "c7x9p2k8m4n1q5w6e0r3t7y8u",
  device_frame: "mobile" as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  pages: samplePagesHtml.map((p, idx) => ({
    id: `demo-page-${idx + 1}`,
    template_id: "demo-cyberpunk-store",
    name: p.name,
    html_code: p.html_code,
    sort_order: idx,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))
};
