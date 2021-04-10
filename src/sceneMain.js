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
        this.load.image("sprTopSand", "content/topSand.png");
        this.load.image("sprRightTopSand", "content/rightTopSand.png");
        this.load.image("sprLeftSand", "content/leftSand.png");
    }
    
    create() {
        
        // Background
        this.graphics = this.add.graphics({ fillStyle: { color: 0x06a4d6 } });
        let ocean = new Phaser.Geom.Rectangle();
        
        ocean.width = 1040;
        ocean.height = 720;
        
        this.graphics.fillRectShape(ocean);

        this.westCoast = this.physics.add.staticGroup();
        this.eastCoast = this.physics.add.staticGroup();
        console.log(this.eastCoast, this.westCoast);

        for(var y = 0; y < 3; y++) { 
            for (var x = 0; x <= 30; x++) {
                if (y == 3) {
                    this.westCoast.add(new Coast(this, x * 15, (705-(y * 15)), "sprTopSand"));
                    this.eastCoast.add(new Coast(this, 1040 - (x * 15), (705-(y * 15)), "sprTopSand"));
                }
                else if (x == 0){
                    this.westCoast.add(new Coast(this, x * 15, (705-(y * 15)), "sprLeftSand"));
                    this.eastCoast.add(new Coast(this, 1040 - (x * 15), (705-(y * 15)), "sprLeftSand"));
                }
                else{
                    this.westCoast.add(new Coast(this, x * 15, (705-(y * 15)), "sprTopSand"));
                    this.eastCoast.add(new Coast(this, 1040 - (x * 15), (705-(y * 15)), "sprTopSand"));
                }
            }
        }

        // Boats
        this.boats = this.physics.add.group({
            velocityX: 0,
            velocityY: 200
        });

        //tractors
        this.tractors = this.physics.add.group({
            velocityX: 20,
            velocityY: 0 
        });



        this.physics.add.collider(this.westCoast, this.scene.boats)
        this.physics.add.collider(this.eastCoast, this.scene.boats)

        
    
    }

    createCoast() {
        this.westCoast = this.physics.add.staticGroup();
        this.eastCoast = this.physics.add.staticGroup();
        console.log(this.eastCoast, this.westCoast);

        for(var y = 0; y < 3; y++) { 
            for (var x = 0; x <= 30; x++) {
                if (y == 3) {
                    this.westCoast.add(new Coast(this, x * 15, (705-(y * 15)), "sprTopSand"));
                    this.eastCoast.add(new Coast(this, 1040 - (x * 15), (705-(y * 15)), "sprTopSand"));
                }
                else if (x == 0){
                    this.westCoast.add(new Coast(this, x * 15, (705-(y * 15)), "sprLeftSand"));
                    this.eastCoast.add(new Coast(this, 1040 - (x * 15), (705-(y * 15)), "sprLeftSand"));
                }
                else{
                    this.westCoast.add(new Coast(this, x * 15, (705-(y * 15)), "sprTopSand"));
                    this.eastCoast.add(new Coast(this, 1040 - (x * 15), (705-(y * 15)), "sprTopSand"));
                }
            }
        }
    }

    lose() {
        //this.physics.pause();
        console.log("hej")
    }

    scareBoat(){
        //Ge båten en random velocity åt något håll när den dunkar in i traktorn.
    }
    
    sleep(miliseconds) {
        var currentTime = new Date().getTime();
     
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
     }
    

    update() {
       
       if (game.input.mousePointer.isDown) {
           this.boats.add(new Boat(this, Phaser.Math.Between(100,900), -200));
           this.tractors.add(new Tractor(this, 0,Phaser.Math.Between(100,600)) );
        }


       
        this.physics.collide(
            this.boats,
            this.westCoast,
            this.lose,
            null,
        )

        this.physics.collide(
            this.boats,
            this.eastCoast,
            this.lose,
            null,
        )

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

class Boat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "sprBoat");
        
        this.refAngle = Phaser.Math.Between(120,240);
        this.angle = this.refAngle;
        this.speed = Phaser.Math.Between(50, 75);
        console.log(this.angle);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    

        this.setVelocityY(this.speed);
        this.setVelocityX(this.speed * (Math.atan(this.angle*(Math.PI/180))*this.speed)/200);
    }
}

class Tractor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "sprTraktor");
        
        //this.refAngle = Phaser.Math.Between(120,240);
        this.angle = 90;
        this.speed = Phaser.Math.Between(10, 75);
        console.log(this.angle);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setVelocityY(0);
        this.setVelocityX(this.speed);
    }
}



class Coast extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {

        super(scene, x, y, key);

        this.tabIndex = 1
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(0.2);
        this.setImmovable(true)
        

        //this.scene.physics.add.collider(this, this.scene.player)
    }
}
