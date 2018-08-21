#!/usr/bin/python
""" This is a unit test for cards part of the game Nimmt 6 """

import unittest
import card

class TestDeck(unittest.TestCase):
	""" Unit tests for deck of cards """
	def test_create_deck(self):
		""" Create empty card decks """
		deck = card.Carddeck()
		self.assertEqual(0, deck.length())

	def test_add_card_to_deck(self):
		""" Add a new card into card deck """
		deck = card.Carddeck()
		c = card.Gamecard(1, 1)
		deck.append(c)
		self.assertEqual(1, deck.length())

	def test_pop_card_from_deck(self):
		""" Get first two cards from the deck """
		deck = card.Carddeck()
		deck.append(card.Gamecard(1, 5))
		deck.append(card.Gamecard(2, 10))
		c = deck.pop()
		self.assertEqual(1, c.number)
		c = deck.pop()
		self.assertEqual(2, c.number)

	def test_shuffle_deck(self):
		""" Shuffle card deck with a given seed, so it is testable """
		seed = 1

		deck = card.Carddeck()
		for number in range(1, 100):
			# value is added automatically by constructor
			deck.append(card.Gamecard(number))
		deck.shuffle(seed)
		self.assertEqual(13, deck.pop().number)

if __name__ == "__main__":
	unittest.main()
