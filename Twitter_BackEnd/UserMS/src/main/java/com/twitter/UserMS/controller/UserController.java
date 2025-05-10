package com.twitter.UserMS.controller;

import com.twitter.UserMS.dto.BasicUserDTO;
import com.twitter.UserMS.dto.LoginDTO;
import com.twitter.UserMS.dto.UpdateDTO;
import com.twitter.UserMS.dto.UserDTO;
import com.twitter.UserMS.exception.UserException;
import com.twitter.UserMS.service.UserService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/user")
@OpenAPIDefinition(info = @Info(title = "User MS endpoints",description = "Find all the user related operations webservices"))
public class UserController {
    @Autowired
    private UserService userService;
    @Operation(summary = "Registers an user to twitter application")
    @ApiResponses(value = {@ApiResponse(responseCode = "201",description = "User account created successfully"),
    @ApiResponse(responseCode = "400",description = "Email already exists or validation errors")})
    @PostMapping("/signup")
    public ResponseEntity<UserDTO> registerUser(@RequestBody @Valid UserDTO userDTO) throws UserException {
        UserDTO response=userService.registerUser(userDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @Operation(summary = "Authenticate user to login")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "400",description = "Incorrect Email/Password"),
            @ApiResponse(responseCode = "200",description = "User login successfull")
    })
    @PostMapping("/login")
    @CircuitBreaker(name = "authenticateService",fallbackMethod = "authenticateUserFallback")
    public ResponseEntity<HashMap<String,UserDTO>> authenticateUser(@RequestBody @Valid LoginDTO loginDTO) throws UserException {
        HashMap<String,UserDTO> userData=userService.authenticateUser(loginDTO);
        return new ResponseEntity<>(userData,HttpStatus.OK);
    }
    public ResponseEntity<UserDTO> authenticateUserFallback(LoginDTO loginDTO,Throwable throwable)
    {
        UserDTO userDTO=new UserDTO();
        userDTO.setUserId(404L);
        userDTO.setFirstName("");
        userDTO.setLastName("");
        userDTO.setEmailId("");
        return new ResponseEntity<>(userDTO,HttpStatus.BAD_REQUEST);
    }
    @Operation(summary = "Fetches list of user email ids")
    @ApiResponse(responseCode = "200",description = "List of user email ids")
    @GetMapping("/userEmails")
    public ResponseEntity<List<String>> getUserEmails()
    {
        List<String> userEmails=userService.getUserEmails();
        return new ResponseEntity<>(userEmails,HttpStatus.OK);
    }
    @Operation(summary = "Updated the user profile information")
    @ApiResponse(responseCode = "200",description = "user profile updated")
    @PutMapping("/update")
    public ResponseEntity<String> updateUserProfile(@RequestBody @Valid UpdateDTO updateDTO) throws UserException {
        String message=userService.updateUserProfile(updateDTO);
        return new ResponseEntity<>(message,HttpStatus.OK);
    }
    @Operation(summary = "User to reset password")
    @ApiResponse(responseCode = "200",description = "Password reset Successfull")
    @PutMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid LoginDTO loginDTO) throws UserException {
        String response=userService.resetPassword(loginDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getByUserId(@PathVariable Long userId)
    {
        return new ResponseEntity<>(userService.getByUserId(userId),HttpStatus.OK);
    }
    @GetMapping("/search")
    public ResponseEntity<List<BasicUserDTO>> searchForUser(@RequestParam("query") String text)
    {
        return new ResponseEntity<>(userService.searchByName(text),HttpStatus.OK);
    }
    @PostMapping("/profiles")
    public ResponseEntity<List<BasicUserDTO>> getByUserIdsList(@RequestBody List<Long> userIdsList)
    {
        return new ResponseEntity<>(userService.getByUserIds(userIdsList),HttpStatus.OK);
    }
    @GetMapping("/privacy/{userId}")
    public ResponseEntity<Void> setLocationPrivacy(@PathVariable Long userId,@RequestParam String enabled)
    {
        userService.setLocationPrivacy(userId,enabled);
        return new ResponseEntity<>(HttpStatus.OK);
    }



}
