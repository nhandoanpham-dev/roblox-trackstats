-- ========================================================
-- YEAGER PANNEL TRACKER v13.0 - LUA SCRIPT
-- Hướng dẫn: Đặt script này vào StarterPlayerScripts (LocalScript)
-- Nhớ bật tính năng HttpService trong game Roblox của bạn.
-- ========================================================

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local localPlayer = Players.LocalPlayer

-- Thay đổi địa chỉ Vercel của bạn ở đây:
local WEB_URL = "https://aotwing-dusky.vercel.app/api/ping" 
local SECRET_KEY = "yeager2026" -- Khóa bảo mật trùng với cấu hình backend

local function fetchPlayerStats()
    local level = 1
    local currency = 0

    -- Tự động tìm dữ liệu cấp độ và tiền tệ thông dụng trong game Roblox
    local dataFolder = localPlayer:FindFirstChild("Data") or localPlayer:FindFirstChild("PlayerData")
    if dataFolder then
        if dataFolder:FindFirstChild("Level") then 
            level = dataFolder.Level.Value 
        end
        if dataFolder:FindFirstChild("Beli") then 
            currency = dataFolder.Beli.Value 
        elseif dataFolder:FindFirstChild("Gold") then 
            currency = dataFolder.Gold.Value 
        elseif dataFolder:FindFirstChild("Cash") then
            currency = dataFolder.Cash.Value
        end
    end

    return {
        level = level,
        currency = currency
    }
end

-- Vòng lặp tự động gửi dữ liệu về Web mỗi 10 giây
while true do
    task.spawn(function()
        local success, err = pcall(function()
            local stats = fetchPlayerStats()
            
            local payload = {
                key = SECRET_KEY,
                action = "update_account",
                accountData = {
                    userId = localPlayer.UserId,
                    username = localPlayer.Name,
                    gameName = "Blox Fruits / AOT Revolution",
                    stats = {
                        level = stats.level,
                        currency = stats.currency
                    }
                }
            }
            
            local jsonPayload = HttpService:JSONEncode(payload)
            local response = HttpService:PostAsync(WEB_URL, jsonPayload, Enum.HttpContentType.ApplicationJson)
            print("[Yeager Tracker v13] Đồng bộ thành công dữ liệu lên Vercel!")
        end)
        
        if not success then
            warn("[Yeager Tracker v13] Lỗi kết nối API:", err)
        end
    end)
    
    task.wait(10)
end
