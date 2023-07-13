function Snake(terminalInput){
    let that = this;

    this.terminal = document.getElementById("main")

    this.run = function(){
        that.terminal = document.getElementById("main")
        that.terminal.remove()

        this.div = document.createElement("div")
        this.div.id = "gameContainer"
        terminalInput.before(this.div)

        this.canvas = document.createElement("canvas")
        this.canvas.setAttribute("width", "400")
        this.canvas.setAttribute("height", "400")
        this.canvas.id = "game"

        this.context = this.canvas.getContext('2d');
        this.div.appendChild(this.canvas)

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
        this.grid = 16;
        this.count = 0;

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

        hotkeys.setScope('snake'); // default scope is 'all', we change it to snake so that only hotkeys defined in snake are used.

        requestAnimationFrame(that.loop);
    }

    // get random whole numbers in a specific range
    // @see https://stackoverflow.com/a/1527820/2124254
    this.getRandomInt = function(min, max){
      return Math.floor(Math.random() * (max - min)) + min;
    }

    // game loop
    this.loop = function() {
      requestAnimationFrame(that.loop);

      // slow game loop to 15 fps instead of 60 (60/15 = 4)
      if (++that.count < 4) {
        return;
      }

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
      that.context.fillStyle = 'rgb(102, 146, 199)';
      that.context.fillRect(that.apple.x, that.apple.y, that.grid-1, that.grid-1);

      // draw snake one cell at a time
      that.context.fillStyle = 'greenyellow';
      that.snake.cells.forEach(function(cell, index) {
        // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
        that.context.fillRect(cell.x, cell.y, that.grid-1, that.grid-1);

        // snake ate apple
        if (cell.x === that.apple.x && cell.y === that.apple.y) {
          that.snake.maxCells++;
          that.scoreBox.innerHTML = that.snake.maxCells-4
          // canvas is 400x400 which is 25x25 grids
          that.apple.x = that.getRandomInt(0, 25) * that.grid;
          that.apple.y = that.getRandomInt(0, 25) * that.grid;
        }

        // check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < that.snake.cells.length; i++) {

          // snake occupies same space as a body part. reset game
          if (cell.x === that.snake.cells[i].x && cell.y === that.snake.cells[i].y) {
            that.snake.x = 160;
            that.snake.y = 160;
            that.snake.cells = [];
            that.snake.maxCells = 4;
            that.snake.dx = that.grid;
            that.snake.dy = 0;

            that.apple.x = that.getRandomInt(0, 25) * that.grid;
            that.apple.y = that.getRandomInt(0, 25) * that.grid;
          }
        }
      });
    }

    this.exit = function() {
        that.div.remove()
        this.returnToHome()
        hotkeys.deleteScope('snake');
    }

    this.returnToHome = function(){
        terminalInput.style.display = ""
        document.getElementById("input").focus()
        terminalInput.before(that.terminal)
        window.scrollTo(0, document.body.scrollHeight)
    }

    //unfortunately i do not have a better way of implementing capslock support
    hotkeys('ctrl+c, cmd+c, a,s,d,w, a+s,a+w, w+a,w+d, s+a,s+d, d+w,d+s, capslock+a,capslock+s,capslock+d,capslock+w, capslock+a+s,capslock+a+w, capslock+w+a,capslock+w+d, capslock+s+a,capslock+s+d, capslock+d+w,capslock+d+s', 'snake', function(e, handler){
        switch(true){
            case hotkeys.isPressed(65) && that.snake.dx === 0:
                //console.log("A");
                that.snake.dx = -that.grid;
                that.snake.dy = 0;
            break;
            case hotkeys.isPressed(87) && that.snake.dy === 0:
                //console.log("W");
                that.snake.dy = -that.grid;
                that.snake.dx = 0;
            break;
            case hotkeys.isPressed(68) &&  that.snake.dx === 0:
                //console.log("D");
                that.snake.dx = that.grid;
                that.snake.dy = 0;
            break;
            case hotkeys.isPressed(83) && that.snake.dy === 0:
                //console.log("S");
                that.snake.dy = that.grid;
                that.snake.dx = 0;
            break;
        }

        if(handler.key == 'ctrl+c' || handler.key == 'cmd+c'){
            that.exit();
        }
        return false; //prevent default
    });
}
