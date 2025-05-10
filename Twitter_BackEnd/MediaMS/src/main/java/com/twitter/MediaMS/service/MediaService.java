package com.twitter.MediaMS.service;

import com.twitter.MediaMS.dto.MediaDTO;

import java.util.List;

public interface MediaService {
    public MediaDTO createMedia(MediaDTO mediaDTO);
    public MediaDTO getMediaById(Long mediaId);
    public List<MediaDTO> getMediaByTweetId(Long tweetId);
    public void deleteMedia(Long mediaId);
    public void deleteByTweetId(Long tweetId);

}
