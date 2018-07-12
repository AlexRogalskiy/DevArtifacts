package com.javabeast.service;

import com.javabeast.domain.LandingPageGroup;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

public class FeaturePageServiceTest {


    private final FeaturePageService featurePageService = new FeaturePageService();

    @Test
    public void loadGroups() throws Exception {
        final List<LandingPageGroup> landingPageGroups = featurePageService.loadGroups();
        assertEquals("should load group", 13, landingPageGroups.size());
    }

}