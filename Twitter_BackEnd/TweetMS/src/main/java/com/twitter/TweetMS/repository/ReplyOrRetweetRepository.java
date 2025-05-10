package com.twitter.TweetMS.repository;

import com.twitter.TweetMS.entity.ReplyOrRetweet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReplyOrRetweetRepository extends JpaRepository<ReplyOrRetweet,Long> {
    public List<ReplyOrRetweet> findByForTweetId(Long tweetId);
}
