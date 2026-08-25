-- ===================================================================
-- 🥚 YEAGER NEXUS HUB | STEAL AN EGG - LOADER (v3.0)
-- ===================================================================
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local CoreGui = game:GetService("CoreGui")
local TweenService = game:GetService("TweenService")
local Workspace = game:GetService("Workspace")

-- Thông báo khởi động Loader
print("[Yeager Hub] Đang tải hệ thống Auto Steal Egg...")

-- Dọn dẹp GUI cũ nếu đã bật trước đó
if CoreGui:FindFirstChild("YeagerPureStealEgg") then
    CoreGui.YeagerPureStealEgg:Destroy()
end

local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "YeagerPureStealEgg"
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

-- Thiết kế Giao diện chính (Gọn gàng, hiện đại)
local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 420, 0, 220)
MainFrame.Position = UDim2.new(0.5, -210, 0.5, -110)
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
TitleText.Text = "🥚 YEAGER HUB | LOADER: STEAL AN EGG"
TitleText.Parent = TopBar

-- Nút đóng (X)
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

-- Nội dung bên trong
local ContentFrame = Instance.new("Frame")
ContentFrame.Size = UDim2.new(1, -24, 1, -56)
ContentFrame.Position = UDim2.new(0, 12, 0, 48)
ContentFrame.BackgroundTransparency = 1
ContentFrame.Parent = MainFrame

-- Bảng hiển thị trạng thái
local StatusLabel = Instance.new("TextLabel")
StatusLabel.Size = UDim2.new(1, 0, 0, 38)
StatusLabel.BackgroundColor3 = Color3.fromRGB(20, 20, 28)
StatusLabel.TextColor3 = Color3.fromRGB(0, 255, 150)
StatusLabel.TextSize = 12
StatusLabel.Font = Enum.Font.GothamMedium
StatusLabel.Text = "📊 Trạng thái: Loader đã sẵn sàng"
StatusLabel.Parent = ContentFrame
local sCorner = Instance.new("UICorner") sCorner.CornerRadius = UDim.new(0, 8) sCorner.Parent = StatusLabel

-- Khung chứa Toggle
local ToggleFrame = Instance.new("Frame")
ToggleFrame.Size = UDim2.new(1, 0, 0, 48)
ToggleFrame.Position = UDim2.new(0, 0, 0, 48)
ToggleFrame.BackgroundColor3 = Color3.fromRGB(22, 22, 32)
ToggleFrame.Parent = ContentFrame
local tFrameCorner = Instance.new("UICorner") tFrameCorner.CornerRadius = UDim.new(0, 8) tFrameCorner.Parent = ToggleFrame

local ToggleLabel = Instance.new("TextLabel")
ToggleLabel.Size = UDim2.new(1, -70, 1, 0)
ToggleLabel.Position = UDim2.new(0, 12, 0, 0)
ToggleLabel.BackgroundTransparency = 1
ToggleLabel.TextColor3 = Color3.fromRGB(230, 230, 250)
ToggleLabel.TextSize = 13
ToggleLabel.Font = Enum.Font.Gotham
ToggleLabel.TextXAlignment = Enum.TextXAlignment.Left
ToggleLabel.Text = "🚀 Bật Auto Trộm Trứng"
ToggleLabel.Parent = ToggleFrame

local ToggleBtn = Instance.new("TextButton")
ToggleBtn.Size = UDim2.new(0, 45, 0, 24)
ToggleBtn.Position = UDim2.new(1, -55, 0.5, -12)
ToggleBtn.BackgroundColor3 = Color3.fromRGB(60, 60, 75)
ToggleBtn.Text = ""
ToggleBtn.Parent = ToggleFrame

local tBtnCorner = Instance.new("UICorner") tBtnCorner.CornerRadius = UDim.new(0, 12) tBtnCorner.Parent = ToggleBtn

local Circle = Instance.new("Frame")
Circle.Size = UDim2.new(0, 18, 0, 18)
Circle.Position = UDim2.new(0, 3, 0.5, -9)
Circle.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
Circle.Parent = ToggleBtn
local cCorner = Instance.new("UICorner") cCorner.CornerRadius = UDim.new(1, 0) cCorner.Parent = Circle

-- ===================================================================
-- LOGIC XỬ LÝ AUTO TRỘM TRỨNG CHUYÊN SÂU
-- ===================================================================
getgenv().PureAutoSteal = false

local function isValidEgg(prompt)
    local parent = prompt.Parent
    local nameLower = prompt.Name:lower()
    local parentNameLower = parent and parent.Name:lower() or ""
    local actionText = prompt.ActionText:lower()
    local objectText = prompt.ObjectText:lower()
    
    if nameLower:match("egg") or parentNameLower:match("egg") or 
       objectText:match("egg") or actionText:match("steal") or 
       actionText:match("take") or actionText:match("pick") or
       nameLower:match("trứng") or parentNameLower:match("trứng") then
        return true
    end
    return false
end

task.spawn(function()
    while task.wait(0.2) do
        if getgenv().PureAutoSteal then
            pcall(function()
                local char = LocalPlayer.Character
                if char and char:FindFirstChild("HumanoidRootPart") then
                    local rootPart = char.HumanoidRootPart
                    local found = false
                    
                    for _, obj in pairs(Workspace:GetDescendants()) do
                        if not getgenv().PureAutoSteal then break end
                        
                        if obj:IsA("ProximityPrompt") and isValidEgg(obj) then
                            local targetPart = obj.Parent
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
                                    found = true
                                    StatusLabel.Text = "🎯 Đang tele và trộm trứng..."
                                    rootPart.CFrame = partCFrame * CFrame.new(0, 2.5, 0)
                                    task.wait(0.1)
                                    fireproximityprompt(obj)
                                    task.wait(0.2)
                                    break
                                end
                            end
                        end
                    end
                    
                    if not found then
                        StatusLabel.Text = "⏳ Đang quét tìm trứng mới..."
                    end
                end
            end)
        else
            StatusLabel.Text = "📊 Trạng thái: Đang tắt"
        end
    end
end)

local activeState = false
ToggleBtn.MouseButton1Click:Connect(function()
    activeState = not activeState
    getgenv().PureAutoSteal = activeState
    if activeState then
        TweenService:Create(ToggleBtn, TweenInfo.new(0.2), {BackgroundColor3 = Color3.fromRGB(255, 140, 0)}):Play()
        TweenService:Create(Circle, TweenInfo.new(0.2), {Position = UDim2.new(1, -21, 0.5, -9)}):Play()
    else
        TweenService:Create(ToggleBtn, TweenInfo.new(0.2), {BackgroundColor3 = Color3.fromRGB(60, 60, 75)}):Play()
        TweenService:Create(Circle, TweenInfo.new(0.2), {Position = UDim2.new(0, 3, 0.5, -9)}):Play()
    end
end)

print("[Yeager Hub] Loader Loaded Successfully!")
