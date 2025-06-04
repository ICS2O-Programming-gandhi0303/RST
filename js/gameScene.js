class GameScene extends Phaser.Scene {
  // ...existing code...

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

    // Add shooting speed variables
    this.shootCooldown = 300 // milliseconds between shots (default)
    this.lastShotTime = 0
    this.boosted = false // track if boost is active
  }

  // ...existing code...

  create() {
    // Reset score and boost when the scene starts
    this.score = 0
    this.boosted = false
    this.shootCooldown = 300

    this.background = this.add.image(0, 0, 'starBackground').setOrigin(0, 0).setScale(2.0).setDepth(-1)
    this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)
    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
    this.ship.setCollideWorldBounds(true)
    if (this.ship.body) {
      this.ship.body.allowGravity = false
    }
    this.missileGroup = this.physics.add.group()
    this.alienGroup = this.physics.add.group()
    this.createAlien()

    this.physics.add.collider(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
      alienCollide.destroy()
      missileCollide.destroy()
      this.sound.play("explosion")
      this.score = this.score + 1
      this.scoreText.setText('Score: ' + this.score.toString())
      // BOOST: Check for boost at score 40
      if (this.score >= 40 && !this.boosted) {
        this.shootCooldown = Math.floor(this.shootCooldown * 0.6) // Increase speed by 40%
        this.boosted = true
        // Optional: Show a boost message
        this.add.text(this.ship.x, this.ship.y - 100, 'BOOST!', { font: '48px Arial', fill: '#00ff00', align: 'center' })
          .setOrigin(0.5)
          .setDepth(10)
          .setAlpha(1)
          .setScrollFactor(0)
          .setInteractive()
          .setVisible(true)
        // You can add a timer to remove the boost message if you want
      }
      this.createAlien()
      this.createAlien()
    }.bind(this))

    this.physics.add.overlap(this.ship, this.alienGroup, function(shipCollide, alienCollide) {
      if (!this.gameOver) {
        this.sound.play('bomb')
        this.physics.pause()
        alienCollide.destroy()
        shipCollide.destroy()
        this.gameOver = true
        this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on('pointerdown', () => {
          this.gameOver = false
          this.scene.restart()
        })
      }
    }.bind(this))
  
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keySpaceObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.lastShotTime = 0
  }

  update(time, delta) {
    if (this.gameOver) {
      return
    }
    // ...movement code...

    // Shooting with cooldown
    if (this.keySpaceObj.isDown) {
      if (!this.fireMissile && (this.time.now - this.lastShotTime > this.shootCooldown)) {
        this.fireMissile = true
        this.lastShotTime = this.time.now

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

    // ...rest of update code...
    this.missileGroup.getChildren().forEach(function (item) {
      if (item.active && item.y < 0) {
        item.destroy()
      }
    }, this)

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