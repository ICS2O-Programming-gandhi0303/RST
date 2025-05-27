import SplashScene from "./splashScene.js"
import TitleScene from "./titleScene.js"

const splashScene = new SplashScene()
const titleScene = new TitleScene()

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    backgroundColor: 0x5f6e7a,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}

const game = new Phaser.Game(config)


//* Game scenes */
game.scene.add("splashScene", splashScene)
game.scene.add("titleScene", titleScene)
//* game title */
game.scene.start("splashScene")


