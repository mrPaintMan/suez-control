class SceneStart extends Phaser.Scene {
    constructor() {
        super({ key: "SceneStart" });

    }
    
    preload() {
    }
    
    create() { 
        this.scene.start("SceneMain");
    }
}