package com.mkyong.service;

import com.mkyong.model.BaseballCard;
import org.apache.lucene.search.Query;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import java.util.List;

@Service
public class HibernateSearchService {


    @Autowired
    private final EntityManager centityManager;


    @Autowired
    public HibernateSearchService(EntityManager entityManager) {
        super();
        this.centityManager = entityManager;
    }


    public void initializeHibernateSearch() {

        try {
            FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(centityManager);
            fullTextEntityManager.createIndexer().startAndWait();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public List<BaseballCard> fuzzySearch(String searchTerm) {

        FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(centityManager);
        QueryBuilder qb = fullTextEntityManager.getSearchFactory().buildQueryBuilder().forEntity(BaseballCard.class).get();
        Query luceneQuery = qb.keyword().fuzzy().withEditDistanceUpTo(1).withPrefixLength(1).onFields("name")
                .matching(searchTerm).createQuery();

        javax.persistence.Query jpaQuery = fullTextEntityManager.createFullTextQuery(luceneQuery, BaseballCard.class);

        // execute search

        List<BaseballCard> BaseballCardList = null;
        try {
            BaseballCardList = jpaQuery.getResultList();
        } catch (NoResultException nre) {
            ;// do nothing

        }

        return BaseballCardList;


    }
}
