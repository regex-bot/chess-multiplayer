# ♟️ Chess Game - Multiplayer Web Application

A fully functional chess game with both local and online multiplayer modes, built with vanilla JavaScript and Socket.IO. Play with friends on the same device or challenge opponents worldwide!

## 🎮 Live Demo

**[Play Now on Render](https://your-chess-game.onrender.com)** *(Replace with your deployed URL)*

## ✨ Features

### 🎯 Game Modes
- **Local Multiplayer** - Play with a friend on the same device (pass and play)
- **Online Multiplayer** - Play with anyone worldwide using shareable room codes

### ♔ Complete Chess Rules
- **All piece movements** - Pawn, Knight, Bishop, Rook, Queen, King
- **Special moves:**
  - ✅ Castling (King-side and Queen-side)
  - ✅ En Passant capture
  - ✅ Pawn promotion with piece selection modal
- **Game logic:**
  - ✅ King safety enforcement (cannot move into check)
  - ✅ Check detection with visual red highlighting
  - ✅ Checkmate and Stalemate detection
  - ✅ Draw conditions (50-move rule, insufficient material)

### 🎨 User Interface
- Clean, elegant design with gold and brown color scheme
- Move history in standard chess notation (e.g., "1. e4 e5")
- Board automatically flips for black player in online mode
- Visual indicators for:
  - Selected pieces (yellow highlight)
  - Legal moves (dots and circles)
  - Capture opportunities (red circles)
  - King in check (red square)
- Responsive design - works on desktop, tablet, and mobile
- Game over modal with winner announcement

### 🌐 Online Multiplayer Features
- Real-time move synchronization via WebSockets
- Room-based matchmaking with 6-character codes
- Choose your color (White/Black) when creating a room
- Colors automatically swap after each game
- Offer draw to opponent
- Leave room option
- Automatic opponent disconnect handling

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (Grid, Flexbox, Responsive Design)
- **JavaScript (ES6+)** - Game logic and UI

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server
- **Socket.IO** - Real-time WebSocket communication

### Deployment
- **Render.com** - Free hosting platform

## 🚀 Quick Start

### Play Online (No Installation)
Just visit the live demo link above and start playing!

### Run Locally

#### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

#### Installation Steps

1. **Clone or download this repository**
```bash
git clone https://github.com/YOUR_USERNAME/chess-game.git
cd chess-game
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open in browser**
```
http://localhost:3000
```

5. **Test multiplayer locally**
   - Open `http://localhost:3000` in one browser tab
   - Open `http://localhost:3000` in another tab (or incognito window)
   - Create a room in one tab, join with the code in the other

## 🎮 How to Play

### Local Mode
1. Click **"Local Multiplayer"**
2. Play with a friend on the same device
3. Players alternate turns (White starts first)

### Online Mode

**As Host:**
1. Click **"Online Multiplayer"**
2. Choose your color (White or Black)
3. Click **"Create New Game"**
4. Share the 6-character room code with your opponent
5. Wait for opponent to join

**As Guest:**
1. Click **"Online Multiplayer"**
2. Enter the room code from your friend
3. Click **"Join Game"**
4. Start playing!

**During Game:**
- Click a piece to select it
- Legal moves will be highlighted
- Click a highlighted square to move
- Use **"Offer Draw"** to propose a draw
- Use **"Leave Room"** to forfeit and exit

## 📁 Project Structure

```
chess-game/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── chess.js            # Game logic, UI, and Socket.IO client
├── server.js           # Backend server with Socket.IO
├── package.json        # Dependencies and scripts
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🌍 Deploy Your Own

Want to deploy your own version? Follow these steps:

### Deploy on Render (Free)

1. **Create a GitHub account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Sign up for free

2. **Upload your code to GitHub**
   - Create a new repository
   - Upload all project files (except `node_modules/`)

3. **Sign up on Render**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

4. **Create a Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Configure:
     - **Name:** `chess-game` (or any name)
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance Type:** `Free`
   - Click **"Create Web Service"**

5. **Wait for deployment** (2-5 minutes)
   - Render will build and deploy your app
   - You'll get a URL like: `https://chess-game-xxxx.onrender.com`

6. **Share and play!**
   - Your game is now live and accessible worldwide
   - Share the URL with friends

### Note on Free Tier
- Free tier sleeps after 15 minutes of inactivity
- First visitor after sleep waits ~30 seconds for wake-up
- After wake-up, works perfectly with no lag

## 🎯 Game Logic Highlights

- **Board Representation:** 8x8 2D array
- **Move Generation:** Piece-specific logic with legal move filtering
- **Check Detection:** Simulates opponent attacks on king position
- **Move Validation:** Ensures moves don't leave own king in check
- **State Management:** Tracks turn, castling rights, en passant target, move history

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Known Issues

- Free tier on Render sleeps after inactivity (expected behavior)
- Very old browsers may not support ES6 features

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📄 License

MIT License - Feel free to use and modify for your own projects

## 👨‍💻 Author

Created with passion for chess and web development

---

## 🎉 Enjoy the Game!

Whether you're a chess grandmaster or just learning, have fun playing! ♟️

**Questions or issues?** Open an issue on GitHub or contact the developer.

---

### Quick Commands Reference

```bash
# Install dependencies
npm install

# Start server (development)
npm start

# Start server (production)
NODE_ENV=production npm start
```

---

**Made with ❤️ and JavaScript**
