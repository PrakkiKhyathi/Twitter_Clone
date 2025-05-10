package com.twitter.UserMS.service;

import com.twitter.UserMS.config.JwtService;
import com.twitter.UserMS.dto.BasicUserDTO;
import com.twitter.UserMS.dto.LoginDTO;
import com.twitter.UserMS.dto.UpdateDTO;
import com.twitter.UserMS.dto.UserDTO;
import com.twitter.UserMS.entity.LocationEnabled;
import com.twitter.UserMS.entity.User;
import com.twitter.UserMS.exception.UserException;
import com.twitter.UserMS.repository.UserRepository;
import jakarta.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Transactional
@Service("UserService")
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private ModelMapper modelMapper=new ModelMapper();
    @Autowired
    private JwtService jwtService;
    @Autowired
    private Environment environment;
    public BasicUserDTO prepareBasicUserDTO(User user)
    {
        BasicUserDTO basicUserDTO=new BasicUserDTO();
        basicUserDTO.setUserId(user.getUserId());
        basicUserDTO.setFirstName(user.getFirstName());
        basicUserDTO.setLastName(user.getLastName());
        basicUserDTO.setEmailId(user.getEmailId());
        basicUserDTO.setBio(user.getBio());
        basicUserDTO.setProfilePicture(user.getProfilePicture());
        return basicUserDTO;
    }
    @Override
    public UserDTO registerUser(UserDTO userDTO) throws UserException {
        User user=modelMapper.map(userDTO,User.class);
        Optional<User> existingUser=userRepository.findByEmailId(userDTO.getEmailId());
        if(existingUser.isPresent())
        {
            throw new UserException(environment.getProperty("Service.Register.UserExists"));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User response=userRepository.save(user);
        return modelMapper.map(user,UserDTO.class);
    }
    @Override
    public HashMap<String,UserDTO> authenticateUser(LoginDTO loginDTO) throws UserException {
        Optional<User> optional=userRepository.findByEmailId(loginDTO.getEmailId());
        User user=optional.orElseThrow(()->new UserException(environment.getProperty("Service.Login.EmailError")));
        if(passwordEncoder.matches(loginDTO.getPassword(),user.getPassword()))
        {
            String jwtToken=jwtService.generateToken(user.getEmailId());
            UserDTO userDTO=modelMapper.map(user,UserDTO.class);
            HashMap<String,UserDTO> map=new HashMap<>();
            map.put(jwtToken,userDTO);
            return map;
        }
        else{
            throw new UserException(environment.getProperty("Service.Login.PasswordError"));
        }
    }
    @Override
    public List<String> getUserEmails()
    {
        return userRepository.fetchAllUserEmails();
    }
    @Override
    public String updateUserProfile(UpdateDTO updateDTO) throws UserException {
        Optional<User> optional=userRepository.findById(updateDTO.getUserId());
        User user=optional.orElseThrow(()->new UserException(environment.getProperty("Service.Login.EmailError")));
        user=modelMapper.map(updateDTO,User.class);
        userRepository.updateUser(user);
        return environment.getProperty("Service.Profile.Update");
    }
    @Override
    public String resetPassword(LoginDTO loginDTO) throws UserException {
        Optional<User> optional=userRepository.findByEmailId(loginDTO.getEmailId());
        optional.orElseThrow(()->new UserException(environment.getProperty("Service.Login.EmailError")));
        loginDTO.setPassword(passwordEncoder.encode(loginDTO.getPassword()));
        userRepository.resetPassword(loginDTO.getEmailId(), loginDTO.getPassword());
        String message=environment.getProperty("Service.PasswordReset.Success");
        return message;
    }
    @Override
    public UserDTO getByUserId(Long userId)
    {
        Optional<User> user=userRepository.findById(userId);
        if(user.isPresent())
        {
            UserDTO userDTO=modelMapper.map(user.get(),UserDTO.class);
            userDTO.setPassword("");
            return userDTO;
        }
        return null;
    }
    @Override
    public List<BasicUserDTO> getByUserIds(List<Long> userIds)
    {
        List<BasicUserDTO> basicUserDTOS=new ArrayList<>();
        for(Long userId:userIds)
        {
            Optional<User> user=userRepository.findById(userId);
            if(user.isPresent())
            {
                basicUserDTOS.add(this.prepareBasicUserDTO(user.get()));
            }
        }
        return basicUserDTOS;

    }
    @Override
    public List<BasicUserDTO> searchByName(String searchText)
    {
        List<BasicUserDTO> searchResults=new ArrayList<>();
        List<User> users=userRepository.searchByName(searchText.toLowerCase());
        for(User user:users)
        {
            searchResults.add(this.prepareBasicUserDTO((user)));
        }
        return searchResults;
    }
    @Override
    public void setLocationPrivacy(Long userId,String enabled)
    {
        userRepository.updateLocationPrivacy(userId, LocationEnabled.valueOf(enabled.toUpperCase()));
    }
}
