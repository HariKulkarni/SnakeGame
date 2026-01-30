# 🐍 Snake Game

A modern, feature-rich **Snake Game** built with **HTML5, CSS3, and JavaScript**. This responsive browser-based game features stunning visual effects, player profiles, leaderboards, and both keyboard and touch controls.

---

## 🚀 Features

### 🎮 Gameplay
- **Dual Control System** – Play using keyboard arrow keys OR on-screen clickable buttons
- **Touch Support** – On-screen arrow buttons perfect for mobile and tablet devices
- **Responsive Design** – Adapts to all screen sizes (desktop, tablet, mobile)
- **Realistic Snake** – Round snake with eyes that follow movement direction and tapering tail

### 🏆 Player System
- **Player Profiles** – Enter your name before playing
- **Leaderboard** – Top 5 players with highest scores displayed on home screen
- **Persistent Scores** – All scores saved in browser localStorage

### 🌟 Bonus Food System
- Eat **5 normal red foods**
- A **golden bonus food** with pulsing animation appears
- Bonus food gives **+5 points** and grows snake by **3 segments**

### ✨ Visual Effects
- **Animated Moving Border** – Flowing gradient border around game canvas
- **Red Glow on Game Over** – Border pulses red when snake dies
- **Button Glow Effects** – Buttons glow when pressed (keyboard or click)
- **Particle Effects** – Splash particles when eating food
- **Glassmorphism UI** – Modern glass-like score card and input fields

---

## 🛠️ Built With

- **HTML5** – Canvas-based rendering with semantic structure
- **CSS3** – Modern styling with gradients, animations, and glassmorphism
- **JavaScript** – Game logic, controls, and localStorage management

---

## 📁 Project Structure

```
SnakeGame-main/
├── index.html     # Main HTML with home screen and game canvas
├── style.css      # Complete styling with responsive design
├── script.js      # Game logic, player system, and leaderboard
├── favicon.png    # Snake icon for browser tab
└── README.md      # Project documentation
```

---

## ▶️ How to Play

1. **Open the Game**
   - Open `index.html` in any modern browser
   - No server setup required

2. **Enter Your Name**
   - Type your player name on the home screen
   - Click **START GAME** or press Enter

3. **Play!**
   - Use arrow keys or on-screen buttons to control the snake
   - Eat red food to grow and score points
   - After 5 foods, eat the golden bonus food for extra points!

4. **Check Leaderboard**
   - Click **HOME** to return and see top scores

---

## ⌨️ Controls

### Keyboard Controls
| Key | Action |
|-----|--------|
| ↑ | Move Up |
| ↓ | Move Down |
| ← | Move Left |
| → | Move Right |

### On-Screen Buttons
Click the arrow buttons (▲ ▼ ◀ ▶) displayed beside the game canvas.

### Game Buttons
| Button | Action |
|--------|--------|
| RESTART | Restart current game |
| 🏠 HOME | Return to home screen |

---

## 🎯 Game Rules

| Rule | Description |
|------|-------------|
| 🍎 **Eat Food** | Red food = +1 point, grow +1 segment |
| ⭐ **Bonus Food** | Golden food (after 5 foods) = +5 points, grow +3 segments |
| 🧱 **Avoid Walls** | Hitting any wall ends the game |
| 💀 **No Self-Collision** | Running into your own tail ends the game |
| 🏆 **Leaderboard** | Top 5 high scores are saved |

---

## 📱 Responsive Breakpoints

| Screen Size | Canvas Size | Layout |
|-------------|-------------|--------|
| Desktop (>900px) | 500×500 | Side-by-side |
| Tablet (768-900px) | 400×400 | Side-by-side |
| Mobile Landscape (520-768px) | 400×400 | Stacked |
| Mobile Portrait (380-520px) | 360×360 | Compact |
| Small Phones (<380px) | 280×280 | Minimal |

---

## 📌 Technical Notes

- **Canvas Rendering** – Uses HTML5 Canvas with requestAnimationFrame for smooth 60fps gameplay
- **LocalStorage** – Player scores and leaderboard persist across browser sessions
- **No Dependencies** – Pure vanilla JavaScript, no external libraries required
- **Cross-Browser** – Works on Chrome, Firefox, Edge, Safari, and mobile browsers

---

## 🎨 Customization

Edit these files to customize the game:

- **`style.css`** – Change colors, animations, and responsive breakpoints
- **`script.js`** – Modify game speed, food values, or add new features

---

## 👨‍💻 Author

Developed by **Harish**  
Project Type: Modern HTML5 Canvas Game
