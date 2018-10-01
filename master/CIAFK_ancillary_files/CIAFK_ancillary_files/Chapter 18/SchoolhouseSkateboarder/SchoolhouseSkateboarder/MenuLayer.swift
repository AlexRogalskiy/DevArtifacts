//
//  MenuLayer.swift
//  SchoolhouseSkateboarder
//
//  Created by MATTHEW MCCARTHY on 4/9/17.
//  Copyright © 2017 iOS Kids. All rights reserved.
//

import SpriteKit

class MenuLayer: SKSpriteNode {
    
    // Tells the MenuLayer to display a message and to
    // optionally display a score
    func display(message: String, score: Int?) {
        
        // Create a message label using the passed-in message
        let messageLabel: SKLabelNode = SKLabelNode(text: message)
        
        // Set the label's starting position to the left of the menu layer
        let messageX = -frame.width
        let messageY = frame.height / 2.0
        messageLabel.position = CGPoint(x: messageX, y: messageY)
        
        messageLabel.horizontalAlignmentMode = .center
        messageLabel.fontName = "Courier-Bold"
        messageLabel.fontSize = 48.0
        messageLabel.zPosition = 20
        self.addChild(messageLabel)
        
        // Animate the message label to the center of the screen
        let finalX = frame.width / 2.0
        let messageAction = SKAction.moveTo(x: finalX, duration: 0.3)
        messageLabel.run(messageAction)
        
        // If a score was passed in to the method, display it
        if let scoreToDisplay = score {
            
            // Create the score text from the score Int
            let scoreString = String(format: "Score: %04d", scoreToDisplay)
            let scoreLabel: SKLabelNode = SKLabelNode(text: scoreString)
            
            // Set the label's starting position to the right
            // of the menu layer
            let scoreLabelX = frame.width
            let scoreLabelY = messageLabel.position.y - messageLabel.frame.height
            scoreLabel.position = CGPoint(x: scoreLabelX, y: scoreLabelY)
            
            scoreLabel.horizontalAlignmentMode = .center
            scoreLabel.fontName = "Courier-Bold"
            scoreLabel.fontSize = 32.0
            scoreLabel.zPosition = 20
            addChild(scoreLabel)
            
            // Animate the score label to the center of the screen
            let scoreAction = SKAction.moveTo(x: finalX, duration: 0.3)
            scoreLabel.run(scoreAction)
        }
    }
}
