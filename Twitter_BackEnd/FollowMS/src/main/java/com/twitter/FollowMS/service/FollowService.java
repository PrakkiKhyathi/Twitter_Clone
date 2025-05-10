package com.twitter.FollowMS.service;


import com.twitter.FollowMS.dto.FollowsDTO;
import com.twitter.FollowMS.entity.Follows;
import com.twitter.FollowMS.exception.FollowException;

import java.util.List;

public interface FollowService {
    public Follows follow(FollowsDTO followsDTO,String token) throws FollowException;
    public List<Long> getFollowersByUserId(Long userId);
    public List<Long> getFollowingsByUserId(Long userId);
    public void unFollow(Long userId,Long followerId);

}
