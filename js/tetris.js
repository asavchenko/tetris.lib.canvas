(function() {

    var LC = LibCanvas.extract({}),
        canvas = atom.dom('canvas').first,
        context = canvas.getContext('2d-libcanvas'),
        boardWidth = 10,
        boardHeight = 22,
        cellSize = 16,
        fillCanvasColor = '#000000',
        fillBoardColor = '#212121',
        strokeBoardColor = '#313131',
        fillCellColor = '#505050',
        strokeCellColor = '#616161';
    context.fill(new LC.RoundedRectangle(1, 1, cellSize * boardWidth, cellSize * boardHeight), fillCanvasColor);
    // Shape fill/stroke
    (function() {
        var board = [],
            vboard = [],
            i, j, figures, cx = atom.number.round(boardWidth / 3),
            cy = 0,
            figure,
            getRotated = function(fgr) {
                var tmp = [],
                    i, j, w, h;
                for (i = 0, h = fgr.length; i < h; i += 1) {
                    tmp[i] = [];
                    for (j = 0, w = fgr[i].length; j < w; j += 1) {
                        tmp[i][j] = fgr[j][h - i - 1];
                    }
                }

                if (isIntersect(tmp)) {
                    return fgr;
                }

                return tmp;
            },

            hide = function(fgr) {
                var i, j;
                for (i = cy; i < cy + fgr.length; i += 1) {
                    for (j = cx; j < cx + fgr[i - cy].length; j += 1) {
                        if (typeof vboard[i] !== 'undefined' && typeof vboard[i][j] !== 'undefined') {
                            if (fgr[i - cy][j - cx]) {
                                context.fill(board[i][j], fillBoardColor).stroke(board[i][j], strokeBoardColor);
                                vboard[i][j] = 0;
                            }
                        }
                    }
                }
            },

            show = function(fgr) {
                var i, j;
                for (i = cy; i < cy + fgr.length; i += 1) {
                    for (j = cx; j < cx + fgr[i - cy].length; j += 1) {
                        if (fgr[i - cy][j - cx]) {
                            if (typeof vboard[i] !== 'undefined' && typeof vboard[i][j] !== 'undefined') {
                                context.fill(board[i][j], fillCellColor).stroke(board[i][j], strokeCellColor);
                                vboard[i][j] = 1;
                            }
                        }
                    }
                }
            },

            getRandomFigure = function() {
                var i = 0,
                    l, fg = atom.array.random(figures);
                for (l = atom.number.random(0, 4); i < l; i += 1) {
                    fg = getRotated(fg);
                }

                return fg;
            },

            isIntersect = function(fgr) {
                var i, j;
                for (i = cy; i < cy + fgr.length; i += 1) {
                    for (j = cx; j < cx + fgr[i - cy].length; j += 1) {
                        if (fgr[i - cy][j - cx]) {
                            if (typeof vboard[i] === 'undefined') {
                                return true;
                            }
                            if (typeof vboard[i][j] === 'undefined') {
                                return true;
                            }
                            if (vboard[i][j]) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            },

            updateBoard = function() {
                var i, j, isNeedToRemove;
                for (i = 0; i < vboard.length; i += 1) {
                    isNeedToRemove = true;
                    for (j = 0; j < vboard[i].length; j += 1) {
                        if (!vboard[i][j]) {
                            isNeedToRemove = false;
                            break;
                        }
                    }
                    if (isNeedToRemove) {
                        deleteRow(i);
                    }
                }

                showBoard();
            },

            deleteRow = function(r) {
                var newRow = [],
                    i;
                for (i = 0; i < boardWidth; i += 1) {
                    newRow[i] = 0;
                }
                vboard.splice(r, 1);
                vboard.splice(0, 0, newRow);
            },

            showBoard = function() {
                var i, j, w, h;
                for (i = 0, h = board.length; i < h; i += 1) {
                    for (j = 0, w = board[i].length; j < w; j += 1) {
                        if (typeof vboard[i] !== 'undefined' && typeof vboard[i][j] !== 'undefined') {
                            if (vboard[i][j]) {
                                context.fill(board[i][j], fillCellColor).stroke(board[i][j], strokeCellColor);
                            }
                            else {
                                context.fill(board[i][j], fillBoardColor).stroke(board[i][j], strokeBoardColor);
                            }
                        }
                    }
                }
            };

        for (i = 0; i < boardHeight; i += 1) {
            board[i] = [];
            vboard[i] = [];
            for (j = 0; j < boardWidth; j += 1) {
                board[i][j] = new LC.RoundedRectangle(j * cellSize + j, - cellSize * 2 - 2 + i * cellSize + i, cellSize, cellSize).snapToPixel();
                vboard[i][j] = 0;
                context.fill(board[i][j], fillBoardColor).stroke(board[i][j], strokeBoardColor);
            }
        };

        figures = [
            [
                [1]
            ],
            [
                [1, 1],
                [0, 0]
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [1, 1],
                [1, 1]
            ]
        ];
        atom.Keyboard().events.add({
            'adown': function() {
                hide(figure);
                cy += 1;
                if (isIntersect(figure)) {
                    cy -= 1;
                }
                show(figure);
            },
            'aright': function() {
                hide(figure);
                cx += 1;
                if (isIntersect(figure)) {
                    cx -= 1;
                }
                show(figure);
            },
            'aleft': function() {
                hide(figure);
                cx -= 1;
                if (isIntersect(figure)) {
                    cx += 1;
                }
                show(figure);
            },
            'space': function() {
                hide(figure);
                figure = getRotated(figure);
                show(figure);
            }

        });
        figure = getRandomFigure();

        window.setInterval(function() {
            hide(figure);
            cy += 1;
            if (isIntersect(figure)) {
                cy -= 1;
                show(figure);
                figure = getRandomFigure();
                cy = 0;
                cx = atom.number.round(boardWidth / 3);
                updateBoard();
            }
            else {
                show(figure);
            }
        }, 500);
    })();
}());
