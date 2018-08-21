""" This class is a represenation of game manager and game logic """

import card as cardmod
import random

class Nimmtgame:
	"Game of Nimmt 6 - game manager and logic"

	MAX_CARDS_IN_ROW = 5
	RULES_BROKEN_PENALIZATION = 100

	# @todo: probably change for (gameinfo, seed)
	def __init__ (self, open_cards = True, players = 2, cards_per_player = 10, rows = 2, maximal_card = 104, seed = None, verbose = False, valuation = cardmod.get_standard_value_of_card):
		self._open_cards = open_cards
		self._players_count = players
		self._players_cards = []
		self._players_info = []
		self._rows_count = rows
		self._rows = []
		self._verbose = verbose

		## Check if it there are enough cards for game
		if (maximal_card < rows + cards_per_player * players):
			raise Exception("There are not enough cards in the game for this game")

		## Create a game deck and shuffle it
		self._deck = cardmod.Carddeck()
		for number in range(1, maximal_card + 1):
			self._deck.append(cardmod.Gamecard(number, valuation = valuation))
		self._deck.shuffle(seed)

		## Distribute cards to rows (1 card for each row)
		for _ in range(self._rows_count):
			self._rows.append(cardmod.Cardrow(self.MAX_CARDS_IN_ROW))
			self._rows[-1].append(self._deck.pop())

		## Distribute cards to players
		for _ in range(self._players_count):
			cards = []
			for _ in range(cards_per_player):
				cards.append(self._deck.pop())
			self._players_cards.append(cards)

	def get_all_cards(self):
		""" Returns all cards in the deck
			We have to shuffle the order of the cards because otherwise the information
			about cards on the player hands will be exposed. Of course, this is problem
			only when game is played without open cards.
		"""
		randomized = list(self._deck.copy_deck())
		random.shuffle(randomized)
		return randomized

	def add_player(self, player_name, player):
		""" Add a player to the game """
		self._players_info.append({ "name" : player_name, "class" : player, "score" : 0})

	def start(self):
		""" Start the new instance of game """

		if len(self._players_info) == 0:
			raise Exception("At least one player have to part of the game")

		players_score = []
		for _ in range(len(self._players_info)):
			players_score.append(0)

		# Game has as many rounds as there are cards on first player's hand
		for _ in range(len(self._players_cards[0])):
			# The order of the players is not important at this stage
			turns = []

			self.show_rows()
			for idx in range(len(self._players_info)):
				self.show_hand(self._players_cards[idx])
				# @todo: sent all available information to player e.g in open game
				# @todo: store cards that were used and sent it to players
				# @todo: sent only copies to robots
				card_number = self._players_info[idx]["class"].select_card( \
					self._players_cards[idx], \
					self._rows
				)

				## check if player has this card or not
				try:
					selected_card = [ c for c in self._players_cards[idx] if card_number == c.number ][0]
				except IndexError:
					## Rules where broken, penalization is big and game ends
					players_score[idx] += self.RULES_BROKEN_PENALIZATION
					return players_score

				turns.append({"player" : idx, "card" : selected_card})

			# put cards in correct order (lower numbers are firsts)
			turns.sort(lambda x, y: cmp(x["card"].number, y["card"].number))
			if self._verbose:
				print "Selected cards: %s " % [str(t["card"]) for t in turns]

			for turn in turns:
				card_to_put = [ c for c in self._players_cards[turn["player"]] if turn["card"].number == c.number ][0]
				row_number = Nimmtgame.get_row_number_for_card(card_to_put, self._rows)

				if row_number == None:
					# card can not be put - ask for a row selection (substract 1 because user see it as 1,2,...)
					row_number = self._players_info[turn["player"]]["class"].select_row( \
						card_to_put, \
						self._players_cards[turn["player"]], \
						self._rows
					) - 1
					
					if not row_number in range(len(self._rows)):
						players_score[turn["player"]] += self.RULES_BROKEN_PENALIZATION
						return players_score

					players_score[turn["player"]] += self._rows[row_number].get_value()
					self._rows[row_number].empty()
				else:
					if not self._rows[row_number].is_under_limit():
						# it is 6th card in a row -> count score
						players_score[turn["player"]] += self._rows[row_number].get_value()
						self._rows[row_number].empty()

				self._rows[row_number].append(card_to_put)

				# remove card from player's hands
				self._players_cards[turn["player"]].remove(card_to_put)
			if self._verbose:
				print "---------------------------"

		return players_score

	def show_rows(self):
		""" Print rows to STDOUT """
		if not self._verbose:
			return
		print "Rows:"
		for row in self._rows:
			print row
		print

	def show_hand(self, players_hand):
		""" Print player's hand to STDOUT """
		if not self._verbose:
			return
		hand = list(players_hand)
		hand.sort(lambda x, y: cmp(x.number, y.number))
		print "Player's hand: %s" % str([str(x) for x in hand])

	@classmethod
	def get_row_number_for_card(cls, card, rows):
		""" Returns a row number to which card have to played; if there is no such row then None is returned """
		acceptable_maximums = [ r.get_max_number() for r in rows if r.can_append_card(card)]
		if len(acceptable_maximums) == 0:
			return None
		will_put_in_row = [ r.get_max_number() == max(acceptable_maximums) for r in rows ]
		return will_put_in_row.index(True)
