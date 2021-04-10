class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
        this.player = undefined
    }
    
    preload() {
        this.load.image("sprBoat", "content/bat.png");
        this.load.image("sprBigBoat", "content/bigboat.png");
        this.load.image("sprMediumBoat", "content/mediumboat.png");
        this.load.image("sprTraktor", "content/traktor.png");
    }
    
    create() {
        this.add.sprite(Math.floor(Math.random()*100), Math.floor(Math.random()*100), "sprBoat");
    }

    

    handleControls() {
        // Let the followpoint move (and the camera to follow it)
        if (this.keyW.isDown) {
            this.player.setVelocityY(-this.cameraSpeed);
            
            this.player.play("walkUp", true)

            if (this.keyA.isUp && this.keyD.isUp) {
                this.player.setVelocityX(0)
            }
        }
        if (this.keyS.isDown) {
            this.player.setVelocityY(this.cameraSpeed);
            
            this.player.play("walkDown", true)

            if (this.keyA.isUp && this.keyD.isUp) {
                this.player.setVelocityX(0)
            }
        }
        if (this.keyA.isDown) {
            this.player.setVelocityX(-this.cameraSpeed);

            if (this.keyW.isUp && this.keyS.isUp) {
                this.player.setVelocityY(0)
                this.player.play("walkLeft", true)
            }
        }
        if (this.keyD.isDown) {
            this.player.setVelocityX(this.cameraSpeed);

            if (this.keyW.isUp && this.keyS.isUp) {
                this.player.setVelocityY(0)
                this.player.play("walkRight", true)
            }
        }

        if (this.keyW.isUp && this.keyD.isUp && this.keyS.isUp && this.keyA.isUp) {
            this.setIdleAnim()

            this.player.setVelocity(0);
        }

        this.cameras.main.centerOn(this.player.x, this.player.y);
    }

    update() {

    }

    win() {

    }
}