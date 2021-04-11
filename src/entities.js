class Boat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "sprBoat");
        
        if (x > config.width / 2) {
            this.refAngle = Phaser.Math.Between(100,150);
        }
        else {
            this.refAngle = Phaser.Math.Between(30,80);
        }

        this.angle = this.refAngle > 90 ? this.refAngle - 270: this.refAngle + 90;
        this.speed = Phaser.Math.Between(25, 75);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    

        this.setVelocityY(this.speed * Math.abs(Math.sin(this.refAngle*Math.PI/180)));
        this.setVelocityX(this.speed * (Math.cos(this.refAngle*Math.PI/180)));
        this.scene.physics.add.collider(this, this.scene.westCoast, this.scene.lose)
        this.scene.physics.add.collider(this, this.scene.eastCoast, this.scene.lose)

        this.setInteractive();
        this.on("pointerdown", () => {this.scene.selectedBoat = this})

        this.path = [];
        this.line = null;
        this.pathSpriteIndex = 0;
    }

    followLine() {
        if (this.path != null && this.path.length > 0 && this.pathSpriteIndex < this.path.length - 1) {
            this.pathSpriteIndex = Math.min(this.pathSpriteIndex, this.path.length - 1);
            
            this.scene.physics.moveTo(this, this.path[this.pathSpriteIndex].x, this.path[this.pathSpriteIndex].y);
            let boatPoint = new Phaser.Geom.Point(this.x, this.y)
            
            if (Phaser.Math.Distance.BetweenPoints(boatPoint, this.path[this.pathSpriteIndex]) < 20) {
                this.pathSpriteIndex++;
            }
        }

        else if (this.line != null) {
        }

        else {
            this.path = [];
            this.line = null;
            this.pathSpriteIndex = 0;
        }
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
        this.setImmovable(true)
        

        this.scene.physics.add.collider(this, this.scene.boats, this.scene.lose)
    }
}