class Player {
    constructor(game) {
        this.game = game;
        this.width = 95;
        this.height = 128;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 0.5;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.fraemY = 0;
        this.maxFrame;
        this.fps = 7;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 3;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Hit(this.game)];
        this.stamina = 100;
    }
    update(input, deltaTime) {
        this.checkCollisions();
        this.currentState.handleInput(input);
        //horizontal movement
        this.x += this.speed;
        if (input.includes('ArrowRight') && this.currentState !== this.states[5]) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[5]) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        if (this.vy > this.maxSpeed) this.vy = this.maxSpeed
        //ground border
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        //top border
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
        //sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        //stamina
        if (input.includes('Shift') && this.currentState == this.states[4]) {
            this.stamina = this.stamina - 0.1;
        } if (this.stamina < 0) {
            this.game.player.setState(states.RUNNING, 1);
        } if (this.currentState == this.states[1] && this.stamina < 100) {
            this.stamina = this.stamina + 0.1;
        } if (this.currentState == this.states[0] && this.stamina < 100) {
            this.stamina = this.stamina + 0.1;
        } if (this.currentState == this.states[2] && this.stamina < 100) {
            this.stamina = this.stamina + 0.1;
        } if (this.currentState == this.states[3] && this.stamina < 100) {
            this.stamina = this.stamina + 0.1;
        }

    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollisions() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4]) {
                    this.game.score++;
                } else {
                    this.setState(5, 0);
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true
                }
            }
        })
    }
}