package com.twitter.UserMS.dto;

import lombok.Data;

@Data
public class BasicUserDTO {
    private long userId;
    private String firstName;
    private String lastName;
    private String emailId;
    private String profilePicture;
    private String bio;
}
