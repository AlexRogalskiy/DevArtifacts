package langusta3.pattern;

/**
 *
 * @author marx
 */
public class FormInfo {
    private String baseNo;
    private String prefix;
    private String suffix;
    private String tag;
    private String filter;
    private boolean lemma;

    public FormInfo(String baseNo, String prefix, String suffix, String tag, String filter, boolean lemma) {
        this.baseNo = baseNo;
        this.prefix = prefix;
        this.suffix = suffix;
        this.tag = tag;
        this.filter = filter;
        this.lemma = lemma;
    }

    public String getBaseNo() {
        return baseNo;
    }

    public String getPrefix() {
        return prefix;
    }

    public String getSuffix() {
        return suffix;
    }

    public String getTag() {
        return tag;
    }

    public String getFilter() {
        return filter;
    }

    public boolean isLemma() {
        return lemma;
    }
}
