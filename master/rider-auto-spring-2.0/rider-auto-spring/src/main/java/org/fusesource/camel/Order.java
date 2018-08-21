package org.fusesource.camel;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.camel.dataformat.bindy.annotation.CsvRecord;
import org.apache.camel.dataformat.bindy.annotation.DataField;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@CsvRecord(separator = ",", skipFirstLine = true)
public class Order implements Serializable {
    @XmlAttribute
    @DataField(pos = 1)
    private String name;
    
    @XmlAttribute
    @DataField(pos = 2)
    private int amount;
    
    public Order() {
    }
    
    public Order(String name, int amount) {
        this.name = name;
        this.amount = amount;
    }
    
    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (other == null) {
            return false;
        }
        if (this.getClass() != other.getClass()) {
            return false;
        }
        Order that = (Order) other;
        return this.name.equals(that.name) && this.amount == that.amount;
    }
    
    @Override
    public String toString() {
        return "Order[" + name + " , " + amount + "]";
    }
}
