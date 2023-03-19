package com.csci334.ConferenceMagment.service;


import com.csci334.ConferenceMagment.domain.User;
import com.csci334.ConferenceMagment.repository.UserRepository;
import com.csci334.ConferenceMagment.util.CustomPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOpt = userRepository.findByUsername(username);


        return userOpt.orElseThrow(()-> new UsernameNotFoundException("Invalid Credentials"));
    }
}
