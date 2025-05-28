class SplashScene extends Phaser.Scene {
    /**
     * This method is the constructor.
     */
    constructor() {
      super({ key: "splashScene" });
      this.splashSceneBackgroundImage = null;
    }
  
    /**
     * Can be defined on your own Scenes.
     * This method is called by the Scene Manager when the scene starts,
     * before preload() and create().
     * @param {object} data - Any data passed via ScenePlugin.add() or ScenePlugin.start().
     */
    init(data) {
      this.cameras.main.setBackgroundColor("#ffffff");
    }
  
    /**
     * Can be defined on your own Scenes.
     * Use it to load assets.
     */
    preload() {
      console.log("Splash Scene");
      this.load.image("splashSceneBackgroundImage", "./assets/splashSceneImage.png");
    }
  
    /**
     * Can be defined on your own Scenes.
     * Use it to create your game objects.
     * @param {object} data - Any data passed via ScenePlugin.add() or ScenePlugin.start().
     */
    create(data) {
      this.splashSceneBackgroundImage = this.add.sprite(
        0,
        0,
        "splashSceneBackgroundImage"
      );
      this.splashSceneBackgroundImage.x = 1920 / 2;
      this.splashSceneBackgroundImage.y = 1080 / 2;
    }
  
    update(time, delta) {
      if (time > 3000) {
        this.scene.switch("titleScene");
      }
    }
  }
  
  export default SplashScene;