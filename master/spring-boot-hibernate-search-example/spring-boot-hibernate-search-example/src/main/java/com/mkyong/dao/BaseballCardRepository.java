package com.mkyong.dao;

import org.springframework.data.repository.CrudRepository;

import com.mkyong.model.BaseballCard;

public interface BaseballCardRepository extends CrudRepository<BaseballCard,Long> {

}
