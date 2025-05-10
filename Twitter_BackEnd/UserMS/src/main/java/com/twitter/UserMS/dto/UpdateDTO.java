package com.twitter.UserMS.dto;

import lombok.Data;

@Data
public class UpdateDTO {
    private long userId;
    private String bio;
    private String location;
    private String website;
    private String profilePicture;
    private String coverPhoto;
}
