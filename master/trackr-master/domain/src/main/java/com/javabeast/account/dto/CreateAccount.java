package com.javabeast.account.dto;

import com.javabeast.account.Account;
import com.javabeast.account.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccount {
    private Account account;
    private User user;
}
