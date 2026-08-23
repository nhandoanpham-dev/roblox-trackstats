-- ===================================================
-- AOTWING UNIVERSAL MULTI-GAME TRACKER ENGINE v3.0
-- ===================================================

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local CoreGui = game:GetService("CoreGui")
local LocalPlayer = Players.LocalPlayer

local VERCEL_API_URL = "https://aotwing-dusky.vercel.app/api/ping"
local PING_INTERVAL = 8

-- 1. DANH SÁCH NHẬN DIỆN GAME TỰ ĐỘNG
local GAME_DETECTOR = {
    [2753915549] = "Blox Fruits", [4442272183] = "Blox Fruits", [7449423635] = "Blox Fruits",
    [4520749081] = "King Legacy",
    [14282329184] = "Attack on Titan Revolution",
    [8737899170] = "Pet Simulator 99",
    [8304191830] = "Anime Adventures"
}

local function detectCurrentGame()
    return GAME_DETECTOR[game.PlaceId] or ("Game ID: " .. tostring(game.PlaceId))
end

-- 2. HÀM QUÉT DỮ LIỆU ĐA GAME (UNIVERSAL SCANNER)
local function getUniversalGameData()
    local currentGame = detectCurrentGame()
    
    local stats = {
        level = 1,
        beli = 0,
        gems = 0,
        bounty = 0,
        classOrRace = "N/A",
        primaryAbility = "N/A"
    }

    local inventoryFruits = {}
    local weapons = {}
    local accessories = {}
    local materials = {}

    local added = {}

    pcall(function()
        -- Quét Leaderstats tổng quát
        if LocalPlayer:FindFirstChild("leaderstats") then
            for _, child in pairs(LocalPlayer.leaderstats:GetChildren()) do
                local name = child.Name:lower()
                if name:find("bounty") or name:find("honor") then stats.bounty = child.Value
                elseif name:find("level") or name:find("lvl") then stats.level = child.Value
                elseif name:find("gold") or name:find("beli") or name:find("coins") then stats.beli = child.Value
                elseif name:find("gems") or name:find("diamonds") then stats.gems = child.Value end
            end
        end

        -- Quét Data Folder chung (Blox Fruits, King Legacy, v.v.)
        if LocalPlayer:FindFirstChild("Data") then
            if LocalPlayer.Data:FindFirstChild("Level") then stats.level = LocalPlayer.Data.Level.Value end
            if LocalPlayer.Data:FindFirstChild("Beli") then stats.beli = LocalPlayer.Data.Beli.Value end
            if LocalPlayer.Data:FindFirstChild("Gems") or LocalPlayer.Data:FindFirstChild("Fragments") then 
                stats.gems = (LocalPlayer.Data:FindFirstChild("Gems") or LocalPlayer.Data:FindFirstChild("Fragments")).Value 
            end
            if LocalPlayer.Data:FindFirstChild("Race") then stats.classOrRace = LocalPlayer.Data.Race.Value end
            if LocalPlayer.Data:FindFirstChild("DevilFruit") then stats.primaryAbility = LocalPlayer.Data.DevilFruit.Value end
        end

        -- Quét Backpack & Character (Vũ khí, Item đang cầm)
        local function scanItem(item)
            if not item or not item:IsA("Tool") then return end
            local name = item.Name
            if not added[name] then
                added[name] = true
                table.insert(weapons, { name = name, type = item.ToolTip ~= "" and item.ToolTip or "Item" })
            end
        end

        for _, item in pairs(LocalPlayer.Backpack:GetChildren()) do scanItem(item) end
        if LocalPlayer.Character then
            for _, item in pairs(LocalPlayer.Character:GetChildren()) do scanItem(item) end
        end

        -- Quét Remote Inventory nếu có
        local remotes = game:GetService("ReplicatedStorage"):FindFirstChild("Remotes")
        if remotes and remotes:FindFirstChild("CommF_") then
            local invData = remotes.CommF_:InvokeServer("getInventory")
            if type(invData) == "table" then
                for _, item in pairs(invData) do
                    local itemName = item.Name or "Unknown"
                    local itemType = item.Type or "General"
                    local count = item.Count or 1

                    if itemType == "Blox Fruit" then table.insert(inventoryFruits, { name = itemName, count = count })
                    elseif itemType == "Wear" or itemType == "Accessory" then table.insert(accessories, { name = itemName })
                    elseif itemType == "Material" then table.insert(materials, { name = itemName, count = count })
                    elseif not added[itemName] then
                        added[itemName] = true
                        table.insert(weapons, { name = itemName, type = itemType })
                    end
                end
            end
        end
    end)

    return {
        username = LocalPlayer.Name,
        userId = LocalPlayer.UserId,
        gameName = currentGame,
        placeId = game.PlaceId,
        stats = stats,
        inventoryFruits = inventoryFruits,
        weapons = weapons,
        accessories = accessories,
        materials = materials
    }
end

-- 3. GIAO DIỆN NHẬP KEY TRONG GAME
local ScreenGui = Instance.new("ScreenGui", CoreGui or LocalPlayer:WaitForChild("PlayerGui"))
ScreenGui.Name = "AotwingUniversalUI"

local MainFrame = Instance.new("Frame", ScreenGui)
MainFrame.Size = UDim2.new(0, 320, 0, 160)
MainFrame.Position = UDim2.new(0.5, -160, 0.4, -80)
MainFrame.BackgroundColor3 = Color3.fromRGB(13, 17, 28)
Instance.new("UICorner", MainFrame).CornerRadius = UDim.new(0, 12)

local KeyInput = Instance.new("TextBox", MainFrame)
KeyInput.Size = UDim2.new(0.85, 0, 0, 38)
KeyInput.Position = UDim2.new(0.075, 0, 0.25, 0)
KeyInput.PlaceholderText = "Nhập Key Discord (Ví dụ: AOT-XXXX)..."
KeyInput.BackgroundColor3 = Color3.fromRGB(22, 30, 48)
KeyInput.TextColor3 = Color3.fromRGB(255, 255, 255)
KeyInput.TextSize = 12
Instance.new("UICorner", KeyInput).CornerRadius = UDim.new(0, 8)

local SubmitBtn = Instance.new("TextButton", MainFrame)
SubmitBtn.Size = UDim2.new(0.85, 0, 0, 38)
SubmitBtn.Position = UDim2.new(0.075, 0, 0.6, 0)
SubmitBtn.Text = "KẾT NỐI VỚI WEB DASHBOARD"
SubmitBtn.BackgroundColor3 = Color3.fromRGB(245, 158, 11)
SubmitBtn.TextColor3 = Color3.fromRGB(13, 17, 28)
SubmitBtn.Font = Enum.Font.GothamBold
Instance.new("UICorner", SubmitBtn).CornerRadius = UDim.new(0, 8)

SubmitBtn.MouseButton1Click:Connect(function()
    local userKey = KeyInput.Text
    if #userKey >= 3 then
        ScreenGui:Destroy()
        task.spawn(function()
            while task.wait(PING_INTERVAL) do
                pcall(function()
                    local data = getUniversalGameData()
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
