package com.twitter.TweetMS.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MediaDTO {
    private Long mediaId;
    private Long userId;
    private Long tweetId;
    private String mediaUrl;
    private String mediaType;
    private Boolean isDelete=false;
    private LocalDateTime createdAt;
}
