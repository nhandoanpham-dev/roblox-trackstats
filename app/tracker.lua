-- ===================================================================
-- 🔥 YEAGER NEXUS HUB | BLOX FRUITS ULTRA ULTIMATE EDITION (v39 AUTO QUEST & FARM) 🔥
-- ===================================================================
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local StarterGui = game:GetService("StarterGui")
local CoreGui = game:GetService("CoreGui")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")
local VirtualUser = game:GetService("VirtualUser")

local API_URL = "https://aotwing-dusky.vercel.app/api/ping?userId=" .. LocalPlayer.UserId
local ACCESS_KEY = "yeager2026"
local Req = request or http_request or (syn and syn.request)

-- Xóa menu cũ nếu có để tránh trùng lặp
if CoreGui:FindFirstChild("YeagerNexusUltra") then
    CoreGui.YeagerNexusUltra:Destroy()
end

-- Khởi tạo Main GUI
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "YeagerNexusUltra"
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

-- ===================================================================
-- THIẾT KẾ GIAO DIỆN (UI DESIGN - CYBERPUNK DARK GLASS)
-- ===================================================================
local MainFrame = Instance.new("Frame")
MainFrame.Name = "MainFrame"
MainFrame.Size = UDim2.new(0, 560, 0, 360)
MainFrame.Position = UDim2.new(0.5, -280, 0.5, -180)
MainFrame.BackgroundColor3 = Color3.fromRGB(15, 15, 20)
MainFrame.BackgroundTransparency = 0.05
MainFrame.BorderSizePixel = 0
MainFrame.Active = true
MainFrame.Draggable = true
MainFrame.Parent = ScreenGui

local MainCorner = Instance.new("UICorner")
MainCorner.CornerRadius = UDim.new(0, 12)
MainCorner.Parent = MainFrame

local MainStroke = Instance.new("UIStroke")
MainStroke.Color = Color3.fromRGB(0, 162, 255)
MainStroke.Thickness = 1.5
MainStroke.Transparency = 0.3
MainStroke.Parent = MainFrame

-- Top Bar (Thanh tiêu đề)
local TopBar = Instance.new("Frame")
TopBar.Size = UDim2.new(1, 0, 0, 45)
TopBar.BackgroundColor3 = Color3.fromRGB(22, 22, 30)
TopBar.BorderSizePixel = 0
TopBar.Parent = MainFrame

local TopCorner = Instance.new("UICorner")
TopCorner.CornerRadius = UDim.new(0, 12)
TopCorner.Parent = TopBar

local FixTop = Instance.new("Frame")
FixTop.Size = UDim2.new(1, 0, 0, 10)
FixTop.Position = UDim2.new(0, 0, 1, -10)
FixTop.BackgroundColor3 = Color3.fromRGB(22, 22, 30)
FixTop.BorderSizePixel = 0
FixTop.Parent = TopBar

local TitleText = Instance.new("TextLabel")
TitleText.Size = UDim2.new(0, 300, 1, 0)
TitleText.Position = UDim2.new(0, 15, 0, 0)
TitleText.BackgroundTransparency = 1
TitleText.TextColor3 = Color3.fromRGB(0, 220, 255)
TitleText.TextSize = 15
TitleText.Font = Enum.Font.GothamBold
TitleText.TextXAlignment = Enum.TextXAlignment.Left
TitleText.Text = "⚡ YEAGER NEXUS HUB | BLOX FRUITS"
TitleText.Parent = TopBar

-- Nút Đóng (X)
local CloseBtn = Instance.new("TextButton")
CloseBtn.Size = UDim2.new(0, 35, 0, 35)
CloseBtn.Position = UDim2.new(1, -40, 0, 5)
CloseBtn.BackgroundColor3 = Color3.fromRGB(255, 60, 60)
CloseBtn.BackgroundTransparency = 0.2
CloseBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
CloseBtn.TextSize = 14
CloseBtn.Font = Enum.Font.GothamBold
CloseBtn.Text = "X"
CloseBtn.Parent = TopBar

local CloseCorner = Instance.new("UICorner")
CloseCorner.CornerRadius = UDim.new(0, 8)
CloseCorner.Parent = CloseBtn

CloseBtn.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)

-- Sidebar (Thanh chọn Tab bên trái)
local Sidebar = Instance.new("Frame")
Sidebar.Size = UDim2.new(0, 140, 1, -45)
Sidebar.Position = UDim2.new(0, 0, 0, 45)
Sidebar.BackgroundColor3 = Color3.fromRGB(18, 18, 25)
Sidebar.BorderSizePixel = 0
Sidebar.Parent = MainFrame

local Container = Instance.new("Folder")
Container.Name = "TabContainers"
Container.Parent = MainFrame

local tabs = {}
local function createTabContent(name)
    local scrolling = Instance.new("ScrollingFrame")
    scrolling.Name = name .. "Content"
    scrolling.Size = UDim2.new(1, -155, 1, -55)
    scrolling.Position = UDim2.new(0, 150, 0, 55)
    scrolling.BackgroundTransparency = 1
    scrolling.BorderSizePixel = 0
    scrolling.CanvasSize = UDim2.new(0, 0, 1.5, 0)
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

createTabContent("Home")
createTabContent("Farm")
createTabContent("Combat")
createTabContent("Settings")

tabs["Home"].Visible = true

local function createTabButton(name, text, posY)
    local btn = Instance.new("TextButton")
    btn.Size = UDim2.new(1, -20, 0, 38)
    btn.Position = UDim2.new(0, 10, 0, posY)
    btn.BackgroundColor3 = Color3.fromRGB(25, 25, 35)
    btn.TextColor3 = Color3.fromRGB(180, 180, 200)
    btn.TextSize = 13
    btn.Font = Enum.Font.GothamMedium
    btn.Text = text
    btn.Parent = Sidebar
    
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = btn
    
    btn.MouseButton1Click:Connect(function()
        for _, tab in pairs(tabs) do tab.Visible = false end
        for _, b in pairs(Sidebar:GetChildren()) do
            if b:IsA("TextButton") then b.BackgroundColor3 = Color3.fromRGB(25, 25, 35); b.TextColor3 = Color3.fromRGB(180, 180, 200) end
        end
        tabs[name].Visible = true
        btn.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
        btn.TextColor3 = Color3.fromRGB(255, 255, 255)
    end)
end

createTabButton("Home", "🏠 Trang Chủ", 15)
createTabButton("Farm", "🌾 Auto Farm", 60)
createTabButton("Combat", "⚔️ Đánh & Boss", 105)
createTabButton("Settings", "⚙️ Cài Đặt", 150)

local function createToggle(tabName, titleText, callback)
    local frame = Instance.new("Frame")
    frame.Size = UDim2.new(1, -10, 0, 42)
    frame.BackgroundColor3 = Color3.fromRGB(25, 25, 35)
    frame.Parent = tabs[tabName]
    
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = frame
    
    local label = Instance.new("TextLabel")
    label.Size = UDim2.new(1, -70, 1, 0)
    label.Position = UDim2.new(0, 12, 0, 0)
    label.BackgroundTransparency = 1
    label.TextColor3 = Color3.fromRGB(230, 230, 250)
    label.TextSize = 13
    label.Font = Enum.Font.Gotham
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.Text = titleText
    label.Parent = frame
    
    local toggleBtn = Instance.new("TextButton")
    toggleBtn.Size = UDim2.new(0, 45, 0, 24)
    toggleBtn.Position = UDim2.new(1, -55, 0.5, -12)
    toggleBtn.BackgroundColor3 = Color3.fromRGB(60, 60, 75)
    toggleBtn.Text = ""
    toggleBtn.Parent = frame
    
    local tCorner = Instance.new("UICorner")
    tCorner.CornerRadius = UDim.new(0, 12)
    tCorner.Parent = toggleBtn
    
    local circle = Instance.new("Frame")
    circle.Size = UDim2.new(0, 18, 0, 18)
    circle.Position = UDim2.new(0, 3, 0.5, -9)
    circle.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    circle.Parent = toggleBtn
    
    local cCorner = Instance.new("UICorner")
    cCorner.CornerRadius = UDim.new(1, 0)
    cCorner.Parent = circle
    
    local active = false
    toggleBtn.MouseButton1Click:Connect(function()
        active = not active
        if active then
            TweenService:Create(toggleBtn, TweenInfo.new(0.2), {BackgroundColor3 = Color3.fromRGB(0, 200, 100)}):Play()
            TweenService:Create(circle, TweenInfo.new(0.2), {Position = UDim2.new(1, -21, 0.5, -9)}):Play()
        else
            TweenService:Create(toggleBtn, TweenInfo.new(0.2), {BackgroundColor3 = Color3.fromRGB(60, 60, 75)}):Play()
            TweenService:Create(circle, TweenInfo.new(0.2), {Position = UDim2.new(0, 3, 0.5, -9)}):Play()
        end
        callback(active)
    end)
end

-- ===================================================================
-- HỆ THỐNG AUTO QUEST & AUTO FARM & ATTACK THÔNG MINH
-- ===================================================================
getgenv().AutoFarm = false
getgenv().AutoQuest = true
getgenv().FastAttack = false

-- Hàm lấy cấp độ hiện tại của người chơi
local function getLevel()
    local data = LocalPlayer:FindFirstChild("Data") or LocalPlayer:FindFirstChild("leaderstats")
    if data and data:FindFirstChild("Level") then
        return data.Level.Value
    end
    return 1
end

-- Hàm kiểm tra xem đã có nhiệm vụ chưa
local function hasActiveQuest()
    local playerGui = LocalPlayer:FindFirstChild("PlayerGui")
    if playerGui then
        local main = playerGui:FindFirstChild("Main")
        if main then
            local quest = main:FindFirstChild("Quest")
            if quest and quest.Visible then
                return true
            end
        end
    end
    return false
end

-- Tiến trình Auto Quest & Auto Farm chính
task.spawn(function()
    while task.wait(0.1) do
        if getgenv().AutoFarm then
            pcall(function()
                local char = LocalPlayer.Character
                if char and char:FindFirstChild("HumanoidRootPart") and char:FindFirstChild("Humanoid") then
                    local rootPart = char.HumanoidRootPart
                    local humanoid = char.Humanoid
                    local level = getLevel()
                    
                    -- 1. Kiểm tra và nhận nhiệm vụ tự động nếu chưa có
                    if getgenv().AutoQuest and not hasActiveQuest() then
                        local questNPCName = ""
                        local questPos = nil
                        
                        -- Phân định mốc level Sea 1 cơ bản
                        if level >= 1 and level < 10 then
                            questNPCName = "BanditQuestGiver"
                            questPos = CFrame.new(1059, 16, 1373)
                        elseif level >= 10 and level < 15 then
                            questNPCName = "JungleQuestGiver"
                            questPos = CFrame.new(-1598, 36, 153)
                        elseif level >= 15 and level < 30 then
                            questNPCName = "GorillaQuestGiver"
                            questPos = CFrame.new(-1601, 36, 153)
                        elseif level >= 30 and level < 60 then
                            questNPCName = "PirateVillageQuestGiver"
                            questPos = CFrame.new(-1140, 4.7, 3827)
                        else
                            -- Mặc định quanh khu vực Starter/Jungle nếu không khớp
                            questPos = CFrame.new(1059, 16, 1373)
                        end
                        
                        if questPos then
                            rootPart.CFrame = questPos
                            task.wait(0.5)
                            -- Kích hoạt giao tiếp nhận nhiệm vụ qua Remotes nếu có sẵn trong game
                            local remotes = game:GetService("ReplicatedStorage"):FindFirstChild("Remotes")
                            if remotes and remotes:FindFirstChild("CommF_") then
                                remotes.CommF_:InvokeServer("StartQuest", questNPCName, 1)
                            end
                            task.wait(1)
                        end
                    end
                    
                    -- 2. Đã có nhiệm vụ -> Tìm quái tương ứng để farm và tấn công
                    if Workspace:FindFirstChild("Enemies") then
                        for _, enemy in pairs(Workspace.Enemies:GetChildren()) do
                            if enemy:FindFirstChild("HumanoidRootPart") and enemy:FindFirstChild("Humanoid") and enemy.Humanoid.Health > 0 then
                                if getgenv().AutoFarm then
                                    -- Bay bám sát phía trên đầu quái
                                    rootPart.CFrame = enemy.HumanoidRootPart.CFrame * CFrame.new(0, 5, 2)
                                    
                                    -- Trang bị vũ khí / Combat nếu chưa cầm
                                    local currentTool = char:FindFirstChildOfClass("Tool")
                                    if not currentTool then
                                        for _, item in pairs(LocalPlayer.Backpack:GetChildren()) do
                                            if item:IsA("Tool") then
                                                humanoid:EquipTool(item)
                                                task.wait(0.1)
                                                break
                                            end
                                        end
                                    else
                                        -- Kích hoạt đòn đánh liên tục ổn định
                                        currentTool:Activate()
                                        VirtualUser:Button1Down(Vector2.new(500, 500), Workspace.CurrentCamera.CFrame)
                                    end
                                    break
                                end
                            end
                        end
                    end
                end
            end)
        end
    end
end)

-- Tab Home Content
local HomeInfo = Instance.new("TextLabel")
HomeInfo.Size = UDim2.new(1, -10, 0, 80)
HomeInfo.BackgroundColor3 = Color3.fromRGB(22, 22, 30)
HomeInfo.TextColor3 = Color3.fromRGB(200, 200, 220)
HomeInfo.TextSize = 12
HomeInfo.Font = Enum.Font.Gotham
HomeInfo.TextWrapped = true
HomeInfo.Text = "👤 Tài khoản: " .. LocalPlayer.Name .. "\n🌐 Trạng thái Web: Đang kết nối Realtime...\n🔥 Hub: Yeager Nexus Ultra v39 (Auto Quest & Attack Fixed)"
HomeInfo.Parent = tabs["Home"]
local hCorner = Instance.new("UICorner") hCorner.CornerRadius = UDim.new(0, 8) hCorner.Parent = HomeInfo

-- Tab Farm Toggles
createToggle("Farm", "⚡ Auto Quest & Farm (Tự nhận nhiệm vụ & Đánh quái)", function(state)
    getgenv().AutoFarm = state
end)

createToggle("Combat", "⚔️ Fast Attack (Tấn công siêu tốc)", function(state)
    getgenv().FastAttack = state
    task.spawn(function()
        while getgenv().FastAttack do
            task.wait(0.04)
            pcall(function()
                sethiddenproperty(LocalPlayer, "SimulationRadius", math.huge)
                local tool = LocalPlayer.Character and LocalPlayer.Character:FindFirstChildOfClass("Tool")
                if tool then 
                    tool:Activate()
                end
            end)
        end
    end)
end)

-- Tab Settings Action Buttons
local RejoinBtn = Instance.new("TextButton")
RejoinBtn.Size = UDim2.new(1, -10, 0, 38)
RejoinBtn.BackgroundColor3 = Color3.fromRGB(200, 50, 50)
RejoinBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
RejoinBtn.TextSize = 13
RejoinBtn.Font = Enum.Font.GothamBold
RejoinBtn.Text = "🔄 Vào lại Server (Rejoin)"
RejoinBtn.Parent = tabs["Settings"]
local rCorner = Instance.new("UICorner") rCorner.CornerRadius = UDim.new(0, 8) rCorner.Parent = RejoinBtn

RejoinBtn.MouseButton1Click:Connect(function()
    game:GetService("TeleportService"):Teleport(game.PlaceId, LocalPlayer)
end)

-- Tiến trình ngầm đồng bộ Web Dashboard
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
                    HomeInfo.Text = "👤 Tài khoản: " .. LocalPlayer.Name .. "\n🌐 Trạng thái Web: Đồng bộ thành công! ✅\n📊 Level: " .. lv .. " | Beli: " .. cur
                    
                    local bodyText = res.Body or res.body
                    if bodyText and bodyText ~= "" then
                        local dec = HttpService:JSONDecode(bodyText)
                        if dec.commands then
                            for _, c in ipairs(dec.commands) do
                                if c.command == "NOTIFY" then
                                    StarterGui:SetCore("SendNotification", {Title = c.payload.title or "Yeager Hub", Text = c.payload.message})
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

print("Yeager Nexus Loaded Successfully!")
