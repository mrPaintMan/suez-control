class SceneStart extends Phaser.Scene {
    constructor() {
        super({ key: "SceneStart" });

    }
    
    preload() {
        this.load.image("sprPanel", "content/panel.png");
        this.load.image("sprStart", "content/play.png");

        this.load.image("sprBoat", "content/Lyxbat.png");
        this.load.image("sprBigBoat", "content/bigboat.png");
    }
    
    create() { 

        this.tick = 0;
        this.boats = this.physics.add.group({
            velocityY: 100,
            angle: 180
        });

        // Background
        let graphics = this.add.graphics({ fillStyle: { color: 0x06a4d6 }, strokeStyle: { color: 0xffffff} });

        let ocean = new Phaser.Geom.Rectangle();
        ocean.width = config.width;
        ocean.height = config.height;

        graphics.fillRectShape(ocean);
        
        // UI
        let panel = this.add.sprite(config.width/2, config.height/2, "sprPanel");
        panel.setScale(2);
        panel.setDepth(1)

        let title = this.add.text(config.width / 2, config.height / 2 - 75, 'Suez Control', { fontSize: '48px', fill: '#000' });
        title.setOrigin(0.5);
        title.setDepth(2)

        let desc = "Drag the boats into the canal \nwithout letting them collide!"
        let description = this.add.text(config.width / 2, config.height / 2, desc, { fontSize: '24px', fill: '#000' });
        description.setOrigin(0.5);
        description.setDepth(2)

        let button = this.add.sprite(config.width/2, config.height/2 + 75, "sprStart").setInteractive();
        button.setScale(2);
        button.on("pointerdown", () => { this.scene.start("SceneMain") });
        button.setDepth(2)

        let boat1 = this.add.sprite(config.width/2 - 250, config.height/2 + 65, "sprBoat");
        boat1.angle = -45;
        boat1.setDepth(2)

        let boat2 = this.add.sprite(config.width/2 + 250, config.height/2 + 65, "sprBigBoat");
        boat2.angle = 45;
        boat2.setScale(0.8);
        boat2.setDepth(2)
    }

    update() {

        // Spawn boats
        if (this.tick >= 30) {
            this.tick = 0;

            let key = Math.random() > 0.7 ? "sprBoat" : "sprBigBoat";
            let boat = this.add.sprite(Phaser.Math.Between(0, 1040), -20, key);
            boat.angle = 180;
            boat.setDepth(0)
            this.boats.add(boat);
        }
        else {
            this.tick++;
        }

        this.boats.getChildren().forEach(boat => {
            if (boat.y > 750) {
                boat.destroy();
            }
        });
        
    }
}