let currentScreen = "splash";
//Options: splash, intro, level_1, between_1_and_2, level_2, between_2_and_3, level_3, after_3, death, after_death

//Splash Screen
let splash_Image;


//Intro Screen
let intro_Narrations = [];
let transitions_narationNumber = 0;
let playerState = 0; //Keeps track of walk cycles
let player = { x: 450, y: 275 };

// Level 1

// Level 1 Map (each number represents a different tile)
// 1: Background/Grass, 2: Wall, 3: Object1, 4: Object2,
// 5: Monster (only in dream world)
// 6: Octopus (only appears when objects are collected - ONLY IN THE DREAM WORLD)
let OGMap = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 6, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 5, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 5, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 1, 4, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 5, 1, 1, 1, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];
let gameMap = OGMap;
let level1FirstTime = true;

//Level 2
let demonPosition = { x1: 100, y1: 100, x2: 800, y2: 100, x3: 800, y3: 800 };
let level2FirstTime = true;

//Level 3
let level3_shoes = [];
let level3_can_run = 0;
let level3_running = 0;
let level3_player_speed = 5;
let timeSinceLastRun = 600;
let runTimeLeft = 300;
let level3FirstTime = true;

//Transition 1 -> 2
let between1and2_Narrations = [];

//Transition 2 -> 3
let between2and3_Narrations = [];

//After level 3
let after_3_Narrations = [];
let death_Narration;
let nightmareQueen = [];
let deathFrame = 0;

// ---- VARIBALES FOR MULTIPLE SCREENS ----

//Transition Screens
let transition_Background;
let transition_Player = [];
let transition_Foreground;
let transition_HouseGlow = [];
let transition_foregrounds = [];

//Levels
let tilesize = 40;
let levels_player;
let HUD_hearts = [];
let HUD_health = 3;

let HUD_dream_real_icon = [];

let HUD_objects = [];
let HUD_objectImage = 0;
let levels_objects = [];

let levelWalls = [];
let levelDemon = [];
let levelOctopus;
let inDreamWorld = false;

let mazePosition = { x: -710, y: 235 };
let prevMazePosition = { x: -710, y: 235 };

let popup_images = [];
let popup_active = false;
let popup_num = 0;

let blurAmount = -2;
let startSwitchingWorlds = false;
let framesSinceLastSwitch = 0;
let frameToSwitchAt = 60 * 10;

//After Death
let endingImage;

//MUSIC
let music_intro_music;
let music_walking_sound;
let music_dream_background;
let music_reality_background;
let music_neighbourhood;
let music_congratulations;
let music_damage_sound;
let music_item_collected;
let music_health_lost;



function preload() {
  //Music
  music_intro_music = loadSound("./Music/intro music.mp3");
  music_walking_sound = loadSound("./Music/walking sound.mp3");
  music_dream_background = loadSound("./Music/big audios/background-big audios/dream background.mp3");
  music_reality_background = loadSound("./Music/big audios/background-big audios/reality background.mp3");
  music_neighbourhood = loadSound("./Music/big audios/background-big audios/neighbourhood.mp3");
  music_congratulations = loadSound("./Music/congrats/short sounds (item-killed-congrats)/congratulations!.mp3");
  music_damage_sound = loadSound("./Music/congrats/short sounds (item-killed-congrats)/damage sound.mp3");
  music_item_collected = loadSound("./Music/congrats/short sounds (item-killed-congrats)/item collected.mp3");
  music_health_lost = loadSound("./Music/congrats/short sounds (item-killed-congrats)/health lost.mp3")



  //Splash Screen
  splash_Image = loadImage("./Images/Splash Screen/Splash Screens.png");

  // Intro Screen
  for (let i = 0; i < 8; i++) {
    intro_Narrations[i] = loadImage(`./Images/Intro Screen/introScreenNarration${i}.png`)
  }

  //Transition Screen
  transition_Background = loadImage("./Images/Transitions/Background.png");
  transition_Foreground = loadImage("./Images/Transitions/foreground.png");

  for (let i = 0; i < 4; i++) {
    transition_foregrounds[i] = loadImage(`./Images/Transitions/neighbourhoodForeground${i}.png`);
    transition_Player[i] = loadImage(`./Images/Intro Screen/walk${i + 1}.png`);
  }
  for (let i = 0; i < 3; i++) {
    transition_HouseGlow[i] = loadImage(`./Images/Transitions/house 0${i + 1}.png`)
  }
  for (let i = 0; i < 9; i++) {
    between1and2_Narrations[i] = loadImage(`./Images/Transitions/1-2/between1and2-${i}.png`)
    between2and3_Narrations[i] = loadImage(`./Images/Transitions/2-3/between2and3-${i}.png`)
  }
  for (let i = 0; i < 3; i++) {
    after_3_Narrations[i] = loadImage(`./Images/Transitions/After 3/after_3-${i}.png`)
  }
  for (let i = 0; i < 9; i++) {
    nightmareQueen[i] = loadImage(`./Images/Transitions/After 3/nightmareQueen-${i}.png`)
  }
  death_Narration = loadImage("./Images/Transitions/death.png");


  //Level 1
  levelWalls[0] = loadImage("./Images/Levels/realWall.png");
  levelWalls[1] = loadImage("./Images/Levels/dreamWall.png");

  //Level 3
  level3_shoes[0] = loadImage("./Images/Levels/HUD/shoes-1.png");
  level3_shoes[1] = loadImage("./Images/Levels/HUD/shoes-0.png");
  level3_shoes[2] = loadImage("./Images/Levels/HUD/shoes-2.png");

  // Levels
  levels_player = loadImage("./Images/Levels/player.png")
  for (let i = 0; i < 6; i++) {
    levels_objects[i] = loadImage(`./Images/Levels/Objects/object_image-${i}.png`);
  }
  for (let i = 0; i < 4; i++) {
    HUD_hearts[i] = loadImage(`./Images/Levels/hearts_${i}_lost.png`);
  }
  for (let i = 0; i < 12; i++) {
    HUD_objects[i] = loadImage(`./Images/Levels/HUD/items_${i}.png`);
  }
  HUD_dream_real_icon[0] = loadImage("./Images/Levels/Reality Icon.png");
  HUD_dream_real_icon[1] = loadImage("./Images/Levels/Dream Icon.png");

  for (let i = 0; i < 11; i++) {
    popup_images[i] = loadImage(`./Images/Levels/Pop ups/popUp${i}.png`)
  }
  for (let i = 0; i < 4; i++) {
    levelDemon[i] = loadImage(`./Images/Levels/Demon/levelDemon${i}.png`)
  }
  levelOctopus = loadImage("./Images/Levels/Demon/Dream Octo.png");
  endingImage = loadImage("./Images/Splash Screen/Ending.png")
}

function setup() {
  createCanvas(900, 600);
  music_intro_music.play();
}

function draw() {
  print(popup_active);
  background(inDreamWorld ? "#AFD589" : "#CBC784");

  // Splash Screen
  if (currentScreen === "splash") {
    image(splash_Image, 0, 0, width, height);

  }

  if (currentScreen === "intro") {
    //Draw background
    image(transition_Background, 0, 0, width, height);

    //House glow (if applicable)
    if (transitions_narationNumber === 2) {
      image(transition_HouseGlow[0], 0, 0, width, height);
    }

    //Draw player
    image(transition_Player[floor(playerState)], player.x, player.y, 40, 40);
    transitions_handlePlayerMovement();



    //Draw foreground
    image(transition_foregrounds[1], 0, 0, width, height);

    //Draw narration if applicable
    if (transitions_narationNumber > -1) {
      image(intro_Narrations[transitions_narationNumber], 50, height - 25 - 138, 800, 138);
    }

  }

  if (currentScreen === "level_1") {
    //BG
    background(inDreamWorld ? "#84B673" : "#AFD589");

    //Draw Maze (Helper function)
    level1_drawMaze();

    //Draw Player
    image(levels_player, player.x, player.y, 40, 40);

    //Move player
    if (keyIsPressed && !popup_active) {
      if ((keyCode == UP_ARROW && !inDreamWorld) || (keyCode == DOWN_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.y += 5;
        checkCollision();
      }
      if ((keyCode == DOWN_ARROW && !inDreamWorld) || (keyCode == UP_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.y -= 5;
        checkCollision();
      }
      if ((keyCode == LEFT_ARROW && !inDreamWorld) || (keyCode == RIGHT_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.x += 5;
        checkCollision();
      }
      if ((keyCode == RIGHT_ARROW && !inDreamWorld) || (keyCode == LEFT_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.x -= 5;
        checkCollision();
      }
    }

    //Check for collisions


    //Draw HUD
    drawHUD();

    //Show popups if active
    showPopUp(popup_num);

    //Update player states
    playerState = (playerState + 0.3) % 4;

    if (level1FirstTime) {
      popup_active = true;
      popup_num = 2;
      level1FirstTime = false;  // Set the flag to false after the first time
      player = { x: width / 2, y: height / 2 - 30 };
    }

    //Move to transition screen ------- WRAP IN AN IF STATEMENT
    // if (key === " ") {
    //   currentScreen = "between_1_and_2";
    //   player = { x: 450, y: 275 };
    //   transitions_narationNumber = -1;
    // }

    //Blur
    blurAmount = max(blurAmount - 0.5, 0);
    framesSinceLastSwitch++;
    if (blurAmount > 0) {
      filter(BLUR, blurAmount);
    }
    if (startSwitchingWorlds && framesSinceLastSwitch >= frameToSwitchAt) {
      switchWorlds();
    }

    //Move to transition screen ------- WRAP IN AN IF STATEMENT
    if (key === "a") {
      currentScreen = "between_1_and_2";
      player = { x: 450, y: 275 };
      transitions_narationNumber = 0;
    }
  }

  if (currentScreen === "between_1_and_2") {
    //Draw background
    image(transition_Background, 0, 0, width, height);
    //House glow (if applicable)
    if (transitions_narationNumber === 1) {
      image(transition_HouseGlow[1], 0, 0, width, height);
    }

    //Draw player
    image(transition_Player[floor(playerState)], player.x, player.y, 40, 40);
    transitions_handlePlayerMovement();

    //Draw foreground
    image(transition_foregrounds[2], 0, 0, width, height);

    //Draw narration if applicable
    if (transitions_narationNumber > -1) {
      image(between1and2_Narrations[transitions_narationNumber], 50, height - 25 - 138, 800, 138);
    }
  }

  if (currentScreen === "level_2") {
    if (level2FirstTime) {
      popup_active = true;
      popup_num = 5;
    }
    //BG
    background(inDreamWorld ? "#84B673" : "#AFD589");

    //Draw Maze (Helper function)
    level2_drawMaze();

    //Draw Player
    image(levels_player, player.x, player.y, 40, 40);

    //Move player
    if (keyIsPressed && !popup_active) {
      if ((keyCode == UP_ARROW && !inDreamWorld) || (keyCode == DOWN_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.y += 5;
        demonPosition.y1 += 5;
        demonPosition.y2 += 5;
        demonPosition.y3 += 5;
        checkCollision();
      }
      if ((keyCode == DOWN_ARROW && !inDreamWorld) || (keyCode == UP_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.y -= 5;
        demonPosition.y1 -= 5;
        demonPosition.y2 -= 5;
        demonPosition.y3 -= 5;
        checkCollision();
      }
      if ((keyCode == LEFT_ARROW && !inDreamWorld) || (keyCode == RIGHT_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.x += 5;
        demonPosition.x1 += 5;
        demonPosition.x2 += 5;
        demonPosition.x3 += 5;
        checkCollision();
      }
      if ((keyCode == RIGHT_ARROW && !inDreamWorld) || (keyCode == LEFT_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.x -= 5;
        demonPosition.x1 -= 5;
        demonPosition.x2 -= 5;
        demonPosition.x3 -= 5;
        checkCollision();
      }
    }

    //Draw demon
    if (inDreamWorld) {
      mamaDemonBehindYou();
      image(levelDemon[floor(playerState)], demonPosition.x1, demonPosition.y1, 40, 40);
      image(levelDemon[floor(playerState)], demonPosition.x2, demonPosition.y2, 40, 40);
      image(levelDemon[floor(playerState)], demonPosition.x3, demonPosition.y3, 40, 40);
    }

    //Draw HUD
    drawHUD();

    //Show popups if active
    showPopUp(popup_num);

    //Update player states
    playerState = (playerState + 0.3) % 4;

    //Move to transition screen ------- WRAP IN AN IF STATEMENT
    // if (key === " ") {
    //   currentScreen = "between_1_and_2";
    //   player = { x: 450, y: 275 };
    //   transitions_narationNumber = -1;
    // }

    //Blur
    blurAmount = max(blurAmount - 0.5, 0);
    framesSinceLastSwitch++;
    if (blurAmount > 0) {
      filter(BLUR, blurAmount);
    }
    if (framesSinceLastSwitch >= frameToSwitchAt) {
      switchWorlds();
    }

    if (key === "a") {
      currentScreen = "between_2_and_3";
      player = { x: 450, y: 275 };
      transitions_narationNumber = 0;
    }
  }

  if (currentScreen === "between_2_and_3") {
    //Draw background
    image(transition_Background, 0, 0, width, height);

    //Draw player
    image(transition_Player[floor(playerState)], player.x, player.y, 40, 40);
    transitions_handlePlayerMovement();

    //House glow (if applicable)
    if (transitions_narationNumber === 0) {
      image(transition_HouseGlow[2], 0, 0, width, height);
    }

    //Draw foreground
    image(transition_foregrounds[3], 0, 0, width, height);

    //Draw narration if applicable
    if (transitions_narationNumber > -1) {
      image(between2and3_Narrations[transitions_narationNumber], 50, height - 25 - 138, 800, 138);
    }
  }

  if (currentScreen === "level_3") {
    //BG
    background(inDreamWorld ? "#84B673" : "#AFD589");

    if (level3FirstTime) {
      popup_active = true;
      popup_num = 7;
    }

    //Draw Maze (Helper function)
    level3_drawMaze();

    //Draw Player
    image(levels_player, player.x, player.y, 40, 40);

    //Move player
    if (keyIsPressed && !popup_active) {
      if ((keyCode == UP_ARROW && !inDreamWorld) || (keyCode == DOWN_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.y += level3_player_speed;
        demonPosition.y1 += level3_player_speed;
        demonPosition.y2 += level3_player_speed;
        demonPosition.y3 += level3_player_speed;
        checkCollision();
      }
      if ((keyCode == DOWN_ARROW && !inDreamWorld) || (keyCode == UP_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.y -= level3_player_speed;
        demonPosition.y1 -= level3_player_speed;
        demonPosition.y2 -= level3_player_speed;
        demonPosition.y3 -= level3_player_speed;
        checkCollision();
      }
      if ((keyCode == LEFT_ARROW && !inDreamWorld) || (keyCode == RIGHT_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.x += level3_player_speed;
        demonPosition.x1 += level3_player_speed;
        demonPosition.x2 += level3_player_speed;
        demonPosition.x3 += level3_player_speed;
        checkCollision();
      }
      if ((keyCode == RIGHT_ARROW && !inDreamWorld) || (keyCode == LEFT_ARROW && inDreamWorld)) {
        prevMazePosition.x = mazePosition.x;
        prevMazePosition.y = mazePosition.y;
        mazePosition.x -= level3_player_speed;
        demonPosition.x1 -= level3_player_speed;
        demonPosition.x2 -= level3_player_speed;
        demonPosition.x3 -= level3_player_speed;
        checkCollision();
      }
    }

    //Draw demon
    if (inDreamWorld) {
      mamaDemonBehindYou();
      image(levelDemon[floor(playerState)], demonPosition.x1, demonPosition.y1, 40, 40);
      image(levelDemon[floor(playerState)], demonPosition.x2, demonPosition.y2, 40, 40);
      image(levelDemon[floor(playerState)], demonPosition.x3, demonPosition.y3, 40, 40);
    }

    //Draw HUD
    drawHUD();
    running();

    //Show popups if active
    showPopUp(popup_num);

    //Update player states
    playerState = (playerState + 0.3) % 4;

    //Move to transition screen ------- WRAP IN AN IF STATEMENT
    // if (key === " ") {
    //   currentScreen = "between_1_and_2";
    //   player = { x: 450, y: 275 };
    //   transitions_narationNumber = -1;
    // }

    //Blur
    blurAmount = max(blurAmount - 0.5, 0);
    framesSinceLastSwitch++;
    if (blurAmount > 0) {
      filter(BLUR, blurAmount);
    }
    if (framesSinceLastSwitch >= frameToSwitchAt) {
      switchWorlds();
    }

    if (key === "a") {
      currentScreen = "after_3";
      player = { x: 450, y: 275 };
      transitions_narationNumber = 0;
    }
  }

  // After Level 3
  if (currentScreen === "after_3") {
    image(nightmareQueen[0], 0, 0, width, height);
    if (transitions_narationNumber > -1) {
      image(after_3_Narrations[transitions_narationNumber], 50, height - 25 - 138, 800, 138);
    }
  }

  if (currentScreen === "death") {
    deathFrame = deathFrame + 0.1;
    let deathFrame_wholeNumber = min(floor(deathFrame), 8)
    image(nightmareQueen[deathFrame_wholeNumber], 0, 0, width, height);
    image(death_Narration, 50, height - 25 - 138, 800, 138);

    if (deathFrame_wholeNumber >= 8) {
      setTimeout(function () {
        currentScreen = "after_death"
      }, 1000);
    }
  }

  if (currentScreen === "after_death") {
    image(endingImage, 0, 0, width, height);
  }

  // Future Screens
}

function keyPressed() {
  if (currentScreen === "splash") {
    if (key === ' ') {
      currentScreen = "intro"
      music_intro_music.stop();
      music_intro_music.play();
    }
  }

  if (currentScreen === "intro") {
    if (key === ' ') {
      transitions_narationNumber++;
      if (transitions_narationNumber === 3 && (dist(player.x, player.y, 280, 100) >= 100)) {
        transitions_narationNumber = 2;
      }
      if (transitions_narationNumber >= 8) {
        currentScreen = "level_1";
      }
    }
  }

  if (currentScreen === "level_2") {
    if (key === " ") {
      level2FirstTime = false;
    }
  }

  if (currentScreen === "level_3") {
    if (key === " ") {
      level3FirstTime = false;
    }
  }


  if (currentScreen === "level_3") {
    if (level3_can_run === 1 && keyCode == SHIFT) {
      level3_running = 1;
    }
  }

  if (currentScreen === "between_1_and_2") {
    if (key === ' ') {
      transitions_narationNumber++;
      if (transitions_narationNumber === 2 && (dist(player.x, player.y, 650, 150) >= 100)) {
        transitions_narationNumber = 1;
      }
      if (transitions_narationNumber >= 8) {
        currentScreen = "level_2";
        startLevel2();
        transitions_narationNumber = 0;
        popup_active = true;
        popup_num = 5;
      }
    }
  }

  if (currentScreen === "between_2_and_3") {
    if (key === ' ') {
      transitions_narationNumber++;
      if (transitions_narationNumber === 1 && (dist(player.x, player.y, 650, 400) >= 100)) {
        transitions_narationNumber = 0;
      }
      if (transitions_narationNumber >= 8) {
        currentScreen = "level_3";
        startLevel3();
        player = { x: 450, y: 275 };
        transitions_narationNumber = 0;
        popup_active = true;
        popup_num = 5;
      }
    }
  }

  if (currentScreen === "after_3") {
    if (key === ' ') {
      transitions_narationNumber++;
      if (transitions_narationNumber >= 3) {
        currentScreen = "death";
      }
    }
  }

  if (popup_active && key === " " && (currentScreen === "level_1" || currentScreen === "level_2" || currentScreen === "level_3")) {
    popup_active = false;
    if (popup_num === 0 && HUD_health <= 0) {
      if (currentScreen === "level_1") {
        startLevel1();
        transitions_narationNumber = 0;
      }
      else if (currentScreen === "level_2") {
        startLevel2();
        transitions_narationNumber = 0;
      }
      else if (currentScreen === "level_3") {
        startLevel3();
        transitions_narationNumber = 0;
      }
    }
    else if (popup_num === 1) {
      currentScreen = "between_1_and_2";
      music_neighbourhood.play();
      music_dream_background.stop();
      music_reality_background.stop();
      music_congratulations.stop();
      transitions_narationNumber = 0;
    } else if (popup_num === 9) {
      currentScreen = "between_2_and_3";
      music_neighbourhood.play();
      music_dream_background.stop();
      music_reality_background.stop();
      music_congratulations.stop();
      transitions_narationNumber = 0;
    }
    else if (popup_num === 10) {
      currentScreen = "after_3";
      music_dream_background.stop();
      music_reality_background.stop();
      transitions_narationNumber = 0;

    } else if (popup_num === 3) {
      startSwitchingWorlds = true;
      switchWorlds();
    }
  }
}

//Helper functions

//Handle plyer movement between the houses
function transitions_handlePlayerMovement() {
  // Allow movement of character using arrow keys (for debugging or narrative effect)
  if (keyIsDown(UP_ARROW)) {
    player.x = constrain(player.x + 2, 300, 600);
    player.y = constrain(player.y - 1, 150, 375);
    playerState = (playerState + 0.3) % 4;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.x = constrain(player.x - 2, 300, 600);
    player.y = constrain(player.y + 1, 150, 375);
    playerState = (playerState + 0.3) % 4;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x = constrain(player.x + 2, 300, 600);
    player.y = constrain(player.y + 1, 150, 375);
    playerState = (playerState + 0.3) % 4;
  }
  if (keyIsDown(LEFT_ARROW)) {
    player.x = constrain(player.x - 2, 300, 600);
    player.y = constrain(player.y - 1, 150, 375);
    playerState = (playerState + 0.3) % 4;
  }
}

function startLevel1() {
  currentScreen = "level_1";
  inDreamWorld = false;
  mazePosition = { x: -710, y: 100 };
  prevMazePosition = { x: -710, y: 100 };
  player = { x: width / 2, y: height / 2 - 20 };
  gameMap = OGMap;
  HUD_health = 3;
  HUD_objectImage = 0;
  popup_active = true;
  popup_num = 2;
  music_intro_music.stop();
  music_dream_background.stop();
  music_reality_background.play();
  transitions_narationNumber = 0;
  print(player)
}

function startLevel2() {
  currentScreen = "level_2";
  popup_active = true;
  popup_num = 5;
  inDreamWorld = false;
  mazePosition = { x: -710, y: 235 };
  prevMazePosition = { x: -710, y: 235 };
  player = { x: width / 2, y: height / 2 };
  OGMap = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
    [2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2],
    [2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 3, 1, 2],
    [2, 1, 1, 2, 2, 2, 2, 4, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2],
    [2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 2, 2],
    [2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 2, 2],
    [2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2],
    [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2],
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2],
    [2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2],
    [2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2],
    [2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2],
    [2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2],
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2],
    [2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2],
    [2, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2],
    [2, 1, 6, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
  ];
  gameMap = OGMap;
  HUD_health = 3;
  HUD_objectImage = 0;
  HUD_objectImage = 4;
  music_neighbourhood.stop();
  music_dream_background.stop();
  music_reality_background.play();
}

function startLevel3() {
  currentScreen = "level_3";
  inDreamWorld = false;
  mazePosition = { x: -710, y: 235 };
  prevMazePosition = { x: -710, y: 235 };
  player = { x: width / 2, y: height / 2 };
  OGMap = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2],
    [2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2],
    [2, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 6, 1, 2, 2, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 1, 1, 3, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2],
    [2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    [2, 2, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 2, 2],
    [2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 2, 2],
    [2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 2, 2],
    [2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2],
    [2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 4, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2],
    [2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
  ];
  gameMap = OGMap;
  HUD_health = 3;
  HUD_objectImage = 0;
  popup_active = true;
  popup_num = 7;
  HUD_objectImage = 8;
  music_neighbourhood.stop();
  music_dream_background.stop();
  music_reality_background.play();
  demonPosition = { x1: 100, y1: 100, x2: 800, y2: 100, x3: 800, y3: 800 };
}

function level1_drawMaze() {

  // Level 1 Map (each number represents a different tile)
  // 1: Background/Grass, 2: Wall, 3: Object1, 4: Object2,
  // 5: Monster (only in dream world), 6: Unused, 7: Potion,
  // 8: Octopus (only appears when objects & potion are collected)

  for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[y].length; x++) {
      if (gameMap[y][x] === 1) {
      }

      else if (gameMap[y][x] === 2) {
        if (!inDreamWorld) {
          image(levelWalls[0], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        } else {
          image(levelWalls[1], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }

      else if (gameMap[y][x] === 3) {
        image(levels_objects[0], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
      }

      else if (gameMap[y][x] === 4) {
        if (HUD_objectImage === 1 || HUD_objectImage === 3) {
          image(levels_objects[1], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }

      else if (gameMap[y][x] === 5) {
        if (inDreamWorld) {
          image(levelDemon[floor(playerState)], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }

      else if (gameMap[y][x] === 6) {
        if (HUD_objectImage >= 3 && inDreamWorld) {
          image(levelOctopus, mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }
    }
  }


}

function level2_drawMaze() {
  // Level 1 Map (each number represents a different tile)
  // 1: Background/Grass, 2: Wall, 3: Object1, 4: Object2,
  // 5: Monster (only in dream world), 6: Unused, 7: Potion,
  // 8: Octopus (only appears when objects & potion are collected)

  for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[y].length; x++) {
      if (gameMap[y][x] === 1) {
      }

      else if (gameMap[y][x] === 2) {
        if (!inDreamWorld) {
          image(levelWalls[0], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        } else {
          image(levelWalls[1], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }

      else if (gameMap[y][x] === 3) {
        image(levels_objects[2], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
      }

      else if (gameMap[y][x] === 4) {
        if (HUD_objectImage === 5 || HUD_objectImage === 7) {
          image(levels_objects[3], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }

      else if (gameMap[y][x] === 5) {
        if (inDreamWorld) {
          image(levelDemon[floor(playerState)], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }

      else if (gameMap[y][x] === 6) {
        if (HUD_objectImage >= 7 && inDreamWorld) {
          image(levelOctopus, mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }
    }
  }


}

function level3_drawMaze() {
  // Level 1 Map (each number represents a different tile)
  // 1: Background/Grass, 2: Wall, 3: Object1, 4: Object2,
  // 5: Monster (only in dream world), 6: Unused, 7: Potion,
  // 8: Octopus (only appears when objects & potion are collected)

  for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[y].length; x++) {
      if (gameMap[y][x] === 1) {
      }

      else if (gameMap[y][x] === 2) {
        if (!inDreamWorld) {
          image(levelWalls[0], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        } else {
          image(levelWalls[1], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }

      else if (gameMap[y][x] === 3) {
        image(levels_objects[4], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
      }

      else if (gameMap[y][x] === 4) {
        if (HUD_objectImage === 9 || HUD_objectImage === 11) {
          image(levels_objects[5], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }

      else if (gameMap[y][x] === 5) {
        if (inDreamWorld) {
          image(levelDemon[floor(playerState)], mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }

      else if (gameMap[y][x] === 6) {
        if (HUD_objectImage >= 11 && inDreamWorld) {
          image(levelOctopus, mazePosition.x + (x * tilesize), mazePosition.y + (y * tilesize), tilesize, tilesize);
        }
      }
    }
  }


}

// Check for collision
function checkCollision() {
  let centerX = player.x - mazePosition.x + 20;
  let centerY = player.y - mazePosition.y + 20;

  for (let ty = floor((centerY - 10) / tilesize); ty <= floor((centerY + 10) / tilesize); ty++) {
    for (let tx = floor((centerX - 10) / tilesize); tx <= floor((centerX + 10) / tilesize); tx++) {
      if (gameMap[ty] && gameMap[ty][tx] === 2) {
        mazePosition.x = prevMazePosition.x;
        mazePosition.y = prevMazePosition.y;
        return;
      }

      if (gameMap[ty] && gameMap[ty][tx] === 3) {
        music_item_collected.play();
        gameMap[ty][tx] = 1;
        if (currentScreen === "level_1") {
          HUD_objectImage = 1;
          setTimeout(function () {
            popup_active = true;
            popup_num = 3;
          }, 1000);
        }
        else if (currentScreen === "level_2") {
          HUD_objectImage = 5;
        }
        else if (currentScreen === "level_3") {
          HUD_objectImage = 9;
        }
      }

      else if (gameMap[ty] && gameMap[ty][tx] === 4) {
        gameMap[ty][tx] = 1;
        if (currentScreen === "level_1") {
          HUD_objectImage = 3;
          setTimeout(function () {
            popup_active = true;
            popup_num = 4;
          }, 500);
        }
        else if (currentScreen === "level_2") {
          HUD_objectImage = 7;
          setTimeout(function () {
            popup_active = true;
            popup_num = 6;
          }, 500);
        }
        else if (currentScreen === "level_3") {
          HUD_objectImage = 11;
          setTimeout(function () {
            popup_active = true;
            popup_num = 8;
          }, 500);
        }
      }

      else if (gameMap[ty] && gameMap[ty][tx] === 5 && inDreamWorld) {
        mazePosition.x = prevMazePosition.x;
        mazePosition.y = prevMazePosition.y;
        gameMap[ty][tx] = 1;
        HUD_health--;
        music_health_lost.play();

        if (HUD_health <= 0) {
          popup_active = true;
          popup_num = 0;
          music_dream_background.stop();
          music_reality_background.stop();
        }
      }

      else if (gameMap[ty] && gameMap[ty][tx] === 6) {
        if (inDreamWorld && (HUD_objectImage === 3)) {
          gameMap[ty][tx] = 1;
          setTimeout(function () {
            popup_active = true;
            popup_num = 1;
            music_reality_background.stop();
            music_dream_background.stop();
            music_congratulations.play();
          }, 500);
        } else if (inDreamWorld && (HUD_objectImage === 7)) {
          gameMap[ty][tx] = 1;
          setTimeout(function () {
            popup_active = true;
            popup_num = 9;
            music_reality_background.stop();
            music_dream_background.stop();
            music_congratulations.play();
          }, 500);
        } else if (inDreamWorld && (HUD_objectImage === 11)) {
          gameMap[ty][tx] = 1;
          setTimeout(function () {
            popup_active = true;
            popup_num = 10;
            music_reality_background.stop();
            music_dream_background.stop();
            music_congratulations.play();
          }, 500);
        }
      }
    }
  }
}



function drawHUD() {
  image(HUD_hearts[3 - HUD_health], width - 125, 25, 100, 30);
  image(HUD_objects[HUD_objectImage], 25, 25, 100, 40);
  if (!inDreamWorld) {
    image(HUD_dream_real_icon[0], width - 125 - 30 - 20, 25, 30, 30);
  } else {
    image(HUD_dream_real_icon[1], width - 125 - 30 - 20, 25, 30, 30);
  }

  if (currentScreen === "level_3") {
    if (level3_running) {
      image(level3_shoes[2], 145, 25, 40, 40);
    } else {
      image(level3_shoes[level3_can_run], 145, 25, 40, 40);
    }
  }
}

function showPopUp(num) {
  if (popup_active) {
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    image(popup_images[num], 137, 100, 626, 400);
    blurAmount = 0;
  }
}

function switchWorlds() {
  blurAmount = 20;
  inDreamWorld = !inDreamWorld;
  framesSinceLastSwitch = 0;
  frameToSwitchAt = random(60 * 7, 60 * 12);

  if (inDreamWorld) {
    music_dream_background.play();
    music_reality_background.stop();

  } else {
    music_reality_background.play();
    music_dream_background.stop();

  }
}

function mamaDemonBehindYou() {
  if (!popup_active) {
    //Move towards player
    let dx1 = player.x - demonPosition.x1;
    let dx2 = player.x - demonPosition.x2;
    let dx3 = player.x - demonPosition.x3;
    let dy1 = player.y - demonPosition.y1;
    let dy2 = player.y - demonPosition.y2;
    let dy3 = player.y - demonPosition.y3;

    // Calculate the distance to the player
    let distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    let distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    let distance3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

    if (distance1 >= 5 && distance2 >= 5 && distance3 >= 5 && HUD_health > 0) {
      let dirX1 = dx1 / distance1;
      let dirX2 = dx2 / distance2;
      let dirX3 = dx3 / distance3;
      let dirY1 = dy1 / distance1;
      let dirY2 = dy2 / distance2;
      let dirY3 = dy3 / distance3;

      demonPosition.x1 += dirX1 * 0.75;
      demonPosition.x2 += dirX2 * 0.75;
      demonPosition.x3 += dirX3 * 0.75;
      demonPosition.y1 += dirY1 * 0.75;
      demonPosition.y2 += dirY2 * 0.75;
      demonPosition.y3 += dirY3 * 0.75;
    }

    if (distance1 <= 5) {
      HUD_health--;
      music_health_lost.play();
      print(HUD_health);
      demonPosition.x1 = 100;
      demonPosition.y1 = 100;
    }
    if (distance2 <= 5) {
      HUD_health--;
      music_health_lost.play();
      print(HUD_health);
      demonPosition.x2 = 800;
      demonPosition.y2 = 100;
    }
    if (distance3 <= 5) {
      HUD_health--;
      music_health_lost.play();
      print(HUD_health);
      demonPosition.x3 = 800;
      demonPosition.y3 = 800;
    }

    if (HUD_health <= 0) {
      popup_active = true;
      popup_num = 0;
    }

    //Move when maze moves

    //Check for collision
    //Lose life
    //Reset demon position
  }
}

function running() {
  if (level3_can_run === 1 && level3_running === 1) {
    level3_player_speed = 10;
    runTimeLeft--;
    if (runTimeLeft <= 0) {
      runTimeLeft = 300;
      timeSinceLastRun = 0;
      level3_can_run = 0;
      level3_running = 0;
    }
  } else {
    timeSinceLastRun++;
    level3_player_speed = 5;
    if (timeSinceLastRun >= 600) {
      level3_can_run = 1;
    }
  }
}