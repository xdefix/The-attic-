const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    HIT: 5,
}
class State{
    
    constructor(state, game){  
        this.state = state;
        this.game = game;
    }
}

class Sitting extends State {
    constructor(game){
        super('SITTING', game);
    }
    enter(){
        this.game.player.fameX = 0;
        this.game.player.frameY = 0;
        this.game.player.maxFrame = 3;
    }
    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')){
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes('ArrowUp')) {
            this.game.player.setState(states.JUMPING, 1)
        } else if (input.includes('Shift')){
            this.game.player.setState(states.ROLLING, 2);

        }
    }
}

class Running extends State {
    constructor(game){
        super('RUNNING',game);
    }
    enter(){
        this.game.player.fameX = 0;
        this.game.player.frameY = 1;
        this.game.player.maxFrame = 5;
    }
    handleInput(input){
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));
        if (input.includes('ArrowDown')){
            this.game.player.setState(states.SITTING, 0);
        } else if (input.includes('ArrowUp')) {
            this.game.player.setState(states.JUMPING, 1);
        } else if (input.includes('Shift')){
            this.game.player.setState(states.ROLLING, 2);

        }
    }
}

class Jumping extends State {
    constructor(game){
        super('JUMPING', game);
    }
    enter(){
        if(this.game.player.onGround()) this.game.player.vy -=20;
        this.game.player.fameX = 0;
        this.game.player.frameY = 2;
        this.game.player.maxFrame = 4;
    }
    handleInput(input){
        if (this.game.player.vy > this.game.player.weight){
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes('Shift')){
            this.game.player.setState(states.ROLLING, 2);

        }
    }
}

class Falling extends State {
    constructor(game){
        super('FALLING', game);
    }
    enter(){
        if(this.game.player.onGround()) this.game.player.vy -=20;
        this.game.player.fameX = 0;
        this.game.player.frameY = 3;
        this.game.player.maxFrame = 4;
    }
    handleInput(input){
        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
        }
    }
}

class Rolling extends State {
    constructor(game){
        super('ROLLING', game);
    }
    enter(){
        if(this.game.player.onGround()) this.game.player.vy -=20;
        this.game.player.fameX = 0;
        this.game.player.frameY = 4;
        this.game.player.maxFrame = 3;
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
         if (!input.includes('Shift') && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
        } else if (!input.includes('Shift') && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes('Shift') && input.includes('ArrowUp') && this.game.player.onGround()){
            this.game.player.vy -= 20;
        }
    }
}

class Hit extends State {
    constructor(game){
        super('HIT', game);
    }
    enter(){
        this.game.player.fameX = 0;
        this.game.player.frameY = 5;
        this.game.player.maxFrame = 5;
    }
    handleInput(input){
         if (this.game.player.frameX >= 5 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
         } else if(this.game.player.frameX >= 5 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1);
         }
    }
}