
//windows.onload--> quand la page se charge il affiche ce quoi lui dit. ici c'est la fonction qu'on crée.
window.onload = function (){
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize=30;
    var ctx;
    //en miliseconde
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;
    
    init();
    
    function init(){
     
    //creation d'un canvas (une toile en francais)
    var canvas = document.createElement('canvas');
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid green";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.background = " url(img.jpg) center";
    //ajout du canvas dans notre page index.html
    document.body.appendChild(canvas);
    
    //on crée une variable a qui on donne un contexte 2d
    ctx = canvas.getContext('2d');
    //creation du serpent
    snakee = new snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
    applee = new Apple([10,10]);
    score = 0;
    refreshCanvas();
             
    }
    
    function refreshCanvas() {
    snakee.advance();
        
    if (snakee.checkCollision()){
        gameOver();
    }
    else {
        if (snakee.isEatingApple(applee)){
            score++;
            snakee.ateApple = true;
            do{
                applee.setNewPosition();

            }
            while (applee.isOnSnake(snakee))
                
        }
         //supprime l'ancien rectangle s'il existe
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        drawScore();
        //ajoue du serpent au canvas
        snakee.draw();
        applee.draw();
        //execute la fonction refreshCanvas a la fin du delay
        timeout = setTimeout(refreshCanvas,delay);
        
        }
   
    }
        
    function gameOver(){
            ctx.save();
            ctx.font = "bold 70px sans-serif";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            var centreX = canvasWidth/2;
            var centreY = canvasHeight/2;
            ctx.lineWidth = 5;
             ctx.strokeText("Game Over",centreX,centreY - 200);
            ctx.fillText("Game Over",centreX,centreY - 200);
            ctx.font = "bold 60px sans-serif";
            ctx.strokeText("Press Space to restart",centreX,centreY - 120);
            ctx.fillText("Press Space to restart",centreX,centreY - 120);
            
            ctx.restore();
        }
    function restart(){
            score = 0;
            snakee = new snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
            applee = new Apple([10,10]);
            clearTimeout(timeout);
            refreshCanvas();
        }
    
    function drawScore(){  ctx.save();
           ctx.font = "bold 200px sans-serif";
           ctx.fillStyle = "#2E8B57";
           ctx.textAlign = "center";
           ctx.textBaseline = "middle";
           var centreX = canvasWidth/2;
           var centreY = canvasHeight/2;
           ctx.fillText(score.toString(),centreX,centreY);
           ctx.restore();
            
        }
    function drawBlock(ctx,position) {
        var x = position[0]*blockSize;
        var y = position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }
    
    function snake(body,direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() 
        {
            ctx.save();
            ctx.fillStyle = "#006400";
            for(var i=0;i<this.body.length;i++)
                {
                drawBlock(ctx,this.body[i]);
                }
            ctx.restore();
        
        };
        
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            
            switch(this.direction){
                case "left":
                     nextPosition[0] -=1;        
                    break;
                case "right":
                    nextPosition[0] +=1;
                    break;
                case "up":
                    nextPosition[1] -=1;
                    break;
                case "down":
                    nextPosition[1] +=1;
                    break;
                default:
                    throw("invalid direction")
                    
            }
            //permet de rajouter nextPosition
            this.body.unshift(nextPosition);
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection){
            var allowedDirections;
            switch(this.direction){
                case "left":        
                case "right":
                    allowedDirections = ["up","down"];
                    break;
                case "up":
                case "down":
                    allowedDirections = ["left","right"];
                    break;  
                default:
                    throw("invalid direction")
            }
            //si ma nouvelle direction fait partie des directions autorisées...
            if(allowedDirections.indexOf(newDirection) > -1)
                this.direction = newDirection;
        };
        
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            //copie tout le cours a partir du makom 1, du coup copie tout sauf la tête :)
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWall = snakeY < minY || snakeY > maxY;
            
            if (isNotBetweenHorizontalWalls||isNotBetweenVerticalWall)
                wallCollision = true;
            
            for (var i=0; i<rest.length;i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCollision = true;
            }
            
            return wallCollision || snakeCollision;
        };
        
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) 
                return true;
            else
                return false;
        };
    }
    
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "red";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize+radius;
            var y = this.position[1]*blockSize+radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            var newX = Math.round(Math.random()* (widthInBlocks - 1));
            var newY = Math.round(Math.random()* (heightInBlocks - 1));
            this.position = [newX,newY];
        };
        
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            
            for (var i = 0; i<snakeToCheck.body.length;i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
                    isOnSnake = true;
            }
            return isOnSnake;
        };
    }
    
    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                    return;
        }
        snakee.setDirection(newDirection);    
    }  
}