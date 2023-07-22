function Pong(terminalInput) {
    let that = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 750;
    this.canvas.height = 585;
    this.canvas.id = 'game';

    this.context = this.canvas.getContext('2d');
    this.grid = 15;
    this.paddleHeight = this.grid * 5;
    this.maxPaddleY = this.canvas.height - this.grid - this.paddleHeight;

    var container;
    var mainScreen;

    //boolean value that decides whether loop continues or not. false on exit true on run
    let running;

    this.paddleSpeed = 6;
    this.ballSpeed = 5;

    this.leftPaddle = {
      x: this.grid * 2,
      y: this.canvas.height / 2 - this.paddleHeight / 2,
      width: this.grid,
      height: this.paddleHeight,
      dy: 0
    };

    this.rightPaddle = {
      x: this.canvas.width - this.grid * 3,
      y: this.canvas.height / 2 - this.paddleHeight / 2,
      width: this.grid,
      height: this.paddleHeight,
      dy: 0
    };

    this.ball = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: this.grid,
      height: this.grid,
      resetting: false,
      dx: this.ballSpeed,
      dy: -this.ballSpeed
    };

    this.scoreBox = document.createElement("div")
    this.scorePlayer = document.createElement("span")
    this.scoreBot = document.createElement("span")

    this.run = function () {
      //resetting some of the variables for certain objects
      Object.assign(this.leftPaddle, {
        x: this.grid * 2,
        y: this.canvas.height / 2 - this.paddleHeight / 2,
      })

      Object.assign(this.leftPaddle, {
        x: this.grid * 2,
        y: this.canvas.height / 2 - this.paddleHeight / 2,
      })

      //init main screen
      mainScreen = document.getElementById("main");

      //removing the main screen
      mainScreen.remove();

      running = true;

      //creating the container and setting up game screen
      container = document.createElement("div");
      container.id = "gameContainer";
      terminalInput.before(container);

      //terminal completely removed now
      terminalInput.style.display = "none";

      document.getElementById('gameContainer').appendChild(this.canvas);
      this.context = this.canvas.getContext('2d');

      //draw score box
      this.scoreBox.id = "score"
      this.scoreBox.classList.add("pong")
      this.canvas.before(this.scoreBox);

      this.scorePlayer.id = "player"
      this.scoreBox.appendChild(this.scorePlayer);
      this.scorePlayer.innerHTML = 0

      this.scoreBot.id = "bot"
      this.scoreBox.appendChild(this.scoreBot);
      this.scoreBot.innerHTML = 0

      this.controls = document.createElement("div")
      this.canvas.after(this.controls);
      this.controls.innerHTML = "press: w,s/▲,▼ to move | ctrl-c to exit"

      this.initEventListeners();
      this.loop();
    };

    this.collides = function (obj1, obj2) {
      return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
      );
    };

    this.loop = function () {
      if(running){
        requestAnimationFrame(this.loop.bind(this));
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.leftPaddle.y += this.leftPaddle.dy;
      this.rightPaddle.y += this.rightPaddle.dy;

      //keeping paddles on screen
      if (this.leftPaddle.y < this.grid) {
        this.leftPaddle.y = this.grid;
      } else if (this.leftPaddle.y > this.maxPaddleY) {
        this.leftPaddle.y = this.maxPaddleY;
      }

      if (this.rightPaddle.y < this.grid) {
        this.rightPaddle.y = this.grid;
      } else if (this.rightPaddle.y > this.maxPaddleY) {
        this.rightPaddle.y = this.maxPaddleY;
      }
  
      this.context.fillStyle = 'greenyellow';

      this.context.fillRect(
        this.leftPaddle.x,
        this.leftPaddle.y,
        this.leftPaddle.width,
        this.leftPaddle.height
      );

      this.context.fillStyle = 'white';
      this.context.fillRect(
        this.rightPaddle.x,
        this.rightPaddle.y,
        this.rightPaddle.width,
        this.rightPaddle.height
      );

      this.ball.x += this.ball.dx;
      this.ball.y += this.ball.dy;

      if (this.ball.y < this.grid) {
        this.ball.y = this.grid;
        this.ball.dy *= -1;
      } else if (this.ball.y + this.grid > this.canvas.height - this.grid) {
        this.ball.y = this.canvas.height - this.grid * 2;
        this.ball.dy *= -1;
      }

      if (
        (this.ball.x < 0 || this.ball.x > this.canvas.width) &&
        !this.ball.resetting
      ) {
        this.ball.resetting = true;
        this.paddleSpeed = 6
        if(this.ball.dx>0){
            this.ball.dx = 5;
            this.scorePlayer.innerHTML = Number(this.scorePlayer.innerHTML) + 1;
        }
        else{
            this.ball.dx = -5;
            this.scoreBot.innerHTML = Number(this.scoreBot.innerHTML) + 1;
        }
  
        setTimeout(() => {
          this.ball.resetting = false;
          this.ball.x = this.canvas.width / 2;
          this.ball.y = this.canvas.height / 2;
        }, 400);
      }
  
      if (this.collides(this.ball, this.leftPaddle)) {
        this.ball.dx *= -1;
        this.ball.x = this.leftPaddle.x + this.leftPaddle.width;

        this.ball.dx*=1.05
        this.paddleSpeed*=1.025

      } else if (this.collides(this.ball, this.rightPaddle)) {
        this.ball.dx *= -1;
        this.ball.x = this.rightPaddle.x - this.ball.width;

        this.ball.dx*=1.05
        this.paddleSpeed*=1.025
      }
  
      this.context.fillRect(
        this.ball.x,
        this.ball.y,
        this.ball.width,
        this.ball.height
      );

      this.context.fillStyle = 'lightgrey';
      this.context.fillRect(0, 0, this.canvas.width, this.grid);
      this.context.fillRect(
        0,
        this.canvas.height - this.grid,
        this.canvas.width,
        this.canvas.height
      );

      for (let i = this.grid; i < this.canvas.height - this.grid; i += this.grid * 2) {
        this.context.fillRect(
          this.canvas.width / 2 - this.grid / 2,
          i,
          this.grid,
          this.grid
        );
      }

      //autonomous controls. change the fraction in the last condition to change difficulty. 0-impossible 1-nothing
      if((this.ball.y != this.rightPaddle.y) &&(this.ball.dx > 0) && Math.random()>0.25){
        if(this.ball.y > this.rightPaddle.y){
            that.rightPaddleMove(false, true, false)
        }else if(this.ball.dy < this.rightPaddle.y){
            that.rightPaddleMove(true, false, false)
        }else{
            that.rightPaddleMove(false, false, true)
        }
      }else{
        that.rightPaddleMove(false, false, true)
      }

      if(this.scoreBot.innerHTML==10){
        let i = 0;
        let interval = setInterval(() => {
            i+=1
            this.context.fillStyle = `rgba(102, 146, 199,${(i/100)*1})`;
            this.context.font = "2em monospace";
            this.context.fillText("nice try loser", this.canvas.width/+50, this.canvas.height/2+100)
            if(i>=200){
                clearInterval(interval);
            }
        }, 10);
        running=false;
        setTimeout(() => {
            this.exit(`${this.scoreBot.innerHTML}-<p>${this.scorePlayer.innerHTML}</p> to the bot... noob! `)
        }, 1000);
       }else if(this.scorePlayer.innerHTML==10){
        let i = 0;
        let interval = setInterval(() => {
            i+=1
            this.context.fillStyle = `rgba(177, 255, 55,${(i/100)*1})`;
            this.context.font = "2em monospace";
            this.context.fillText("winner, winner!", this.canvas.width/+50, this.canvas.height/2+100);
            if(i>=200){
                clearInterval(interval);
            }
        }, 10);
        running=false;
        setTimeout(() => {
            this.exit(`<p>${this.scorePlayer.innerHTML}</p>-${this.scoreBot.innerHTML} against the bot. good! `)
        }, 1000);
      }
    };

    //we use "that" here instead of func.bind(this) when setting eventlistener. this is because i am unaware of how to remove an eventlistener with a bound function.
    this.handleKeyDown = function (e) {
      if (e.which === 87 || e.which === 38) {
        that.leftPaddle.dy = -that.paddleSpeed;
      } else if (e.which === 83 || e.which == 40) {
        that.leftPaddle.dy = that.paddleSpeed;
      }
    };

    this.handleKeyUp = function (e) {
      if (e.which === 83 || e.which === 87 ||  e.which == 40 ||  e.which == 38) {
        that.leftPaddle.dy = 0;
      }
    };

    this.rightPaddleMove = function(up, down, stationary){
        //move
        if (up) {
            that.rightPaddle.dy = -that.paddleSpeed;
        }
        else if(down) {
            that.rightPaddle.dy = that.paddleSpeed;
        }
        else if (stationary) {
            that.rightPaddle.dy = 0;
        }
    }

    this.initEventListeners = function () {
      document.addEventListener('keydown', this.handleKeyDown);
      document.addEventListener('keyup', this.handleKeyUp);
      hotkeys('ctrl+c, cmd+c', 'pong', function(){
        that.exit();
      });
      hotkeys.setScope('pong')
    };

    this.exit = function(text = ""){
        //remove all event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        hotkeys.deleteScope("pong")
        this.scoreBox.classList.remove("pong")

        running = false;

        container.remove()
        this.returnToHome()

        if(text == ""){
            newline.create("exited pong.", 300, true)
        }else{
            newline.create(text, 0, true)
        }
    };

    this.returnToHome = function(){
        terminalInput.before(mainScreen)
        window.scrollTo(0, document.body.scrollHeight)
        console.log(pong)
        pong = null;
        console.log(pong)

    }
}
