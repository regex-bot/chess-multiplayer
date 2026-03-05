# ♟️ Chess Online - Professional Multiplayer Chess Game

A fully-featured chess web application with local and online multiplayer modes, inspired by Chess.com. Built with vanilla JavaScript, Node.js, and Socket.IO.

## 🎮 Live Demo

**[Play Now](https://your-chess-game.onrender.com)** *(Replace with your deployed URL)*

## ✨ Features

### 🎯 Game Modes
- **Local Multiplayer** - Play with a friend on the same device (pass and play)
- **Online Multiplayer** - Play with anyone worldwide using shareable room codes

### ⏱️ Time Controls
- **No Clock** - Unlimited time for casual games
- **Blitz** - 3 min, 5 min (fast-paced games)
- **Rapid** - 10 min, 15 min (balanced gameplay)
- **Classical** - 30 min (tournament-style)

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

### 🎨 Professional UI
- Modern dark theme inspired by Chess.com
- Responsive design - works on desktop, tablet, and mobile
- Beautiful landing page with hero section and about section
- Card-based navigation with intuitive flow
- Smooth animations and transitions
- Properly colored king icons (white king in white, black king in black)
- Visual indicators for:
  - Selected pieces (yellow highlight)
  - Legal moves (dots and circles)
  - Capture opportunities (red circles)
  - King in check (red square)
  - Low time warning (pulsing clock)
- File and rank labels (a-h, 1-8) on the board

### 🌐 Online Multiplayer Features
- Real-time move synchronization via WebSockets
- Room-based matchmaking with 6-character codes
- Separate flows for creating and joining games
- Time control selection only for room creators
- Choose your color (White/Black) when creating a room
- Live chess clock with time synchronization
- In-game chat system
- Move history in standard chess notation with check (+) symbols
- Board automatically flips for black player
- Rematch system - both players must agree to play again
- Colors automatically swap after each game
- Offer draw to opponent
- Resign option
- Exit to menu anytime
- Automatic opponent disconnect handling

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Modern styling (Grid, Flexbox, CSS Variables, Animations)
- **JavaScript (ES6+)** - Game logic and UI interactions

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Socket.IO** - Real-time bidirectional communication

### Features Implementation
- **Chess Engine** - Custom implementation with legal move validation
- **Clock System** - Synchronized countdown timers
- **Chat System** - Real-time messaging
- **State Management** - Client-side game state with server validation

## 🚀 Quick Start

### Run Locally

#### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

#### Installation Steps

1. **Clone or download this repository**
```bash
git clone https://github.com/YOUR_USERNAME/chess-online.git
cd chess-online
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

### Getting Started
1. Visit the website
2. Click **"Play Now"** on the landing page
3. Choose **Local Game** or **Online Game**

### Local Mode
1. Select your preferred time control
2. Play with a friend on the same device
3. Players alternate turns (White starts first)
4. Use **"Exit to Menu"** to return

### Online Mode

**Creating a Game:**
1. Click **"Create Game"**
2. Select your preferred time control
3. Choose your color (White or Black)
4. Click **"Create Room"**
5. Share the 6-character room code with your opponent
6. Wait for opponent to join

**Joining a Game:**
1. Click **"Join Game"**
2. Enter the room code from your friend
3. Click **"Join Game"**
4. Start playing! (Time control is set by the room creator)

**During Game:**
- Click a piece to select it
- Legal moves will be highlighted
- Click a highlighted square to move
- Watch the clock countdown
- Use **Chat** tab to message opponent (online only)
- Use **Moves** tab to see game history in standard notation
- Check moves are marked with **+** symbol
- Use **"Offer Draw"** to propose a draw
- Use **"Resign"** to forfeit the game
- Use **"Exit to Menu"** to leave

**After Game:**
- Both players see game result
- Click **"Play Again"** to request rematch
- If both players agree, colors swap and new game starts
- Click **"Exit to Menu"** to return to home

## 📁 Project Structure

```
chess-online/
├── index.html          # Main HTML structure with all screens
├── styles.css          # Complete styling and responsive design
├── chess.js            # Game logic, UI, clock, chat, Socket.IO client
├── server.js           # Backend server with Socket.IO handlers
├── package.json        # Dependencies and scripts
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🎯 Game Logic Highlights

- **Board Representation:** 8x8 2D array
- **Move Generation:** Piece-specific logic with legal move filtering
- **Check Detection:** Simulates opponent attacks on king position
- **Move Validation:** Ensures moves don't leave own king in check
- **State Management:** Tracks turn, castling rights, en passant target, move history
- **Clock System:** Server-synchronized countdown with low-time warnings
- **Rematch System:** Server-side tracking ensures both players agree before restarting

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎮 Keyboard & Controls

### Mouse/Touch Controls
- Click/tap to select piece
- Click/tap highlighted square to move
- Click/tap buttons for game actions

### Chat (Online Mode)
- Type message and press Enter or click Send
- Messages appear in real-time for both players

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

### Ideas for Future Features
- [ ] Player accounts and profiles
- [ ] ELO rating system
- [ ] Game replay and analysis
- [ ] AI opponent
- [ ] Tournament mode
- [ ] Puzzle mode
- [ ] Opening trainer
- [ ] Sound effects
- [ ] Multiple board themes
- [ ] Piece set customization

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

### Technical Details

**Port Configuration:**
- Default port: 3000
- Can be changed via `PORT` environment variable

**WebSocket Events:**
- `create-room` - Create new game room with time control
- `join-room` - Join existing room
- `make-move` - Send move to opponent
- `clock-update` - Synchronize clock time
- `time-expired` - Handle time forfeit
- `chat-message` - Send chat message
- `offer-draw` - Propose draw
- `resign` - Forfeit game
- `rematch-request` - Request new game
- `leave-room` - Exit game room

**Room Management:**
- Rooms stored in-memory on server
- Automatic cleanup on disconnect
- 6-character alphanumeric room codes
- Chat history preserved per room
- Clock state synchronized across clients

**Security:**
- Input validation on server
- XSS protection in chat messages
- Room code validation
- Move validation on both client and server

---

**Made with ❤️ and JavaScript**

*A fully functional chess game that rivals commercial platforms!*

