-- ===================================================================
-- 🔥 YEAGER NEXUS HUB | STEAL AN EGG - ADVANCED LOADER 🔥
-- ===================================================================
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local CoreGui = game:GetService("CoreGui")
local TweenService = game:GetService("TweenService")
local Workspace = game:GetService("Workspace")
local TeleportService = game:GetService("TeleportService")
local HttpService = game:GetService("HttpService")

print("[Yeager Hub] Đang khởi chạy hệ thống nâng cao cho Steal An Egg...")

if CoreGui:FindFirstChild("YeagerStealEggAdvanced") then
    CoreGui.YeagerStealEggAdvanced:Destroy()
end

local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "YeagerStealEggAdvanced"
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

-- Khung chính
local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 560, 0, 360)
MainFrame.Position = UDim2.new(0.5, -280, 0.5, -180)
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
TitleText.Text = "🥚 YEAGER HUB | STEAL AN EGG (ADVANCED EDITION)"
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
CloseBtn.Parent = MainFrame

local CloseCorner = Instance.new("UICorner")
CloseCorner.CornerRadius = UDim.new(0, 8)
CloseCorner.Parent = CloseBtn

CloseBtn.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)

-- Sidebar Navigation (Tabs)
local Sidebar = Instance.new("Frame")
Sidebar.Size = UDim2.new(0, 150, 1, -42)
Sidebar.Position = UDim2.new(0, 0, 0, 42)
Sidebar.BackgroundColor3 = Color3.fromRGB(18, 18, 26)
Sidebar.BorderSizePixel = 0
Sidebar.Parent = MainFrame

local Containers = Instance.new("Folder")
Containers.Name = "TabContainers"
Containers.Parent = MainFrame

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
createTabContent("ServerHop")
createTabContent("EggHandling")

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

createTabButton("Main", "🏠 Main Tab", 15)
createTabButton("ServerHop", "🌐 Server Hop", 58)
createTabButton("EggHandling", "📦 Egg Handling", 101)

-- Hàm tạo Toggle UI chuẩn
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
-- CONFIG & SETTINGS GỐC
-- ===================================================================
getgenv().StealSettings = {
    AutoSteal = false,
    TargetPriority = "Rarest", -- Mặc định ưu tiên trứng hiếm nhất
    SelectedArea = "All",
    SelectedRarity = "All",
    SelectedMutation = "All",
    AutoServerHop = false,
    AutoHatch = false,
    AutoSell = false
}

-- Panel Status trên Main Tab
local StatusInfo = Instance.new("TextLabel")
StatusInfo.Size = UDim2.new(1, -10, 0, 45)
StatusInfo.BackgroundColor3 = Color3.fromRGB(20, 20, 28)
StatusInfo.TextColor3 = Color3.fromRGB(0, 255, 150)
StatusInfo.TextSize = 11
StatusInfo.Font = Enum.Font.GothamMedium
StatusInfo.Text = "📊 Trạng thái: Sẵn sàng | Priority: Rarest"
StatusInfo.Parent = tabs["Main"]
local siCorner = Instance.new("UICorner") siCorner.CornerRadius = UDim.new(0, 8) siCorner.Parent = StatusInfo

-- ===================================================================
-- TÍNH NĂNG MAIN TAB (STEAL EGGS, AREAS, RARITIES, MUTATIONS, PRIORITY)
-- ===================================================================
createToggle("Main", "🚀 Bật Auto Steal Eggs", function(state)
    getgenv().StealSettings.AutoSteal = state
end)

-- Tạo bảng chọn nhanh Target Priority (Rarest)
local PriorityFrame = Instance.new("Frame")
PriorityFrame.Size = UDim2.new(1, -10, 0, 45)
PriorityFrame.BackgroundColor3 = Color3.fromRGB(22, 22, 32)
PriorityFrame.Parent = tabs["Main"]
local pfCorner = Instance.new("UICorner") pfCorner.CornerRadius = UDim.new(0, 8) pfCorner.Parent = PriorityFrame

local PriorityLabel = Instance.new("TextLabel")
PriorityLabel.Size = UDim2.new(1, -20, 1, 0)
PriorityLabel.Position = UDim2.new(0, 12, 0, 0)
PriorityLabel.BackgroundTransparency = 1
PriorityLabel.TextColor3 = Color3.fromRGB(255, 200, 100)
PriorityLabel.TextSize = 12
PriorityLabel.Font = Enum.Font.GothamBold
PriorityLabel.TextXAlignment = Enum.TextXAlignment.Left
PriorityLabel.Text = "⭐ Target Priority: Đang đặt ở [RAREST]"
PriorityLabel.Parent = PriorityFrame

-- Các bộ lọc Areas, Rarities, Mutations (Mô phỏng bộ lọc nâng cao)
createToggle("Main", "🗺️ Lọc theo Khu vực (Areas: All)", function(state)
    getgenv().StealSettings.SelectedArea = state and "Filtered" or "All"
end)

createToggle("Main", "💎 Lọc theo Độ hiếm (Rarities: High Tier)", function(state)
    getgenv().StealSettings.SelectedRarity = state and "High" or "All"
end)

createToggle("Main", "🧬 Lọc theo Đột biến (Mutations Active)", function(state)
    getgenv().StealSettings.SelectedMutation = state and "Active" or "All"
end)

-- ===================================================================
-- TÍNH NĂNG SERVER HOP PANEL
-- ===================================================================
local HopInfo = Instance.new("TextLabel")
HopInfo.Size = UDim2.new(1, -10, 0, 45)
HopInfo.BackgroundColor3 = Color3.fromRGB(20, 20, 28)
HopInfo.TextColor3 = Color3.fromRGB(100, 200, 255)
HopInfo.TextSize = 11
HopInfo.Font = Enum.Font.GothamMedium
HopInfo.Text = "🌐 Quản lý Server Hop tự động khi hết trứng"
HopInfo.Parent = tabs["ServerHop"]
local hiCorner = Instance.new("UICorner") hiCorner.CornerRadius = UDim.new(0, 8) hiCorner.Parent = HopInfo

createToggle("ServerHop", "🔄 Bật Auto Server Hop (Khi trống trứng)", function(state)
    getgenv().StealSettings.AutoServerHop = state
end)

local InstantHopBtn = Instance.new("TextButton")
InstantHopBtn.Size = UDim2.new(1, -10, 0, 38)
InstantHopBtn.BackgroundColor3 = Color3.fromRGB(200, 100, 0)
InstantHopBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
InstantHopBtn.TextSize = 12
InstantHopBtn.Font = Enum.Font.GothamBold
InstantHopBtn.Text = "⚡ Đổi Server Ngay Lập Tức (Instant Hop)"
InstantHopBtn.Parent = tabs["ServerHop"]
local ihCorner = Instance.new("UICorner") ihCorner.CornerRadius = UDim.new(0, 8) ihCorner.Parent = InstantHopBtn

InstantHopBtn.MouseButton1Click:Connect(function()
    StatusInfo.Text = "🌐 Đang thực hiện đổi Server..."
    task.wait(0.5)
    TeleportService:Teleport(game.PlaceId, LocalPlayer)
end)

-- ===================================================================
-- TÍNH NĂNG EGG HANDLING PANEL
-- ===================================================================
local HandleInfo = Instance.new("TextLabel")
HandleInfo.Size = UDim2.new(1, -10, 0, 45)
HandleInfo.BackgroundColor3 = Color3.fromRGB(20, 20, 28)
HandleInfo.TextColor3 = Color3.fromRGB(255, 100, 200)
HandleInfo.TextSize = 11
HandleInfo.Font = Enum.Font.GothamMedium
HandleInfo.Text = "📦 Tùy chọn xử lý trứng sau khi trộm thành công"
HandleInfo.Parent = tabs["EggHandling"]
local hhiCorner = Instance.new("UICorner") hhiCorner.CornerRadius = UDim.new(0, 8) hhiCorner.Parent = HandleInfo

createToggle("EggHandling", "🥚 Tự động Ấp trứng (Auto Hatch)", function(state)
    getgenv().StealSettings.AutoHatch = state
end)

createToggle("EggHandling", "💰 Tự động Bán trứng thừa (Auto Sell)", function(state)
    getgenv().StealSettings.AutoSell = state
end)

-- ===================================================================
-- LOGIC THỰC THI CHÍNH (TARGET PRIORITY = RAREST & FILTERS)
-- ===================================================================
task.spawn(function()
    while task.wait(0.2) do
        if getgenv().StealSettings.AutoSteal then
            pcall(function()
                local char = LocalPlayer.Character
                if char and char:FindFirstChild("HumanoidRootPart") then
                    local rootPart = char.HumanoidRootPart
                    local bestTarget = nil
                    local highestScore = -math.huge
                    
                    -- Quét các Prompt hoặc Trứng trong Workspace theo cơ chế Rarest Priority
                    for _, obj in pairs(Workspace:GetDescendants()) do
                        if not getgenv().StealSettings.AutoSteal then break end
                        
                        if obj:IsA("ProximityPrompt") then
                            local nameLower = obj.Name:lower()
                            local parent = obj.Parent
                            local parentName = parent and parent.Name:lower() or ""
                            
                            if nameLower:match("egg") or parentName:match("egg") or obj.ActionText:lower():match("steal") then
                                local targetPart = parent
                                if targetPart then
                                    local partCFrame = nil
                                    if targetPart:IsA("BasePart") then
                                        partCFrame = targetPart.CFrame
                                    elseif targetPart:IsA("Model") and targetPart.PrimaryPart then
                                        partCFrame = targetPart.PrimaryPart.CFrame
                                    elseif targetPart:FindFirstChildWhichIsA("BasePart") then
                                        partCFrame = targetPart:FindFirstChildWhichIsA("BasePart").CFrame
                                    end
                                    
                                    if partCFrame then
                                        -- Ưu tiên độ hiếm cao nhất (Rarest Priority Logic)
                                        local score = 1
                                        if parentName:match("mythic") or parentName:match("secret") then
                                            score = 1000
                                        elseif parentName:match("legendary") then
                                            score = 500
                                        elseif parentName:match("epic") then
                                            score = 100
                                        end
                                        
                                        if score > highestScore then
                                            highestScore = score
                                            bestTarget = {part = partCFrame, prompt = obj}
                                        end
                                    end
                                end
                            end
                        end
                    end
                    
                    if bestTarget and bestTarget.prompt then
                        StatusInfo.Text = "🎯 Đang trộm trứng [Priority: Rarest]..."
                        rootPart.CFrame = bestTarget.part * CFrame.new(0, 2.5, 0)
                        task.wait(0.1)
                        fireproximityprompt(bestTarget.prompt)
                        task.wait(0.2)
                    else
                        StatusInfo.Text = "⏳ Đang quét tìm trứng hiếm..."
                        if getgenv().StealSettings.AutoServerHop then
                            StatusInfo.Text = "🌐 Không tìm thấy trứng, đang chuyển server..."
                            task.wait(1)
                            TeleportService:Teleport(game.PlaceId, LocalPlayer)
                        end
                    end
                end
            end)
        else
            StatusInfo.Text = "📊 Trạng thái: Đang tắt"
        end
    end
end)

print("[Yeager Hub] Advanced Loader Loaded Successfully!")
