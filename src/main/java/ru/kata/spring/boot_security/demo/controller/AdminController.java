package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import ru.kata.spring.boot_security.demo.dto.ConvertToUser;
import ru.kata.spring.boot_security.demo.dto.UserMapper;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;


@Controller
public class AdminController {

    private final UserService userService;
    private ConvertToUser convertToUser;

    @Autowired
    public AdminController(UserService userService, ConvertToUser convertToUser) {
        this.userService = userService;
        this.convertToUser = convertToUser;
    }

    @GetMapping("/admin")
    public String adminPageData(ModelMap modelMap) {
        modelMap.addAttribute("users", userService.getAllUsers());
        modelMap.addAttribute("roles", userService.getRoles());
        modelMap.addAttribute("newuser", new UserMapper());
        return "admin_page";
    }

    @PostMapping("/newUser")
    public String createUser(@ModelAttribute UserMapper userMapper) {
        User user = convertToUser.toUser(userMapper);
        userService.addUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/update/{id}")
    public String editUser(@PathVariable Long id, @ModelAttribute UserMapper userMapper) {
        User user = convertToUser.toUser(userMapper, id);
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/load/{id}")
    public String loadUserForUpdate(ModelMap modelMap, @PathVariable Long id) {
        UserMapper userMap = convertToUser.convertToUserMapper(id);
        modelMap.addAttribute("userMap", userMap);
        modelMap.addAttribute("roleForUser", userService.getRoles());
        return "admin_page";
    }

    @PostMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
