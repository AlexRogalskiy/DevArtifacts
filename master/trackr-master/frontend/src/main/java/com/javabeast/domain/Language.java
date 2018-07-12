package com.javabeast.domain;

public enum Language {
    EN("en", "English"),
    DE("de", "Deutsche"),
    ES("es", "Español"),
    IT("it", "Italiano"),
    NL("nl", "Nederlands"),
    PL("pl", "Polskie"),
    PT("pt", "Português"),
    DA("da", "Dansk"),
    RU("ru", "русский"),
    UK("uk", "український"),
    NO("no", "Norsk"),
    SV("sv", "Svenska");

    private final String displayName;
    private final String languageName;

    Language(String displayName, String languageName) {
        this.displayName = displayName;
        this.languageName = languageName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getLanguageName() {
        return languageName;
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
}
