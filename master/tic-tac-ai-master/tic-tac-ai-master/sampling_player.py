import random
from game import Player, Game, HumanPlayer


class SamplingPlayer(Player):
    """
    A Player based on forward sampling.
    """
    GAME_TIE = 0
    GAME_WIN = 1
    GAME_LOSE = 2
    num_samples = 100

    """
    A player based on forward sampling.
    """
    def make_action(self, my_tiles, opponent_tiles, free_tiles):
        # Keep track of the number of wins
        num_wins = {}

        # Loop through all free tiles
        for free_tile in free_tiles:
            wins = 0

            # Now simulate a game with two random players from the current state on where you choose the free tile and
            # see who will win
            for _ in range(self.num_samples):
                my_tiles_copy = [tile for tile in my_tiles]
                opponent_tiles_tiles_copy = [tile for tile in opponent_tiles]
                sample = self.sample_game(True, free_tile, my_tiles_copy, opponent_tiles_tiles_copy)

                # A tie or a win is good enough
                if sample == self.GAME_TIE or sample == self.GAME_WIN:
                    wins += 1
            num_wins[free_tile] = wins

        # Check which move has the highest expected number of wins
        best_score, best_item = None, None
        for item, score in num_wins.items():
            if best_score is None or score > best_score:
                best_score = score
                best_item = item

        # Give back this action
        return best_item

    def sample_game(self, is_my_turn, action, my_tiles, opponent_tiles):
        """
        Run a game with two random players.

        :param is_my_turn: Whether or not it is my turn (True or False).
        :param action: The next action to take.
        :param my_tiles: The tiles belonging to me (list of integers 0-8).
        :param opponent_tiles: The tiles belonging to the opponent (list of integers 0-8).
        :return: GAME_TIE when a tie happened, GAME_WIN when a win happened and GAME_LOSE when you loose the game.
        """

        # Calculate which tiles are still left
        free_tiles = [tile for tile in range(9) if
                      tile not in my_tiles and tile not in opponent_tiles and tile != action]

        # Add the action to either my tiles or the opponent tiles depending on who's turn it is
        if is_my_turn:
            my_tiles += [action]
        else:
            opponent_tiles += [action]

        # When there are no tiles left, it is a tie
        if len(free_tiles) == 0:
            return self.GAME_TIE
        else:
            # Otherwise, I win when it is my turn and my tiles contain a winning combination
            # If they don't contain a winning combination, the game will continue
            # The same reasoning applies when it is not my turn
            if is_my_turn:
                if Game.check_win(my_tiles):
                    return self.GAME_WIN
                else:
                    random.shuffle(free_tiles)
                    return self.sample_game(False, free_tiles[0], my_tiles, opponent_tiles)
            else:
                if Game.check_win(opponent_tiles):
                    return self.GAME_LOSE
                else:
                    random.shuffle(free_tiles)
                    return self.sample_game(True, free_tiles[0], my_tiles, opponent_tiles)


if __name__ == '__main__':
    # Test your skills!
    print('You [H] v.s. SamplingPlayer [S]!')
    player_0 = HumanPlayer()
    player_1 = SamplingPlayer()
    game = Game([player_0, player_1], ['H', 'S'])
    print(game)
    while game.play():
        print(game)
    print(game)