export const stringToDate = function(DateStr, format) {
    try {
        var regEx = new RegExp("\\-", "gi");
        strDate = strDate.replace(regEx, "/");
        var milliseconds = Date.parse(strDate);
        var date = new Date();
        date.setTime(milliseconds);
        return date;
    } catch (e) {
        alert("utils " + "stringToDate()" + e);
    }
    return 1;
}
export const getTime = function(dataStr) {
    if (dataStr) {
        var dt = stringToDate(dataStr);
        var hour = dt.getHours().toString();
        var min = dt.getMinutes().toString();
        return ((hour.length == 2 ? "" : "0") + hour) + ":" + ((min.length == 2 ? "" : "0") + min);
    }
    return "";
}
export const datePart = function(dataStr, interval) {
    try {
        var partStr = "";
        //如果是字符串转换为日期型
        if (typeof dataStr == 'string') myDate = stringToDate(dataStr);
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        switch (interval) {
            case 'y':
                partStr = myDate.getFullYear();
                break;
            case 'm':
                partStr = myDate.getMonth() + 1;
                break;
            case 'd':
                partStr = myDate.getDate();
                break;
            case 'w':
                partStr = Week[myDate.getDay()];
                break;
            case 'wm':
                partStr = weekNumOfMonth(myDate);
                break;
            case 'wy':
                partStr = weekNumOfYear(myDate);
                break;
            case 'h':
                partStr = myDate.getHours();
                break;
            case 'n':
                partStr = myDate.getMinutes();
                break;
            case 's':
                partStr = myDate.getSeconds();
                break;
            default:
        }
        return partStr;
    } catch (e) {
        alert("utils " + "datePart()" + e);
    }
    return 1;
}
export const dateDiff = function(strInterval, dateStart, dateEnd) {
    try {
        var dtStart = dateStart;
        var dtEnd = dateEnd;
        //如果是字符串转换为日期型  
        if (typeof dateStart == 'string') dtStart = stringToDate(dateStart);
        if (typeof dateEnd == 'string') dtEnd = stringToDate(dateEnd);
        switch (strInterval) {
            case 's':
                return parseInt((dtEnd - dtStart) / 1000);
            case 'n':
                return parseInt((dtEnd - dtStart) / 60000);
            case 'h':
                return parseInt((dtEnd - dtStart) / 3600000);
            case 'd':
                return parseInt((dtEnd - dtStart) / 86400000);
            case 'w':
                return parseInt((dtEnd - dtStart) / (86400000 * 7));
            case 'm':
                return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
            case 'y':
                return dtEnd.getFullYear() - dtStart.getFullYear();
            default:
        }
    } catch (e) {
        alert("utils " + "DateDiff()" + e);
    }
    return 1;
}
export const dateToString = function(date, pattern) {
    if (!date) {
        date = new Date();
    }
    if (!pattern) {
        pattern = 'yyyy-MM-dd';
    }
    var o = {     "M+": date.getMonth() + 1, //月份 
             "d+": date.getDate(), //日 
             "h+": date.getHours(), //小时 
             "m+": date.getMinutes(), //分 
             "s+": date.getSeconds(), //秒 
             "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
             "S": date.getMilliseconds() //毫秒 
               };  
    if (/(y+)/.test(pattern))
        pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o) {  
        if (new RegExp("(" + k + ")").test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }  
    }  
    return pattern;
}
export const dateAdd = function(dtTmp, strInterval, Number) {
    try {
        var myDate = dtTmp;
        if ("string" == typeof(dtTmp)) {
            myDate = stringToDate(dtTmp);
        }
        var dd = null
        switch (strInterval) {
            case 's':
                dd = new Date(Date.parse(myDate) + (1000 * Number));
                break;
            case 'n':
                dd = new Date(Date.parse(myDate) + (60000 * Number));
                break;
            case 'h':
                dd = new Date(Date.parse(myDate) + (3600000 * Number));
                break;
            case 'd':
                dd = new Date(Date.parse(myDate) + (86400000 * Number));
                break;
            case 'w':
                dd = new Date(Date.parse(myDate) + ((86400000 * 7) * Number));
                break;
            case 'm':
                dd = new Date(myDate.getFullYear(), (myDate.getMonth()) + Number, myDate.getDate(), myDate.getHours(), myDate.getMinutes(), myDate.getSeconds());
                break;
            case 'q':
                dd = new Date(myDate.getFullYear(), (myDate.getMonth()) + Number * 3, myDate.getDate() > g_s.getDaysInMonth(new Date(myDate.getFullYear(), (myDate.getMonth()) + Number * 3)) ? g_s.getDaysInMonth(new Date(myDate.getFullYear(), (myDate.getMonth()) + Number * 3)) : myDate.getDate(), myDate.getHours(), myDate.getMinutes(), myDate.getSeconds());
                break;
            case 'y':
                dd = new Date((myDate.getFullYear() + Number), myDate.getMonth(), myDate.getDate(), myDate.getHours(), myDate.getMinutes(), myDate.getSeconds());
                break;
            default:
        }
        return dd;
    } catch (e) {
        alert("utils " + "dateAdd()" + e);
    }
    return 1;
}

export const getWeek = function(date, notzhou) {
    var result;
    if (!date)
        return "";
    var now = stringToDate(date);
    var day;
    if (!now)
        return "";
    switch (now.getDay()) {
        case 0:
            day = "日";
            break;
        case 1:
            day = "一";
            break;
        case 2:
            day = "二";
            break;
        case 3:
            day = "三";
            break;
        case 4:
            day = "四";
            break;
        case 5:
            day = "五";
            break;
        case 6:
            day = "六";
            break;
    }
    if (true !== notzhou) {
        result = "周" + day;
    } else {
        result = day;
    }

    return result;
}
export const compareDate = function(beginDate, endDate) {
    try {
        var begin = stringToDate(beginDate);
        var end = stringToDate(endDate);
        var b_date = new Date(Date.parse(begin));
        var e_date = new Date(Date.parse(end));
        if (b_date > e_date) return 0;
        if (b_date == e_date) return 1;
        if (b_date < e_date) return 2;
    } catch (e) {
        alert("utils " + "compareDate()" + e);
    }
    return 1;
}
export const getSEDate = function(type) {
    var nowDate = new Date();
    var sDate = "",
        eDate = "";
    if ("pday" == type) { //昨日
        sDate = eDate = dateToString(dateAdd(nowDate, "d", -1));
    }
    if ("cday" == type) { //本日
        sDate = eDate = dateToString(nowDate);
    }
    if ("cweek" == type) { //本周
        var wDay = nowDate.getDay();
        wDay = 0 == wDay ? 7 : wDay;
        sDate = dateToString(dateAdd(nowDate, 'd', -1 * (wDay - 1)));
        eDate = dateToString(dateAdd(nowDate, 'd', -1 * (wDay - 1) + 6));
    }
    if ("cmonth" == type) { //本月
        var dv = dateToString(nowDate).split("-");
        var year = dv[0];
        var month = dv[1];
        var dDST = year + "-" + month + "-0" + 1;
        var ddd = new Date(year, month, 0);
        var dDET = year + "-" + month + "-" + ddd.getDate();
        sDate = dDST;
        eDate = dDET;
    }
    if ("3day" == type) { //三日之内
        sDate = dateToString(dateAdd(nowDate, 'd', -2));
        eDate = dateToString(nowDate);
    }
    if ("7day" == type) { //七日之内
        sDate = dateToString(dateAdd(nowDate, 'd', -6));
        eDate = dateToString(nowDate);
    }
    if ("pweek" == type) { //上周
        var wDay = nowDate.getDay();
        wDay = 0 == wDay ? 7 : wDay;

        sDate = dateToString(dateAdd(nowDate, 'd', -1 * (wDay - 1) - 7));
        eDate = dateToString(dateAdd(nowDate, 'd', -1 * (wDay - 1) - 7 + 6));
    }
    if ("pmonth" == type) { //上月
        var dv = dateToString(nowDate).split("-");
        var year = dv[0];
        var month = dv[1];
        if (1 == month) {
            year = year - 1 + "";
            month = "12";
        } else {
            month = month - 1 + "";
            month = Array(2 - month.length + 1).join('0') + month;
        }
        var dDST = year + "-" + month + "-0" + 1;
        var ddd = new Date(year, month, 0);
        var dDET = year + "-" + month + "-" + ddd.getDate();
        sDate = dDST;
        eDate = dDET;
    }
    return [sDate, eDate];

}
export const getWeekOfYear = function(d) {
    var d1 = d || new Date();
    var d2 = new Date();
    d2.setMonth(0);
    d2.setDate(1);
    var rq = d1 - d2;
    var s1 = Math.ceil(rq / (24 * 60 * 60 * 1000));
    var s2 = Math.ceil((s1 + (7 - d2.getDay() + 1)) / 7);
    return s2;
}
export const getDayOfYear = function(d) {
    var d1 = d || new Date();
    var d2 = new Date();
    d2.setMonth(0);
    d2.setDate(1);
    var rq = d1 - d2;
    var s1 = Math.ceil(rq / (24 * 60 * 60 * 1000));
    var s2 = Math.ceil((s1 + (7 - d2.getDay() + 1)) / 7);
    return s1;
}