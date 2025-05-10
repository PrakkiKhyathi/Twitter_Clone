package com.twitter.MediaMS.repository;

import com.twitter.MediaMS.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media,Long> {
    List<Media> findByTweetId(Long tweetId);
    void deleteByTweetId(Long tweetId);
}
