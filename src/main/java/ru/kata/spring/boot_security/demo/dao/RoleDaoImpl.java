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

    @Override
    public Role getRoleByName(String roleName) {
        return entityManager.createQuery("select r from Role r where r.name = :roleName", Role.class).setParameter("roleName", roleName).getSingleResult();
    }

    @Override
    public Role getRoleById(Long id) {
        return entityManager.find(Role.class, id);
    }
}
