""" This module encapsulates all game cards informations and utilities """

import random

def get_standard_value_of_card(number):
	""" This function returns the number of 'cows'/negative points in standard game"""
	if number == 55:
		return 7
	elif number % 11 == 0:
		return 5
	elif number % 10 == 0:
		return 3
	elif number % 5 == 0:
		return 2
	else:
		return 1

def get_single_value_of_card(number):
	""" This functions returns 1 negative point for each card """
	del number

	return 1

class Gamecard:
	"Single game card"

	def __init__ (self, number, value = None, valuation = get_standard_value_of_card):
		self.number = number
		self.value = valuation(number) if not value else value

	def __str__(self):
		return "(%s/%spt)" % (self.number, self.value)

class Carddeck:
	"Deck of game cards"

	def __init__ (self):
		self._deck = []
		self._pointer = 0

	def length(self):
		""" Returns the number of cards in the deck """
		return len(self._deck)

	def append(self, card):
		""" Append card to the last position in the deck """
		self._deck.append(card)

	def pop(self):
		""" Returns a card from a top of the deck.
		"   Card won't be discarded and we can undo anytime
		"""
		self._pointer += 1
		return self._deck[self._pointer - 1]

	def shuffle(self, seed = random.random()):
		""" Shuffle all cards in package and start taking cards from the first card """
		random.seed(seed)
		random.shuffle(self._deck)
		self._pointer = 0

	def copy_deck(self):
		""" copy a deck of cards, so the original will be untouched """
		return list(self._deck)

	def __str__(self):
		return ",".join([str(x) for x in self._deck])

class Cardrow:
	"Row of cards on the table"

	def __init__ (self, max_cards_in_row):
		self._deck = []
		## maximal number of cards in the row before we want to remove them and start again
		## 5 is default for game Nimmt6 - 6th card will start new row
		self._limit = max_cards_in_row

	def length(self):
		""" Return number of cards in the row """
		return len(self._deck)

	def is_under_limit(self):
		""" Check if we can add a new card to the row without taking it"""
		return self.length() < self._limit

	def can_append_card(self, card):
		""" Check if card can be added to this row (it is bigger then current maximum) """
		return self.get_max_number() < card.number

	def get_max_number(self):
		""" Get maximal number in the row """
		return max([card.number for card in self._deck])

	def get_value(self):
		""" Get sum of values of all cards in the row """
		return sum([card.value for card in self._deck])

	def append(self, card):
		""" Add a new card to the row """
		self._deck.append(card)

	def empty(self):
		""" Clean the row from all cards """
		self._deck = []
	
	def __str__(self):
		return ",".join([str(card) for card in self._deck])


