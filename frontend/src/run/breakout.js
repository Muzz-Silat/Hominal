// <!DOCTYPE html>
// <html>
// <head>
//   <title>Basic Breakout HTML Game</title>
//   <meta charset="UTF-8">
//   <style>
//   html, body {
//     height: 100%;
//     margin: 0;
//   }

//   body {
//     background: black;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
//   </style>
// </head>
// <body>
// <canvas width="400" height="500" id="game"></canvas>
// <script>
function BreakOut(terminalInput){
    let that = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 400;
    this.canvas.height = 500;
    this.canvas.id = 'game';
    this.context = this.canvas.getContext('2d');

    var container;
    var mainScreen;

    // each row is 14 bricks long. the level consists of 6 blank rows then 8 rows
    // of 4 colors: red, orange, green, and yellow
    this.level1 = [
    [],
    [],
    [],
    [],
    [],
    [],
    ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
    ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y'],
    ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y']
    ];

    // create a mapping between color short code (R, O, G, Y) and color name
    this.colorMap = {
    'R': 'red',
    'O': 'orange',
    'G': 'green',
    'Y': 'yellow'
    };

    // use a 2px gap between each brick
    this.brickGap = 2;
    this.brickWidth = 25;
    this.brickHeight = 12;

    // the wall width takes up the remaining space of the canvas width. with 14 bricks
    // and 13 2px gaps between them, thats: 400 - (14 * 25 + 2 * 13) = 24px. so each
    // wall will be 12px
    this.wallSize = 12;
    this.bricks = [];

    // create the level by looping over each row and column in the level1 array
    // and creating an object with the bricks position (x, y) and color
    for (let row = 0; row < this.level1.length; row++) {
    for (let col = 0; col < this.level1[row].length; col++) {
        this.colorCode = this.level1[row][col];

        this.bricks.push({
        x: this.wallSize + (this.brickWidth + this.brickGap) * col,
        y: this.wallSize + (this.brickHeight + this.brickGap) * row,
        color: this.colorMap[this.colorCode],
        width: this.brickWidth,
        height: this.brickHeight
        });
    }
    }

    this.paddle = {
    // place the paddle horizontally in the middle of the screen
    x: this.canvas.width / 2 - this.brickWidth / 2,
    y: 440,
    width: this.brickWidth,
    height: this.brickHeight,

    // paddle x velocity
    dx: 0
    };

    this.ball = {
    x: 130,
    y: 260,
    width: 5,
    height: 5,

    // how fast the ball should go in either the x or y direction
    speed: 2,

    // ball velocity
    dx: 0,
    dy: 0
    };

    // check for collision between two objects using axis-aligned bounding box (AABB)
    // @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    this.collides = function(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y;
    }

    // game loop
    this.loop = function() {
        if(running) {    
        requestAnimationFrame(this.loop.bind(this));
        }
        that.context.clearRect(0,0,that.canvas.width,that.canvas.height);

        // move paddle by it's velocity
        that.paddle.x += that.paddle.dx;

        // prevent paddle from going through walls
        if (that.paddle.x < that.wallSize) {
            that.paddle.x = that.wallSize
        }
        else if (that.paddle.x + that.brickWidth > that.canvas.width - that.wallSize) {
            that.paddle.x = that.canvas.width - that.wallSize - that.brickWidth;
        }

        // move ball by it's velocity
        that.ball.x += that.ball.dx;
        that.ball.y += that.ball.dy;

        // prevent ball from going through walls by changing its velocity
        // left & right walls
        if (that.ball.x < that.wallSize) {
            that.ball.x = that.wallSize;
            that.ball.dx *= -1;
        }
        else if (that.ball.x + that.ball.width > that.canvas.width - that.wallSize) {
            that.ball.x = that.canvas.width - that.wallSize - that.ball.width;
            that.ball.dx *= -1;
        }
        // top wall
        if (that.ball.y < that.wallSize) {
            that.ball.y = that.wallSize;
            that.ball.dy *= -1;
        }

        // reset ball if it goes below the screen
        if (that.ball.y > that.canvas.height) {
            that.ball.x = 130;
            that.ball.y = 260;
            that.ball.dx = 0;
            that.ball.dy = 0;
        }

        // check to see if ball collides with paddle. if they do change y velocity
        if (that.collides(that.ball, that.paddle)) {
            that.ball.dy *= -1;

            // move ball above the paddle otherwise the collision will happen again
            // in the next frame
            that.ball.y = that.paddle.y - that.ball.height;
        }

        // check to see if ball collides with a brick. if it does, remove the brick
        // and change the ball velocity based on the side the brick was hit on
        for (let i = 0; i < that.bricks.length; i++) {
            that.brick = that.bricks[i];

            if (that.collides(that.ball, that.brick)) {
            // remove brick from the bricks array
            that.bricks.splice(i, 1);

            // ball is above or below the brick, change y velocity
            // account for the balls speed since it will be inside the brick when it
            // collides
            if (that.ball.y + that.ball.height - that.ball.speed <= that.brick.y ||
                that.ball.y >= that.brick.y + that.brick.height - that.ball.speed) {
                that.ball.dy *= -1;
            }
            // ball is on either side of the brick, change x velocity
            else {
                that.ball.dx *= -1;
            }

            break;
            }
        }

        // draw walls
        that.context.fillStyle = 'lightgrey';
        that.context.fillRect(0, 0, that.canvas.width, that.wallSize);
        that.context.fillRect(0, 0, that.wallSize, that.canvas.height);
        that.context.fillRect(that.canvas.width - that.wallSize, 0, that.wallSize, that.canvas.height);

        // draw ball if it's moving
        if (that.ball.dx || that.ball.dy) {
            that.context.fillRect(that.ball.x, that.ball.y, that.ball.width, that.ball.height);
        }

        // draw bricks
        that.bricks.forEach(function(brick) {
            that.context.fillStyle = brick.color;
            that.context.fillRect(brick.x, brick.y, brick.width, brick.height);
        });

        // draw paddle
        that.context.fillStyle = 'cyan';
        that.context.fillRect(that.paddle.x, that.paddle.y, that.paddle.width, that.paddle.height);

        //ends the game if no bricks are left
        if(that.bricks.length == 0){
            this.exit("You win! ")
        }
    }

    this.handleKeyDown = function(e) {
        // left arrow key
        if (e.which === 37) {
            that.paddle.dx = -3;
        }
        // right arrow key
        else if (e.which === 39) {
            that.paddle.dx = 3;
        }
        // space key
        // if they ball is not moving, we can launch the ball using the space key. ball
        // will move towards the bottom right to start
        if (that.ball.dx === 0 && that.ball.dy === 0 && e.which === 32) {
            that.ball.dx = that.ball.speed;
            that.ball.dy = that.ball.speed;
        }
    }

    this.handleKeyUp = function(e) {
        if (e.which === 37 || e.which === 39) {
            that.paddle.dx = 0;
        }
    }
    // start the game
    this.run = function() {
        //init main screen
        mainScreen = document.getElementById("main");

        //removing the main screen
        mainScreen.remove();

        running = true;

        //creating the container and setting up game screen
        container = document.createElement("div");
        container.id = "gameContainer";
		container.className = "breakout";
        terminalInput.before(container);

        //terminal completely removed now
        terminalInput.style.display = "none";

        container.appendChild(this.canvas);

        this.initEventListeners();
        this.loop();
    }
    this.initEventListeners = function () {
        // listen to keyboard events to move the paddle
        document.addEventListener('keydown', this.handleKeyDown);
        // listen to keyboard events to stop the paddle if key is released
        document.addEventListener('keyup', this.handleKeyUp);
        hotkeys('ctrl+c, cmd+c', 'breakout', function(){
        that.exit();
        });
        hotkeys.setScope('breakout')
    }
    this.exit = function(text = ""){
        //remove all event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        hotkeys.deleteScope("breakout")

        running = false;

        container.remove()
        this.returnToHome()

        if(text == ""){
            newline.create("exited breakout.", 300, true)
        }else{
            newline.create(text, 0, true)
        }
    };

    this.returnToHome = function(){
        terminalInput.before(mainScreen)
        window.scrollTo(0, document.body.scrollHeight)
        breakout = null;
    }
}