package com.twitter.SearchMS.service;

import com.twitter.SearchMS.dto.BasicUserDTO;
import com.twitter.SearchMS.dto.TweetDTO;

import java.util.List;

public interface SearchService {
    public List<BasicUserDTO> searchForUser(String name,String token);
    public List<TweetDTO> searchForTweets(String text,String token);
}
