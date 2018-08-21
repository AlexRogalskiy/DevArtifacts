#!/usr/bin/python

""" This is a unit test for game manager of the game Nimmt 6"""

import unittest
import game, player

class TestNimmtGame(unittest.TestCase):
	""" Unit tests for game Nimmt 6 """

	def test_enough_cards(self):
		""" Test if game is not refused when there are enough cards for game """
		game.Nimmtgame()

	def test_not_enough_cards(self):
		""" Test if game is refused when there are not enough cards for game """
		with self.assertRaises(Exception) as _:
			game.Nimmtgame(cards_per_player = 100)

	def test_add_player(self):
		""" Add a player to the game """
		game1 = game.Nimmtgame(players = 1, rows = 2)
		game1.add_player("Human", player.Humanplayer())

	def test_start_game_without_player(self):
		""" Start a game without any player """
		with self.assertRaises(Exception) as _:
			g = game.Nimmtgame()
			g.start()

	def test_start_game_not_scoring(self):
		""" Start a new game where nobody should score"""
		game1 = game.Nimmtgame(players = 1, rows = 2, cards_per_player = 2, seed = 1)
		game1.add_player("bot: First", player.Firstplayer())
		results = game1.start()
		self.assertEquals(0, results[0])

	def test_start_game_with_6card(self):
		""" Start a new game """
		game1 = game.Nimmtgame(players = 1, rows = 2, cards_per_player = 10, seed = 1)
		game1.add_player("bot: First", player.Firstplayer())
		results = game1.start()
		self.assertEquals(5, results[0])

	def test_start_game_3players(self):
		""" Start a new game with 3 players """
		game1 = game.Nimmtgame(players = 3, rows = 2, cards_per_player = 2, seed = 1)
		game1.add_player("bot: First", player.Firstplayer())
		game1.add_player("bot: Second", player.Firstplayer())
		game1.add_player("bot: Third", player.Firstplayer())
		results = game1.start()
		self.assertEquals(0, results[0])

if __name__ == "__main__":
	unittest.main()
