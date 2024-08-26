
let game;

//background sound
function setPlayer(){
    let beat  = new Audio('./music/bgsound.mp3');
    beat.volume = 0.5;
    beat.loop = true;
    beat.addEventListener("canplaythrough", () => {
      beat.play().catch(e => {
         window.addEventListener('click', () => {
            beat.play()
         }, { once: true })
      })
   });
  }
  
setPlayer()
  

class Game {
    constructor(canvas) {
        //canvas
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        //game setup
        this.groundMargin = 80; 
        this.speed = 0;
        this.maxSpeed = 1;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.UI = new UI(this)
        this.enemies = [];
        this.particles = [];
        this.collisions = [];
        this.maxParticles = 50;
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.gameOver = false;
        this.player.currentState = this.player.states[0];
        this.player.currentState.enter();
        //UI values
        this.score = 0;
        this.maxScore = 20;
        this.fontColor = '#ccb76a';
        this.time = 0;
        this.timer = 0;
        this.maxTime = 35000;
        this.lives = 5;
        this.isPaused = false;
        this.isStarted = false;
        this.lastTime;
        this.tempTime = 0;
        this.switch = document.getElementById('switch').innerHTML;
    }
    update(deltaTime) {
        this.timer = this.timer + 10;
        this.time+=deltaTime;
        //background
        if (this.score >= this.maxScore) this.gameOver = true;
        this.background.update();
        this.player.update(this.input.keys, deltaTime);
        //handle enemies
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
        });
        //handle particles
        this.particles.forEach((particle, index) => {
            particle.update();
        });
        if (this.particles.length > this.maxParticles) {
            this.particles.lenght = this.maxParticles;
        }
        //handle collision sprite
        this.collisions.forEach((collision, index) => {
            collision.update(deltaTime);
        });
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        this.particles = this.particles.filter(particle => !particle.markedForDeletion);
        this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
    }
    draw(context) {
        this.background.draw(context);
        this.player.draw(context);
        this.enemies.forEach(enemy => {
            enemy.draw(context);
        });
        this.particles.forEach(particle => {
            particle.draw(context);
        });
        this.collisions.forEach(collision => {
            collision.draw(context);
        });
        this.UI.draw(context);
    }
    addEnemy() {
        if (this.speed > 0 && Math.random() < 0.3) this.enemies.push(new GroundEnemy(this));
        else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
        this.enemies.push(new FlyingEnemy(this))
    }
    animate(timeStamp) {
        if (this.isPaused)
            return;

        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        this.update(deltaTime);
        this.draw(this.ctx);
        if (!this.gameOver) requestAnimationFrame(this.animate.bind(this));
    }

    start = (function() {
        return function() {
            if (!this.isStarted) {
                this.isStarted = true;
                this.isPaused = false;

                this.time = this.tempTime;
                this.lastTime = 0;
                this.timer = this.timer + 10;
                this.animate.call(this, 10)
            }
        };
    })();

    pause = (function() {
        return function() {
            if (this.isStarted && !this.isPaused) {
                this.isStarted = false;
                this.isPaused = true;
                this.tempTime = this.time
            }
        };
    })();

    restart() {
        if (this.gameOver) {
            window.location.reload();
        }
    }
}

//onloaad
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    canvas.width = 900;
    canvas.height = 500;
    
    game = new Game(canvas);
    this.document.getElementById('canvas1').getContext("2d").drawImage(this.document.getElementById("begining_screen"), 0, 0);
    this.window.startGame = game.start.bind(game);
    this.window.pauseGame = game.pause.bind(game);
    this.window.restartGame = game.restart.bind(game);
});
