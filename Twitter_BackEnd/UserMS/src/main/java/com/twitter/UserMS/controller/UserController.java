package com.twitter.UserMS.controller;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@OpenAPIDefinition(info = @Info(title = "User MS endpoints",description = "Find all the user related operations webservices"))
public class UserController {

}
