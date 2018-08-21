package com.ubs.network.api.rest.core.repository.interfaces;

import com.ubs.network.api.rest.core.model.dto.TaskSubscriptionDTO;
import com.ubs.network.api.rest.core.model.entities.TaskSubscriptionEntity;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ITaskSubscriptionRepository<E extends TaskSubscriptionEntity, D extends TaskSubscriptionDTO> extends ICoreBaseRepository<E, D>, PagingAndSortingRepository<E, Long> {
    @Query(value="select v.* from Option o, Vote v where o.POLL_ID = ?1 and v.OPTION_ID = o.OPTION_ID", nativeQuery = true)
    public Iterable<E> findByPoll(final Long id);

    @Query(value="select v.* from Option o, Vote v where o.POLL_ID = ?1 and v.OPTION_ID = o.OPTION_ID", nativeQuery = true)
    public Iterable<E> findByPoll(Long pollId);
}
