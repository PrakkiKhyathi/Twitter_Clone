package com.twitter.MediaMS.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mediaId;
    private Long userid;
    private Long tweetId;
    private String mediaUrl;
    private String mediaType;
    private LocalDateTime createdAt;

}
