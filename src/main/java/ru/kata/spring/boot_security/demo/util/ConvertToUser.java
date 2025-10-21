package ru.kata.spring.boot_security.demo.util;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.dto.UserDto;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.HashSet;
import java.util.Set;

@Component
public class ConvertToUser {
    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private RoleService roleService;

    public ConvertToUser(UserService userService, PasswordEncoder passwordEncoder, RoleService roleService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }

    public User toUser(UserDto userMapper, Long id) {
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.getRoleById(userMapper.getRoleId()));
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

    public UserDto convertToUserMapper(Long id) {
        User user = userService.getUserById(id);
        UserDto userMapper = new UserDto();
        userMapper.setId(id);
        userMapper.setUsername(user.getUsername());
        userMapper.setFirstName(user.getFirstName());
        userMapper.setLastName(user.getLastName());
        userMapper.setAge(user.getAge());
        return userMapper;
    }

    public User toUser(UserDto userMapper) {
        Set<Role> roles = new HashSet<>();
        User user = new User();
        roles.add(roleService.getRoleById(userMapper.getRoleId()));
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
