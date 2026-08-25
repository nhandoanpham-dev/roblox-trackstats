-- Script Auto Steal Egg Steal An Egg Roblox với GUI tùy chỉnh
local LocalPlayer = game:GetService("Players").LocalPlayer
local Workspace = game:GetService("Workspace")
local RunService = game:GetService("RunService")

-- ======================
-- Cấu hình mặc định
-- ======================
local AUTO_STEAL_ENABLED = true
local STEAL_DELAY = 0.5
local MAX_TRIGGER_DISTANCE = 60
local TARGET_RARITIES = {"Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"}
local THEME_COLOR = Color3.new(0.22, 0.6, 0.9) -- Màu chủ đề xanh dương hiện đại

-- ======================
-- Hàm tự động cướp trứng
-- ======================
local function stealAvailableEggs()
    if not AUTO_STEAL_ENABLED then return end
    
    local character = LocalPlayer.Character
    if not character or not character:FindFirstChild("HumanoidRootPart") then return end
    local playerPos = character.HumanoidRootPart.Position

    for _, egg in pairs(Workspace.Eggs:GetChildren()) do
        if egg:IsA("Model") and egg:FindFirstChild("ClickDetector") and egg:FindFirstChild("EggData") then
            local eggPos = egg:GetPivot().Position
            local distance = (playerPos - eggPos).Magnitude
            
            if distance <= MAX_TRIGGER_DISTANCE and table.find(TARGET_RARITIES, egg.EggData.Value) then
                fireclickdetector(egg.ClickDetector)
                task.wait(STEAL_DELAY)
            end
        end
    end
end

-- ======================
-- Tạo GUI tùy chỉnh nâng cao
-- ======================
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = LocalPlayer.PlayerGui
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
ScreenGui.ResetOnSpawn = false

-- Khung chính với bo góc và bóng đổ
local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 280, 0, 380)
MainFrame.Position = UDim2.new(0.02, 0, 0.15, 0)
MainFrame.BackgroundColor3 = Color3.new(0.12, 0.12, 0.12)
MainFrame.BorderSizePixel = 0
MainFrame.BackgroundTransparency = 0.1
MainFrame.Parent = ScreenGui

-- Bo góc cho khung chính
local UICorner_Main = Instance.new("UICorner")
UICorner_Main.CornerRadius = UDim.new(0, 12)
UICorner_Main.Parent = MainFrame

-- Bóng đổ cho khung chính
local UIGradient_Main = Instance.new("UIStroke")
UIGradient_Main.Color = Color3.new(0,0,0)
UIGradient_Main.Thickness = 4
UIGradient_Main.Transparency = 0.7
UIGradient_Main.Parent = MainFrame

-- Tiêu đề menu với màu chủ đề
local TitleLabel = Instance.new("TextLabel")
TitleLabel.Size = UDim2.new(0, 280, 0, 50)
TitleLabel.BackgroundColor3 = THEME_COLOR
TitleLabel.Text = "🥚 Steal An Egg Script"
TitleLabel.TextColor3 = Color3.new(1,1,1)
TitleLabel.TextSize = 18
TitleLabel.Font = Enum.Font.GothamBold
TitleLabel.Parent = MainFrame

-- Bo góc cho tiêu đề
local UICorner_Title = Instance.new("UICorner")
UICorner_Title.CornerRadius = UDim.new(0, 12)
UICorner_Title.Parent = TitleLabel

-- Nút bật/tắt auto steal
local ToggleButton = Instance.new("TextButton")
ToggleButton.Size = UDim2.new(0.85, 0, 0.12, 0)
ToggleButton.Position = UDim2.new(0.075, 0, 0.18, 0)
ToggleButton.BackgroundColor3 = Color3.new(0, 0.8, 0)
ToggleButton.Text = "Bật Auto Steal"
ToggleButton.TextColor3 = Color3.new(1,1,1)
ToggleButton.TextSize = 16
ToggleButton.Font = Enum.Font.GothamMedium
ToggleButton.Parent = MainFrame

-- Bo góc cho nút bấm
local UICorner_Toggle = Instance.new("UICorner")
UICorner_Toggle.CornerRadius = UDim.new(0, 8)
UICorner_Toggle.Parent = ToggleButton

ToggleButton.MouseButton1Click:Connect(function()
    AUTO_STEAL_ENABLED = not AUTO_STEAL_ENABLED
    ToggleButton.Text = AUTO_STEAL_ENABLED and "❌ Tắt Auto Steal" or "✅ Bật Auto Steal"
    ToggleButton.BackgroundColor3 = AUTO_STEAL_ENABLED and Color3.new(0.8, 0, 0) or Color3.new(0, 0.8, 0)
end)

-- Phần điều chỉnh tốc độ cướp
local SpeedSection = Instance.new("Frame")
SpeedSection.Size = UDim2.new(0.85, 0, 0.22, 0)
SpeedSection.Position = UDim2.new(0.075, 0, 0.35, 0)
SpeedSection.BackgroundColor3 = Color3.new(0.18, 0.18, 0.18)
SpeedSection.BorderSizePixel = 0
SpeedSection.Parent = MainFrame

local UICorner_Speed = Instance.new("UICorner")
UICorner_Speed.CornerRadius = UDim.new(0, 8)
UICorner_Speed.Parent = SpeedSection

local SpeedLabel = Instance.new("TextLabel")
SpeedLabel.Size = UDim2.new(1, 0, 0.3, 0)
SpeedLabel.Position = UDim2.new(0, 0, 0.1, 0)
SpeedLabel.Text = "⏱️ Thời gian chờ giữa lần cướp"
SpeedLabel.TextColor3 = Color3.new(1,1,1)
SpeedLabel.TextSize = 14
SpeedLabel.Font = Enum.Font.GothamMedium
SpeedLabel.Parent = SpeedSection

local DelayInput = Instance.new("TextBox")
DelayInput.Size = UDim2.new(0.6, 0, 0.4, 0)
DelayInput.Position = UDim2.new(0.2, 0, 0.5, 0)
DelayInput.BackgroundColor3 = Color3.new(0.3, 0.3, 0.3)
DelayInput.Text = tostring(STEAL_DELAY)
DelayInput.TextColor3 = Color3.new(1,1,1)
DelayInput.TextSize = 14
DelayInput.Font = Enum.Font.Gotham
DelayInput.Parent = SpeedSection

local UICorner_Input = Instance.new("UICorner")
UICorner_Input.CornerRadius = UDim.new(0, 6)
UICorner_Input.Parent = DelayInput

DelayInput.FocusLost:Connect(function(enterPressed)
    if enterPressed then
        local newDelay = tonumber(DelayInput.Text)
        if newDelay and newDelay >= 0.05 then
            STEAL_DELAY = newDelay
            SpeedLabel.Text = string.format("⏱️ Thời gian chờ: %.2f giây", STEAL_DELAY)
        end
    end
end)

-- Phần lọc độ hiếm trứng
local RaritySection = Instance.new("Frame")
RaritySection.Size = UDim2.new(0.85, 0, 0.22, 0)
RaritySection.Position = UDim2.new(0.075, 0, 0.6, 0)
RaritySection.BackgroundColor3 = Color3.new(0.18, 0.18, 0.18)
RaritySection.BorderSizePixel = 0
RaritySection.Parent = MainFrame

local UICorner_Rarity = Instance.new("UICorner")
UICorner_Rarity.CornerRadius = UDim.new(0, 8)
UICorner_Rarity.Parent = RaritySection

local RarityLabel = Instance.new("TextLabel")
RarityLabel.Size = UDim2.new(1, 0, 0.3, 0)
RarityLabel.Position = UDim2.new(0, 0, 0.1, 0)
RarityLabel.Text = "🎯 Lọc độ hiếm trứng"
RarityLabel.TextColor3 = Color3.new(1,1,1)
RarityLabel.TextSize = 14
RarityLabel.Font = Enum.Font.GothamMedium
RarityLabel.Parent = RaritySection

local RarityInput = Instance.new("TextBox")
RarityInput.Size = UDim2.new(0.6, 0, 0.4, 0)
RarityInput.Position = UDim2.new(0.2, 0, 0.5, 0)
RarityInput.BackgroundColor3 = Color3.new(0.3, 0.3, 0.3)
RarityInput.Text = table.concat(TARGET_RARITIES, ", ")
RarityInput.TextColor3 = Color3.new(1,1,1)
RarityInput.TextSize = 12
RarityInput.Font = Enum.Font.Gotham
RarityInput.Parent = RaritySection

local UICorner_RarityInput = Instance.new("UICorner")
UICorner_RarityInput.CornerRadius = UDim.new(0, 6)
UICorner_RarityInput.Parent = RarityInput

RarityInput.FocusLost:Connect(function(enterPressed)
    if enterPressed then
        local input = RarityInput.Text:gsub("%s+", "")
        TARGET_RARITIES = string.split(input, ",")
        for i, rarity in ipairs(TARGET_RARITIES) do
            TARGET_RARITIES[i] = rarity:gsub("%s+", "")
        end
    end
end)

-- Nút đóng menu
local CloseButton = Instance.new("TextButton")
CloseButton.Size = UDim2.new(0, 30, 0, 30)
CloseButton.Position = UDim2.new(0.92, 0, 0.02, 0)
CloseButton.BackgroundColor3 = Color3.new(0.8, 0.2, 0.2)
CloseButton.Text = "❌"
CloseButton.TextColor3 = Color3.new(1,1,1)
CloseButton.TextSize = 14
CloseButton.Parent = MainFrame

local UICorner_Close = Instance.new("UICorner")
UICorner_Close.CornerRadius = UDim.new(0, 6)
UICorner_Close.Parent = CloseButton

CloseButton.MouseButton1Click:Connect(function()
    MainFrame.Visible = not MainFrame.Visible
end)

-- Cho phép kéo di chuyển menu
local isDragging = false
local dragStartPos = nil

MainFrame.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 then
        isDragging = true
        dragStartPos = input.Position - MainFrame.AbsolutePosition
    end
end)

RunService.Heartbeat:Connect(function()
    if isDragging and game:GetService("UserInputService"):IsMouseButtonPressed(Enum.UserInputType.MouseButton1) then
        local mousePos = game:GetService("UserInputService"):GetMouseLocation()
        MainFrame.Position = UDim2.new(0, mousePos.X - dragStartPos.X, 0, mousePos.Y - dragStartPos.Y)
    end
end)

RunService.Heartbeat:Connect(function()
    if not isDragging then return end
    if not game:GetService("UserInputService"):IsMouseButtonPressed(Enum.UserInputType.MouseButton1) then
        isDragging = false
    end
end)

-- ======================
-- Chạy script liên tục
-- ======================
RunService.Heartbeat:Connect(stealAvailableEggs)
