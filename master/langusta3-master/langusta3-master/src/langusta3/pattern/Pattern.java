package langusta3.pattern;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import langusta3.core.SpelledWord;
import langusta3.pattern.condition.AbstractCondition;
import langusta3.pattern.condition.ConditionInfo;
import langusta3.pattern.rule.AbstractRule;
import langusta3.pattern.rule.RuleNotApplicableException;

/**
 * Basic representation of pattern
 *
 * @author marx
 */
public class Pattern {

    private Generator generator;
    private String id;
    protected List<List<ConditionInfo>> conditionLists;
    protected List<List<ConditionInfo>> negativeConditionLists;
    protected List<List<ConditionInfo>> baseInConditionLists;
    protected List<ConditionInfo> baseLists;
    protected List<FormInfo> formLists;
    protected List<String> onlyWithPatternNames;

    public Pattern(Generator g) {
        this.generator = g;
        conditionLists = new ArrayList<List<ConditionInfo>>();
        negativeConditionLists = new ArrayList<List<ConditionInfo>>();
        baseInConditionLists = new ArrayList<List<ConditionInfo>>();
        baseLists = new ArrayList<ConditionInfo>();
        formLists = new ArrayList<FormInfo>();
        onlyWithPatternNames = new ArrayList<String>();
    }

    public void setID(String id) {
        /**
         * @todo: check unique ID across generator OR null *
         */
        this.id = id;
    }

    public String getID() {
        return id;
    }

    public void setLimitPattern(String patternNames) {
        this.onlyWithPatternNames = new ArrayList<String>(Arrays.asList(patternNames.split(",")));
    }

    public List<String> getLimitPattern() {
        return this.onlyWithPatternNames;
    }

    @Override
    public String toString() {
        return id;
    }

    public boolean testWordAsLemma(SpelledWord word) {
        if (this.getMatchingCondition(word) == null) {
            return false;
        } else {
            return true;
        }
    }

    public List<ConditionInfo> getMatchingCondition(SpelledWord word) {
        for (List<ConditionInfo> cl : negativeConditionLists) {
            boolean matches = true;

            for (ConditionInfo ci : cl) {
                boolean pass = false;
                for (AbstractCondition c : generator.getConditions()) {
                    if (c.isValid(word, ci) == true) {
                        pass = true;
                    }
                }

                if (pass == false) {
                    matches = false;
                }
            }

            if (matches == true) {
                return null;
            }
        }

        for (List<ConditionInfo> cl : conditionLists) {
            boolean matches = true;

            for (ConditionInfo ci : cl) {
                boolean pass = false;

                for (AbstractCondition c : generator.getConditions()) {
                    if (c.isValid(word, ci) == true) {
                        pass = true;
                        break;
                    }
                }

                if (pass == false) {
                    matches = false;
                    break;
                }
            }

            if (matches) {
                return cl;
            }
        }

        return null;
    }

    public Map<String, SpelledWord> getBases(SpelledWord oWord) {
        Map<String, SpelledWord> result = new TreeMap<String, SpelledWord>();

        if (this.testWordAsLemma(oWord) == false) {
            return null;
        }

        SpelledWord word = new SpelledWord(oWord);
        result.put("lemma", new SpelledWord(word));

        // Base changes in condition list which was used
        for (ConditionInfo ci : baseInConditionLists.get(conditionLists.indexOf(this.getMatchingCondition(oWord)))) {
            /**
             * @todo: duplicity *
             */
            if (result.containsKey(ci.getBaseNo()) == false) {
                result.put(ci.getBaseNo(), new SpelledWord(word));
            }

            for (AbstractRule ac : generator.getRules()) {
                if (ac.isApplicable(ci) == true) {
                    try {
                        ac.apply(oWord.get(0).getAlphabet(), result.get(ci.getBaseNo()), ci);
                    } catch (RuleNotApplicableException ex) {
                        return null;
                    }
                    break;
                }
            }

            result.get(ci.getBaseNo());
        }

        // Base changes outside condition lists
        for (ConditionInfo ci : baseLists) {
            if (result.containsKey(ci.getBaseNo()) == false) {
                result.put(ci.getBaseNo(), new SpelledWord(word));
            }

            for (AbstractRule ac : generator.getRules()) {
                if (ac.isApplicable(ci) == true) {
                    try {
                        ac.apply(word.get(0).getAlphabet(), result.get(ci.getBaseNo()), ci);
                    } catch (RuleNotApplicableException ex) {
                        return null;
                    }
                    break;
                }
            }
            // ??? @todo: non-sense, why?
            result.get(ci.getBaseNo());
        }

        return result;
    }

    public List<FormInfoTO> getWordForms(Map<String, SpelledWord> bases) {
        List<FormInfoTO> lfi = new ArrayList<FormInfoTO>();

        if (bases == null) {
            return null;
        }

        for (FormInfo fi : formLists) {
            if (bases.containsKey(fi.getBaseNo()) == false) {
                bases.put(fi.getBaseNo(), new SpelledWord(bases.get("lemma")));
            }

            FormInfoTO fit = new FormInfoTO();
            fit.setLemma(bases.get("lemma"));
            fit.setTag(fi.getTag());

            SpelledWord suffix = new SpelledWord();
            for (String v : fi.getSuffix().split(",")) {
                if (fit.getLemma().get(0).getAlphabet().getVowel(v) != null) {
                    suffix.add(fit.getLemma().get(0).getAlphabet().getVowel(v));
                }
            }

            SpelledWord prefix = new SpelledWord();
            if (fi.getPrefix() != null) {
                for (String v : fi.getPrefix().split(",")) {
                    if (fit.getLemma().get(0).getAlphabet().getVowel(v) != null) {
                        prefix.add(fit.getLemma().get(0).getAlphabet().getVowel(v));
                    }
                }
            }

            SpelledWord w = new SpelledWord(bases.get(fi.getBaseNo()));
            SpelledWord resultSuffix = null;
            boolean matched = false;

            for (AbstractFilter a : generator.getFilters()) {
                if (a.isApplicable(fi)) {
                    resultSuffix = a.apply(w, suffix);
                    matched = true;
                    break;
                }
            }

            if (resultSuffix != null) {
                w.addAll(resultSuffix);
            }
            if ((matched == false) && (suffix != null)) {
                w.addAll(suffix);
            }

            if (prefix != null) {
                // We do not apply filters on prefix (@todo?)
                w.addAll(0, prefix);
            }
            
            // Use global filters
            for (AbstractFilter f : generator.getGlobalFilters()) {
                w = f.apply(w, null);
            }
            fit.setWord(w);
            // @new--
            fit.setPattern(this.toString());

            lfi.add(fit);
        }

        return lfi;
    }

    /**
     * Generate all word forms (only once + withouth tags).
     *
     * This method generate all gramatical forms for given word. But in the
     * result is each form represented only once.
     *
     */
    public List<FormInfoTO> generateWForms(Map<String, SpelledWord> bases) {
        List<FormInfoTO> forms = this.getWordForms(bases);
        List<FormInfoTO> result = new ArrayList<FormInfoTO>();

  //      System.out.println("afterReturn:\n" + this.generateGForms(word, patternName));
        if (forms == null) {
            return null;
        }

        for (int i = 0; i < forms.size(); i++) {
            boolean sameWord = false;
            for (int z = i + 1; z < forms.size(); z++) {
                if (forms.get(i).getWord().toString().equals(forms.get(z).getWord().toString()) == true) {
                    sameWord = true;
                }
            }
            if (sameWord == false) {
                forms.get(i).setTag(null);
                result.add(forms.get(i));
            }
        }

        return result;
    }

    public List<SpelledWord> wordToLemma(SpelledWord word, String tag) {
        List<SpelledWord> t1 = new ArrayList<SpelledWord>();
        List<SpelledWord> t2 = new ArrayList<SpelledWord>();
        List<SpelledWord> t2b = new ArrayList<SpelledWord>();
        List<SpelledWord> t3 = new ArrayList<SpelledWord>();
        List<SpelledWord> t4 = new ArrayList<SpelledWord>();
        List<SpelledWord> t5 = new ArrayList<SpelledWord>();

        /**
         * @todo: very strong - we believe that only one basechange can occur
         * for this pattern & tag *
         */
        String baseNo = null;

        List<AbstractFilter> laf = new ArrayList<AbstractFilter>(generator.getGlobalFilters());
        Collections.reverse(laf);

        // Apply global filters
        for (AbstractFilter f : laf) {
            t1.addAll(f.revert(word, null));
        }

        // Remove suffix
        for (SpelledWord w : t1) {
            if (w.size() == 0) {
                continue;
            }

            for (FormInfo fit : this.formLists) {
                if (fit.getTag().matches(tag)) {
                    SpelledWord res = new SpelledWord(w);
                    List<SpelledWord> t1a = new ArrayList<SpelledWord>();
                    baseNo = fit.getBaseNo();

                    /**
                     * @todo: duplicity *
                     */
                    SpelledWord suffix = new SpelledWord();
                    for (String v : fit.getSuffix().split(",")) {
                        if (w.get(0).getAlphabet().getVowel(v) != null) {
                            suffix.add(w.get(0).getAlphabet().getVowel(v));
                        }
                    }

                    if (fit.getFilter() != null) {
                        for (AbstractFilter f : generator.getFilters()) {
                            if (f.isApplicable(fit)) {
                                List<SpelledWord> ls = f.revert(w, fit);
                                if (ls != null) {
                                    t1a.addAll(ls);
                                }
                            }
                        }
                    } else {
                        t1a.add(w);
                    }

                    if ((t1a == null) || (t1a.size() == 0)) {
                        continue;
                    }

                    for (SpelledWord s : t1a) {
                        boolean pass = true;
                        int d = s.size() - suffix.size();

                        if (d <= 0) {
                            break;
                        }

                        for (int i = suffix.size() - 1; i >= 0; i--) {
                            if (s.get(d + i).equals(suffix.get(i))) {
                                s.remove(d + i);
                            } else {
                                pass = false;
                                break;
                            }
                        }

                        // only add result if we can remove suffix
                        if (pass == true) {
                            t2.add(s);
                        }
                    }
                }
            }
        }

        // global base change operation
        for (SpelledWord w : t2) {
            t2b.addAll(this.revertBaseChanges(w, baseNo, this.baseLists));
        }

        // find matching condition-list
        for (SpelledWord w : t2b) {
            for (int k = 0; k < this.conditionLists.size(); k++) {
                List<ConditionInfo> lci = this.conditionLists.get(k);
                List<SpelledWord> wt = null;
                List<SpelledWord> temp = null;

                /**
                 * @todo: apply local basechanges here *
                 */
                wt = this.revertBaseChanges(w, baseNo, baseInConditionLists.get(k));

                for (int i = lci.size() - 1; i >= 0; i--) {
                    ConditionInfo ci = lci.get(i);

                    for (AbstractCondition c : generator.getConditions()) {
                        if (c.isApplicable(ci) == true) {
                            if (wt == null) {
                                break;
                            }

                            for (SpelledWord s : wt) {
                                List<SpelledWord> t = c.revert(s, ci);

                                if ((t != null) && (t.size() > 0)) {
                                    temp = t;
                                } else {
                                    temp = null;
                                }
                            }

                            wt = temp;
                        }
                    }
                }

                if (wt != null) {
                    t3.addAll(wt);
                    /**
                     * only first matching condition-list is applied *
                     */
                    // break;
                }
            }
        }

        for (SpelledWord s : t3) {
            // Apply global filters (remove ďe/ťe/...) in SK
            for (AbstractFilter f : laf) {
                t4.add(f.apply(s, null));
            }
        }

        for (SpelledWord s : t4) {
            if (t5.contains(s) == false) {
                t5.add(s);
            }
        }

        return t5;
    }

    private List<SpelledWord> revertBaseChanges(SpelledWord word, String lemmaBaseNo, List<ConditionInfo> lci) {
        List<SpelledWord> lsw = new ArrayList<SpelledWord>();
        lsw.add(word);

        for (int i = lci.size() - 1; i >= 0; i--) {
            ConditionInfo ci = lci.get(i);
            if (ci.getBaseNo().equals(lemmaBaseNo) == false) {
                continue;
            }

            for (AbstractRule ac : generator.getRules()) {
                if (ac.isApplicable(ci) == true) {
                    List<SpelledWord> temp = new ArrayList<SpelledWord>();

                    for (SpelledWord w2 : lsw) {
                        for (SpelledWord sw : ac.revert(w2, ci)) {
                            temp.add(sw);
                        }
                    }

                    lsw = temp;
                    break;
                }
            }
        }

        return lsw;
    }
}
