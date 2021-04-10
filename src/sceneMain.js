class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });

    }
    
    preload() {
        this.load.image("sprBoat", "content/Lyxbat.png");
        this.load.image("sprBigBoat", "content/bigboat.png");
        this.load.image("sprMediumBoat", "content/mediumboat.png");
        this.load.image("sprTraktor", "content/traktor.png");
    }
    
    create() {
        
        // Background
        this.graphics = this.add.graphics({ fillStyle: { color: 0x06a4d6 } });
        let ocean = new Phaser.Geom.Rectangle();
        
        ocean.width = 1040;
        ocean.height = 720;
        
        this.graphics.fillRectShape(ocean);

        this.westCoast = this.physics.add.staticGroup();



        this.testBoat = new Boat(this, 540, 50); 

        this.testBoat.setInteractive();
        console.log(this.testBoat, this.testBoat.x, this.testBoat.y);
    }
    

    update() {
        
        

        //angle måste sättas mellan 120 och 240 grader. Då kommer nosen att peka ner mot stranden vilket som.
        //this.testBoat.angle = Math.floor(Math.random() * (240 - 120) + 120);;
        // this.testBoat.setAngularVelocity(2100012219192190);
        this.pointerMove(this.input.activePointer);
        
        //console.log(this.testBoat.y);          

    }

    pointerMove (pointer) {
        // if (!pointer.manager.isOver) return;
        
        // Also see alternative method in
        // <https://codepen.io/samme/pen/gOpPLLx>
        
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