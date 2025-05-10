package com.twitter.TweetMS.repository;

import com.twitter.TweetMS.entity.Tweet;
import com.twitter.TweetMS.entity.TweetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TweetRepository extends JpaRepository<Tweet,Long> {
    public List<Tweet> findByUserIdAndType(Long userId, TweetType type);
    public List<Tweet> findByTop5UserIdAndTypeOrderByCreatedAtDesc(Long userId,TweetType type);
    @Query("select t from Tweet t where t.type=?1 and t.tweetId in (select t.tweetId from ReplyOrTweet t where t.forTweetId=?2)")
    public List<Tweet> getAll(TweetType type,Long tweetId);
    public List<Tweet> findByTweetContentContainingIgnoreCase(String text);
}
