package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.util.ConvertToUser;
import ru.kata.spring.boot_security.demo.dto.UserDto;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;


@Controller
@PreAuthorize("hasRole(ADMIN)")
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;
    private ConvertToUser convertToUser;

    @Autowired
    public AdminController(UserService userService, ConvertToUser convertToUser, RoleService roleService) {
        this.userService = userService;
        this.convertToUser = convertToUser;
        this.roleService = roleService;
    }

    @GetMapping
    public String adminPageData(ModelMap modelMap) {
        modelMap.addAttribute("users", userService.getAllUsers());
        modelMap.addAttribute("roles", roleService.getRoles());
        modelMap.addAttribute("newuser", new UserDto());
        return "admin_page";
    }

    @PostMapping("/newUser")
    public String createUser(@ModelAttribute UserDto userDto) {
        User user = convertToUser.toUser(userDto);
        userService.addUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/edit/{id}")
    public String editUser(@PathVariable Long id, @ModelAttribute UserDto userDto) {
        User user = convertToUser.toUser(userDto, id);
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/edit/{id}")
    public String loadUserForUpdate(ModelMap modelMap, @PathVariable Long id) {
        UserDto userDto = convertToUser.convertToUserMapper(id);
        modelMap.addAttribute("loadedUser", userDto);
        modelMap.addAttribute("roleForUser", roleService.getRoles());
        return "updateUser";
    }

    @PostMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
