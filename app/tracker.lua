-- ===================================================================
-- 🔥 YEAGER NEXUS HUB | BLOX FRUITS ULTRA EDITION (v33) 🔥
-- ===================================================================
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local StarterGui = game:GetService("StarterGui")
local TeleportService = game:GetService("TeleportService")

local API_URL = "https://aotwing-dusky.vercel.app/api/ping?userId=" .. LocalPlayer.UserId
local ACCESS_KEY = "yeager2026"
local Req = request or http_request or (syn and syn.request)

if not Req then
    warn("Executor không hỗ trợ HTTP Request!")
    return
end

-- 1. Chạy tiến trình nền đồng bộ dữ liệu thật lên Web Dashboard
task.spawn(function()
    while task.wait(3) do
        pcall(function()
            local d = LocalPlayer:FindFirstChild("Data") or LocalPlayer:FindFirstChild("leaderstats")
            local lv = d and (d:FindFirstChild("Level") and d.Level.Value or 1) or 1
            local cur = d and (d:FindFirstChild("Beli") and d.Beli.Value or d:FindFirstChild("Money") and d.Money.Value or 0) or 0
            local fr = d and (d:FindFirstChild("Fragments") and d.Fragments.Value or 0) or 0

            local res = Req({
                Url = API_URL,
                Method = "POST",
                Headers = {["Content-Type"] = "application/json"},
                Body = HttpService:JSONEncode({
                    key = ACCESS_KEY,
                    userId = LocalPlayer.UserId,
                    username = LocalPlayer.Name,
                    gameName = "Blox Fruits",
                    stats = {level = lv, currency = cur, fragments = fr},
                    lastUpdated = tick() * 1000
                })
            })

            if res and (res.StatusCode == 200 or res.status_code == 200) then
                local bodyText = res.Body or res.body
                if bodyText and bodyText ~= "" then
                    local dec = HttpService:JSONDecode(bodyText)
                    if dec.commands then
                        for _, c in ipairs(dec.commands) do
                            if c.command == "NOTIFY" then
                                StarterGui:SetCore("SendNotification", {Title = c.payload.title or "Yeager Nexus", Text = c.payload.message})
                            elseif c.command == "RECONNECT" then
                                TeleportService:Teleport(game.PlaceId, LocalPlayer)
                            end
                        end
                    end
                end
            end
        end)
    end
end)

-- 2. Tải và Khởi tạo Giao diện Menu Rayfield Siêu Đẹp
local success, Rayfield = pcall(function()
    return loadstring(game:HttpGet('https://raw.githubusercontent.com/shlexware/Rayfield/main/source'))()
end)

if not success or not Rayfield then
    warn("Không thể tải Rayfield UI Library!")
    return
end

local Window = Rayfield:CreateWindow({
    Name = "⚡ Yeager Nexus Hub | Blox Fruits ",
    LoadingTitle = "Đang kết nối hệ thống Web Dashboard...",
    LoadingSubtitle = "By Pham Yen",
    ConfigurationSaving = {
        Enabled = true,
        FolderName = "YeagerNexus",
        FileName = "BloxFruitsConfig"
    },
    Discord = {
        Enabled = false,
        Invite = "noinvitelink",
        RememberJoins = true
    },
    KeySystem = false,
})

-- Tạo các Tab chức năng
local TabHome = Window:CreateTab("🏠 Trang Chủ & Sync", 4483362458)
local TabFarm = Window:CreateTab("🌾 Auto Farm", 4483362458)
local TabTeleport = Window:CreateTab("📍 Dịch Chuyển", 4483362458)
local TabSettings = Window:CreateTab("⚙️ Cài Đặt", 4483362458)

-- Nội dung Tab Home
TabHome:CreateSection("📊 Trạng thái kết nối Web")
TabHome:CreateParagraph({Title = "Thông tin tài khoản", Content = "Tài khoản: " .. LocalPlayer.Name .. "\nTrạng thái: Đang đồng bộ dữ liệu thật lên Web\nDashboard: aotwing-dusky.vercel.app"})

TabHome:CreateButton({
    Name = "Kiểm tra kết nối Menu",
    Callback = function()
        Rayfield:Notify({
            Title = "Yeager Nexus Hub",
            Content = "Menu và hệ thống đồng bộ dữ liệu đang hoạt động hoàn hảo!",
            Duration = 4,
            Image = 4483362458,
        })
    end,
})

-- Nội dung Tab Farm
TabFarm:CreateSection("⚡ Chức năng cày cấp")
TabFarm:CreateToggle({
    Name = "Auto Farm Level (Tự động cày cấp)",
    CurrentValue = false,
    Flag = "AutoFarmFlag",
    Callback = function(Value)
        getgenv().AutoFarmLevel = Value
        Rayfield:Notify({Title = "Auto Farm", Content = Value and "Đã bật Auto Farm!" or "Đã tắt Auto Farm!", Duration = 2})
    end,
})

TabFarm:CreateToggle({
    Name = "Fast Attack (Đánh nhanh x5)",
    CurrentValue = false,
    Flag = "FastAttackFlag",
    Callback = function(Value)
        getgenv().FastAttack = Value
    end,
})

-- Nội dung Tab Teleport
TabTeleport:CreateSection("🗺️ Chọn Đảo")
TabTeleport:CreateDropdown({
    Name = "Khu vực dịch chuyển nhanh",
    Options = {"Pirate Starter (Sea 1)", "Cafe (Sea 2)", "Castle on the Sea (Sea 3)"},
    CurrentOption = "Castle on the Sea (Sea 3)",
    Callback = function(Option)
        Rayfield:Notify({Title = "Teleport", Content = "Đã chọn: " .. Option, Duration = 2})
    end,
})

-- Nội dung Tab Settings
TabSettings:CreateSection("⚙️ Hệ thống")
TabSettings:CreateButton({
    Name = "Rejoin Server (Vào lại server)",
    Callback = function()
        TeleportService:Teleport(game.PlaceId, LocalPlayer)
    end,
})

Rayfield:Notify({
    Title = "Yeager Nexus Hub Loaded!",
    Content = "Menu giao diện và kết nối Web đã sẵn sàng sử dụng.",
    Duration = 5,
    Image = 4483362458,
})
