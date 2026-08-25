-- Script Auto Steal Egg Steal An Egg Roblox
local LocalPlayer = game:GetService("Players").LocalPlayer
local Workspace = game:GetService("Workspace")
local RunService = game:GetService("RunService")

-- ======================
-- Cấu hình mặc định
-- ======================
local AUTO_STEAL_ENABLED = true
-- Thời gian chờ GIỮA các lần cướp (giây)
local STEAL_DELAY = 0.5
-- Khoảng cách tìm kiếm trứng gần nhất (stud)
local MAX_TRIGGER_DISTANCE = 60
-- Lọc độ hiếm trứng mục tiêu
local TARGET_RARITIES = {"Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"}

-- ======================
-- Hàm tự động cướp trứng
-- ======================
local function stealAvailableEggs()
    if not AUTO_STEAL_ENABLED then return end
    
    local character = LocalPlayer.Character
    if not character or not character:FindFirstChild("HumanoidRootPart") then return end
    local playerPos = character.HumanoidRootPart.Position

    -- Lặp qua tất cả trứng trên bản đồ
    for _, egg in pairs(Workspace.Eggs:GetChildren()) do
        -- Kiểm tra đối tượng trứng hợp lệ
        if egg:IsA("Model") and egg:FindFirstChild("ClickDetector") and egg:FindFirstChild("EggData") then
            local eggPos = egg:GetPivot().Position
            local distance = (playerPos - eggPos).Magnitude
            
            -- Kiểm tra khoảng cách hợp lệ
            if distance <= MAX_TRIGGER_DISTANCE then
                local eggRarity = egg.EggData.Value
                -- Lọc trứng theo độ hiếm
                if table.find(TARGET_RARITIES, eggRarity) then
                    -- Tự động nhấp chuột vào trứng
                    fireclickdetector(egg.ClickDetector)
                    task.wait(STEAL_DELAY)
                end
            end
        end
    end
end

-- ======================
-- Tạo GUI điều khiển script
-- ======================
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = LocalPlayer.PlayerGui
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

-- Khung chính menu
local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 220, 0, 280)
MainFrame.Position = UDim2.new(0.01, 0, 0.1, 0)
MainFrame.BackgroundColor3 = Color3.new(0.12, 0.12, 0.12)
MainFrame.BorderSizePixel = 0
MainFrame.Parent = ScreenGui

-- Tiêu đề menu
local TitleLabel = Instance.new("TextLabel")
TitleLabel.Size = UDim2.new(0, 220, 0, 40)
TitleLabel.BackgroundColor3 = Color3.new(0.18, 0.18, 0.18)
TitleLabel.Text = "🤖 Script Steal An Egg"
TitleLabel.TextColor3 = Color3.new(1,1,1)
TitleLabel.Parent = MainFrame

-- Nút bật/tắt auto steal
local ToggleButton = Instance.new("TextButton")
ToggleButton.Size = UDim2.new(0.8, 0, 0.15, 0)
ToggleButton.Position = UDim2.new(0.1, 0, 0.2, 0)
ToggleButton.BackgroundColor3 = Color3.new(0, 0.8, 0)
ToggleButton.Text = "Bật Auto Steal"
ToggleButton.TextColor3 = Color3.new(1,1,1)
ToggleButton.Parent = MainFrame

ToggleButton.MouseButton1Click:Connect(function()
    AUTO_STEAL_ENABLED = not AUTO_STEAL_ENABLED
    ToggleButton.Text = AUTO_STEAL_ENABLED and "Tắt Auto Steal" or "Bật Auto Steal"
    ToggleButton.BackgroundColor3 = AUTO_STEAL_ENABLED and Color3.new(0.8, 0, 0) or Color3.new(0, 0.8, 0)
end)

-- Nhãn hiển thị thời gian chờ
local DelayLabel = Instance.new("TextLabel")
DelayLabel.Size = UDim2.new(0.8, 0, 0.1, 0)
DelayLabel.Position = UDim2.new(0.1, 0, 0.4, 0)
DelayLabel.Text = "Thời gian chờ: " .. STEAL_DELAY .. "s"
DelayLabel.TextColor3 = Color3.new(1,1,1)
DelayLabel.Parent = MainFrame

-- Ô nhập thời gian chờ
local DelayInput = Instance.new("TextBox")
DelayInput.Size = UDim2.new(0.8, 0, 0.15, 0)
DelayInput.Position = UDim2.new(0.1, 0, 0.5, 0)
DelayInput.BackgroundColor3 = Color3.new(0.3, 0.3, 0.3)
DelayInput.Text = tostring(STEAL_DELAY)
DelayInput.TextColor3 = Color3.new(1,1,1)
DelayInput.Parent = MainFrame

DelayInput.FocusLost:Connect(function(enterPressed)
    if enterPressed then
        local newDelay = tonumber(DelayInput.Text)
        if newDelay and newDelay >= 0.05 then
            STEAL_DELAY = newDelay
            DelayLabel.Text = "Thời gian chờ: " .. string.format("%.2f", STEAL_DELAY) .. "s"
        end
    end
end)

-- Nhãn hướng dẫn độ hiếm
local RarityLabel = Instance.new("TextLabel")
RarityLabel.Size = UDim2.new(0.8, 0, 0.1, 0)
RarityLabel.Position = UDim2.new(0.1, 0, 0.7, 0)
RarityLabel.Text = "Độ hiếm mục tiêu"
RarityLabel.TextColor3 = Color3.new(1,1,1)
RarityLabel.Parent = MainFrame

-- Danh sách lọc độ hiếm
local RarityDropdown = Instance.new("TextBox")
RarityDropdown.Size = UDim2.new(0.8, 0, 0.15, 0)
RarityDropdown.Position = UDim2.new(0.1, 0, 0.8, 0)
RarityDropdown.BackgroundColor3 = Color3.new(0.3, 0.3, 0.3)
RarityDropdown.Text = table.concat(TARGET_RARITIES, ", ")
RarityDropdown.TextColor3 = Color3.new(1,1,1)
RarityDropdown.Parent = MainFrame

RarityDropdown.FocusLost:Connect(function(enterPressed)
    if enterPressed then
        local input = RarityDropdown.Text:gsub("%s+", "")
        TARGET_RARITIES = string.split(input, ",")
        -- Chuẩn hóa khoảng trắng cho từng độ hiếm
        for i, rarity in ipairs(TARGET_RARITIES do
            TARGET_RARITIES[i] = rarity:gsub("%s+", "")
        end
    end
end)

-- ======================
-- Chạy script liên tục
-- ======================
RunService.Heartbeat:Connect(stealAvailableEggs)
