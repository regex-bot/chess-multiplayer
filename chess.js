const game = {
    board: [],
    turn: "white",
    selected: null,
    legalMoves: [],
    gameOver: false,
    promotion: null,
    enPassantTarget: null,
    castling: {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true }
    },
    mode: null,
    playerColor: null,
    roomId: null,
    socket: null,
    moves: [],
    selectedColor: 'white',
    rematchRequested: false,
    timeControl: 0,
    whiteTime: 0,
    blackTime: 0,
    clockInterval: null,
    activePlayer: 'white',
    onlineAction: null
};

const pieces = {
    white: { k:"♚", q:"♛", r:"♜", b:"♝", n:"♞", p:"♟" },
    black: { k:"♚", q:"♛", r:"♜", b:"♝", n:"♞", p:"♟" }
};

document.getElementById('playNowBtn').onclick = () => showModeSelection();
document.getElementById('navHome').onclick = () => showLandingPage();
document.getElementById('navPlay').onclick = () => showModeSelection();
document.getElementById('navAbout').onclick = (e) => {
    e.preventDefault();
    showLandingPage();
    setTimeout(() => {
        document.getElementById('aboutSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
};

document.getElementById('localModeCard').querySelector('.mode-select-btn').onclick = () => {
    game.mode = 'local';
    showTimeControlScreen();
};

document.getElementById('onlineModeCard').querySelector('.mode-select-btn').onclick = () => {
    game.mode = 'online';
    showOnlineRoomSelection();
};

document.getElementById('createRoomCard').querySelector('.mode-select-btn').onclick = () => {
    game.onlineAction = 'create';
    showTimeControlScreen();
};

document.getElementById('joinRoomCard').querySelector('.mode-select-btn').onclick = () => {
    game.onlineAction = 'join';
    showJoinRoom();
};

document.getElementById('backFromOnlineRoom').onclick = () => showModeSelection();

document.querySelectorAll('.time-card').forEach(card => {
    card.onclick = () => {
        document.querySelectorAll('.time-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        game.timeControl = parseInt(card.dataset.time);
        
        setTimeout(() => {
            if (game.mode === 'local') {
                startLocalGame();
            } else if (game.mode === 'online') {
                if (game.onlineAction === 'create') {
                    showRoomSetup();
                } else if (game.onlineAction === 'join') {
                    showJoinRoom();
                }
            }
        }, 300);
    };
});

document.getElementById('backToModeBtn').onclick = () => showModeSelection();
document.getElementById('backToTimeBtn').onclick = () => showOnlineRoomSelection();
document.getElementById('backToTimeFromJoin').onclick = () => showOnlineRoomSelection();

function showLandingPage() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('onlineRoomSelection').style.display = 'none';
    document.getElementById('timeControlScreen').style.display = 'none';
    document.getElementById('roomSetup').style.display = 'none';
    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'none';
}

function showModeSelection() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'flex';
    document.getElementById('onlineRoomSelection').style.display = 'none';
    document.getElementById('timeControlScreen').style.display = 'none';
    document.getElementById('roomSetup').style.display = 'none';
    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'none';
}

function showOnlineRoomSelection() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('onlineRoomSelection').style.display = 'flex';
    document.getElementById('timeControlScreen').style.display = 'none';
    document.getElementById('roomSetup').style.display = 'none';
    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'none';
}

function showTimeControlScreen() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('onlineRoomSelection').style.display = 'none';
    document.getElementById('timeControlScreen').style.display = 'flex';
    document.getElementById('roomSetup').style.display = 'none';
    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'none';
}

function showRoomSetup() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('onlineRoomSelection').style.display = 'none';
    document.getElementById('timeControlScreen').style.display = 'none';
    document.getElementById('roomSetup').style.display = 'flex';
    document.getElementById('joinRoomScreen').style.display = 'none';
    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'none';
}

function showJoinRoom() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('onlineRoomSelection').style.display = 'none';
    document.getElementById('timeControlScreen').style.display = 'none';
    document.getElementById('roomSetup').style.display = 'none';
    document.getElementById('joinRoomScreen').style.display = 'flex';
    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'none';
}

function showWaitingScreen() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('onlineRoomSelection').style.display = 'none';
    document.getElementById('timeControlScreen').style.display = 'none';
    document.getElementById('roomSetup').style.display = 'none';
    document.getElementById('joinRoomScreen').style.display = 'none';
    document.getElementById('waitingScreen').style.display = 'flex';
    document.getElementById('gameScreen').style.display = 'none';
}

function showGameScreen() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('onlineRoomSelection').style.display = 'none';
    document.getElementById('timeControlScreen').style.display = 'none';
    document.getElementById('roomSetup').style.display = 'none';
    document.getElementById('joinRoomScreen').style.display = 'none';
    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
}

function startLocalGame() {
    showGameScreen();
    setupBoard();
    initializeClock();
    render();
    updatePlayerNames();
    hideChatForLocal();
}

function hideChatForLocal() {
    const chatTab = document.querySelector('[data-tab="chat"]');
    if (chatTab) {
        chatTab.style.display = 'none';
    }
    document.querySelector('[data-tab="moves"]').click();
}

function showChatForOnline() {
    const chatTab = document.querySelector('[data-tab="chat"]');
    if (chatTab) {
        chatTab.style.display = 'block';
    }
}

function setupBoard(){
    game.board = [
        ["r","n","b","q","k","b","n","r"],
        ["p","p","p","p","p","p","p","p"],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ["P","P","P","P","P","P","P","P"],
        ["R","N","B","Q","K","B","N","R"]
    ];
    game.turn = "white";
    game.selected = null;
    game.legalMoves = [];
    game.gameOver = false;
    game.promotion = null;
    game.enPassantTarget = null;
    game.castling = {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true }
    };
    game.moves = [];
    game.activePlayer = 'white';
    document.getElementById("moveList").innerHTML = "";
}

function getColor(p){ if(!p) return null; return p===p.toUpperCase()?"white":"black"; }
function copyBoard(b){ return b.map(r=>[...r]); }

function getRawMoves(r, c, board, epTarget, castlingRights){
    const piece = board[r][c];
    if(!piece) return [];
    const color = getColor(piece);
    const type = piece.toLowerCase();
    const moves = [];
    const dir = color==="white" ? -1 : 1;

    if(type==="p"){
        if(board[r+dir]?.[c] == null)
            moves.push({r:r+dir, c, flags:{}});

        if((color==="white"&&r===6)||(color==="black"&&r===1))
            if(board[r+dir]?.[c]==null && board[r+2*dir]?.[c]==null)
                moves.push({r:r+2*dir, c, flags:{doublePush:true}});

        for(const dc of [-1,1]){
            const nr=r+dir, nc=c+dc;
            if(nr>=0&&nr<8&&nc>=0&&nc<8){
                if(board[nr][nc] && getColor(board[nr][nc])!==color)
                    moves.push({r:nr, c:nc, flags:{}});

                if(epTarget && nr===epTarget.r && nc===epTarget.c && !board[nr][nc])
                    moves.push({r:nr, c:nc, flags:{enPassant:true, captureR:r, captureC:nc}});
            }
        }
    }

    if(type==="n"){
        for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){
            const nr=r+dr, nc=c+dc;
            if(nr>=0&&nr<8&&nc>=0&&nc<8&&getColor(board[nr][nc])!==color)
                moves.push({r:nr, c:nc, flags:{}});
        }
    }

    if(["b","r","q"].includes(type)){
        const dirs=[];
        if(type!=="b") dirs.push([1,0],[-1,0],[0,1],[0,-1]);
        if(type!=="r") dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
        for(const [dr,dc] of dirs){
            let nr=r+dr, nc=c+dc;
            while(nr>=0&&nr<8&&nc>=0&&nc<8){
                if(!board[nr][nc]){ moves.push({r:nr,c:nc,flags:{}}); }
                else{ if(getColor(board[nr][nc])!==color) moves.push({r:nr,c:nc,flags:{}}); break; }
                nr+=dr; nc+=dc;
            }
        }
    }

    if(type==="k"){
        for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
            if(!dr&&!dc) continue;
            const nr=r+dr, nc=c+dc;
            if(nr>=0&&nr<8&&nc>=0&&nc<8&&getColor(board[nr][nc])!==color)
                moves.push({r:nr, c:nc, flags:{}});
        }

        if(castlingRights){
            const rights=castlingRights[color];
            const rank=color==="white"?7:0;
            if(rights.kingSide && !board[rank][5] && !board[rank][6])
                moves.push({r:rank, c:6, flags:{castle:"kingSide"}});
            if(rights.queenSide && !board[rank][3] && !board[rank][2] && !board[rank][1])
                moves.push({r:rank, c:2, flags:{castle:"queenSide"}});
        }
    }

    return moves;
}

function findKing(color, board){
    const k=color==="white"?"K":"k";
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]===k) return {r,c};
    return null;
}

function isInCheck(color, board){
    const king=findKing(color,board);
    if(!king) return false;
    const opp=color==="white"?"black":"white";
    for(let r=0;r<8;r++) for(let c=0;c<8;c++)
        if(getColor(board[r][c])===opp)
            if(getRawMoves(r,c,board,null,null).some(m=>m.r===king.r&&m.c===king.c))
                return true;
    return false;
}

function getLegalMoves(r, c){
    const raw=getRawMoves(r,c,game.board,game.enPassantTarget,game.castling);
    const color=getColor(game.board[r][c]);

    return raw.filter(move=>{
        if(move.flags.castle){
            const rank=color==="white"?7:0;
            if(isInCheck(color,game.board)) return false;
            const midC=move.flags.castle==="kingSide"?5:3;
            const mid=copyBoard(game.board);
            mid[rank][midC]=mid[r][c]; mid[r][c]=null;
            if(isInCheck(color,mid)) return false;
        }

        const copy=copyBoard(game.board);
        copy[move.r][move.c]=copy[r][c];
        copy[r][c]=null;
        if(move.flags.enPassant) copy[move.flags.captureR][move.flags.captureC]=null;

        return !isInCheck(color,copy);
    });
}

function hasAnyLegalMoves(color){
    for(let r=0;r<8;r++) for(let c=0;c<8;c++)
        if(getColor(game.board[r][c])===color && getLegalMoves(r,c).length>0)
            return true;
    return false;
}

function checkGameState(){
    const col=game.turn;
    const inCheck=isInCheck(col,game.board);
    const hasMoves=hasAnyLegalMoves(col);

    if(!hasMoves){
        game.gameOver=true;
        stopClock();
        const winner = col==="white"?"Black":"White";
        const message = inCheck ? `Checkmate! ${winner} wins!` : "Stalemate! Draw!";
        showGameOverModal(message, inCheck ? winner : null);
        
        if(game.mode === 'online' && game.socket && game.roomId) {
            game.socket.emit('game-over', { roomId: game.roomId });
        }
        return;
    }
}

function makeMove(fr,fc,tr,tc,flags){
    const piece=game.board[fr][fc];
    if(piece.toLowerCase()==="p"&&(tr===0||tr===7)){
        game.promotion={fr,fc,tr,tc,color:getColor(piece),flags};
        showPromotionModal(game.promotion.color);
        return;
    }
    executeMove(fr,fc,tr,tc,null,flags);
}

function executeMove(fr,fc,tr,tc,promoted,flags){
    const piece=game.board[fr][fc];
    const color=getColor(piece);
    const type=piece.toLowerCase();
    const f=flags||{};

    game.board[tr][tc]=promoted||piece;
    game.board[fr][fc]=null;

    if(f.enPassant) game.board[f.captureR][f.captureC]=null;

    if(f.castle){
        const rank=color==="white"?7:0;
        const rook=color==="white"?"R":"r";
        if(f.castle==="kingSide"){ game.board[rank][5]=rook; game.board[rank][7]=null; }
        else { game.board[rank][3]=rook; game.board[rank][0]=null; }
    }

    game.enPassantTarget = f.doublePush ? {r:fr+(color==="white"?-1:1), c:fc} : null;

    if(type==="k"){ game.castling[color].kingSide=false; game.castling[color].queenSide=false; }
    if(type==="r"){
        const rank=color==="white"?7:0;
        if(fr===rank&&fc===7) game.castling[color].kingSide=false;
        if(fr===rank&&fc===0) game.castling[color].queenSide=false;
    }

    // Switch turn to check if opponent is in check
    const nextTurn = color === "white" ? "black" : "white";
    const inCheck = isInCheck(nextTurn, game.board);
    
    // Generate notation with check symbol if needed
    let notation = getMoveNotation(fr, fc, tr, tc, piece, promoted, f);
    if(inCheck) {
        notation += '+';
    }

    game.moves.push(notation);
    updateMoveHistory();

    if(game.mode === 'online' && game.socket && game.roomId && color === game.playerColor) {
        game.socket.emit('make-move', {
            roomId: game.roomId,
            move: { fr, fc, tr, tc, promoted, flags: f }
        });
    }

    game.turn=game.turn==="white"?"black":"white";
    game.activePlayer=game.turn;
    game.selected=null;
    game.legalMoves=[];
    game.promotion=null;

    render();
    checkGameState();
}

function getMoveNotation(fr, fc, tr, tc, piece, promoted, flags) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const type = piece.toLowerCase();
    
    if(flags.castle) {
        return flags.castle === 'kingSide' ? 'O-O' : 'O-O-O';
    }
    
    let notation = '';
    
    if(type !== 'p') {
        notation += type.toUpperCase();
    }
    
    const isCapture = game.board[tr][tc] !== null || flags.enPassant;
    if(isCapture) {
        if(type === 'p') {
            notation += files[fc];
        }
        notation += 'x';
    }
    
    notation += files[tc] + (8 - tr);
    
    if(promoted) {
        notation += '=' + promoted.toUpperCase();
    }
    
    return notation;
}

function updateMoveHistory() {
    const moveList = document.getElementById("moveList");
    moveList.innerHTML = "";
    
    for(let i = 0; i < game.moves.length; i += 2) {
        const moveNum = Math.floor(i / 2) + 1;
        const whiteMove = game.moves[i];
        const blackMove = game.moves[i + 1] || '';
        
        const movePair = document.createElement("div");
        movePair.className = "move-pair";
        movePair.innerHTML = `<span class="move-number">${moveNum}.</span> ${whiteMove} ${blackMove}`;
        moveList.appendChild(movePair);
    }
    
    moveList.scrollTop = moveList.scrollHeight;
}

function initializeClock() {
    game.whiteTime = game.timeControl;
    game.blackTime = game.timeControl;
    updateClockDisplay();
    
    if (game.timeControl > 0) {
        startClock();
    }
}

function startClock() {
    stopClock();
    
    if (game.timeControl === 0) return;
    
    game.clockInterval = setInterval(() => {
        if (game.gameOver) {
            stopClock();
            return;
        }
        
        if (game.activePlayer === 'white') {
            game.whiteTime--;
            if (game.whiteTime <= 0) {
                game.whiteTime = 0;
                stopClock();
                handleTimeExpired('white');
            }
        } else {
            game.blackTime--;
            if (game.blackTime <= 0) {
                game.blackTime = 0;
                stopClock();
                handleTimeExpired('black');
            }
        }
        
        updateClockDisplay();
        
        if (game.mode === 'online' && game.socket && game.roomId) {
            const time = game.activePlayer === 'white' ? game.whiteTime : game.blackTime;
            game.socket.emit('clock-update', {
                roomId: game.roomId,
                color: game.activePlayer,
                time: time
            });
        }
    }, 1000);
}

function stopClock() {
    if (game.clockInterval) {
        clearInterval(game.clockInterval);
        game.clockInterval = null;
    }
}

function updateClockDisplay() {
    const whiteDisplay = formatTime(game.whiteTime);
    const blackDisplay = formatTime(game.blackTime);
    
    const currentClock = document.getElementById('currentPlayerClock');
    const opponentClock = document.getElementById('opponentClock');
    
    if (game.timeControl === 0) {
        currentClock.style.display = 'none';
        opponentClock.style.display = 'none';
        return;
    } else {
        currentClock.style.display = 'block';
        opponentClock.style.display = 'block';
    }
    
    if (game.mode === 'online') {
        if (game.playerColor === 'white') {
            currentClock.textContent = whiteDisplay;
            opponentClock.textContent = blackDisplay;
        } else {
            currentClock.textContent = blackDisplay;
            opponentClock.textContent = whiteDisplay;
        }
    } else {
        currentClock.textContent = whiteDisplay;
        opponentClock.textContent = blackDisplay;
    }
    
    if (game.whiteTime <= 20 && game.whiteTime > 0) {
        if (game.playerColor === 'white' || game.mode === 'local') {
            currentClock.classList.add('low-time');
        }
    } else {
        currentClock.classList.remove('low-time');
    }
    
    if (game.blackTime <= 20 && game.blackTime > 0) {
        if (game.playerColor === 'black' || game.mode === 'local') {
            opponentClock.classList.add('low-time');
        }
    } else {
        opponentClock.classList.remove('low-time');
    }
}

function formatTime(seconds) {
    if (seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function handleTimeExpired(color) {
    game.gameOver = true;
    const winner = color === 'white' ? 'Black' : 'White';
    showGameOverModal(`Time expired! ${winner} wins!`, winner);
    
    if (game.mode === 'online' && game.socket && game.roomId) {
        game.socket.emit('time-expired', { roomId: game.roomId, color });
    }
}

function updatePlayerNames() {
    if (game.mode === 'online') {
        document.getElementById('currentPlayerName').textContent = 'You';
        document.getElementById('opponentName').textContent = 'Opponent';
        
        if (game.playerColor === 'white') {
            document.getElementById('currentAvatar').textContent = '♔';
            document.getElementById('opponentAvatar').textContent = '♚';
        } else {
            document.getElementById('currentAvatar').textContent = '♚';
            document.getElementById('opponentAvatar').textContent = '♔';
        }
    } else {
        document.getElementById('currentPlayerName').textContent = 'White';
        document.getElementById('opponentName').textContent = 'Black';
        document.getElementById('currentAvatar').textContent = '♔';
        document.getElementById('opponentAvatar').textContent = '♚';
    }
}

document.querySelectorAll('.panel-tab').forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        document.getElementById(tabName + 'Panel').classList.add('active');
    };
});

document.getElementById('sendChatBtn').onclick = sendChatMessage;
document.getElementById('chatInput').onkeypress = (e) => {
    if (e.key === 'Enter') sendChatMessage();
};

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || game.mode !== 'online') return;
    
    if (game.socket && game.roomId) {
        game.socket.emit('chat-message', {
            roomId: game.roomId,
            message: message,
            sender: game.playerColor
        });
    }
    
    input.value = '';
}

function displayChatMessage(msg, isOwn) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${isOwn ? 'own' : 'opponent'}`;
    msgDiv.textContent = msg.message;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function render(){
    const board=document.getElementById("chessboard");
    board.innerHTML="";

    const flipBoard = game.mode === 'online' && game.playerColor === 'black';
    if(flipBoard) {
        board.classList.add('flipped');
    } else {
        board.classList.remove('flipped');
    }

    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
        const sq=document.createElement("div");
        sq.className="square "+((r+c)%2===0?"light":"dark");

        const piece=game.board[r][c];
        if(piece){
            const span=document.createElement("span");
            const pieceColor = getColor(piece);
            span.className = `piece ${pieceColor}-piece`;
            span.textContent=pieces[pieceColor][piece.toLowerCase()];
            sq.appendChild(span);
        }

        if(game.selected?.r===r&&game.selected?.c===c) sq.classList.add("selected");

        const lm=game.legalMoves.find(m=>m.r===r&&m.c===c);
        if(lm){
            sq.classList.add("legal-move");
            if(game.board[r][c]||lm.flags?.enPassant) sq.classList.add("legal-capture");
        }

        if(piece && piece.toLowerCase() === 'k') {
            const kingColor = getColor(piece);
            if(isInCheck(kingColor, game.board)) {
                sq.classList.add("in-check");
            }
        }

        sq.onclick=()=>handleClick(r,c);
        board.appendChild(sq);
    }
}

function handleClick(r,c){
    if(game.gameOver) return;
    
    if(game.mode === 'online' && game.turn !== game.playerColor) return;
    
    const piece=game.board[r][c];

    if(game.selected){
        const lm=game.legalMoves.find(m=>m.r===r&&m.c===c);
        if(lm){ makeMove(game.selected.r,game.selected.c,r,c,lm.flags); return; }
    }

    if(piece&&getColor(piece)===game.turn){
        game.selected={r,c};
        game.legalMoves=getLegalMoves(r,c);
    } else {
        game.selected=null;
        game.legalMoves=[];
    }
    render();
}

function showPromotionModal(color){
    const modal=document.getElementById("promotionModal");
    modal.querySelectorAll("button").forEach(btn=>{
        btn.textContent=pieces[color][btn.dataset.piece];
    });
    modal.classList.add("active");
    modal.querySelectorAll("button").forEach(btn=>{
        btn.onclick=()=>{
            const type=btn.dataset.piece;
            const promoted=color==="white"?type.toUpperCase():type;
            modal.classList.remove("active");
            const {fr,fc,tr,tc,flags}=game.promotion;
            executeMove(fr,fc,tr,tc,promoted,flags);
        };
    });
}

function showGameOverModal(message, winner) {
    const modal = document.getElementById("gameOverModal");
    const title = document.getElementById("gameOverTitle");
    const msg = document.getElementById("gameOverMessage");
    const okBtn = document.getElementById("gameOverBtn");
    const rematchSection = document.getElementById("rematchSection");
    const rematchBtn = document.getElementById("rematchBtn");
    
    if(winner) {
        title.textContent = `${winner} Wins! 🎉`;
        msg.textContent = message;
    } else {
        title.textContent = "Draw";
        msg.textContent = message;
    }
    
    if(game.mode === 'online') {
        okBtn.style.display = "none";
        rematchSection.style.display = "block";
        document.getElementById("rematchStatus").textContent = "Would you like to play again?";
        rematchBtn.disabled = false;
        rematchBtn.textContent = "Play Again";
        game.rematchRequested = false;
    } else {
        okBtn.style.display = "block";
        rematchSection.style.display = "none";
    }
    
    modal.classList.add("active");
}

document.getElementById("gameOverBtn").onclick = () => {
    document.getElementById("gameOverModal").classList.remove("active");
};

document.getElementById("rematchBtn").onclick = () => {
    console.log('Rematch button clicked');
    if(game.socket && game.roomId) {
        console.log('Sending rematch request to room:', game.roomId);
        game.socket.emit('rematch-request', game.roomId);
        document.getElementById("rematchStatus").textContent = "Waiting for opponent...";
        document.getElementById("rematchBtn").disabled = true;
    }
};

document.getElementById("declineRematchBtn").onclick = () => {
    if(game.socket && game.roomId) {
        game.socket.emit('rematch-response', { roomId: game.roomId, accepted: false });
        game.socket.emit('leave-room', game.roomId);
    }
    document.getElementById("gameOverModal").classList.remove("active");
    showLandingPage();
};

document.getElementById("acceptDrawBtn").onclick = () => {
    if(game.socket && game.roomId) {
        game.socket.emit('draw-response', { roomId: game.roomId, accepted: true });
    }
    document.getElementById("drawOfferModal").classList.remove("active");
};

document.getElementById("declineDrawBtn").onclick = () => {
    if(game.socket && game.roomId) {
        game.socket.emit('draw-response', { roomId: game.roomId, accepted: false });
    }
    document.getElementById("drawOfferModal").classList.remove("active");
};

document.getElementById("offerDrawBtn").onclick = () => {
    if(game.socket && game.roomId) {
        game.socket.emit('offer-draw', game.roomId);
        alert('Draw offer sent to opponent');
    }
};

document.getElementById("resignBtn").onclick = () => {
    if(confirm('Are you sure you want to resign?')) {
        if(game.socket && game.roomId) {
            game.socket.emit('resign', { roomId: game.roomId, color: game.playerColor });
        }
        game.gameOver = true;
        stopClock();
        const winner = game.playerColor === 'white' ? 'Black' : 'White';
        showGameOverModal(`You resigned. ${winner} wins!`, winner);
    }
};

document.getElementById("exitGameBtn").onclick = () => {
    if(confirm('Are you sure you want to exit?')) {
        if(game.socket && game.roomId) {
            game.socket.emit('leave-room', game.roomId);
        }
        stopClock();
        showLandingPage();
    }
};

document.getElementById('whiteColorBtn').onclick = () => {
    game.selectedColor = 'white';
    document.getElementById('whiteColorBtn').classList.add('active');
    document.getElementById('blackColorBtn').classList.remove('active');
};

document.getElementById('blackColorBtn').onclick = () => {
    game.selectedColor = 'black';
    document.getElementById('blackColorBtn').classList.add('active');
    document.getElementById('whiteColorBtn').classList.remove('active');
};

document.getElementById('createRoomBtn').onclick = () => {
    connectSocket();
    game.socket.emit('create-room', {
        preferredColor: game.selectedColor,
        timeControl: game.timeControl
    });
    showWaitingScreen();
};

document.getElementById('joinRoomBtn').onclick = () => {
    const roomId = document.getElementById('roomIdInput').value.trim().toUpperCase();
    if(!roomId) {
        alert('Please enter a room code');
        return;
    }
    connectSocket();
    game.socket.emit('join-room', roomId);
};

document.getElementById('copyRoomBtn').onclick = () => {
    const code = document.getElementById('displayRoomCode').textContent;
    navigator.clipboard.writeText(code);
    document.getElementById('copyRoomBtn').textContent = 'Copied!';
    setTimeout(() => {
        document.getElementById('copyRoomBtn').textContent = 'Copy Code';
    }, 2000);
};

document.getElementById('cancelWaitBtn').onclick = () => {
    if(game.socket) {
        game.socket.disconnect();
        game.socket = null;
    }
    showLandingPage();
};

function connectSocket() {
    if(game.socket) return;
    
    game.socket = io();
    
    game.socket.on('room-created', (data) => {
        game.roomId = data.roomId;
        game.playerColor = data.color;
        game.timeControl = data.timeControl;
        document.getElementById('displayRoomCode').textContent = data.roomId;
    });
    
    game.socket.on('room-joined', (data) => {
        game.roomId = data.roomId;
        game.playerColor = data.color;
        game.timeControl = data.timeControl;
        showGameScreen();
        setupBoard();
        initializeClock();
        render();
        updatePlayerNames();
        showOnlineButtons();
        showChatForOnline();
    });
    
    game.socket.on('opponent-joined', (data) => {
        game.playerColor = data.color;
        game.timeControl = data.timeControl;
        showGameScreen();
        setupBoard();
        initializeClock();
        render();
        updatePlayerNames();
        showOnlineButtons();
        showChatForOnline();
    });
    
    game.socket.on('opponent-move', (move) => {
        executeMove(move.fr, move.fc, move.tr, move.tc, move.promoted, move.flags);
    });
    
    game.socket.on('switch-clock', () => {
    });
    
    game.socket.on('opponent-clock-update', (data) => {
        if (data.color === 'white') {
            game.whiteTime = data.time;
        } else {
            game.blackTime = data.time;
        }
        updateClockDisplay();
    });
    
    game.socket.on('game-over-time', (data) => {
        game.gameOver = true;
        stopClock();
        const winner = data.loser === 'white' ? 'Black' : 'White';
        showGameOverModal(`Time expired! ${winner} wins!`, winner);
    });
    
    game.socket.on('chat-message', (msg) => {
        const isOwn = msg.sender === game.playerColor;
        displayChatMessage(msg, isOwn);
    });
    
    game.socket.on('chat-history', (history) => {
        history.forEach(msg => {
            const isOwn = msg.sender === game.playerColor;
            displayChatMessage(msg, isOwn);
        });
    });
    
    game.socket.on('game-reset', () => {
        setupBoard();
        initializeClock();
        render();
    });
    
    game.socket.on('draw-offered', () => {
        document.getElementById('drawOfferModal').classList.add('active');
    });
    
    game.socket.on('draw-accepted', () => {
        document.getElementById('drawOfferModal').classList.remove('active');
        showGameOverModal('Draw by agreement', null);
        game.gameOver = true;
        stopClock();
    });
    
    game.socket.on('draw-declined', () => {
        alert('Draw offer declined');
    });
    
    game.socket.on('player-resigned', (data) => {
        game.gameOver = true;
        stopClock();
        const winner = data.color === 'white' ? 'Black' : 'White';
        showGameOverModal(`Opponent resigned. ${winner} wins!`, winner);
    });
    
    game.socket.on('rematch-requested', () => {
        console.log('Opponent requested rematch');
        document.getElementById('rematchStatus').textContent = 'Opponent wants to play again!';
        document.getElementById('rematchBtn').disabled = false;
        document.getElementById('rematchBtn').textContent = 'Accept & Play Again';
    });
    
    game.socket.on('rematch-accepted', (data) => {
        console.log('Rematch accepted, swapping colors', data);
        
        if(game.socket.id === data.white) {
            game.playerColor = 'white';
        } else if(game.socket.id === data.black) {
            game.playerColor = 'black';
        }
        
        game.timeControl = data.timeControl;
        
        document.getElementById('gameOverModal').classList.remove('active');
        document.getElementById('rematchBtn').disabled = false;
        game.rematchRequested = false;
        game.gameOver = false;
        
        document.getElementById('chatMessages').innerHTML = '';
        
        setupBoard();
        initializeClock();
        updatePlayerNames();
        render();
    });
    
    game.socket.on('rematch-declined', () => {
        alert('Opponent declined rematch');
        document.getElementById('gameOverModal').classList.remove('active');
        showLandingPage();
    });
    
    game.socket.on('game-ended', () => {
    });
    
    game.socket.on('opponent-left', () => {
        alert('Opponent left the game. You win!');
        document.getElementById('gameOverModal').classList.remove('active');
        stopClock();
        showLandingPage();
    });
    
    game.socket.on('opponent-disconnected', () => {
        alert('Opponent disconnected');
        document.getElementById('gameOverModal').classList.remove('active');
        stopClock();
        showLandingPage();
    });
    
    game.socket.on('room-error', (message) => {
        alert(message);
        showRoomSetup();
    });
    
    game.socket.on('connect_error', () => {
        console.error('Connection error');
        alert('Unable to connect to server. Please check your internet connection.');
    });
    
    game.socket.on('reconnect', () => {
        console.log('Reconnected to server');
    });
}

function showOnlineButtons() {
    document.getElementById('offerDrawBtn').style.display = 'flex';
    document.getElementById('resignBtn').style.display = 'flex';
}

showLandingPage();
