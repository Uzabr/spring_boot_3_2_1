package ru.kata.spring.boot_security.demo.dto;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.HashSet;
import java.util.Set;

@Component
public class ConvertToUser {
    private UserService userService;
    private PasswordEncoder passwordEncoder;

    public ConvertToUser(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public User toUser(UserMapper userMapper, Long id) {
        Set<Role> roles = new HashSet<>();
        roles.add(userService.getRoleById(userMapper.getRoleId()));
        userMapper.setId(id);
        User user = userService.getUserById(id);
        user.setUsername(userMapper.getUsername());
        user.setFirstName(userMapper.getFirstName());
        user.setLastName(userMapper.getLastName());
        user.setAge(userMapper.getAge());
        user.setRole(roles);

        if (userMapper.getPassword() != null && !userMapper.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userMapper.getPassword()));
        }

        return user;
    }

    public UserMapper convertToUserMapper(Long id) {
        User user = userService.getUserById(id);
        UserMapper userMapper = new UserMapper();
        userMapper.setId(id);
        userMapper.setUsername(user.getUsername());
        userMapper.setFirstName(user.getFirstName());
        userMapper.setLastName(user.getLastName());
        userMapper.setAge(user.getAge());
        return userMapper;
    }

    public User toUser(UserMapper userMapper) {
        Set<Role> roles = new HashSet<>();
        User user = new User();
        roles.add(userService.getRoleById(userMapper.getRoleId()));
        user.setUsername(userMapper.getUsername());
        user.setFirstName(userMapper.getFirstName());
        user.setLastName(userMapper.getLastName());
        user.setAge(userMapper.getAge());
        user.setRole(roles);

        if (userMapper.getPassword() != null && !userMapper.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userMapper.getPassword()));
        }

        return user;
    }
}
