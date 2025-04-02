// Updated code that:
// 1) Makes potion (tile 7) visible only after Object 1 and 2 are collected.
// 2) Adds a new tile type (8) for an "octopus," which only becomes visible after
//    Object 1 & 2 & potion are collected.
// 3) When an item is collected, we revert that tile to background (1)
// 4) Provides a more efficient rendering approach by only drawing tiles near the player.

let currentScreen = 4;
let screens = [];

let daytime = true;           // If false, we're in the dream world
let object1Collected = false;
let object2Collected = false;
let potionCollected = false;  // Track if potion is collected
let octopusCount = 0;         // How many octopus tiles we have collected

let tileSize = 50;
let playerSize = tileSize / 2; // diameter of the player

// Player info: a circle in world space
let playerX = 29.5 * tileSize;
let playerY = 1.5 * tileSize;
let moveSpeed = 5;

let blurAmount = 0;
let blurActive = false;
let blurPhase = "in";
let blurTimer = 0;

let popUpShowing = -1;
let narrationShowing = -1;

//Images
let introBackground;
let introForeground;
let introCharacter = [];
let popUpImages = [];
let narrationImages = [];
introCharacter.length = 4;
let introCharacterFrame = 0;
let introCharacterLocation = { x: 420, y: 280 };
const introCharacterMinX = 300, introCharacterMaxX = 600;
const introCharacterMinY = 125, introCharacterMaxY = 375;
let introScreenNarration = [];
let introOverlayForeground;

let tileImages = {}; // object for named tile types
let monsterImages = []; // animated frames for tile 5
let monsterFrame = 0;

let collectibleStatusImages = [];
let heartImages = [];

let dreamWorldIcon, realWorldIcon;

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



function preload() {
  // Introduction Screen (currentScreen = 1)
  introBackground = loadImage("Intro Screen/Neighborhood _ Background.png");
  introForeground = loadImage("Intro Screen/Neighborhood _ Foreground.png");
  introCharacter[0] = loadImage("Intro Screen/walk1.png");
  introCharacter[1] = loadImage("Intro Screen/walk2.png");
  introCharacter[2] = loadImage("Intro Screen/walk3.png");
  introCharacter[3] = loadImage("Intro Screen/walk4.png");

  for (let i = 0; i <= 7; i++) {
    introScreenNarration[i] = loadImage(`Intro Screen/introScreenNarration${i}.png`);
  }
  introOverlayForeground = loadImage("Intro Screen/introOverlayForeground.png");


  // LEVELS

  // Narration / Pop-ups (examples)
  narrationImages.push(loadImage("Narration/narration_dream_switch.png"));
  narrationImages.push(loadImage("Narration/narration_demons_warning.png"));
  narrationImages.push(loadImage("Narration/narration_congrats.png"));

  popUpImages.push(loadImage("Pop Ups/popup_collect_items.png"));
  popUpImages.push(loadImage("Pop Ups/popup_restart_level.png"));
  popUpImages.push(loadImage("Pop Ups/popup_seek_octopus.png"));

  // Tile graphics
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

  // Collectible status (0–3)
  collectibleStatusImages[0] = loadImage("UI/items_none.png");
  collectibleStatusImages[1] = loadImage("UI/items_obj1_only.png");
  collectibleStatusImages[2] = loadImage("UI/items_obj2_only.png");
  collectibleStatusImages[3] = loadImage("UI/items_both.png");

  // Heart states (0 full, 3 = all gone)
  for (let i = 0; i <= 3; i++) {
    heartImages[i] = loadImage(`UI/hearts_${i}_lost.png`);
  }

  // State icons
  dreamWorldIcon = loadImage("UI/icon_dream.png");
  realWorldIcon = loadImage("UI/icon_real.png");

}



// The tile map for Level 1
//   1 => Background
//   2 => Maze wall
//   3 => Object1 (blue square)
//   4 => Object2 (blue square)
//   5 => Obstacle1 (if !daytime)
//   6 => Obstacle2 (if !daytime)
//   7 => Potion (only appears if object1 & object2 have been collected)
//   8 => Octopus (only appears if object1 & object2 & potion are collected)
// Two example octopus tiles have been placed in the map at row 8 col 10, row 9 col 10 (just for demo)
// so you can see them appear after collecting everything.
let level1Map = [
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
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2],
  [2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

function drawSplash() {
  textAlign(CENTER, CENTER);
  textSize(32);
  text("SPLASH SCREEN", width / 2, height / 2);
  if (mouseIsPressed) {
    currentScreen++;
  }
}

let narrationIndex = 0;
let waitingForHouseOne = false;

function drawIntro() {
  image(introBackground, 0, 0, width, height);

  // Animate character
  introCharacterFrame = introCharacterFrame + 0.1;
  image(introCharacter[floor((introCharacterFrame)) % 4], introCharacterLocation.x, introCharacterLocation.y, 60, 60);

  // Move character smoothly
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

  // Optional debug movement (B key)
  if (keyIsDown(66)) {
    print(introCharacterLocation.x -= 2, introCharacterLocation.y -= 1);
  }

  // House location
  let houseOne = { x: 280, y: 100 };
  let radius = 100;

  // Update waiting flag based on houseOne proximity
  if (narrationIndex === 3) {
    if (dist(introCharacterLocation.x, introCharacterLocation.y, houseOne.x, houseOne.y) < radius) {
      waitingForHouseOne = false;
    } else {
      waitingForHouseOne = true;
    }
  }

  // Draw base foreground
  image(introForeground, 0, 0, width, height);

  // Show extra foreground overlay if narrationIndex is 3 and still waiting
  if (narrationIndex === 3 && waitingForHouseOne) {
    image(introOverlayForeground, 0, 0, width, height);
  }

  // --- DRAW NARRATION IMAGE LAST, ON TOP ---
  let showNarration = false;
  let currentNarrationImage;

  if (narrationIndex <= 2 || (narrationIndex >= 4 && narrationIndex <= 7)) {
    showNarration = true;
    currentNarrationImage = introScreenNarration[narrationIndex];
  } else if (narrationIndex === 3 && !waitingForHouseOne) {
    showNarration = true;
    currentNarrationImage = introScreenNarration[3];
  }

  if (showNarration && currentNarrationImage) {
    let targetWidth = 800;
    let scale = targetWidth / currentNarrationImage.width;
    let targetHeight = currentNarrationImage.height * scale;

    let x = (width - targetWidth) / 2;
    let y = height - targetHeight - 25; // 50px margin from bottom

    image(currentNarrationImage, x, y, targetWidth, targetHeight);
  }
}




function wakeUp() {
  daytime = true;
}

function fallAsleep() {
  daytime = false;
}

function drawLevel1() {
  background(inDreamWorld ? "#AFD589" : "#CBC784");

  // 1) Pause check
  if (paused) {
    showPopUp(popUpShowing);
    return;
  }

  // 2) Movement + collision
  handlePlayerMovement(tileSize);

  // 3) World-switch timer logic (after first switch)
  if (firstDreamSwitchDone && millis() - dreamSwitchTimer > nextDreamSwitch) {
    toggleDreamWorld();
  }

  // 4) Camera offset
  let offsetX = width / 2 - playerX;
  let offsetY = height / 2 - playerY;

  // 5) Efficient tile rendering
  let centerCol = floor(playerX / tileSize);
  let centerRow = floor(playerY / tileSize);
  let viewDist = 10;

  let minRow = max(0, centerRow - viewDist);
  let maxRow = min(level1Map.length, centerRow + viewDist);
  let minCol = max(0, centerCol - viewDist);
  let maxCol = min(level1Map[0].length, centerCol + viewDist);

  for (let row = minRow; row < maxRow; row++) {
    for (let col = minCol; col < maxCol; col++) {
      let tileType = level1Map[row][col];
      let worldX = col * tileSize;
      let worldY = row * tileSize;

      let screenX = worldX + offsetX;
      let screenY = worldY + offsetY;
      drawTile(tileType, screenX, screenY, tileSize);
    }
  }

  // 6) Draw player
  fill(255, 255, 0);
  noStroke();
  ellipse(width / 2, height / 2, playerSize, playerSize);

  // 7) UI overlay
  drawHUD();

  // 8) Check octopus status
  if (object1Collected && object2Collected && !octopusCount) {
    popUpShowing = 2; // "Seek the octopus"
    pauseGame();
  } else if (octopusCount > 0) {
    popUpShowing = 3; // "Congrats"
    pauseGame();
  }

  // 9) Show narration (if queued)
  showNarration(narrationShowing);

  monsterFrame = (monsterFrame + 0.1) % 3;
}

function drawLevelChange12() {
  textAlign(CENTER, CENTER);
  textSize(32);
  text("LEVEL CHANGE SCREEN", width / 2, height / 2);
  if (frameCount % 120 === 0) {
    currentScreen = 4;
  }
}
function drawLevel2() {
  print("LEVEL 2")
  background(inDreamWorld ? "#AFD589" : "#CBC784");

  if (paused) {
    showPopUp(popUpShowing);
    return;
  }

  handlePlayerMovement(tileSize);

  if (firstDreamSwitchDone && millis() - dreamSwitchTimer > nextDreamSwitch) {
    toggleDreamWorld();
  }

  let offsetX = width / 2 - playerX;
  let offsetY = height / 2 - playerY;

  // Draw maze
  let centerCol = floor(playerX / tileSize);
  let centerRow = floor(playerY / tileSize);
  let viewDist = 10;

  let minRow = max(0, centerRow - viewDist);
  let maxRow = min(level1Map.length, centerRow + viewDist);
  let minCol = max(0, centerCol - viewDist);
  let maxCol = min(level1Map[0].length, centerCol + viewDist);

  for (let row = minRow; row < maxRow; row++) {
    for (let col = minCol; col < maxCol; col++) {
      let tileType = level1Map[row][col];
      let worldX = col * tileSize;
      let worldY = row * tileSize;
      let screenX = worldX + offsetX;
      let screenY = worldY + offsetY;
      drawTile(tileType, screenX, screenY, tileSize);
    }
  }

  // Draw demon
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


function drawLevelChange23() {
  textAlign(CENTER, CENTER);
  textSize(32);
  text("LEVEL CHANGE SCREEN", width / 2, height / 2);
  if (frameCount % 120 === 0) {
    currentScreen = 6; // Jump to Level 3
  }
}

function drawLevel3() {
  textAlign(CENTER, CENTER);
  textSize(32);
  text("LEVEL 3", width / 2, height / 2);

  tileSize = 30;
}

function blurIn() {
  if (!blurActive) return;

  // Timing constants
  const blurInSpeed = 0.3;
  const blurHoldTime = 30; // frames
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


function showPopUp(popUpNumber) {
  if (popUpShowing !== -1) {
    let img = popUpImages[popUpNumber];
    let imgWidth = 600;
    let imgHeight = img.height * (imgWidth / img.width);

    // Calculate position to center the image
    let x = (width - imgWidth) / 2;
    let y = (height - imgHeight) / 2;

    // Draw the image
    fill(0, 0, 0, 220);
    rect(0, 0, width, height);
    image(img, x, y, imgWidth, imgHeight);
    if (keyIsPressed && keyCode === ENTER) {
      popUpShowing = -1;
    }
  }
}

function showNarration(narrationNumber) {

}

function drawEnd() {
  textAlign(CENTER, CENTER);
  textSize(40);
  text("GAME OVER", width / 2, height / 2);
  if (keyIsPressed && key === 'r') {
    currentScreen = 0;
  }
}

function setup() {
  createCanvas(900, 600);
  screens = [
    drawSplash,
    drawIntro,
    drawLevel1,
    drawLevelChange12,
    drawLevel2,
    drawLevelChange23,
    drawLevel3,
    drawEnd
  ];
}

function draw() {
  background(220);
  screens[currentScreen]();
  blurIn();
}

// -----------------------------------------------------------------
// HELPER FUNCTIONS

function handlePlayerMovement(tileSize) {
  if (paused) return;

  let oldX = playerX;
  let oldY = playerY;

  // Controls based on dream state
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

  // Collision
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

    if (
      row < 0 || row >= level1Map.length ||
      col < 0 || col >= level1Map[0].length
    ) {
      playerX = oldX;
      playerY = oldY;
      return;
    }

    let tile = level1Map[row][col];

    if (tile === 2) {
      playerX = oldX;
      playerY = oldY;
      return;
    }

    if (inDreamWorld && tile === 5) {
      // Hit demon
      currentHearts--;
      if (currentHearts <= 0) {
        popUpShowing = 1; // "Restart level"
        pauseGame();
        return;
      }
      playerX = oldX;
      playerY = oldY;
    }
  }

  // Item pickup
  let col = floor(playerX / tileSize);
  let row = floor(playerY / tileSize);
  if (
    row >= 0 && row < level1Map.length &&
    col >= 0 && col < level1Map[0].length
  ) {
    let centerTile = level1Map[row][col];

    if (centerTile === 3 && !object1Collected) {
      object1Collected = true;
      level1Map[row][col] = 1;

      // Trigger dream world for the first time
      if (!firstDreamSwitchDone) {
        toggleDreamWorld();
        firstDreamSwitchDone = true;
      }
    } else if (centerTile === 4 && !object2Collected) {
      object2Collected = true;
      level1Map[row][col] = 1;
    
      // Only show narration in Level 1
      if (currentScreen === 2) {
        narrationShowing = 1;
      }
    }
     else if (centerTile === 8 && octopusCount === 0) {
      octopusCount++;
      level1Map[row][col] = 1;
    }
  }
}


function drawTile(tileType, x, y, size) {
  const world = inDreamWorld ? 'dream' : 'real';

  // Hide monsters in real world
  if (tileType === 5 && !inDreamWorld) return;

  // Hide tile 6 — not used
  if (tileType === 6) return;

  // Hide potion until ready
  if (tileType === 7 && !(object1Collected && object2Collected)) {
    tileType = 1;
  }

  // Hide octopus until ready
  if (tileType === 8 && !(object1Collected && object2Collected && potionCollected)) {
    tileType = 1;
  }

  switch (tileType) {
    case 1: // Grass color tile
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



// Lvl 1 Helpers
function toggleDreamWorld() {
  blurActive = true;
  blurPhase = "in";

  inDreamWorld = !inDreamWorld;

  if (inDreamWorld) {
    fallAsleep();
    narrationShowing = 0; // "You entered the dream"
  } else {
    wakeUp();
    narrationShowing = 1; // "You feel disoriented"
  }

  // Reset timer
  dreamSwitchTimer = millis();
  nextDreamSwitch = random(7000, 12000);
}

function drawHUD() {
  // Draw hearts
  let heartImg = heartImages[3 - currentHearts]; // 0 = full, 3 = all gone
  image(heartImg, 20, 20, 150, 50);

  // Draw collectable icons
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

  // Draw combined collectible status icon
  let collectibleIcon = collectibleStatusImages[collectibleIndex];
  image(collectibleIcon, 20, 80, 80, 40);

  // Dream/real icon
  let icon = inDreamWorld ? dreamWorldIcon : realWorldIcon;
  image(icon, width - 70, 20, 40, 40);
}

// Lvl 2
function updateDemon() {
  let dx = playerX - demon.x;
  let dy = playerY - demon.y;
  let dist = sqrt(dx * dx + dy * dy);

  if (dist > 1) {
    let stepX = (dx / dist) * demon.speed;
    let stepY = (dy / dist) * demon.speed;
    demon.x += stepX;
    demon.y += stepY;
  }

  // Check for collision with player
  let caught = dist < playerSize / 2 + tileSize / 2;
  if (caught) {
    currentHearts--;
    demon.x = 1.5 * tileSize;
    demon.y = 1.5 * tileSize;

    if (currentHearts <= 0) {
      popUpShowing = 1; // Restart level
      pauseGame();
    }
  }
}

function toggleDreamWorld() {
  blurActive = true;
  blurPhase = "in";
  inDreamWorld = !inDreamWorld;

  if (inDreamWorld) {
    fallAsleep();
    narrationShowing = 0;
    demon.active = true; // Demon enters
    popUpShowing = 0;    // “Demons now chase you”
    pauseGame();
  } else {
    wakeUp();
    narrationShowing = 1;
    demon.active = false;
  }

  dreamSwitchTimer = millis();
  nextDreamSwitch = random(7000, 12000);
}

function startLevel2() {
  object1Collected = false;
  object2Collected = false;
  potionCollected = false;
  octopusCount = 0;
  currentHearts = 3;
  demon.x = 1.5 * tileSize;
  demon.y = 1.5 * tileSize;
  demon.active = false;
  paused = false;
  inDreamWorld = false;
  dreamSwitchTimer = millis();
  nextDreamSwitch = random(7000, 12000);
}

function pauseGame() {
  paused = true;
}

function resumeGame() {
  paused = false;
}



function mousePressed() {
  if (currentScreen === 1) {
    // print()
  }
}

// Handle narration advance on spacebar
function keyPressed() {
  if (currentScreen === 1) {
    if (key === ' ') {
      if (narrationIndex <= 2) narrationIndex++;
      else if (narrationIndex === 3 && !waitingForHouseOne) narrationIndex++;
      else if (narrationIndex < 7) narrationIndex++;
      else if (narrationIndex === 7) currentScreen = 2;
    }
  }

  // Handle popup close
  if (currentScreen === 2 || currentScreen === 4 || currentScreen === 6)
    if (paused && keyCode === ENTER) {
      popUpShowing = -1;
      narrationShowing = -1;
      resumeGame();
    }
}
