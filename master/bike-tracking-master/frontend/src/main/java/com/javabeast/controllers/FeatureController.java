package com.javabeast.controllers;

import com.javabeast.domain.LandingPage;
import com.javabeast.service.FeaturePageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("")
public class FeatureController {

    private static final String PAGE_NAME = "landingpage";

    private final FeaturePageService featurePageService;

    @Autowired
    public FeatureController(final FeaturePageService featurePageService) {
        this.featurePageService = featurePageService;
    }

    @GetMapping("featured/{pageName}")
    public ModelAndView getFeaturePage(@PathVariable final String pageName, final HttpServletRequest httpServletRequest) {
        final Locale locale = LocaleContextHolder.getLocale();
        final List<LandingPage> landingPages = featurePageService.getLandingPagesForLang(locale.getLanguage());
        final LandingPage landingPage = featurePageService.getLandingPage(pageName);
        final Map<String, Object> model = new HashMap<>();
        model.put("page", landingPage);
        model.put("landingPages", landingPages);
        return new ModelAndView(PAGE_NAME, model);
    }
}
