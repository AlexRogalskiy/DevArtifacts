package com.ubs.network.api.rest.core.repository.interfaces;

import com.ubs.network.api.rest.core.model.dto.TaskDTO;
import com.ubs.network.api.rest.core.model.entities.TaskEntity;

public interface ITaskRepository<E extends TaskEntity, D extends TaskDTO> extends ICoreBaseRepository<E, D> {
    @Query(value="select v.* from Option o, Vote v where o.POLL_ID = ?1 and v.OPTION_ID = o.OPTION_ID", nativeQuery = true)
    public Iterable<E> findByPoll(final Long id);

    @Query(value="select v.* from Option o, Vote v where o.POLL_ID = ?1 and v.OPTION_ID = o.OPTION_ID", nativeQuery = true)
    public Iterable<E> findByPoll(Long pollId);
}
