package com.twitter.TweetMS.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name="tweets")
public class Tweet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tweetId;
    private Long userId;
    private String tweetContent;
    private int likes;
    @Enumerated(EnumType.STRING)
    private TweetType type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
