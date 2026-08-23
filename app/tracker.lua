-- ===================================================
-- TRACKSTATS ADVANCED PINGER WITH FULL INVENTORY SCAN
-- ===================================================

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local CoreGui = game:GetService("CoreGui")
local LocalPlayer = Players.LocalPlayer

local VERCEL_API_URL = "https://aotwing-dusky.vercel.app/api/ping"
local PING_INTERVAL = 15

-- 1. HÀM QUÉT SÂU THÔNG TIN & KHO ĐỒ BLOX FRUITS
local function getDetailedStats()
    local level, beli, fragments, bounty = 1, 0, 0, 0
    local fruit, race, melee = "None", "Human", "Combat"
    local hasPulledLever = false
    
    local inventoryFruits = {}
    local swords = {}
    local guns = {}
    local materials = {}

    pcall(function()
        -- Chỉ số cơ bản
        if LocalPlayer:FindFirstChild("Data") then
            level = LocalPlayer.Data.Level.Value
            beli = LocalPlayer.Data.Beli.Value
            fragments = LocalPlayer.Data.Fragments.Value
            fruit = LocalPlayer.Data.DevilFruit.Value ~= "" and LocalPlayer.Data.DevilFruit.Value or "None"
            race = LocalPlayer.Data.Race.Value
        end

        -- Bounty / Honor
        if LocalPlayer:FindFirstChild("leaderstats") and LocalPlayer.leaderstats:FindFirstChild("Bounty/Honor") then
            bounty = LocalPlayer.leaderstats["Bounty/Honor"].Value
        end

        -- Tiến trình V4 (Gạt cần)
        if LocalPlayer:FindFirstChild("Data") and LocalPlayer.Data:FindFirstChild("RaceV4") then
            hasPulledLever = LocalPlayer.Data.RaceV4.Value
        end

        -- Quét Võ / Fighting Style & Vũ khí đang có
        for _, item in pairs(LocalPlayer.Backpack:GetChildren()) do
            if item:IsA("Tool") then
                if item.ToolTip == "Melee" then melee = item.Name end
            end
        end

        -- Quét Kho đồ (Inventory & Materials)
        if game:GetService("ReplicatedStorage"):FindFirstChild("Remotes") and game:GetService("ReplicatedStorage").Remotes:FindFirstChild("CommF_") then
            local invData = game:GetService("ReplicatedStorage").Remotes.CommF_:InvokeServer("getInventory")
            if type(invData) == "table" then
                for _, item in pairs(invData) do
                    if item.Type == "Blox Fruit" then
                        table.insert(inventoryFruits, { name = item.Name, count = item.Count or 1 })
                    elseif item.Type == "Sword" then
                        table.insert(swords, { name = item.Name })
                    elseif item.Type == "Gun" then
                        table.insert(guns, { name = item.Name })
                    elseif item.Type == "Material" then
                        table.insert(materials, { name = item.Name, count = item.Count or 1 })
                    end
                end
            end
        end
    end)

    return {
        username = LocalPlayer.Name,
        userId = LocalPlayer.UserId,
        level = level,
        beli = beli,
        fragments = fragments,
        bounty = bounty,
        fruit = fruit,
        race = race,
        melee = melee,
        hasPulledLever = hasPulledLever,
        inventoryFruits = inventoryFruits,
        swords = swords,
        guns = guns,
        materials = materials,
        placeId = game.PlaceId,
        jobId = game.JobId,
        note = "PC-01"
    }
end

-- 2. TẠO MENU NHẬP KEY & VÒNG LẶP PING
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "TrackStatsKeyUI"
ScreenGui.Parent = CoreGui or LocalPlayer:WaitForChild("PlayerGui")

local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 300, 0, 160)
MainFrame.Position = UDim2.new(0.5, -150, 0.4, -75)
MainFrame.BackgroundColor3 = Color3.fromRGB(15, 23, 42)
MainFrame.Parent = ScreenGui
Instance.new("UICorner", MainFrame).CornerRadius = UDim.new(0, 12)

local KeyInput = Instance.new("TextBox")
KeyInput.Size = UDim2.new(0.8, 0, 0, 35)
KeyInput.Position = UDim2.new(0.1, 0, 0.3, 0)
KeyInput.PlaceholderText = "Nhập Key từ Web..."
KeyInput.BackgroundColor3 = Color3.fromRGB(30, 41, 59)
KeyInput.TextColor3 = Color3.fromRGB(255, 255, 255)
KeyInput.Parent = MainFrame
Instance.new("UICorner", KeyInput).CornerRadius = UDim.new(0, 8)

local SubmitBtn = Instance.new("TextButton")
SubmitBtn.Size = UDim2.new(0.8, 0, 0, 35)
SubmitBtn.Position = UDim2.new(0.1, 0, 0.65, 0)
SubmitBtn.Text = "XÁC NHẬN"
SubmitBtn.BackgroundColor3 = Color3.fromRGB(245, 158, 11)
SubmitBtn.Font = Enum.Font.GothamBold
SubmitBtn.Parent = MainFrame
Instance.new("UICorner", SubmitBtn).CornerRadius = UDim.new(0, 8)

SubmitBtn.MouseButton1Click:Connect(function()
    local userKey = KeyInput.Text
    if #userKey >= 3 then
        ScreenGui:Destroy()
        task.spawn(function()
            while task.wait(PING_INTERVAL) do
                pcall(function()
                    local data = getDetailedStats()
                    data.key = userKey
                    local req = (syn and syn.request) or (http and http.request) or http_request or request
                    if req then
                        req({
                            Url = VERCEL_API_URL,
                            Method = "POST",
                            Headers = { ["Content-Type"] = "application/json" },
                            Body = HttpService:JSONEncode(data)
                        })
                    end
                end)
            end
        end)
    end
end)
