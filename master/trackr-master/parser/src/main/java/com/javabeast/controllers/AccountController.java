package com.javabeast.controllers;

import com.javabeast.TrackerMessage;
import com.javabeast.account.Account;
import com.javabeast.account.dto.CreateAccount;
import com.javabeast.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("account")
public class AccountController {

    private final AccountService accountService;


    @Autowired
    public AccountController(final AccountService accountService) {
        this.accountService = accountService;
    }

//    @PostMapping
//    public @ResponseBody Account createAccount(@RequestBody final CreateAccount createAccount) {
//        return accountService.createAccount(createAccount);
//    }
//
//
//    @RequestMapping(value = "/{accountName}/devices", method = RequestMethod.GET)
//    public @ResponseBody List<TrackerMessage> getDevices(@PathVariable(value = "accountName") final String accountName) {
//        return accountService.getDevices(accountName);
//    }


}
