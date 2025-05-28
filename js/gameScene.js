class GameScene extends Phaser.Scene {
    /**
     * This method is the constructor.
     */
    constructor() {
      super({ key: "gameScene" })
    }
    init(data) {
      this.cameras.main.setBackgroundColor("#ffffff")
    }
    preload() {
      console.log("Game Scene")
    }
    create(data) {
    
    }
    update(time, delta) {
      
    }
  }
  
  export default GameScene