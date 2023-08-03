function Snake(terminalInput){
    let that = this;

    this.terminal = document.getElementById("main")
    let running = false;

    let snakeHeadX = new Image();
    snakeHeadX.src = "../../public/static/images/snake/snake-head-x.png";
    //snakeHeadX.src = "https://preview.redd.it/s2noytru6sdb1.png?width=1600&format=png&auto=webp&s=f9e8a2bcef592f4246aa07eb10cc15fac7efd62c";

    let snakeHeadY = document.createElement("img");
    //snakeHeadY.src = "https://preview.redd.it/ufu6wsru6sdb1.png?width=640&crop=smart&auto=webp&s=de73c120464c922e24d9a836d0488a25d2a4c399";
    snakeHeadY.src = "../../public/static/images/snake/snake-head-y.png";

    let snakeBody = document.createElement("img");
    snakeBody.src = "../../public/static/images/snake/snake-skin.png"


    let apple;

    this.run = function(){
        this.initEventListeners() // default scope is 'all', we change it to snake so that only hotkeys defined in snake are used.

        that.terminal = document.getElementById("main")
        that.terminal.remove()

        this.div = document.createElement("div")
        this.div.id = "gameContainer"
        terminalInput.before(this.div)

        this.canvas = document.createElement("canvas")
        this.canvas.setAttribute("width", "800")
        this.canvas.setAttribute("height", "800")
        this.canvas.id = "game"

        this.context = this.canvas.getContext('2d');
        this.div.appendChild(this.canvas)
        //this.div.appendChild(snakeHead)


        //draw score box
        this.scoreBox = document.createElement("div")
        this.scoreBox.id = "score"
        this.canvas.before(this.scoreBox);
        this.scoreBox.innerHTML = 0

        this.controls = document.createElement("div")
        this.canvas.after(this.controls);
        this.controls.innerHTML = "press: w,a,s,d to move | ctrl-c to exit"

        terminalInput.style.display = "none"

        // the canvas width & height, snake x & y, and the apple x & y, all need to be a multiples of the grid size in order for collision detection to work
        // (e.g. 16 * 25 = 400)
        this.grid = 40;
        this.count = 0;

        //abilities
        this.abilityActive = false;
        this.invincibility = false;

        this.snake = {
            x: 160,
            y: 160,

            // snake velocity. moves one grid length every frame in either the x or y direction
            dx: this.grid,
            dy: 0,

            // keep track of all grids the snake body occupies
            cells: [],

            // length of the snake. grows when eating an apple
            maxCells: 4
        };

        this.apple = {
            x: 320,
            y: 320
        };

        this.fruits = [
          {img: new Image(), src: "../../public/static/images/snake/apple2.png"},
          {img: new Image(), src: "https://preview.redd.it/odkqg5f8qvb71.jpg?auto=webp&s=5db42614efbb731913ee7f2a4277c8bc9ad18dc4"},
          {img: new Image(), src: "../../public/static/images/snake/banana.png"},
          {img: new Image(), src: "../../public/static/images/snake/grape.png"},
          {img: new Image(), src: "https://static.vecteezy.com/system/resources/previews/021/952/440/original/southern-fried-chicken-fried-chicken-transparent-background-png.png"},
          {img: new Image(), src: "../../public/static/images/snake/watermelon.png"},
        ]
        for(img of this.fruits){
          img.img.src = img.src;
        }
        that.selectFruit();

        running = true;
        requestAnimationFrame(that.loop);
    }

    // get random whole numbers in a specific range
    // @see https://stackoverflow.com/a/1527820/2124254
    this.getRandomInt = function(min, max){
      return Math.floor(Math.random() * (max - min)) + min;
    }

    // game loop
    this.loop = function() {
      if(running){
        requestAnimationFrame(that.loop.bind(that));
      }

      // slow game loop to 15 fps instead of 60 (60/15 = 4)
      if (++that.count < 6) {
        return;
      }

      //increment snake score if needed
      that.scoreBox.innerHTML = that.snake.maxCells-4

      that.count = 0;
      that.context.clearRect(0,0,that.canvas.width,that.canvas.height);

      // move snake by it's velocity
      that.snake.x += that.snake.dx;
      that.snake.y += that.snake.dy;

      // wrap snake position horizontally on edge of screen
      if (that.snake.x < 0) {
        that.snake.x = that.canvas.width - that.grid;
      }
      else if (that.snake.x >= that.canvas.width) {
        that.snake.x = 0;
      }

      // wrap snake position vertically on edge of screen
      if (that.snake.y < 0) {
        that.snake.y = that.canvas.height - that.grid;
      }
      else if (that.snake.y >= that.canvas.height) {
        that.snake.y = 0;
      }

      // keep track of where snake has been. front of the array is always the head
      that.snake.cells.unshift({x: that.snake.x, y: that.snake.y});

      // remove cells as we move away from them
      if (that.snake.cells.length > that.snake.maxCells) {
        that.snake.cells.pop();
      }

      // draw apple
      that.context.drawImage(apple, that.apple.x, that.apple.y, that.grid-1, that.grid-1);

      // draw snake one cell at a time
      that.context.fillStyle = 'greenyellow';
      that.snake.cells.forEach(function(cell, index) {
        // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
        if(index == 0){
          if(that.snake.dy == 0){
            that.context.drawImage(snakeHeadX, cell.x, cell.y, that.grid-1, that.grid-1);
          }else{
            that.context.drawImage(snakeHeadY, cell.x, cell.y, that.grid-1, that.grid-1);
          }
        }else{
          that.context.drawImage(snakeBody, cell.x, cell.y, that.grid-1, that.grid-1);
        }

        // snake ate apple
        if (cell.x === that.apple.x && cell.y === that.apple.y) {

          if(apple.src.toString().includes("odkqg5f8qvb71")){

            if(apple.src.toString().includes("odkqg5f8qvb71")){
              that.invincibility = true;
              that.abilityText()
              setTimeout(function(){
                that.invincibility = false;
                that.abilityActive = false;
              }, 5000)
            }

            that.abilityActive = true;
          }

          that.selectFruit()
          while(that.abilityActive && apple.src.toString().includes("odkqg5f8qvb71")){
            that.selectFruit()
          }

          that.snake.maxCells++;
          // canvas is 400x400 which is 25x25 grids
          that.apple.x = that.getRandomInt(0, 20) * that.grid;
          that.apple.y = that.getRandomInt(0, 20) * that.grid;
        }

        // check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < that.snake.cells.length; i++) {
          // snake occupies same space as a body part. reset game
          if (index != 0 && that.snake.cells[0].x === that.snake.cells[i].x && that.snake.cells[0].y === that.snake.cells[i].y && !that.invincibility) {
            that.snake.x = 160;
            that.snake.y = 160;
            that.snake.cells = [];
            that.snake.maxCells = 4;
            that.snake.dx = that.grid;
            that.snake.dy = 0;

            that.apple.x = that.getRandomInt(0, 20) * that.grid;
            that.apple.y = that.getRandomInt(0, 20) * that.grid;

            running = false;

            that.context.save()
            that.context.fillStyle = tagColor;
            that.context.strokeStyle = "white"
            that.context.font = "3em monospace";
            that.context.fillText("GAME OVER!", 0, that.canvas.height-60);
            that.context.fillText("SCORE: "+that.scoreBox.innerHTML, 0, that.canvas.height-10);
            that.context.font = "1.5em monospace";
            that.context.fillText("press spacebar to play again", 10, 30);
            that.context.save()
          }
        }
      });
    }

    this.selectFruit = function(){
      apple = that.fruits[that.getRandomInt(0, that.fruits.length)].img;
      console.log(apple)
    }

    this.exit = function() {
        running = false;
        that.div.remove()
        this.returnToHome()
        hotkeys.deleteScope('snake');
    }

    this.returnToHome = function(){
        terminalInput.style.display = ""
        document.getElementById("input").focus()
        terminalInput.before(that.terminal)
        window.scrollTo(0, document.body.scrollHeight)
        snake = null;
    }

    this.abilityText = function(){
      this.writer = function(text, seconds){
        let i = 0;
        this.timer = setInterval(() => {
          i++
          that.context.fillStyle = "firebrick";
          that.context.font = "1.5em monospace";
          that.context.fillText(text+(seconds-(i/100)).toFixed(1)+"s", 10, that.canvas.height-10)
          if(i >= seconds*100){
            clearInterval(this.timer);
          }
        }, 10);
      }

      if(that.invincibility){
        this.writer("edp445 grants invulnerability for: ", 5)
      }
    }

    //unfortunately i do not have a better way of implementing capslock support
    this.initEventListeners = function () {
        hotkeys('ctrl+c, cmd+c, a,s,d,w, a+s,a+w, w+a,w+d, s+a,s+d, d+w,d+s, capslock+a,capslock+s,capslock+d,capslock+w, capslock+a+s,capslock+a+w, capslock+w+a,capslock+w+d, capslock+s+a,capslock+s+d, capslock+d+w,capslock+d+s, space', 'snake', function(e, handler){
          if(hotkeys.isPressed(65) && that.snake.dx === 0){
            //console.log("A");
            that.snake.dx = -that.grid;
            that.snake.dy = 0;
          }
          else if(hotkeys.isPressed(87) && that.snake.dy === 0){
            //console.log("W");
            that.snake.dy = -that.grid;
            that.snake.dx = 0;
          }
          else if(hotkeys.isPressed(68) &&  that.snake.dx === 0){
            //console.log("D");
            that.snake.dx = that.grid;
            that.snake.dy = 0;
          }
          else if(hotkeys.isPressed(83) && that.snake.dy === 0){
            //console.log("S");
            that.snake.dy = that.grid;
            that.snake.dx = 0;
          }

          if(handler.key == 'ctrl+c' || handler.key == 'cmd+c'){
              that.exit();
          }

          if(handler.key == "space" && !running){
            running = true;
            that.loop()
          }
          return false; //prevent default for the keys that execute this function
        });
        hotkeys.setScope('snake')
      };
}
