class GameScene extends Phaser.Scene {
  createAlien() {
    const alienXLocation = Math.floor(Math.random() * 1920) + 1
    let alienXVelocity = Math.floor(Math.random() * 50) + 1
    alienXVelocity *= Math.round(Math.random()) ? -1 : 1 
    const anAlien = this.physics.add.sprite(alienXLocation, -100, 'alien')
    anAlien.body.velocity.y = 200
    anAlien.body.velocity.x = alienXVelocity
    anAlien.body.immovable = true // Prevent aliens from being pushed by missiles
    this.alienGroup.add(anAlien)
  }

  constructor() {
    super({ key: 'gameScene', active: true, physics: { default: 'arcade', arcade: { debug: false } } })

    this.background = null
    this.ship = null
    this.fireMissile = false
    this.missileGroup = null
    this.alienGroup = null
    this.cursors = null
    this.keySpaceObj = null
  }

  init() {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload() {
    console.log('Game Scene')
    this.load.image("starBackground", "./assets/starBackground.png")
    this.load.image("ship", "./assets/spaceShip.png")
    this.load.image("missile", "./assets/missile.png")
    this.load.image("alien", "./assets/alien.png")
    // Load the sound effect for the laser
    this.load.audio("laser", "./assets/laser1.wav")
    this.load.audio("explosion", "./assets/barrelExploding.wav")
  }

  create() {
    this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
    this.background.setOrigin(0, 0)
    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
    this.missileGroup = this.physics.add.group()
    this.alienGroup = this.physics.add.group()
    this.createAlien()
 
    this.physics.add.collider(this.missileGroup, this.alienGroup, function (_, alienCollide) {
      alienCollide.destroy()
      this.sound.play("explosion")
      this.createAlien()
      this.createAlien()
    }.bind(this))

    // Set up keyboard cursors
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keySpaceObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

  }

  update() {
    if (this.cursors.left.isDown) {
      this.ship.x -= 15
      if (this.ship.x < 0) {
        this.ship.x = 0
      }
    }
    if (this.cursors.right.isDown) {
      this.ship.x += 15
      if (this.ship.x > 1920) {
        this.ship.x = 1920
      }
    }
    if (this.keySpaceObj.isDown) {
      if (!this.fireMissile) {
        this.fireMissile = true
      
        const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
        this.missileGroup.add(aNewMissile)
        aNewMissile.body.allowGravity = false
        aNewMissile.body.velocity.y = -600
        this.sound.play("laser")
      }
    }
    if (this.keySpaceObj.isUp) {
      this.fireMissile = false
    }
    // Destroy missiles that go off the top of the screen
    this.missileGroup.getChildren().forEach(function(item) {
      if (item.active && item.y < 0) {
        item.destroy()
      }
    });
  }
}
export default GameScene;