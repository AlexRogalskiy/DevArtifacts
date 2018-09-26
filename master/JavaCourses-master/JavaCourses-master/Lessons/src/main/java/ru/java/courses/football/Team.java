package ru.java.courses.football;

import java.text.RuleBasedCollator;
import java.util.ArrayList;

public class Team {
    private String name;
    private ArrayList<Player> players;
    private Coach coach;

    public Team(String name) {
        this.checkName(name);

        this.name = name;
        this.players = new ArrayList<>();
    }

    public void addPlayers(Player ...newPlayers) {
        for (Player player: newPlayers) {
            if (this.canAddPlayer()) {
                this.players.add(player);
            } else {
                throw new RuntimeException("Нельзя добавить в команду больше 20 игроков");
            }
        }
    }

    private boolean canAddPlayer() {
        final int playersCountLimit = 20;

        return this.players.size() + 1 <= playersCountLimit;
    }

    public void removePlayer(int index) {
        this.players.remove(index);
    }

    public ArrayList<Player> getPlayers() {
        return this.players;
    }

    public int getPlayersCount() {
        return this.players.size();
    }

    public int getScore() {
        int totalScore = 0;

        for (Player player : this.players) {
            totalScore += player.getGoals();
        }

        return totalScore;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.checkName(name);

        this.name = name;
    }

    private void checkName(String name) {
        if (name == null || name.trim().equals("")) {
            throw new RuntimeException("Нельзя задать пустое имя!");
        }
    }

    public void setCoach(Coach coach) {
        this.coach = coach;
    }

    public Coach getCoach() {
        return this.coach;
    }
}
