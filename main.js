
function mainControl(){
  m1 = new XMLHttpRequest();
  m1.open('GET',"https://thingspeak.com/channels/636567/field/1/last",true);
  m1.send();
  m1.onreadystatechange = function(){
    if(m1.readyState == 4 && m1.status == 200){
    	currentState = m1.responseText;
        flow();
    }
  }
}

function flow(){
	startTime();
	if(currentState == 1){
    	currentTime();
        setTimeout(displayOn,4000);
    }
    if(currentState == 0){
    	computeDynamicOffset();
        setTimeout(displayOff,4000);
    }
	setTimeout(function(){
   		window.location.reload(1);}, 30000);
}

function startTime(){
	var s1 = new XMLHttpRequest();
    s1.open('GET',"https://thingspeak.com/channels/636567/fields/2/last.json?timezone=Asia%2FKolkata",true);
    s1.send();
    s1.onreadystatechange = function(){
    	if(s1.readyState == 4 && s1.status == 200){
        	sState = JSON.parse(s1.responseText);
            sFullTime = String(sState.created_at).split("T");
            sDate = sFullTime[0];
            sTime = sFullTime[1].split("+");
            sTime = sTime[0];
            document.getElementById("Date").innerHTML = "Date: " + sDate;
            document.getElementById("Time").innerHTML = "Time: " + sTime;
        }
    }
}
function currentTime(){
  xhr = new XMLHttpRequest();
  xhr.open('GET', "https://thingspeak.com/channels/636567/fields/1/last.json?timezone=Asia%2FKolkata", true);
  xhr.send();
 
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      mState = JSON.parse(xhr.responseText);
      mFullTime = String(mState.created_at).split("T");
      mDate = mFullTime[0].split("-");
      mYear = mDate[0];
      mMonth = mDate[1];
      mDay = mDate[2];
      mTime = mFullTime[1].split("+");
      mTime = mTime[0].split(":");
      mHour = mTime[0];
      mMinute = mTime[1];
      today = new Date();
      cYear = today.getFullYear();
      cMonth = today.getMonth()+1;
      cDay = today.getDate();
      cHour = today.getHours();
      cMinute = today.getMinutes();
      computeMinutes();
 	  computeStaticOffset();
    }
  }
}


function computeMinutes(){
	if(cMinute >= mMinute){
    	minutes = cMinute - mMinute;
    }
    else if(cMinute < mMinute){
    	minutes = cMinute + 60 - mMinute;
        if(mHour < 24){
        	mHour++;
        }
        else if(mHour == 24){
        	mHour = 1;
        }
    }
    computeHours();
} 

function computeHours(){
	if(cHour >= mHour){
    	hours = cHour - mHour;
    }
    else if(cHour < mHour){
    	hours = cHour + 24 - mHour;
        if(mDay == 28 && mMonth == 2){
        	mDay = 1;
        }
        else if(mDay == 31 && mMonth == 8){
        	mDay = 1;
        }
        else if(mDay == 30 && (mMonth%2 == 0)){
        	mDay = 1;
        }
        else if(mDay == 31 && (mMonth%2) != 0){
        	mDay = 1;
        }
        else if(mDay < 30){
        	mDay++;
        }
    }
    computeDays();
}

function computeDays(){
	if(cDay >= mDay){
    	days = cDay - mDay;
    }
    else if(cDay < mDay){
    	if(mMonth == 2){
        	days = cDay + 28 - mDay;
        }
        else if(mMonth == 8){
        	days = cDay + 31 - mDay;
        }
        else if(mMonth%2 == 0){
        	days = cDay + 30 - mDay;
        }
        else if(mMonth%2 != 0){
        	days = cDay + 31 - mDay;
        }
        if(mMonth < 12){
        	mMonth++;
        }
        else if(mMonth == 12){
        	mMonth = 1;
        }
    }
    computeMonths();
}

function computeMonths(){
	if(cMonth >= mMonth){
    	months = cMonth - mMonth;
    }
    else if(cMonth < mMonth){
    	months = cMonth + 12 - mMonth;
    }
}

function computeStaticOffset(){
	var x1 = new XMLHttpRequest();
    x1.open('GET',"https://thingspeak.com/channels/641670/field/1/last",true);
    x1.send();
    x1.onreadystatechange = function(){
    	if(x1.readyState == 4 && x1.status == 200){
        	staticOffset = x1.responseText;
            staticOffset = staticOffset.split("a");
            staticOffMonth = staticOffset[0];
            staticOffDay = staticOffset[1];
            staticOffHour = staticOffset[2];
            staticOffMinute = staticOffset[3];
        }
    }
}


function computeDynamicOffset(){
	var s1 = new XMLHttpRequest();
    s1.open('GET',"https://thingspeak.com/channels/641670/field/2/last",true);
    s1.send();
    s1.onreadystatechange = function(){
    	if(x1.readyState == 4 && x1.status == 200){
        	dynamicOffset = x1.responseText;
            dynamicOffset = dynamicOffset.split("a");
            dynamicOffsetMonth = dynamicOffset[0];
            dynamicOffsetDay = dynamicOffset[1];
            dynamicOffsetHour = dynamicOffset[2];
            dynamicOffsetMinute = dynamicOffset[3];
            //alert(dynamicOffsetMinute);
            var s2 = new XMLHttpRequest();
            s2.open('GET',"https://thingspeak.com/update?api_key=YJC84SZZQBQNJWAU&field1=" + dynamicOffset + "",true);
            s2.send();
        }
    }
}
function displayOn(){
	if(parseInt(minutes) + parseInt(staticOffMinute) > 59){
    	minutes = parseInt(minutes) + parseInt(staticOffsetMinute) - 60;
        hours++;
    }
    if(parseInt(hours) + parseInt(staticOffHour) > 23){
    	hours = parseInt(hours) + parseInt(staticOffHour) - 24;
        days++;
    }
    if(parseInt(days) + parseInt(staticOffDay) > 29){
    	days = parseInt(days) + parseInt(staticOffDay) - 30;
        months++;
    }
    var x2 = new XMLHttpRequest();
    x2.open('GET',"https://thingspeak.com/update?api_key=YJC84SZZQBQNJWAU&field2=" + months + "a" +
    				days + "a" + hours + "a" + minutes + "",true);
    x2.send();
    document.getElementById("timer").innerHTML = months + " Months " + days + " Days " 
     + hours + " Hours " + minutes + "Minutes";
	/*var onjson = {start_date : sDate,
		      start_time : sTime,
		      months : months,
		      days : days,
		      hours : hours,
		      minutes : minutes};
	document.getElementById("json").innerHTML = JSON.stringify(onjson);*/
    
}

function displayOff(){
  document.getElementById("timer").innerHTML = dynamicOffsetMonth + " Months " + dynamicOffsetDay + " Days " 
      + dynamicOffsetHour + " Hours " + dynamicOffsetMinute + "Minutes";
	/*var offjson = {start_date : sDate,
		      start_time : sTime,
		      months : dynamicOffsetMonth,
		      days : dynamicOffsetDay,
		      hours : dynamicOffsetHour,
		      minutes : dynamicOffsetMinute};
	document.getElementById("json").innerHTML = JSON.stringify(offjson);*/
}
  
function reset(){
  var r1 = new XMLHttpRequest();
  r1.open('GET',"https://thingspeak.com/update?api_key=YJC84SZZQBQNJWAU&field1=0a0a0a0",true);
  r1.send();
  var r2 = new XMLHttpRequest();
  r2.open('GET',"https://thingspeak.com/update?api_key=4GQF2VWSAXPNQQF1&field1=1&field2=1",true);
  r2.send();
  r2.onreadystatechange = function(){
    if(r2.readyState == 4 && r2.status == 200){
      alert("Reset Successful");
    }
  }  
}
