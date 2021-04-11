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
        this.graphics.lineStyle(10, 0xFFFFFF, 0.3);
    }
    fillBackIn(){
        let ocean = new Phaser.Geom.Rectangle();
        ocean.width = config.width;
        ocean.height = config.height;
        
        this.graphics.fillRectShape(ocean);
        this.graphics.lineStyle(1, 0x06a4d6, 0.3);
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
        console.log("game over!")
    }
    

    scareBoat(){
        //this.boats.disableBody(true,true);
        //Ge båten en random velocity åt något håll när den dunkar in i traktorn.
        this.score+=10;
        console.log(this.score);
    }
    
    // sleep(miliseconds) {
    //     var currentTime = new Date().getTime();
     
    //     while (currentTime + miliseconds >= new Date().getTime()) {
    //     }
    //  }
    
    update() {
        
        let mouse = game.input.mousePointer;
        let boatPath = []; 

        // Create Coast
        if (!this.westCoast || !this.eastCoast) {
            this.createCoast();
            this.boats.push(new Boat(this, Phaser.Math.Between(0, config.width), -50));

        }

        // Spawn boats
        if (this.tick >= 60/this.spawnSpeed) {
            this.tick = 0;
            this.spawnSpeed += 0.01;
            this.boats.push(new Boat(this, Phaser.Math.Between(0, config.width), -50));
        }
     
        else {
            this.tick++;
        }

        //Spawn tractors 
        if(this.pirateShipTick >=60/this.piratespawnSpeed){
            this.pirateShipTick = 0; 
            this.spawnSpeed += 0.01;
            this.tractors.add(new Tractor(this, 10,Phaser.Math.Between(100,config.height-500))); 
        }

        else {
            this.pirateShipTick++;
        }



        // Move Boat
        if (this.selectedBoat != null && mouse.isDown) {
            //console.log(mouse.x);
            if (!this.wasDown) {
              //console.log(this.graphics.x, this.graphics.y);
              this.graphics.moveTo(mouse.x, mouse.y);
              this.whiteLine();
              this.pathIndex = 0;
              this.pathSpriteIndex = 0;
              this.path = [];
              this.wasDown = true;
              this.selectedBoat.line = this.graphics.beginPath();
            }
            if(this.selectedBoat.y>100){

             this.score += 10;
            // this.scoreText = this.scoreText.setText('Score: ' + score);

            }
            
            
            if (this.pathIndex == 0 || (this.selectedBoat.path[this.pathIndex - 1].x != mouse.x || this.selectedBoat.path[this.pathIndex - 1].y != mouse.y)) {
                this.graphics.lineTo(mouse.x, mouse.y);
                console.log(this.pathIndex);
                this.graphics.strokePath();
                this.selectedBoat.path[this.pathIndex] = new Phaser.Geom.Point(mouse.x, mouse.y);
                this.pathIndex++;
            }


        } else {
            this.fillBackIn()
            this.wasDown = false;
            this.selectedBoat = null;


        }
        //console.log(this.boats.y);
        
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

    pointerMove (pointer) {
        // if (!pointer.manager.isOver) return;
        
    //     var angleToPointer = Phaser.Math.Angle.Between(this.testBoat.x, this.testBoat.y, pointer.worldX, pointer.worldY);
    //     var angleDelta = Phaser.Math.Angle.Wrap(30-angleToPointer - this.testBoat.rotation);
    //     //console.log(this.testBoat.y);
    //     if (Phaser.Math.Within(angleDelta, 0, 10)) {
    //         this.testBoat.rotation = angleToPointer-130;
    //         this.testBoat.setAngularVelocity(0);
    //     } else {
    //         this.testBoat.setAngularVelocity(Math.sign(angleDelta) * 100);
    //     }
       } 
}
