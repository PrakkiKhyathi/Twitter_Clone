package com.twitter.FollowMS.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class FollowsDTO {
    private Long id;
    @NotBlank(message = "{userId.empty}")
    private Long userId;
    @NotBlank(message = "{followerId.empty}")
    private Long followerId;
    private LocalDateTime followedAt;
}
