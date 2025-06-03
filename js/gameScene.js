class GameScene extends Phaser.Scene {
  createAlien() {
    // Start aliens at y = 0 so they are visible and fall down the screen
    const alienXLocation = Math.floor(Math.random() * 1920) + 1 // avoid spawning at the very edge
    let alienXVelocity = Math.floor(Math.random() * 50) + 1
    alienXVelocity *= Math.round(Math.random()) ? 1 : -1 // make it negative or positive randomly
    const anAlien = this.physics.add.sprite(alienXLocation, -100, 'alien') // y = 0 so they are visible
    anAlien.body.velocity.y = 200 // fall speed
    anAlien.body.velocity.x = alienXVelocity // random horizontal speed
    this.alienGroup.add(anAlien)
  }

  constructor() {
    super({ key: 'gameScene' })

    this.background = null
    this.ship = null
    this.fireMissile = false
    this.missileGroup = null
    this.alienGroup = null
    this.cursors = null
    this.keySpaceObj = null
    this.score = 0
    this.scoreText = null
    this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }

    this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }
    this.gameOver = false
    this.gameOverText = null
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
    this.load.audio("bomb", "./assets/bomb.wav")
  }

  create() {
    this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
    this.background.setOrigin(0, 0)
    this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)
    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
    this.ship.setCollideWorldBounds(true)
    if (this.ship.body) {
      this.ship.body.allowGravity = false
    }
    this.missileGroup = this.physics.add.group()
    this.alienGroup = this.physics.add.group()
    // Ensure groups are initialized before creating aliens
    this.createAlien()

    this.physics.add.collider(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
      alienCollide.destroy()
      missileCollide.destroy()
      this.sound.play("explosion")
      this.score = this.score + 1
      this.scoreText.setText('Score: ' + this.score.toString())
      this.createAlien()
      this.createAlien()
    }.bind(this))

    // FIX: Use overlap for ship/alien collision and allow up/down movement
    this.physics.add.overlap(this.ship, this.alienGroup, function(shipCollide, alienCollide) {
      if (!this.gameOver) {
        this.sound.play('bomb')
        this.physics.pause()
        alienCollide.destroy()
        shipCollide.destroy()
        this.gameOver = true
        this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on('pointerdown', () => this.scene.start('gameScene'))
      }
    }.bind(this))
  
    // Set up keyboard cursors
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keySpaceObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  update() {
    if (this.gameOver) {
      return
    }
    // Left/right movement
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
    // Up/down movement
    if (this.cursors.up.isDown) {
      this.ship.y -= 15
      if (this.ship.y < 0) {
        this.ship.y = 0
      }
    }
    if (this.cursors.down.isDown) {
      this.ship.y += 15
      if (this.ship.y > 1080) {
        this.ship.y = 1080
      }
    }
    if (this.keySpaceObj.isDown) {
      if (!this.fireMissile) {
        this.fireMissile = true

        const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
        this.missileGroup.add(aNewMissile)
        aNewMissile.body.allowGravity = false
        aNewMissile.setVelocityY(-600)
        this.sound.play("laser")
      }
    }
    if (this.keySpaceObj.isUp) {
      this.fireMissile = false
    }
    // Destroy missiles that go off the top of the screen
    this.missileGroup.getChildren().forEach(function (item) {
      if (item.active && item.y < 0) {
        item.destroy()
      }
    }, this)

    // Update aliens and respawn if needed
    this.alienGroup.getChildren().forEach(function (alien) {
      if (alien.active && alien.body) {
        alien.body.velocity.y = 200
      }
      if (alien.active && alien.y > 1080) {
        alien.destroy()
        this.createAlien()
      }
    }, this)
  }
}

export default GameScene