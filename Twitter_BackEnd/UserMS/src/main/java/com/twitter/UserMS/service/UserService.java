package com.twitter.UserMS.service;

import com.twitter.UserMS.dto.BasicUserDTO;
import com.twitter.UserMS.dto.LoginDTO;
import com.twitter.UserMS.dto.UpdateDTO;
import com.twitter.UserMS.dto.UserDTO;
import com.twitter.UserMS.entity.User;
import com.twitter.UserMS.exception.UserException;


import java.util.HashMap;
import java.util.List;

public interface UserService {
    public UserDTO registerUser(UserDTO userDTO) throws UserException;
    public HashMap<String, UserDTO> authenticateUser(LoginDTO loginDTO) throws UserException;
    public List<String> getUserEmails();
    public String updateUserProfile(UpdateDTO updateDTO) throws UserException;
    public String resetPassword(LoginDTO loginDTO) throws UserException;
    public UserDTO getByUserId(Long userId);
    public List<BasicUserDTO> getByUserIds(List<Long> userIds);
    public List<BasicUserDTO> searchByName(String searchText);
    public void setLocationPrivacy(Long userId,String enabled);


}
