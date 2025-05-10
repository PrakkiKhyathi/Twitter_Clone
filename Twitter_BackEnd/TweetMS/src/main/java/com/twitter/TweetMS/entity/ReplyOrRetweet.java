package com.twitter.TweetMS.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class ReplyOrRetweet {
    @Id
    private Long tweetId;
    private Long forTweetId;
}
