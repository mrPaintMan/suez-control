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

        this.scene.physics.add.collider(this, this.scene.westCoast, () => { this.scene.lose(this.scene) })
        this.scene.physics.add.collider(this, this.scene.eastCoast, () => { this.scene.lose(this.scene) })

        this.scene.boats.forEach(boat => {
            this.scene.physics.add.collider(this, boat, () => { this.scene.lose(this.scene) })
        });

        this.setInteractive();
        this.on("pointerdown", () => {this.scene.selectedBoat = this})

        this.path = [];
        this.line = null;

        this.graphics = this.scene.add.graphics();
    }

    followLine() {
        if (this.path != null && this.path.length > 0 ) {
            this.scene.physics.moveTo(this, this.path[0].x, this.path[0].y);
            let boatPoint = new Phaser.Geom.Point(this.x, this.y)

            this.angle = 90+(180/Math.PI)*Phaser.Math.Angle.Between(this.x,this.y,this.path[0].x,this.path[0].y)

            if (Phaser.Math.Distance.BetweenPoints(boatPoint, this.path[0]) < 20) {
                
                this.line.clear();
                this.line.lineStyle(5, 0xFFFFFF, 0.3);
                this.line.strokePoints(this.path);
                this.path.shift();
            }
        }

        else if (this.line != null) {

        }

        else {
            this.path = [];
            this.line = null;
        }
    }
    boatBounce(){
        console.log("boatbounce")
        this.speed = Phaser.Math.Between(50, 75);
        this.angle = this.refAngle > 90 ? this.refAngle - 270: this.refAngle + 90;
    }
}

class Tractor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "sprPirateShip");
        this.setScale(0.08);
        //this.refAngle = Phaser.Math.Between(120,240);
        this.angle = 90;
        this.speed = Phaser.Math.Between(10, 75);
        
        console.log(this.angle);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

       // this.scene.physics.add.collider(this, this.scene.boats, this.boats.boatBounce);

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

        this.scene.physics.add.collider(this, this.scene.boats, () => { this.scene.lose(this.scene) })
    }
}