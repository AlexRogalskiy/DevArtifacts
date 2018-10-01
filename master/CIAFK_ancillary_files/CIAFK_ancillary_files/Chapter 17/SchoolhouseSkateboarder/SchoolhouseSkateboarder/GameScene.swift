//
//  GameScene.swift
//  SchoolhouseSkateboarder
//
//  Created by MATTHEW MCCARTHY on 4/5/17.
//  Copyright © 2017 iOS Kids. All rights reserved.
//

import SpriteKit

/// This struct holds various physics categories, so we can define
/// which object types collide or have contact with each other
struct PhysicsCategory {
    static let skater: UInt32 = 0x1 << 0
    static let brick: UInt32 = 0x1 << 1
    static let gem: UInt32 = 0x1 << 2
}

class GameScene: SKScene, SKPhysicsContactDelegate {
    
    // Enum for y-position spawn points for bricks
    // Ground bricks are low and upper platform bricks are high
    enum BrickLevel: CGFloat {
        
        case low = 0.0
        case high = 100.0
    }
    
    
    // MARK:- Class Properties
    
    // An array that holds all the current sidewalk bricks
    var bricks = [SKSpriteNode]()
    
    // An array that holds all the current gems
    var gems = [SKSpriteNode]()
    
    // The size of the sidewalk brick graphics used
    var brickSize = CGSize.zero
    
    // The current brick level determines the y-position of new bricks
    var brickLevel = BrickLevel.low
    
    // Setting for how fast the game is scrolling to the right
    // This may increase as the user progresses in the game
    var scrollSpeed: CGFloat = 5.0
    let startingScrollSpeed: CGFloat = 5.0
    
    // A constant for gravity, or how fast objects will fall to earth
    let gravitySpeed: CGFloat = 1.5
    
    // Properties for score-tracking
    var score: Int = 0
    var highScore: Int = 0
    var lastScoreUpdateTime: TimeInterval = 0.0
    
    // The timestamp of the last update method call
    var lastUpdateTime: TimeInterval?
    
    // The hero of the game, the skater, is created here
    let skater = Skater(imageNamed: "skater")
    
    
    // MARK:- Setup and Lifecycle Methods
    
    override func didMove(to view: SKView) {
        
        physicsWorld.gravity = CGVector(dx: 0.0, dy: -6.0)
        physicsWorld.contactDelegate = self
        
        anchorPoint = CGPoint.zero
        
        let background = SKSpriteNode(imageNamed: "background")
        let xMid = frame.midX
        let yMid = frame.midY
        background.position = CGPoint(x: xMid, y: yMid)
        addChild(background)
        
        setupLabels()
        
        // Set up the skater and add her to the scene
        skater.setupPhysicsBody()
        addChild(skater)
        
        // Add a tap gesture recognizer to know when the user tapped the screen
        let tapMethod = #selector(GameScene.handleTap(tapGesture:))
        let tapGesture = UITapGestureRecognizer(target: self, action: tapMethod)
        view.addGestureRecognizer(tapGesture)
        
        startGame()
    }
    
    func resetSkater() {
        
        // Set the skater's starting position, zPosition, and minimumY
        let skaterX = frame.midX / 2.0
        let skaterY = skater.frame.height / 2.0 + 64.0
        skater.position = CGPoint(x: skaterX, y: skaterY)
        skater.zPosition = 10
        skater.minimumY = skaterY
        
        skater.zRotation = 0.0
        skater.physicsBody?.velocity = CGVector(dx: 0.0, dy: 0.0)
        skater.physicsBody?.angularVelocity = 0.0
    }
    
    func setupLabels() {
        
        // Label that says "score" in the upper left
        
        let scoreTextLabel: SKLabelNode = SKLabelNode(text: "score")
        scoreTextLabel.position = CGPoint(x: 14.0, y: frame.size.height - 20.0)
        scoreTextLabel.horizontalAlignmentMode = .left
        scoreTextLabel.fontName = "Courier-Bold"
        scoreTextLabel.fontSize = 14.0
        scoreTextLabel.zPosition = 20
        addChild(scoreTextLabel)
        
        // Label that shows the player's actual score
        
        let scoreLabel: SKLabelNode = SKLabelNode(text: "0")
        scoreLabel.position = CGPoint(x: 14.0, y: frame.size.height - 40.0)
        scoreLabel.horizontalAlignmentMode = .left
        scoreLabel.fontName = "Courier-Bold"
        scoreLabel.fontSize = 18.0
        scoreLabel.name = "scoreLabel"
        scoreLabel.zPosition = 20
        addChild(scoreLabel)
        
        // Label that says "high score" in the upper right
        
        let highScoreTextLabel: SKLabelNode = SKLabelNode(text: "high score")
        highScoreTextLabel.position = CGPoint(x: frame.size.width - 14.0, y: frame.size.height - 20.0)
        highScoreTextLabel.horizontalAlignmentMode = .right
        highScoreTextLabel.fontName = "Courier-Bold"
        highScoreTextLabel.fontSize = 14.0
        highScoreTextLabel.zPosition = 20
        addChild(highScoreTextLabel)
        
        // Label that shows the player's actual highest score
        
        let highScoreLabel: SKLabelNode = SKLabelNode(text: "0")
        highScoreLabel.position = CGPoint(x: frame.size.width - 14.0, y: frame.size.height - 40.0)
        highScoreLabel.horizontalAlignmentMode = .right
        highScoreLabel.fontName = "Courier-Bold"
        highScoreLabel.fontSize = 18.0
        highScoreLabel.name = "highScoreLabel"
        highScoreLabel.zPosition = 20
        addChild(highScoreLabel)
    }
    
    func updateScoreLabelText() {
        
        if let scoreLabel = childNode(withName: "scoreLabel") as? SKLabelNode {
            scoreLabel.text = String(format: "%04d", score)
        }
    }
    
    func updateHighScoreLabelText() {
        
        if let highScoreLabel = childNode(withName: "highScoreLabel") as? SKLabelNode {
            highScoreLabel.text = String(format: "%04d", highScore)
        }
    }
    
    func startGame() {
        
        // When a new game is started, reset to starting conditions
        
        resetSkater()
        
        score = 0
        
        scrollSpeed = startingScrollSpeed
        brickLevel = .low
        lastUpdateTime = nil
        
        for brick in bricks {
            brick.removeFromParent()
        }
        
        bricks.removeAll(keepingCapacity: true)
        
        for gem in gems {
            removeGem(gem)
        }
    }
    
    func gameOver() {
        
        // When the game ends, see if the player got a new high score
        
        if score > highScore {
            highScore = score
            
            updateHighScoreLabelText()
        }
        
        startGame()
    }
    
    
    // MARK:- Spawn and Remove Methods
    
    func spawnBrick(atPosition position: CGPoint) -> SKSpriteNode {
        
        // Create a brick sprite and add it to the scene
        let brick = SKSpriteNode(imageNamed: "sidewalk")
        brick.position = position
        brick.zPosition = 8
        addChild(brick)
        
        // Update our brickSize with the real brick size
        brickSize = brick.size
        
        // Add the new brick to the array of bricks
        bricks.append(brick)
        
        // Set up the brick's physics body
        let center = brick.centerRect.origin
        brick.physicsBody = SKPhysicsBody(rectangleOf: brick.size, center: center)
        brick.physicsBody?.affectedByGravity = false
        
        brick.physicsBody?.categoryBitMask = PhysicsCategory.brick
        brick.physicsBody?.collisionBitMask = 0
        
        // Return this new brick to the caller
        return brick
    }
    
    func spawnGem(atPosition position: CGPoint) {
        
        // Create a gem sprite and add it to the scene
        let gem = SKSpriteNode(imageNamed: "gem")
        gem.position = position
        gem.zPosition = 9
        addChild(gem)
        
        gem.physicsBody = SKPhysicsBody(rectangleOf: gem.size, center: gem.centerRect.origin)
        gem.physicsBody?.categoryBitMask = PhysicsCategory.gem
        gem.physicsBody?.affectedByGravity = false
        
        // Add the new gem to the array of gems
        gems.append(gem)
    }
    
    func removeGem(_ gem: SKSpriteNode) {
        
        gem.removeFromParent()
        
        if let gemIndex = gems.index(of: gem) {
            gems.remove(at: gemIndex)
        }
    }
    
    
    // MARK:- Update Methods
    
    func updateBricks(withScrollAmount currentScrollAmount: CGFloat) {
        
        // Keep track of the greatest x-position of all the current bricks
        var farthestRightBrickX: CGFloat = 0.0
        
        for brick in bricks {
            
            let newX = brick.position.x - currentScrollAmount
            
            // If a brick has moved too far left (off the screen), remove it
            if newX < -brickSize.width {
                
                brick.removeFromParent()
                
                if let brickIndex = bricks.index(of: brick) {
                    bricks.remove(at: brickIndex)
                }
                
            } else {
                
                // For a brick that is still onscreen, update its position
                brick.position = CGPoint(x: newX, y: brick.position.y)
                
                // Update our farthest-right position tracker
                if brick.position.x > farthestRightBrickX {
                    farthestRightBrickX = brick.position.x
                }
            }
        }
        
        // A while loop to ensure our screen is always full of bricks
        while farthestRightBrickX < frame.width {
            
            var brickX = farthestRightBrickX + brickSize.width + 1.0
            let brickY = (brickSize.height / 2.0) + brickLevel.rawValue
            
            // Every now and then, leave a gap the player must jump over
            let randomNumber = arc4random_uniform(99)
            
            if randomNumber < 2 && score > 10 {
                
                // There is a 2 percent chance that we will leave a gap between
                // bricks after the player has reached a score of 10
                let gap = 20.0 * scrollSpeed
                brickX += gap
                
                // At each gap, add a gem
                let randomGemYAmount = CGFloat(arc4random_uniform(150))
                let newGemY = brickY + skater.size.height + randomGemYAmount
                let newGemX = brickX - gap / 2.0
                
                spawnGem(atPosition: CGPoint(x: newGemX, y: newGemY))
            }
            else if randomNumber < 4 && score > 20 {
                
                // There is a 2 percent chance that the brick Y level will change
                // after the player has reached a score of 20
                if brickLevel == .high {
                    brickLevel = .low
                }
                else if brickLevel == .low {
                    brickLevel = .high
                }
            }
            
            // Spawn a new brick and update the rightmost brick
            let newBrick = spawnBrick(atPosition: CGPoint(x: brickX, y: brickY))
            farthestRightBrickX = newBrick.position.x
        }
    }
    
    func updateGems(withScrollAmount currentScrollAmount: CGFloat) {
        
        for gem in gems {
            
            // Update each gem's position
            let thisGemX = gem.position.x - currentScrollAmount
            gem.position = CGPoint(x: thisGemX, y: gem.position.y)

            // Remove any gems that have moved offscreen
            if gem.position.x < 0.0 {
                
                removeGem(gem)
            }
        }
    }
    
    func updateSkater() {
        
        // Determine if the skater is currently on the ground
        if let velocityY = skater.physicsBody?.velocity.dy {
            
            if velocityY < -100.0 || velocityY > 100.0 {
                skater.isOnGround = false
            }
        }
        
        // Check if the game should end
        let isOffScreen = skater.position.y < 0.0 || skater.position.x < 0.0
        
        let maxRotation = CGFloat(GLKMathDegreesToRadians(85.0))
        let isTippedOver = skater.zRotation > maxRotation || skater.zRotation < -maxRotation
        
        if isOffScreen || isTippedOver {
            gameOver()
        }
    }
    
    func updateScore(withCurrentTime currentTime: TimeInterval) {
        
        // The player's score increases the longer they survive
        // Only update score every 1 second
        
        let elapsedTime = currentTime - lastScoreUpdateTime
        
        if elapsedTime > 1.0 {
            
            // Increase the score
            score += Int(scrollSpeed)
            
            // Reset the lastScoreUpdateTime to the current time
            lastScoreUpdateTime = currentTime
            
            updateScoreLabelText()
        }
    }
    
    
    // MARK:- Main Game Loop Method
    
    override func update(_ currentTime: TimeInterval) {
        
        // Slowly increase the scrollSpeed as the game progresses
        scrollSpeed += 0.01
        
        // Determine the elapsed time since the last update call
        var elapsedTime: TimeInterval = 0.0
        
        if let lastTimeStamp = lastUpdateTime {
            elapsedTime = currentTime - lastTimeStamp
        }
        
        lastUpdateTime = currentTime
        
        let expectedElapsedTime: TimeInterval = 1.0 / 60.0
        
        // Here we calculate how far everything should move in this update
        let scrollAdjustment = CGFloat(elapsedTime / expectedElapsedTime)
        let currentScrollAmount = scrollSpeed * scrollAdjustment
        
        updateBricks(withScrollAmount: currentScrollAmount)
        updateSkater()
        updateGems(withScrollAmount: currentScrollAmount)
        updateScore(withCurrentTime: currentTime)
    }
    
    
    // MARK:- Touch Handling Methods
    
    func handleTap(tapGesture: UITapGestureRecognizer) {
        
        // Make the skater jump if player taps while she is on the ground
        if skater.isOnGround {
            
            skater.physicsBody?.applyImpulse(CGVector(dx: 0.0, dy: 260.0))
        }
    }
    
    
    // MARK:- SKPhysicsContactDelegate Methods
    
    func didBegin(_ contact: SKPhysicsContact) {
        
        // Check if the contact is between the skater and a brick
        if contact.bodyA.categoryBitMask == PhysicsCategory.skater && contact.bodyB.categoryBitMask == PhysicsCategory.brick {
            
            skater.isOnGround = true
        }
        else if contact.bodyA.categoryBitMask == PhysicsCategory.skater && contact.bodyB.categoryBitMask == PhysicsCategory.gem {
            
            // Skater touched a gem, so remove it
            if let gem = contact.bodyB.node as? SKSpriteNode {
                
                removeGem(gem)
                
                // Give the player 50 points for getting a gem
                score += 50
                updateScoreLabelText()
            }
        }
    }
}
