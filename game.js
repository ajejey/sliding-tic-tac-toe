class SlidingTicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.startingPlayer = 'X'; // User's choice
        this.currentPlayer = 'X';
        this.gamePhase = 'placing'; // 'placing' or 'moving'
        this.piecesPlaced = { X: 0, O: 0 };
        this.selectedPiece = null;
        this.gameOver = false;
        this.moveCount = 0;
        this.gameStartTime = Date.now();
        
        // AI settings
        this.gameMode = '2player'; // '2player' or '1player'
        this.difficulty = 'easy'; // 'easy', 'medium', 'hard'
        this.aiPlayer = 'O'; // AI plays as O by default
        this.humanPlayer = 'X';
        this.isAiTurn = false;
        this.aiThinking = false;
        this.aiMoveTimeout = null; // Track pending AI move timeout
        
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.gamePhaseDisplay = document.getElementById('gamePhase');
        this.messageDisplay = document.getElementById('message');
        this.xPiecesLeftDisplay = document.getElementById('xPiecesLeft');
        this.oPiecesLeftDisplay = document.getElementById('oPiecesLeft');
        this.resetBtn = document.getElementById('resetBtn');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.howToPlayBtn = document.getElementById('howToPlayBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.howToPlayModal = document.getElementById('howToPlayModal');
        this.shareModal = document.getElementById('shareModal');
        this.choiceBtns = document.querySelectorAll('.choice-btn');
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.difficultySelection = document.querySelector('.difficulty-selection');
        
        this.initializeGame();
        this.initializeGameMode();
        this.initializeDifficulty();
        this.initializePlayerChoice();
        this.loadHistory();
        this.initializeModals();
        this.initializeSharing();
        this.initializeKeyboardShortcuts();
    }
    
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 'R' or 'N' for new game
            if ((e.key === 'r' || e.key === 'R' || e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey) {
                // Don't trigger if typing in an input
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    this.resetGame();
                }
            }
        });
    }
    
    initializeGame() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.updateDisplay();
    }
    
    initializeGameMode() {
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    const selectedMode = btn.dataset.mode;
                    
                    // Update active state
                    this.modeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update game mode
                    this.gameMode = selectedMode;
                    
                    // Show/hide difficulty selector
                    if (selectedMode === '1player') {
                        this.difficultySelection.style.display = 'flex';
                    } else {
                        this.difficultySelection.style.display = 'none';
                    }
                    
                    // Track event
                    this.trackEvent('game_mode_change', selectedMode);
                }
            });
        });
    }
    
    initializeDifficulty() {
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    const selectedDifficulty = btn.dataset.difficulty;
                    
                    // Update active state
                    this.difficultyBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update difficulty
                    this.difficulty = selectedDifficulty;
                    
                    // Track event
                    this.trackEvent('difficulty_change', selectedDifficulty);
                }
            });
        });
    }
    
    initializePlayerChoice() {
        this.choiceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Only allow changing before game starts
                if (!btn.disabled) {
                    const selectedPlayer = btn.dataset.player;
                    
                    // Update active state
                    this.choiceBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update starting player
                    this.startingPlayer = selectedPlayer;
                    this.currentPlayer = selectedPlayer;
                    
                    // Update AI and human players
                    this.humanPlayer = selectedPlayer;
                    this.aiPlayer = selectedPlayer === 'X' ? 'O' : 'X';
                    
                    // Update display
                    this.updateDisplay();
                    
                    // Track event
                    this.trackEvent('player_choice', selectedPlayer);
                }
            });
        });
    }
    
    disableGameSettings() {
        this.modeBtns.forEach(btn => btn.disabled = true);
        this.difficultyBtns.forEach(btn => btn.disabled = true);
        this.choiceBtns.forEach(btn => btn.disabled = true);
    }
    
    enableGameSettings() {
        this.modeBtns.forEach(btn => btn.disabled = false);
        this.difficultyBtns.forEach(btn => btn.disabled = false);
        this.choiceBtns.forEach(btn => btn.disabled = false);
    }
    
    disablePlayerChoice() {
        this.choiceBtns.forEach(btn => {
            btn.disabled = true;
        });
    }
    
    enablePlayerChoice() {
        this.choiceBtns.forEach(btn => {
            btn.disabled = false;
        });
    }
    
    initializeModals() {
        const privacyModal = document.getElementById('privacyModal');
        const aboutModal = document.getElementById('aboutModal');
        const privacyLink = document.getElementById('privacyLink');
        const aboutLink = document.getElementById('aboutLink');
        const howToPlayLink = document.getElementById('howToPlayLink');
        
        // How to Play modal (button or footer link)
        if (this.howToPlayBtn) {
            this.howToPlayBtn.addEventListener('click', () => {
                this.howToPlayModal.classList.add('active');
                this.trackEvent('modal_open', 'how_to_play');
            });
        }
        
        if (howToPlayLink && this.howToPlayModal) {
            howToPlayLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.howToPlayModal.classList.add('active');
                this.trackEvent('modal_open', 'how_to_play');
            });
        }
        
        // Share modal (handle both ID-based and class-based buttons)
        const shareButtons = document.querySelectorAll('#shareBtn, .share-btn-trigger');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.shareModal.classList.add('active');
                this.trackEvent('modal_open', 'share');
            });
        });
        
        // Privacy modal
        if (privacyLink && privacyModal) {
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                privacyModal.classList.add('active');
                this.trackEvent('modal_open', 'privacy');
            });
        }
        
        // About modal
        if (aboutLink && aboutModal) {
            aboutLink.addEventListener('click', (e) => {
                e.preventDefault();
                aboutModal.classList.add('active');
                this.trackEvent('modal_open', 'about');
            });
        }
        
        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Close on outside click
        [this.howToPlayModal, this.shareModal, privacyModal, aboutModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            }
        });
    }
    
    initializeSharing() {
        const shareButtons = document.querySelectorAll('[data-share]');
        const gameUrl = window.location.href;
        const gameTitle = 'Sliding Tic-Tac-Toe';
        const gameText = 'Check out this addictive twist on tic-tac-toe! Place 3 pieces, then slide them to win. Can you beat me?';
        
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.share;
                
                switch(platform) {
                    case 'twitter':
                        window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(gameText)}&url=${encodeURIComponent(gameUrl)}`,
                            '_blank',
                            'width=550,height=420'
                        );
                        this.trackEvent('share', 'twitter');
                        break;
                        
                    case 'facebook':
                        window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`,
                            '_blank',
                            'width=550,height=420'
                        );
                        this.trackEvent('share', 'facebook');
                        break;
                        
                    case 'whatsapp':
                        window.open(
                            `https://wa.me/?text=${encodeURIComponent(gameText + ' ' + gameUrl)}`,
                            '_blank'
                        );
                        this.trackEvent('share', 'whatsapp');
                        break;
                        
                    case 'copy':
                        navigator.clipboard.writeText(gameUrl).then(() => {
                            btn.innerHTML = btn.innerHTML.replace('Copy Link', 'Copied! ✓');
                            setTimeout(() => {
                                btn.innerHTML = btn.innerHTML.replace('Copied! ✓', 'Copy Link');
                            }, 2000);
                            this.trackEvent('share', 'copy_link');
                        });
                        break;
                }
            });
        });
    }
    
    trackEvent(action, label) {
        // Google Analytics event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'game_interaction',
                'event_label': label
            });
        }
    }
    
    handleCellClick(index) {
        if (this.gameOver || this.aiThinking) return;
        
        // In 1-player mode, prevent clicks during AI turn
        if (this.gameMode === '1player' && this.currentPlayer === this.aiPlayer) {
            return;
        }
        
        if (this.gamePhase === 'placing') {
            this.handlePlacingPhase(index);
        } else {
            this.handleMovingPhase(index);
        }
    }
    
    handlePlacingPhase(index) {
        if (this.board[index] !== null) return;
        
        this.board[index] = this.currentPlayer;
        this.piecesPlaced[this.currentPlayer]++;
        this.moveCount++;
        
        // Disable all game settings after first move
        if (this.moveCount === 1) {
            this.disableGameSettings();
        }
        
        // Add visual feedback for piece placement
        this.cells[index].style.transform = 'scale(1.15)';
        setTimeout(() => {
            this.cells[index].style.transform = '';
        }, 200);
        
        // Extra visual feedback for AI strategic moves (medium/hard)
        if (this.currentPlayer === this.aiPlayer && (this.difficulty === 'medium' || this.difficulty === 'hard')) {
            this.cells[index].style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.6)';
            setTimeout(() => {
                this.cells[index].style.boxShadow = '';
            }, 800);
        }
        
        this.updateDisplay();
        
        if (this.checkWinner()) {
            this.endGame(`Player ${this.currentPlayer} wins!`);
            return;
        }
        
        if (this.piecesPlaced.X === 3 && this.piecesPlaced.O === 3) {
            this.gamePhase = 'moving';
            this.switchPlayer();
            this.messageDisplay.textContent = 'All pieces placed! Now move your pieces to adjacent squares.';
            this.updateDisplay();
            
            // Trigger AI move if it's AI's turn
            if (this.gameMode === '1player' && this.currentPlayer === this.aiPlayer) {
                this.scheduleAiMove();
            }
        } else {
            this.switchPlayer();
            
            // Trigger AI move if it's AI's turn
            if (this.gameMode === '1player' && this.currentPlayer === this.aiPlayer) {
                this.scheduleAiMove();
            }
        }
    }
    
    handleMovingPhase(index) {
        const clickedPiece = this.board[index];
        
        if (this.selectedPiece === null) {
            if (clickedPiece === this.currentPlayer) {
                this.selectedPiece = index;
                this.highlightValidMoves(index);
                this.updateDisplay();
            }
        } else {
            if (index === this.selectedPiece) {
                this.selectedPiece = null;
                this.clearHighlights();
                this.updateDisplay();
            } else if (this.board[index] === null && this.isAdjacentMove(this.selectedPiece, index)) {
                this.board[index] = this.currentPlayer;
                this.board[this.selectedPiece] = null;
                this.selectedPiece = null;
                this.clearHighlights();
                this.moveCount++;
                
                this.updateDisplay();
                
                if (this.checkWinner()) {
                    this.endGame(`Player ${this.currentPlayer} wins!`);
                    return;
                }
                
                this.switchPlayer();
                
                // Trigger AI move if it's AI's turn
                if (this.gameMode === '1player' && this.currentPlayer === this.aiPlayer) {
                    this.scheduleAiMove();
                }
            } else if (clickedPiece === this.currentPlayer) {
                this.clearHighlights();
                this.selectedPiece = index;
                this.highlightValidMoves(index);
                this.updateDisplay();
            }
        }
    }
    
    isAdjacentMove(from, to) {
        const adjacencyMap = {
            0: [1, 3, 4],
            1: [0, 2, 3, 4, 5],
            2: [1, 4, 5],
            3: [0, 1, 4, 6, 7],
            4: [0, 1, 2, 3, 5, 6, 7, 8],
            5: [1, 2, 4, 7, 8],
            6: [3, 4, 7],
            7: [3, 4, 5, 6, 8],
            8: [4, 5, 7]
        };
        
        return adjacencyMap[from].includes(to);
    }
    
    highlightValidMoves(fromIndex) {
        const adjacencyMap = {
            0: [1, 3, 4],
            1: [0, 2, 3, 4, 5],
            2: [1, 4, 5],
            3: [0, 1, 4, 6, 7],
            4: [0, 1, 2, 3, 5, 6, 7, 8],
            5: [1, 2, 4, 7, 8],
            6: [3, 4, 7],
            7: [3, 4, 5, 6, 8],
            8: [4, 5, 7]
        };
        
        adjacencyMap[fromIndex].forEach(index => {
            if (this.board[index] === null) {
                this.cells[index].classList.add('valid-move');
            }
        });
    }
    
    clearHighlights() {
        this.cells.forEach(cell => {
            cell.classList.remove('valid-move');
        });
    }
    
    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] !== null &&
                   this.board[a] === this.board[b] &&
                   this.board[a] === this.board[c];
        });
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }
    
    scheduleAiMove() {
        // Cancel any pending AI move
        if (this.aiMoveTimeout) {
            clearTimeout(this.aiMoveTimeout);
            this.aiMoveTimeout = null;
        }
        
        // Add delay for better UX (AI appears to be "thinking")
        this.aiThinking = true;
        this.showAiThinking();
        
        // Difficulty-based delay for better perception
        let baseDelay, variance;
        if (this.difficulty === 'easy') {
            baseDelay = 500;
            variance = 400; // 500-900ms
        } else if (this.difficulty === 'medium') {
            baseDelay = 800;
            variance = 600; // 800-1400ms (feels more strategic)
        } else { // hard
            baseDelay = 1000;
            variance = 800; // 1000-1800ms (feels like deep calculation)
        }
        
        const delay = baseDelay + Math.random() * variance;
        
        this.aiMoveTimeout = setTimeout(() => {
            this.makeAiMove();
            this.aiThinking = false;
            this.aiMoveTimeout = null;
        }, delay);
    }
    
    showAiThinking() {
        this.messageDisplay.classList.add('ai-thinking');
        
        // Add hard-difficulty class for special styling
        if (this.difficulty === 'hard') {
            this.messageDisplay.classList.add('hard-difficulty');
        }
        
        // Difficulty-specific thinking messages
        let thinkingMessage = '🤖 AI is thinking';
        if (this.difficulty === 'easy') {
            thinkingMessage = '🤖 AI is deciding';
        } else if (this.difficulty === 'medium') {
            thinkingMessage = '🧠 AI is strategizing';
        } else if (this.difficulty === 'hard') {
            thinkingMessage = '🎯 AI is calculating';
        }
        
        this.messageDisplay.innerHTML = `${thinkingMessage}<span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span>`;
        
        // Visually disable cells during AI thinking
        this.cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
            cell.style.opacity = '0.7';
        });
    }
    
    makeAiMove() {
        // Safety checks: don't make move if game state is invalid
        if (this.gameOver || !this.aiThinking) return;
        if (this.gameMode !== '1player') return; // Not in AI mode
        if (this.currentPlayer !== this.aiPlayer) return; // Not AI's turn
        
        let move = null;
        
        // Choose AI strategy based on difficulty
        switch(this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = this.getHeuristicMove();
                break;
            case 'hard':
                move = this.getMinimaxMove();
                break;
            default:
                move = this.getRandomMove();
        }
        
        if (move !== null && move !== undefined) {
            if (this.gamePhase === 'placing') {
                this.handlePlacingPhase(move);
            } else {
                // For moving phase, move contains {from, to}
                if (move.from !== undefined && move.to !== undefined) {
                    this.executeAiMovingPhase(move.from, move.to);
                }
            }
        } else {
            // No valid move found - this shouldn't happen but handle gracefully
            console.warn('AI could not find a valid move');
        }
        
        this.messageDisplay.classList.remove('ai-thinking', 'hard-difficulty');
        
        // Re-enable cells after AI move
        this.cells.forEach(cell => {
            cell.style.pointerEvents = '';
            cell.style.opacity = '';
        });
    }
    
    getRandomMove() {
        if (this.gamePhase === 'placing') {
            // Get all empty cells
            const emptyCells = [];
            for (let i = 0; i < this.board.length; i++) {
                if (this.board[i] === null) {
                    emptyCells.push(i);
                }
            }
            
            // Return random empty cell
            if (emptyCells.length > 0) {
                return emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
        } else {
            // Moving phase: find AI pieces and their valid moves
            const aiPieces = [];
            for (let i = 0; i < this.board.length; i++) {
                if (this.board[i] === this.aiPlayer) {
                    aiPieces.push(i);
                }
            }
            
            // Collect all possible moves
            const possibleMoves = [];
            const adjacencyMap = {
                0: [1, 3, 4],
                1: [0, 2, 3, 4, 5],
                2: [1, 4, 5],
                3: [0, 1, 4, 6, 7],
                4: [0, 1, 2, 3, 5, 6, 7, 8],
                5: [1, 2, 4, 7, 8],
                6: [3, 4, 7],
                7: [3, 4, 5, 6, 8],
                8: [4, 5, 7]
            };
            
            for (const pieceIndex of aiPieces) {
                const adjacentCells = adjacencyMap[pieceIndex];
                for (const adjCell of adjacentCells) {
                    if (this.board[adjCell] === null) {
                        possibleMoves.push({ from: pieceIndex, to: adjCell });
                    }
                }
            }
            
            // Return random valid move
            if (possibleMoves.length > 0) {
                return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            }
        }
        
        return null;
    }
    
    getHeuristicMove() {
        // Safety check: ensure valid game state
        if (this.gameOver) return null;
        if (this.gameMode !== '1player') return null;
        
        if (this.gamePhase === 'placing') {
            return this.getHeuristicPlacingMove();
        } else {
            return this.getHeuristicMovingMove();
        }
    }
    
    getHeuristicPlacingMove() {
        // Rule 1: Win if possible
        const winMove = this.findWinningMove(this.aiPlayer);
        if (winMove !== null) return winMove;
        
        // Rule 2: Block opponent's winning move
        const blockMove = this.findWinningMove(this.humanPlayer);
        if (blockMove !== null) return blockMove;
        
        // Rule 3: Create a fork (two ways to win)
        const forkMove = this.findForkMove(this.aiPlayer);
        if (forkMove !== null) return forkMove;
        
        // Rule 4: Block opponent's fork
        const blockForkMove = this.findForkMove(this.humanPlayer);
        if (blockForkMove !== null) return blockForkMove;
        
        // Rule 5: Take center (position 4) - most strategic
        if (this.board[4] === null) return 4;
        
        // Rule 6: Take opposite corner if opponent is in a corner
        const oppositeCorner = this.findOppositeCorner();
        if (oppositeCorner !== null) return oppositeCorner;
        
        // Rule 7: Take any empty corner (0, 2, 6, 8)
        const corners = [0, 2, 6, 8];
        const emptyCorners = corners.filter(pos => this.board[pos] === null);
        if (emptyCorners.length > 0) {
            return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
        }
        
        // Rule 8: Take any empty side (1, 3, 5, 7)
        const sides = [1, 3, 5, 7];
        const emptySides = sides.filter(pos => this.board[pos] === null);
        if (emptySides.length > 0) {
            return emptySides[Math.floor(Math.random() * emptySides.length)];
        }
        
        // Fallback: random move
        return this.getRandomMove();
    }
    
    getHeuristicMovingMove() {
        // Get all possible moves
        const possibleMoves = this.getAllPossibleMoves(this.aiPlayer);
        if (possibleMoves.length === 0) return null;
        
        // Rule 1: Win if possible
        for (const move of possibleMoves) {
            if (this.wouldWin(move.from, move.to, this.aiPlayer)) {
                return move;
            }
        }
        
        // Rule 2: Block opponent's winning move
        const opponentMoves = this.getAllPossibleMoves(this.humanPlayer);
        for (const oppMove of opponentMoves) {
            if (this.wouldWin(oppMove.from, oppMove.to, this.humanPlayer)) {
                // Block by moving to that position
                for (const move of possibleMoves) {
                    if (move.to === oppMove.to) {
                        return move;
                    }
                }
            }
        }
        
        // Rule 3: Create multiple winning opportunities
        let bestMove = null;
        let maxWinningWays = 0;
        
        for (const move of possibleMoves) {
            const winningWays = this.countWinningWays(move.from, move.to, this.aiPlayer);
            if (winningWays > maxWinningWays) {
                maxWinningWays = winningWays;
                bestMove = move;
            }
        }
        
        if (bestMove) return bestMove;
        
        // Fallback: random valid move
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
    
    findWinningMove(player) {
        // Only works in placing phase - check all empty cells
        if (this.gamePhase !== 'placing') return null;
        
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === null) {
                // Simulate move - save state
                const originalPiecesPlaced = this.piecesPlaced[player];
                this.board[i] = player;
                this.piecesPlaced[player]++;
                
                const wins = this.checkWinner();
                
                // Restore state
                this.board[i] = null;
                this.piecesPlaced[player] = originalPiecesPlaced;
                
                if (wins) return i;
            }
        }
        return null;
    }
    
    findForkMove(player) {
        // Only works in placing phase
        if (this.gamePhase !== 'placing') return null;
        
        // A fork is a move that creates two winning opportunities
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === null) {
                // Save state for outer simulation
                const originalPiecesPlaced1 = this.piecesPlaced[player];
                this.board[i] = player;
                this.piecesPlaced[player]++;
                
                // Count how many ways this player can win in next move
                let winningMoves = 0;
                for (let j = 0; j < this.board.length; j++) {
                    if (this.board[j] === null) {
                        // Save state for inner simulation
                        const originalPiecesPlaced2 = this.piecesPlaced[player];
                        this.board[j] = player;
                        this.piecesPlaced[player]++;
                        
                        if (this.checkWinner()) winningMoves++;
                        
                        // Restore inner state
                        this.board[j] = null;
                        this.piecesPlaced[player] = originalPiecesPlaced2;
                    }
                }
                
                // Restore outer state
                this.board[i] = null;
                this.piecesPlaced[player] = originalPiecesPlaced1;
                
                // If this creates 2+ winning opportunities, it's a fork
                if (winningMoves >= 2) return i;
            }
        }
        return null;
    }
    
    findOppositeCorner() {
        const cornerPairs = [
            [0, 8], // top-left and bottom-right
            [2, 6]  // top-right and bottom-left
        ];
        
        for (const [corner1, corner2] of cornerPairs) {
            if (this.board[corner1] === this.humanPlayer && this.board[corner2] === null) {
                return corner2;
            }
            if (this.board[corner2] === this.humanPlayer && this.board[corner1] === null) {
                return corner1;
            }
        }
        return null;
    }
    
    getAllPossibleMoves(player) {
        const moves = [];
        const adjacencyMap = {
            0: [1, 3, 4],
            1: [0, 2, 3, 4, 5],
            2: [1, 4, 5],
            3: [0, 1, 4, 6, 7],
            4: [0, 1, 2, 3, 5, 6, 7, 8],
            5: [1, 2, 4, 7, 8],
            6: [3, 4, 7],
            7: [3, 4, 5, 6, 8],
            8: [4, 5, 7]
        };
        
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === player) {
                const adjacentCells = adjacencyMap[i];
                for (const adjCell of adjacentCells) {
                    if (this.board[adjCell] === null) {
                        moves.push({ from: i, to: adjCell });
                    }
                }
            }
        }
        
        return moves;
    }
    
    wouldWin(from, to, player) {
        // Simulate the move
        const originalFrom = this.board[from];
        const originalTo = this.board[to];
        
        this.board[to] = player;
        this.board[from] = null;
        
        const wins = this.checkWinner();
        
        // Undo the move
        this.board[from] = originalFrom;
        this.board[to] = originalTo;
        
        return wins;
    }
    
    countWinningWays(from, to, player) {
        // Simulate the move
        const originalFrom = this.board[from];
        const originalTo = this.board[to];
        
        this.board[to] = player;
        this.board[from] = null;
        
        // Count how many lines this position contributes to
        let winningWays = 0;
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]              // diagonals
        ];
        
        for (const pattern of winPatterns) {
            if (pattern.includes(to)) {
                const [a, b, c] = pattern;
                const line = [this.board[a], this.board[b], this.board[c]];
                
                // Count if this line has player's pieces and empty cells (potential win)
                const playerCount = line.filter(cell => cell === player).length;
                const emptyCount = line.filter(cell => cell === null).length;
                
                if (playerCount >= 2 && emptyCount >= 0) {
                    winningWays++;
                }
            }
        }
        
        // Undo the move
        this.board[from] = originalFrom;
        this.board[to] = originalTo;
        
        return winningWays;
    }
    
    getMinimaxMove() {
        // Safety check: ensure valid game state
        if (this.gameOver) return null;
        if (this.gameMode !== '1player') return null;
        
        if (this.gamePhase === 'placing') {
            return this.getMinimaxPlacingMove();
        } else {
            return this.getMinimaxMovingMove();
        }
    }
    
    getMinimaxPlacingMove() {
        let bestScore = -Infinity;
        let bestMove = null;
        
        // Try all empty cells
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === null) {
                // Save state
                const originalPiecesPlaced = this.piecesPlaced[this.aiPlayer];
                
                // Make move
                this.board[i] = this.aiPlayer;
                this.piecesPlaced[this.aiPlayer]++;
                
                // Evaluate with minimax (depth limited for performance)
                const score = this.minimaxPlacing(4, false, -Infinity, Infinity);
                
                // Restore state
                this.board[i] = null;
                this.piecesPlaced[this.aiPlayer] = originalPiecesPlaced;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    minimaxPlacing(depth, isMaximizing, alpha, beta) {
        // Check terminal states
        const winner = this.checkWinner();
        if (winner) {
            // Determine who won
            const winningPlayer = this.determineWinner();
            if (winningPlayer === this.aiPlayer) return 10 - (4 - depth); // Prefer faster wins
            if (winningPlayer === this.humanPlayer) return -10 + (4 - depth); // Prefer slower losses
        }
        
        // Check if placing phase is complete
        if (this.piecesPlaced.X === 3 && this.piecesPlaced.O === 3) {
            // Transition to moving phase evaluation
            return this.evaluateBoardPosition();
        }
        
        // Depth limit reached
        if (depth === 0) {
            return this.evaluateBoardPosition();
        }
        
        const currentPlayer = isMaximizing ? this.aiPlayer : this.humanPlayer;
        
        if (isMaximizing) {
            let maxScore = -Infinity;
            
            for (let i = 0; i < this.board.length; i++) {
                if (this.board[i] === null) {
                    // Save state
                    const originalPiecesPlaced = this.piecesPlaced[currentPlayer];
                    
                    // Make move
                    this.board[i] = currentPlayer;
                    this.piecesPlaced[currentPlayer]++;
                    
                    const score = this.minimaxPlacing(depth - 1, false, alpha, beta);
                    
                    // Restore state
                    this.board[i] = null;
                    this.piecesPlaced[currentPlayer] = originalPiecesPlaced;
                    
                    maxScore = Math.max(maxScore, score);
                    alpha = Math.max(alpha, score);
                    
                    if (beta <= alpha) break; // Alpha-beta pruning
                }
            }
            
            return maxScore;
        } else {
            let minScore = Infinity;
            
            for (let i = 0; i < this.board.length; i++) {
                if (this.board[i] === null) {
                    // Save state
                    const originalPiecesPlaced = this.piecesPlaced[currentPlayer];
                    
                    // Make move
                    this.board[i] = currentPlayer;
                    this.piecesPlaced[currentPlayer]++;
                    
                    const score = this.minimaxPlacing(depth - 1, true, alpha, beta);
                    
                    // Restore state
                    this.board[i] = null;
                    this.piecesPlaced[currentPlayer] = originalPiecesPlaced;
                    
                    minScore = Math.min(minScore, score);
                    beta = Math.min(beta, score);
                    
                    if (beta <= alpha) break; // Alpha-beta pruning
                }
            }
            
            return minScore;
        }
    }
    
    getMinimaxMovingMove() {
        const possibleMoves = this.getAllPossibleMoves(this.aiPlayer);
        if (possibleMoves.length === 0) return null;
        
        let bestScore = -Infinity;
        let bestMove = null;
        
        for (const move of possibleMoves) {
            // Save state
            const originalFrom = this.board[move.from];
            const originalTo = this.board[move.to];
            
            // Make move
            this.board[move.to] = this.aiPlayer;
            this.board[move.from] = null;
            
            // Evaluate with minimax (depth limited for performance)
            const score = this.minimaxMoving(3, false, -Infinity, Infinity);
            
            // Restore state
            this.board[move.from] = originalFrom;
            this.board[move.to] = originalTo;
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }
    
    minimaxMoving(depth, isMaximizing, alpha, beta) {
        // Check terminal states
        const winner = this.checkWinner();
        if (winner) {
            const winningPlayer = this.determineWinner();
            if (winningPlayer === this.aiPlayer) return 10 - (3 - depth);
            if (winningPlayer === this.humanPlayer) return -10 + (3 - depth);
        }
        
        // Depth limit reached
        if (depth === 0) {
            return this.evaluateBoardPosition();
        }
        
        const currentPlayer = isMaximizing ? this.aiPlayer : this.humanPlayer;
        const possibleMoves = this.getAllPossibleMoves(currentPlayer);
        
        // No moves available (shouldn't happen but handle gracefully)
        if (possibleMoves.length === 0) {
            return 0;
        }
        
        if (isMaximizing) {
            let maxScore = -Infinity;
            
            for (const move of possibleMoves) {
                // Save state
                const originalFrom = this.board[move.from];
                const originalTo = this.board[move.to];
                
                // Make move
                this.board[move.to] = currentPlayer;
                this.board[move.from] = null;
                
                const score = this.minimaxMoving(depth - 1, false, alpha, beta);
                
                // Restore state
                this.board[move.from] = originalFrom;
                this.board[move.to] = originalTo;
                
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);
                
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            
            return maxScore;
        } else {
            let minScore = Infinity;
            
            for (const move of possibleMoves) {
                // Save state
                const originalFrom = this.board[move.from];
                const originalTo = this.board[move.to];
                
                // Make move
                this.board[move.to] = currentPlayer;
                this.board[move.from] = null;
                
                const score = this.minimaxMoving(depth - 1, true, alpha, beta);
                
                // Restore state
                this.board[move.from] = originalFrom;
                this.board[move.to] = originalTo;
                
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);
                
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            
            return minScore;
        }
    }
    
    determineWinner() {
        // Check all winning patterns to determine which player won
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]              // diagonals
        ];
        
        for (const [a, b, c] of winPatterns) {
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        
        return null;
    }
    
    evaluateBoardPosition() {
        // Heuristic evaluation function for non-terminal positions
        // Returns positive score for AI advantage, negative for human advantage
        
        let score = 0;
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]              // diagonals
        ];
        
        for (const [a, b, c] of winPatterns) {
            score += this.evaluateLine(this.board[a], this.board[b], this.board[c]);
        }
        
        return score;
    }
    
    evaluateLine(cell1, cell2, cell3) {
        // Evaluate a single line (row, column, or diagonal)
        let score = 0;
        
        const aiCount = [cell1, cell2, cell3].filter(c => c === this.aiPlayer).length;
        const humanCount = [cell1, cell2, cell3].filter(c => c === this.humanPlayer).length;
        const emptyCount = [cell1, cell2, cell3].filter(c => c === null).length;
        
        // AI has pieces in this line
        if (aiCount > 0 && humanCount === 0) {
            if (aiCount === 3) score += 100;      // Three in a row (win)
            else if (aiCount === 2) score += 10;  // Two in a row
            else if (aiCount === 1) score += 1;   // One in a row
        }
        
        // Human has pieces in this line
        if (humanCount > 0 && aiCount === 0) {
            if (humanCount === 3) score -= 100;     // Three in a row (loss)
            else if (humanCount === 2) score -= 10; // Two in a row (threat)
            else if (humanCount === 1) score -= 1;  // One in a row
        }
        
        // Mixed line has no value (blocked)
        
        return score;
    }
    
    executeAiMovingPhase(from, to) {
        this.board[to] = this.currentPlayer;
        this.board[from] = null;
        this.moveCount++;
        
        // Visual feedback for AI move
        this.cells[to].style.transform = 'scale(1.15)';
        setTimeout(() => {
            this.cells[to].style.transform = '';
        }, 200);
        
        // Extra visual feedback for AI strategic moves (medium/hard)
        if (this.difficulty === 'medium' || this.difficulty === 'hard') {
            this.cells[to].style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.6)';
            setTimeout(() => {
                this.cells[to].style.boxShadow = '';
            }, 800);
        }
        
        this.updateDisplay();
        
        if (this.checkWinner()) {
            this.endGame(`Player ${this.currentPlayer} wins!`);
            return;
        }
        
        this.switchPlayer();
    }
    
    updateDisplay() {
        this.cells.forEach((cell, index) => {
            cell.textContent = this.board[index] === 'X' ? '✕' : 
                              this.board[index] === 'O' ? '○' : '';
            cell.className = 'cell';
            
            if (this.board[index] === 'X') {
                cell.classList.add('x');
            } else if (this.board[index] === 'O') {
                cell.classList.add('o');
            }
            
            if (this.selectedPiece === index) {
                cell.classList.add('selected');
            }
        });
        
        this.currentPlayerDisplay.textContent = this.currentPlayer;
        this.currentPlayerDisplay.className = `player-badge player-${this.currentPlayer.toLowerCase()}`;
        
        this.gamePhaseDisplay.textContent = this.gamePhase === 'placing' ? 'Placing' : 'Moving';
        
        this.xPiecesLeftDisplay.textContent = 3 - this.piecesPlaced.X;
        this.oPiecesLeftDisplay.textContent = 3 - this.piecesPlaced.O;
        
        if (this.gamePhase === 'placing') {
            if (this.piecesPlaced[this.currentPlayer] < 3) {
                if (this.gameMode === '1player') {
                    if (this.currentPlayer === this.humanPlayer) {
                        this.messageDisplay.textContent = `Your turn: Place your piece`;
                    } else {
                        this.messageDisplay.textContent = `AI's turn...`;
                    }
                } else {
                    this.messageDisplay.textContent = `Player ${this.currentPlayer}: Place your piece`;
                }
            }
        } else if (this.gamePhase === 'moving' && !this.gameOver) {
            if (this.gameMode === '1player') {
                if (this.currentPlayer === this.humanPlayer) {
                    if (this.selectedPiece === null) {
                        this.messageDisplay.textContent = `Your turn: Select a piece to move`;
                    } else {
                        this.messageDisplay.textContent = `Your turn: Move to adjacent square`;
                    }
                } else {
                    this.messageDisplay.textContent = `AI is planning...`;
                }
            } else {
                if (this.selectedPiece === null) {
                    this.messageDisplay.textContent = `Player ${this.currentPlayer}: Select a piece to move`;
                } else {
                    this.messageDisplay.textContent = `Player ${this.currentPlayer}: Move to adjacent square`;
                }
            }
        }
    }
    
    endGame(message) {
        this.gameOver = true;
        this.aiThinking = false;
        
        // Customize message for 1-player mode
        if (this.gameMode === '1player') {
            if (this.currentPlayer === this.humanPlayer) {
                this.messageDisplay.textContent = `🎉 You Win! Great job!`;
            } else {
                this.messageDisplay.textContent = `🤖 AI Wins! Try again?`;
            }
        } else {
            this.messageDisplay.textContent = message;
        }
        
        this.messageDisplay.classList.add('winner');
        this.messageDisplay.classList.remove('ai-thinking');
        this.clearHighlights();
        
        this.cells.forEach(cell => {
            cell.classList.add('disabled');
        });
        
        // Add pulse animation to reset button to encourage replay
        this.resetBtn.classList.add('pulse');
        
        // Track game completion
        this.trackEvent('game_complete', `winner_${this.currentPlayer}_mode_${this.gameMode}`);
        this.trackEvent('game_moves', this.moveCount.toString());
        if (this.gameMode === '1player') {
            this.trackEvent('ai_difficulty', this.difficulty);
        }
        
        // Save game to history
        this.saveGameToHistory(this.currentPlayer);
        
        // Show share prompt after a short delay (only if human wins or 2-player)
        if (this.gameMode === '2player' || this.currentPlayer === this.humanPlayer) {
            setTimeout(() => {
                if (confirm('🎉 Great game! Want to challenge your friends?')) {
                    this.shareModal.classList.add('active');
                }
            }, 1500);
        }
    }
    
    resetGame() {
        // Cancel any pending AI move to prevent stuck state
        if (this.aiMoveTimeout) {
            clearTimeout(this.aiMoveTimeout);
            this.aiMoveTimeout = null;
        }
        
        // Close any open modals to prevent interference
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        this.board = Array(9).fill(null);
        this.currentPlayer = this.startingPlayer; // Use selected starting player
        this.gamePhase = 'placing';
        this.piecesPlaced = { X: 0, O: 0 };
        this.selectedPiece = null;
        this.gameOver = false;
        this.moveCount = 0;
        this.gameStartTime = Date.now();
        this.aiThinking = false;
        
        this.messageDisplay.textContent = '';
        this.messageDisplay.classList.remove('winner', 'ai-thinking');
        
        // Remove pulse animation from reset button
        this.resetBtn.classList.remove('pulse');
        
        // Re-enable game settings
        this.enableGameSettings();
        
        this.clearHighlights();
        this.cells.forEach(cell => {
            cell.classList.remove('disabled');
            // Fully reset cell styles (in case AI thinking state wasn't cleared)
            cell.style.pointerEvents = '';
            cell.style.opacity = '';
            cell.style.transform = '';
        });
        
        this.updateDisplay();
        
        // If AI goes first in 1-player mode, trigger AI move
        if (this.gameMode === '1player' && this.currentPlayer === this.aiPlayer) {
            this.scheduleAiMove();
        }
    }
    
    saveGameToHistory(winner) {
        const gameData = {
            winner: winner,
            moves: this.moveCount,
            duration: Math.floor((Date.now() - this.gameStartTime) / 1000),
            timestamp: Date.now(),
            mode: this.gameMode,
            difficulty: this.gameMode === '1player' ? this.difficulty : null
        };
        
        let history = JSON.parse(localStorage.getItem('slidingTicTacToeHistory') || '[]');
        history.unshift(gameData);
        
        // Keep only last 10 games
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        localStorage.setItem('slidingTicTacToeHistory', JSON.stringify(history));
        this.loadHistory();
    }
    
    loadHistory() {
        const history = JSON.parse(localStorage.getItem('slidingTicTacToeHistory') || '[]');
        
        if (history.length === 0) {
            this.historyList.innerHTML = '<div style="text-align: center; color: #a0aec0; font-size: 0.85rem; padding: 10px;">No games played yet</div>';
            return;
        }
        
        this.historyList.innerHTML = history.map(game => {
            const date = new Date(game.timestamp);
            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            // Mode badge
            const modeIcon = game.mode === '1player' ? '🤖' : '👥';
            const difficultyText = game.mode === '1player' && game.difficulty ? ` (${game.difficulty})` : '';
            
            return `
                <div class="history-item">
                    <div>
                        <span class="history-winner ${game.winner.toLowerCase()}">Player ${game.winner}</span> won
                        <span style="color: #a0aec0; margin-left: 4px;">(${game.moves} moves)</span>
                        <span style="margin-left: 6px;">${modeIcon}${difficultyText}</span>
                    </div>
                    <div class="history-date">${dateStr} ${timeStr}</div>
                </div>
            `;
        }).join('');
    }
    
    clearHistory() {
        if (confirm('Are you sure you want to clear all game history?')) {
            localStorage.removeItem('slidingTicTacToeHistory');
            this.loadHistory();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SlidingTicTacToe();
});
