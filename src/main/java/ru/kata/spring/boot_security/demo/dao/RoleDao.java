package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.Set;

public interface RoleDao {
    void addRole(Set<Role> role);

    Set<Role> getRoles();

    Role getRoleByName(String roleName);

    Role getRoleById(Long id);
}
