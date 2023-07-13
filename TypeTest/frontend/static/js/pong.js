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

    this.run = function () {
      //init main screen
      mainScreen = document.getElementById("main");

      //removing the main screen
      mainScreen.remove();

      //creating the container and setting up game screen
      container = document.createElement("div");
      container.id = "gameContainer";
      terminalInput.before(container);

      //terminal completely removed now
      terminalInput.style.display = "none";

      document.getElementById('gameContainer').appendChild(this.canvas);
      this.context = this.canvas.getContext('2d');

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
      requestAnimationFrame(this.loop.bind(this));
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.leftPaddle.y += this.leftPaddle.dy;
      this.rightPaddle.y += this.rightPaddle.dy;

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
  
      this.context.fillStyle = 'white';
      this.context.fillRect(
        this.leftPaddle.x,
        this.leftPaddle.y,
        this.leftPaddle.width,
        this.leftPaddle.height
      );
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
  
        setTimeout(() => {
          this.ball.resetting = false;
          this.ball.x = this.canvas.width / 2;
          this.ball.y = this.canvas.height / 2;
        }, 400);
      }
  
      if (this.collides(this.ball, this.leftPaddle)) {
        this.ball.dx *= -1;
        this.ball.x = this.leftPaddle.x + this.leftPaddle.width;
      } else if (this.collides(this.ball, this.rightPaddle)) {
        this.ball.dx *= -1;
        this.ball.x = this.rightPaddle.x - this.ball.width;
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
    };

    //we use "that" here instead of func.bind(this) when setting eventlistener. this is because i am unaware of how to remove an eventlistener with a bound function.
    this.handleKeyDown = function (e) {
      if (e.which === 38) {
        that.rightPaddle.dy = -that.paddleSpeed;
      } else if (e.which === 40) {
        that.rightPaddle.dy = that.paddleSpeed;
      }

      if (e.which === 87) {
        that.leftPaddle.dy = -that.paddleSpeed;
      } else if (e.which === 83) {
        that.leftPaddle.dy = that.paddleSpeed;
      }
    };

    this.handleKeyUp = function (e) {
      if (e.which === 38 || e.which === 40) {
        that.rightPaddle.dy = 0;
      }

      if (e.which === 83 || e.which === 87) {
        that.leftPaddle.dy = 0;
      }
    };

    this.initEventListeners = function () {
      document.addEventListener('keydown', this.handleKeyDown);
      document.addEventListener('keyup', this.handleKeyUp);
      hotkeys.setScope('pong')
    };

    hotkeys('ctrl+c, cmd+c', 'pong', function(){
        that.exit();
    });

    this.exit = function(){
        //remove all event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        hotkeys.deleteScope("pong")

        container.remove()
        this.returnToHome()
        newline.create("you played: pong. there is no win condition right now :(")
    };

    this.returnToHome = function(){
        terminalInput.style.display = ""
        document.getElementById("input").focus()
        terminalInput.before(mainScreen)
        window.scrollTo(0, document.body.scrollHeight)
    }
  }
