-- ===================================================
-- TRACKSTATS ADVANCED ROBLOX SYNC ENGINE (ULTRA)
-- ===================================================

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local CoreGui = game:GetService("CoreGui")
local LocalPlayer = Players.LocalPlayer

local VERCEL_API_URL = "https://aotwing-dusky.vercel.app/api/ping"
local PING_INTERVAL = 10 -- Tần suất đồng bộ 10s/lần

local function getFullAccountData()
    local level, beli, fragments, bounty = 1, 0, 0, 0
    local fruit, race, melee = "None", "Human", "Combat"
    local hasPulledLever = false
    
    local inventoryFruits = {}
    local swords = {}
    local guns = {}
    local accessories = {}
    local materials = {}

    local addedItems = {} -- Chống trùng lặp item

    -- 1. Quét dữ liệu chỉ số cơ bản
    pcall(function()
        if LocalPlayer:FindFirstChild("Data") then
            level = LocalPlayer.Data.Level.Value
            beli = LocalPlayer.Data.Beli.Value
            fragments = LocalPlayer.Data.Fragments.Value
            fruit = (LocalPlayer.Data.DevilFruit.Value ~= "") and LocalPlayer.Data.DevilFruit.Value or "None"
            race = LocalPlayer.Data.Race.Value
        end

        if LocalPlayer:FindFirstChild("leaderstats") and LocalPlayer.leaderstats:FindFirstChild("Bounty/Honor") then
            bounty = LocalPlayer.leaderstats["Bounty/Honor"].Value
        end

        if LocalPlayer:FindFirstChild("Data") and LocalPlayer.Data:FindFirstChild("RaceV4") then
            hasPulledLever = LocalPlayer.Data.RaceV4.Value
        end
    end)

    -- 2. Quét Trang bị trên người (Backpack & Character)
    local function scanTool(tool)
        if not tool or not tool:IsA("Tool") then return end
        local name = tool.Name
        local toolType = tool.ToolTip or ""

        if toolType == "Melee" then
            melee = name
        elseif toolType == "Sword" and not addedItems[name] then
            addedItems[name] = true
            table.insert(swords, { name = name })
        elseif toolType == "Gun" and not addedItems[name] then
            addedItems[name] = true
            table.insert(guns, { name = name })
        elseif toolType == "Blox Fruit" and not addedItems[name] then
            addedItems[name] = true
            table.insert(inventoryFruits, { name = name, count = 1 })
        end
    end

    pcall(function()
        for _, item in pairs(LocalPlayer.Backpack:GetChildren()) do scanTool(item) end
        if LocalPlayer.Character then
            for _, item in pairs(LocalPlayer.Character:GetChildren()) do scanTool(item) end
        end
    end)

    -- 3. Quét Server Remote Kho đồ (CommF_ getInventory)
    pcall(function()
        local remotes = game:GetService("ReplicatedStorage"):FindFirstChild("Remotes")
        if remotes and remotes:FindFirstChild("CommF_") then
            local invData = remotes.CommF_:InvokeServer("getInventory")
            if type(invData) == "table" then
                for _, item in pairs(invData) do
                    local itemName = item.Name or item.value or "Unknown"
                    local itemType = item.Type or ""
                    local itemCount = item.Count or 1

                    if itemType == "Blox Fruit" then
                        table.insert(inventoryFruits, { name = itemName, count = itemCount })
                    elseif itemType == "Sword" and not addedItems[itemName] then
                        addedItems[itemName] = true
                        table.insert(swords, { name = itemName })
                    elseif itemType == "Gun" and not addedItems[itemName] then
                        addedItems[itemName] = true
                        table.insert(guns, { name = itemName })
                    elseif (itemType == "Wear" or itemType == "Accessory") and not addedItems[itemName] then
                        addedItems[itemName] = true
                        table.insert(accessories, { name = itemName })
                    elseif itemType == "Material" then
                        table.insert(materials, { name = itemName, count = itemCount })
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
        accessories = accessories,
        materials = materials,
        note = "PC-01"
    }
end

-- UI Nhập Key trong Roblox
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "TrackStatsSyncUI"
ScreenGui.Parent = CoreGui or LocalPlayer:WaitForChild("PlayerGui")

local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 320, 0, 170)
MainFrame.Position = UDim2.new(0.5, -160, 0.4, -85)
MainFrame.BackgroundColor3 = Color3.fromRGB(11, 15, 25)
MainFrame.Parent = ScreenGui
Instance.new("UICorner", MainFrame).CornerRadius = UDim.new(0, 14)

local KeyInput = Instance.new("TextBox")
KeyInput.Size = UDim2.new(0.85, 0, 0, 38)
KeyInput.Position = UDim2.new(0.075, 0, 0.25, 0)
KeyInput.PlaceholderText = "Nhập Key từ Web (ví dụ: aotwing5612)..."
KeyInput.BackgroundColor3 = Color3.fromRGB(20, 27, 44)
KeyInput.TextColor3 = Color3.fromRGB(255, 255, 255)
KeyInput.TextSize = 13
KeyInput.Parent = MainFrame
Instance.new("UICorner", KeyInput).CornerRadius = UDim.new(0, 8)

local SubmitBtn = Instance.new("TextButton")
SubmitBtn.Size = UDim2.new(0.85, 0, 0, 38)
SubmitBtn.Position = UDim2.new(0.075, 0, 0.6, 0)
SubmitBtn.Text = "KẾT NỐI & ĐỒNG BỘ"
SubmitBtn.BackgroundColor3 = Color3.fromRGB(245, 158, 11)
SubmitBtn.TextColor3 = Color3.fromRGB(15, 23, 42)
SubmitBtn.Font = Enum.Font.GothamBold
SubmitBtn.TextSize = 13
SubmitBtn.Parent = MainFrame
Instance.new("UICorner", SubmitBtn).CornerRadius = UDim.new(0, 8)

SubmitBtn.MouseButton1Click:Connect(function()
    local userKey = KeyInput.Text
    if #userKey >= 3 then
        ScreenGui:Destroy()
        task.spawn(function()
            while task.wait(PING_INTERVAL) do
                pcall(function()
                    local data = getFullAccountData()
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
