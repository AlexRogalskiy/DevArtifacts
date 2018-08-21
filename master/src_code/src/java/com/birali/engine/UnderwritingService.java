package com.birali.engine;

import java.io.InputStreamReader;
import java.io.Reader;

import org.drools.RuleBase;
import org.drools.RuleBaseFactory;
import org.drools.WorkingMemory;
import org.drools.compiler.PackageBuilder;
import org.drools.rule.Package;

import com.birali.domain.*;

public class UnderwritingService {
    public void evaluate(LoanApplication la) 
    	throws Exception{
               	
    	doRun("/Underwriting.drl", la);
    	doRun("/Decision.drl", la);
    	
    }
    
    private void doRun(String ruleFileName, LoanApplication la)
    	throws Exception {
    	
	    RuleBase ruleBase = readRule(ruleFileName);
	    WorkingMemory wm = ruleBase.newWorkingMemory();
	    wm.assertObject(la);
	    wm.assertObject(la.getBorrower());
	    wm.assertObject(la.getProperty());
	    wm.fireAllRules();
	    
    }
    
	private RuleBase readRule(String ruleFileName) throws Exception {
		
		Reader source = new InputStreamReader( 
				UnderwritingService.class.getResourceAsStream(ruleFileName) );
				
		PackageBuilder builder = new PackageBuilder();
		builder.addPackageFromDrl( source );
		Package pkg = builder.getPackage();
		
		RuleBase ruleBase = RuleBaseFactory.newRuleBase();
		ruleBase.addPackage( pkg );
		return ruleBase;
	}    

}
