package com.csci334.ConferenceMagment.repository;

import com.csci334.ConferenceMagment.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}
