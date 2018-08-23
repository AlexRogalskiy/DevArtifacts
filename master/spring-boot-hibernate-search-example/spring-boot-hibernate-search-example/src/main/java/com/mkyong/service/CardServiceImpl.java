package com.mkyong.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mkyong.dao.BaseballCardRepository;
import com.mkyong.model.BaseballCard;

@Service
public class CardServiceImpl implements CardService {

    @Autowired
    BaseballCardRepository cardrepository;

    BaseballCard TedWilliams = new BaseballCard();
    BaseballCard BobGibson = new BaseballCard();
    BaseballCard HonusWagner = new BaseballCard();

    public void addCards() {
        TedWilliams.setName("Ted Williams");
        TedWilliams.setYear(1954);
        TedWilliams.setRarityLevel("Very Rare");

        cardrepository.save(TedWilliams);

        BobGibson.setName("Bob Gibson");
        BobGibson.setYear(1959);
        BobGibson.setRarityLevel("Very Rare");

        cardrepository.save(BobGibson);

        HonusWagner.setName("Honus Wagner");
        HonusWagner.setYear(1909);
        HonusWagner.setRarityLevel("Rarest");

        cardrepository.save(HonusWagner);

        System.out.println("Cards have been added : " + cardrepository.findAll());

    }
}
