class GameScene extends Phaser.Scene {
  createAlien() {
    // Start aliens at y = 0 so they are visible and fall down the screen
    const alienXLocation = Math.floor(Math.random() * 1920)+ 1 // avoid spawning at the very edge
    let alienXVelocity = Math.floor(Math.random() * 50) + 1
    alienXVelocity *= Math.round(Math.random()) ? 1 : -1// make it negative or positive randomly
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
    this.scoreText = this.add.text(10, 10, 'Score: '+ this.score.toString(), this.scoreTextStyle)
    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
    this.ship.body.allowGravity = false
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
        aNewMissile.setVelocityY(-600)
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

    // Ensure aliens keep falling down
    this.alienGroup.getChildren().forEach(function(alien) {
      if (alien.active) {
        alien.body.velocity.y = 200;
      }
      if (alien.active && alien.y > 1080) {
        alien.destroy();
        this.createAlien();
      }
    }, this);
  }
}
export default GameScene;