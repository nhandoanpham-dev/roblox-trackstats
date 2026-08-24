-- ===================================================================
-- ⚡ YEAGER NEXUS HUB | NATIVE UI & WEB SYNC (v33)
-- ===================================================================
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local StarterGui = game:GetService("StarterGui")
local CoreGui = game:GetService("CoreGui")

local API_URL = "https://aotwing-dusky.vercel.app/api/ping?userId=" .. LocalPlayer.UserId
local ACCESS_KEY = "yeager2026"
local Req = request or http_request or (syn and syn.request)

-- 1. Tạo Giao diện Menu trực tiếp (Đảm bảo 100% hiện lên màn hình)
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "YeagerNexusHub"
ScreenGui.ResetOnSpawn = false

if syn and syn.protect_gui then
    syn.protect_gui(ScreenGui)
    ScreenGui.Parent = CoreGui
else
    pcall(function() ScreenGui.Parent = CoreGui end)
    if ScreenGui.Parent ~= CoreGui then
        ScreenGui.Parent = LocalPlayer:WaitForChild("PlayerGui")
    end
end

-- Khung chính của Menu
local MainFrame = Instance.new("Frame")
MainFrame.Name = "MainFrame"
MainFrame.Size = UDim2.new(0, 420, 0, 260)
MainFrame.Position = UDim2.new(0.5, -210, 0.5, -130)
MainFrame.BackgroundColor3 = Color3.fromRGB(22, 22, 28)
MainFrame.BorderSizePixel = 0
MainFrame.Active = true
MainFrame.Draggable = true -- Có thể cầm kéo thả bảng menu thoải mái
MainFrame.Parent = ScreenGui

local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 10)
UICorner.Parent = MainFrame

-- Tiêu đề Menu
local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(1, 0, 0, 45)
Title.BackgroundColor3 = Color3.fromRGB(30, 30, 40)
Title.TextColor3 = Color3.fromRGB(255, 255, 255)
Title.TextSize = 16
Title.Font = Enum.Font.SourceSansBold
Title.Text = "⚡ YEAGER NEXUS HUB | BLOX FRUITS"
Title.Parent = MainFrame

local TitleCorner = Instance.new("UICorner")
TitleCorner.CornerRadius = UDim.new(0, 10)
TitleCorner.Parent = Title

-- Trạng thái Web Dashboard
local StatusLabel = Instance.new("TextLabel")
StatusLabel.Size = UDim2.new(1, -20, 0, 40)
StatusLabel.Position = UDim2.new(0, 10, 0, 55)
StatusLabel.BackgroundTransparency = 1
StatusLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
StatusLabel.TextSize, StatusLabel.Font = 13, Enum.Font.SourceSans
StatusLabel.Text = "Trạng thái Web: Đang kết nối..."
StatusLabel.Parent = MainFrame

-- Nút Bật/Tắt Auto Farm giả lập
local ToggleBtn = Instance.new("TextButton")
ToggleBtn.Size = UDim2.new(1, -20, 0, 45)
ToggleBtn.Position = UDim2.new(0, 10, 0, 105)
ToggleBtn.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
ToggleBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
ToggleBtn.TextSize = 15
ToggleBtn.Font = Enum.Font.SourceSansBold
ToggleBtn.Text = "Auto Farm Level: [ TẮT ]"
ToggleBtn.Parent = MainFrame

local BtnCorner = Instance.new("UICorner")
BtnCorner.CornerRadius = UDim.new(0, 6)
BtnCorner.Parent = ToggleBtn

local isFarming = false
ToggleBtn.MouseButton1Click:Connect(function()
    isFarming = not isFarming
    if isFarming then
        ToggleBtn.Text = "Auto Farm Level: [ ĐANG BẬT ]"
        ToggleBtn.BackgroundColor3 = Color3.fromRGB(0, 220, 100)
    else
        ToggleBtn.Text = "Auto Farm Level: [ TẮT ]"
        ToggleBtn.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
    end
end)

-- Nút Đóng Menu (Dấu X)
local CloseBtn = Instance.new("TextButton")
CloseBtn.Size = UDim2.new(0, 35, 0, 35)
CloseBtn.Position = UDim2.new(1, -40, 0, 5)
CloseBtn.BackgroundTransparency = 1
CloseBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
CloseBtn.TextSize, CloseBtn.Font = 16, Enum.Font.SourceSansBold
CloseBtn.Text = "X"
CloseBtn.Parent = MainFrame

CloseBtn.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)

-- 2. Tiến trình nền đồng bộ dữ liệu thật lên Web Dashboard
if Req then
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
                    StatusLabel.Text = "Trạng thái Web: Đã đồng bộ dữ liệu thành công! ✅"
                    StatusLabel.TextColor3 = Color3.fromRGB(0, 255, 127)
                    
                    local bodyText = res.Body or res.body
                    if bodyText and bodyText ~= "" then
                        local dec = HttpService:JSONDecode(bodyText)
                        if dec.commands then
                            for _, c in ipairs(dec.commands) do
                                if c.command == "NOTIFY" then
                                    StarterGui:SetCore("SendNotification", {Title = c.payload.title or "Yeager Nexus", Text = c.payload.message})
                                elseif c.command == "RECONNECT" then
                                    game:GetService("TeleportService"):Teleport(game.PlaceId, LocalPlayer)
                                end
                            end
                        end
                    end
                end
            end)
        end
    end)
end
