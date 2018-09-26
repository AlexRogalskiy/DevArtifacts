import random


class Player:
    """
    Interface class for a player.
    """
    printing = False  # Whether the player will print its status updates
    label = '?'       # Will be set to either 'X' or 'O'
    scores = []       # A list containing the score

    def __init__(self, printing=False):
        self.printing = printing
        self.scores = []

    def make_action(self, my_tiles, opponent_tiles, free_tiles):
        """
        Decide which tile (integer 0 (left-top) up to 8 (bottom-right)) to use given the current game state.

        :param my_tiles: A list of tiles (integers) owned by you.
        :param opponent_tiles: A list of tiles (integers) owned by your opponent.
        :param free_tiles: A list of tiles (integers) which are not owned by anyone.
        :return: The tile (integer) to play.
        """
        raise Exception('Not implemented yet!')

    def handle_invalid_move(self, tile, my_tiles, opponent_tiles, free_tiles):
        """
        This method is called when the last move was invalid. You can implemented a negative feedback loop here.

        :param tile: The tile that was invalid.
        :param my_tiles: A list of tiles (integers) owned by you.
        :param opponent_tiles: A list of tiles (integers) owned by your opponent.
        :param free_tiles: A list of tiles (integers) which are not owned by anyone.
        """
        raise Exception('Invalid move %d!' % tile)

    def handle_game_end(self, status):
        """
        This method is called when the game reached an end.

        :param status 0 for tie, 1 for win, 2 for loose
        """
        if self.printing:
            if status == 0:
                print('Player [%s]: It is a tie!' % self.label)
            elif status == 1:
                print('Player [%s]: I win the game!' % self.label)
            else:
                print('Player [%s]: I just lost the game!' % self.label)
        self.scores.append(status)

    def __str__(self):
        recent_history = self.scores[-100:]
        num_winner = sum([1 if status == 1 else 0 for status in recent_history])
        num_loser = sum([1 if status == 2 else 0 for status in recent_history])
        num_ties = sum([1 if status == 0 else 0 for status in recent_history])
        if num_winner + num_loser == 0:
            return 'Player [%s]: Only ties yet!' % self.label
        return 'Player [%s]: Winning percentage:\t%.1f%%' % (
        self.label, 100. * float(num_winner + num_ties) / float(num_winner + num_loser + num_ties))


class RandomPlayer(Player):
    """
    Just playing a random move.
    """

    def make_action(self, my_tiles, opponent_tiles, free_tiles):
        num_free_tiles = len(free_tiles)
        choice = int(random.random() * num_free_tiles)
        return free_tiles[choice]


class HumanPlayer(Player):
    """
    Human input.
    """

    def make_action(self, my_tiles, opponent_tiles, free_tiles):
        tile = None
        while tile not in free_tiles:
            tile = int(input("Choose a number to continue...")) - 1
        return tile

    def handle_game_end(self, status):
        if status == 0:
            print('It is a tie!')
        elif status == 1:
            print('You win!')
        else:
            print('You lose!')


class SmartPlayer(Player):
    """
    A player which blocks all known wins.
    """

    def make_action(self, my_tiles, opponent_tiles, free_tiles):
        for combo in Game.winning_combinations:
            if combo[0] in opponent_tiles and combo[1] in opponent_tiles and combo[2] in free_tiles:
                return combo[2]
            if combo[1] in opponent_tiles and combo[2] in opponent_tiles and combo[0] in free_tiles:
                return combo[0]
            if combo[2] in opponent_tiles and combo[0] in opponent_tiles and combo[1] in free_tiles:
                return combo[1]
            if combo[0] in my_tiles and combo[1] in my_tiles and combo[2] in free_tiles:
                return combo[2]
            if combo[1] in my_tiles and combo[2] in my_tiles and combo[0] in free_tiles:
                return combo[0]
            if combo[2] in my_tiles and combo[0] in my_tiles and combo[1] in free_tiles:
                return combo[1]
        return random.choice(free_tiles)


class Game:
    """
    This class holds and maintains the game state.
    """

    # The current player (0 for self.players[0], 1 for self.players[1])
    current_player = -1

    # A list consisting of two players
    players = None

    # The tiles (0 (left-top), 1, ..., 8 (bottom-right)) where -1 are the free tiles, 0 are the tiles owned by
    # self.players[0] and 1 are the tiles owned by self.players[1]
    tiles = None

    # A list of all winning combinations
    winning_combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

    def __init__(self, players, labels=[], starter=None):
        """
        Initialize the game state.

        :param players: A list consisting of players.
        """
        self.tiles = [-1] * 9

        # Copy the players
        self.players = players

        # Do a coinflip to decide on the initial player
        if starter is None:
            self.current_player = 0 if random.random() > 0.5 else 1
        else:
            self.current_player = starter

        # Set the labels
        if len(labels) == 0:
            self.players[0].label = 'X'
            self.players[1].label = 'O'
        else:
            self.players[0].label = labels[0]
            self.players[1].label = labels[1]

    def play(self):
        """
        Play one move and return True if the game is not completed yet.

        :return: True if the game is not completed, False otherwise.
        """
        free_tiles = [tile for tile, owner in enumerate(self.tiles) if owner == -1]
        my_tiles = [tile for tile, owner in enumerate(self.tiles) if owner != -1 and owner == self.current_player]
        opponent_tiles = [tile for tile, owner in enumerate(self.tiles) if owner != -1 and owner != self.current_player]
        player = self.players[self.current_player]
        opponent = self.players[1 - self.current_player]

        action = player.make_action(my_tiles, opponent_tiles, free_tiles)
        if action not in free_tiles:
            player.handle_invalid_move(action, my_tiles, opponent_tiles, free_tiles)
            return False

        # Update the current state
        self.tiles[action] = self.current_player
        my_tiles.append(action)
        free_tiles = [tile for tile in free_tiles if tile != action]

        # Check whether the game is done
        game_won = self.check_win(my_tiles)
        if game_won:
            player.handle_game_end(1)
            opponent.handle_game_end(2)
            return False
        else:
            # Check a tie
            if len(free_tiles) == 0:
                player.handle_game_end(0)
                opponent.handle_game_end(0)
                return False

        # Update the current player
        self.current_player = (self.current_player + 1) % 2

        return True

    @staticmethod
    def check_win(current_player_tiles):
        """
        Check whether a set of tiles contains a winning combination.

        :param current_player_tiles: A list of tiles (0 up to and including 8) to check.
        :return: True if the list contains a winning combination, False otherwise.
        """
        for combination in Game.winning_combinations:
            game_won = True
            for number in combination:
                if number not in current_player_tiles:
                    game_won = False
                    break
            if game_won:
                return True
        return False

    def __str__(self):
        """
        Build the string representation of the current game state.

        :return: The string representation of the current game state.
        """
        def create_line(boundary_symbol='+', inner_boundary_symbol='-', inner_symbol='-', texts=[]):
            output = ''
            output += boundary_symbol
            for text_index in range(3):
                output += inner_symbol
                output += texts[text_index] if len(texts) > 0 else inner_symbol * 3
                output += inner_symbol
                if text_index < 2:
                    output += inner_boundary_symbol
            output += boundary_symbol + '\n'
            return output

        output = ''
        for row in range(3):
            output += create_line()
            tiles = [' %s ' % self.players[tile].label if tile != -1 else '[%d]' % (row * 3 + index + 1) for index, tile
                     in
                     enumerate(self.tiles[row * 3:row * 3 + 3])]
            output += create_line('|', '|', ' ', tiles)
        output += create_line()
        return output
