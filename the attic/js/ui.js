class UI {
    constructor (game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'VT323';
        this.livesImage = document.getElementById('lives');
        this.deadImage = document.getElementById('game_over');
        this.wonImage = document.getElementById('game_won');
    }
    draw(context){
        context.save();
        context.font = this.fontSize + 'px' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        //score
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Score:' + this.game.score, 20, 30);
        //timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time:' + (this.game.timer * 0.001).toFixed(1), 20, 60);
        //stamina
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Stamina:' + (this.game.player.stamina).toFixed(0), 20, 90);
        //lives
        for (let i = 0; i < this.game.lives; i++){
            context.drawImage(this.livesImage, 20 * i + 20, 100, 25, 25);
        }
        //game end messages
        if (this.game.gameOver){
            context.textAlign = 'center';
            this.game.switch = document.getElementById('switch').innerHTML = 'Go back';
            if (this.game.timer <= this.game.maxTime && this.game.lives > 0) {
                this.game.ctx.clearRect(0, 0, this.width, this.height)
                this.game.ctx.drawImage(this.wonImage, 0, 0);
                context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
                context.fillText('Sweet dreams.', this.game.width * 0.5, this.game.height * 0.2 - 30);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('You found the bunny in time and you are safe!', this.game.width * 0.5 , this.game.height * 0.2 + 10);
            } else{
                this.game.ctx.clearRect(0, 0, this.width, this.height)
                this.game.ctx.drawImage(this.deadImage, 0, 0);
                context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
                context.fillText('Better luck next time.', this.game.width * 0.5, this.game.height * 0.2 - 30);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('You failed to reach the bunny and the nightmares got to you.', this.game.width * 0.5, this.game.height * 0.2 + 10);
            }
        }
        context.restore();
    }
}