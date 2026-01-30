// Player and Leaderboard Management
let currentPlayer = "";
let leaderboard = JSON.parse(window.localStorage.getItem("snakeLeaderboard")) || [];

function updateLeaderboard(playerName, playerScore) {
  // Find existing player or add new
  const existingIndex = leaderboard.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase());
  
  if (existingIndex >= 0) {
    // Update if new high score
    if (playerScore > leaderboard[existingIndex].score) {
      leaderboard[existingIndex].score = playerScore;
    }
  } else {
    // Add new player
    leaderboard.push({ name: playerName, score: playerScore });
  }
  
  // Sort by score descending and keep top 5
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  
  // Save to localStorage
  window.localStorage.setItem("snakeLeaderboard", JSON.stringify(leaderboard));
}

function renderLeaderboard() {
  const listContainer = document.getElementById("leaderboard-list");
  if (!listContainer) return;
  
  if (leaderboard.length === 0) {
    listContainer.innerHTML = '<p class="no-scores">No scores yet. Be the first!</p>';
    return;
  }
  
  listContainer.innerHTML = leaderboard.map((player, index) => `
    <div class="leaderboard-item">
      <span class="rank">#${index + 1}</span>
      <span class="name">${player.name}</span>
      <span class="high-score">${player.score}</span>
    </div>
  `).join("");
}

function startGame() {
  const playerInput = document.getElementById("player-name");
  const playerName = playerInput.value.trim();
  
  if (!playerName) {
    playerInput.style.borderColor = "#ff4444";
    playerInput.placeholder = "Please enter your name!";
    return;
  }
  
  currentPlayer = playerName;
  
  // Hide home screen, show game
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  
  // Display player name in game
  document.getElementById("player-display").textContent = `Player: ${currentPlayer}`;
  
  // Initialize game
  initializeGame();
}

function goHome() {
  // Save score to leaderboard if player has scored
  if (currentPlayer && score > 0) {
    updateLeaderboard(currentPlayer, score);
  }
  
  // Stop game
  cancelAnimationFrame(requestID);
  isGameOver = true;
  
  // Show home screen, hide game
  document.getElementById("home-screen").style.display = "flex";
  document.getElementById("game-container").style.display = "none";
  
  // Render updated leaderboard
  renderLeaderboard();
}

// Wait for DOM to load before setting up event listeners
document.addEventListener("DOMContentLoaded", function() {
  // Start game button
  document.getElementById("start-game-btn").addEventListener("click", startGame);
  
  // Enter key to start
  document.getElementById("player-name").addEventListener("keypress", function(e) {
    if (e.key === "Enter") startGame();
  });
  
  // Home button
  document.getElementById("home-btn").addEventListener("click", goHome);
  
  // Render leaderboard on load
  renderLeaderboard();
});

let dom_replay = document.querySelector("#replay");
let dom_score = document.querySelector("#score");
let dom_canvas = document.createElement("canvas");

// Responsive canvas size
function getCanvasSize() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 380) return 280;
  if (screenWidth <= 480) return 320;
  if (screenWidth <= 520) return 360;
  if (screenWidth <= 768) return 400;
  return 500;
}

const canvasSize = getCanvasSize();
let W, H, CTX;

let snake,
  food,
  currentHue,
  cells = 20,
  cellSize,
  isGameOver = false,
  tails = [],
  score = 0,
  maxScore = window.localStorage.getItem("maxScore") || undefined,
  particles = [],
  splashingParticleCount = 20,
  cellsCount,
  requestID,
  foodEaten = 0,  // Track food eaten for bonus food
  isBonusFood = false;  // Flag for big bonus food

  let helpers = {
    Vec: class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
      }
      mult(v) {
        if (v instanceof helpers.Vec) {
          this.x *= v.x;
          this.y *= v.y;
          return this;
        } else {
          this.x *= v;
          this.y *= v;
          return this;
        }
      }
    },
    isCollision(v1, v2) {
      return v1.x == v2.x && v1.y == v2.y;
    },
    garbageCollector() {
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].size <= 0) {
          particles.splice(i, 1);
        }
      }
    },
    drawGrid() {
      CTX.lineWidth = 1.1;
      CTX.strokeStyle = "#181825";
      CTX.shadowBlur = 0;
      for (let i = 1; i < cells; i++) {
        let f = (W / cells) * i;
        CTX.beginPath();
        CTX.moveTo(f, 0);
        CTX.lineTo(f, H);
        CTX.stroke();
        CTX.beginPath();
        CTX.moveTo(0, f);
        CTX.lineTo(W, f);
        CTX.stroke();
        CTX.closePath();
      }
    },
    randHue() {
      return ~~(Math.random() * 360);
    },
    hsl2rgb(hue, saturation, lightness) {
        if (hue == undefined) {
          return [0, 0, 0];
        }
        var chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        var huePrime = hue / 60;
        var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));
    
        huePrime = ~~huePrime;
        var red;
        var green;
        var blue;
    
        if (huePrime === 0) {
          red = chroma;
          green = secondComponent;
          blue = 0;
        } else if (huePrime === 1) {
          red = secondComponent;
          green = chroma;
          blue = 0;
        } else if (huePrime === 2) {
          red = 0;
          green = chroma;
          blue = secondComponent;
        } else if (huePrime === 3) {
          red = 0;
          green = secondComponent;
          blue = chroma;
        } else if (huePrime === 4) {
          red = secondComponent;
          green = 0;
          blue = chroma;
        } else if (huePrime === 5) {
          red = chroma;
          green = 0;
          blue = secondComponent;
        }
    
        var lightnessAdjustment = lightness - chroma / 2;
        red += lightnessAdjustment;
        green += lightnessAdjustment;
        blue += lightnessAdjustment;
    
        return [
          Math.round(red * 255),
          Math.round(green * 255),
          Math.round(blue * 255)
        ];
      },
    lerp(start, end, t) {
      return start * (1 - t) + end * t;
    }
  };


  let KEY = {
    ArrowUp: false,
    ArrowRight: false,
    ArrowDown: false,
    ArrowLeft: false,
    resetState() {
      this.ArrowUp = false;
      this.ArrowRight = false;
      this.ArrowDown = false;
      this.ArrowLeft = false;
    },
    setDirection(direction) {
      // Prevent reversing direction
      if (direction === "ArrowUp" && this.ArrowDown) return;
      if (direction === "ArrowDown" && this.ArrowUp) return;
      if (direction === "ArrowLeft" && this.ArrowRight) return;
      if (direction === "ArrowRight" && this.ArrowLeft) return;
      this[direction] = true;
      Object.keys(this)
        .filter((f) => f !== direction && f !== "listen" && f !== "resetState" && f !== "setDirection" && f !== "listenButtons")
        .forEach((k) => {
          this[k] = false;
        });
    },
    listen() {
      // Map keyboard keys to button IDs
      const keyToBtn = {
        ArrowUp: "btn-up",
        ArrowDown: "btn-down",
        ArrowLeft: "btn-left",
        ArrowRight: "btn-right"
      };

      addEventListener(
        "keydown",
        (e) => {
          if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            this.setDirection(e.key);
            // Add glow effect to corresponding button
            const btnId = keyToBtn[e.key];
            if (btnId) {
              document.getElementById(btnId).classList.add("glow");
            }
          }
        },
        false
      );

      addEventListener(
        "keyup",
        (e) => {
          if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            // Remove glow effect from corresponding button
            const btnId = keyToBtn[e.key];
            if (btnId) {
              document.getElementById(btnId).classList.remove("glow");
            }
          }
        },
        false
      );
    },
    listenButtons() {
      // Mouse/Touch button controls
      document.getElementById("btn-up").addEventListener("click", () => this.setDirection("ArrowUp"));
      document.getElementById("btn-down").addEventListener("click", () => this.setDirection("ArrowDown"));
      document.getElementById("btn-left").addEventListener("click", () => this.setDirection("ArrowLeft"));
      document.getElementById("btn-right").addEventListener("click", () => this.setDirection("ArrowRight"));
    }
  };


class Snake{
    constructor(i, type){
        this.pos = new helpers.Vec(W / 2, H /2);
        this.dir = new helpers.Vec(0, 0);
        this.type = type;
        this.index = i;
        this.delay = 7;
        this.size = W / cells;
        this.color = "lightgreen";
        this.history = [];
        this.total = 1;
    }
    draw() {
        let { x, y } = this.pos;
        let centerX = x + this.size / 2;
        let centerY = y + this.size / 2;
        let radius = this.size / 2 - 2;
        
        // Draw the head (larger and with eyes)
        CTX.fillStyle = "#32CD32"; // Lime green for head
        CTX.shadowBlur = 20;
        CTX.shadowColor = "rgba(50, 205, 50, 0.6)";
        CTX.beginPath();
        CTX.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
        CTX.fill();
        
        // Draw eyes on the head
        CTX.shadowBlur = 0;
        CTX.fillStyle = "white";
        let eyeOffset = radius / 3;
        let eyeRadius = radius / 4;
        
        // Position eyes based on direction
        let eyeX1, eyeY1, eyeX2, eyeY2;
        if (this.dir.x > 0) { // Moving right
          eyeX1 = eyeX2 = centerX + eyeOffset;
          eyeY1 = centerY - eyeOffset;
          eyeY2 = centerY + eyeOffset;
        } else if (this.dir.x < 0) { // Moving left
          eyeX1 = eyeX2 = centerX - eyeOffset;
          eyeY1 = centerY - eyeOffset;
          eyeY2 = centerY + eyeOffset;
        } else if (this.dir.y > 0) { // Moving down
          eyeY1 = eyeY2 = centerY + eyeOffset;
          eyeX1 = centerX - eyeOffset;
          eyeX2 = centerX + eyeOffset;
        } else if (this.dir.y < 0) { // Moving up
          eyeY1 = eyeY2 = centerY - eyeOffset;
          eyeX1 = centerX - eyeOffset;
          eyeX2 = centerX + eyeOffset;
        } else { // Default (not moving)
          eyeX1 = centerX - eyeOffset;
          eyeX2 = centerX + eyeOffset;
          eyeY1 = eyeY2 = centerY - eyeOffset;
        }
        
        // White part of eyes
        CTX.beginPath();
        CTX.arc(eyeX1, eyeY1, eyeRadius, 0, Math.PI * 2);
        CTX.arc(eyeX2, eyeY2, eyeRadius, 0, Math.PI * 2);
        CTX.fill();
        
        // Black pupils
        CTX.fillStyle = "black";
        CTX.beginPath();
        CTX.arc(eyeX1, eyeY1, eyeRadius / 2, 0, Math.PI * 2);
        CTX.arc(eyeX2, eyeY2, eyeRadius / 2, 0, Math.PI * 2);
        CTX.fill();
        
        // Draw the body segments (round with tapering tail)
        if (this.total >= 2) {
          let totalSegments = this.history.length - 1;
          for (let i = 0; i < totalSegments; i++) {
            let { x, y } = this.history[i];
            let bodyCenterX = x + this.size / 2;
            let bodyCenterY = y + this.size / 2;
            
            // Calculate tapering radius - smaller towards the tail (index 0 is tail)
            let taperRatio = (i + 1) / totalSegments; // 0 at tail, 1 near head
            let minRadius = radius * 0.4; // Minimum size for tail
            let segmentRadius = minRadius + (radius - minRadius) * taperRatio;
            
            // Gradient color from light to darker green
            let colorIntensity = Math.max(80, 180 - ((totalSegments - i) * 5));
            CTX.fillStyle = `rgb(50, ${colorIntensity}, 50)`;
            CTX.shadowBlur = 5;
            CTX.shadowColor = "rgba(50, 205, 50, 0.3)";
            
            CTX.beginPath();
            CTX.arc(bodyCenterX, bodyCenterY, segmentRadius, 0, Math.PI * 2);
            CTX.fill();
            
            // Add subtle border
            CTX.strokeStyle = "rgba(0, 100, 0, 0.5)";
            CTX.lineWidth = 1;
            CTX.stroke();
          }
        }
        CTX.shadowBlur = 0;
      }
      walls() {
        let { x, y } = this.pos;
        // End game if snake hits the wall
        if (x + cellSize > W || y + cellSize > H || x < 0 || y < 0) {
          isGameOver = true;
        }
      }
      controlls() {
        let dir = this.size;
        if (KEY.ArrowUp) {
          this.dir = new helpers.Vec(0, -dir);
        }
        if (KEY.ArrowDown) {
          this.dir = new helpers.Vec(0, dir);
        }
        if (KEY.ArrowLeft) {
          this.dir = new helpers.Vec(-dir, 0);
        }
        if (KEY.ArrowRight) {
          this.dir = new helpers.Vec(dir, 0);
        }
      }
      selfCollision() {
        for (let i = 0; i < this.history.length; i++) {
          let p = this.history[i];
          if (helpers.isCollision(this.pos, p)) {
            isGameOver = true;
          }
        }
      }
      update() {
        this.walls();
        this.draw();
        this.controlls();
        if (!this.delay--) {
          if (helpers.isCollision(this.pos, food.pos)) {
            if (isBonusFood) {
              // Bonus food: 5 points, grow by 3 segments
              incrementScore(5);
              // Add 3 new segments by duplicating the last position
              for (let j = 0; j < 3; j++) {
                this.history.unshift(new helpers.Vec(this.pos.x, this.pos.y));
              }
              this.total += 3;
              particleSplash();
              isBonusFood = false;
              foodEaten = 0;
              food.spawn();
            } else {
              // Normal food: 1 point, grow by 1 segment
              incrementScore(1);
              this.total++;
              foodEaten++;
              particleSplash();
              food.spawn();
              
              // After 5 normal foods, next spawn will be bonus food
              if (foodEaten >= 5) {
                isBonusFood = true;
                food.spawn(); // Spawn the bonus food immediately
              }
            }
          }
          this.history[this.total - 1] = new helpers.Vec(this.pos.x, this.pos.y);
          for (let i = 0; i < this.total - 1; i++) {
            this.history[i] = this.history[i + 1];
          }
          this.pos.add(this.dir);
          this.delay = 7;
          this.total > 3 ? this.selfCollision() : null;
        }
      }
    }

    class Food {
        constructor() {
          this.pos = new helpers.Vec(
            ~~(Math.random() * cells) * cellSize,
            ~~(Math.random() * cells) * cellSize
          );
          this.color = "red";
          this.size = cellSize;
          this.pulseAngle = 0;
        }
        draw() {
          let { x, y } = this.pos;
          CTX.globalCompositeOperation = "lighter";
          
          if (isBonusFood) {
            // Big bonus food - golden, larger, pulsing
            this.pulseAngle += 0.1;
            let pulseScale = 1 + Math.sin(this.pulseAngle) * 0.15;
            let bonusSize = this.size * 1.8 * pulseScale;
            let bonusCenterX = x + this.size / 2;
            let bonusCenterY = y + this.size / 2;
            
            // Outer glow
            CTX.shadowBlur = 30;
            CTX.shadowColor = "gold";
            
            // Draw golden bonus food
            let gradient = CTX.createRadialGradient(
              bonusCenterX, bonusCenterY, 0,
              bonusCenterX, bonusCenterY, bonusSize / 2
            );
            gradient.addColorStop(0, "#FFD700");
            gradient.addColorStop(0.5, "#FFA500");
            gradient.addColorStop(1, "#FF8C00");
            
            CTX.fillStyle = gradient;
            CTX.beginPath();
            CTX.arc(bonusCenterX, bonusCenterY, bonusSize / 2, 0, Math.PI * 2);
            CTX.fill();
            
            // Star sparkle effect
            CTX.fillStyle = "white";
            CTX.font = `${bonusSize * 0.5}px Arial`;
            CTX.textAlign = "center";
            CTX.textBaseline = "middle";
            CTX.fillText("★", bonusCenterX, bonusCenterY);
          } else {
            // Normal red food
            CTX.shadowColor = this.color;
            CTX.shadowBlur = 15;
            CTX.fillStyle = this.color;
            CTX.beginPath();
            CTX.arc(x + this.size / 2, y + this.size / 2, this.size / 2, 0, Math.PI * 2);
            CTX.fill();
          }
          
          CTX.globalCompositeOperation = "source-over";
          CTX.shadowBlur = 0;
        }
        spawn() {
          let spawnSize = isBonusFood ? this.size * 2 : this.size;
          let maxCell = isBonusFood ? cells - 1 : cells;
          let randX = ~~(Math.random() * maxCell) * this.size;
          let randY = ~~(Math.random() * maxCell) * this.size;
          for (let path of snake.history) {
            if (helpers.isCollision(new helpers.Vec(randX, randY), path)) {
              return this.spawn();
            }
          }
          this.color = isBonusFood ? "gold" : "red";
          this.pos = new helpers.Vec(randX, randY);
        }
      }
      class Particle {
        constructor(pos, color, size, vel) {
          this.pos = pos;
          this.color = color;
          this.size = Math.abs(size / 2);
          this.ttl = 0;
          this.gravity = -0.2;
          this.vel = vel;
        }
        draw() {
            let { x, y } = this.pos;
            let hsl = this.color
              .split("")
              .filter((l) => l.match(/[^hsl()$% ]/g))
              .join("")
              .split(",")
              .map((n) => +n);
            let [r, g, b] = helpers.hsl2rgb(hsl[0], hsl[1] / 100, hsl[2] / 100);
            CTX.shadowColor = "white";
            CTX.shadowBlur = 0;
            CTX.globalCompositeOperation = "lighter";
            CTX.fillStyle = "white";
            CTX.fillRect(x, y, this.size, this.size);
            CTX.globalCompositeOperation = "source-over";
          }
          update() {
            this.draw();
            this.size -= 0.3;
            this.ttl += 1;
            this.pos.add(this.vel);
            this.vel.y -= this.gravity;
          }
}
function incrementScore(points = 1) {
    score += points;
    dom_score.innerText = score.toString().padStart(2, "0");
  }
  
  function particleSplash() {
    for (let i = 0; i < splashingParticleCount; i++) {
      let vel = new helpers.Vec(Math.random() * 6 - 3, Math.random() * 6 - 3);
      let position = new helpers.Vec(food.pos.x, food.pos.y);
      particles.push(new Particle(position, "", food.size, vel));
    }
  }
  
  function clear() {
    CTX.clearRect(0, 0, W, H);
  }
  

  function initializeGame() {
    // Setup canvas
    const canvasContainer = document.querySelector("#canvas");
    canvasContainer.innerHTML = ""; // Clear any existing canvas
    dom_canvas = document.createElement("canvas");
    canvasContainer.appendChild(dom_canvas);
    CTX = dom_canvas.getContext("2d");
    
    W = dom_canvas.width = canvasSize;
    H = dom_canvas.height = canvasSize;
    
    CTX.imageSmoothingEnabled = false;
    KEY.listen();
    KEY.listenButtons();  // Add mouse/touch button listeners
    cellsCount = cells * cells;
    cellSize = W / cells;
    
    // Reset game state
    score = 0;
    foodEaten = 0;
    isBonusFood = false;
    isGameOver = false;
    particles = [];
    dom_score.innerText = "00";
    
    snake = new Snake();
    food = new Food();
    dom_replay.addEventListener("click", reset, false);
    loop();
  }
  
  function loop() {
    clear();
    if (!isGameOver) {
      requestID = requestAnimationFrame(loop);
      helpers.drawGrid();
      snake.update();
      food.draw();
      for (let p of particles) {
        p.update();
      }
      helpers.garbageCollector();
    } else {
      clear();
      gameOver();
    }
  }
  

  function gameOver() {
    maxScore ? null : (maxScore = score);
    score > maxScore ? (maxScore = score) : null;
    window.localStorage.setItem("maxScore", maxScore);
    
    // Save to leaderboard
    if (currentPlayer && score > 0) {
      updateLeaderboard(currentPlayer, score);
    }
    
    // Add red glow effect to border
    document.querySelector(".moving-border-container").classList.add("game-over");
    
    CTX.fillStyle = "#4cffd7";
    CTX.textAlign = "center";
    CTX.font = "bold 30px Poppins, sans-serif";
    CTX.fillText("GAME OVER", W / 2, H / 2);
    CTX.font = "15px Poppins, sans-serif";
    CTX.fillText(`PLAYER: ${currentPlayer}`, W / 2, H / 2 + 40);
    CTX.fillText(`SCORE   ${score}`, W / 2, H / 2 + 70);
    CTX.fillText(`BEST   ${maxScore}`, W / 2, H / 2 + 95);
  }
  
  function reset() {
    dom_score.innerText = "00";
    score = 0;
    foodEaten = 0;
    isBonusFood = false;
    snake = new Snake();
    food.spawn();
    KEY.resetState();
    isGameOver = false;
    
    // Remove red glow effect from border
    document.querySelector(".moving-border-container").classList.remove("game-over");
    
    cancelAnimationFrame(requestID);
    loop();
  }
  
  // Game is now initialized from startGame() when player clicks START
