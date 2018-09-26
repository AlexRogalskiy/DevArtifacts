package ru.java.courses.football;

public class Player extends Person {
    private PlayerRole role;
    private int score;
    private boolean active;

    public Player(String name, PlayerRole role) {
        super(name);
        this.checkRole(role);

        this.role = role;
        this.score = 0;
        this.active = true;
    }

    public void score() {
        if (!this.active) {
            throw new RuntimeException("Игрок не в команде!");
        }

        this.score += 1;
    }

    public PlayerRole getRole() {
        return this.role;
    }

    public void setRole(PlayerRole role) {
        this.checkRole(role);

        this.role = role;
    }

    private void checkRole(PlayerRole role) {
        if (role == null) {
            throw new RuntimeException("Нельзя задать игроку пустую роль!");
        }
    }

    public int getGoals() {
        return this.score;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
