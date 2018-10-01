//
//  GameScene.swift
//  SchoolhouseSkateboarder
//
//  Created by MATTHEW MCCARTHY on 4/5/17.
//  Copyright © 2017 iOS Kids. All rights reserved.
//

import SpriteKit

class GameScene: SKScene {
    
    // An array that holds all the current sidewalk bricks
    var bricks = [SKSpriteNode]()
    
    // The size of the sidewalk brick graphics used
    var brickSize = CGSize.zero
    
    // Setting for how fast the game is scrolling to the right
    // This may increase as the user progresses in the game
    var scrollSpeed: CGFloat = 5.0
    
    // A constant for gravity, or how fast objects will fall to earth
    let gravitySpeed: CGFloat = 1.5
    
    // The timestamp of the last update method call
    var lastUpdateTime: TimeInterval?
    
    // The hero of the game, the skater, is created here
    let skater = Skater(imageNamed: "skater")
    
    override func didMove(to view: SKView) {
        
        anchorPoint = CGPoint.zero
        
        let background = SKSpriteNode(imageNamed: "background")
        let xMid = frame.midX
        let yMid = frame.midY
        background.position = CGPoint(x: xMid, y: yMid)
        addChild(background)
        
        // Set up the skater and add her to the scene
        resetSkater()
        addChild(skater)
        
        // Add a tap gesture recognizer to know when the user tapped the screen
        let tapMethod = #selector(GameScene.handleTap(tapGesture:))
        let tapGesture = UITapGestureRecognizer(target: self, action: tapMethod)
        view.addGestureRecognizer(tapGesture)
    }
    
    func resetSkater() {
        
        // Set the skater's starting position, zPosition, and minimumY
        let skaterX = frame.midX / 2.0
        let skaterY = skater.frame.height / 2.0 + 64.0
        skater.position = CGPoint(x: skaterX, y: skaterY)
        skater.zPosition = 10
        skater.minimumY = skaterY
    }
    
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
        
        // Return this new brick to the caller
        return brick
    }
    
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
            let brickY = brickSize.height / 2.0
            
            // Every now and then, leave a gap the player must jump over
            let randomNumber = arc4random_uniform(99)
            
            if randomNumber < 5 {
                
                // There is a 5 percent chance that we will
                // leave a gap between bricks
                let gap = 20.0 * scrollSpeed
                brickX += gap
            }
            
            // Spawn a new brick and update the rightmost brick
            let newBrick = spawnBrick(atPosition: CGPoint(x: brickX, y: brickY))
            farthestRightBrickX = newBrick.position.x
        }
    }
    
    func updateSkater() {
        
        if !skater.isOnGround {
            
            // Set the skater's new velocity as it is affected by "gravity"
            let velocityY = skater.velocity.y - gravitySpeed
            skater.velocity = CGPoint(x: skater.velocity.x, y: velocityY)
            
            // Set the skater's new y-position based on her velocity
            let newSkaterY: CGFloat = skater.position.y + skater.velocity.y
            skater.position = CGPoint(x: skater.position.x, y: newSkaterY)
            
            // Check if the skater has landed
            if skater.position.y < skater.minimumY {
                
                skater.position.y = skater.minimumY
                skater.velocity = CGPoint.zero
                skater.isOnGround = true
            }
        }
    }
    
    override func update(_ currentTime: TimeInterval) {
        
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
    }
    
    func handleTap(tapGesture: UITapGestureRecognizer) {
        
        // Make the skater jump if player taps while the skater is on the ground
        if skater.isOnGround {
            
            // Set the skater's y-velocity to the skater's initial jump speed
            skater.velocity = CGPoint(x: 0.0, y: skater.jumpSpeed)
            
            // Keep track of the fact that the skater is no longer on the ground
            skater.isOnGround = false
        }
    }
}
