-- =======================================================
-- YEAGER NEXUS v7.0 - UNIFIED MULTI-GAME TRACKER
-- =======================================================
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

local API_URL = "https://your-vercel-domain.vercel.app/api/ping"
local CLIENT_KEY = "NHAP_KEY_CUA_BAN_O_DAY"

-- Bảng cấu hình đã hợp nhất toàn bộ Place ID của Blox Fruits vào một tên duy nhất
local GameConfigs = {
    [2753915549] = { Name = "Blox Fruits", Path = "leaderstats", Lvl = "Level", Money = "Beli" }, -- Sea 1
    [4442272183] = { Name = "Blox Fruits", Path = "leaderstats", Lvl = "Level", Money = "Beli" }, -- Sea 2
    [7449423635] = { Name = "Blox Fruits", Path = "leaderstats", Lvl = "Level", Money = "Beli" }, -- Sea 3
    [14282329184] = { Name = "Attack on Titan Revolution", Path = "Data", Lvl = "Rank", Money = "Gold" },
    [8737899170] = { Name = "Pet Simulator 99", Path = "leaderstats", Lvl = "Rank", Money = "Coins" },
    [4520749081] = { Name = "King Legacy", Path = "leaderstats", Lvl = "Level", Money = "Beli" }
}

local CurrentGame = GameConfigs[game.PlaceId] or { Name = "Roblox Global", Path = "leaderstats", Lvl = "Level", Money = "Cash" }

local function ScanDataDeep()
    local statsData = { level = 1, currency = 0, premiumCurrency = 0, bounty = 0 }
    local inventoryData = { weapons = {}, items = {} }

    pcall(function()
        local folder = LocalPlayer:FindFirstChild(CurrentGame.Path)
        if folder then
            local lvl = folder:FindFirstChild(CurrentGame.Lvl)
            local mon = folder:FindFirstChild(CurrentGame.Money)
            if lvl then statsData.level = tonumber(lvl.Value) or 1 end
            if mon then statsData.currency = tonumber(mon.Value) or 0 end

            for _, stat in pairs(folder:GetChildren()) do
                if stat:IsA("IntValue") or stat:IsA("NumberValue") then
                    local name = stat.Name:lower()
                    if name:find("gem") or name:find("diamond") or name:find("fragment") then
                        statsData.premiumCurrency = stat.Value
                    elseif name:find("bounty") or name:find("honor") or name:find("infamy") then
                        statsData.bounty = stat.Value
                    end
                end
            end
        end

        local function extractItems(container)
            if container then
                for _, item in pairs(container:GetChildren()) do
                    if item:IsA("Tool") and not table.find(inventoryData.weapons, item.Name) then
                        table.insert(inventoryData.weapons, item.Name)
                    end
                end
            end
        end

        extractItems(LocalPlayer:FindFirstChild("Backpack"))
        if LocalPlayer.Character then
            extractItems(LocalPlayer.Character)
        end
    end)

    return statsData, inventoryData
end

task.spawn(function()
    print("[Yeager Nexus V7]: Đã khởi động đồng bộ cho: " .. CurrentGame.Name)
    
    while task.wait(4) do
        if CLIENT_KEY ~= "NHAP_KEY_CUA_BAN_O_DAY" and CLIENT_KEY ~= "" then
            pcall(function()
                local sData, iData = ScanDataDeep()
                local payload = {
                    key = CLIENT_KEY,
                    userId = LocalPlayer.UserId,
                    username = LocalPlayer.Name,
                    gameName = CurrentGame.Name,
                    stats = sData,
                    inventory = iData
                }

                local requestFunc = (syn and syn.request) or (http and http.request) or request
                if requestFunc then
                    requestFunc({
                        Url = API_URL,
                        Method = "POST",
                        Headers = { ["Content-Type"] = "application/json" },
                        Body = HttpService:JSONEncode(payload)
                    })
                end
            end)
        end
    end
end)
