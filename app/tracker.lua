-- ==========================================================
-- ROBLOX AGENT TRACKER SCRIPT
-- ==========================================================

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local MarketplaceService = game:GetService("MarketplaceService")
local LocalPlayer = Players.LocalPlayer

local SERVER_API = _G.SERVER_API or "https://roblox-trackstats.vercel.app/api/tracker"
local DISCORD_WEBHOOK = _G.DISCORD_WEBHOOK or ""
local INTERVAL = 15 

local function getHttpRequest()
    return (syn and syn.request) or (http and http.request) or request or http_request
end

local function extractStats()
    local level = 0
    local beli = 0
    local fruit = "Không có"
    local gameName = "Roblox Game"

    pcall(function()
        gameName = MarketplaceService:GetProductInfo(game.PlaceId).Name
    end)

    pcall(function()
        if LocalPlayer:FindFirstChild("Data") then
            if LocalPlayer.Data:FindFirstChild("Level") then
                level = LocalPlayer.Data.Level.Value
            end
            if LocalPlayer.Data:FindFirstChild("Beli") then
                beli = LocalPlayer.Data.Beli.Value
            end
            if LocalPlayer.Data:FindFirstChild("DevilFruit") then
                fruit = LocalPlayer.Data.DevilFruit.Value
                if fruit == "" then fruit = "Không dùng Trái" end
            end
        end
    end)

    if level == 0 and beli == 0 then
        pcall(function()
            local leaderstats = LocalPlayer:FindFirstChild("leaderstats")
            if leaderstats then
                for _, stat in pairs(leaderstats:GetChildren()) do
                    local name = string.lower(stat.Name)
                    if name:find("level") or name:find("lvl") then
                        level = stat.Value
                    elseif name:find("beli") or name:find("money") or name:find("cash") or name:find("coins") then
                        beli = stat.Value
                    end
                end
            end
        end)
    end

    return {
        username = LocalPlayer.Name,
        userId = LocalPlayer.UserId,
        gameName = gameName,
        placeId = game.PlaceId,
        jobId = game.JobId,
        level = level,
        beli = beli,
        fruit = fruit,
        status = "Autofarming",
        discordWebhook = DISCORD_WEBHOOK
    }
end

local function sendTelemetry()
    local req = getHttpRequest()
    if not req then return end

    local payload = extractStats()
    local response = req({
        Url = SERVER_API,
        Method = "POST",
        Headers = { ["Content-Type"] = "application/json" },
        Body = HttpService:JSONEncode(payload)
    })
end

task.spawn(function()
    while true do
        pcall(sendTelemetry)
        task.wait(INTERVAL)
    end
end)
