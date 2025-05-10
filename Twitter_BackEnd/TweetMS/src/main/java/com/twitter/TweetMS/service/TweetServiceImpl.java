package com.twitter.TweetMS.service;

import com.twitter.TweetMS.dto.MediaDTO;
import com.twitter.TweetMS.dto.TweetDTO;
import com.twitter.TweetMS.entity.ReplyOrRetweet;
import com.twitter.TweetMS.entity.Tweet;
import com.twitter.TweetMS.entity.TweetType;
import com.twitter.TweetMS.repository.ReplyOrRetweetRepository;
import com.twitter.TweetMS.repository.TweetRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional
@Service("TweetService")
public class TweetServiceImpl implements TweetService {
    private ModelMapper modelMapper=new ModelMapper();
    @Autowired
    private TweetRepository tweetRepository;
    @Autowired
    private ReplyOrRetweetRepository replyOrRetweetRepository;
    @Autowired
    private WebClient.Builder webClientBuilder;
    public Tweet prepareTweet(TweetDTO tweetDTO)
    {
        Tweet tweet=new Tweet();
        tweet.setUserId(tweetDTO.getUserId());
        tweet.setTweetContent(tweetDTO.getTweetContent());
        tweet.setLikes(tweetDTO.getLikes());
        tweet.setCreatedAt(tweetDTO.getCreatedAt());
        tweet.setType(tweetDTO.getType());
        tweet.setUpdatedAt(tweetDTO.getUpdatedAt());
        return tweet;
    }
    public List<MediaDTO> getByTweetId(Long tweetId)
    {
        return webClientBuilder.build().get().uri("http://localhost:8082/media/"+tweetId)
                .retrieve().bodyToMono(List.class).block();
    }
    @Override
    public TweetDTO postTweet(TweetDTO tweetDTO,Long tweetId)
    {
        Tweet tweet=this.prepareTweet(tweetDTO);
        tweet=tweetRepository.save(tweet);
        List<MediaDTO> mediaDTOS=tweetDTO.getMedia();
        List<MediaDTO> updatedMedia=new ArrayList<>();
        if(mediaDTOS.size()>0)
        {
            for(MediaDTO mediaDTO:mediaDTOS)
            {
                mediaDTO.setTweetId(tweet.getTweetId());
                mediaDTO.setCreatedAt(tweet.getCreatedAt());
                mediaDTO.setUserId(tweet.getUserId());
                MediaDTO mediaDTO1=webClientBuilder.build().post().uri("http://localhost:8085/media/upload")
                        .bodyValue(mediaDTO).retrieve().bodyToMono(MediaDTO.class).block();
                updatedMedia.add(mediaDTO1);
            }
        }
        if(!tweetDTO.getType().equals(TweetType.TWEET))
        {
            ReplyOrRetweet replyOrRetweet=new ReplyOrRetweet();
            replyOrRetweet.setTweetId(tweet.getTweetId());
            replyOrRetweet.setForTweetId(tweetId);
            replyOrRetweetRepository.save(replyOrRetweet);
        }
        TweetDTO tweetDTO1=modelMapper.map(tweet,TweetDTO.class);
        tweetDTO1.setMedia(updatedMedia);
        return tweetDTO1;
    }
    @Override
    public List<TweetDTO> getTweetsByUserId(Long userId)
    {
        List<Tweet> tweets=tweetRepository.findByUserIdAndType(userId,TweetType.TWEET);
        List<TweetDTO> tweetDTOList=modelMapper.map(tweets,new TypeToken<List<TweetDTO>>(){}.getType());
        for(TweetDTO tweetDTO:tweetDTOList)
        {
            tweetDTO.setMedia(this.getByTweetId(tweetDTO.getTweetId()));
        }
        return tweetDTOList;
    }
    @Override
    public List<TweetDTO> getReTweetsByUserId(Long userId)
    {
        List<Tweet> tweets=tweetRepository.findByUserIdAndType(userId,TweetType.TWEET);
        List<TweetDTO> tweetDTOList=modelMapper.map(tweets,new TypeToken<List<TweetDTO>>(){}.getType());
        for(TweetDTO tweetDTO:tweetDTOList)
        {
            tweetDTO.setMedia(this.getByTweetId(tweetDTO.getTweetId()));
        }
        return tweetDTOList;
    }
    @Override
    public TweetDTO updateTweet(Long id,TweetDTO tweetDTO)
    {
        Optional<Tweet> tweet=tweetRepository.findById(id);
        if(tweet.isPresent())
        {
            Tweet updatedTweet=tweet.get();
            updatedTweet.setTweetContent(tweetDTO.getTweetContent());
            updatedTweet.setUpdatedAt(tweetDTO.getUpdatedAt());
            updatedTweet=tweetRepository.save(updatedTweet);
            List<MediaDTO> mediaDTOS=tweetDTO.getMedia();
            List<MediaDTO> updatedMediaDTO=new ArrayList<>();
            for(MediaDTO mediaDTO:mediaDTOS)
            {
                if(mediaDTO.getIsDelete())
                {
                    webClientBuilder.build().delete().uri("http://localhost:8082/media/delete/"+mediaDTO.getMediaId())
                            .retrieve().toBodilessEntity().block();
                }
                else if(mediaDTO.getMediaId()==null || mediaDTO.getMediaId().toString().isEmpty())
                {
                    mediaDTO.setTweetId(tweetDTO.getTweetId());
                    mediaDTO.setCreatedAt(tweetDTO.getCreatedAt());
                    mediaDTO.setUserId(tweetDTO.getUserId());
                    MediaDTO mediaDTO1=webClientBuilder.build().post().uri("http://localhost:8082/media/upload").bodyValue(mediaDTO)
                            .retrieve().bodyToMono(MediaDTO.class).block();
                    updatedMediaDTO.add(mediaDTO1);
                }
            }
            TweetDTO tweetDTO1=modelMapper.map(updatedTweet,TweetDTO.class);
            tweetDTO1.setMedia(updatedMediaDTO);
            return tweetDTO1;
        }
        return null;
    }
    @Override
    public void deleteTweet(Long id)
    {
        Tweet tweet=tweetRepository.findById(id).get();
        if(tweet.getType().equals(TweetType.REPLY))
        {
            tweetRepository.deleteById(id);
            replyOrRetweetRepository.deleteById(id);
        }
        else{
            List<ReplyOrRetweet> replyOrRetweetList=replyOrRetweetRepository.findByForTweetId(id);
            for(ReplyOrRetweet replyOrRetweet:replyOrRetweetList)
            {
                if(tweetRepository.findById(replyOrRetweet.getTweetId()).get().getType().equals(TweetType.REPLY))
                {
                    tweetRepository.deleteById(replyOrRetweet.getTweetId());
                }
                replyOrRetweetRepository.deleteById(replyOrRetweet.getTweetId());
            }
            tweetRepository.deleteById(id);
        }
        webClientBuilder.build().delete().uri("http://localhost:8082/media/delete?tweetId="+
                tweet.getTweetId()).retrieve().toBodilessEntity().block();
    }
    @Override
    public void likeTweet(Long id)
    {
        Optional<Tweet> tweet=tweetRepository.findById(id);
        if(tweet.isPresent())
        {
            Tweet likedTweet=tweet.get();
            likedTweet.setLikes(likedTweet.getLikes()+1);
            tweetRepository.save(likedTweet);
        }
    }
    @Override
    public void dislikeTweet(Long id)
    {
        Optional<Tweet> tweet=tweetRepository.findById(id);
        if(tweet.isPresent())
        {
            Tweet dislikedTweet=tweet.get();
            dislikedTweet.setLikes(dislikedTweet.getLikes()-1);
            tweetRepository.save(dislikedTweet);
        }
    }
    public int getAllLikesById(Long tweetId)
    {
        Optional<Tweet> tweet=tweetRepository.findById(tweetId);
        return tweet.isPresent()?tweet.get().getLikes():0;
    }
    @Override
    public List<TweetDTO> getAll(String type,Long tweetId)
    {
        type=type.toUpperCase();
        if(type.equals(TweetType.REPLY.toString()) || type.equals(TweetType.RETWEET.toString()))
        {
            List<Tweet> tweets=tweetRepository.getAll(TweetType.valueOf(type),tweetId);
            List<TweetDTO> tweetDTOS=modelMapper.map(tweets,new TypeToken<List<TweetDTO>>(){}.getType());
            for(TweetDTO tweetDTO:tweetDTOS)
            {
                tweetDTO.setMedia(this.getByTweetId(tweetDTO.getTweetId()));
            }
            return tweetDTOS;
        }
        return null;
    }
    @Override
    public List<TweetDTO> getTweetsByContainingText(String text)
    {
        List<Tweet> tweets=tweetRepository.findByTweetContentContainingIgnoreCase(text);
        List<TweetDTO> tweetDTOS=modelMapper.map(tweets,new TypeToken<List<TweetDTO>>(){}.getType());
        for(TweetDTO tweetDTO:tweetDTOS)
        {
            tweetDTO.setMedia(this.getByTweetId(tweetDTO.getTweetId()));
        }
        return tweetDTOS;
    }

    @Override
    public TweetDTO getTweetByTweetId(Long tweetId)
    {
        Optional<Tweet> optional=tweetRepository.findById(tweetId);
        if(optional.isPresent())
        {
            Tweet tweet=optional.get();
            TweetDTO tweetDTO=modelMapper.map(tweet,TweetDTO.class);
            tweetDTO.setMedia(this.getByTweetId(tweetDTO.getTweetId()));
            return tweetDTO;
        }
        else{
            return null;
        }
    }
    @Override
    public List<TweetDTO> getTweetsByFollowersId(List<Long> followersIds)
    {
        List<TweetDTO> tweetDTOS=new ArrayList<>();
        for(Long id:followersIds)
        {
            List<Tweet> tweets=tweetRepository.findByTop5UserIdAndTypeOrderByCreatedAtDesc(id,TweetType.TWEET);
            List<TweetDTO> tweetDTOList=modelMapper.map(tweets,new TypeToken<List<TweetDTO>>(){}.getType());
            for(TweetDTO tweetDTO:tweetDTOList)
            {
                tweetDTO.setMedia(this.getByTweetId(tweetDTO.getTweetId()));
            }
            tweetDTOList.addAll(tweetDTOList);
        }
        return tweetDTOS;
    }

}
