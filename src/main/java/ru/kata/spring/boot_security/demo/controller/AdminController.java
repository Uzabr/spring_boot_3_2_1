package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public String adminPageData(ModelMap modelMap) {
        modelMap.addAttribute("users", userService.getAllUsers());
        modelMap.addAttribute("userRole", userService.getRoles());
        modelMap.addAttribute("newUser", new User());
        return "admin_page";
    }

    @PostMapping("/newUser")
    public String createUser(@ModelAttribute User user) {
        userService.addUser(user);
        return "redirect:/admin_page";
    }

    @PostMapping("/edit")
    public String editUser(@ModelAttribute User user) {
        userService.updateUser(user);
        return "redirect:/admin_page";
    }

    @PostMapping("/admin/{id}")
    public String loadUserForUpdate(ModelMap modelMap, @PathVariable Long id) {
        User user = userService.getUserById(id);
        modelMap.addAttribute("loadedUser", user);
        modelMap.addAttribute("roleForUser", userService.getRoles());
        return "updateUser";
    }

    @PostMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin_page";
    }
}
