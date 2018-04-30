var level01 = function (window) {

    window.opspark = window.opspark || {};

    var draw = window.opspark.draw;
    var createjs = window.createjs;
    var groundY;
    window.opspark.runLevelInGame = function(game) {
        // some useful constants 
        groundY = game.groundY; 
        var canvasWidth = window.innerWidth;
        
        // this data will allow us to define all of the
        // behavior of our game
        var levelData = {
            name: "Robot Romp",
            number: 1, 
            speed: -3,
            gameItems: [
                {type: 'spinner',x:400,y:groundY},
                {type: 'spinner',x:600,y:groundY - 120},
                {type: 'spinner',x:800,y:groundY},
                {type: 'spinner',x:1200,y:groundY - 20},
                {type: 'enemy', x: 1600, y: groundY -50, v: -2},
                {type: 'enemy', x: 2000, y: groundY - 50, v:-4},
                {type: 'enemy', x: 2400, y: groundY - 50, v:-5},
                {type: 'yodelKid', x:1700, y:groundY},
                {type: 'yodelKid', x:2100, y:groundY}
            ]
        };
        window.levelData = levelData;
        // set this to true or false depending on if you want to see hitzones
        
        game.setDebugMode(false);

        // BEGIN EDITING YOUR CODE HERE
        function sound(src) {
            this.sound = document.createElement("audio");
            this.sound.src = src;
            this.sound.setAttribute("preload", "auto");
            this.sound.setAttribute("controls", "none");
            this.sound.style.display = "none";
            document.body.appendChild(this.sound);
            this.play = function(){
                this.sound.play();
            };
            this.stop = function(){
                this.sound.pause();
            };
        }
        var mySound = new sound("roblox-death-sound-effect.mp3");
        
         
        function createEnemy(x,y,v) {
            var enemy =  game.createGameItem('enemy',25);
            var redSquare = draw.bitmap('img/harold.png');
            enemy.onPlayerCollision = function() {
                game.changeIntegrity(-15);
                mySound.play();
                var playPromise = mySound.play();
                // In browsers that don’t yet support this functionality,
                // playPromise won’t be defined.
                if (playPromise !== undefined) {
                  playPromise.then(function() {
                    // Automatic playback started!
                  }).catch(function(error) {
                    // Automatic playback failed.
                    // Show a UI element to let the user manually start playback.
                  });
                
                }
            };
            enemy.onProjectileCollision = function() {
                game.increaseScore(100);
                enemy.shrink();
                createEnemy(x,y,v); 
            };
            redSquare.x = -25;
            redSquare.y = -25;
            enemy.addChild(redSquare);
            enemy.x = x;
            enemy.y = y;
            enemy.velocityX = v;
            game.addGameItem(enemy);
        }
        function createFidget(x,y) {
            var hitZoneSize = 25;
            var damageFromObstacle = 10;
            var myObstacle = game.createObstacle(hitZoneSize,damageFromObstacle);
            myObstacle.onPlayerCollision = function() {
                mySound.play();
                game.changeIntegrity(-10);
            };
            myObstacle.x = x;
            myObstacle.y = y;
            var obstacleImage = draw.bitmap('img/thefidget.png');
            myObstacle.addChild(obstacleImage);
            game.addGameItem(myObstacle);
            obstacleImage.x = -30;
            obstacleImage.y = -30;
            myObstacle.rotationalVelocity = -5;
        }
        var createSawBlade = function(x,y) {
            var hitZoneSize = 25;
            var damageFromObstacle = 10;
            var myObstacle = game.createObstacle(hitZoneSize,damageFromObstacle);
            myObstacle.x = x;
            myObstacle.y = y;
            var obstacleImage = draw.bitmap('img/sawblade.png');
            myObstacle.addChild(obstacleImage);
            game.addGameItem(myObstacle);
            obstacleImage.x = -25;
            obstacleImage.y = -25;
        };
        function createTidePod(x,y) {
            var hitZoneSize = 25;
            var damageFromPod = 0;
            var myReward = game.createObstacle(hitZoneSize,damageFromPod);
            
            myReward.x = x;
            myReward.y = y;
            var obstacleImage = draw.bitmap('img/TidePod.png');
            myReward.addChild(obstacleImage);
            game.addGameItem(myReward);
            obstacleImage.x = -30;
            obstacleImage.y = -30;
            myReward.onPlayerCollision = function() {
                myReward.fadeOut();
            };
        }
        function createYodelKid(x,y) {
            var enemy =  game.createGameItem('enemy',50);
            var enemyImage = draw.bitmap('img/yodel.png');
            enemy.onPlayerCollision = function() {
                game.changeIntegrity(-15);
                mySound.play();
                
            };
            enemy.onProjectileCollision = function() {
                game.increaseScore(100);
                enemy.fadeOut();
                createYodelKid(x,y);
            };
            enemyImage.x = -160;
            enemyImage.y = -350;
            enemy.addChild(enemyImage);
            enemy.x = x;
            enemy.y = y;
            enemy.velocityX = -1;
            game.addGameItem(enemy);
        }
        for (var i=0;i<50;i++) {
            var locationY;
            function randomY() {
                var y = Math.floor((Math.random()*3)+1);
                if (y===1) {
                    locationY = groundY;
                } else if (y===2) {
                    locationY = groundY - 20;
                } else if (y===3) {
                    locationY = groundY - 120;
                }
            }
            randomY();
            levelData.gameItems.push({type:'spinner',x: ((i*400)+1600),y:locationY});
        }
        
        for (var i = 0; i <= levelData.gameItems.length - 1; i++) {
            if (levelData.gameItems[i].type === 'spinner') {
                createFidget(levelData.gameItems[i].x, levelData.gameItems[i].y);
            } else if (levelData.gameItems[i].type === 'enemy') {
                createEnemy(levelData.gameItems[i].x, levelData.gameItems[i].y, levelData.gameItems[i].v);
            } else if (levelData.gameItems[i].type === 'yodelKid') {
                createYodelKid(levelData.gameItems[i].x, levelData.gameItems[i].y);
            }

        }
        
        var interval = setInterval(function() {
            if (game.getScore() === 1000) {
                createTidePod(canvasWidth, groundY -120);
                clearInterval(interval);
            }
        }, 1000);
        
        
    };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = level01;
}