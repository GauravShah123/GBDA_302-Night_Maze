/* ============================================================================
   Game: [Your Game Title]
   FINAL DEADLINE: April 1st

   Requirements Summary:
   - Base mechanics: move around the neighborhood (different directions for each level)
   - Backstory intro with narration, then multiple levels (Level 1, Level 2, Level 3)
   - Levels include collectables (2 per level), 3 hearts (lives), state icons, and pop ups
   - Switching between real and dream worlds (including control inversion, icon changes,
     demon activation, and blur transitions)
   - Level-specific differences such as demon behavior, boost mechanics, and octopus events
   - Sound effects and background music (to be added later)

   This file has been reorganized into sections:
      1. Global Variables & Constants
      2. Asset Preloading (preload)
      3. Setup & Main Loop (setup, draw)
      4. Screen Drawing Functions (splash, intro, levels, level changes, end)
      5. Helper Functions (movement, collision, tile drawing, world switching, UI, etc.)
      6. Input Handlers (keyPressed, mousePressed)

   Use this structure as a base to implement further features and level-specific logic.
============================================================================ */

// ============================================================================
// 1. GLOBAL VARIABLES & CONSTANTS
// ============================================================================

// Game state
let currentScreen = 4; // screens: 0 = Splash, 1 = Intro, 2 = Level1, 3 = LevelChange12, 4 = Level2, 5 = LevelChange23, 6 = Level3, 7 = End
let screens = [];

// World state & mechanics
let daytime = true;           // true = real world; false = dream world
let object1Collected = false;
let object2Collected = false;
let potionCollected = false;  // tracks if potion is collected (level 1+)
let octopusCount = 0;         // count of collected octopus tiles
let monsterFrame = 0;

// Player variables
let tileSize = 50;
let playerSize = tileSize / 2; // diameter of the player
let playerX = 29.5 * tileSize;
let playerY = 1.5 * tileSize;
let moveSpeed = 5;

// Blur effect (for world switching)
let blurAmount = 0;
let blurActive = false;
let blurPhase = "in";
let blurTimer = 0;

// Pop-up and narration state
let popUpShowing = -1;
let narrationShowing = -1;
let narrationIndex = 0;
let waitingForHouseOne = false;

// Level 1 Map (each number represents a different tile)
// 1: Background/Grass, 2: Wall, 3: Object1, 4: Object2,
// 5: Monster (only in dream world), 6: Unused, 7: Potion,
// 8: Octopus (only appears when objects & potion are collected)
let gameMap = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 3, 2],
    [2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 4, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 2],
    [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 5, 2],
    [2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 6, 2],
    [2, 2, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 7, 2],
    [2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 8, 2, 8, 2, 2, 1, 2, 1, 2],
    [2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
    [2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2],
    [2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

// Assets and UI images (to be loaded in preload)
let introBackground, introForeground, introOverlayForeground;
let introCharacter = [];  // array for character animation frames (length = 4)
let introCharacterFrame = 0;
let introCharacterLocation = { x: 420, y: 280 };
const introCharacterMinX = 300, introCharacterMaxX = 600;
const introCharacterMinY = 125, introCharacterMaxY = 375;
let introScreenNarration = [];
let popUpImages = [];
let narrationImages = [];
let tileImages = {};      // for various tiles (walls, objects, potion, octopus)
let monsterImages = [];   // frames for animated monster tile (tile 5)
let collectibleStatusImages = [];
let heartImages = [];
let dreamWorldIcon, realWorldIcon;

// Level 2 demon and additional gameplay variables
let currentHearts = 3;
let paused = false;
let inDreamWorld = false;
let dreamSwitchTimer = 0;
let nextDreamSwitch = 0;
let firstDreamSwitchDone = false;
let demon = {
    x: 1.5 * tileSize,
    y: 1.5 * tileSize,
    speed: 1.5,
    active: false
};

// ============================================================================
// 2. ASSET PRELOADING (p5.js preload function)
// ============================================================================
function preload() {
    // ---- Intro Screen Assets ----
    introBackground = loadImage("Intro Screen/Neighborhood _ Background.png");
    introForeground = loadImage("Intro Screen/Neighborhood _ Foreground.png");
    introOverlayForeground = loadImage("Intro Screen/introOverlayForeground.png");
    // Load animated character frames
    for (let i = 0; i < 4; i++) {
        introCharacter[i] = loadImage(`Intro Screen/walk${i + 1}.png`);
    }
    // Load narration images for intro screen (assumes 8 images: 0-7)
    for (let i = 0; i <= 7; i++) {
        introScreenNarration[i] = loadImage(`Intro Screen/introScreenNarration${i}.png`);
    }

    // ---- Level Assets: Narration & Pop-ups ----
    narrationImages.push(loadImage("Narration/narration_dream_switch.png"));
    narrationImages.push(loadImage("Narration/narration_demons_warning.png"));
    narrationImages.push(loadImage("Narration/narration_congrats.png"));

    popUpImages.push(loadImage("Pop Ups/popup_collect_items.png"));
    popUpImages.push(loadImage("Pop Ups/popup_restart_level.png"));
    popUpImages.push(loadImage("Pop Ups/popup_seek_octopus.png"));

    // ---- Tile Graphics ----
    tileImages.wall = {
        real: loadImage("Tiles/wall_real.png"),
        dream: loadImage("Tiles/wall_dream.png")
    };
    tileImages.object1 = loadImage("Tiles/object1.png");
    tileImages.object2 = loadImage("Tiles/object2.png");
    tileImages.potion = loadImage("Tiles/potion.png");
    tileImages.octopus = loadImage("Tiles/octopus.png");

    for (let i = 0; i < 3; i++) {
        monsterImages[i] = loadImage(`Tiles/monster_${i}.png`);
    }

    // ---- UI Elements ----
    collectibleStatusImages[0] = loadImage("UI/items_none.png");
    collectibleStatusImages[1] = loadImage("UI/items_obj1_only.png");
    collectibleStatusImages[2] = loadImage("UI/items_obj2_only.png");
    collectibleStatusImages[3] = loadImage("UI/items_both.png");

    // Heart images (0 = full hearts, 3 = all lost)
    for (let i = 0; i <= 3; i++) {
        heartImages[i] = loadImage(`UI/hearts_${i}_lost.png`);
    }

    // World state icons
    dreamWorldIcon = loadImage("UI/icon_dream.png");
    realWorldIcon = loadImage("UI/icon_real.png");
}

// ============================================================================
// 3. SETUP & MAIN LOOP
// ============================================================================

function setup() {
    createCanvas(900, 600);

    // Screens array holds functions that draw each screen/state
    screens = [
        drawSplash,        // 0: Splash screen
        drawIntro,         // 1: Intro / backstory
        drawLevel1,        // 2: Level 1 gameplay
        drawLevelChange12, // 3: Transition from Level 1 to 2
        drawLevel2,        // 4: Level 2 gameplay
        drawLevelChange23, // 5: Transition from Level 2 to 3
        drawLevel3,        // 6: Level 3 gameplay
        drawEnd            // 7: End screen / Game Over
    ];
}

function draw() {
    background(220);
    // Call current screen's drawing function
    screens[currentScreen]();
    // Apply blur effect if active
    handleBlur();
}

// ============================================================================
// 4. SCREEN DRAWING FUNCTIONS
// ============================================================================

// ---------- Splash Screen ----------
function drawSplash() {
    textAlign(CENTER, CENTER);
    textSize(32);
    text("SPLASH SCREEN", width / 2, height / 2);
    // Advance screen on mouse press
    if (mouseIsPressed) {
        currentScreen++;
    }
}

// ---------- Intro / Backstory Screen ----------
function drawIntro() {
    // Draw background and animated character
    image(introBackground, 0, 0, width, height);

    // Animate character
    introCharacterFrame += 0.1;
    image(introCharacter[floor(introCharacterFrame) % 4],
        introCharacterLocation.x, introCharacterLocation.y, 60, 60);

    // Allow movement of character using arrow keys (for debugging or narrative effect)
    if (keyIsDown(UP_ARROW)) {
        introCharacterLocation.x = constrain(introCharacterLocation.x + 2, introCharacterMinX, introCharacterMaxX);
        introCharacterLocation.y = constrain(introCharacterLocation.y - 1, introCharacterMinY, introCharacterMaxY);
    }
    if (keyIsDown(DOWN_ARROW)) {
        introCharacterLocation.x = constrain(introCharacterLocation.x - 2, introCharacterMinX, introCharacterMaxX);
        introCharacterLocation.y = constrain(introCharacterLocation.y + 1, introCharacterMinY, introCharacterMaxY);
    }
    if (keyIsDown(RIGHT_ARROW)) {
        introCharacterLocation.x = constrain(introCharacterLocation.x + 2, introCharacterMinX, introCharacterMaxX);
        introCharacterLocation.y = constrain(introCharacterLocation.y + 1, introCharacterMinY, introCharacterMaxY);
    }
    if (keyIsDown(LEFT_ARROW)) {
        introCharacterLocation.x = constrain(introCharacterLocation.x - 2, introCharacterMinX, introCharacterMaxX);
        introCharacterLocation.y = constrain(introCharacterLocation.y - 1, introCharacterMinY, introCharacterMaxY);
    }

    // Check if character is near houseOne (for narration progression)
    let houseOne = { x: 280, y: 100 };
    let radius = 100;
    if (narrationIndex === 3) {
        waitingForHouseOne = (dist(introCharacterLocation.x, introCharacterLocation.y, houseOne.x, houseOne.y) >= radius);
    }

    // Draw foreground and overlay (if needed)
    image(introForeground, 0, 0, width, height);
    if (narrationIndex === 3 && waitingForHouseOne) {
        image(introOverlayForeground, 0, 0, width, height);
    }

    // Draw narration image overlay (if active)
    if ((narrationIndex <= 2) || (narrationIndex >= 4 && narrationIndex <= 7) || (!waitingForHouseOne && narrationIndex === 3)) {
        let currentNarrationImage = introScreenNarration[narrationIndex];
        if (currentNarrationImage) {
            let targetWidth = 800;
            let scale = targetWidth / currentNarrationImage.width;
            let targetHeight = currentNarrationImage.height * scale;
            let x = (width - targetWidth) / 2;
            let y = height - targetHeight - 25;
            image(currentNarrationImage, x, y, targetWidth, targetHeight);
        }
    }
}

// ---------- Level 1 Gameplay Screen ----------
function drawLevel1() {
    // Set background color based on world state
    background(inDreamWorld ? "#AFD589" : "#CBC784");

    // If game is paused (e.g., pop up showing), display pop up and skip further updates
    if (paused) {
        showPopUp(popUpShowing);
        return;
    }

    // Handle player movement and collisions
    handlePlayerMovement(tileSize);

    // For level 1, after first dream switch, check for random switches
    if (firstDreamSwitchDone && millis() - dreamSwitchTimer > nextDreamSwitch) {
        toggleDreamWorld();
    }

    // Camera offset to center the player
    let offsetX = width / 2 - playerX;
    let offsetY = height / 2 - playerY;

    // Efficient tile rendering: only draw tiles near the player
    let centerCol = floor(playerX / tileSize);
    let centerRow = floor(playerY / tileSize);
    let viewDist = 10;
    let minRow = max(0, centerRow - viewDist);
    let maxRow = min(gameMap.length, centerRow + viewDist);
    let minCol = max(0, centerCol - viewDist);
    let maxCol = min(gameMap[0].length, centerCol + viewDist);

    for (let row = minRow; row < maxRow; row++) {
        for (let col = minCol; col < maxCol; col++) {
            let tileType = gameMap[row][col];
            let worldX = col * tileSize;
            let worldY = row * tileSize;
            let screenX = worldX + offsetX;
            let screenY = worldY + offsetY;
            drawTile(tileType, screenX, screenY, tileSize);
        }
    }

    // Draw player as a circle at the center of the screen
    fill(255, 255, 0);
    noStroke();
    ellipse(width / 2, height / 2, playerSize, playerSize);

    // Draw HUD (hearts, collectible status, world icon)
    drawHUD();

    // Check if conditions are met to show the octopus pop up
    if (object1Collected && object2Collected && !octopusCount) {
        popUpShowing = 2; // "Seek the octopus" pop up
        pauseGame();
    } else if (octopusCount > 0) {
        popUpShowing = 3; // "Congrats" pop up
        pauseGame();
    }

    // Display any queued narration overlay (if implemented further)
    showNarration(narrationShowing);

    // Update monster animation frame
    monsterFrame = (monsterFrame + 0.1) % 3;
}

// ---------- Transition Screen: Level 1 → Level 2 ----------
function drawLevelChange12() {
    textAlign(CENTER, CENTER);
    textSize(32);
    text("LEVEL CHANGE SCREEN", width / 2, height / 2);
    // Automatically transition after a fixed time
    if (frameCount % 120 === 0) {
        currentScreen = 4;
    }
}

// ---------- Level 2 Gameplay Screen ----------
function drawLevel2() {
    // For level 2, background color follows world state
    background(inDreamWorld ? "#AFD589" : "#CBC784");

    if (paused) {
        showPopUp(popUpShowing);
        return;
    }

    handlePlayerMovement(tileSize);

    // Random dream world switch based on timer
    if (firstDreamSwitchDone && millis() - dreamSwitchTimer > nextDreamSwitch) {
        toggleDreamWorld();
    }

    let offsetX = width / 2 - playerX;
    let offsetY = height / 2 - playerY;

    // Draw maze tiles (similar to Level 1)
    let centerCol = floor(playerX / tileSize);
    let centerRow = floor(playerY / tileSize);
    let viewDist = 10;
    let minRow = max(0, centerRow - viewDist);
    let maxRow = min(gameMap.length, centerRow + viewDist);
    let minCol = max(0, centerCol - viewDist);
    let maxCol = min(gameMap[0].length, centerCol + viewDist);

    for (let row = minRow; row < maxRow; row++) {
        for (let col = minCol; col < maxCol; col++) {
            let tileType = gameMap[row][col];
            let worldX = col * tileSize;
            let worldY = row * tileSize;
            let screenX = worldX + offsetX;
            let screenY = worldY + offsetY;
            drawTile(tileType, screenX, screenY, tileSize);
        }
    }

    // Draw demon if in dream world and active
    if (inDreamWorld && demon.active) {
        updateDemon();
        let screenX = demon.x + offsetX;
        let screenY = demon.y + offsetY;
        fill(180, 0, 180);
        ellipse(screenX, screenY, tileSize, tileSize);
    }

    // Draw player
    fill(255, 255, 0);
    noStroke();
    ellipse(width / 2, height / 2, playerSize, playerSize);

    drawHUD();

    // Check for octopus pop up conditions
    if (object1Collected && object2Collected && !octopusCount) {
        popUpShowing = 2;
        pauseGame();
    } else if (octopusCount > 0) {
        popUpShowing = 3;
        pauseGame();
    }

    showNarration(narrationShowing);
    monsterFrame = (monsterFrame + 0.1) % 3;
}

// ---------- Transition Screen: Level 2 → Level 3 ----------
function drawLevelChange23() {
    textAlign(CENTER, CENTER);
    textSize(32);
    text("LEVEL CHANGE SCREEN", width / 2, height / 2);
    if (frameCount % 120 === 0) {
        currentScreen = 6; // Jump to Level 3
    }
}

// ---------- Level 3 Gameplay Screen ----------
function drawLevel3() {
    textAlign(CENTER, CENTER);
    textSize(32);
    text("LEVEL 3", width / 2, height / 2);
    // Example: change tile size for level 3 (could represent new mechanics like boost)
    tileSize = 30;
    // Additional level 3 mechanics (e.g., shoes/boost) would be implemented here
}

// ---------- End Screen / Game Over ----------
function drawEnd() {
    textAlign(CENTER, CENTER);
    textSize(40);
    text("GAME OVER", width / 2, height / 2);
    // Allow restart on key press
    if (keyIsPressed && key === 'r') {
        currentScreen = 0;
    }
}

// ============================================================================
// 5. HELPER FUNCTIONS
// ============================================================================

// --- Blur Effect during world switching ---
function handleBlur() {
    if (!blurActive) return;

    const blurInSpeed = 0.3;
    const blurHoldTime = 30; // frames to hold full blur
    const blurOutSpeed = 0.3;

    if (blurPhase === "in") {
        blurAmount = min(blurAmount + blurInSpeed, 10);
        filter(BLUR, blurAmount);
        if (blurAmount >= 10) {
            blurPhase = "hold";
            blurTimer = 0;
        }
    } else if (blurPhase === "hold") {
        filter(BLUR, blurAmount);
        blurTimer++;
        if (blurTimer >= blurHoldTime) {
            blurPhase = "out";
        }
    } else if (blurPhase === "out") {
        blurAmount = max(blurAmount - blurOutSpeed, 0);
        filter(BLUR, blurAmount);
        if (blurAmount <= 0) {
            blurActive = false;
            blurPhase = "in";
        }
    }
}

// --- Toggle World State (Real <-> Dream) ---
// This function centralizes the logic for switching between worlds.
// It handles: blur effect, control inversion (handled in movement),
// icon changes, narration, and demon activation (only for Level 2 & 3).
function toggleDreamWorld() {
    blurActive = true;
    blurPhase = "in";
    inDreamWorld = !inDreamWorld;

    if (inDreamWorld) {
        fallAsleep();
        narrationShowing = 0; // e.g., "You entered the dream"
        // In Level 2 and Level 3, activate the demon and show pop-up
        if (currentScreen === 4 || currentScreen === 6) {
            demon.active = true;
            popUpShowing = 0;  // "Demons now chase you" pop-up
            pauseGame();
        }
    } else {
        wakeUp();
        narrationShowing = 1; // e.g., "You feel disoriented"
        demon.active = false;
    }
    dreamSwitchTimer = millis();
    nextDreamSwitch = random(7000, 12000);
}

// --- World State Helpers ---
function wakeUp() {
    daytime = true;
}

function fallAsleep() {
    daytime = false;
}

// --- HUD Drawing ---
function drawHUD() {
    // Draw hearts (UI: 0 = full, 3 = all lost)
    let heartImg = heartImages[3 - currentHearts];
    image(heartImg, 20, 20, 150, 50);

    // Draw collectible status icon based on objects collected
    let collectibleIndex = 0;
    if (object1Collected && object2Collected) {
        collectibleIndex = 3;
    } else if (object1Collected) {
        collectibleIndex = 1;
    } else if (object2Collected) {
        collectibleIndex = 2;
    } else {
        collectibleIndex = 0;
    }
    let collectibleIcon = collectibleStatusImages[collectibleIndex];
    image(collectibleIcon, 20, 80, 80, 40);

    // Draw world state icon (real or dream)
    let icon = inDreamWorld ? dreamWorldIcon : realWorldIcon;
    image(icon, width - 70, 20, 40, 40);
}

// --- Player Movement & Collision ---
function handlePlayerMovement(tileSize) {
    if (paused) return;  // Do not update movement if game is paused

    let oldX = playerX;
    let oldY = playerY;

    // Controls differ in dream world (inversion of directions)
    if (inDreamWorld) {
        if (keyIsDown(LEFT_ARROW)) playerX += moveSpeed;
        else if (keyIsDown(RIGHT_ARROW)) playerX -= moveSpeed;
        if (keyIsDown(UP_ARROW)) playerY += moveSpeed;
        else if (keyIsDown(DOWN_ARROW)) playerY -= moveSpeed;
    } else {
        if (keyIsDown(LEFT_ARROW)) playerX -= moveSpeed;
        else if (keyIsDown(RIGHT_ARROW)) playerX += moveSpeed;
        if (keyIsDown(UP_ARROW)) playerY -= moveSpeed;
        else if (keyIsDown(DOWN_ARROW)) playerY += moveSpeed;
    }

    // Collision detection with walls and boundaries
    let r = playerSize / 2;
    let corners = [
        { x: playerX - r, y: playerY - r },
        { x: playerX + r, y: playerY - r },
        { x: playerX - r, y: playerY + r },
        { x: playerX + r, y: playerY + r }
    ];

    for (let c of corners) {
        let col = floor(c.x / tileSize);
        let row = floor(c.y / tileSize);

        // Check map boundaries
        if (row < 0 || row >= gameMap.length || col < 0 || col >= gameMap[0].length) {
            playerX = oldX;
            playerY = oldY;
            return;
        }

        let tile = gameMap[row][col];

        // Collide with walls
        if (tile === 2) {
            playerX = oldX;
            playerY = oldY;
            return;
        }

        // In dream world, hitting a monster (tile 5) reduces a heart
        if (inDreamWorld && tile === 5) {
            currentHearts--;
            if (currentHearts <= 0) {
                popUpShowing = 1; // "Restart level" pop-up
                pauseGame();
                return;
            }
            playerX = oldX;
            playerY = oldY;
        }
    }

    // --- Item Pickup Handling ---
    let col = floor(playerX / tileSize);
    let row = floor(playerY / tileSize);
    if (row >= 0 && row < gameMap.length && col >= 0 && col < gameMap[0].length) {
        let centerTile = gameMap[row][col];

        if (centerTile === 3 && !object1Collected) {

            object1Collected = true;
            gameMap[row][col] = 1;

            // For Level 1: trigger dream world switch once the first object is collected
            if (currentScreen === 2) {
                if (!firstDreamSwitchDone) {
                    toggleDreamWorld();
                    firstDreamSwitchDone = true;
                }
            }
        } 
        
        else if (centerTile === 4 && !object2Collected) {
            object2Collected = true;
            gameMap[row][col] = 1;
            
            // Optionally show narration when object2 is collected
            if (currentScreen === 2) {
                narrationShowing = 1;
            }
        } 
        
        else if (centerTile === 8 && octopusCount === 0) {
            octopusCount++;
            gameMap[row][col] = 1;
        }
    }
}

// --- Tile Rendering ---
function drawTile(tileType, x, y, size) {
    const world = inDreamWorld ? 'dream' : 'real';

    // Do not draw monsters in real world and ignore unused tile (6)
    if (tileType === 5 && !inDreamWorld) return;
    if (tileType === 6) return;

    // Hide potion until both objects are collected
    if (tileType === 7 && !(object1Collected && object2Collected)) {
        tileType = 1;
    }
    // Hide octopus until objects and potion are collected
    if (tileType === 8 && !(object1Collected && object2Collected && potionCollected)) {
        tileType = 1;
    }

    switch (tileType) {
        case 1: // Background/Grass
            fill(inDreamWorld ? "#AFD589" : "#CBC784");
            noStroke();
            rect(x, y, size, size);
            break;
        case 2: // Wall
            image(tileImages.wall[world], x, y, size, size);
            break;
        case 3: // Object 1
            image(tileImages.object1, x, y, size, size);
            break;
        case 4: // Object 2
            image(tileImages.object2, x, y, size, size);
            break;
        case 5: // Monster (animated)
            let frame = floor(monsterFrame);
            image(monsterImages[frame], x, y, size, size);
            break;
        case 7: // Potion
            image(tileImages.potion, x, y, size, size);
            break;
        case 8: // Octopus
            image(tileImages.octopus, x, y, size, size);
            break;
        default:
            fill(inDreamWorld ? "#AFD589" : "#CBC784");
            rect(x, y, size, size);
    }
}

// --- Demon (Level 2/3) Behavior ---
function updateDemon() {
    let dx = playerX - demon.x;
    let dy = playerY - demon.y;
    let distance = sqrt(dx * dx + dy * dy);

    if (distance > 1) {
        let stepX = (dx / distance) * demon.speed;
        let stepY = (dy / distance) * demon.speed;
        demon.x += stepX;
        demon.y += stepY;
    }

    // Check collision between demon and player
    if (distance < playerSize / 2 + tileSize / 2) {
        currentHearts--;
        // Reset demon position after hitting the player
        demon.x = 1.5 * tileSize;
        demon.y = 1.5 * tileSize;
        if (currentHearts <= 0) {
            popUpShowing = 1; // "Restart level" pop-up
            pauseGame();
        }
    }
}

// --- Pop-up & Narration Display ---
function showPopUp(popUpNumber) {
    if (popUpShowing !== -1) {
        let img = popUpImages[popUpNumber];
        let imgWidth = 600;
        let imgHeight = img.height * (imgWidth / img.width);
        let x = (width - imgWidth) / 2;
        let y = (height - imgHeight) / 2;

        // Dim the background and draw pop-up
        fill(0, 0, 0, 220);
        rect(0, 0, width, height);
        image(img, x, y, imgWidth, imgHeight);
        // Allow closing the pop-up by pressing ENTER
        if (keyIsPressed && keyCode === ENTER) {
            popUpShowing = -1;
            narrationShowing = -1;
            resumeGame();
        }
    }
}

// (Placeholder) Function for showing narration overlay
function showNarration(narrationNumber) {
    // Implement narration display based on narrationNumber as needed
}

// --- Pause / Resume Game ---
function pauseGame() {
    paused = true;
}

function resumeGame() {
    paused = false;
}

// ============================================================================
// 6. INPUT HANDLERS
// ============================================================================

function keyPressed() {
    // Advance narration in Intro screen (using spacebar)
    if (currentScreen === 1) {
        if (key === ' ') {
            if (narrationIndex <= 2) narrationIndex++;
            else if (narrationIndex === 3 && !waitingForHouseOne) narrationIndex++;
            else if (narrationIndex < 7) narrationIndex++;
            else if (narrationIndex === 7) currentScreen = 2;
        }
    }

    // Allow closing pop-ups in gameplay screens by pressing ENTER
    if (currentScreen === 2 || currentScreen === 4 || currentScreen === 6) {
        if (paused && keyCode === ENTER) {
            popUpShowing = -1;
            narrationShowing = -1;
            resumeGame();
        }
    }
}

function mousePressed() {
    // Optionally add mouse interactions for the intro screen or other screens
}