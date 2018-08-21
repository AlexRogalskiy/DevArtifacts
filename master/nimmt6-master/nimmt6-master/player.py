""" This class represents a player in the game (bot or human) """

import sys, random
import game

class Player:
	""" Player in the game """

	def __init__(self):
		return
        
	# @todo: these are abstract methods -> ABC classes?
	# def selectCard()
	# def selectRow()

class Firstplayer (Player):
	""" This is a very naive bot player which always select first option """
	@classmethod
	def select_card(cls, my_cards, rows):
		""" Select a first card from the hand """
		del rows

		return my_cards[0].number

	@classmethod
	def select_row(cls, card_to_put, my_cards, rows):
		""" Select first row where to put card when there are more possible turns """
		del card_to_put, my_cards, rows

		return 1

class Randomplayer(Firstplayer):
	""" This player choose a row randomly, rest is the same """
	@classmethod
	def select_row(cls, card_to_put, my_cards, rows):
		""" Select a random row """
		del card_to_put, my_cards

		return random.randrange(len(rows))

class Minsumplayer(Randomplayer):
	""" This player choose a row with minimal sum """
	@classmethod
	def select_row(cls, card_to_put, my_cards, rows):
		""" Select a row with minimal sum of card's values """
		del card_to_put, my_cards

		row_sums = [ r.get_value() for r in rows ]

		return row_sums.index(min(row_sums)) + 1

class Minimizenegative(Minsumplayer):
	""" Extension of Minsum player which tries to select a correct number
	"	which should not take any row - we will completely ignore
	" 	oponent's planned action
	"""
	@classmethod
	def select_card(cls, my_cards, rows):
		""" Select a card from the hand if several of them are same then choose the first one
		"	- in fact it is a random card
		"""
		for pcard in my_cards:
			prow = game.Nimmtgame.get_row_number_for_card(pcard, rows)
			if ((prow != None) and (rows[prow].is_under_limit())):
				return pcard.number

		return my_cards[0].number

class Humanplayer (Player):
	""" This is simple human player which operates through text inteface """
	@classmethod
	def select_card(cls, my_cards, rows):
		""" Select a card from the hand """
		del rows, my_cards

		print "Enter the number of card which you want to place in this round"
		return int(sys.stdin.readline())		

	@classmethod
	def select_row(cls, card_to_put, my_cards, rows):
		""" Select a row where to put card when there are more possible turns """
		del rows, my_cards

		print "Enter row where %s should be put" % card_to_put
		return int(sys.stdin.readline())
