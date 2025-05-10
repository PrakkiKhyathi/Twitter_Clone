package com.twitter.FollowMS.service;

import com.twitter.FollowMS.dto.FollowsDTO;
import com.twitter.FollowMS.dto.UserDTO;
import com.twitter.FollowMS.entity.Follows;
import com.twitter.FollowMS.exception.FollowException;
import com.twitter.FollowMS.repository.FollowRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service("FollowService")
@Transactional
public class FollowServiceImpl implements FollowService {
    @Autowired
    private WebClient.Builder webClientBuilder;
    @Autowired
    private FollowRepository followRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private Environment environment;
    @Override
    public Follows follow(FollowsDTO followsDTO,String token) throws FollowException {
        UserDTO userDTO=webClientBuilder.build().get().uri("http://localhost:8085/user/"+followsDTO.getUserId())
                .header(HttpHeaders.AUTHORIZATION,token)
                .retrieve().bodyToMono(UserDTO.class).block();
        if(userDTO!=null)
        {
            return followRepository.save(modelMapper.map(followsDTO,Follows.class));
        }
        else{
            throw new FollowException(environment.getProperty("User.NotFound"));
        }
    }
    @Override
    public List<Long> getFollowersByUserId(Long userId)
    {
        return followRepository.findFollowersByUserId(userId);
    }
    @Override
    public List<Long> getFollowingsByUserId(Long userId)
    {
        return followRepository.findFollowingsByUserId(userId);
    }
    @Override
    public void unFollow(Long userId,Long  followerId)
    {
        followRepository.deleteByUserIdAndFollowerId(userId,followerId);
    }

}
