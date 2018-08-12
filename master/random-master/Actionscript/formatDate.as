class formatDate {

    static var today:Date;
    static var minutes;
    static var hours;
    static var dat;
    static var month;
    static var year;
    static var dayN;
    static var day;
    static var c_time;
    static var AM_PM;
    static var is_zero_min;
    static var is_zero_dat;
    static var is_zero_mon;

    static function getDateEN() {

        today = new Date();
        minutes = today.getMinutes();
        hours = today.getHours();
        month = today.getMonth();
        year = today.getFullYear();
        day = today.getDate();

        switch (month) {
            case 0 :
                month = "January";
                break;
            case 1 :
                month = "February";
                break;
            case 2 :
                month = "March";
                break;
            case 3 :
                month = "April";
                break;
            case 4 :
                month = "May";
                break;
            case 5 :
                month = "June";
                break;
            case 6 :
                month = "July";
                break;
            case 7 :
                month = "August";
                break;
            case 8 :
                month = "September";
                break;
            case 9 :
                month = "October";
                break;
            case 10 :
                month = "November";
                break;
            case 11 :
                month = "December";
                break;
        }

        if (hours>12) {
            c_time = (hours-12);
            AM_PM = "PM";
        }
        if (hours==12){
            c_time = 12;
            AM_PM = "PM";
        }
        if (hours<12){
            c_time = hours;
            AM_PM = "AM";
        }
        if (hours==0){
            c_time = 12;
            AM_PM = "AM";
        }
        if (minutes<10) {
            is_zero_min = "0";
        } else {
            is_zero_min = "";
        }
        if (dat<10) {
            is_zero_dat = "0";
        } else {
            is_zero_dat = "";
        }
        if (month<10) {
            is_zero_mon = "0";
        } else {
            is_zero_mon = "";
        }

        return(month + " " + day + ", " + year + " - " + c_time + ":" + is_zero_min + minutes + " " + AM_PM);
    }

    static function getDateFR() {

        today = new Date();
        minutes = today.getMinutes();
        hours = today.getHours();
        day = today.getDate();
        month = today.getMonth();
        year = today.getFullYear();

        switch (month) {
            case 0 :
                month = "janvier";
                break;
            case 1 :
                month = "février";
                break;
            case 2 :
                month = "mars";
                break;
            case 3 :
                month = "avril";
                break;
            case 4 :
                month = "mai";
                break;
            case 5 :
                month = "juin";
                break;
            case 6 :
                month = "juillet";
                break;
            case 7 :
                month = "août";
                break;
            case 8 :
                month = "septembre";
                break;
            case 9 :
                month = "octobre";
                break;
            case 10 :
                month = "novembre";
                break;
            case 11 :
                month = "décembre";
                break;
        }

        if (minutes<10) {
            is_zero_min = "0";
        } else {
            is_zero_min = "";
        }
        if (dat<10) {
            is_zero_dat = "0";
        } else {
            is_zero_dat = "";
        }
        if (month<10) {
            is_zero_mon = "0";
        } else {
            is_zero_mon = "";
        }

        return(day + " " + month + " " + year + " - " + hours + ":" + is_zero_min + minutes);
    }

}
