package ru.kata.spring.boot_security.demo.dao;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.persistence.EntityManager;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;


@SpringBootTest
@Import({UserDaoImpl.class, RoleDaoImpl.class})
public class DaoTest {

    @Autowired
    private UserService userService;


    private EntityManager entityManager;

    @Autowired
    public DaoTest(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Test
    @DisplayName("Doljen soxranit novovo polzovatelya")
    void addUser() {

        User user = new User();
        user.setFirstName("Test");
        user.setLastName("Testov");
        user.setAge(30);
        user.setPassword("password");
        userService.addUser(user);
        assertThat(user.getId()).isNotNull();

        User userFromdb = entityManager.find(User.class, user.getId());
        assertThat(userFromdb).isNotNull();
        assertThat(userFromdb.getFirstName()).isEqualTo("Test");
    }

    @Test
    @DisplayName("doljen vernut vsex polzovateley")
    void getAllUsers() {
        User user = new User();
        Role role = new Role("ADMIN");
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setFirstName("Test");
        user.setLastName("Testov");
        user.setAge(30);
        user.setRole(roles);
        user.setPassword("password");

        User user2 = new User();
        Role role2 = new Role("USER");
        Set<Role> roles2 = new HashSet<>();
        roles.add(role2);
        user2.setFirstName("Test2");
        user2.setLastName("Testov2");
        user2.setAge(20);
        user2.setRole(roles2);
        user2.setPassword("pass");

        userService.addUser(user);
        userService.addUser(user2);
        entityManager.flush();

        List<User> userList = userService.getAllUsers();
        assertThat(userList).extracting(User::getFirstName)
                .containsExactlyInAnyOrder("Test", "Test2");

    }




}
