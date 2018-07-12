package com.javabeast.domain;

import java.net.URL;

public enum Language {
    EN("en", "English", "landingpage_en.json", "gb"),
    FR("fr", "Francis", "landingpage_fr.json", "fr"),
    DE("de", "Deutsch", "landingpage_de.json", "de"),
    ES("es", "Español", "landingpage_es.json", "es"),
    IT("it", "Italiano", "landingpage_it.json", "it"),
    NL("nl", "Nederlands", "landingpage_nl.json", "nl"),
    PL("pl", "Polskie", "landingpage_pl.json", "pl"),
    PT("pt", "Português", "landingpage_pt.json", "pt"),
    DA("da", "Dansk", "landingpage_da.json", "dk"),
    RU("ru", "Pусский", "landingpage_ru.json", "ru"),
    UK("uk", "Yкраїнський", "landingpage_uk.json", "ua"),
    NO("no", "Norsk", "landingpage_no.json", "no"),
    SV("sv", "Svenska", "landingpage_sv.json", "se");

    private final String displayName;
    private final String languageName;
    private final String landingPageUrl;
    private final String flagClass;

    Language(final String displayName, final String languageName, final String landingPageUrl, final String flagShortCode) {
        this.displayName = displayName;
        this.languageName = languageName;
        this.landingPageUrl = "/landingpage/" + landingPageUrl;
        this.flagClass = "flag-" + flagShortCode;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getLanguageName() {
        return languageName;
    }

    public String getLandingPageUrl() {
        return landingPageUrl;
    }

    public String getFlagClass() {
        return flagClass;
    }

    public static String getNameFromCode(final String langCode) {
        final String isoCode = langCode.substring(0, 2);
        final Language[] values = Language.values();
        for (final Language value : values) {
            if (value.getDisplayName().equals(isoCode)) {
                return value.getLanguageName();
            }
        }
        return Language.EN.getLanguageName();
    }

    public static String getFlagClassFromCode(final String langCode) {
        final String isoCode = langCode.substring(0, 2);
        final Language[] values = Language.values();
        for (final Language value : values) {
            if (value.getDisplayName().equals(isoCode)) {
                return value.getFlagClass();
            }
        }
        return Language.EN.getFlagClass();
    }
}
