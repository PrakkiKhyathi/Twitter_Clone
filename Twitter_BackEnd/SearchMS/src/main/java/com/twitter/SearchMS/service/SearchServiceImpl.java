package com.twitter.SearchMS.service;

import com.twitter.SearchMS.dto.BasicUserDTO;
import com.twitter.SearchMS.dto.TweetDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service("SearchService")
public class SearchServiceImpl implements SearchService {
    @Autowired
    private WebClient.Builder webClientBuilder;
    @Override
    public List<BasicUserDTO> searchForUser(String name,String token)
    {
        return webClientBuilder.build().get().uri("http://UserMS/user/search?query="+name)
                .header(HttpHeaders.AUTHORIZATION,token)
                .retrieve()
                .bodyToMono(List.class)
                .block();
    }
    @Override
    public List<TweetDTO> searchForTweets(String text,String token)
    {
        return webClientBuilder.build().get().uri("http://UserMS/user/search?query="+text)
                .header(HttpHeaders.AUTHORIZATION,token)
                .retrieve()
                .bodyToMono(List.class)
                .block();
    }


}
