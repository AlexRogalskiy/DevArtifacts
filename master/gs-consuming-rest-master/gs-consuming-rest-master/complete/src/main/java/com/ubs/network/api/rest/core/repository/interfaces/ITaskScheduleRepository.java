package com.ubs.network.api.rest.core.repository.interfaces;

import com.ubs.network.api.rest.core.model.dto.TaskScheduleDTO;
import com.ubs.network.api.rest.core.model.entities.TaskScheduleEntity;

public interface ITaskScheduleRepository<E extends TaskScheduleEntity, D extends TaskScheduleDTO> extends ICoreBaseRepository<E, D> {
    @Query(value="select v.* from Option o, Vote v where o.POLL_ID = ?1 and v.OPTION_ID = o.OPTION_ID", nativeQuery = true)
    public Iterable<E> findByPoll(final Long id);

    @Query(value="select v.* from Option o, Vote v where o.POLL_ID = ?1 and v.OPTION_ID = o.OPTION_ID", nativeQuery = true)
    public Iterable<E> findByPoll(Long pollId);
}
