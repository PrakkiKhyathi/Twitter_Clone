package com.twitter.MediaMS.controller;

import com.twitter.MediaMS.dto.MediaDTO;
import com.twitter.MediaMS.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/media")
public class MediaController {
    @Autowired
    private MediaService mediaService;
    @PostMapping("/upload")
    public ResponseEntity<MediaDTO> createMedia(@RequestBody MediaDTO mediaDTO)
    {
        return new ResponseEntity<>(mediaService.createMedia(mediaDTO), HttpStatus.CREATED);
    }
    @GetMapping("/{tweetId}")
    public ResponseEntity<List<MediaDTO>> getByTweetId(@PathVariable Long tweetId)
    {
        return new ResponseEntity<>(mediaService.getMediaByTweetId(tweetId),HttpStatus.OK);
    }
    @DeleteMapping("/delete/{mediaId}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long mediaId)
    {
        mediaService.deleteMedia(mediaId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteByTweetId(@RequestParam Long tweetId)
    {
        mediaService.deleteByTweetId(tweetId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
