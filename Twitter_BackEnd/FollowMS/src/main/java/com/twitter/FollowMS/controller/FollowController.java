package com.twitter.FollowMS.controller;

import com.twitter.FollowMS.dto.FollowsDTO;
import com.twitter.FollowMS.exception.FollowException;
import com.twitter.FollowMS.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/follows")
public class FollowController {
    @Autowired
    private FollowService followService;
    @PostMapping("/add")
    public void follow(@RequestBody FollowsDTO followsDTO, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) throws FollowException {
        followService.follow(followsDTO,token);
    }
    @GetMapping("/followers/{userId}")
    public List<Long> getFollowersByUserId(@PathVariable Long userId)
    {
        return followService.getFollowersByUserId(userId);
    }
    @GetMapping("/followings/{userId}")
    public List<Long> getFollowingsByUserId(@PathVariable Long userId)
    {
        return followService.getFollowingsByUserId(userId);
    }
    @DeleteMapping("/unFollow")
    public void unFollow(@RequestParam Long userId,@RequestParam Long followerId)
    {
        followService.unFollow(userId,followerId);
    }
}
