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
        
        this.initializeGame();
        this.initializePlayerChoice();
        this.loadHistory();
        this.initializeModals();
        this.initializeSharing();
    }
    
    initializeGame() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.updateDisplay();
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
                    
                    // Update display
                    this.updateDisplay();
                    
                    // Track event
                    this.trackEvent('player_choice', selectedPlayer);
                }
            });
        });
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
        
        // How to Play modal
        this.howToPlayBtn.addEventListener('click', () => {
            this.howToPlayModal.classList.add('active');
            this.trackEvent('modal_open', 'how_to_play');
        });
        
        // Share modal
        this.shareBtn.addEventListener('click', () => {
            this.shareModal.classList.add('active');
            this.trackEvent('modal_open', 'share');
        });
        
        // Privacy modal
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
            this.trackEvent('modal_open', 'privacy');
        });
        
        // About modal
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            aboutModal.classList.add('active');
            this.trackEvent('modal_open', 'about');
        });
        
        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
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
        if (this.gameOver) return;
        
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
        
        // Disable player choice after first move
        if (this.moveCount === 1) {
            this.disablePlayerChoice();
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
        } else {
            this.switchPlayer();
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
                this.messageDisplay.textContent = `Player ${this.currentPlayer}: Place your piece        `;
            }
        } else if (this.gamePhase === 'moving' && !this.gameOver) {
            if (this.selectedPiece === null) {
                this.messageDisplay.textContent = `Player ${this.currentPlayer}: Select a piece to move`;
            } else {
                this.messageDisplay.textContent = `Player ${this.currentPlayer}: Move to adjacent square`;
            }
        }
    }
    
    endGame(message) {
        this.gameOver = true;
        this.messageDisplay.textContent = message;
        this.messageDisplay.classList.add('winner');
        this.clearHighlights();
        
        this.cells.forEach(cell => {
            cell.classList.add('disabled');
        });
        
        // Track game completion
        this.trackEvent('game_complete', `winner_${this.currentPlayer}`);
        this.trackEvent('game_moves', this.moveCount.toString());
        
        // Save game to history
        this.saveGameToHistory(this.currentPlayer);
        
        // Show share prompt after a short delay
        setTimeout(() => {
            if (confirm('🎉 Great game! Want to challenge your friends?')) {
                this.shareModal.classList.add('active');
            }
        }, 1500);
    }
    
    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = this.startingPlayer; // Use selected starting player
        this.gamePhase = 'placing';
        this.piecesPlaced = { X: 0, O: 0 };
        this.selectedPiece = null;
        this.gameOver = false;
        this.moveCount = 0;
        this.gameStartTime = Date.now();
        
        this.messageDisplay.textContent = '';
        this.messageDisplay.classList.remove('winner');
        
        // Re-enable player choice
        this.enablePlayerChoice();
        
        this.clearHighlights();
        this.cells.forEach(cell => {
            cell.classList.remove('disabled');
        });
        
        this.updateDisplay();
    }
    
    saveGameToHistory(winner) {
        const gameData = {
            winner: winner,
            moves: this.moveCount,
            duration: Math.floor((Date.now() - this.gameStartTime) / 1000),
            timestamp: Date.now()
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
            
            return `
                <div class="history-item">
                    <div>
                        <span class="history-winner ${game.winner.toLowerCase()}">Player ${game.winner}</span> won
                        <span style="color: #a0aec0; margin-left: 4px;">(${game.moves} moves)</span>
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
