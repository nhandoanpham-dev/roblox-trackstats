-- Script Blox Fruits V6 - Tích hợp Banana Cat Hub + NSMOD Full Features
-- Yêu cầu: executor cấp cao (Delta, Krnl, Arceus, Swift, Awp, Volcano, Argon, Macsploit, Potassium, CodeX, Velocity, Ronix)
-- Hỗ trợ: hook metamethod, ghi bộ nhớ, loadstring, queue_on_teleport, getrawmetatable
-- Tác dụng: tự động farm, nhiệm vụ, boss, trái, rương, chỉ số, dịch chuyển, raid, sea event, shop, race
-- Không đảm bảo hoạt động sau cập nhật của trò chơi
-- Sử dụng: dán toàn bộ vào executor và nhấn Execute

-- ==================== KIỂM TRA EXECUTOR ====================
local executor = getexecutorname() or identifyexecutor() or "Unknown"
local supportedExecutors = {"Delta", "Krnl", "Arceus", "Swift", "Awp", "Volcano", "Argon", "Macsploit", "Potassium", "CodeX", "Velocity", "Ronix"}
local blockedExecutors = {"Xeno", "Nezur", "TNG", "Solara", "JJSploit", "SynapseX"}

local isSupported = false
for _, name in ipairs(supportedExecutors) do
    if string.find(executor, name) then isSupported = true break end
end

if not isSupported then
    for _, name in ipairs(blockedExecutors) do
        if string.find(executor, name) then
            game.Players.LocalPlayer:Kick("Executor không được hỗ trợ: " .. executor)
            return
        end
    end
    game.Players.LocalPlayer:Kick("Executor không được hỗ trợ: " .. executor)
    return
end

print("Executor hợp lệ: " .. executor)

-- ==================== DỊCH VỤ ====================
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local VirtualUser = game:GetService("VirtualUser")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local StarterGui = game:GetService("StarterGui")
local HttpService = game:GetService("HttpService")
local TeleportService = game:GetService("TeleportService")
local Workspace = game:GetService("Workspace")
local CoreGui = game:GetService("CoreGui")
local ContextActionService = game:GetService("ContextActionService")
local Lighting = game:GetService("Lighting")
local CollectionService = game:GetService("CollectionService")

local LocalPlayer = Players.LocalPlayer
local Camera = Workspace.CurrentCamera

-- ==================== CẤU HÌNH ====================
getgenv().NSMOD_Config = {
    AutoFarm = false, AutoFarmLevel = true, AutoFarmBoss = false, AutoFarmFruit = false,
    AutoFarmChest = false, AutoFarmQuest = true, AutoFarmHaki = true, AutoFarmObservation = true,
    AutoFarmRace = true, AutoFarmMastery = false, AutoFarmMoney = false, AutoFarmFragments = false,
    AutoFarmBounty = false, AutoFarmHonor = false, AutoFarmMaterial = false, AutoFarmBone = false,
    AutoFarmKatakuri = false, AutoFarmAllBoss = false, AutoFish = false,
    SpeedHack = true, WalkSpeed = 350, JumpPower = 300, InfiniteJump = true,
    Fly = false, FlySpeed = 250, NoClip = false, FastAttack = false, FastClick = false, AutoClick = false,
    AttackRange = 100, KillAura = false, AutoDodge = false, GodMode = false, AutoSkill = false,
    AutoCombo = false, SkillZ = true, SkillX = false, SkillC = false, SkillV = false, SkillF = false,
    ESP = false, ESPChest = false, ESPFruit = false, ESPPlayer = false, ESPBoss = false,
    ESPQuest = false, ESPDevilFruit = false, ESPNPC = false,
    CurrentSea = 1, SelectedIsland = "Cafe", AutoNextIsland = true,
    AutoBuy = false, AutoSell = false, AutoRaid = false, AutoSeaBeast = false, AutoFactory = false,
    AutoPirateRaid = false, AutoCursedShip = false, AutoDoughKing = false, AutoCakeQueen = false,
    AutoSoulReaper = false, AutoHallowScythe = false, AutoDarkbeard = false, AutoRipIndra = false,
    AutoEliteHunter = false, AutoObservationV2 = false, AutoRainbowHaki = false, AutoSkullGuitar = false,
    AutoGetCDK = false, AutoTushita = false, AutoSaber = false, AutoYama = false,
    AutoCyborg = false, AutoGhoul = false, AutoUpgradeRaceV2 = false,
    AntiAFK = true, AntiKick = true, AutoRejoin = true, AutoServerHop = false,
    BypassTP = false, StopTP = false, SpinPos = false, ReduceLag = true, ResetFlags = true,
    SailBoat = false, SelectedBoat = "PirateGrandBrigade", SelectedZone = "Zone 1", SpeedBoat = 300,
    AutoKillShark = false, AutoKillPiranha = false, AutoKillFishCrew = false, AutoTerrorshark = false,
    AutoSeaBest = false, AutoGhostShip = false, AutoPirateBrigade = false, AutoPirateGrandBrigade = false,
    AutoFrozenDimension = false, KillLevi = false, SummonKitsume = false, CollectAzure = false,
    TradeAureEmber = false, AutoDefendVolcano = false, CollectEgg = false, AutoCollectFireFlowers = false,
    AutoUpgradeDragonTalon = false, DojoClaimQuest = false, BlazeEmberFarm = false,
    AutoBuyLegendarySword = false, Auto_Buy_Enchancement = false, AutoGetFruit = false,
    AutoStoreFruit = false, AutoBuyFruitSniper = false, RandomFruit = false, AutoAwaken = false,
    AutoStats = false, AutoSaber = false, AutoYama = false, AutoTushita = false,
    AutoGetCDK = false, AutoRainbowHaki = false, AutoSkullGuitar = false,
    TeleportMigare = false, Tweentohighestpoint = false, TeleportToGear = false,
    LockMoonAndOnRaceV3 = false, AutoTrialRace = false, AutoKillPlayerAfterTrial = false,
    UIVisible = true, UIKeybind = Enum.KeyCode.RightControl,
    FarmMode = "Farm Level", SelectWeapon = "Melee", SelectBoss = "The Gorilla King",
    SelectMaterial = "Leather + Scrap Metal", SelectChip = "Dark", StatsMode = "Melee",
    PointStats = 1, SelectFruit = "Rocket-Rocket",
}

local Config = getgenv().NSMOD_Config
local Pos = CFrame.new(0, 0, 0)
local PosY = 15
local BypassTP = false
local TweenSpeed = 350
local PointStats = 1
local StatsMode = "Melee"
local FarmMode = "Farm Level"
local GetMode = ""
local FarmMode2 = "Blox Fruit"
local UseSkill = false
local Skillaimbot = false
local AimBotSkillPosition = nil
local StartMagnet = false
local NameMon = ""
local Mon = ""
local CFrameMon = nil
local CFrameQuest = nil
local NameQuest = ""
local LevelQuest = 0
local World1, World2, World3 = false, false, false
local tween = nil

-- ==================== DỮ LIỆU ĐẢO ====================
local Islands = {
    [1] = {
        ["WindMill"] = Vector3.new(979.79, 16.51, 1429.04),
        ["Marine"] = Vector3.new(-2566.42, 6.85, 2045.25),
        ["Middle Town"] = Vector3.new(-690.33, 15.09, 1582.23),
        ["Jungle"] = Vector3.new(-1612.79, 36.85, 149.12),
        ["Pirate Village"] = Vector3.new(-1181.30, 4.75, 3803.54),
        ["Desert"] = Vector3.new(944.15, 20.91, 4373.30),
        ["Snow Island"] = Vector3.new(1347.80, 104.66, -1319.73),
        ["MarineFord"] = Vector3.new(-4914.82, 50.96, 4281.02),
        ["Colosseum"] = Vector3.new(-1427.62, 7.28, -2792.77),
        ["Sky Island 1"] = Vector3.new(-4869.10, 733.46, -2667.01),
        ["Prison"] = Vector3.new(4875.33, 5.65, 734.85),
        ["Magma Village"] = Vector3.new(-5247.71, 12.88, 8504.96),
        ["Fountain City"] = Vector3.new(5127.12, 59.50, 4105.44),
        ["Shank Room"] = Vector3.new(-1442.16, 29.87, -28.35),
        ["Mob Island"] = Vector3.new(-2850.20, 7.39, 5354.99),
    },
    [2] = {
        ["The Cafe"] = Vector3.new(-380.47, 77.22, 255.82),
        ["Frist Spot"] = Vector3.new(-11.31, 29.27, 2771.52),
        ["Dark Area"] = Vector3.new(3780.03, 22.65, -3498.58),
        ["Flamingo Mansion"] = Vector3.new(-483.73, 332.03, 595.32),
        ["Flamingo Room"] = Vector3.new(2284.41, 15.15, 875.72),
        ["Green Zone"] = Vector3.new(-2448.53, 73.01, -3210.63),
        ["Factory"] = Vector3.new(424.12, 211.16, -427.54),
        ["Colossuim"] = Vector3.new(-1503.62, 219.79, 1369.31),
        ["Zombie Island"] = Vector3.new(-5622.03, 492.19, -781.78),
        ["Two Snow Mountain"] = Vector3.new(753.14, 408.23, -5274.61),
        ["Punk Hazard"] = Vector3.new(-6127.65, 15.95, -5040.28),
        ["Cursed Ship"] = Vector3.new(923.40, 125.05, 32885.87),
        ["Ice Castle"] = Vector3.new(6148.41, 294.38, -6741.11),
        ["Forgotten Island"] = Vector3.new(-3032.76, 317.89, -10075.37),
        ["Ussop Island"] = Vector3.new(4816.86, 8.45, 2863.81),
        ["Mini Sky Island"] = Vector3.new(-288.74, 49326.31, -35248.59),
    },
    [3] = {
        ["Great Tree"] = Vector3.new(2681.27, 1682.80, -7190.98),
        ["Castle On The Sea"] = Vector3.new(-5074.45, 314.51, -2991.05),
        ["MiniSky"] = Vector3.new(-260.65, 49325.80, -35253.57),
        ["Port Town"] = Vector3.new(-95, 11, 5455),
        ["Hydra Island"] = Vector3.new(5433, 1062, 290),
        ["Floating Turtle"] = Vector3.new(-13274.52, 531.82, -7579.22),
        ["Mansion"] = Vector3.new(-12551, 337, -7476),
        ["Haunted Castle"] = Vector3.new(-9516, 142, 5537),
        ["Ice Cream Island"] = Vector3.new(-874, 66, -10915),
        ["Peanut Island"] = Vector3.new(-2062.74, 50.47, -10232.56),
        ["Cake Island"] = Vector3.new(-1884.77, 19.32, -11666.89),
        ["Cocoa Island"] = Vector3.new(87.94, 73.55, -12319.46),
        ["Candy Island"] = Vector3.new(-1014.42, 149.11, -14555.96),
        ["Tiki Outpost"] = Vector3.new(-16101.18, 12.84, 380.94),
    }
}

-- ==================== HÀM TIỆN ÍCH ====================
local function GetCharacter() return LocalPlayer.Character or LocalPlayer.CharacterAdded:Wait() end
local function GetHumanoid() local char = GetCharacter() return char:FindFirstChildOfClass("Humanoid") end
local function GetRoot() local char = GetCharacter() return char:FindFirstChild("HumanoidRootPart") end

local function Notify(title, text)
    pcall(function()
        StarterGui:SetCore("SendNotification", {Title = title, Text = text, Duration = 5})
    end)
end

local function SafeInvoke(...)
    local args = {...}
    local success, result = pcall(function()
        return ReplicatedStorage.Remotes.CommF_:InvokeServer(table.unpack(args))
    end)
    return success, result
end

local function SafeFire(...)
    local args = {...}
    local success, result = pcall(function()
        return ReplicatedStorage.Remotes.CommF_:FireServer(table.unpack(args))
    end)
    return success, result
end

-- ==================== XÁC ĐỊNH SEA ====================
local placeId = game.PlaceId
if placeId == 2753915549 then World1 = true Config.CurrentSea = 1
elseif placeId == 4442272183 then World2 = true Config.CurrentSea = 2
elseif placeId == 7449423635 then World3 = true Config.CurrentSea = 3
else LocalPlayer:Kick("Game không được hỗ trợ. Chỉ hỗ trợ Blox Fruits.") return end

-- ==================== CHECK QUEST ====================
function CheckQuest()
    local MyLevel = LocalPlayer.Data.Level.Value
    if World1 then
        if MyLevel >= 1 and MyLevel <= 9 then
            Mon = "Bandit"; LevelQuest = 1; NameQuest = "BanditQuest1"; NameMon = "Bandit"
            CFrameQuest = CFrame.new(1059.37195, 15.4495068, 1550.4231, 0.939700544, -0, -0.341998369, 0, 1, -0, 0.341998369, 0, 0.939700544)
            CFrameMon = CFrame.new(1045.962646484375, 27.00250816345215, 1560.8203125)
        elseif MyLevel >= 10 and MyLevel <= 14 then
            Mon = "Monkey"; LevelQuest = 1; NameQuest = "JungleQuest"; NameMon = "Monkey"
            CFrameQuest = CFrame.new(-1598.08911, 35.5501175, 153.377838, 0, 0, 1, 0, 1, -0, -1, 0, 0)
            CFrameMon = CFrame.new(-1448.51806640625, 67.85301208496094, 11.46579647064209)
        elseif MyLevel >= 15 and MyLevel <= 29 then
            Mon = "Gorilla"; LevelQuest = 2; NameQuest = "JungleQuest"; NameMon = "Gorilla"
            CFrameQuest = CFrame.new(-1598.08911, 35.5501175, 153.377838, 0, 0, 1, 0, 1, -0, -1, 0, 0)
            CFrameMon = CFrame.new(-1129.8836669921875, 40.46354675292969, -525.4237060546875)
        elseif MyLevel >= 30 and MyLevel <= 39 then
            Mon = "Pirate"; LevelQuest = 1; NameQuest = "BuggyQuest1"; NameMon = "Pirate"
            CFrameQuest = CFrame.new(-1141.07483, 4.10001802, 3831.5498, 0.965929627, -0, -0.258804798, 0, 1, -0, 0.258804798, 0, 0.965929627)
            CFrameMon = CFrame.new(-1103.513427734375, 13.752052307128906, 3896.091064453125)
        elseif MyLevel >= 40 and MyLevel <= 59 then
            Mon = "Brute"; LevelQuest = 2; NameQuest = "BuggyQuest1"; NameMon = "Brute"
            CFrameQuest = CFrame.new(-1141.07483, 4.10001802, 3831.5498, 0.965929627, -0, -0.258804798, 0, 1, -0, 0.258804798, 0, 0.965929627)
            CFrameMon = CFrame.new(-1140.083740234375, 14.809885025024414, 4322.92138671875)
        elseif MyLevel >= 60 and MyLevel <= 74 then
            Mon = "Desert Bandit"; LevelQuest = 1; NameQuest = "DesertQuest"; NameMon = "Desert Bandit"
            CFrameQuest = CFrame.new(894.488647, 5.14000702, 4392.43359, 0.819155693, -0, -0.573571265, 0, 1, -0, 0.573571265, 0, 0.819155693)
            CFrameMon = CFrame.new(924.7998046875, 6.44867467880249, 4481.5859375)
        elseif MyLevel >= 75 and MyLevel <= 89 then
            Mon = "Desert Officer"; LevelQuest = 2; NameQuest = "DesertQuest"; NameMon = "Desert Officer"
            CFrameQuest = CFrame.new(894.488647, 5.14000702, 4392.43359, 0.819155693, -0, -0.573571265, 0, 1, -0, 0.573571265, 0, 0.819155693)
            CFrameMon = CFrame.new(1608.2822265625, 8.614224433898926, 4371.00732421875)
        elseif MyLevel >= 90 and MyLevel <= 99 then
            Mon = "Snow Bandit"; LevelQuest = 1; NameQuest = "SnowQuest"; NameMon = "Snow Bandit"
            CFrameQuest = CFrame.new(1389.74451, 88.1519318, -1298.90796, -0.342042685, 0, 0.939684391, 0, 1, 0, -0.939684391, 0, -0.342042685)
            CFrameMon = CFrame.new(1354.347900390625, 87.27277374267578, -1393.946533203125)
        elseif MyLevel >= 100 and MyLevel <= 119 then
            Mon = "Snowman"; LevelQuest = 2; NameQuest = "SnowQuest"; NameMon = "Snowman"
            CFrameQuest = CFrame.new(1389.74451, 88.1519318, -1298.90796, -0.342042685, 0, 0.939684391, 0, 1, 0, -0.939684391, 0, -0.342042685)
            CFrameMon = CFrame.new(1201.6412353515625, 144.57958984375, -1550.0670166015625)
        elseif MyLevel >= 120 and MyLevel <= 149 then
            Mon = "Chief Petty Officer"; LevelQuest = 1; NameQuest = "MarineQuest2"; NameMon = "Chief Petty Officer"
            CFrameQuest = CFrame.new(-5039.58643, 27.3500385, 4324.68018, 0, 0, -1, 0, 1, 0, 1, 0, 0)
            CFrameMon = CFrame.new(-4881.23095703125, 22.65204429626465, 4273.75244140625)
        elseif MyLevel >= 150 and MyLevel <= 174 then
            Mon = "Sky Bandit"; LevelQuest = 1; NameQuest = "SkyQuest"; NameMon = "Sky Bandit"
            CFrameQuest = CFrame.new(-4839.53027, 716.368591, -2619.44165, 0.866007268, 0, 0.500031412, 0, 1, 0, -0.500031412, 0, 0.866007268)
            CFrameMon = CFrame.new(-4953.20703125, 295.74420166015625, -2899.22900390625)
        elseif MyLevel >= 175 and MyLevel <= 189 then
            Mon = "Dark Master"; LevelQuest = 2; NameQuest = "SkyQuest"; NameMon = "Dark Master"
            CFrameQuest = CFrame.new(-4839.53027, 716.368591, -2619.44165, 0.866007268, 0, 0.500031412, 0, 1, 0, -0.500031412, 0, 0.866007268)
            CFrameMon = CFrame.new(-5259.8447265625, 391.3976745605469, -2229.035400390625)
        elseif MyLevel >= 190 and MyLevel <= 209 then
            Mon = "Prisoner"; LevelQuest = 1; NameQuest = "PrisonerQuest"; NameMon = "Prisoner"
            CFrameQuest = CFrame.new(5308.93115, 1.65517521, 475.120514, -0.0894274712, -5.00292918e-09, -0.995993316, 1.60817859e-09, 1, -5.16744869e-09, 0.995993316, -2.06384709e-09, -0.0894274712)
            CFrameMon = CFrame.new(5098.9736328125, -0.3204058110713959, 474.2373352050781)
        elseif MyLevel >= 210 and MyLevel <= 249 then
            Mon = "Dangerous Prisoner"; LevelQuest = 2; NameQuest = "PrisonerQuest"; NameMon = "Dangerous Prisoner"
            CFrameQuest = CFrame.new(5308.93115, 1.65517521, 475.120514, -0.0894274712, -5.00292918e-09, -0.995993316, 1.60817859e-09, 1, -5.16744869e-09, 0.995993316, -2.06384709e-09, -0.0894274712)
            CFrameMon = CFrame.new(5654.5634765625, 15.633401870727539, 866.2991943359375)
        elseif MyLevel >= 250 and MyLevel <= 274 then
            Mon = "Toga Warrior"; LevelQuest = 1; NameQuest = "ColosseumQuest"; NameMon = "Toga Warrior"
            CFrameQuest = CFrame.new(-1580.04663, 6.35000277, -2986.47534, -0.515037298, 0, -0.857167721, 0, 1, 0, 0.857167721, 0, -0.515037298)
            CFrameMon = CFrame.new(-1820.21484375, 51.68385696411133, -2740.6650390625)
        elseif MyLevel >= 275 and MyLevel <= 299 then
            Mon = "Gladiator"; LevelQuest = 2; NameQuest = "ColosseumQuest"; NameMon = "Gladiator"
            CFrameQuest = CFrame.new(-1580.04663, 6.35000277, -2986.47534, -0.515037298, 0, -0.857167721, 0, 1, 0, 0.857167721, 0, -0.515037298)
            CFrameMon = CFrame.new(-1292.838134765625, 56.380882263183594, -3339.031494140625)
        elseif MyLevel >= 300 and MyLevel <= 324 then
            Mon = "Military Soldier"; LevelQuest = 1; NameQuest = "MagmaQuest"; NameMon = "Military Soldier"
            CFrameQuest = CFrame.new(-5313.37012, 10.9500084, 8515.29395, -0.499959469, 0, 0.866048813, 0, 1, 0, -0.866048813, 0, -0.499959469)
            CFrameMon = CFrame.new(-5411.16455078125, 11.081554412841797, 8454.29296875)
        elseif MyLevel >= 325 and MyLevel <= 374 then
            Mon = "Military Spy"; LevelQuest = 2; NameQuest = "MagmaQuest"; NameMon = "Military Spy"
            CFrameQuest = CFrame.new(-5313.37012, 10.9500084, 8515.29395, -0.499959469, 0, 0.866048813, 0, 1, 0, -0.866048813, 0, -0.499959469)
            CFrameMon = CFrame.new(-5802.8681640625, 86.26241302490234, 8828.859375)
        elseif MyLevel >= 375 and MyLevel <= 399 then
            Mon = "Fishman Warrior"; LevelQuest = 1; NameQuest = "FishmanQuest"; NameMon = "Fishman Warrior"
            CFrameQuest = CFrame.new(61122.65234375, 18.497442245483, 1569.3997802734)
            CFrameMon = CFrame.new(60878.30078125, 18.482830047607422, 1543.7574462890625)
        elseif MyLevel >= 400 and MyLevel <= 449 then
            Mon = "Fishman Commando"; LevelQuest = 2; NameQuest = "FishmanQuest"; NameMon = "Fishman Commando"
            CFrameQuest = CFrame.new(61122.65234375, 18.497442245483, 1569.3997802734)
            CFrameMon = CFrame.new(61922.6328125, 18.482830047607422, 1493.934326171875)
        elseif MyLevel >= 450 and MyLevel <= 474 then
            Mon = "God's Guard"; LevelQuest = 1; NameQuest = "SkyExp1Quest"; NameMon = "God's Guard"
            CFrameQuest = CFrame.new(-4721.88867, 843.874695, -1949.96643, 0.996191859, -0, -0.0871884301, 0, 1, -0, 0.0871884301, 0, 0.996191859)
            CFrameMon = CFrame.new(-4710.04296875, 845.2769775390625, -1927.3079833984375)
        elseif MyLevel >= 475 and MyLevel <= 524 then
            Mon = "Shanda"; LevelQuest = 2; NameQuest = "SkyExp1Quest"; NameMon = "Shanda"
            CFrameQuest = CFrame.new(-7859.09814, 5544.19043, -381.476196, -0.422592998, 0, 0.906319618, 0, 1, 0, -0.906319618, 0, -0.422592998)
            CFrameMon = CFrame.new(-7678.48974609375, 5566.40380859375, -497.2156066894531)
        elseif MyLevel >= 525 and MyLevel <= 549 then
            Mon = "Royal Squad"; LevelQuest = 1; NameQuest = "SkyExp2Quest"; NameMon = "Royal Squad"
            CFrameQuest = CFrame.new(-7906.81592, 5634.6626, -1411.99194, 0, 0, -1, 0, 1, 0, 1, 0, 0)
            CFrameMon = CFrame.new(-7624.25244140625, 5658.13330078125, -1467.354248046875)
        elseif MyLevel >= 550 and MyLevel <= 624 then
            Mon = "Royal Soldier"; LevelQuest = 2; NameQuest = "SkyExp2Quest"; NameMon = "Royal Soldier"
            CFrameQuest = CFrame.new(-7906.81592, 5634.6626, -1411.99194, 0, 0, -1, 0, 1, 0, 1, 0, 0)
            CFrameMon = CFrame.new(-7836.75341796875, 5645.6640625, -1790.6236572265625)
        elseif MyLevel >= 625 and MyLevel <= 649 then
            Mon = "Galley Pirate"; LevelQuest = 1; NameQuest = "FountainQuest"; NameMon = "Galley Pirate"
            CFrameQuest = CFrame.new(5259.81982, 37.3500175, 4050.0293, 0.087131381, 0, 0.996196866, 0, 1, 0, -0.996196866, 0, 0.087131381)
            CFrameMon = CFrame.new(5551.02197265625, 78.90135192871094, 3930.412841796875)
        elseif MyLevel >= 650 then
            Mon = "Galley Captain"; LevelQuest = 2; NameQuest = "FountainQuest"; NameMon = "Galley Captain"
            CFrameQuest = CFrame.new(5259.81982, 37.3500175, 4050.0293, 0.087131381, 0, 0.996196866, 0, 1, 0, -0.996196866, 0, 0.087131381)
            CFrameMon = CFrame.new(5441.95166015625, 42.50205993652344, 4950.09375)
        end
    elseif World2 then
        if MyLevel >= 700 and MyLevel <= 724 then
            Mon = "Raider"; LevelQuest = 1; NameQuest = "Area1Quest"; NameMon = "Raider"
            CFrameQuest = CFrame.new(-429.543518, 71.7699966, 1836.18188, -0.22495985, 0, -0.974368095, 0, 1, 0, 0.974368095, 0, -0.22495985)
            CFrameMon = CFrame.new(-728.3267211914062, 52.779319763183594, 2345.7705078125)
        elseif MyLevel >= 725 and MyLevel <= 774 then
            Mon = "Mercenary"; LevelQuest = 2; NameQuest = "Area1Quest"; NameMon = "Mercenary"
            CFrameQuest = CFrame.new(-429.543518, 71.7699966, 1836.18188, -0.22495985, 0, -0.974368095, 0, 1, 0, 0.974368095, 0, -0.22495985)
            CFrameMon = CFrame.new(-1004.3244018554688, 80.15886688232422, 1424.619384765625)
        elseif MyLevel >= 775 and MyLevel <= 799 then
            Mon = "Swan Pirate"; LevelQuest = 1; NameQuest = "Area2Quest"; NameMon = "Swan Pirate"
            CFrameQuest = CFrame.new(638.43811, 71.769989, 918.282898, 0.139203906, 0, 0.99026376, 0, 1, 0, -0.99026376, 0, 0.139203906)
            CFrameMon = CFrame.new(1068.664306640625, 137.61428833007812, 1322.1060791015625)
        elseif MyLevel >= 800 and MyLevel <= 874 then
            Mon = "Factory Staff"; LevelQuest = 2; NameQuest = "Area2Quest"; NameMon = "Factory Staff"
            CFrameQuest = CFrame.new(632.698608, 73.1055908, 918.666321, -0.0319722369, 8.96074881e-10, -0.999488771, 1.36326533e-10, 1, 8.92172336e-10, 0.999488771, -1.07732087e-10, -0.0319722369)
            CFrameMon = CFrame.new(73.07867431640625, 81.86344146728516, -27.470672607421875)
        elseif MyLevel >= 875 and MyLevel <= 899 then
            Mon = "Marine Lieutenant"; LevelQuest = 1; NameQuest = "MarineQuest3"; NameMon = "Marine Lieutenant"
            CFrameQuest = CFrame.new(-2440.79639, 71.7140732, -3216.06812, 0.866007268, 0, 0.500031412, 0, 1, 0, -0.500031412, 0, 0.866007268)
            CFrameMon = CFrame.new(-2821.372314453125, 75.89727783203125, -3070.089111328125)
        elseif MyLevel >= 900 and MyLevel <= 949 then
            Mon = "Marine Captain"; LevelQuest = 2; NameQuest = "MarineQuest3"; NameMon = "Marine Captain"
            CFrameQuest = CFrame.new(-2440.79639, 71.7140732, -3216.06812, 0.866007268, 0, 0.500031412, 0, 1, 0, -0.500031412, 0, 0.866007268)
            CFrameMon = CFrame.new(-1861.2310791015625, 80.17658233642578, -3254.697509765625)
        elseif MyLevel >= 950 and MyLevel <= 974 then
            Mon = "Zombie"; LevelQuest = 1; NameQuest = "ZombieQuest"; NameMon = "Zombie"
            CFrameQuest = CFrame.new(-5497.06152, 47.5923004, -795.237061, -0.29242146, 0, -0.95628953, 0, 1, 0, 0.95628953, 0, -0.29242146)
            CFrameMon = CFrame.new(-5657.77685546875, 78.96973419189453, -928.68701171875)
        elseif MyLevel >= 975 and MyLevel <= 999 then
            Mon = "Vampire"; LevelQuest = 2; NameQuest = "ZombieQuest"; NameMon = "Vampire"
            CFrameQuest = CFrame.new(-5497.06152, 47.5923004, -795.237061, -0.29242146, 0, -0.95628953, 0, 1, 0, 0.95628953, 0, -0.29242146)
            CFrameMon = CFrame.new(-6037.66796875, 32.18463897705078, -1340.6597900390625)
        elseif MyLevel >= 1000 and MyLevel <= 1049 then
            Mon = "Snow Trooper"; LevelQuest = 1; NameQuest = "SnowMountainQuest"; NameMon = "Snow Trooper"
            CFrameQuest = CFrame.new(609.858826, 400.119904, -5372.25928, -0.374604106, 0, 0.92718488, 0, 1, 0, -0.92718488, 0, -0.374604106)
            CFrameMon = CFrame.new(549.1473388671875, 427.3870544433594, -5563.69873046875)
        elseif MyLevel >= 1050 and MyLevel <= 1099 then
            Mon = "Winter Warrior"; LevelQuest = 2; NameQuest = "SnowMountainQuest"; NameMon = "Winter Warrior"
            CFrameQuest = CFrame.new(609.858826, 400.119904, -5372.25928, -0.374604106, 0, 0.92718488, 0, 1, 0, -0.92718488, 0, -0.374604106)
            CFrameMon = CFrame.new(1142.7451171875, 475.6398010253906, -5199.41650390625)
        elseif MyLevel >= 1100 and MyLevel <= 1124 then
            Mon = "Lab Subordinate"; LevelQuest = 1; NameQuest = "IceSideQuest"; NameMon = "Lab Subordinate"
            CFrameQuest = CFrame.new(-6064.06885, 15.2422857, -4902.97852, 0.453972578, -0, -0.891015649, 0, 1, -0, 0.891015649, 0, 0.453972578)
            CFrameMon = CFrame.new(-5707.4716796875, 15.951709747314453, -4513.39208984375)
        elseif MyLevel >= 1125 and MyLevel <= 1174 then
            Mon = "Horned Warrior"; LevelQuest = 2; NameQuest = "IceSideQuest"; NameMon = "Horned Warrior"
            CFrameQuest = CFrame.new(-6064.06885, 15.2422857, -4902.97852, 0.453972578, -0, -0.891015649, 0, 1, -0, 0.891015649, 0, 0.453972578)
            CFrameMon = CFrame.new(-6341.36669921875, 15.951770782470703, -5723.162109375)
        elseif MyLevel >= 1175 and MyLevel <= 1199 then
            Mon = "Magma Ninja"; LevelQuest = 1; NameQuest = "FireSideQuest"; NameMon = "Magma Ninja"
            CFrameQuest = CFrame.new(-5428.03174, 15.0622921, -5299.43457, -0.882952213, 0, 0.469463557, 0, 1, 0, -0.469463557, 0, -0.882952213)
            CFrameMon = CFrame.new(-5449.6728515625, 76.65874481201172, -5808.20068359375)
        elseif MyLevel >= 1200 and MyLevel <= 1249 then
            Mon = "Lava Pirate"; LevelQuest = 2; NameQuest = "FireSideQuest"; NameMon = "Lava Pirate"
            CFrameQuest = CFrame.new(-5428.03174, 15.0622921, -5299.43457, -0.882952213, 0, 0.469463557, 0, 1, 0, -0.469463557, 0, -0.882952213)
            CFrameMon = CFrame.new(-5213.33154296875, 49.73788070678711, -4701.451171875)
        elseif MyLevel >= 1250 and MyLevel <= 1274 then
            Mon = "Ship Deckhand"; LevelQuest = 1; NameQuest = "ShipQuest1"; NameMon = "Ship Deckhand"
            CFrameQuest = CFrame.new(1037.80127, 125.092171, 32911.6016)
            CFrameMon = CFrame.new(1212.0111083984375, 150.79205322265625, 33059.24609375)
        elseif MyLevel >= 1275 and MyLevel <= 1299 then
            Mon = "Ship Engineer"; LevelQuest = 2; NameQuest = "ShipQuest1"; NameMon = "Ship Engineer"
            CFrameQuest = CFrame.new(1037.80127, 125.092171, 32911.6016)
            CFrameMon = CFrame.new(919.4786376953125, 43.54401397705078, 32779.96875)
        elseif MyLevel >= 1300 and MyLevel <= 1324 then
            Mon = "Ship Steward"; LevelQuest = 1; NameQuest = "ShipQuest2"; NameMon = "Ship Steward"
            CFrameQuest = CFrame.new(968.80957, 125.092171, 33244.125)
            CFrameMon = CFrame.new(919.4385375976562, 129.55599975585938, 33436.03515625)
        elseif MyLevel >= 1325 and MyLevel <= 1349 then
            Mon = "Ship Officer"; LevelQuest = 2; NameQuest = "ShipQuest2"; NameMon = "Ship Officer"
            CFrameQuest = CFrame.new(968.80957, 125.092171, 33244.125)
            CFrameMon = CFrame.new(1036.0179443359375, 181.4390411376953, 33315.7265625)
        elseif MyLevel >= 1350 and MyLevel <= 1374 then
            Mon = "Arctic Warrior"; LevelQuest = 1; NameQuest = "FrostQuest"; NameMon = "Arctic Warrior"
            CFrameQuest = CFrame.new(5667.6582, 26.7997818, -6486.08984, -0.933587909, 0, -0.358349502, 0, 1, 0, 0.358349502, 0, -0.933587909)
            CFrameMon = CFrame.new(5966.24609375, 62.97002029418945, -6179.3828125)
        elseif MyLevel >= 1375 and MyLevel <= 1424 then
            Mon = "Snow Lurker"; LevelQuest = 2; NameQuest = "FrostQuest"; NameMon = "Snow Lurker"
            CFrameQuest = CFrame.new(5667.6582, 26.7997818, -6486.08984, -0.933587909, 0, -0.358349502, 0, 1, 0, 0.358349502, 0, -0.933587909)
            CFrameMon = CFrame.new(5407.07373046875, 69.19437408447266, -6880.88037109375)
        elseif MyLevel >= 1425 and MyLevel <= 1449 then
            Mon = "Sea Soldier"; LevelQuest = 1; NameQuest = "ForgottenQuest"; NameMon = "Sea Soldier"
            CFrameQuest = CFrame.new(-3054.44458, 235.544281, -10142.8193, 0.990270376, -0, -0.13915664, 0, 1, -0, 0.13915664, 0, 0.990270376)
            CFrameMon = CFrame.new(-3028.2236328125, 64.67451477050781, -9775.4267578125)
        elseif MyLevel >= 1450 then
            Mon = "Water Fighter"; LevelQuest = 2; NameQuest = "ForgottenQuest"; NameMon = "Water Fighter"
            CFrameQuest = CFrame.new(-3054, 240, -10146)
            CFrameMon = CFrame.new(-3291, 252, -10501)
        end
    elseif World3 then
        if MyLevel >= 1500 and MyLevel <= 1524 then
            Mon = "Pirate Millionaire"; LevelQuest = 1; NameQuest = "PiratePortQuest"; NameMon = "Pirate Millionaire"
            CFrameQuest = CFrame.new(-290.074677, 42.9034653, 5581.58984, 0.965929627, -0, -0.258804798, 0, 1, -0, 0.258804798, 0, 0.965929627)
            CFrameMon = CFrame.new(-245.9963836669922, 47.30615234375, 5584.1005859375)
        elseif MyLevel >= 1525 and MyLevel <= 1574 then
            Mon = "Pistol Billionaire"; LevelQuest = 2; NameQuest = "PiratePortQuest"; NameMon = "Pistol Billionaire"
            CFrameQuest = CFrame.new(-290.074677, 42.9034653, 5581.58984, 0.965929627, -0, -0.258804798, 0, 1, -0, 0.258804798, 0, 0.965929627)
            CFrameMon = CFrame.new(-187.3301544189453, 86.23987579345703, 6013.513671875)
        elseif MyLevel >= 1575 and MyLevel <= 1599 then
            Mon = "Dragon Crew Warrior"; LevelQuest = 1; NameQuest = "DragonCrewQuest"; NameMon = "Dragon Crew Warrior"
            CFrameQuest = CFrame.new(6738.96142578125, 127.81645965576172, -713.511474609375)
            CFrameMon = CFrame.new(6920.71435546875, 56.15597152709961, -942.5044555664062)
        elseif MyLevel >= 1600 and MyLevel <= 1624 then
            Mon = "Dragon Crew Archer"; LevelQuest = 2; NameQuest = "DragonCrewQuest"; NameMon = "Dragon Crew Archer"
            CFrameQuest = CFrame.new(6738.96142578125, 127.81645965576172, -713.511474609375)
            CFrameMon = CFrame.new(6817.91259765625, 484.804443359375, 513.4141235351562)
        elseif MyLevel >= 1625 and MyLevel <= 1649 then
            Mon = "Hydra Enforcer"; LevelQuest = 1; NameQuest = "VenomCrewQuest"; NameMon = "Hydra Enforcer"
            CFrameQuest = CFrame.new(5213.8740234375, 1004.5042724609375, 758.6944580078125)
            CFrameMon = CFrame.new(4584.69287109375, 1002.6435546875, 705.7958984375)
        elseif MyLevel >= 1650 and MyLevel <= 1699 then
            Mon = "Venomous Assailant"; LevelQuest = 2; NameQuest = "VenomCrewQuest"; NameMon = "Venomous Assailant"
            CFrameQuest = CFrame.new(5213.8740234375, 1004.5042724609375, 758.6944580078125)
            CFrameMon = CFrame.new(4638.78564453125, 1078.94091796875, 881.8002319335938)
        elseif MyLevel >= 1700 and MyLevel <= 1724 then
            Mon = "Marine Commodore"; LevelQuest = 1; NameQuest = "MarineTreeIsland"; NameMon = "Marine Commodore"
            CFrameQuest = CFrame.new(2180.54126, 27.8156815, -6741.5498, -0.965929747, 0, 0.258804798, 0, 1, 0, -0.258804798, 0, -0.965929747)
            CFrameMon = CFrame.new(2286.0078125, 73.13391876220703, -7159.80908203125)
        elseif MyLevel >= 1725 and MyLevel <= 1774 then
            Mon = "Marine Rear Admiral"; LevelQuest = 2; NameQuest = "MarineTreeIsland"; NameMon = "Marine Rear Admiral"
            CFrameQuest = CFrame.new(2179.98828125, 28.731239318848, -6740.0551757813)
            CFrameMon = CFrame.new(3656.773681640625, 160.52406311035156, -7001.5986328125)
        elseif MyLevel >= 1775 and MyLevel <= 1799 then
            Mon = "Fishman Raider"; LevelQuest = 1; NameQuest = "DeepForestIsland3"; NameMon = "Fishman Raider"
            CFrameQuest = CFrame.new(-10581.6563, 330.872955, -8761.18652, -0.882952213, 0, 0.469463557, 0, 1, 0, -0.469463557, 0, -0.882952213)
            CFrameMon = CFrame.new(-10407.5263671875, 331.76263427734375, -8368.5166015625)
        elseif MyLevel >= 1800 and MyLevel <= 1824 then
            Mon = "Fishman Captain"; LevelQuest = 2; NameQuest = "DeepForestIsland3"; NameMon = "Fishman Captain"
            CFrameQuest = CFrame.new(-10581.6563, 330.872955, -8761.18652, -0.882952213, 0, 0.469463557, 0, 1, 0, -0.469463557, 0, -0.882952213)
            CFrameMon = CFrame.new(-10994.701171875, 352.38140869140625, -9002.1103515625)
        elseif MyLevel >= 1825 and MyLevel <= 1849 then
            Mon = "Forest Pirate"; LevelQuest = 1; NameQuest = "DeepForestIsland"; NameMon = "Forest Pirate"
            CFrameQuest = CFrame.new(-13234.04, 331.488495, -7625.40137, 0.707134247, -0, -0.707079291, 0, 1, -0, 0.707079291, 0, 0.707134247)
            CFrameMon = CFrame.new(-13274.478515625, 332.3781433105469, -7769.58056640625)
        elseif MyLevel >= 1850 and MyLevel <= 1899 then
            Mon = "Mythological Pirate"; LevelQuest = 2; NameQuest = "DeepForestIsland"; NameMon = "Mythological Pirate"
            CFrameQuest = CFrame.new(-13234.04, 331.488495, -7625.40137, 0.707134247, -0, -0.707079291, 0, 1, -0, 0.707079291, 0, 0.707134247)
            CFrameMon = CFrame.new(-13680.607421875, 501.08154296875, -6991.189453125)
        elseif MyLevel >= 1900 and MyLevel <= 1924 then
            Mon = "Jungle Pirate"; LevelQuest = 1; NameQuest = "DeepForestIsland2"; NameMon = "Jungle Pirate"
            CFrameQuest = CFrame.new(-12680.3818, 389.971039, -9902.01953, -0.0871315002, 0, 0.996196866, 0, 1, 0, -0.996196866, 0, -0.0871315002)
            CFrameMon = CFrame.new(-12256.16015625, 331.73828125, -10485.8369140625)
        elseif MyLevel >= 1925 and MyLevel <= 1974 then
            Mon = "Musketeer Pirate"; LevelQuest = 2; NameQuest = "DeepForestIsland2"; NameMon = "Musketeer Pirate"
            CFrameQuest = CFrame.new(-12680.3818, 389.971039, -9902.01953, -0.0871315002, 0, 0.996196866, 0, 1, 0, -0.996196866, 0, -0.0871315002)
            CFrameMon = CFrame.new(-13457.904296875, 391.545654296875, -9859.177734375)
        elseif MyLevel >= 1975 and MyLevel <= 1999 then
            Mon = "Reborn Skeleton"; LevelQuest = 1; NameQuest = "HauntedQuest1"; NameMon = "Reborn Skeleton"
            CFrameQuest = CFrame.new(-9479.2168, 141.215088, 5566.09277, 0, 0, 1, 0, 1, -0, -1, 0, 0)
            CFrameMon = CFrame.new(-8763.7236328125, 165.72299194335938, 6159.86181640625)
        elseif MyLevel >= 2000 and MyLevel <= 2024 then
            Mon = "Living Zombie"; LevelQuest = 2; NameQuest = "HauntedQuest1"; NameMon = "Living Zombie"
            CFrameQuest = CFrame.new(-9479.2168, 141.215088, 5566.09277, 0, 0, 1, 0, 1, -0, -1, 0, 0)
            CFrameMon = CFrame.new(-10144.1318359375, 138.62667846679688, 5838.0888671875)
        elseif MyLevel >= 2025 and MyLevel <= 2049 then
            Mon = "Demonic Soul"; LevelQuest = 1; NameQuest = "HauntedQuest2"; NameMon = "Demonic Soul"
            CFrameQuest = CFrame.new(-9516.99316, 172.017181, 6078.46533, 0, 0, -1, 0, 1, 0, 1, 0, 0)
            CFrameMon = CFrame.new(-9505.8720703125, 172.10482788085938, 6158.9931640625)
        elseif MyLevel >= 2050 and MyLevel <= 2074 then
            Mon = "Posessed Mummy"; LevelQuest = 2; NameQuest = "HauntedQuest2"; NameMon = "Posessed Mummy"
            CFrameQuest = CFrame.new(-9516.99316, 172.017181, 6078.46533, 0, 0, -1, 0, 1, 0, 1, 0, 0)
            CFrameMon = CFrame.new(-9582.0224609375, 6.251527309417725, 6205.478515625)
        elseif MyLevel >= 2075 and MyLevel <= 2099 then
            Mon = "Peanut Scout"; LevelQuest = 1; NameQuest = "NutsIslandQuest"; NameMon = "Peanut Scout"
            CFrameQuest = CFrame.new(-2104.3908691406, 38.104167938232, -10194.21875, 0, 0, -1, 0, 1, 0, 1, 0, 0)
            CFrameMon = CFrame.new(-2143.241943359375, 47.72198486328125, -10029.9951171875)
        elseif MyLevel >= 2100 and MyLevel <= 2124 then
            Mon = "Peanut President"; LevelQuest = 2; NameQuest = "NutsIslandQuest"; NameMon = "Peanut President"
            CFrameQuest = CFrame.new(-2104.3908691406, 38.104167938232, -10194.21875, 0, 0, -1, 0, 1, 0, 1, 0, 0)
            CFrameMon = CFrame.new(-1859.35400390625, 38.10316848754883, -10422.4296875)
        elseif MyLevel >= 2125 and MyLevel <= 2149 then
            Mon = "Ice Cream Chef"; LevelQuest = 1; NameQuest = "IceCreamIslandQuest"; NameMon = "Ice Cream Chef"
            CFrameQuest = CFrame.new(-820.64825439453, 65.819526672363, -10965.795898438, 0, 0, -1, 0, 1, 0, 1, 0, 0)
            CFrameMon = CFrame.new(-872.24658203125, 65.81957244873047, -10919.95703125)
        elseif MyLevel >= 2150 and MyLevel <= 2199 then
            Mon = "Ice Cream Commander"; LevelQuest = 2; NameQuest = "IceCreamIslandQuest"; NameMon = "Ice Cream Commander"
            CFrameQuest = CFrame.new(-820.64825439453, 65.819526672363, -10965.795898438, 0, 0, -1, 0, 1, 0, 1, 0, 0)
            CFrameMon = CFrame.new(-558.06103515625, 112.04895782470703, -11290.7744140625)
        elseif MyLevel >= 2200 and MyLevel <= 2224 then
            Mon = "Cookie Crafter"; LevelQuest = 1; NameQuest = "CakeQuest1"; NameMon = "Cookie Crafter"
            CFrameQuest = CFrame.new(-2021.32007, 37.7982254, -12028.7295, 0.957576931, -8.80302053e-08, 0.288177818, 6.9301187e-08, 1, 7.51931211e-08, -0.288177818, -5.2032135e-08, 0.957576931)
            CFrameMon = CFrame.new(-2374.13671875, 37.79826354980469, -12125.30859375)
        elseif MyLevel >= 2225 and MyLevel <= 2249 then
            Mon = "Cake Guard"; LevelQuest = 2; NameQuest = "CakeQuest1"; NameMon = "Cake Guard"
            CFrameQuest = CFrame.new(-2021.32007, 37.7982254, -12028.7295, 0.957576931, -8.80302053e-08, 0.288177818, 6.9301187e-08, 1, 7.51931211e-08, -0.288177818, -5.2032135e-08, 0.957576931)
            CFrameMon = CFrame.new(-1598.3070068359375, 43.773197174072266, -12244.5810546875)
        elseif MyLevel >= 2250 and MyLevel <= 2274 then
            Mon = "Baking Staff"; LevelQuest = 1; NameQuest = "CakeQuest2"; NameMon = "Baking Staff"
            CFrameQuest = CFrame.new(-1927.91602, 37.7981339, -12842.5391, -0.96804446, 4.22142143e-08, 0.250778586, 4.74911062e-08, 1, 1.49904711e-08, -0.250778586, 2.64211941e-08, -0.96804446)
            CFrameMon = CFrame.new(-1887.8099365234375, 77.6185073852539, -12998.3505859375)
        elseif MyLevel >= 2275 and MyLevel <= 2299 then
            Mon = "Head Baker"; LevelQuest = 2; NameQuest = "CakeQuest2"; NameMon = "Head Baker"
            CFrameQuest = CFrame.new(-1927.91602, 37.7981339, -12842.5391, -0.96804446, 4.22142143e-08, 0.250778586, 4.74911062e-08, 1, 1.49904711e-08, -0.250778586, 2.64211941e-08, -0.96804446)
            CFrameMon = CFrame.new(-2216.188232421875, 82.884521484375, -12869.2939453125)
        elseif MyLevel >= 2300 and MyLevel <= 2324 then
            Mon = "Cocoa Warrior"; LevelQuest = 1; NameQuest = "ChocQuest1"; NameMon = "Cocoa Warrior"
            CFrameQuest = CFrame.new(233.22836303710938, 29.876001358032227, -12201.2333984375)
            CFrameMon = CFrame.new(-21.55328369140625, 80.57499694824219, -12352.3876953125)
        elseif MyLevel >= 2325 and MyLevel <= 2349 then
            Mon = "Chocolate Bar Battler"; LevelQuest = 2; NameQuest = "ChocQuest1"; NameMon = "Chocolate Bar Battler"
            CFrameQuest = CFrame.new(233.22836303710938, 29.876001358032227, -12201.2333984375)
            CFrameMon = CFrame.new(582.590576171875, 77.18809509277344, -12463.162109375)
        elseif MyLevel >= 2350 and MyLevel <= 2374 then
            Mon = "Sweet Thief"; LevelQuest = 1; NameQuest = "ChocQuest2"; NameMon = "Sweet Thief"
            CFrameQuest = CFrame.new(150.5066375732422, 30.693693161010742, -12774.5029296875)
            CFrameMon = CFrame.new(165.1884765625, 76.05885314941406, -12600.8369140625)
        elseif MyLevel >= 2375 and MyLevel <= 2399 then
            Mon = "Candy Rebel"; LevelQuest = 2; NameQuest = "ChocQuest2"; NameMon = "Candy Rebel"
            CFrameQuest = CFrame.new(150.5066375732422, 30.693693161010742, -12774.5029296875)
            CFrameMon = CFrame.new(134.86563110351562, 77.2476806640625, -12876.5478515625)
        elseif MyLevel >= 2400 and MyLevel <= 2424 then
            Mon = "Candy Pirate"; LevelQuest = 1; NameQuest = "CandyQuest1"; NameMon = "Candy Pirate"
            CFrameQuest = CFrame.new(-1150.0400390625, 20.378934860229492, -14446.3349609375)
            CFrameMon = CFrame.new(-1310.5003662109375, 26.016523361206055, -14562.404296875)
        elseif MyLevel >= 2425 and MyLevel <= 2449 then
            Mon = "Snow Demon"; LevelQuest = 2; NameQuest = "CandyQuest1"; NameMon = "Snow Demon"
            CFrameQuest = CFrame.new(-1150.0400390625, 20.378934860229492, -14446.3349609375)
            CFrameMon = CFrame.new(-880.2006225585938, 71.24776458740234, -14538.609375)
        elseif MyLevel >= 2450 and MyLevel <= 2474 then
            Mon = "Isle Outlaw"; LevelQuest = 1; NameQuest = "TikiQuest1"; NameMon = "Isle Outlaw"
            CFrameQuest = CFrame.new(-16547.748046875, 61.13533401489258, -173.41360473632812)
            CFrameMon = CFrame.new(-16442.814453125, 116.13899993896484, -264.4637756347656)
        elseif MyLevel >= 2475 and MyLevel <= 2524 then
            Mon = "Island Boy"; LevelQuest = 2; NameQuest = "TikiQuest1"; NameMon = "Island Boy"
            CFrameQuest = CFrame.new(-16547.748046875, 61.13533401489258, -173.41360473632812)
            CFrameMon = CFrame.new(-16901.26171875, 84.06756591796875, -192.88906860351562)
        elseif MyLevel >= 2525 and MyLevel <= 2550 then
            Mon = "Isle Champion"; LevelQuest = 2; NameQuest = "TikiQuest2"; NameMon = "Isle Champion"
            CFrameQuest = CFrame.new(-16539.078125, 55.68632888793945, 1051.5738525390625)
            CFrameMon = CFrame.new(-16641.6796875, 235.7825469970703, 1031.282958984375)
        elseif MyLevel >= 2550 and MyLevel <= 2574 then
            Mon = "Serpent Hunter"; LevelQuest = 1; NameQuest = "TikiQuest3"; NameMon = "Serpent Hunter"
            CFrameQuest = CFrame.new(-16665.1914, 104.596405, 1579.69434, 0.951068401, -0, -0.308980465, 0, 1, -0, 0.308980465, 0, 0.951068401)
            CFrameMon = CFrame.new(-16521.0625, 106.09285, 1488.78467, 0.469467044, 0, 0.882950008, 0, 1, 0, -0.882950008, 0, 0.469467044)
        elseif MyLevel >= 2575 then
            Mon = "Skull Slayer"; LevelQuest = 2; NameQuest = "TikiQuest3"; NameMon = "Skull Slayer"
            CFrameQuest = CFrame.new(-16665.1914, 104.596405, 1579.69434, 0.951068401, -0, -0.308980465, 0, 1, -0, 0.308980465, 0, 0.951068401)
            CFrameMon = CFrame.new(-16855.043, 122.457253, 1478.15308, -0.999392271, 0, -0.0348687991, 0, 1, 0, 0.0348687991, 0, -0.999392271)
        end
    end
end

-- ==================== VÒNG LẶP NOCLIP ====================
spawn(function()
    while task.wait() do
        pcall(function()
            if Config.NoClip or Config.AutoFarm or Config.AutoFarmBoss or Config.AutoFarmChest or Config.AutoFarmQuest or Config.AutoFarmMaterial or Config.AutoFarmBone or Config.AutoFarmKatakuri or Config.AutoFarmMastery or Config.AutoGetMelee or Config.AutoFactory or Config.AutoPirateRaid or Config.AutoEliteHunter or Config.AutoRipIndra or Config.AutoSoulReaper or Config.AutoDoughKing or Config.AutoDarkbeard or Config.DojoClaimQuest or Config.AutoUpgradeDragonTalon or Config.BlazeEmberFarm or Config.AutoObservationV2 or Config.AutoFarmAllBoss or Config.AutoRaid or Config.SailBoat or Config.AutoTerrorshark or Config.AutoSeaBest or Config.AutoFrozenDimension or Config.KillLevi or Config.AutoUpgradeRaceV2 or Config.AutoCyborg or Config.AutoGhoul or Config.AutoRainbowHaki or Config.AutoSkullGuitar or Config.AutoGetCDK or Config.AutoTushita or Config.AutoSaber or Config.TeleportMigare or Config.Tweentohighestpoint or Config.TeleportToGear or Config.LockMoonAndOnRaceV3 or Config.AutoDefendVolcano or Config.CollectEgg or Config.AutoCollectFireFlowers then
                local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
                if hrp and not hrp:FindFirstChild("BodyClip") then
                    local Noclip = Instance.new("BodyVelocity")
                    Noclip.Name = "BodyClip"
                    Noclip.Parent = hrp
                    Noclip.MaxForce = Vector3.new(100000, 100000, 100000)
                    Noclip.Velocity = Vector3.new(0, 0, 0)
                end
            else
                local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
                local bodyClip = hrp and hrp:FindFirstChild("BodyClip")
                if bodyClip then bodyClip:Destroy() end
            end
        end)
    end
end)

spawn(function()
    pcall(function()
        RunService.Stepped:Connect(function()
            if Config.NoClip or Config.AutoFarm or Config.AutoFarmBoss or Config.AutoFarmChest or Config.AutoFarmQuest or Config.AutoFarmMaterial or Config.AutoFarmBone or Config.AutoFarmKatakuri or Config.AutoFarmMastery or Config.AutoGetMelee or Config.AutoFactory or Config.AutoPirateRaid or Config.AutoEliteHunter or Config.AutoRipIndra or Config.AutoSoulReaper or Config.AutoDoughKing or Config.AutoDarkbeard or Config.DojoClaimQuest or Config.AutoUpgradeDragonTalon or Config.BlazeEmberFarm or Config.AutoObservationV2 or Config.AutoFarmAllBoss or Config.AutoRaid or Config.SailBoat or Config.AutoTerrorshark or Config.AutoSeaBest or Config.AutoFrozenDimension or Config.KillLevi or Config.AutoUpgradeRaceV2 or Config.AutoCyborg or Config.AutoGhoul or Config.AutoRainbowHaki or Config.AutoSkullGuitar or Config.AutoGetCDK or Config.AutoTushita or Config.AutoSaber or Config.TeleportMigare or Config.Tweentohighestpoint or Config.TeleportToGear or Config.LockMoonAndOnRaceV3 or Config.AutoDefendVolcano or Config.CollectEgg or Config.AutoCollectFireFlowers then
                for _, v in pairs(LocalPlayer.Character:GetDescendants()) do
                    if v:IsA("BasePart") then v.CanCollide = false end
                end
            end
        end)
    end)
end)

-- ==================== AUTO HAKI ====================
local lastHakiTime = 0
local hakiCooldown = 1

function AutoHaki()
    if not LocalPlayer.Character:FindFirstChild("HasBuso") then
        local currentTime = tick()
        if currentTime - lastHakiTime >= hakiCooldown then
            SafeInvoke("Buso")
            lastHakiTime = currentTime
        end
    end
end

-- ==================== EQUIP WEAPON ====================
local lastEquipTime = 0
local equipCooldown = 0.5

function EquipWeapon(ToolSe)
    local currentTime = tick()
    if currentTime - lastEquipTime >= equipCooldown then
        if not getgenv().NotAutoEquip then
            local tool = LocalPlayer.Backpack:FindFirstChild(ToolSe)
            if tool then LocalPlayer.Character.Humanoid:EquipTool(tool) end
        end
        lastEquipTime = currentTime
    end
end

function UnEquipWeapon(Weapon)
    local currentTime = tick()
    if currentTime - lastEquipTime >= equipCooldown then
        if LocalPlayer.Character:FindFirstChild(Weapon) then
            getgenv().NotAutoEquip = true
            LocalPlayer.Character[Weapon].Parent = LocalPlayer.Backpack
            getgenv().NotAutoEquip = false
        end
        lastEquipTime = currentTime
    end
end

-- ==================== DỊCH CHUYỂN ====================
function BTP(p)
    local humanoidRootPart = LocalPlayer.Character.HumanoidRootPart
    local humanoid = LocalPlayer.Character.Humanoid
    local playerGui = LocalPlayer.PlayerGui.Main
    local lastPosition = humanoidRootPart.Position
    repeat
        humanoid.Health = 0
        humanoidRootPart.CFrame = p
        playerGui.Quest.Visible = false
        if (humanoidRootPart.Position - lastPosition).Magnitude > 1 then
            lastPosition = humanoidRootPart.Position
            humanoidRootPart.CFrame = p
        end
        task.wait(0.5)
    until (p.Position - humanoidRootPart.Position).Magnitude <= 2000
end

function BTPZ(v209)
    if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart") then
        LocalPlayer.Character.HumanoidRootPart.CFrame = v209
    end
end

function requestEntrance(aJ)
    local args = {"requestEntrance", aJ}
    ReplicatedStorage.Remotes.CommF_:InvokeServer(unpack(args))
    local oldcframe = LocalPlayer.Character.HumanoidRootPart.CFrame
    LocalPlayer.Character.HumanoidRootPart.CFrame = CFrame.new(oldcframe.X, oldcframe.Y + 50, oldcframe.Z)
    task.wait(0.5)
end

function CheckNearestTeleporter(aI)
    local MyLevel = LocalPlayer.Data.Level.Value
    local vcspos = aI.Position
    local min = math.huge
    local min2 = math.huge
    local TableLocations = {}
    if World3 then
        TableLocations = {["Mansion"] = Vector3.new(-12471, 374, -7551), ["Hydra"] = Vector3.new(5659, 1013, -341), ["Caslte On The Sea"] = Vector3.new(-5092, 315, -3130), ["Floating Turtle"] = Vector3.new(-12001, 332, -8861), ["Beautiful Pirate"] = Vector3.new(5319, 23, -93), ["Temple Of Time"] = Vector3.new(28286, 14897, 103)}
    elseif World2 then
        TableLocations = {["Flamingo Mansion"] = Vector3.new(-317, 331, 597), ["Flamingo Room"] = Vector3.new(2283, 15, 867), ["Cursed Ship"] = Vector3.new(923, 125, 32853), ["Zombie Island"] = Vector3.new(-6509, 83, -133)}
    elseif World1 then
        TableLocations = {["Sky Island 1"] = Vector3.new(-4652, 873, -1754), ["Sky Island 2"] = Vector3.new(-7895, 5547, -380), ["Under Water Island"] = Vector3.new(61164, 5, 1820), ["Under Water Island Entrace"] = Vector3.new(3865, 5, -1926)}
    end
    local TableLocations2 = {}
    for r, v in pairs(TableLocations) do TableLocations2[r] = (v - vcspos).Magnitude end
    for r, v in pairs(TableLocations2) do if v < min then min = v min2 = v end end
    local choose
    for r, v in pairs(TableLocations2) do if v <= min then choose = TableLocations[r] end end
    local min3 = (vcspos - LocalPlayer.Character.HumanoidRootPart.Position).Magnitude
    if min2 <= min3 then return choose end
end

function topos(Tween_Pos)
    pcall(function()
        if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") and LocalPlayer.Character:FindFirstChild("HumanoidRootPart") and LocalPlayer.Character.Humanoid.Health > 0 then
            if not TweenSpeed then TweenSpeed = 350 end
            local DefualtY = Tween_Pos.Y
            local TargetY = Tween_Pos.Y
            local targetCFrameWithDefualtY = CFrame.new(Tween_Pos.X, DefualtY, Tween_Pos.Z)
            local targetPos = Tween_Pos.Position
            local oldcframe = LocalPlayer.Character.HumanoidRootPart.CFrame
            local Distance = (targetPos - LocalPlayer.Character:WaitForChild("HumanoidRootPart").Position).Magnitude
            if Distance <= 300 then LocalPlayer.Character.HumanoidRootPart.CFrame = Tween_Pos end
            local aM = CheckNearestTeleporter(Tween_Pos)
            if aM then
                pcall(function() if tween then tween:Cancel() end end)
                requestEntrance(aM)
            end
            local b1 = CFrame.new(LocalPlayer.Character.HumanoidRootPart.CFrame.X, DefualtY, LocalPlayer.Character.HumanoidRootPart.CFrame.Z)
            local IngoreY = true
            if IngoreY and (b1.Position - targetCFrameWithDefualtY.Position).Magnitude > 5 then
                LocalPlayer.Character.HumanoidRootPart.CFrame = CFrame.new(LocalPlayer.Character.HumanoidRootPart.CFrame.X, DefualtY, LocalPlayer.Character.HumanoidRootPart.CFrame.Z)
                local tweenfunc = {}
                local aN = TweenService
                local aO = TweenInfo.new((targetPos - LocalPlayer.Character:WaitForChild("HumanoidRootPart").Position).Magnitude / TweenSpeed, Enum.EasingStyle.Linear)
                tween = aN:Create(LocalPlayer.Character["HumanoidRootPart"], aO, {CFrame = targetCFrameWithDefualtY})
                tween:Play()
                tween.Completed:Wait()
                LocalPlayer.Character.HumanoidRootPart.CFrame = CFrame.new(LocalPlayer.Character.HumanoidRootPart.CFrame.X, TargetY, LocalPlayer.Character.HumanoidRootPart.CFrame.Z)
            else
                local tweenfunc = {}
                local aN = TweenService
                local aO = TweenInfo.new((targetPos - LocalPlayer.Character:WaitForChild("HumanoidRootPart").Position).Magnitude / TweenSpeed, Enum.EasingStyle.Linear)
                tween = aN:Create(LocalPlayer.Character["HumanoidRootPart"], aO, {CFrame = Tween_Pos})
                tween:Play()
                tween.Completed:Wait()
                LocalPlayer.Character.HumanoidRootPart.CFrame = CFrame.new(LocalPlayer.Character.HumanoidRootPart.CFrame.X, TargetY, LocalPlayer.Character.HumanoidRootPart.CFrame.Z)
            end
        end
    end)
end

function StopTween(target)
    pcall(function()
        if not target then
            getgenv().StopTween = true
            if tween then tween:Cancel() tween = nil end
            local humanoidRootPart = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if humanoidRootPart then
                humanoidRootPart.Anchored = true
                task.wait(0.1)
                humanoidRootPart.CFrame = humanoidRootPart.CFrame
                humanoidRootPart.Anchored = false
            end
            local bodyClip = humanoidRootPart and humanoidRootPart:FindFirstChild("BodyClip")
            if bodyClip then bodyClip:Destroy() end
            getgenv().StopTween = false
            getgenv().Clip = false
        end
    end)
end

-- ==================== AUTO FARM LEVEL ====================
spawn(function()
    local canRun = true
    local debounceTime = 0.5
    while wait(debounceTime) do
        if Config.AutoFarm and FarmMode == "Farm Level" then
            if canRun then
                canRun = false
                spawn(function()
                    local player = LocalPlayer
                    local questTitle = player.PlayerGui.Main.Quest.Container.QuestTitle.Title.Text
                    local questVisible = player.PlayerGui.Main.Quest.Visible
                    local humanoidRoot = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
                    if not string.find(questTitle, NameMon) then
                        StartMagnet = false
                        SafeInvoke("AbandonQuest")
                    end
                    if not questVisible then
                        StartMagnet = false
                        CheckQuest()
                        if BypassTP then
                            local distance = (humanoidRoot.Position - CFrameQuest.Position).Magnitude
                            if distance > 1500 then BTP(CFrameQuest * CFrame.new(0, 20, 5))
                            elseif distance < 1500 then topos(CFrameQuest) end
                        else topos(CFrameQuest) end
                        if (humanoidRoot.Position - CFrameQuest.Position).Magnitude <= 20 then
                            SafeInvoke("StartQuest", NameQuest, LevelQuest)
                        end
                    elseif questVisible then
                        CheckQuest()
                        local enemies = Workspace.Enemies:GetChildren()
                        for _, v in pairs(enemies) do
                            if v:FindFirstChild("HumanoidRootPart") and v:FindFirstChild("Humanoid") then
                                if v.Humanoid.Health > 0 and v.Name == Mon then
                                    if string.find(LocalPlayer.PlayerGui.Main.Quest.Container.QuestTitle.Title.Text, NameMon) then
                                        repeat
                                            task.wait(0.1)
                                            AutoHaki()
                                            EquipWeapon(Config.SelectWeapon)
                                            PosMon = v.HumanoidRootPart.CFrame
                                            topos(v.HumanoidRootPart.CFrame * Pos)
                                            v.HumanoidRootPart.CanCollide = false
                                            v.Humanoid.WalkSpeed = 0
                                            v.Head.CanCollide = false
                                            StartMagnet = true
                                            sethiddenproperty(player, "SimulationRadius", math.huge)
                                        until not Config.AutoFarm or v.Humanoid.Health <= 0 or not v.Parent or not LocalPlayer.PlayerGui.Main.Quest.Visible
                                    else
                                        StartMagnet = false
                                        SafeInvoke("AbandonQuest")
                                    end
                                end
                            end
                        end
                    end
                end)
                task.wait(0.5)
                canRun = true
            end
        end
    end
end)

-- ==================== AUTO FARM BOSS ====================
spawn(function()
    while task.wait(0.2) do
        if Config.AutoFarmBoss then
            pcall(function()
                local workspaceEnemies = Workspace.Enemies
                local selectBoss = Config.SelectBoss
                local playerRoot = LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
                local boss = workspaceEnemies:FindFirstChild(selectBoss)
                if boss then
                    for _, v in pairs(workspaceEnemies:GetChildren()) do
                        if v.Name == selectBoss and v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") then
                            local humanoid = v.Humanoid
                            local humanoidRootPart = v.HumanoidRootPart
                            if humanoid.Health > 0 then
                                repeat
                                    task.wait()
                                    AutoHaki()
                                    EquipWeapon(Config.SelectWeapon)
                                    humanoidRootPart.CanCollide = false
                                    humanoid.WalkSpeed = 0
                                    humanoidRootPart.Size = Vector3.new(80, 80, 80)
                                    topos(humanoidRootPart.CFrame * Pos)
                                until not Config.AutoFarmBoss or not v.Parent or humanoid.Health <= 0
                            end
                        end
                    end
                elseif ReplicatedStorage:FindFirstChild(selectBoss) then
                    local bossReplicated = ReplicatedStorage:FindFirstChild(selectBoss)
                    local bossRoot = bossReplicated.HumanoidRootPart
                    if (bossRoot.CFrame.Position - playerRoot.Position).Magnitude <= 1500 then topos(bossRoot.CFrame)
                    else BTP(bossRoot.CFrame) end
                end
            end)
        end
    end
end)

-- ==================== AUTO KILL ALL BOSS ====================
local tableBoss = {}
if World1 then
    tableBoss = {"The Gorilla King", "Bobby", "Yeti", "Mob Leader", "Vice Admiral", "Warden", "Chief Warden", "Swan", "Magma Admiral", "Fishman Lord", "Wysper", "Thunder God", "Cyborg", "Saber Expert"}
elseif World2 then
    tableBoss = {"Diamond", "Jeremy", "Fajita", "Don Swan", "Smoke Admiral", "Cursed Captain", "Darkbeard", "Order", "Awakened Ice Admiral", "Tide Keeper"}
elseif World3 then
    tableBoss = {"Stone", "Island Empress", "Kilo Admiral", "Captain Elephant", "Beautiful Pirate", "rip_indra True Form", "Longma", "Soul Reaper", "Cake Queen", "Cake Prince", "Dough King"}
end

spawn(function()
    while task.wait(0.2) do
        if Config.AutoFarmAllBoss then
            pcall(function()
                for i, boss in pairs(tableBoss) do
                    if Workspace.Enemies:FindFirstChild(boss) then
                        for i, v in pairs(Workspace.Enemies:GetChildren()) do
                            if v.Name == boss then
                                if v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                                    repeat
                                        task.wait()
                                        AutoHaki()
                                        EquipWeapon(Config.SelectWeapon)
                                        v.HumanoidRootPart.CanCollide = false
                                        v.Humanoid.WalkSpeed = 0
                                        v.HumanoidRootPart.Size = Vector3.new(80, 80, 80)
                                        topos(v.HumanoidRootPart.CFrame * Pos)
                                    until not Config.AutoFarmAllBoss or not v.Parent or v.Humanoid.Health <= 0
                                end
                            end
                        end
                    else
                        if ReplicatedStorage:FindFirstChild(boss) then
                            topos(ReplicatedStorage:FindFirstChild(boss).HumanoidRootPart.CFrame * CFrame.new(5, 10, 2))
                        end
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO CHEST ====================
spawn(function()
    local lastTarget = nil
    while wait(0.2) do
        if Config.AutoFarmChest then
            local character = LocalPlayer.Character or LocalPlayer.CharacterAdded:Wait()
            local playerPos = character:GetPivot().Position
            local chests = CollectionService:GetTagged("_ChestTagged")
            local closestChest, minDist = nil, math.huge
            for _, chest in ipairs(chests) do
                if not chest:GetAttribute("IsDisabled") then
                    local dist = (chest:GetPivot().Position - playerPos).Magnitude
                    if dist < minDist then minDist, closestChest = dist, chest end
                end
            end
            if closestChest and closestChest ~= lastTarget then
                lastTarget = closestChest
                topos(closestChest:GetPivot())
            end
        end
    end
end)

-- ==================== AUTO MATERIAL ====================
local MMon, MPos, SP = nil, nil, nil
function MaterialMon()
    local humanoidRootPart = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
    if not humanoidRootPart then return end
    local function shouldRequestEntrance(targetPosition, distanceThreshold)
        if (humanoidRootPart.Position - targetPosition).Magnitude >= distanceThreshold then
            SafeInvoke("requestEntrance", targetPosition)
        end
    end
    if World1 then
        if Config.SelectMaterial == "Angel Wings" then
            MMon = {"Shanda", "Royal Squad", "Royal Soldier", "Wysper", "Thunder God"}
            MPos = CFrame.new(-4698, 845, -1912); SP = "Default"
            shouldRequestEntrance(Vector3.new(-4607.82275, 872.54248, -1667.55688), 10000)
        elseif Config.SelectMaterial == "Leather + Scrap Metal" then
            MMon = {"Brute", "Pirate"}; MPos = CFrame.new(-1145, 15, 4350); SP = "Default"
        elseif Config.SelectMaterial == "Magma Ore" then
            MMon = {"Military Soldier", "Military Spy", "Magma Admiral"}; MPos = CFrame.new(-5815, 84, 8820); SP = "Default"
        elseif Config.SelectMaterial == "Fish Tail" then
            MMon = {"Fishman Warrior", "Fishman Commando", "Fishman Lord"}; MPos = CFrame.new(61123, 19, 1569); SP = "Default"
            shouldRequestEntrance(Vector3.new(61163.8515625, 5.342342376708984, 1819.7841796875), 17000)
        end
    elseif World2 then
        if Config.SelectMaterial == "Leather + Scrap Metal" then
            MMon = {"Marine Captain"}; MPos = CFrame.new(-2010.5059814453125, 73.00115966796875, -3326.620849609375); SP = "Default"
        elseif Config.SelectMaterial == "Magma Ore" then
            MMon = {"Magma Ninja", "Lava Pirate"}; MPos = CFrame.new(-5428, 78, -5959); SP = "Default"
        elseif Config.SelectMaterial == "Ectoplasm" then
            MMon = {"Ship Deckhand", "Ship Engineer", "Ship Steward", "Ship Officer"}; MPos = CFrame.new(911.35827636719, 125.95812988281, 33159.5390625); SP = "Default"
            shouldRequestEntrance(Vector3.new(61163.8515625, 5.342342376708984, 1819.7841796875), 18000)
        elseif Config.SelectMaterial == "Mystic Droplet" then
            MMon = {"Water Fighter"}; MPos = CFrame.new(-3385, 239, -10542); SP = "Default"
        elseif Config.SelectMaterial == "Radioactive Material" then
            MMon = {"Factory Staff"}; MPos = CFrame.new(295, 73, -56); SP = "Default"
        elseif Config.SelectMaterial == "Vampire Fang" then
            MMon = {"Vampire"}; MPos = CFrame.new(-6033, 7, -1317); SP = "Default"
        end
    elseif World3 then
        if Config.SelectMaterial == "Leather + Scrap Metal" then
            MMon = {"Jungle Pirate", "Forest Pirate"}; MPos = CFrame.new(-11975.78515625, 331.7734069824219, -10620.0302734375); SP = "Default"
        elseif Config.SelectMaterial == "Fish Tail" then
            MMon = {"Fishman Raider", "Fishman Captain"}; MPos = CFrame.new(-10993, 332, -8940); SP = "Default"
        elseif Config.SelectMaterial == "Conjured Cocoa" then
            MMon = {"Chocolate Bar Battler", "Cocoa Warrior"}; MPos = CFrame.new(620.6344604492188, 78.93644714355469, -12581.369140625); SP = "Default"
        elseif Config.SelectMaterial == "Dragon Scale" then
            MMon = {"Dragon Crew Warrior"}; MPos = CFrame.new(6594, 383, 139); SP = "Default"
        elseif Config.SelectMaterial == "Gunpowder" then
            MMon = {"Pistol Billionaire"}; MPos = CFrame.new(-469, 74, 5904); SP = "Default"
        elseif Config.SelectMaterial == "Mini Tusk" then
            MMon = {"Mythological Pirate"}; MPos = CFrame.new(-13545, 470, -6917); SP = "Default"
        end
    end
end

spawn(function()
    while task.wait(0.1) do
        if Config.AutoFarmMaterial then
            pcall(function()
                MaterialMon()
                topos(MPos)
                for _, EnemyName in ipairs(MMon) do
                    for _, v in pairs(Workspace.Enemies:GetChildren()) do
                        if v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                            if v.Name == EnemyName then
                                repeat
                                    task.wait(0.1)
                                    AutoHaki()
                                    EquipWeapon(Config.SelectWeapon)
                                    v.HumanoidRootPart.CanCollide = false
                                    v.Humanoid.WalkSpeed = 0
                                    v.Head.CanCollide = false
                                    topos(v.HumanoidRootPart.CFrame * Pos)
                                    StartMagnet = true
                                until not Config.AutoFarmMaterial or not v.Parent or v.Humanoid.Health <= 0
                            end
                        end
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO BONE ====================
local BonePos = CFrame.new(-9506.234375, 172.130615234375, 6117.0771484375)
spawn(function()
    while wait(0.1) do
        if FarmMode == "Farm Bone" and Config.AutoFarm and World3 then
            pcall(function()
                local enemies = Workspace.Enemies:GetChildren()
                local foundEnemy = false
                for _, v in pairs(enemies) do
                    if v.Name == "Reborn Skeleton" or v.Name == "Living Zombie" or v.Name == "Demonic Soul" or v.Name == "Posessed Mummy" then
                        if v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                            foundEnemy = true
                            repeat wait(0.1)
                                AutoHaki()
                                EquipWeapon(Config.SelectWeapon)
                                v.HumanoidRootPart.CanCollide = false
                                v.Humanoid.WalkSpeed = 0
                                v.Head.CanCollide = false
                                topos(v.HumanoidRootPart.CFrame * Pos)
                            until not Config.AutoFarm or not v.Parent or v.Humanoid.Health <= 0
                        end
                    end
                end
                if not foundEnemy then
                    if BypassTP then
                        if (LocalPlayer.Character.HumanoidRootPart.Position - BonePos.Position).Magnitude > 1500 then BTP(BonePos)
                        else topos(BonePos) end
                    else topos(BonePos) end
                end
            end)
        end
    end
end)

-- ==================== AUTO KATAKURI ====================
spawn(function()
    while task.wait(0.1) do
        if FarmMode == "Farm Katakuri" and Config.AutoFarm and World3 then
            pcall(function()
                SafeInvoke("CakePrinceSpawner")
                if ReplicatedStorage:FindFirstChild("Cake Prince") or Workspace.Enemies:FindFirstChild("Cake Prince") then
                    if Workspace.Enemies:FindFirstChild("Cake Prince") then
                        for _, v in pairs(Workspace.Enemies:GetChildren()) do
                            if v.Name == "Cake Prince" and v:FindFirstChild("HumanoidRootPart") and v:FindFirstChild("Humanoid") and v.Humanoid.Health > 0 then
                                repeat
                                    RunService.Heartbeat:wait()
                                    AutoHaki()
                                    EquipWeapon(Config.SelectWeapon)
                                    v.HumanoidRootPart.CanCollide = false
                                    v.Humanoid.WalkSpeed = 0
                                    v.HumanoidRootPart.Size = Vector3.new(60, 60, 60)
                                    topos(v.HumanoidRootPart.CFrame * Pos)
                                until not Config.AutoFarm or not v.Parent or v.Humanoid.Health <= 0
                            end
                        end
                    end
                else
                    if Workspace.Enemies:FindFirstChild("Cookie Crafter") or Workspace.Enemies:FindFirstChild("Cake Guard") or Workspace.Enemies:FindFirstChild("Baking Staff") or Workspace.Enemies:FindFirstChild("Head Baker") then
                        for _, v in pairs(Workspace.Enemies:GetChildren()) do
                            if v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                                if (v.Name == "Cookie Crafter" or v.Name == "Cake Guard" or v.Name == "Baking Staff" or v.Name == "Head Baker") then
                                    repeat
                                        RunService.Heartbeat:wait()
                                        AutoHaki()
                                        EquipWeapon(Config.SelectWeapon)
                                        v.HumanoidRootPart.CanCollide = false
                                        v.Humanoid.WalkSpeed = 0
                                        v.Head.CanCollide = false
                                        topos(v.HumanoidRootPart.CFrame * Pos)
                                    until not Config.AutoFarm or not v.Parent or v.Humanoid.Health <= 0
                                end
                            end
                        end
                    else
                        topos(CFrame.new(-2077, 252, -12373))
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO RAID ====================
spawn(function()
    while task.wait(1) do
        if Config.AutoRaid then
            pcall(function()
                if not LocalPlayer.PlayerGui.Main.TopHUDList.RaidTimer.Visible then
                    local islands = {"Island 5", "Island 4", "Island 3", "Island 2", "Island 1"}
                    for _, island in ipairs(islands) do
                        local location = Workspace["_WorldOrigin"].Locations:FindFirstChild(island)
                        if location then topos(location.CFrame * CFrame.new(0, 70, 100)) break end
                    end
                end
                if LocalPlayer.PlayerGui.Main.Timer.Visible == false then
                    local specialMicrochip = LocalPlayer.Backpack:FindFirstChild("Special Microchip") or LocalPlayer.Character:FindFirstChild("Special Microchip")
                    if specialMicrochip then
                        if World2 then fireclickdetector(Workspace.Map.CircleIsland.RaidSummon2.Button.Main.ClickDetector)
                        elseif World3 then fireclickdetector(Workspace.Map["Boat Castle"].RaidSummon2.Button.Main.ClickDetector) end
                    end
                end
                for i, v in pairs(Workspace.Enemies:GetDescendants()) do
                    if v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                        pcall(function()
                            repeat task.wait(.001)
                                v.Humanoid.Health = 0
                                v.HumanoidRootPart.CanCollide = false
                                sethiddenproperty(LocalPlayer, "SimulationRadius", math.huge)
                            until not Config.AutoRaid or not v.Parent or v.Humanoid.Health <= 0
                        end)
                    end
                end
                SafeInvoke("RaidsNpc", "Select", Config.SelectChip)
            end)
        end
    end
end)

-- ==================== AUTO FACTORY ====================
task.spawn(function()
    while task.wait(0.1) do
        if not Config.AutoFactory or not World2 then continue end
        local enemies = Workspace.Enemies
        local coreEnemy = enemies:FindFirstChild("Core")
        if coreEnemy and coreEnemy.Humanoid.Health > 0 then
            repeat
                task.wait(0.1)
                AutoHaki()
                EquipWeapon(Config.SelectWeapon)
                topos(coreEnemy.HumanoidRootPart.CFrame)
            until coreEnemy.Humanoid.Health <= 0 or not Config.AutoFactory
        else
            topos(CFrame.new(448.46756, 199.356781, -441.389252))
        end
    end
end)

-- ==================== AUTO PIRATE RAID ====================
task.spawn(function()
    while task.wait(0.1) do
        if not Config.AutoPirateRaid or not World3 then continue end
        pcall(function()
            local CFrameBoss = CFrame.new(-5496.17432, 313.768921, -2841.53027)
            local humanoidRootPart = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if not humanoidRootPart then return end
            local distanceToBoss = (CFrame.new(-5539.311, 313.801, -2972.372).Position - humanoidRootPart.Position).Magnitude
            if distanceToBoss <= 500 then
                for _, enemy in pairs(Workspace.Enemies:GetChildren()) do
                    if Config.AutoPirateRaid and enemy:FindFirstChild("HumanoidRootPart") and enemy:FindFirstChild("Humanoid") and enemy.Humanoid.Health > 0 then
                        local enemyDistance = (enemy.HumanoidRootPart.Position - humanoidRootPart.Position).Magnitude
                        if enemyDistance < 2000 then
                            repeat task.wait(0.1)
                                AutoHaki()
                                EquipWeapon(Config.SelectWeapon)
                                enemy.HumanoidRootPart.CanCollide = false
                                topos(enemy.HumanoidRootPart.CFrame * Pos)
                            until enemy.Humanoid.Health <= 0 or not enemy.Parent or not Config.AutoPirateRaid
                        end
                    end
                end
            else
                UnEquipWeapon(Config.SelectWeapon)
                if BypassTP then
                    local distanceToCFrameBoss = (humanoidRootPart.Position - CFrameBoss.Position).Magnitude
                    if distanceToCFrameBoss > 1500 then BTP(CFrameBoss)
                    elseif distanceToCFrameBoss <= 1500 then topos(CFrameBoss) end
                end
                topos(CFrame.new(-5122, 315, -2963))
            end
        end)
    end
end)

-- ==================== AUTO SOUL REAPER ====================
spawn(function()
    while true do
        if Config.AutoSoulReaper and World3 then
            pcall(function()
                local workspaceEnemies = Workspace.Enemies
                local player = LocalPlayer
                local backpack = player.Backpack
                local character = player.Character
                local humanoidRootPart = character and character:FindFirstChild("HumanoidRootPart")
                if workspaceEnemies:FindFirstChild("Soul Reaper") then
                    for _, v in pairs(workspaceEnemies:GetChildren()) do
                        if string.find(v.Name, "Soul Reaper") then
                            repeat
                                task.wait(0.1)
                                AutoHaki()
                                EquipWeapon(Config.SelectWeapon)
                                topos(v.HumanoidRootPart.CFrame * Pos)
                                v.HumanoidRootPart.CanCollide = false
                                v.Humanoid.WalkSpeed = 0
                                v.HumanoidRootPart.Transparency = 1
                            until v.Humanoid.Health <= 0 or not Config.AutoSoulReaper
                        end
                    end
                elseif backpack:FindFirstChild("Hallow Essence") or character:FindFirstChild("Hallow Essence") then
                    local targetPosition = CFrame.new(-8932.322265625, 146.83154296875, 6062.55078125)
                    repeat topos(targetPosition) task.wait(0.1) until (targetPosition.Position - humanoidRootPart.Position).Magnitude <= 8
                    EquipWeapon("Hallow Essence")
                else
                    local soulReaper = ReplicatedStorage:FindFirstChild("Soul Reaper")
                    if soulReaper then topos(soulReaper.HumanoidRootPart.CFrame * CFrame.new(2, 20, 2)) end
                end
            end)
        end
        task.wait(0.1)
    end
end)

-- ==================== AUTO DOUGH KING ====================
spawn(function()
    while task.wait(0.2) do
        if Config.AutoDoughKing and World3 then
            pcall(function()
                if LocalPlayer.Backpack:FindFirstChild("God's Chalice") or LocalPlayer.Character:FindFirstChild("God's Chalice") then
                    if string.find(SafeInvoke("SweetChaliceNpc"), "Where") then
                        Notify("Thông báo", "Không đủ nguyên liệu")
                    else
                        SafeInvoke("SweetChaliceNpc")
                    end
                elseif LocalPlayer.Backpack:FindFirstChild("Sweet Chalice") or LocalPlayer.Character:FindFirstChild("Sweet Chalice") then
                    if string.find(SafeInvoke("CakePrinceSpawner"), "Do you want to open the portal now?") then
                        SafeInvoke("CakePrinceSpawner")
                    else
                        if Workspace.Enemies:FindFirstChild("Baking Staff") or Workspace.Enemies:FindFirstChild("Head Baker") or Workspace.Enemies:FindFirstChild("Cake Guard") or Workspace.Enemies:FindFirstChild("Cookie Crafter") then
                            for i, v in pairs(Workspace.Enemies:GetChildren()) do
                                if (v.Name == "Baking Staff" or v.Name == "Head Baker" or v.Name == "Cake Guard" or v.Name == "Cookie Crafter") and v.Humanoid.Health > 0 then
                                    repeat
                                        task.wait(0.05)
                                        AutoHaki()
                                        EquipWeapon(Config.SelectWeapon)
                                        topos(v.HumanoidRootPart.CFrame * Pos)
                                    until not Config.AutoDoughKing or ReplicatedStorage:FindFirstChild("Cake Prince") or not v.Parent or v.Humanoid.Health <= 0
                                end
                            end
                        else
                            topos(CFrame.new(-1820.063, 210.748, -12297.496))
                        end
                    end
                elseif ReplicatedStorage:FindFirstChild("Dough King") or Workspace.Enemies:FindFirstChild("Dough King") then
                    if Workspace.Enemies:FindFirstChild("Dough King") then
                        for i, v in pairs(Workspace.Enemies:GetChildren()) do
                            if v.Name == "Dough King" then
                                repeat
                                    task.wait(0.05)
                                    AutoHaki()
                                    EquipWeapon(Config.SelectWeapon)
                                    v.HumanoidRootPart.CanCollide = false
                                    topos(v.HumanoidRootPart.CFrame * Pos)
                                until not Config.AutoDoughKing or not v.Parent or v.Humanoid.Health <= 0
                            end
                        end
                    else
                        topos(CFrame.new(-2009.280, 4532.972, -14937.308))
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO DARKBEARD ====================
spawn(function()
    while task.wait(0.1) do
        if Config.AutoDarkbeard and World2 then
            pcall(function()
                local enemies = Workspace.Enemies
                if enemies:FindFirstChild("Darkbeard") then
                    for _, v in pairs(enemies:GetChildren()) do
                        if v.Name == "Darkbeard" and v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                            repeat
                                task.wait(0.05)
                                AutoHaki()
                                EquipWeapon(Config.SelectWeapon)
                                v.HumanoidRootPart.CanCollide = false
                                v.Humanoid.WalkSpeed = 0
                                topos(v.HumanoidRootPart.CFrame * Pos)
                            until not Config.AutoDarkbeard or not v.Parent or v.Humanoid.Health <= 0
                        end
                    end
                elseif LocalPlayer.Backpack:FindFirstChild("Fist of Darkness") or LocalPlayer.Character:FindFirstChild("Fist of Darkness") then
                    repeat
                        task.wait(0.1)
                        topos(CFrame.new(3778.584, 15.791, -3499.404))
                        EquipWeapon("Fist of Darkness")
                    until not Config.AutoDarkbeard
                elseif ReplicatedStorage:FindFirstChild("Darkbeard") then
                    topos(ReplicatedStorage:FindFirstChild("Darkbeard").HumanoidRootPart.CFrame * Pos)
                end
            end)
        end
    end
end)

-- ==================== AUTO RIP INDRA ====================
spawn(function()
    pcall(function()
        while task.wait(1) do
            if Config.AutoRipIndra and World3 then
                local enemies = Workspace.Enemies
                if enemies:FindFirstChild("rip_indra True Form") or enemies:FindFirstChild("rip_indra") then
                    for _, v in pairs(enemies:GetChildren()) do
                        if (v.Name == "rip_indra True Form" or v.Name == "rip_indra") and v.Humanoid.Health > 0 and v:IsA("Model") and v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") then
                            repeat
                                task.wait(0.3)
                                pcall(function()
                                    AutoHaki()
                                    EquipWeapon(Config.SelectWeapon)
                                    v.HumanoidRootPart.CanCollide = false
                                    v.Humanoid.WalkSpeed = 0
                                    topos(v.HumanoidRootPart.CFrame * Pos)
                                end)
                            until not Config.AutoRipIndra or v.Humanoid.Health <= 0
                        end
                    end
                elseif LocalPlayer.Backpack:FindFirstChild("God's Chalice") or LocalPlayer.Character:FindFirstChild("God's Chalice") then
                    repeat
                        task.wait(0.3)
                        topos(CFrame.new(-5563.75048828125, 320.4276123046875, -2662.509521484375))
                        EquipWeapon("God's Chalice")
                    until not (LocalPlayer.Backpack:FindFirstChild("God's Chalice") or LocalPlayer.Character:FindFirstChild("God's Chalice"))
                elseif ReplicatedStorage:FindFirstChild("rip_indra True Form") then
                    local ripIndraTrueForm = ReplicatedStorage:FindFirstChild("rip_indra True Form")
                    topos(ripIndraTrueForm.HumanoidRootPart.CFrame * Pos)
                end
            end
        end
    end)
end)

-- ==================== AUTO OBSERVATION ====================
spawn(function()
    pcall(function()
        while task.wait(0.1) do
            if Config.AutoObservation then
                if LocalPlayer.VisionRadius.Value >= 5000 then
                    task.wait(1)
                else
                    local enemyName, spawnPos
                    local gui = LocalPlayer.PlayerGui.ScreenGui
                    if World2 then
                        enemyName = "Lava Pirate [Lv. 1200]"; spawnPos = CFrame.new(-5478.39209, 15.9775667, -5246.9126)
                    elseif World1 then
                        enemyName = "Galley Captain"; spawnPos = CFrame.new(5533.29785, 88.1079102, 4852.3916)
                    elseif World3 then
                        enemyName = "Venomous Assailant"; spawnPos = CFrame.new(4638.78564453125, 1078.94091796875, 881.8002319335938)
                    end
                    local enemy = Workspace.Enemies:FindFirstChild(enemyName)
                    if enemy then
                        if gui:FindFirstChild("ImageLabel") then
                            repeat
                                task.wait(0.1)
                                LocalPlayer.Character.HumanoidRootPart.CFrame = enemy.HumanoidRootPart.CFrame * CFrame.new(3, 0, 0)
                            until not Config.AutoObservation or not gui:FindFirstChild("ImageLabel")
                        else
                            repeat
                                task.wait(0.1)
                                LocalPlayer.Character.HumanoidRootPart.CFrame = enemy.HumanoidRootPart.CFrame * CFrame.new(0, 50, 0)
                            until not Config.AutoObservation or gui:FindFirstChild("ImageLabel")
                        end
                    else
                        topos(spawnPos)
                    end
                end
            end
        end
    end)
end)

-- ==================== AUTO OBSERVATION V2 ====================
spawn(function()
    local lastUpdateTime = tick()
    while task.wait(0.1) do
        pcall(function()
            if Config.AutoObservationV2 and World3 then
                if LocalPlayer.PlayerGui.Main.Quest.Visible == false then
                    if tick() - lastUpdateTime >= 1 then
                        topos(CFrame.new(-12444.78515625, 332.40396118164, -7673.1806640625))
                        lastUpdateTime = tick()
                    end
                    SafeInvoke("CitizenQuestProgress", "Citizen")
                    task.wait(1)
                    SafeInvoke("StartQuest", "CitizenQuest", 1)
                else
                    if string.find(LocalPlayer.PlayerGui.Main.Quest.Container.QuestTitle.Title.Text, "Defeat 50 Forest Pirates") then
                        if Workspace.Enemies:FindFirstChild("Forest Pirate") then
                            for i, v in pairs(Workspace.Enemies:GetChildren()) do
                                if v.Name == "Forest Pirate" then
                                    repeat
                                        AutoHaki()
                                        EquipWeapon(Config.SelectWeapon)
                                        topos(v.HumanoidRootPart.CFrame * Pos)
                                        PosHee = v.HumanoidRootPart.CFrame
                                        v.HumanoidRootPart.CanCollide = false
                                        v.Humanoid.WalkSpeed = 0
                                        v.HumanoidRootPart.Size = Vector3.new(50, 50, 50)
                                    until not Config.AutoObservationV2 or v.Humanoid.Health <= 0
                                end
                            end
                        end
                    elseif LocalPlayer.PlayerGui.Main.Quest.Container.QuestTitle.Title.Text == "Defeat Captain Elephant (0/1)" then
                        if Workspace.Enemies:FindFirstChild("Captain Elephant") then
                            for i, v in pairs(Workspace.Enemies:GetChildren()) do
                                if v.Name == "Captain Elephant" then
                                    repeat
                                        AutoHaki()
                                        EquipWeapon(Config.SelectWeapon)
                                        topos(v.HumanoidRootPart.CFrame * Pos)
                                        v.HumanoidRootPart.CanCollide = false
                                        v.Humanoid.WalkSpeed = 0
                                        v.HumanoidRootPart.Size = Vector3.new(50, 50, 50)
                                    until not Config.AutoObservationV2 or v.Humanoid.Health <= 0
                                end
                            end
                        end
                    end
                end
            end
        end)
    end
end)

-- ==================== AUTO RAINBOW HAKI ====================
spawn(function()
    pcall(function()
        while task.wait(0.2) do
            if Config.AutoRainbowHaki and World3 then
                local char = LocalPlayer.Character
                local hrp = char and char:FindFirstChild("HumanoidRootPart")
                local questGui = LocalPlayer.PlayerGui.Main.Quest
                if not hrp then continue end
                if not questGui.Visible then
                    local targetPos = Vector3.new(-11892.0703125, 930.57672119141, -8760.1591796875)
                    if (targetPos - hrp.Position).Magnitude > 30 then topos(CFrame.new(targetPos))
                    else
                        task.wait(1.1)
                        SafeInvoke("HornedMan", "Bet")
                    end
                else
                    local questTitle = questGui.Container.QuestTitle.Title.Text
                    local enemyNames = {
                        ["Stone"] = Vector3.new(-1175, 53, 6811),
                        ["Island Empress"] = Vector3.new(5887, 1019, -114),
                        ["Kilo Admiral"] = Vector3.new(3014, 509, -7354),
                        ["Captain Elephant"] = Vector3.new(-13485.0283, 331.709259, -8012.4873),
                        ["Beautiful Pirate"] = Vector3.new(5377, 22, -62)
                    }
                    for enemyName, teleportPos in pairs(enemyNames) do
                        if string.find(questTitle, enemyName) then
                            local enemy = Workspace.Enemies:FindFirstChild(enemyName)
                            if enemy and enemy:FindFirstChild("HumanoidRootPart") then
                                local oldCFrame = enemy.HumanoidRootPart.CFrame
                                repeat
                                    task.wait()
                                    AutoHaki()
                                    EquipWeapon(Config.SelectWeapon)
                                    topos(enemy.HumanoidRootPart.CFrame * Pos)
                                    enemy.HumanoidRootPart.CanCollide = false
                                    enemy.HumanoidRootPart.Size = Vector3.new(50, 50, 50)
                                    enemy.HumanoidRootPart.CFrame = oldCFrame
                                until not Config.AutoRainbowHaki or enemy.Humanoid.Health <= 0 or not enemy.Parent or not questGui.Visible
                            else
                                topos(CFrame.new(teleportPos))
                            end
                            break
                        end
                    end
                end
            end
        end
    end)
end)

-- ==================== AUTO SABER ====================
spawn(function()
    while task.wait(0.5) do
        if Config.AutoSaber and LocalPlayer.Data.Level.Value >= 200 then
            pcall(function()
                local char = LocalPlayer.Character
                local hrp = char and char:FindFirstChild("HumanoidRootPart")
                if not hrp then return end
                local jungle = Workspace.Map.Jungle
                local desert = Workspace.Map.Desert
                local relicPos = CFrame.new(-1404.91, 29.97, 3.80)
                if jungle.Final.Part.Transparency == 0 then
                    if jungle.QuestPlates.Door.Transparency == 0 then
                        local saberPos = CFrame.new(-1612.55, 36.97, 148.71)
                        if (saberPos.Position - hrp.Position).Magnitude <= 100 then
                            for i = 1, 5 do
                                local plate = jungle.QuestPlates:FindFirstChild("Plate" .. i)
                                if plate and plate:FindFirstChild("Button") then
                                    hrp.CFrame = plate.Button.CFrame
                                    task.wait(0.5)
                                end
                            end
                        else topos(saberPos) end
                    else
                        if desert.Burn.Part.Transparency == 0 then
                            if LocalPlayer.Backpack:FindFirstChild("Torch") or char:FindFirstChild("Torch") then
                                EquipWeapon("Torch")
                                topos(CFrame.new(1114.61, 5.04, 4350.22))
                            else topos(CFrame.new(-1610.00, 11.50, 164.00)) end
                        else
                            if SafeInvoke("ProQuestProgress", "SickMan") ~= 0 then
                                SafeInvoke("ProQuestProgress", "GetCup")
                                task.wait(0.1)
                                EquipWeapon("Cup")
                                task.wait(0.1)
                                SafeInvoke("ProQuestProgress", "FillCup", char:FindFirstChild("Cup"))
                                task.wait(0.1)
                                SafeInvoke("ProQuestProgress", "SickMan")
                            else
                                if SafeInvoke("ProQuestProgress", "RichSon") == nil then
                                    SafeInvoke("ProQuestProgress", "RichSon")
                                elseif SafeInvoke("ProQuestProgress", "RichSon") == 0 then
                                    local mobLeader = Workspace.Enemies:FindFirstChild("Mob Leader") or ReplicatedStorage:FindFirstChild("Mob Leader")
                                    if mobLeader then
                                        repeat
                                            task.wait()
                                            AutoHaki()
                                            EquipWeapon(Config.SelectWeapon)
                                            mobLeader.HumanoidRootPart.CanCollide = false
                                            mobLeader.Humanoid.WalkSpeed = 0
                                            topos(mobLeader.HumanoidRootPart.CFrame)
                                        until mobLeader.Humanoid.Health <= 0 or not Config.AutoSaber
                                    end
                                elseif SafeInvoke("ProQuestProgress", "RichSon") == 1 then
                                    SafeInvoke("ProQuestProgress", "RichSon")
                                    task.wait(0.1)
                                    EquipWeapon("Relic")
                                    task.wait(0.1)
                                    topos(relicPos)
                                end
                            end
                        end
                    end
                else
                    local saberExpert = Workspace.Enemies:FindFirstChild("Saber Expert") or ReplicatedStorage:FindFirstChild("Saber Expert")
                    if saberExpert then
                        repeat
                            task.wait()
                            EquipWeapon(Config.SelectWeapon)
                            topos(saberExpert.HumanoidRootPart.CFrame)
                            saberExpert.HumanoidRootPart.Size = Vector3.new(60, 60, 60)
                            saberExpert.HumanoidRootPart.Transparency = 1
                            saberExpert.Humanoid.JumpPower = 0
                            saberExpert.Humanoid.WalkSpeed = 0
                            saberExpert.HumanoidRootPart.CanCollide = false
                        until saberExpert.Humanoid.Health <= 0 or not Config.AutoSaber
                        if saberExpert.Humanoid.Health <= 0 then
                            SafeInvoke("ProQuestProgress", "PlaceRelic")
                        end
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO TUSHITA ====================
spawn(function()
    while task.wait(0.5) do
        if Config.AutoTushita and World3 then
            pcall(function()
                local enemies = Workspace.Enemies
                local longma = enemies:FindFirstChild("Longma")
                local char = LocalPlayer.Character
                local hrp = char and char:FindFirstChild("HumanoidRootPart")
                if longma and hrp then
                    for _, enemy in pairs(enemies:GetChildren()) do
                        if enemy.Name == "Longma" and enemy.Parent and enemy:FindFirstChild("Humanoid") and enemy:FindFirstChild("HumanoidRootPart") then
                            local humanoid = enemy.Humanoid
                            local rootPart = enemy.HumanoidRootPart
                            if humanoid.Health > 0 then
                                AutoHaki()
                                EquipWeapon(Config.SelectWeapon)
                                repeat
                                    task.wait(0.1)
                                    rootPart.CanCollide = false
                                    humanoid.WalkSpeed = 0
                                    topos(rootPart.CFrame * Pos)
                                until not Config.AutoTushita or not enemy.Parent or humanoid.Health <= 0
                            end
                        end
                    end
                else
                    topos(CFrame.new(-10238.876, 389.791, -9549.794))
                end
            end)
        end
    end
end)

-- ==================== AUTO YAMA ====================
spawn(function()
    while task.wait(1) do
        pcall(function()
            if Config.AutoYama then
                local progress = SafeInvoke("EliteHunter", "Progress")
                if progress and progress >= 30 then
                    local yamaInBackpack = LocalPlayer.Backpack:FindFirstChild("Yama")
                    local sealedKatana = Workspace.Map:FindFirstChild("Waterfall")
                    if not yamaInBackpack and sealedKatana and sealedKatana:FindFirstChild("SealedKatana") then
                        local clickDetector = sealedKatana.SealedKatana.Handle:FindFirstChild("ClickDetector")
                        if clickDetector then
                            repeat
                                task.wait(0.5)
                                fireclickdetector(clickDetector)
                            until LocalPlayer.Backpack:FindFirstChild("Yama") or not Config.AutoYama
                        end
                    end
                end
            end
        end)
    end
end)

-- ==================== AUTO GET CDK ====================
task.spawn(function()
    repeat task.wait() until Config.AutoGetCDK
    local hasNotified = false
    while Config.AutoGetCDK do
        task.wait(0.2)
        pcall(function()
            SafeInvoke("CDKQuest", "Progress", "Good")
            task.wait(0.2)
            SafeInvoke("CDKQuest", "Progress", "Evil")
            task.wait(0.2)
            SafeInvoke("CDKQuest", "StartTrial", "Boss")
            task.wait(0.2)
            local boss = Workspace.Enemies:FindFirstChild("Cursed Skeleton Boss")
            if boss then
                for _, v in pairs(Workspace.Enemies:GetChildren()) do
                    if v.Name == "Cursed Skeleton Boss" and v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                        local char = LocalPlayer.Character
                        local backpack = LocalPlayer.Backpack
                        if char:FindFirstChild("Yama") or backpack:FindFirstChild("Yama") then EquipWeapon("Yama")
                        elseif char:FindFirstChild("Tushita") or backpack:FindFirstChild("Tushita") then EquipWeapon("Tushita")
                        elseif not hasNotified then
                            Notify("NSMOD", "Sử dụng Yama hoặc Tushita")
                            hasNotified = true
                        end
                        AutoHaki()
                        v.HumanoidRootPart.CanCollide = false
                        v.Humanoid.WalkSpeed = 0
                        topos(v.HumanoidRootPart.CFrame * CFrame.new(0, 30, 0))
                        repeat task.wait() until not Config.AutoGetCDK or not v.Parent or v.Humanoid.Health <= 0
                    end
                end
            else
                topos(CFrame.new(-12318.193, 601.951, -6538.662))
                task.wait(0.5)
                topos(Workspace.Map.Turtle.Cursed.BossDoor.CFrame)
            end
        end)
    end
end)

-- ==================== AUTO SKULL GUITAR ====================
spawn(function()
    while task.wait() do
        if Config.AutoSkullGuitar then
            pcall(function()
                local player = LocalPlayer
                local hrp = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
                if hrp then
                    local targetPos = Vector3.new(-9681.458, 6.139, 6341.372)
                    if (targetPos - hrp.Position).Magnitude <= 5000 then
                        local skeletonMachine = Workspace.NPCs:FindFirstChild("Skeleton Machine")
                        if skeletonMachine then
                            SafeInvoke("soulGuitarBuy", true)
                        else
                            local hauntedCastle = Workspace.Map:FindFirstChild("Haunted Castle")
                            if hauntedCastle and hauntedCastle.Candle1.Transparency == 0 then
                                local placard1 = hauntedCastle:FindFirstChild("Placard1")
                                if placard1 and placard1.Left.Part.Transparency == 0 then
                                    topos(CFrame.new(-8762.691, 176.847, 6171.308))
                                    task.wait(1)
                                    for i = 7, 1, -1 do
                                        local placard = hauntedCastle:FindFirstChild("Placard" .. i)
                                        if placard and placard:FindFirstChild("Left") and placard.Left:FindFirstChild("ClickDetector") then
                                            fireclickdetector(placard.Left.ClickDetector)
                                            task.wait(0.5)
                                        end
                                    end
                                end
                            elseif hauntedCastle and hauntedCastle.Tablet and hauntedCastle.Tablet:FindFirstChild("Segment1") then
                                local labPuzzle = hauntedCastle:FindFirstChild("Lab Puzzle")
                                if labPuzzle and labPuzzle.ColorFloor.Model.Part1:FindFirstChild("ClickDetector") then
                                    topos(CFrame.new(-9553.599, 65.623, 6041.588))
                                    task.wait(1)
                                    local partsToClick = {3, 4, 4, 4, 6, 6, 8, 10, 10, 10}
                                    for _, num in ipairs(partsToClick) do
                                        local part = labPuzzle.ColorFloor.Model:FindFirstChild("Part" .. num)
                                        if part and part:FindFirstChild("ClickDetector") then
                                            topos(part.CFrame)
                                            task.wait(1)
                                            fireclickdetector(part.ClickDetector)
                                            task.wait(0.5)
                                        end
                                    end
                                end
                            else
                                local ghost = Workspace.NPCs:FindFirstChild("Ghost")
                                if ghost then SafeInvoke("GuitarPuzzleProgress", "Ghost") end
                                local enemies = Workspace.Enemies
                                if enemies and enemies:FindFirstChild("Living Zombie") then
                                    for _, enemy in pairs(enemies:GetChildren()) do
                                        if enemy:FindFirstChild("HumanoidRootPart") and enemy:FindFirstChild("Humanoid") and enemy.Humanoid.Health > 0 and enemy.Name == "Living Zombie" then
                                            AutoHaki()
                                            EquipWeapon(Config.SelectWeapon)
                                            enemy.HumanoidRootPart.Size = Vector3.new(60, 60, 60)
                                            enemy.HumanoidRootPart.Transparency = 1
                                            enemy.Humanoid.JumpPower = 0
                                            enemy.Humanoid.WalkSpeed = 0
                                            enemy.HumanoidRootPart.CanCollide = false
                                            enemy.HumanoidRootPart.CFrame = hrp.CFrame * CFrame.new(0, 20, 0)
                                            topos(CFrame.new(-10160.787, 138.662, 5955.031))
                                            task.wait(0.5)
                                        end
                                    end
                                else topos(CFrame.new(-10160.787, 138.662, 5955.031)) end
                            end
                        end
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO BUY LEGENDARY SWORD ====================
spawn(function()
    local lastCallTime = 0
    while task.wait(1) do
        if Config.AutoBuyLegendarySword and World2 then
            local currentTime = tick()
            if currentTime - lastCallTime >= 2 then
                lastCallTime = currentTime
                pcall(function()
                    SafeInvoke("LegendarySwordDealer", "1")
                    SafeInvoke("LegendarySwordDealer", "2")
                    SafeInvoke("LegendarySwordDealer", "3")
                end)
            end
        end
    end
end)

-- ==================== AUTO BUY HAKI COLOR ====================
spawn(function()
    local lastCallTime = 0
    while true do
        if Config.Auto_Buy_Enchancement then
            local currentTime = tick()
            if currentTime - lastCallTime >= 2 then
                lastCallTime = currentTime
                pcall(function() SafeInvoke("ColorsDealer", "2") end)
            end
        end
        wait(0.1)
    end
end)

-- ==================== AUTO STATS ====================
spawn(function()
    while true do
        wait(0.5)
        if Config.AutoStats then
            local player = LocalPlayer
            if player and player:FindFirstChild("Data") and player.Data:FindFirstChild("Points") then
                if player.Data.Points.Value >= PointStats then
                    local statTypes = {Melee = "Melee", Defense = "Defense", Sword = "Sword", Gun = "Gun", Fruits = "Demon Fruit"}
                    local selectedStat = statTypes[StatsMode]
                    if selectedStat then SafeInvoke("AddPoint", selectedStat, PointStats) end
                end
            end
        end
    end
end)

-- ==================== AUTO FRUIT ====================
spawn(function()
    while task.wait(.1) do
        pcall(function()
            if Config.AutoGetFruit then
                local fruits = {"Rocket-Rocket", "Spin-Spin", "Chop-Chop", "Spring-Spring", "Bomb-Bomb", "Smoke-Smoke", "Spike-Spike", "Flame-Flame", "Falcon-Falcon", "Ice-Ice", "Sand-Sand", "Dark-Dark", "Ghost-Ghost", "Diamond-Diamond", "Light-Light", "Rubber-Rubber", "Barrier-Barrier"}
                for _, fruit in ipairs(fruits) do
                    SafeInvoke("LoadFruit", fruit)
                end
            end
        end)
    end
end)

-- ==================== AUTO STORE FRUIT ====================
spawn(function()
    while task.wait(0.2) do
        if Config.AutoStoreFruit then
            pcall(function()
                local character = LocalPlayer.Character
                local backpack = LocalPlayer.Backpack
                local fruits = {
                    {"Rocket Fruit", "Rocket-Rocket"}, {"Spin Fruit", "Spin-Spin"}, {"Blade Fruit", "Blade-Blade"},
                    {"Spring Fruit", "Spring-Spring"}, {"Bomb Fruit", "Bomb-Bomb"}, {"Smoke Fruit", "Smoke-Smoke"},
                    {"Spike Fruit", "Spike-Spike"}, {"Flame Fruit", "Flame-Flame"}, {"Falcon Fruit", "Falcon-Falcon"},
                    {"Ice Fruit", "Ice-Ice"}, {"Sand Fruit", "Sand-Sand"}, {"Dark Fruit", "Dark-Dark"},
                    {"Diamond Fruit", "Diamond-Diamond"}, {"Light Fruit", "Light-Light"}, {"Rubber Fruit", "Rubber-Rubber"},
                    {"Barrier Fruit", "Barrier-Barrier"}, {"Ghost Fruit", "Ghost-Ghost"}, {"Magma Fruit", "Magma-Magma"},
                    {"Quake Fruit", "Quake-Quake"}, {"Buddha Fruit", "Buddha-Buddha"}, {"Love Fruit", "Love-Love"},
                    {"Spider Fruit", "Spider-Spider"}, {"Sound Fruit", "Sound-Sound"}, {"Phoenix Fruit", "Phoenix-Phoenix"},
                    {"Portal Fruit", "Portal-Portal"}, {"Rumble Fruit", "Rumble-Rumble"}, {"Pain Fruit", "Pain-Pain"},
                    {"Blizzard Fruit", "Blizzard-Blizzard"}, {"Gravity Fruit", "Gravity-Gravity"}, {"Mammoth Fruit", "Mammoth-Mammoth"},
                    {"T-Rex Fruit", "T-Rex-T-Rex"}, {"Dough Fruit", "Dough-Dough"}, {"Shadow Fruit", "Shadow-Shadow"},
                    {"Venom Fruit", "Venom-Venom"}, {"Gas Fruit", "Gas-Gas"}, {"Control Fruit", "Control-Control"},
                    {"Spirit Fruit", "Spirit-Spirit"}, {"Leopard Fruit", "Leopard-Leopard"}, {"Yeti Fruit", "Yeti-Yeti"},
                    {"Kitsune Fruit", "Kitsune-Kitsune"}, {"Dragon Fruit", "Dragon-Dragon"},
                }
                for _, fruit in ipairs(fruits) do
                    local fruitName, serverName = fruit[1], fruit[2]
                    if character:FindFirstChild(fruitName) or backpack:FindFirstChild(fruitName) then
                        SafeInvoke("StoreFruit", serverName, backpack:FindFirstChild(fruitName))
                    end
                end
            end)
        end
        task.wait(0.1)
    end
end)

-- ==================== AUTO BUY FRUIT SNIPER ====================
spawn(function()
    pcall(function()
        while task.wait(1) do
            if Config.AutoBuyFruitSniper then
                SafeInvoke("GetFruits")
                SafeInvoke("PurchaseRawFruit", Config.SelectFruit)
            end
        end
    end)
end)

-- ==================== AUTO RANDOM FRUIT ====================
spawn(function()
    while task.wait(0.2) do
        if Config.RandomFruit then SafeInvoke("Cousin", "Buy") end
    end
end)

-- ==================== AUTO AWAKEN ====================
spawn(function()
    pcall(function()
        while wait(1) do
            if Config.AutoAwaken then
                SafeInvoke("Awakener", "Check")
                SafeInvoke("Awakener", "Awaken")
            end
        end
    end)
end)

-- ==================== AUTO UPGRADE RACE V2 ====================
spawn(function()
    pcall(function()
        while task.wait(0.2) do
            if not Config.AutoUpgradeRaceV2 or not World2 then continue end
            local player = LocalPlayer
            local humanoidRootPart = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
            local backpack = player.Backpack
            local raceData = player.Data.Race
            if raceData:FindFirstChild("Evolved") then continue end
            local alchemistStatus = SafeInvoke("Alchemist", "1")
            if alchemistStatus == 0 then
                local targetPos = CFrame.new(-2779.83521, 72.9661407, -3574.02002)
                if humanoidRootPart and (targetPos.Position - humanoidRootPart.Position).Magnitude > 4 then topos(targetPos)
                else
                    task.wait(1.1)
                    SafeInvoke("Alchemist", "2")
                end
            elseif alchemistStatus == 1 then
                if not (backpack:FindFirstChild("Flower 1") or player.Character:FindFirstChild("Flower 1")) then
                    topos(Workspace.Flower1.CFrame)
                elseif not (backpack:FindFirstChild("Flower 2") or player.Character:FindFirstChild("Flower 2")) then
                    topos(Workspace.Flower2.CFrame)
                elseif not (backpack:FindFirstChild("Flower 3") or player.Character:FindFirstChild("Flower 3")) then
                    local zombie = Workspace.Enemies:FindFirstChild("Zombie")
                    if zombie then
                        for _, v in pairs(Workspace.Enemies:GetChildren()) do
                            if v.Name == "Zombie" and v:FindFirstChild("HumanoidRootPart") and v:FindFirstChild("Humanoid") then
                                repeat
                                    task.wait()
                                    EquipWeapon(Config.SelectWeapon)
                                    AutoHaki()
                                    topos(v.HumanoidRootPart.CFrame * Pos)
                                    v.HumanoidRootPart.CanCollide = false
                                    v.HumanoidRootPart.Size = Vector3.new(50, 50, 50)
                                until backpack:FindFirstChild("Flower 3") or v.Humanoid.Health <= 0 or not v.Parent or not Config.AutoUpgradeRaceV2
                            end
                        end
                    else topos(CFrame.new(-5685.923, 48.48, -853.237)) end
                end
            elseif alchemistStatus == 2 then
                SafeInvoke("Alchemist", "3")
            end
        end
    end)
end)

-- ==================== AUTO CYBORG ====================
spawn(function()
    pcall(function()
        while task.wait(0.5) do
            if Config.AutoCyborg then
                if not LocalPlayer.Character:FindFirstChild("Microchip") and not LocalPlayer.Backpack:FindFirstChild("Microchip") and not Workspace.Enemies:FindFirstChild("Order") and not ReplicatedStorage:FindFirstChild("Order") then
                    wait(0.3)
                    SafeInvoke("BlackbeardReward", "Microchip", "1")
                    SafeInvoke("BlackbeardReward", "Microchip", "2")
                end
            end
        end
    end)
end)

spawn(function()
    pcall(function()
        while task.wait(0.5) do
            if Config.AutoCyborg then
                if not Workspace.Enemies:FindFirstChild("Order") and not ReplicatedStorage:FindFirstChild("Order") then
                    if LocalPlayer.Character:FindFirstChild("Microchip") or LocalPlayer.Backpack:FindFirstChild("Microchip") then
                        fireclickdetector(Workspace.Map.CircleIsland.RaidSummon.Button.Main.ClickDetector)
                    end
                end
                if ReplicatedStorage:FindFirstChild("Order") or Workspace.Enemies:FindFirstChild("Order") then
                    if Workspace.Enemies:FindFirstChild("Order") then
                        for _, i in pairs(Workspace.Enemies:GetChildren()) do
                            if i.Name == "Order" then
                                repeat
                                    task.wait(0.1)
                                    AutoHaki()
                                    EquipWeapon(Config.SelectWeapon)
                                    topos(i.HumanoidRootPart.CFrame * Pos)
                                    i.HumanoidRootPart.CanCollide = false
                                    i.HumanoidRootPart.Size = Vector3.new(120, 120, 120)
                                until not i.Parent or i.Humanoid.Health <= 0 or Config.AutoCyborg == false
                            end
                        end
                    elseif ReplicatedStorage:FindFirstChild("Order") then
                        topos(CFrame.new(-6217.2021484375, 28.047645568848, -5053.1357421875))
                    end
                end
            end
        end
    end)
end)

-- ==================== AUTO GHOUL ====================
spawn(function()
    while task.wait(0.1) do
        if not Config.AutoGhoul then break end
        local enemies = Workspace.Enemies
        local cursedCaptain = enemies:FindFirstChild("Cursed Captain")
        if cursedCaptain and cursedCaptain:FindFirstChild("Humanoid") and cursedCaptain:FindFirstChild("HumanoidRootPart") then
            local humanoid = cursedCaptain.Humanoid
            local rootPart = cursedCaptain.HumanoidRootPart
            if humanoid.Health > 0 then
                rootPart.CanCollide = false
                humanoid.WalkSpeed = 0
                rootPart.Size = Vector3.new(50, 50, 50)
                repeat
                    task.wait(0.05)
                    AutoHaki()
                    EquipWeapon(Config.SelectWeapon)
                    topos(rootPart.CFrame * CFrame.new(0, 10, 0))
                until not Config.AutoGhoul or humanoid.Health <= 0 or not cursedCaptain.Parent
            end
        else
            local storageCaptain = ReplicatedStorage:FindFirstChild("Cursed Captain")
            if storageCaptain then topos(storageCaptain.HumanoidRootPart.CFrame * CFrame.new(5, 10, 2)) end
        end
    end
end)

-- ==================== AUTO SEA EVENT ====================
function CheckSeaBeast()
    local seaBeasts = Workspace:FindFirstChild("SeaBeasts")
    if not seaBeasts then return false end
    for _, beast in ipairs(seaBeasts:GetChildren()) do
        local humanoid = beast:FindFirstChild("Humanoid")
        local rootPart = beast:FindFirstChild("HumanoidRootPart")
        if humanoid and rootPart and humanoid.Health > 0 then return true end
    end
    return false
end

function CheckShark()
    local enemies = Workspace:FindFirstChild("Enemies")
    local rootPart = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
    if not (enemies and rootPart) then return false end
    for _, v in pairs(enemies:GetChildren()) do
        local humanoid = v:FindFirstChild("Humanoid")
        local enemyRoot = v:FindFirstChild("HumanoidRootPart")
        if v.Name == "Shark" and humanoid and enemyRoot and humanoid.Health > 0 then
            if (enemyRoot.Position - rootPart.Position).Magnitude <= 200 then return true end
        end
    end
    return false
end

function CheckPiranha()
    local enemies = Workspace:FindFirstChild("Enemies")
    local rootPart = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
    if not (enemies and rootPart) then return false end
    for _, v in pairs(enemies:GetChildren()) do
        local humanoid = v:FindFirstChild("Humanoid")
        local enemyRoot = v:FindFirstChild("HumanoidRootPart")
        if v.Name == "Piranha" and humanoid and enemyRoot and humanoid.Health > 0 then
            if (enemyRoot.Position - rootPart.Position).Magnitude <= 200 then return true end
        end
    end
    return false
end

spawn(function()
    while task.wait(0.1) do
        pcall(function()
            local char = LocalPlayer.Character
            local root = char and char:FindFirstChild("HumanoidRootPart")
            if not root then return end
            local enemies = Workspace.Enemies:GetChildren()
            if Config.AutoKillShark and World3 then
                for _, v in pairs(enemies) do
                    if v.Name == "Shark" and v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                        if (v.HumanoidRootPart.Position - root.Position).Magnitude <= 500 then
                            repeat
                                task.wait(0.1)
                                AutoHaki()
                                EquipWeapon(Config.SelectWeapon)
                                v.HumanoidRootPart.Size = Vector3.new(50, 50, 50)
                                v.HumanoidRootPart.CanCollide = false
                                topos(v.HumanoidRootPart.CFrame * Pos)
                            until not Config.AutoKillShark or not v.Parent or v.Humanoid.Health <= 0
                        end
                    end
                end
            end
            if Config.AutoKillPiranha and World3 then
                for _, v in pairs(enemies) do
                    if v.Name == "Piranha" and v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                        if (v.HumanoidRootPart.Position - root.Position).Magnitude <= 500 then
                            repeat
                                task.wait(0.1)
                                AutoHaki()
                                EquipWeapon(Config.SelectWeapon)
                                v.HumanoidRootPart.Size = Vector3.new(50, 50, 50)
                                v.HumanoidRootPart.CanCollide = false
                                topos(v.HumanoidRootPart.CFrame * Pos)
                            until not Config.AutoKillPiranha or not v.Parent or v.Humanoid.Health <= 0
                        end
                    end
                end
            end
            if Config.AutoKillFishCrew and World3 then
                for _, v in pairs(enemies) do
                    if v.Name == "Fish Crew Member" and v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                        if (v.HumanoidRootPart.Position - root.Position).Magnitude <= 500 then
                            repeat
                                task.wait(0.1)
                                AutoHaki()
                                EquipWeapon(Config.SelectWeapon)
                                v.HumanoidRootPart.Size = Vector3.new(50, 50, 50)
                                v.HumanoidRootPart.CanCollide = false
                                topos(v.HumanoidRootPart.CFrame * Pos)
                                MonFarm = v.Name
                                PosMon = v.HumanoidRootPart.CFrame
                            until not Config.AutoKillFishCrew or not v.Parent or v.Humanoid.Health <= 0
                        end
                    end
                end
            end
            if Config.AutoTerrorshark and World3 then
                for _, v in pairs(enemies) do
                    if v.Name == "Terrorshark" and v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                        repeat
                            task.wait(0.1)
                            AutoHaki()
                            EquipWeapon(Config.SelectWeapon)
                            v.HumanoidRootPart.CanCollide = false
                            v.Humanoid.WalkSpeed = 0
                            v.HumanoidRootPart.Size = Vector3.new(60, 60, 60)
                            if char.Humanoid.Health < 2000 then
                                topos(v.HumanoidRootPart.CFrame * CFrame.new(0, 300, 0))
                                task.wait(1)
                            else
                                topos(v.HumanoidRootPart.CFrame * CFrame.new(0, 55, 0))
                            end
                        until not Config.AutoTerrorshark or not v.Parent or v.Humanoid.Health <= 0
                    end
                end
            end
        end)
    end
end)

task.spawn(function()
    while task.wait(0.5) do
        if Config.AutoSeaBest then
            pcall(function()
                if Workspace:FindFirstChild("SeaBeasts") then
                    for _, v in pairs(Workspace.SeaBeasts:GetChildren()) do
                        if CheckSeaBeast() then
                            repeat
                                wait()
                                local CFrameSeaBeast = v.HumanoidRootPart.CFrame * CFrame.new(0, 400, 0)
                                topos(CFrameSeaBeast)
                            until not Config.AutoSeaBest or not v:FindFirstChild("Humanoid") or not v:FindFirstChild("HumanoidRootPart") or v.Humanoid.Health < 0 or not v.Parent
                        end
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO FROZEN DIMENSION ====================
task.spawn(function()
    while task.wait(1) do
        pcall(function()
            if Config.AutoFrozenDimension and World3 then
                local frozenDim = Workspace.Map:FindFirstChild("FrozenDimension")
                if frozenDim then
                    local targetPos = frozenDim.Center.Position
                    local playerPos = LocalPlayer.Character.HumanoidRootPart.Position
                    if (playerPos - Vector3.new(targetPos.X, 500, targetPos.Z)).Magnitude > 10 then
                        topos(CFrame.new(targetPos.X, 500, targetPos.Z))
                    end
                end
            end
        end)
    end
end)

-- ==================== AUTO KILL LEVIATHAN ====================
task.spawn(function()
    while task.wait(0.5) do
        if Config.KillLevi and World3 then
            pcall(function()
                for _, v in pairs(Workspace.SeaBeasts:GetChildren()) do
                    if v.Name == "Leviathan" and v:FindFirstChild("HumanoidRootPart") then
                        repeat
                            task.wait(0.2)
                            if (LocalPlayer.Character.HumanoidRootPart.Position - v.HumanoidRootPart.Position).Magnitude > 10 then
                                topos(v.HumanoidRootPart.CFrame * CFrame.new(0, 500, 0))
                            end
                            AutoHaki()
                            EquipWeapon(Config.SelectWeapon)
                        until not v:FindFirstChild("HumanoidRootPart") or not Config.KillLevi
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO KITSUNE ====================
spawn(function()
    while wait() do
        if Config.TeleportMigare and World3 then
            local island = Workspace.Map:FindFirstChild("MysticIsland")
            if island and island:FindFirstChild("Center") then
                local targetPos = island.Center.Position
                local currentPos = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart") and LocalPlayer.Character.HumanoidRootPart.Position
                if currentPos and (Vector3.new(targetPos.X, 500, targetPos.Z) - currentPos).Magnitude > 5 then
                    topos(CFrame.new(targetPos.X, 500, targetPos.Z))
                end
            end
        end
    end
end)

spawn(function()
    while task.wait(0.6) do
        if Config.SummonKitsume and World3 then
            pcall(function()
                local net = ReplicatedStorage:FindFirstChild("Modules") and ReplicatedStorage.Modules:FindFirstChild("Net")
                local prayFunction = net and net:FindFirstChild("RF/KitsuneStatuePray")
                if prayFunction then prayFunction:InvokeServer() end
            end)
        end
    end
end)

task.spawn(function()
    while task.wait(1) do
        if Config.CollectAzure then
            pcall(function()
                local attachedAzure = Workspace:FindFirstChild("AttachedAzureEmber")
                local emberTemplate = Workspace:FindFirstChild("EmberTemplate")
                if attachedAzure and emberTemplate then
                    local part = emberTemplate:FindFirstChild("Part")
                    if part then
                        local playerPos = LocalPlayer.Character.HumanoidRootPart.Position
                        if (playerPos - part.Position).Magnitude > 10 then topos(part.CFrame) end
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO VOLCANO ====================
spawn(function()
    while wait(0.1) do
        if Config.AutoDefendVolcano then
            pcall(function()
                AutoHaki()
                local prehistoricIsland = Workspace.Map:FindFirstChild("PrehistoricIsland")
                if prehistoricIsland then
                    for _, obj in pairs(prehistoricIsland:GetDescendants()) do
                        if obj:IsA("Part") and obj.Name:lower():find("lava") then obj:Destroy() end
                        if obj:IsA("MeshPart") and obj.Name:lower():find("lava") then obj:Destroy() end
                    end
                    local volcanoRocks = prehistoricIsland.Core:FindFirstChild("VolcanoRocks")
                    if volcanoRocks then
                        for _, model in pairs(volcanoRocks:GetChildren()) do
                            if model:IsA("Model") then
                                local rock = model:FindFirstChild("volcanorock")
                                if rock and rock:IsA("MeshPart") then
                                    if rock.Color == Color3.fromRGB(185, 53, 56) or rock.Color == Color3.fromRGB(185, 53, 57) then
                                        topos(CFrame.new(rock.Position))
                                        break
                                    end
                                end
                            end
                        end
                    end
                end
            end)
        end
    end
end)

-- ==================== AUTO COLLECT EGG ====================
spawn(function()
    while wait(0.1) do
        if Config.CollectEgg and World3 and Workspace:FindFirstChild("Map") and Workspace.Map:FindFirstChild("PrehistoricIsland") and Workspace.Map.PrehistoricIsland.Core:FindFirstChild("SpawnedDragonEggs") then
            local eggs = Workspace.Map.PrehistoricIsland.Core.SpawnedDragonEggs:GetChildren()
            if #eggs > 0 then
                local targetEgg = eggs[math.random(1, #eggs)]
                if targetEgg:IsA("Model") and targetEgg.PrimaryPart then
                    topos(targetEgg.PrimaryPart.CFrame)
                    task.wait(0.5)
                    VirtualInputManager:SendKeyEvent(true, "E", false, game)
                    wait(1)
                    VirtualInputManager:SendKeyEvent(false, "E", false, game)
                end
            end
        end
    end
end)

-- ==================== AUTO COLLECT FIRE FLOWER ====================
spawn(function()
    while wait() do
        if Config.AutoCollectFireFlowers then
            local fireFlowers = Workspace:FindFirstChild("FireFlowers")
            if fireFlowers then
                for _, v in pairs(fireFlowers:GetChildren()) do
                    if v:IsA("Model") and v.PrimaryPart then
                        local distance = (v.PrimaryPart.Position - LocalPlayer.Character.HumanoidRootPart.Position).Magnitude
                        if distance <= 1 then
                            VirtualInputManager:SendKeyEvent(true, "E", false, game)
                            wait(1.5)
                            VirtualInputManager:SendKeyEvent(false, "E", false, game)
                        else
                            topos(CFrame.new(v.PrimaryPart.Position))
                        end
                    end
                end
            end
        end
    end
end)

-- ==================== AUTO DOJO QUEST ====================
local DojoQuestNpc = CFrame.new(5855.19629, 1208.32178, 872.713501, 0.606994748, -1.81058823e-09, -0.794705868, 5.72712722e-09, 1, 2.09605577e-09, 0.794705868, -5.82367621e-09, 0.606994748)
spawn(function()
    while task.wait(0.2) do
        if Config.DojoClaimQuest and World3 then
            pcall(function()
                if BypassTP then BTP(DojoQuestNpc)
                else topos(DojoQuestNpc) end
                if (DojoQuestNpc.Position - LocalPlayer.Character.HumanoidRootPart.Position).Magnitude <= 5 then
                    ReplicatedStorage.Modules.Net["RF/InteractDragonQuest"]:InvokeServer({["NPC"] = "Dojo Trainer", ["Command"] = "ClaimQuest"})
                    task.wait(1)
                    ReplicatedStorage.Modules.Net["RF/InteractDragonQuest"]:InvokeServer({["NPC"] = "Dojo Trainer", ["Command"] = "RequestQuest"})
                end
            end)
        end
    end
end)

-- ==================== AUTO UPGRADE DRAGON TALON ====================
spawn(function()
    while task.wait(0.2) do
        if Config.AutoUpgradeDragonTalon and World3 then
            local UzothNPC = CFrame.new(5661.89014, 1211.31909, 864.836731, 0.811413169, -1.36805838e-08, -0.584473014, 4.75227395e-08, 1, 4.25682458e-08, 0.584473014, -6.23161966e-08, 0.811413169)
            if (UzothNPC.Position - LocalPlayer.Character.HumanoidRootPart.Position).Magnitude > 5 then
                topos(UzothNPC)
            else
                ReplicatedStorage.Modules.Net["RF/InteractDragonQuest"]:InvokeServer({["NPC"] = "Uzoth", ["Command"] = "Upgrade"})
            end
        end
    end
end)

-- ==================== AUTO BLAZE EMBER ====================
spawn(function()
    while task.wait(0.2) do
        if Config.BlazeEmberFarm and World3 then
            pcall(function()
                local enemies = Workspace.Enemies
                if enemies:FindFirstChild("Ghost") or enemies:FindFirstChild("Hydra Enforcer") or enemies:FindFirstChild("Venomous Assailant") then
                    for _, v in pairs(enemies:GetChildren()) do
                        if v.Name == "Hydra Enforcer" or v.Name == "Venomous Assailant" then
                            if v:FindFirstChild("Humanoid") and v:FindFirstChild("HumanoidRootPart") and v.Humanoid.Health > 0 then
                                repeat
                                    RunService.Heartbeat:wait()
                                    AutoHaki()
                                    EquipWeapon(Config.SelectWeapon)
                                    topos(v.HumanoidRootPart.CFrame * Pos)
                                    v.HumanoidRootPart.CanCollide = false
                                    v.HumanoidRootPart.Size = Vector3.new(60, 60, 60)
                                until not Config.BlazeEmberFarm or v.Humanoid.Health <= 0
                            end
                        end
                    end
                else
                    topos(CFrame.new(5394.36475, 1082.71057, 561.993958))
                end
            end)
        end
    end
end)

-- ==================== AUTO GET MELEE ====================
spawn(function()
    pcall(function()
        while task.wait(0.1) do
            if GetMode == "Superhuman" and Config.AutoGetMelee and World2 then
                local player = LocalPlayer
                local backpack = player.Backpack
                local character = player.Character
                local beli = player.Data.Beli.Value
                local fragments = player.Data.Fragments and player.Data.Fragments.Value or 0
                if (backpack:FindFirstChild("Combat") or character:FindFirstChild("Combat")) and beli >= 150000 then
                    UnEquipWeapon("Combat")
                    task.wait(0.1)
                    SafeInvoke("BuyBlackLeg")
                end
                if backpack:FindFirstChild("Superhuman") or character:FindFirstChild("Superhuman") then
                    Config.SelectWeapon = "Superhuman"
                end
                local meleeWeapons = {
                    {"Black Leg", 300, "BuyElectro", 300000},
                    {"Electro", 300, "BuyFishmanKarate", 750000},
                    {"Fishman Karate", 300, "DragonClaw", 1500, "BlackbeardReward"},
                    {"Dragon Claw", 300, "BuySuperhuman", 3000000}
                }
                for _, weaponData in ipairs(meleeWeapons) do
                    local weaponName = weaponData[1]
                    local levelRequirement = weaponData[2]
                    local purchaseAction = weaponData[3]
                    local cost = weaponData[4]
                    local isFragment = weaponData[5] == "BlackbeardReward"
                    local weapon = backpack:FindFirstChild(weaponName) or character:FindFirstChild(weaponName)
                    if weapon then
                        if weapon.Level.Value < levelRequirement then
                            Config.SelectWeapon = weaponName
                        elseif weapon.Level.Value >= levelRequirement and ((isFragment and fragments >= cost) or (not isFragment and beli >= cost)) then
                            UnEquipWeapon(weaponName)
                            task.wait(0.1)
                            if isFragment then
                                SafeInvoke(purchaseAction, "DragonClaw", "1")
                                SafeInvoke(purchaseAction, "DragonClaw", "2")
                            else
                                SafeInvoke(purchaseAction)
                            end
                        end
                    end
                end
            end
        end
    end)
end)

-- ==================== AUTO STATS ====================
spawn(function()
    while true do
        wait(0.5)
        if Config.AutoStats then
            local player = LocalPlayer
            if player and player:FindFirstChild("Data") and player.Data:FindFirstChild("Points") then
                if player.Data.Points.Value >= PointStats then
                    local statTypes = {Melee = "Melee", Defense = "Defense", Sword = "Sword", Gun = "Gun", Fruits = "Demon Fruit"}
                    local selectedStat = statTypes[StatsMode]
                    if selectedStat then SafeInvoke("AddPoint", selectedStat, PointStats) end
                end
            end
        end
    end
end)

-- ==================== AUTO CLICK ====================
task.spawn(function()
    while wait(0.01) do
        if Config.AutoClick then
            VirtualUser:Button1Down(Vector2.new(0, 0), Camera.CFrame)
            VirtualUser:Button1Up(Vector2.new(0, 0), Camera.CFrame)
        end
    end
end)

-- ==================== FAST ATTACK ====================
function GetEnemiesInRange(character, range)
    local enemies = Workspace.Enemies:GetChildren()
    local players = Players:GetPlayers()
    local targets = {}
    local playerPos = character:GetPivot().Position
    for _, enemy in ipairs(enemies) do
        local rootPart = enemy:FindFirstChild("HumanoidRootPart")
        local humanoid = enemy:FindFirstChild("Humanoid")
        if rootPart and humanoid and humanoid.Health > 0 then
            local distance = (rootPart.Position - playerPos).Magnitude
            if distance <= range then table.insert(targets, enemy) end
        end
    end
    return targets
end

function AttackNoCoolDown()
    local character = LocalPlayer.Character
    if not character then return end
    local equippedWeapon
    for _, item in ipairs(character:GetChildren()) do
        if item:IsA("Tool") then equippedWeapon = item break end
    end
    if not equippedWeapon then return end
    local enemiesInRange = GetEnemiesInRange(character, 60)
    if equippedWeapon:FindFirstChild("LeftClickRemote") then
        local attackCount = 1
        for _, enemy in ipairs(enemiesInRange) do
            local rootPart = enemy:FindFirstChild("HumanoidRootPart")
            if rootPart then
                local direction = (rootPart.Position - character:GetPivot().Position).Unit
                equippedWeapon.LeftClickRemote:FireServer(direction, attackCount)
                attackCount = attackCount + 1
            end
        end
    else
        local targets, mainTarget = {}, nil
        for _, enemy in ipairs(enemiesInRange) do
            if not enemy:GetAttribute("IsBoat") then
                local head = enemy:FindFirstChild("Head")
                if head then
                    table.insert(targets, {enemy, head})
                    mainTarget = head
                end
            end
        end
        if mainTarget then
            local attackEvent = ReplicatedStorage:WaitForChild("Modules"):WaitForChild("Net"):WaitForChild("RE/RegisterAttack")
            local hitEvent = ReplicatedStorage:WaitForChild("Modules"):WaitForChild("Net"):WaitForChild("RE/RegisterHit")
            pcall(function()
                attackEvent:FireServer(0.1)
                hitEvent:FireServer(mainTarget, targets)
            end)
        end
    end
end

spawn(function()
    while task.wait(0.1) do
        if Config.FastAttack then pcall(AttackNoCoolDown) end
    end
end)

-- ==================== SPEED & JUMP ====================
spawn(function()
    while task.wait(0.1) do
        if Config.SpeedHack then
            local humanoid = LocalPlayer.Character and LocalPlayer.Character:FindFirstChildOfClass("Humanoid")
            if humanoid then
                humanoid.WalkSpeed = Config.WalkSpeed
                humanoid.JumpPower = Config.JumpPower
                humanoid.UseJumpPower = true
            end
        end
    end
end)

UserInputService.JumpRequest:Connect(function()
    if Config.InfiniteJump then
        local humanoid = LocalPlayer.Character and LocalPlayer.Character:FindFirstChildOfClass("Humanoid")
        if humanoid then humanoid:ChangeState(Enum.HumanoidStateType.Jumping) end
    end
end)

-- ==================== FLY ====================
local flyBodyVelocity = nil
local flyBodyGyro = nil

function StartFly()
    local root = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
    if not root then return end
    if flyBodyVelocity then flyBodyVelocity:Destroy() end
    if flyBodyGyro then flyBodyGyro:Destroy() end
    flyBodyVelocity = Instance.new("BodyVelocity")
    flyBodyVelocity.MaxForce = Vector3.new(math.huge, math.huge, math.huge)
    flyBodyVelocity.Velocity = Vector3.new(0, 0, 0)
    flyBodyVelocity.Parent = root
    flyBodyGyro = Instance.new("BodyGyro")
    flyBodyGyro.MaxTorque = Vector3.new(math.huge, math.huge, math.huge)
    flyBodyGyro.P = 1000
    flyBodyGyro.D = 50
    flyBodyGyro.CFrame = root.CFrame
    flyBodyGyro.Parent = root
end

function StopFly()
    if flyBodyVelocity then flyBodyVelocity:Destroy() flyBodyVelocity = nil end
    if flyBodyGyro then flyBodyGyro:Destroy() flyBodyGyro = nil end
end

RunService.RenderStepped:Connect(function()
    if Config.Fly and flyBodyVelocity and flyBodyGyro then
        local root = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
        if not root then return end
        local moveDir = Vector3.new(0, 0, 0)
        if UserInputService:IsKeyDown(Enum.KeyCode.W) then moveDir += Camera.CFrame.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.S) then moveDir -= Camera.CFrame.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.A) then moveDir -= Camera.CFrame.RightVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.D) then moveDir += Camera.CFrame.RightVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.Space) then moveDir += Vector3.new(0, 1, 0) end
        if UserInputService:IsKeyDown(Enum.KeyCode.LeftControl) then moveDir -= Vector3.new(0, 1, 0) end
        flyBodyVelocity.Velocity = moveDir * Config.FlySpeed
        flyBodyGyro.CFrame = Camera.CFrame
    end
end)

-- ==================== CHỐNG AFK ====================
LocalPlayer.Idled:Connect(function()
    if Config.AntiAFK then
        VirtualUser:Button2Down(Vector2.new(0, 0), Camera.CFrame)
        wait(1)
        VirtualUser:Button2Up(Vector2.new(0, 0), Camera.CFrame)
    end
end)

-- ==================== CHỐNG KICK ====================
LocalPlayer.OnTeleport:Connect(function()
    if Config.AntiKick then
        pcall(function()
            queue_on_teleport([[
                loadstring(game:HttpGet("https://raw.githubusercontent.com/nsmod/bloxfruits/main/script.lua"))()
            ]])
        end)
    end
end)

-- ==================== GIAO DIỆN NSMOD V6 ====================
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "NSMOD_UI_V6"
ScreenGui.Parent = CoreGui
ScreenGui.ResetOnSpawn = false

local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 800, 0, 850)
MainFrame.Position = UDim2.new(0.5, -400, 0.5, -425)
MainFrame.BackgroundColor3 = Color3.new(0.06, 0.06, 0.08)
MainFrame.BorderSizePixel = 0
MainFrame.Active = true
MainFrame.Draggable = true
MainFrame.Parent = ScreenGui

local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 10)
UICorner.Parent = MainFrame

local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(1, 0, 0, 50)
Title.BackgroundColor3 = Color3.new(0.25, 0, 0.4)
Title.Text = "NSMOD BLOX FRUITS V6 - FULL FEATURES"
Title.TextColor3 = Color3.new(1, 1, 1)
Title.TextScaled = true
Title.Font = Enum.Font.GothamBold
Title.Parent = MainFrame

local TitleCorner = Instance.new("UICorner")
TitleCorner.CornerRadius = UDim.new(0, 10)
TitleCorner.Parent = Title

local ScrollFrame = Instance.new("ScrollingFrame")
ScrollFrame.Size = UDim2.new(1, -20, 1, -65)
ScrollFrame.Position = UDim2.new(0, 10, 0, 55)
ScrollFrame.BackgroundTransparency = 1
ScrollFrame.CanvasSize = UDim2.new(0, 0, 0, 20000)
ScrollFrame.ScrollBarThickness = 6
ScrollFrame.Parent = MainFrame

local function CreateButton(text, y, callback, color)
    local btn = Instance.new("TextButton")
    btn.Size = UDim2.new(1, 0, 0, 35)
    btn.Position = UDim2.new(0, 0, 0, y)
    btn.BackgroundColor3 = color or Color3.new(0.15, 0.15, 0.2)
    btn.Text = text
    btn.TextColor3 = Color3.new(1, 1, 1)
    btn.TextScaled = true
    btn.Font = Enum.Font.Gotham
    btn.Parent = ScrollFrame
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 6)
    corner.Parent = btn
    btn.MouseButton1Click:Connect(callback)
    return btn
end

local function CreateLabel(text, y, color)
    local label = Instance.new("TextLabel")
    label.Size = UDim2.new(1, 0, 0, 30)
    label.Position = UDim2.new(0, 0, 0, y)
    label.BackgroundColor3 = color or Color3.new(0.25, 0, 0.4)
    label.Text = text
    label.TextColor3 = Color3.new(1, 1, 1)
    label.TextScaled = true
    label.Font = Enum.Font.GothamBold
    label.Parent = ScrollFrame
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 6)
    corner.Parent = label
    return label
end

local function CreateToggle(text, y, key, callback)
    local btn = Instance.new("TextButton")
    btn.Size = UDim2.new(1, 0, 0, 35)
    btn.Position = UDim2.new(0, 0, 0, y)
    btn.BackgroundColor3 = Config[key] and Color3.new(0.2, 0.5, 0.2) or Color3.new(0.3, 0.1, 0.1)
    btn.Text = text .. ": " .. (Config[key] and "BẬT" or "TẮT")
    btn.TextColor3 = Color3.new(1, 1, 1)
    btn.TextScaled = true
    btn.Font = Enum.Font.Gotham
    btn.Parent = ScrollFrame
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 6)
    corner.Parent = btn
    btn.MouseButton1Click:Connect(function()
        Config[key] = not Config[key]
        btn.BackgroundColor3 = Config[key] and Color3.new(0.2, 0.5, 0.2) or Color3.new(0.3, 0.1, 0.1)
        btn.Text = text .. ": " .. (Config[key] and "BẬT" or "TẮT")
        if callback then callback(Config[key]) end
    end)
    return btn
end

local y = 0

CreateLabel("=== FARM ===", y, Color3.new(0.25, 0, 0.4)) y = y + 35
CreateToggle("Auto Farm Level", y, "AutoFarm", function(v) StopTween(not v) end) y = y + 40
CreateToggle("Auto Farm Boss", y, "AutoFarmBoss") y = y + 40
CreateToggle("Auto Farm Chest", y, "AutoFarmChest") y = y + 40
CreateToggle("Auto Farm Quest", y, "AutoFarmQuest") y = y + 40
CreateToggle("Auto Farm Haki", y, "AutoFarmHaki") y = y + 40
CreateToggle("Auto Farm Observation", y, "AutoFarmObservation") y = y + 40
CreateToggle("Auto Farm Race V4", y, "AutoFarmRace") y = y + 40
CreateToggle("Auto Farm Mastery", y, "AutoFarmMastery") y = y + 40
CreateToggle("Auto Farm Money", y, "AutoFarmMoney") y = y + 40
CreateToggle("Auto Farm Fragments", y, "AutoFarmFragments") y = y + 40
CreateToggle("Auto Farm Fruit", y, "AutoFarmFruit") y = y + 40
CreateToggle("Auto Farm Bounty", y, "AutoFarmBounty") y = y + 40
CreateToggle("Auto Farm Honor", y, "AutoFarmHonor") y = y + 40
CreateToggle("Auto Farm Material", y, "AutoFarmMaterial") y = y + 40
CreateToggle("Auto Farm Bone", y, "AutoFarmBone") y = y + 40
CreateToggle("Auto Farm Katakuri", y, "AutoFarmKatakuri") y = y + 40
CreateToggle("Auto Kill All Boss", y, "AutoFarmAllBoss") y = y + 40
CreateToggle("Auto Fish", y, "AutoFish") y = y + 40

CreateLabel("=== CHIẾN ĐẤU ===", y, Color3.new(0.4, 0, 0)) y = y + 35
CreateToggle("Kill Aura", y, "KillAura") y = y + 40
CreateToggle("God Mode", y, "GodMode") y = y + 40
CreateToggle("Auto Dodge", y, "AutoDodge") y = y + 40
CreateToggle("Auto Skill", y, "AutoSkill") y = y + 40
CreateToggle("Auto Combo", y, "AutoCombo") y = y + 40
CreateToggle("Fast Attack", y, "FastAttack") y = y + 40
CreateToggle("Auto Click", y, "AutoClick") y = y + 40

CreateLabel("=== DI CHUYỂN ===", y, Color3.new(0, 0.25, 0.4)) y = y + 35
CreateToggle("Speed Hack", y, "SpeedHack") y = y + 40
CreateToggle("Infinite Jump", y, "InfiniteJump") y = y + 40
CreateToggle("NoClip", y, "NoClip") y = y + 40
CreateToggle("Fly", y, "Fly", function(v) if v then StartFly() else StopFly() end end) y = y + 40
CreateToggle("Bypass TP", y, "BypassTP", function(v) BypassTP = v end) y = y + 40

CreateLabel("=== HIỂN THỊ ===", y, Color3.new(0, 0.4, 0.4)) y = y + 35
CreateToggle("ESP Chest", y, "ESPChest") y = y + 40
CreateToggle("ESP Fruit", y, "ESPFruit") y = y + 40
CreateToggle("ESP Boss", y, "ESPBoss") y = y + 40
CreateToggle("ESP Player", y, "ESPPlayer") y = y + 40
CreateToggle("ESP Quest", y, "ESPQuest") y = y + 40
CreateToggle("ESP NPC", y, "ESPNPC") y = y + 40

CreateLabel("=== TỰ ĐỘNG NÂNG CAO ===", y, Color3.new(0.4, 0.25, 0)) y = y + 35
CreateToggle("Auto Buy", y, "AutoBuy") y = y + 40
CreateToggle("Auto Raid", y, "AutoRaid") y = y + 40
CreateToggle("Auto Sea Beast", y, "AutoSeaBeast") y = y + 40
CreateToggle("Auto Factory", y, "AutoFactory") y = y + 40
CreateToggle("Auto Pirate Raid", y, "AutoPirateRaid") y = y + 40
CreateToggle("Auto Cursed Ship", y, "AutoCursedShip") y = y + 40
CreateToggle("Auto Dough King", y, "AutoDoughKing") y = y + 40
CreateToggle("Auto Cake Queen", y, "AutoCakeQueen") y = y + 40
CreateToggle("Auto Soul Reaper", y, "AutoSoulReaper") y = y + 40
CreateToggle("Auto Hallow Scythe", y, "AutoHallowScythe") y = y + 40
CreateToggle("Auto Darkbeard", y, "AutoDarkbeard") y = y + 40
CreateToggle("Auto Rip Indra", y, "AutoRipIndra") y = y + 40
CreateToggle("Auto Elite Hunter", y, "AutoEliteHunter") y = y + 40
CreateToggle("Auto Observation V2", y, "AutoObservationV2") y = y + 40
CreateToggle("Auto Rainbow Haki", y, "AutoRainbowHaki") y = y + 40
CreateToggle("Auto Skull Guitar", y, "AutoSkullGuitar") y = y + 40
CreateToggle("Auto Get CDK", y, "AutoGetCDK") y = y + 40
CreateToggle("Auto Tushita", y, "AutoTushita") y = y + 40
CreateToggle("Auto Saber", y, "AutoSaber") y = y + 40
CreateToggle("Auto Yama", y, "AutoYama") y = y + 40
CreateToggle("Auto Cyborg", y, "AutoCyborg") y = y + 40
CreateToggle("Auto Ghoul", y, "AutoGhoul") y = y + 40
CreateToggle("Auto Upgrade Race V2", y, "AutoUpgradeRaceV2") y = y + 40
CreateToggle("Auto Buy Legendary Sword", y, "AutoBuyLegendarySword") y = y + 40
CreateToggle("Auto Buy Haki Color", y, "Auto_Buy_Enchancement") y = y + 40
CreateToggle("Auto Get Fruit", y, "AutoGetFruit") y = y + 40
CreateToggle("Auto Store Fruit", y, "AutoStoreFruit") y = y + 40
CreateToggle("Auto Buy Fruit Sniper", y, "AutoBuyFruitSniper") y = y + 40
CreateToggle("Random Fruit", y, "RandomFruit") y = y + 40
CreateToggle("Auto Awaken", y, "AutoAwaken") y = y + 40
CreateToggle("Auto Stats", y, "AutoStats") y = y + 40
CreateToggle("Anti AFK", y, "AntiAFK") y = y + 40
CreateToggle("Anti Kick", y, "AntiKick") y = y + 40

CreateLabel("=== SEA EVENT ===", y, Color3.new(0, 0.3, 0.5)) y = y + 35
CreateToggle("Auto Sea Event", y, "SailBoat", function(v) StopTween(not v) end) y = y + 40
CreateToggle("Auto Shark", y, "AutoKillShark") y = y + 40
CreateToggle("Auto Piranha", y, "AutoKillPiranha") y = y + 40
CreateToggle("Auto Fish Crew", y, "AutoKillFishCrew") y = y + 40
CreateToggle("Auto Terror Shark", y, "AutoTerrorshark") y = y + 40
CreateToggle("Auto Ghost Ship", y, "AutoGhostShip") y = y + 40
CreateToggle("Auto Pirate Brigade", y, "AutoPirateBrigade") y = y + 40
CreateToggle("Auto Pirate Grand Brigade", y, "AutoPirateGrandBrigade") y = y + 40
CreateToggle("Auto Frozen Dimension", y, "AutoFrozenDimension") y = y + 40
CreateToggle("Auto Kill Leviathan", y, "KillLevi") y = y + 40
CreateToggle("Auto Summon Kitsune", y, "SummonKitsume") y = y + 40
CreateToggle("Auto Collect Azure", y, "CollectAzure") y = y + 40
CreateToggle("Auto Trade Azure", y, "TradeAureEmber") y = y + 40
CreateToggle("Auto Defend Volcano", y, "AutoDefendVolcano") y = y + 40
CreateToggle("Auto Collect Egg", y, "CollectEgg") y = y + 40
CreateToggle("Auto Collect Fire Flower", y, "AutoCollectFireFlowers") y = y + 40
CreateToggle("Auto Upgrade Dragon Talon", y, "AutoUpgradeDragonTalon") y = y + 40
CreateToggle("Auto Quest Dojo", y, "DojoClaimQuest") y = y + 40
CreateToggle("Auto Blaze Ember", y, "BlazeEmberFarm") y = y + 40

CreateLabel("=== RACE EVENT ===", y, Color3.new(0.3, 0, 0.3)) y = y + 35
CreateToggle("Teleport Migare", y, "TeleportMigare") y = y + 40
CreateToggle("Teleport To Highest Point", y, "Tweentohighestpoint") y = y + 40
CreateToggle("Teleport To Gear", y, "TeleportToGear") y = y + 40
CreateToggle("Lock Moon And On Race V3", y, "LockMoonAndOnRaceV3") y = y + 40

-- Nút dịch chuyển Sea 1
CreateLabel("=== SEA 1 - ĐẢO ===", y, Color3.new(0.25, 0.1, 0.1)) y = y + 35
for name, pos in pairs(Islands[1]) do
    CreateButton("Dịch chuyển: " .. name, y, function()
        topos(CFrame.new(pos))
        Notify("NSMOD", "Đã dịch chuyển đến " .. name .. " (Sea 1)")
    end, Color3.new(0.12, 0.12, 0.2))
    y = y + 40
end

-- Nút dịch chuyển Sea 2
CreateLabel("=== SEA 2 - ĐẢO ===", y, Color3.new(0.1, 0.25, 0.1)) y = y + 35
for name, pos in pairs(Islands[2]) do
    CreateButton("Dịch chuyển: " .. name, y, function()
        topos(CFrame.new(pos))
        Notify("NSMOD", "Đã dịch chuyển đến " .. name .. " (Sea 2)")
    end, Color3.new(0.12, 0.2, 0.12))
    y = y + 40
end

-- Nút dịch chuyển Sea 3
CreateLabel("=== SEA 3 - ĐẢO ===", y, Color3.new(0.1, 0.1, 0.25)) y = y + 35
for name, pos in pairs(Islands[3]) do
    CreateButton("Dịch chuyển: " .. name, y, function()
        topos(CFrame.new(pos))
        Notify("NSMOD", "Đã dịch chuyển đến " .. name .. " (Sea 3)")
    end, Color3.new(0.12, 0.12, 0.2))
    y = y + 40
end

-- Nút Sea Travel
CreateLabel("=== SEA TRAVEL ===", y, Color3.new(0.3, 0.2, 0)) y = y + 35
CreateButton("Đến Sea 1 (Old World)", y, function()
    SafeInvoke("TravelMain")
    Notify("NSMOD", "Đang đến Sea 1...")
end, Color3.new(0.2, 0.15, 0.05)) y = y + 40
CreateButton("Đến Sea 2 (New World)", y, function()
    SafeInvoke("TravelDressrosa")
    Notify("NSMOD", "Đang đến Sea 2...")
end, Color3.new(0.2, 0.15, 0.05)) y = y + 40
CreateButton("Đến Sea 3 (Third Sea)", y, function()
    SafeInvoke("TravelZou")
    Notify("NSMOD", "Đang đến Sea 3...")
end, Color3.new(0.2, 0.15, 0.05)) y = y + 40

-- Nút Shop
CreateLabel("=== SHOP MEELE ===", y, Color3.new(0.2, 0.3, 0)) y = y + 35
CreateButton("Mua Black Leg", y, function() SafeInvoke("BuyBlackLeg") end) y = y + 40
CreateButton("Mua Fishman Karate", y, function() SafeInvoke("BuyFishmanKarate") end) y = y + 40
CreateButton("Mua Electro", y, function() SafeInvoke("BuyElectro") end) y = y + 40
CreateButton("Mua Dragon Breath", y, function() SafeInvoke("BlackbeardReward", "DragonClaw", "1") SafeInvoke("BlackbeardReward", "DragonClaw", "2") end) y = y + 40
CreateButton("Mua Superhuman", y, function() SafeInvoke("BuySuperhuman") end) y = y + 40
CreateButton("Mua Death Step", y, function() SafeInvoke("BuyDeathStep") end) y = y + 40
CreateButton("Mua Sharkman Karate", y, function() SafeInvoke("BuySharkmanKarate", true) wait(0.2) SafeInvoke("BuySharkmanKarate") end) y = y + 40
CreateButton("Mua Electric Claw", y, function() SafeInvoke("BuyElectricClaw") end) y = y + 40
CreateButton("Mua Dragon Talon", y, function() SafeInvoke("BuyDragonTalon") end) y = y + 40
CreateButton("Mua God Human", y, function() SafeInvoke("BuyGodhuman") end) y = y + 40
CreateButton("Mua Sanguine Art", y, function() SafeInvoke("BuySanguineArt", true) wait(0.2) SafeInvoke("BuySanguineArt") end) y = y + 40

CreateLabel("=== SHOP ABILITIES ===", y, Color3.new(0.3, 0.2, 0)) y = y + 35
CreateButton("Mua Skyjump [10K Beli]", y, function() SafeInvoke("BuyHaki", "Geppo") end) y = y + 40
CreateButton("Mua Buso Haki [25K Beli]", y, function() SafeInvoke("BuyHaki", "Buso") end) y = y + 40
CreateButton("Mua Observation Haki [750K Beli]", y, function() SafeInvoke("KenTalk", "Buy") end) y = y + 40
CreateButton("Mua Soru [100K Beli]", y, function() SafeInvoke("BuyHaki", "Soru") end) y = y + 40

CreateLabel("=== SHOP RACE ===", y, Color3.new(0.2, 0.2, 0.3)) y = y + 35
CreateButton("Mua Random Race (3000F)", y, function() SafeInvoke("BlackbeardReward", "Reroll", "1") SafeInvoke("BlackbeardReward", "Reroll", "2") end) y = y + 40
CreateButton("Mua Ghoul Race", y, function() SafeInvoke("Ectoplasm", "BuyCheck", 4) wait(0.5) SafeInvoke("Ectoplasm", "Change", 4) end) y = y + 40
CreateButton("Mua Cyborg Race (2500F)", y, function() SafeInvoke("CyborgTrainer", "Buy") end) y = y + 40

CreateLabel("=== SHOP OTHER ===", y, Color3.new(0.3, 0.3, 0.3)) y = y + 35
CreateButton("Mua Refund Stat (2500F)", y, function() SafeInvoke("BlackbeardReward", "Refund", "1") SafeInvoke("BlackbeardReward", "Refund", "2") end) y = y + 40

ScrollFrame.CanvasSize = UDim2.new(0, 0, 0, y + 100)

-- Nút thu nhỏ UI
local ToggleBtn = Instance.new("TextButton")
ToggleBtn.Size = UDim2.new(0, 50, 0, 50)
ToggleBtn.Position = UDim2.new(0, 10, 0.5, -25)
ToggleBtn.BackgroundColor3 = Color3.new(0.25, 0, 0.4)
ToggleBtn.Text = "UI"
ToggleBtn.TextColor3 = Color3.new(1, 1, 1)
ToggleBtn.TextScaled = true
ToggleBtn.Font = Enum.Font.GothamBold
ToggleBtn.Parent = ScreenGui
local ToggleCorner = Instance.new("UICorner")
ToggleCorner.CornerRadius = UDim.new(0, 10)
ToggleCorner.Parent = ToggleBtn
ToggleBtn.MouseButton1Click:Connect(function()
    Config.UIVisible = not Config.UIVisible
    MainFrame.Visible = Config.UIVisible
end)

-- ==================== PHÍM TẮT ====================
ContextActionService:BindAction("ToggleUI_NSMOD", function(_, state)
    if state == Enum.UserInputState.Begin then
        Config.UIVisible = not Config.UIVisible
        MainFrame.Visible = Config.UIVisible
    end
end, false, Config.UIKeybind)

-- ==================== THÔNG BÁO KHỞI TẠO ====================
Notify("Payexvs99vantue", "Script Blox Fruits Sea 1-3 V6 đã tải thành công")
print("Payexvs99vantue")
print("Sea 1-3 | Full Features | Banana Cat Hub + NSMOD")
print("Tích hợp toàn bộ tính năng từ Banana Cat Hub")
print("Phím tắt: RightControl để bật/tắt UI")
