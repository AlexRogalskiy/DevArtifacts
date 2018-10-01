//
//  Birthday.swift
//  BirthdayTracker
//
//  Created by Gloria Winquist on 4/10/17.
//  Copyright © 2017 iOS Kids. All rights reserved.
//

import Foundation

class Birthday {
    
    let firstName: String
    let lastName: String
    let birthdate: Date
    
    init(firstName: String, lastName: String, birthdate: Date) {
        
        self.firstName = firstName
        self.lastName = lastName
        self.birthdate = birthdate
    }
}
