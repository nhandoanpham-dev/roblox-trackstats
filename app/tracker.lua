-- ===================================================================
-- 🔥 YEAGER NEXUS HUB | STEAL AN EGG - ULTIMATE EDITION 🔥
-- ===================================================================
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local CoreGui = game:GetService("CoreGui")
local TweenService = game:GetService("TweenService")
local Workspace = game:GetService("Workspace")
local TeleportService = game:GetService("TeleportService")
local RunService = game:GetService("RunService")

print("[Yeager Hub] Đang khởi chạy hệ thống Ultimate cho Steal An Egg...")

if CoreGui:FindFirstChild("YeagerUltimateStealEgg") then
    CoreGui.YeagerUltimateStealEgg:Destroy()
end

local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "YeagerUltimateStealEgg"
ScreenGui.ResetOnSpawn = false
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

if syn and syn.protect_gui then
    syn.protect_gui(ScreenGui)
    ScreenGui.Parent = CoreGui
else
    pcall(function() ScreenGui.Parent = CoreGui end)
    if ScreenGui.Parent ~= CoreGui then
        ScreenGui.Parent = LocalPlayer:WaitForChild("PlayerGui")
    end
end

-- Khung giao diện chính
local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 580, 0, 380)
MainFrame.Position = UDim2.new(0.5, -290, 0.5, -190)
MainFrame.BackgroundColor3 = Color3.fromRGB(15, 15, 22)
MainFrame.BorderSizePixel = 0
MainFrame.Active = true
MainFrame.Draggable = true
MainFrame.Parent = ScreenGui

local MainCorner = Instance.new("UICorner")
MainCorner.CornerRadius = UDim.new(0, 12)
MainCorner.Parent = MainFrame

local MainStroke = Instance.new("UIStroke")
MainStroke.Color = Color3.fromRGB(255, 140, 0)
MainStroke.Thickness = 1.5
MainStroke.Transparency = 0.3
MainStroke.Parent = MainFrame

-- Top Bar
local TopBar = Instance.new("Frame")
TopBar.Size = UDim2.new(1, 0, 0, 42)
TopBar.BackgroundColor3 = Color3.fromRGB(22, 22, 32)
TopBar.BorderSizePixel = 0
TopBar.Parent = MainFrame

local TopCorner = Instance.new("UICorner")
TopCorner.CornerRadius = UDim.new(0, 12)
TopCorner.Parent = TopBar

local TitleText = Instance.new("TextLabel")
TitleText.Size = UDim2.new(1, -50, 1, 0)
TitleText.Position = UDim2.new(0, 15, 0, 0)
TitleText.BackgroundTransparency = 1
TitleText.TextColor3 = Color3.fromRGB(255, 160, 0)
TitleText.TextSize = 13
TitleText.Font = Enum.Font.GothamBold
TitleText.TextXAlignment = Enum.TextXAlignment.Left
TitleText.Text = "🥚 YEAGER HUB | STEAL AN EGG (ULTIMATE HUB)"
TitleText.Parent = TopBar

local CloseBtn = Instance.new("TextButton")
CloseBtn.Size = UDim2.new(0, 30, 0, 30)
CloseBtn.Position = UDim2.new(1, -36, 0, 6)
CloseBtn.BackgroundColor3 = Color3.fromRGB(255, 60, 60)
CloseBtn.BackgroundTransparency = 0.2
CloseBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
CloseBtn.TextSize = 12
CloseBtn.Font = Enum.Font.GothamBold
CloseBtn.Text = "X"
CloseBtn.Parent = TopBar

local CloseCorner = Instance.new("UICorner")
CloseCorner.CornerRadius = UDim.new(0, 8)
CloseCorner.Parent = CloseBtn

CloseBtn.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)

-- Sidebar Menu (Tabs)
local Sidebar = Instance.new("Frame")
Sidebar.Size = UDim2.new(0, 150, 1, -42)
Sidebar.Position = UDim2.new(0, 0, 0, 42)
Sidebar.BackgroundColor3 = Color3.fromRGB(18, 18, 26)
Sidebar.BorderSizePixel = 0
Sidebar.Parent = MainFrame

local tabs = {}
local function createTabContent(name)
    local scrolling = Instance.new("ScrollingFrame")
    scrolling.Name = name .. "Content"
    scrolling.Size = UDim2.new(1, -162, 1, -54)
    scrolling.Position = UDim2.new(0, 158, 0, 48)
    scrolling.BackgroundTransparency = 1
    scrolling.BorderSizePixel = 0
    scrolling.CanvasSize = UDim2.new(0, 0, 1.8, 0)
    scrolling.ScrollBarThickness = 4
    scrolling.Visible = false
    scrolling.Parent = MainFrame
    
    local UIList = Instance.new("UIListLayout")
    UIList.SortOrder = Enum.SortOrder.LayoutOrder
    UIList.Padding = UDim.new(0, 10)
    UIList.Parent = scrolling
    
    tabs[name] = scrolling
    return scrolling
end

createTabContent("Main")
createTabContent("Visuals")
createTabContent("ServerHop")

tabs["Main"].Visible = true

local function createTabButton(name, text, posY)
    local btn = Instance.new("TextButton")
    btn.Size = UDim2.new(1, -16, 0, 36)
    btn.Position = UDim2.new(0, 8, 0, posY)
    btn.BackgroundColor3 = Color3.fromRGB(25, 25, 35)
    btn.TextColor3 = Color3.fromRGB(180, 180, 200)
    btn.TextSize = 12
    btn.Font = Enum.Font.GothamMedium
    btn.Text = text
    btn.Parent = Sidebar
    
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = btn
    
    btn.MouseButton1Click:Connect(function()
        for _, tab in pairs(tabs) do tab.Visible = false end
        for _, b in pairs(Sidebar:GetChildren()) do
            if b:IsA("TextButton") then 
                b.BackgroundColor3 = Color3.fromRGB(25, 25, 35)
                b.TextColor3 = Color3.fromRGB(180, 180, 200) 
            end
        end
        tabs[name].Visible = true
        btn.BackgroundColor3 = Color3.fromRGB(255, 140, 0)
        btn.TextColor3 = Color3.fromRGB(255, 255, 255)
    end)
end

createTabButton("Main", "🏠 Main Hub", 15)
createTabButton("Visuals", "👁️ Visuals (ESP)", 58)
createTabButton("ServerHop", "🌐 Server Hop", 101)

-- Hàm tạo Toggle tiêu chuẩn
local function createToggle(tabName, titleText, callback)
    local frame = Instance.new("Frame")
    frame.Size = UDim2.new(1, -10, 0, 42)
    frame.BackgroundColor3 = Color3.fromRGB(22, 22, 32)
    frame.Parent = tabs[tabName]
    
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = frame
    
    local label = Instance.new("TextLabel")
    label.Size = UDim2.new(1, -70, 1, 0)
    label.Position = UDim2.new(0, 12, 0, 0)
    label.BackgroundTransparency = 1
    label.TextColor3 = Color3.fromRGB(220, 220, 240)
    label.TextSize = 12
    label.Font = Enum.Font.Gotham
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.Text = titleText
    label.Parent = frame
    
    local toggleBtn = Instance.new("TextButton")
    toggleBtn.Size = UDim2.new(0, 42, 0, 22)
    toggleBtn.Position = UDim2.new(1, -52, 0.5, -11)
    toggleBtn.BackgroundColor3 = Color3.fromRGB(60, 60, 75)
    toggleBtn.Text = ""
    toggleBtn.Parent = frame
    
    local tCorner = Instance.new("UICorner")
    tCorner.CornerRadius = UDim.new(0, 11)
    tCorner.Parent = toggleBtn
    
    local circle = Instance.new("Frame")
    circle.Size = UDim2.new(0, 16, 0, 16)
    circle.Position = UDim2.new(0, 3, 0.5, -8)
    circle.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    circle.Parent = toggleBtn
    
    local cCorner = Instance.new("UICorner")
    cCorner.CornerRadius = UDim.new(1, 0)
    cCorner.Parent = circle
    
    local active = false
    toggleBtn.MouseButton1Click:Connect(function()
        active = not active
        if active then
            TweenService:Create(toggleBtn, TweenInfo.new(0.2), {BackgroundColor3 = Color3.fromRGB(255, 140, 0)}):Play()
            TweenService:Create(circle, TweenInfo.new(0.2), {Position = UDim2.new(1, -19, 0.5, -8)}):Play()
        else
            TweenService:Create(toggleBtn, TweenInfo.new(0.2), {BackgroundColor3 = Color3.fromRGB(60, 60, 75)}):Play()
            TweenService:Create(circle, TweenInfo.new(0.2), {Position = UDim2.new(0, 3, 0.5, -8)}):Play()
        end
        callback(active)
    end)
end

-- ===================================================================
-- CẤU HÌNH TÍNH NĂNG (CONFIG)
-- ===================================================================
getgenv().Config = {
    AutoSteal = false,
    AutoHatch = false,
    AutoPlace = false,
    EggESP = false,
    AutoServerHop = false
}

-- Status Thông báo trên Main Tab
local StatusLabel = Instance.new("TextLabel")
StatusLabel.Size = UDim2.new(1, -10, 0, 40)
StatusLabel.BackgroundColor3 = Color3.fromRGB(20, 20, 28)
StatusLabel.TextColor3 = Color3.fromRGB(0, 255, 150)
StatusLabel.TextSize = 11
StatusLabel.Font = Enum.Font.GothamMedium
StatusLabel.Text = "📊 Trạng thái: Sẵn sàng hoạt động"
StatusLabel.Parent = tabs["Main"]
local slCorner = Instance.new("UICorner") slCorner.CornerRadius = UDim.new(0, 8) slCorner.Parent = StatusLabel

-- ===================================================================
-- ĐĂNG KÝ CÁC TÍNH NĂNG
-- ===================================================================

-- 1. AUTO STEAL
createToggle("Main", "🚀 Auto Steal (Tự động trộm trứng)", function(state)
    getgenv().Config.AutoSteal = state
end)

-- 2. AUTO HATCH
createToggle("Main", "🥚 Auto Hatch (Tự động ấp trứng)", function(state)
    getgenv().Config.AutoHatch = state
end)

-- 3. AUTO PLACE
createToggle("Main", "📍 Auto Place (Tự động đặt pet/vật phẩm)", function(state)
    getgenv().Config.AutoPlace = state
end)

-- 4. EGG ESP (Tab Visuals)
createToggle("Visuals", "👁️ Egg ESP (Hiển thị vị trí trứng)", function(state)
    getgenv().Config.EggESP = state
end)

-- 5. SERVER HOP (Tab Server Hop)
createToggle("ServerHop", "🌐 Auto Server Hop (Đổi server khi hết trứng)", function(state)
    getgenv().Config.AutoServerHop = state
end)

local InstantHopBtn = Instance.new("TextButton")
InstantHopBtn.Size = UDim2.new(1, -10, 0, 38)
InstantHopBtn.BackgroundColor3 = Color3.fromRGB(200, 100, 0)
InstantHopBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
InstantHopBtn.TextSize = 12
InstantHopBtn.Font = Enum.Font.GothamBold
InstantHopBtn.Text = "⚡ Đổi Server Ngay (Instant Hop)"
InstantHopBtn.Parent = tabs["ServerHop"]
local ihCorner = Instance.new("UICorner") ihCorner.CornerRadius = UDim.new(0, 8) ihCorner.Parent = InstantHopBtn

InstantHopBtn.MouseButton1Click:Connect(function()
    TeleportService:Teleport(game.PlaceId, LocalPlayer)
end)

-- ===================================================================
-- LOGIC XỬ LÝ CHẠY NGẦM (LOOPS)
-- ===================================================================

-- Logic Auto Steal
task.spawn(function()
    while task.wait(0.2) do
        if getgenv().Config.AutoSteal then
            pcall(function()
                local char = LocalPlayer.Character
                if char and char:FindFirstChild("HumanoidRootPart") then
                    local rootPart = char.HumanoidRootPart
                    local found = false
                    
                    for _, obj in pairs(Workspace:GetDescendants()) do
                        if not getgenv().Config.AutoSteal then break end
                        if obj:IsA("ProximityPrompt") then
                            local nameLower = obj.Name:lower()
                            local parentName = obj.Parent and obj.Parent.Name:lower() or ""
                            
                            if nameLower:match("egg") or parentName:match("egg") or obj.ActionText:lower():match("steal") then
                                local targetPart = obj.Parent
                                local partCFrame = nil
                                if targetPart:IsA("BasePart") then
                                    partCFrame = targetPart.CFrame
                                elseif targetPart:IsA("Model") and targetPart.PrimaryPart then
                                    partCFrame = targetPart.PrimaryPart.CFrame
                                elseif targetPart:FindFirstChildWhichIsA("BasePart") then
                                    partCFrame = targetPart:FindFirstChildWhichIsA("BasePart").CFrame
                                end
                                
                                if partCFrame then
                                    found = true
                                    StatusLabel.Text = "🎯 Đang thực hiện Auto Steal trứng..."
                                    rootPart.CFrame = partCFrame * CFrame.new(0, 2.5, 0)
                                    task.wait(0.1)
                                    fireproximityprompt(obj)
                                    task.wait(0.2)
                                    break
                                end
                            end
                        end
                    end
                    
                    if not found and getgenv().Config.AutoServerHop then
                        StatusLabel.Text = "🌐 Hết trứng, đang đổi server..."
                        task.wait(1)
                        TeleportService:Teleport(game.PlaceId, LocalPlayer)
                    end
                end
            end)
        end
    end
end)

-- Logic Auto Hatch & Auto Place (Mô phỏng kích hoạt theo chu kỳ)
task.spawn(function()
    while task.wait(1) do
        if getgenv().Config.AutoHatch then
            pcall(function()
                -- Gửi sự kiện hoặc kích hoạt remote ấp trứng nếu game hỗ trợ
                -- Ví dụ: game:GetService("ReplicatedStorage").Remotes.HatchEgg:InvokeServer()
            end)
        end
        if getgenv().Config.AutoPlace then
            pcall(function()
                -- Logic tự động đặt vật phẩm/pet
            end)
        end
    end
end)

-- Logic Egg ESP (Vẽ ESP lên trứng)
local espFolder = Instance.new("Folder")
espFolder.Name = "YeagerEggESP"
espFolder.Parent = CoreGui

RunService.RenderStepped:Connect(function()
    if not getgenv().Config.EggESP then
        espFolder:ClearAllChildren()
        return
    end
    
    espFolder:ClearAllChildren()
    for _, obj in pairs(Workspace:GetDescendants()) do
        if obj:IsA("BasePart") and (obj.Name:lower():match("egg") or (obj.Parent and obj.Parent.Name:lower():match("egg"))) then
            local billboard = Instance.new("BillboardGui")
            billboard.Size = UDim2.new(0, 100, 0, 40)
            billboard.AlwaysOnTop = true
            billboard.Adornee = obj
            
            local textLabel = Instance.new("TextLabel")
            textLabel.Size = UDim2.new(1, 0, 1, 0)
            textLabel.BackgroundTransparency = 1
            textLabel.TextColor3 = Color3.fromRGB(255, 200, 0)
            textLabel.TextScaled = true
            textLabel.Font = Enum.Font.GothamBold
            textLabel.Text = "🥚 TRỨNG"
            textLabel.Parent = billboard
            
            billboard.Parent = espFolder
        end
    end
end)

print("[Yeager Hub] Ultimate Script Loaded Successfully!")
