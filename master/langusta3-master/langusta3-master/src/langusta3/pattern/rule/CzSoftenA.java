/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package langusta3.pattern.rule;

/**
 *
 * @author marx
 */
public class CzSoftenA extends AbstractTransform {
    public CzSoftenA(String name) {
        super(name);

        transformTable.put("d", "ď");
        transformTable.put("t", "ť");
        transformTable.put("n", "ň");
    }
}
