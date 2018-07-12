package com.javabeast.services;

import com.javabeast.TrackerMessage;
import com.javabeast.account.Account;
import com.javabeast.account.Device;
import com.javabeast.account.dto.CreateAccount;
import com.javabeast.account.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class AccountService {

//    private final AccountRepo accountRepo;
//
//    private final UserRepo userRepo;
//
//    private final TrackerMessageRepo trackerMessageRepo;
//
//    private final DeviceRepo deviceRepo;
//
//    @Autowired
//    public AccountService(final AccountRepo accountRepo, final UserRepo userRepo, final TrackerMessageRepo trackerMessageRepo, final DeviceRepo deviceRepo) {
//        this.accountRepo = accountRepo;
//        this.userRepo = userRepo;
//        this.trackerMessageRepo = trackerMessageRepo;
//        this.deviceRepo = deviceRepo;
//    }
//
//    public Account createAccount(final CreateAccount createAccount) {
//        final boolean validData = isValidData(createAccount);
//        if (validData) {
//            return null;
//        }
//
//        final Account account = createAccount.getAccount();
//        final boolean doesAccountExist = doesAccountExist(account);
//        if (doesAccountExist) {
//            return null;
//        }
//
//        final User user = createAccount.getUser();
//        final boolean doesUserExist = doesUserExist(user);
//        if (doesUserExist) {
//            return null;
//        }
//
//        final Account savedAccount = accountRepo.save(account);
//        user.setAccount(savedAccount);
//        userRepo.save(user);
//        return savedAccount;
//    }
//
//
//    private boolean doesUserExist(final User user) {
//        final User findByEmail = userRepo.findByEmail(user.getEmail());
//        return findByEmail != null;
//    }
//
//    private boolean doesAccountExist(final Account account) {
//        final Account findByName = accountRepo.findByName(account.getName());
//        return findByName != null;
//    }
//
//    private boolean isValidData(CreateAccount createAccount) {
//        if (createAccount == null || createAccount.getAccount() == null || createAccount.getUser() == null) {
//            return true;
//        }
//        final Account account = createAccount.getAccount();
//        if (StringUtils.isEmpty(account.getName())) {
//            return true;
//        }
//
//        final User user = createAccount.getUser();
//        return StringUtils.isEmpty(user.getEmail()) || StringUtils.isEmpty(user.getPasswordHash());
//    }
//
//    @Cacheable(value = "latestPosition", cacheManager = "ehCacheManager")
//    public List<TrackerMessage> getDevices(final String accountName) {
//        final Account account = accountRepo.findByName(accountName);
//        final List<Device> devices = deviceRepo.findByAccountId(account.getId());
//        final List<TrackerMessage> trackerMessagesList = new ArrayList<>();
//        for (final Device device : devices) {
//            final TrackerMessage top1ByImeiOrderByTimestamp = trackerMessageRepo.findTop1ByImeiOrderByTimestampDesc(device.getImei());
//            trackerMessagesList.add(top1ByImeiOrderByTimestamp);
//        }
//        return trackerMessagesList;
//    }
}
