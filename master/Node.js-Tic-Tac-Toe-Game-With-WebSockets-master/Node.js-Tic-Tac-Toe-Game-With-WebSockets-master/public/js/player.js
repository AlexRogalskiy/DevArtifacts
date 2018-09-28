class Player {
    constructor(sign) {
        this.play = false;
        this.sign = sign;
    }
    getSign() {
        return this.sign;
    }
    getPlay() {
        return this.play;
    }
    setSign(sign) {
        this.sign = sign;
    }
    setPlay(play) {
        this.play = play;
    }
}
