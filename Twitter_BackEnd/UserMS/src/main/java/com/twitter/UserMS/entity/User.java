package com.twitter.UserMS.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class User {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long userId;
    private String firstName;
    private String lastName;
    private String emailId;
    private LocalDate dateOfBirth;
    private String password;
    private LocalDate joinedDate;
    private String bio;
    private String location;
    private String website;
    private String profilePicture;
    @Column(columnDefinition = "TEXT")
    private String coverPhoto;
    @Enumerated(EnumType.STRING)
    private LocationEnabled isLocationEnabled=LocationEnabled.FALSE;
}
