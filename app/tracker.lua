-- ==========================================================
-- YEAGER NEXUS ULTIMATE v10.0 - ROBLOX TELEMETRY TRACKER
-- Quản trị viên: Pham Yen (Yeager Pannel)
-- ==========================================================

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

-- CẤU HÌNH HỆ THỐNG
local CONFIG = {
    API_URL = "https://your-vercel-domain.vercel.app/api/ping", -- Thay bằng domain Vercel của bạn
    SECRET_KEY = "kuri_live_your_key_here",                     -- Khóa bảo mật trùng với Web
    SYNC_INTERVAL = 3                                          -- Tần suất đồng bộ (giây)
}

-- Tự động nhận diện tên game đang chạy
local function getGameName()
    local placeId = game.PlaceId
    if placeId == 2753915549 or placeId == 4442272183 or placeId == 7449423635 then
        return "Blox Fruits"
    elseif placeId == 4520749081 then
        return "King Legacy"
    else
        local success, info = pcall(function()
            return game:GetService("MarketplaceService"):GetProductInfo(placeId).Name
        end)
        return success and info or "Roblox Custom Game"
    end
end

-- Thu thập thông số nhân vật chi tiết
local function gatherPlayerData()
    local stats = {
        level = 1,
        currency = 0,
        premiumCurrency = 0,
        bounty = 0
    }
    
    local leaderstats = LocalPlayer:FindFirstChild("leaderstats")
    if leaderstats then
        local lvl = leaderstats:FindFirstChild("Level") or leaderstats:FindFirstChild("Lv") or leaderstats:FindFirstChild("Cấp Độ")
        if lvl then stats.level = tonumber(lvl.Value) or 1 end
        
        local beli = leaderstats:FindFirstChild("Beli") or leaderstats:FindFirstChild("Cash") or leaderstats:FindFirstChild("Money") or leaderstats:FindFirstChild("Tiền")
        if beli then stats.currency = tonumber(beli.Value) or 0 end
        
        local frag = leaderstats:FindFirstChild("Fragments") or leaderstats:FindFirstChild("Gems") or leaderstats:FindFirstChild("Fragments/Gems")
        if frag then stats.premiumCurrency = tonumber(frag.Value) or 0 end
        
        local bounty = leaderstats:FindFirstChild("Bounty") or leaderstats:FindFirstChild("Honor") or leaderstats:FindFirstChild("Thưởng")
        if bounty then stats.bounty = tonumber(bounty.Value) or 0 end
    end
    
    -- Quét vũ khí / item trong balo và nhân vật
    local weapons = {}
    local backpack = LocalPlayer:FindFirstChild("Backpack")
    local character = LocalPlayer.Character
    
    if backpack then
        for _, item in ipairs(backpack:GetChildren()) do
            if item:IsA("Tool") and not table.find(weapons, item.Name) then
                table.insert(weapons, item.Name)
            end
        end
    end
    if character then
        for _, item in ipairs(character:GetChildren()) do
            if item:IsA("Tool") and not table.find(weapons, item.Name) then
                table.insert(weapons, item.Name)
            end
        end
    end
    
    return {
        userId = LocalPlayer.UserId,
        username = LocalPlayer.Name,
        gameName = getGameName(),
        lastUpdated = tick() * 1000,
        stats = stats,
        inventory = {
            weapons = weapons
        }
    }
end

-- Vòng lặp gửi dữ liệu ngầm không giật lag
task.spawn(function()
    print("🛡️ [Yeager Nexus v10.0]: Đã khởi động luồng theo dõi thời gian thực!")
    while true do
        local success, err = pcall(function()
            local playerData = gatherPlayerData()
            local payload = HttpService:JSONEncode({
                key = CONFIG.SECRET_KEY,
                account = playerData
            })
            
            HttpService:PostAsync(
                CONFIG.API_URL, 
                payload, 
                Enum.HttpContentType.ApplicationJson, 
                false, 
                { ["Content-Type"] = "application/json" }
            )
        end)
        
        if not success then
            warn("⚠️ [Yeager Nexus v10.0 Sync Error]: " .. tostring(err))
        end
        
        task.wait(CONFIG.SYNC_INTERVAL)
    end
end)
