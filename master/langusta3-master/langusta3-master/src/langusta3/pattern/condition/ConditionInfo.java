package langusta3.pattern.condition;

/**
 *
 * @author marx
 */
public class ConditionInfo {
    private String conditionType;
    private Integer charNo;
    private String value;
    private String baseNo;

    public ConditionInfo(String baseNo, String conditionType, Integer charNumber, String value) {
        this.conditionType = conditionType;
        this.charNo = charNumber;
        this.value = value;
        this.baseNo = baseNo;
    }

    public String getType() {
        return conditionType;
    }

    public String getValue() {
        return value;
    }

    public Integer getCharNo() {
         return charNo;
    }

    public String getBaseNo() {
        return baseNo;
    }

    @Override
    public String toString() {
        return "[ (" + baseNo + ") " + conditionType + " - " + charNo + " -> " + value + "]";
    }
}
