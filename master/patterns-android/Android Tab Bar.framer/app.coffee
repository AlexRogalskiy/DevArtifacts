# Staging
screenB.x = 0
screenC.x = 0

# Change this to set start screen
screenA.bringToFront()

# Switching
inbox.onTap -> screenA.bringToFront()
favorites.onTap -> screenB.bringToFront()
chat.onTap -> screenC.bringToFront()