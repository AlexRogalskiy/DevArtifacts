module.exports = {
Board :
    class Board {
        constructor(p1, p2) {
            this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
            this.players = ["", ""];
            this.plays = 0;
            this.players[0] = p1;
            this.players[1] = p2;
        }
        getPlays() {
            if (this.plays == 0) {
                return "x";
            }
            else {
                return "o";
            }
        }
        push(sign, x, y) {
            if (this.plays == 0) {
                if (sign != this.players[0]) {
                    return 2;
                }
                else {
                    if (this.board[x][y] != "") {
                        return 2;
                    }
                    else {
                        this.board[x][y] = sign;
                        this.plays++;
                        return this.plays;
                    }
                }
            }
            else if (this.plays == 1) {
                if (sign != this.players[1]) {
                    return 2;
                }
                else {
                    if (this.board[x][y] != "") {
                        return 2;
                    }
                    else {
                        this.board[x][y] = sign;
                        this.plays--;
                        return this.plays;
                    }
                }
            }
            return 3;
        }
        win(sign) {
            //stalemate
            let count = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] != "") {
                        count++;
                    }
                }
            }
            if (count == 9) {
                return 2;
            }
            //left diagonal
            count = 0;
            for (let i = 0; i < 3; i++) {
                if (this.board[i][i] === sign) {
                    count++;
                }
            }
            if (count == 3) {
                return 1;
            }
            //right diagonal
            count = 0;
            for (let i = 0; i < 3; i++) {
                if (this.board[i][2 - i] === sign) {
                    count++;
                }
            }
            if (count == 3) {
                return 1;
            }
            //row
            count = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === sign) {
                        count++;
                    }
                }
                if (count != 3) {
                    count = 0;
                }
                else {
                    return 1;
                }
            }
            //col
            count = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[j][i] === sign) {
                        count++;
                    }
                }
                if (count != 3) {
                    count = 0;
                }
                else {
                    return 1;
                }
            }
            return 0;
        }
    }
};