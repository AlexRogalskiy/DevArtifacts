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
public class CzShorten extends AbstractTransform {
    public CzShorten(String name) {
        super(name);
        transformTable.put("á", "a");
        transformTable.put("é", "e");
        transformTable.put("í", "i");
        transformTable.put("ó", "o");
        transformTable.put("ý", "y");
        transformTable.put("ů", "u");
        transformTable.put("ú", "u");
        // @todo: ou -> u
        // @todo: should reverse be unique too?
    }
}
