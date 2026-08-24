-- ==========================================
-- YEAGER PANNEL - ADVANCED MULTI-GAME SYNC
-- ==========================================
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

local API_ENDPOINT = "https://LINK-VERCEL-CUA-BAN.vercel.app/api/ping"
local SECRET_KEY = "NHAP_KEY_VAO_DAY"

-- Tự động nhận diện Game
local GameDatabase = {
    [2753915549] = "Blox Fruits",
    [4442272183] = "Blox Fruits",
    [7449423635] = "Blox Fruits",
    [14282329184] = "Attack on Titan Revolution",
    [4520749081] = "King Legacy"
}

local CurrentGameName = GameDatabase[game.PlaceId] or "Roblox Game (" .. tostring(game.PlaceId) .. ")"

-- Hàm quét thông số an toàn (Chống Crash)
local function DeepScan()
    local data = {
        level = 1, currency = 0, premiumCurrency = 0, bounty = 0
    }
    local inv = { weapons = {}, items = {}, accessories = {} }

    pcall(function()
        -- 1. Quét Chỉ Số
        if LocalPlayer:FindFirstChild("leaderstats") then
            for _, stat in pairs(LocalPlayer.leaderstats:GetChildren()) do
                local sName = stat.Name:lower()
                if sName:find("level") or sName:find("lvl") then data.level = stat.Value
                elseif sName:find("beli") or sName:find("coin") or sName:find("cash") then data.currency = stat.Value
                elseif sName:find("gem") or sName:find("fragment") then data.premiumCurrency = stat.Value
                elseif sName:find("bounty") or sName:find("honor") then data.bounty = stat.Value end
            end
        end

        -- 2. Quét Kho Đồ (Vũ khí & Vật phẩm)
        local function checkItem(item)
            if item:IsA("Tool") then
                table.insert(inv.weapons, item.Name)
            end
        end

        for _, v in pairs(LocalPlayer.Backpack:GetChildren()) do checkItem(v) end
        if LocalPlayer.Character then
            for _, v in pairs(LocalPlayer.Character:GetChildren()) do checkItem(v) end
        end
    end)

    return data, inv
end

-- Vòng lặp đồng bộ siêu mượt (5 giây 1 lần, chạy ngầm)
task.spawn(function()
    while task.wait(5) do
        if SECRET_KEY ~= "NHAP_KEY_VAO_DAY" and SECRET_KEY ~= "" then
            pcall(function()
                local statsData, inventoryData = DeepScan()
                
                local payload = {
                    key = SECRET_KEY,
                    userId = LocalPlayer.UserId,
                    username = LocalPlayer.Name,
                    gameName = CurrentGameName,
                    stats = statsData,
                    inventory = inventoryData
                }

                local requestMethod = syn and syn.request or http and http.request or request
                if requestMethod then
                    requestMethod({
                        Url = API_ENDPOINT,
                        Method = "POST",
                        Headers = { ["Content-Type"] = "application/json" },
                        Body = HttpService:JSONEncode(payload)
                    })
                end
            end)
        end
    end
end)
