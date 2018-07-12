package com.javabeast.controllers;

import com.javabeast.domain.LandingPage;
import com.javabeast.service.FeaturePageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HomeController {

    private final FeaturePageService featurePageService;


    @Autowired
    public HomeController(final FeaturePageService featurePageService) {
        this.featurePageService = featurePageService;
    }

    @GetMapping()
    public ModelAndView getHomePage(final HttpServletRequest httpServletRequest) {
        final Locale locale = LocaleContextHolder.getLocale();
        final List<LandingPage> landingPages = featurePageService.getLandingPagesForLang(locale.getLanguage());
        final Map<String, Object> model = new HashMap<>();
        model.put("landingPages", landingPages);
        return new ModelAndView("home", model);
    }

}
