package com.javabeast.services;

import com.javabeast.account.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

//    private final UserRepo userRepo;
//
//
//    @Autowired
//    public UserService(final UserRepo userRepo) {
//        this.userRepo = userRepo;
//    }
//
//    public User login(User user) {
//        final User byEmail = userRepo.findByEmail(user.getEmail());
//        if (byEmail != null) {
//            return byEmail.getPasswordHash().equals(user.getPasswordHash()) ? byEmail : null;
//        }
//        return null;
//    }
}
