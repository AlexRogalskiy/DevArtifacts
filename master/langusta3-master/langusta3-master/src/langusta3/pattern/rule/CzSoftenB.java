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
public class CzSoftenB extends AbstractTransform {

    public CzSoftenB(String name) {
        super(name);
        
        transformTable.put("k", "c");
        transformTable.put("h", "z");
        transformTable.put("g", "z");
        transformTable.put("ch", "š");
    }
    
}
