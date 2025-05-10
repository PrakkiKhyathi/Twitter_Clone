package com.twitter.SearchMS.controller;

import com.twitter.SearchMS.dto.BasicUserDTO;
import com.twitter.SearchMS.dto.TweetDTO;
import com.twitter.SearchMS.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
public class SearchController {
    @Autowired
    private SearchService searchService;
    @GetMapping("/user")
    public ResponseEntity<List<BasicUserDTO>> searchForUser(@RequestParam("query") String name, @RequestHeader(HttpHeaders.AUTHORIZATION) String token)
    {
        return new ResponseEntity<>(searchService.searchForUser(name,token), HttpStatus.OK);
    }
    @GetMapping("/tweets")
    public ResponseEntity<List<TweetDTO>> searchForTweets(@RequestParam("query") String text, @RequestHeader(HttpHeaders.AUTHORIZATION) String token)
    {
        return new ResponseEntity<>(searchService.searchForTweets(text,token),HttpStatus.OK);
    }

}
