#!/usr/bin/python
""" Single-player game - Nimmt6 with two players and open cards """

import game, player, card

# 10.000 round / 5 seconds with Firstplayer
ROUNDS = 10000

def play():
	""" Main function which defines set of games for comuter bots or single game vs human"""
	bots = [ player.Firstplayer(), player.Randomplayer(), player.Minsumplayer(), player.Minimizenegative() ]
	mainbot = player.Minimizenegative()
	valuation = card.get_standard_value_of_card
#	valuation = card.get_single_value_of_card
	human = True
	human = False

	if not human:
		for bot in bots:
			score = 0
			for round_number in range(ROUNDS):
				game_instance = game.Nimmtgame(seed = round_number, valuation = valuation)
				game_instance.add_player("bot: MAIN", mainbot)
				game_instance.add_player("bot: SIDE", bot)
				results = game_instance.start()
				if results[0] < results[1]:
					score += 1
				elif results[1] < results[0]:
					score -= 1
			print "%s : %s = %s" % (mainbot, bot, score)
	else:
		game_instance = game.Nimmtgame(verbose = True, valuation = valuation)
		game_instance.add_player("bot: MAIN", mainbot)
		game_instance.add_player("Human", player.Humanplayer())
		results = game_instance.start()

		print results
		if results[0] < results[1]:
			print "Player A"
		elif results[0] == results[1]:
			print "Draw"
		else:
			print "Player B"

if __name__ == "__main__":
	play()