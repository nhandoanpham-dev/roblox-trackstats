-- ===================================================
-- TRACKSTATS AUTO PINGER WITH GUI MENU
-- ===================================================

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local CoreGui = game:GetService("CoreGui")
local LocalPlayer = Players.LocalPlayer

local VERCEL_API_URL = "https://aotwing-dusky.vercel.app/api/ping"
local PING_INTERVAL = 15

-- 1. TẠO GIAO DIỆN MENU NHẬP KEY
local ScreenGui = Instance.new("ScreenGui")
local MainFrame = Instance.new("Frame")
local Title = Instance.new("TextLabel")
local KeyInput = Instance.new("TextBox")
local SubmitBtn = Instance.new("TextButton")

ScreenGui.Name = "TrackStatsKeyUI"
ScreenGui.Parent = CoreGui or LocalPlayer:WaitForChild("PlayerGui")

MainFrame.Name = "MainFrame"
MainFrame.Parent = ScreenGui
MainFrame.BackgroundColor3 = Color3.fromRGB(15, 23, 42)
MainFrame.Position = UDim2.new(0.5, -150, 0.4, -75)
MainFrame.Size = UDim2.new(0, 300, 0, 160)
MainFrame.Active = true
MainFrame.Draggable = true

local FrameCorner = Instance.new("UICorner")
FrameCorner.CornerRadius = UDim.new(0, 12)
FrameCorner.Parent = MainFrame

Title.Parent = MainFrame
Title.BackgroundTransparency = 1
Title.Position = UDim2.new(0, 0, 0, 10)
Title.Size = UDim2.new(1, 0, 0, 30)
Title.Font = Enum.Font.GothamBold
Title.Text = "TRACKSTATS - NHẬP KEY"
Title.TextColor3 = Color3.fromRGB(245, 158, 11)
Title.TextSize = 14

KeyInput.Parent = MainFrame
KeyInput.BackgroundColor3 = Color3.fromRGB(30, 41, 59)
KeyInput.Position = UDim2.new(0.1, 0, 0.35, 0)
KeyInput.Size = UDim2.new(0.8, 0, 0, 35)
KeyInput.Font = Enum.Font.Gotham
KeyInput.PlaceholderText = "Dán Key từ Web vào đây..."
KeyInput.Text = ""
KeyInput.TextColor3 = Color3.fromRGB(255, 255, 255)
KeyInput.TextSize = 12

local InputCorner = Instance.new("UICorner")
InputCorner.CornerRadius = UDim.new(0, 8)
InputCorner.Parent = KeyInput

SubmitBtn.Parent = MainFrame
SubmitBtn.BackgroundColor3 = Color3.fromRGB(245, 158, 11)
SubmitBtn.Position = UDim2.new(0.1, 0, 0.68, 0)
SubmitBtn.Size = UDim2.new(0.8, 0, 0, 35)
SubmitBtn.Font = Enum.Font.GothamBold
SubmitBtn.Text = "XÁC NHẬN & BẮT ĐẦU"
SubmitBtn.TextColor3 = Color3.fromRGB(15, 23, 42)
SubmitBtn.TextSize = 12

local BtnCorner = Instance.new("UICorner")
BtnCorner.CornerRadius = UDim.new(0, 8)
BtnCorner.Parent = SubmitBtn

-- 2. HÀM LẤY DỮ LIỆU TỪ ROBLOX MEMORY
local function getAccountStats()
    local level, beli, fragments, fruit = 1, 0, 0, "Chưa ăn trái"

    pcall(function()
        if LocalPlayer:FindFirstChild("Data") then
            level = LocalPlayer.Data.Level.Value
            beli = LocalPlayer.Data.Beli.Value
            fragments = LocalPlayer.Data.Fragments.Value
            fruit = LocalPlayer.Data.DevilFruit.Value
        end
    end)

    return {
        username = LocalPlayer.Name,
        userId = LocalPlayer.UserId,
        level = level,
        beli = beli,
        fragments = fragments,
        fruit = fruit,
        placeId = game.PlaceId,
        jobId = game.JobId
    }
end

-- 3. KHỞI CHẠY TIẾN TRÌNH PING DỮ LIỆU NGẦM
local function startTrackLoop(userKey)
    game:GetService("StarterGui"):SetCore("SendNotification", {
        Title = "TrackStats Live",
        Text = "Đã kết nối Key: " .. userKey .. "\nĐang gửi dữ liệu về Web...",
        Duration = 5
    })

    task.spawn(function()
        while task.wait(PING_INTERVAL) do
            pcall(function()
                local stats = getAccountStats()
                stats.key = userKey

                local req = (syn and syn.request) or (http and http.request) or http_request or request
                if req then
                    req({
                        Url = VERCEL_API_URL,
                        Method = "POST",
                        Headers = { ["Content-Type"] = "application/json" },
                        Body = HttpService:JSONEncode(stats)
                    })
                end
            end)
        end
    end)
end

-- 4. BẤM NÚT XÁC NHẬN -> ẨN MENU & BẮT ĐẦU PING
SubmitBtn.MouseButton1Click:Connect(function()
    local keyText = KeyInput.Text
    if keyText ~= "" and #keyText >= 3 then
        ScreenGui:Destroy()
        startTrackLoop(keyText)
    else
        KeyInput.PlaceholderText = "Vui lòng nhập Key hợp lệ!"
    end
end)
