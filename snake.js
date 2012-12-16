function Snake() {
    this.direction = '';
    this.shape = [];
    this.color = '';

    this.init = function() {
        this.direction = 'right';
        this.shape = [{x:22, y:25}, {x:23, y:25}, {x:24, y:25}, {x:25, y:25}];
        this.color = 'black';
    };

    this.init();
}

Snake.prototype = {
    setDirection: function(keyCode) {

        switch(keyCode) {
        case 38:
            this.direction = (this.direction == 'down') ? 'down' : 'up';
            break;
        case 40:
            this.direction = (this.direction == 'up') ? 'up' : 'down';
            break;
        case 39:
            this.direction = (this.direction == 'left') ? 'left' : 'right';
            break;
        case 37:
            this.direction = (this.direction == 'right') ? 'right' : 'left';
            break;
        default:
            break;

        };
    },

    newHeadPos: function(maxPos) {
        var headCopy = this.shape.slice(-1)[0].clone();

        switch(this.direction) {
        case 'left':
            headCopy.x -= 1;
            if (headCopy.x < 0) { headCopy.x = (maxPos - 1); }
            break;
        case 'right':
            headCopy.x += 1;
            if (headCopy.x > (maxPos - 1)) { headCopy.x = 0; }
            break;
        case 'up':
            headCopy.y -= 1;
            if (headCopy.y < 0) { headCopy.y = (maxPos - 1); }
            break;
        case 'down':
            headCopy.y += 1;
            if (headCopy.y > (maxPos - 1)) { headCopy.y = 0; }
            break;
        default:
            break;
        }

        return headCopy;

    },

    move: function(maxPos) {

        this.shape.push(this.newHeadPos(maxPos));
        this.shape.shift();
    },

    modify: function() {
        var newHead = this.newPos();
    },

    printf: function() {
        for (var i = 0; i < this.shape.length; i++)
            console.log(this.shape[i].x + ' ' + this.shape[i].y);
    }

};

function Board(size) {
    this.size = 0;
    this.matrix = [];

    this.init = function() {
        this.size = size;

        for (var i = 0; i < this.size; i++) {
            this.matrix[i] = new Array(size);
        }
    };
    this.init();
}

Board.prototype = {

    clear: function() {
        for (var i = 0; i < this.size; i++)
            for(var j = 0; j < this.size; j++)
                this.matrix[i][j] = 0;
    },

    printf: function() {
        for (var i = 0; i < this.size; i++)
            console.log(this.matrix[i]);
    }
};

function Bug(_x, _y) {
    this.x = _x;
    this.y = _y;
}

function Game() {
    this.snake = {};
    this.board = {};
    this.bug = {};
    this.cellSize = 0;
    this.margin = 0;

    this.init = function() {
        this.snake = new Snake();
        this.board = new Board(50);
        this.bug = new Bug(14, 15);
        this.cellSize = 4;
        this.margin = 2;
    };

    this.init();
}

Game.prototype = {

    play: function() {

        this.board.clear();

        if (this.checkForBite()) {
            this.init();
        } else if (this.checkForBugConsumption()) {
            this.snake.shape.push(this.snake.newHeadPos());
            this.newBug();
        } else {
            this.snake.move(50);
        }

        this.fillWith(1);
    },

    checkForBite: function() {

        var headPos = this.snake.shape.slice(-1)[0].clone();
        var count = 0;

        for (var i = 0; i < this.snake.shape.length; i++)
            if ((headPos.x == this.snake.shape[i].x) && (headPos.y == this.snake.shape[i].y)) {
                count += 1;
                if (count == 2) {
                    return true;
                }
            }
        return false;
    },

    checkForBugConsumption: function() {

        var headPos = this.snake.shape.slice(-1)[0].clone();
        if ((headPos.x == this.bug.x) && (headPos.y == this.bug.y)) {
            return true;
        }
        return false;
    },

    fillWith: function(content) {

        for (var i = 0, len = this.snake.shape.length; i < len; i++ )
            this.board.matrix[this.snake.shape[i].x][this.snake.shape[i].y] = content;
        this.board.matrix[this.bug.x][this.bug.y] = content;
    },

    newBug: function() {

        var flag = 0;
        while (flag == 0) {
            var x = Math.round(Math.random()*49.9);
            var y = Math.round(Math.random()*49.9);
            for(var i = 0; i < this.snake.shape.length; i++)
                if ((this.snake.shape[i].x == x) && (this.snake.shape[i].y == y)) {
                    flag = 0;
                    break;
                } else {
                    flag = 1;
                }
        }
        this.bug = new Bug(x, y);
    }
};

Object.prototype.clone = function() {

    var newObj = (this instanceof Array) ? [] : {};

    for (i in this) {
        if (i == 'clone') continue;
        if (this[i] && typeof this[i] == "object") {
            newObj[i] = this[i].clone();
        } else newObj[i] = this[i];
    }

    return newObj;
};

var g = new Game();

function draw() {

    var canvas = document.getElementById('snake');

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
    }

    ctx.clearRect(0, 0, 300, 300);
    ctx.fillStyle = g.snake.color;

    for (var i = 0; i < g.board.size; i++)
        for (var j = 0; j < g.board.size; j++)
            if (g.board.matrix[j][i] == 1) {
                ctx.fillRect((j * g.cellSize), (i * g.cellSize), g.cellSize, g.cellSize);
            }

    g.play();
}

document.getElementById('main-body').onkeydown = function(e) {
    g.snake.setDirection(e.keyCode);
    console.log('key-changed' + e.keyCode);
};

document.getElementById('main-body').onload = function() {
    setInterval(draw, 100);
    console.log('snake-element-loaded');
};
