/*global Phaser*/
class SplashScene extends Phaser.Scene {
    /**
     * This method is the constructor.
     */
    constructor() {
      super({ key: "splashScene" });
      this.splashSceneBackgroundImage = null;
      this.startTime = null;
    }
    init() {
      this.cameras.main.setBackgroundColor("#ffffff");
    }
  
    preload() {
      console.log("Splash Scene");
      this.load.image("splashSceneBackgroundImage", "./assets/splashSceneImage.png");
    }
    create() {
      this.splashSceneBackgroundImage = this.add.image(
        1920 / 2,
        1080 / 2,
        "splashSceneBackgroundImage"
      );
    }
  
    update(time) {
      if (!this.startTime) {
        this.startTime = time;
      }
      if (time - this.startTime > 3000) {
        this.scene.switch("titleScene");
        this.startTime = null; // Prevent repeated switching
      }
    }
  }
  
  export default SplashScene;