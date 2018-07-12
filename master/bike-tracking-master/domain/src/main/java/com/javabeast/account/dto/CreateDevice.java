package com.javabeast.account.dto;

import com.javabeast.account.Account;
import com.javabeast.account.Device;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDevice {
    private Account account;
    private Device device;
}
