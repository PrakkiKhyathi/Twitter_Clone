package com.twitter.TweetMS.dto;

import lombok.Data;

@Data
public class ReplyOrRetweetDTO {
    private Long replyId;
    private TweetDTO tweetDTO;
}
