package com.twitter.UserMS.config;

import com.twitter.UserMS.entity.User;
import com.twitter.UserMS.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class TwitterUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String emailId) throws UsernameNotFoundException {
        Optional<User> optional=userRepository.findByEmailId(emailId);
        if(optional.isEmpty())
        {
            throw new UsernameNotFoundException("User Not Found");
        }
        User user=optional.get();
        return new org.springframework.security.core.userdetails.User(user.getEmailId(),user.getPassword(),new ArrayList<>());
    }
}
