class SceneStart extends Phaser.Scene {
    constructor() {
        super({ key: "SceneStart" });

    }
    
    preload() {
        this.load.image("sprPanel", "content/panel.png");
        this.load.image("sprStart", "content/play.png");
    }
    
    create() { 

        // Background
        let graphics = this.add.graphics({ fillStyle: { color: 0x06a4d6 }, strokeStyle: { color: 0xffffff} });

        let ocean = new Phaser.Geom.Rectangle();
        ocean.width = config.width;
        ocean.height = config.height;

        graphics.fillRectShape(ocean);
        
        // UI
        let panel = this.add.sprite(config.width/2, config.height/2, "sprPanel");
        panel.setScale(2);

        let text = this.add.text(config.width / 2, config.height / 2 - 25, 'Suez Control', { fontSize: '48px', fill: '#000' });
        text.setOrigin(0.5);

        let button = this.add.sprite(config.width/2, config.height/2 + 75, "sprStart").setInteractive();
        button.setScale(2);
        button.on("pointerdown", () => { this.scene.start("SceneMain") });



        //this.scene.start("SceneMain");
    }
}