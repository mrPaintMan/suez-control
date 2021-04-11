class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
    }
    
    preload() {
        
        this.load.image("sprBoat", "content/Lyxbat.png");
        this.load.image("sprBigBoat", "content/bigboat.png");
        this.load.image("sprMediumBoat", "content/mediumboat.png");
        this.load.image("sprTraktor", "content/traktor.png");

        this.load.image("sprLeftTopSand", "content/leftTopSand.png");
        this.load.image("sprLeftSand", "content/leftSand.png");
        this.load.image("sprTopSand", "content/topSand.png");
        this.load.image("sprRightTopSand", "content/rightTopSand.png");
        this.load.image("sprRightSand", "content/rightSand.png");
        this.load.image("sprMiddleSand", "content/middleSand.png");
        this.load.image("sprPirateShip","content/piratskepp.png");
    }
    
    create() {
        this.score = 0;
        this.scoreText;
        this.lost = false;
       
        this.tick = 0;
        this.pirateShipTick = 0;
        this.spawnSpeed = 0.2;
        this.piratespawnSpeed = 0.2; 
        this.boats = [];

        this.selectedBoat = null;
        this.wasDown = false;

        this.path = null;
        this.pathIndex = -1;
        this.pathSpriteIndex = -1;
        
        // Background
        this.graphics = this.add.graphics({ fillStyle: { color: 0x06a4d6 }, strokeStyle: { color: 0xffffff} });
        this.whiteLine();

        //tractors
        this.tractors = this.physics.add.group({
            velocityX: 50,
            velocityY: 0 
        });

        this.physics.add.collider(this.tractors, this.boats, this.scareBoat,null,this);
        this.scoreText =  this.add.text(16, 16, "Score 0", { fontSize: "32px", fill: "#000" });

        this.createCoast();
        this.boats.push(new Boat(this, Phaser.Math.Between(0, config.width), -50));

    }
 
    
    
    whiteLine() {
        let ocean = new Phaser.Geom.Rectangle();
        ocean.width = config.width;
        ocean.height = config.height;

        this.graphics.fillRectShape(ocean);
        this.graphics.lineStyle(5, 0xFFFFFF, 0.3);
    }

    createCoast() {
        this.westCoast = this.physics.add.staticGroup();
        this.eastCoast = this.physics.add.staticGroup();

        for (var y = 0; y < 11; y++) { 

            for (var x = 0; x <= 30; x++) {
                if (y == 10) {
                    this.westCoast.add(new Coast(this, x * 15, (712-(y * 15)), "sprTopSand"));
                    this.eastCoast.add(new Coast(this, 1040 - (x * 15), (712-(y * 15)), "sprTopSand"));
                }
                else{
                    this.westCoast.add(new Coast(this, x * 15, (712-(y * 15)), "sprMiddleSand"));
                    this.eastCoast.add(new Coast(this, 1040 - (x * 15), (712-(y * 15)), "sprMiddleSand"));
                }
            }

            let eastCorner = new Coast(this, 1040 - (x * 15), (712-(y * 15)), (y == 10 ? "sprLeftTopSand" : "sprLeftSand"))
            let westCorner = new Coast(this, x * 15, (712-(y * 15)), (y == 10 ? "sprRightTopSand" : "sprRightSand"));
            this.eastCoast.add(eastCorner);
            this.westCoast.add(westCorner);
        }
    }

    lose(scene) {
        scene.physics.pause();

        let gameOverText = scene.add.text(config.width / 2, config.height / 2, 'Game Over', { fontSize: '48px', fill: '#000' });
        gameOverText.setOrigin(0.5)
        scene.lost = true;
        this.scene.tick = 0;
    }
    

    scareBoat(){
        //this.boats.disableBody(true,true);
        //Ge båten en random velocity åt något håll när den dunkar in i traktorn.
      
    } 



    updateScore(boat){
        //this.boats.disableBody(true,true);
        //Ge båten en random velocity åt något håll när den dunkar in i traktorn.
        boat.destroy();
        this.score+=10;
        console.log(this.score);
        this.scoreText.setText('Points: ' + this.score);
        
    }


    
    update() {
        let mouse = game.input.mousePointer;

        // Spawn boats
        if (this.tick >= 60 / this.spawnSpeed && !this.lost) {
            this.tick = 0;
            this.spawnSpeed += 0.001;
            this.boats.push(new Boat(this, Phaser.Math.Between(0, config.width), -50));
        }
     
        else {
            this.tick++;
        }

        //Spawn tractors 
        if(this.pirateShipTick >= 120 / this.piratespawnSpeed  && !this.lost){
            this.pirateShipTick = 0; 
            this.spawnSpeed += 0.001;
            this.tractors.add(new Tractor(this, 10,Phaser.Math.Between(100,config.height-500))); 
        }

        else {
            this.pirateShipTick++;
        }

        // Move Boat
        if (this.selectedBoat != null && mouse.isDown) {
            if (!this.wasDown) {
              this.wasDown = true;
              this.selectedBoat.line = this.selectedBoat.graphics.beginPath();
              this.selectedBoat.path = [];
            }
            
            
            let length = this.selectedBoat.path.length
            if (this.pathIndex == 0 || length == 0 || (this.selectedBoat.path[length - 1].x != mouse.x || this.selectedBoat.path[length - 1].y != mouse.y)) {
                this.selectedBoat.path.push(new Phaser.Geom.Point(mouse.x, mouse.y));
                this.pathIndex++;
            }


        } else {
            //this.fillBackIn()
            this.wasDown = false;
            this.selectedBoat = null;


        }
        
        this.boats.forEach(boat => {
            if(boat.y>700 && boat.y<750){
                this.boats.splice(this.boats.indexOf(boat),1);

                this.updateScore(boat)
            };
            boat.followLine();
        });
        

        this.physics.collide(
            this.tractors,
            this.boats,
            this.scareBoat,
            null,
        )

        if (this.lost && this.tick > 300) {
            this.scene.start("SceneStart");
        }
    }
}
