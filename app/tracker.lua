-- Yeager Roblox Nexus v33 Ultimate Telemetry & Broadcast Script
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local StarterGui = game:GetService("StarterGui")
local LocalPlayer = Players.LocalPlayer

local API_URL = "https://aotwing-dusky.vercel.app/api/ping"
local ACCESS_KEY = "yeager2026"

print("Yeager Nexus Client Started for: " .. LocalPlayer.Name)

while task.wait(3) do
    pcall(function()
        local data = {
            key = ACCESS_KEY,
            userId = LocalPlayer.UserId,
            username = LocalPlayer.Name,
            gameName = "Blox Fruits",
            stats = {
                level = 2550,
                currency = 15000000,
                fragments = 25000
            },
            inventory = {
                weapons = {"Cursed Dual Katana", "Soul Guitar"}
            },
            lastUpdated = tick() * 1000
        }
        
        local response = request({
            Url = API_URL .. "?userId=" .. LocalPlayer.UserId,
            Method = "POST",
            Headers = {["Content-Type"] = "application/json"},
            Body = HttpService:JSONEncode(data)
        })

        if response and response.StatusCode == 200 then
            local decoded = HttpService:JSONDecode(response.Body)
            if decoded.commands and #decoded.commands > 0 then
                for _, cmdObj in ipairs(decoded.commands) do
                    if cmdObj.command == "NOTIFY" then
                        StarterGui:SetCore("SendNotification", {
                            Title = cmdObj.payload.title or "Yeager Nexus Hub",
                            Text = cmdObj.payload.message or "Lệnh toàn hệ thống!",
                            Duration = 6
                        })
                    elseif cmdObj.command == "RE_CONNECT" or cmdObj.command == "RECONNECT" then
                        game:GetService("TeleportService"):Teleport(game.PlaceId, LocalPlayer)
                    end
                end
            end
        end
    end)
end
