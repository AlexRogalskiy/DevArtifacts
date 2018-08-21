package langusta3.pattern;

public class ExtendedFormInfoTO extends FormInfoTO {
    private String frequency;
    private boolean unique;
    private boolean discriminative;
    
    public ExtendedFormInfoTO() {
        super();
        
        frequency = null;
        unique = false;
        discriminative = false;
    }
    
    public void setFreq(String freq) {
        if (freq == null) {
            frequency = null;
        } else {
            frequency = new String(freq); 
        }
    }
    public void setUnique(boolean uniq) { unique = uniq; }
    public void setDiscriminative(boolean disc) { discriminative = disc; }
    
    public boolean getUnique() { return unique; }
    public boolean getDiscriminative() { return discriminative; }
    public String getFreq() {
        if (frequency == null) {
            return null;
        } else {
            return frequency;
        }
    }
    
    public String toString() {
        return super.toString() + "(" + frequency + ", " + unique + "/" + discriminative + ")";
    }
}
