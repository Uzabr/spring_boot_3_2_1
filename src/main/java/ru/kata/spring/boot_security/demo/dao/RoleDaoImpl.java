package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.Role;

import javax.persistence.EntityManager;
import java.util.HashSet;
import java.util.Set;

@Repository
public class RoleDaoImpl implements RoleDao {

    private EntityManager entityManager;

    public RoleDaoImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void addRole(Set<Role> role) {
        role.forEach(roles -> entityManager.persist(roles));
    }

    @Override
    @SuppressWarnings(value = "unchecked")
    public Set<Role> getRoles() {
        return new HashSet<>(entityManager.createQuery("from Role", Role.class).getResultList());
    }
}
