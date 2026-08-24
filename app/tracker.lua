local Http = game:GetService("HttpService")
local Plr = game.Players.LocalPlayer
local Url = "https://aotwing-dusky.vercel.app/api/ping?userId=" .. Plr.UserId
local Req = request or http_request or (syn and syn.request)

if not Req then return end

task.spawn(function()
    while task.wait(3) do
        pcall(function()
            local d = Plr:FindFirstChild("Data") or Plr:FindFirstChild("leaderstats")
            local lv = d and (d:FindFirstChild("Level") and d.Level.Value or 1) or 1
            local cur = d and (d:FindFirstChild("Beli") and d.Beli.Value or d:FindFirstChild("Money") and d.Money.Value or 0) or 0
            local fr = d and (d:FindFirstChild("Fragments") and d.Fragments.Value or 0) or 0

            local res = Req({
                Url = Url,
                Method = "POST",
                Headers = {["Content-Type"] = "application/json"},
                Body = Http:JSONEncode({
                    key = "yeager2026",
                    userId = Plr.UserId,
                    username = Plr.Name,
                    gameName = "Blox Fruits",
                    stats = {level = lv, currency = cur, fragments = fr},
                    lastUpdated = tick() * 1000
                })
            })

            if res and (res.StatusCode == 200 or res.status_code == 200) then
                local bodyText = res.Body or res.body
                if bodyText and bodyText ~= "" then
                    local dec = Http:JSONDecode(bodyText)
                    if dec.commands then
                        for _, c in ipairs(dec.commands) do
                            if c.command == "NOTIFY" then
                                game:GetService("StarterGui"):SetCore("SendNotification", {Title = c.payload.title or "Nexus", Text = c.payload.message})
                            elseif c.command == "RECONNECT" then
                                game:GetService("TeleportService"):Teleport(game.PlaceId, Plr)
                            end
                        end
                    end
                end
            end
        end)
    end
end)
