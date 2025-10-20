package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public String userPage(ModelMap modelMap) {
        UserDetails user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        modelMap.addAttribute("user", user);
        modelMap.addAttribute("userlist", userService.getAllUsers());
        return "user";
    }
}
