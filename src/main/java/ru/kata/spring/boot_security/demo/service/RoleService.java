package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.Set;

public interface RoleService {
    void addRole(Set<Role> role);

    Set<Role> getRoles();

    Role getRoleByName(String roleName);

    Role getRoleById(Long id);
}
