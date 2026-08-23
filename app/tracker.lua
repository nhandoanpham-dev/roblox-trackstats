local SECRET_KEY = "aotwing5612" -- Key do bạn tự đặt
local VERCEL_URL = "https://aotwing-dusky.vercel.app/api/ping" -- Đổi tên miền Vercel của bạn ở đây

local HttpService = game:GetService("HttpService")
local LocalPlayer = game:GetService("Players").LocalPlayer

local function sendPing()
    local level, beli, fragments, fruit = 1, 0, 0, "Chưa ăn"
    pcall(function()
        if LocalPlayer:FindFirstChild("Data") then
            level = LocalPlayer.Data.Level.Value
            beli = LocalPlayer.Data.Beli.Value
            fragments = LocalPlayer.Data.Fragments.Value
            fruit = LocalPlayer.Data.DevilFruit.Value
        end
    end)

    local payload = HttpService:JSONEncode({
        key = SECRET_KEY,
        username = LocalPlayer.Name,
        userId = LocalPlayer.UserId,
        level = level,
        beli = beli,
        fragments = fragments,
        fruit = fruit,
        placeId = game.PlaceId,
        jobId = game.JobId
    })

    local req = (syn and syn.request) or (http and http.request) or http_request or request
    if req then
        req({ Url = VERCEL_URL, Method = "POST", Headers = {["Content-Type"] = "application/json"}, Body = payload })
    end
end

task.spawn(function()
    while task.wait(10) do pcall(sendPing) end
end)
