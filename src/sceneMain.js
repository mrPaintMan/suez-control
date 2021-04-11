class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
        let score = 0; 
        let scoreText; 
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
    }
    
    create() {
        
      

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
      //  this.tractors.body.setImmovable(true);
        this.scoreText = this.add.text(16, 16, "Score 0", { fontSize: "32px", fill: "#000" });

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

    lose() {
        //this.physics.pause();
    }
    

    scareBoat(){
        //this.boats.disableBody(true,true);
        //Ge båten en random velocity åt något håll när den dunkar in i traktorn.
        this.score+=10;
        console.log(this.score);
    }
    
    update() {
        
        let mouse = game.input.mousePointer;

        // Create Coast
        if (!this.westCoast || !this.eastCoast) {
            this.createCoast();
            this.boats.push(new Boat(this, Phaser.Math.Between(0, config.width), -50));

        }

        // Spawn boats
        if (this.tick >= 60/this.spawnSpeed) {
            this.tick = 0;
            this.spawnSpeed += 0.001;
            this.boats.push(new Boat(this, Phaser.Math.Between(0, config.width), -50));
        }
     
        else {
            this.tick++;
        }

        //Spawn tractors 
        if(this.pirateShipTick >=120/this.piratespawnSpeed){
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
            if(this.selectedBoat.y>100){

             this.score += 10;
            // this.scoreText = this.scoreText.setText('Score: ' + score);

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
            boat.followLine();
        });
        

        this.physics.collide(
            this.tractors,
            this.boats,
            this.scareBoat,
            null,
        )
    }
}
