const APP=(()=>{
let doc=window.document;
let currentYearGl=new Date().getFullYear();
/*
let nextYearBT=doc.querySelector('.nextYear');
let prevYearBT=doc.querySelector('.prevYear');
nextYearBT.setAttribute('disabled',false);
prevYearBT.setAttribute('disabled',false);
*/

/*
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import CalendarListComponenet from './CalendarListComponenet.vue';
*/
// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '61736859691-5fmjquh8ud2skc1gvgfqogjb43ueh44a.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAK8SHAt3jUwMrywv55SaRf8JRHOhwABR0';
// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let shiftConfig={
  2022:{
    A:6,
    B:27,
    C:20,
    D:13,
    color:"#fff",
    ramadan:{
      startDate:"04/02/2022",
      endDate:"04/30/2022"
    },
    holiday:[
      "01/09/2022 L",
      "03/13/2022 L",
      "05/01/2022 H",
      "05/02/2022 H",
      "05/03/2022 H",
      "05/04/2022 H",
      "07/08/2022 H",
      "07/09/2022 H",
      "07/10/2022 H",
      "07/11/2022 H",
      "07/12/2022 R",
      "07/13/2022 R",
      "09/22/2022 R",
      "09/23/2022 N",
      "11/13/2022 L",
    ],
    schoolHoliday:[]

  },
  2023:{
    A:7,
    B:28,
    C:21,
    D:14,
    color:"#fff",
    ramadan:{
      startDate:"03/23/2023",
      endDate:"04/20/2023"
    },
    holiday:[
      "01/15/2023 L",
      "02/22/2023 N",
      "02/23/2023 R",
      "04/21/2023 H",
      "04/22/2023 H",
      "04/23/2023 H",
      "04/24/2023 H",
      "04/25/2023 R",
      "04/26/2023 R",
      "06/27/2023 H",
      "06/28/2023 H",
      "06/29/2023 H",
      "07/02/2023 R",
      "09/23/2023 N",
      "09/24/2023 R",
    ],
    schoolHoliday:[]
  },
  2024:{
    A:8,
    B:29,
    C:22,
    D:15,
    color:"#fff",
    ramadan:{
      startDate:"03/11/2024",
      endDate:"04/08/2024"
    },
    holiday:[
      "01/07/2024 H",
      "02/22/2024 N",
      "04/09/2024 H",
      "04/10/2024 H",
      "04/11/2024 H",
      "04/12/2024 H",
      "04/14/2024 R",
      "06/15/2024 H",
      "06/16/2024 H",
      "06/17/2024 H",
      "06/18/2024 H",
      "06/19/2024 R",
      "09/22/2024 H",
      "09/23/2024 N",
      "11/17/2024 H",
    ],
    schoolHoliday:[]
  },
  2025:{
    A:10,
    B:31,
    C:24,
    D:17,
    color:"#fff",
    ramadan:{
      startDate:"",
      endDate:""
    },
    holiday:[],
    schoolHoliday:[]

  },
  
}




let tokenClient;
let gapiInited = false;
let gisInited = false;



document.getElementById('signout_button').style.display = 'none';
document.getElementById('exportTo').style.display = 'none';
document.getElementById('shiftType').style.display = 'none';


/**
 * Callback after api.js is loaded.
 */

let gapiLoaded = function () {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
let  gisLoaded=function() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

function handleExportButton(){
  let shiftType=document.querySelector('#shiftType').value;
  document.querySelector('#shiftType').addEventListener("change",function(el){
    shiftType=el.target.value;
  });
  document.querySelector('#exportTo').addEventListener("click",function(){
  if(shiftType.length > 0){
  
    let check=confirm("Do you want to export records to Google Calendar?");
    if(check){
      exportToGoogleCalendar(shiftType);
    }
    }else{
    alert("please select your shift");
    }
  });
}
/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.display='block';
    doc.querySelector('.progress').style.display='none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.display = 'block';
    document.getElementById('exportTo').style.display = 'block';
    document.getElementById('shiftType').style.display = 'block';
    document.getElementById('authorize_button').style.display = 'none';

    handleExportButton();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.display = 'none';
  }
}

let gapi_token_localstorage=function(){
  let current_token=gapi.client.getToken();
  let fields=JSON.stringify(current_token);
  let token_expire_in=addSeconds(current_token.expires_in);
  localStorage.setItem("token",fields);
  localStorage.setItem('token_expire',token_expire_in);
}

let addSeconds=function(seconds){
  let curr=new Date();
  curr.setSeconds(curr.getSeconds() + parseInt(seconds));
  let curr_seconds2=new Date(curr);
  return curr_seconds2.getTime();
}

let check_token=function(){
  let token_obj=JSON.parse(localStorage.getItem('token_expire'));
  let curr_date_time=new Date().getTime();
  let token_expiry=new Date(token_obj.expire_in).getTime();
  if(curr_date_time > token_expiry){
    return false;
  }

  return true;
}
async function insertEvent(){
  const event1 ={
    'summary': 'Google I/O 2022',
    "colorId":'2',
    'start': {'date': '2023-12-22'},
    'end': {'date': '2023-12-22'}
  };

  const event2 ={
    'summary': 'Google I/O 2023',
    "colorId":'4',
    'start': {'date': '2023-12-24'},
    'end': {'date': '2023-12-24'}
  };

  
  const calendar_name="Shift Schedule";
  let calendar_id='';
  const calendar_name_obj={
      "resource": {
        "summary": calendar_name
      }
    }

  const calendars_list= await gapi.client.calendar.calendarList.list({});
  let isFound=false;

  calendars_list.result.items.forEach((el)=>{
    let {summary,id}=el;
      if(summary == calendar_name){
        isFound=true;
        calendar_id=id;
      }
  });
  let added_calendar_id='';

  if(isFound){
    const delete_calendar= await gapi.client.calendar.calendars.delete({
        "calendarId": calendar_id
    });
    const add_calendar = await gapi.client.calendar.calendars.insert(calendar_name_obj);
    added_calendar_id=add_calendar.result.id
  }
  if(!isFound){
  const add_calendar = await gapi.client.calendar.calendars.insert(calendar_name_obj);
  added_calendar_id=add_calendar.result.id
  }


  const request = await gapi.client.calendar.events.insert({
    'calendarId': added_calendar_id,
    'resource': event1
  });

  const request1 = await gapi.client.calendar.events.insert({
    'calendarId': added_calendar_id,
    'resource': event2
  });
}






let AIndex,BIndex,CIndex,DIndex=0;
let ramadanDays=[];
let holidays=[];
let sholidays=[];
let holidaysWithClasses=[];
let sHolidaysWithClasses=[];
let finalNotesData={};
let selectedDayNote='';
let schedulePattern=[2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0,
                     2,2,2,2,2,2,2,0,0,1,1,1,1,1,1,1,0,0,3,3,3,3,3,3,3,0,0,0                               
                     ];
let yearsSelection=()=>{
  let selectionDiv=doc.querySelector('.year-selection');
  let years=Object.keys(shiftConfig);
  let tempOption=`<div class='row'>
        <div class='col-sm-12 col-lg-4 col-md-4 m-auto'>
        <h3 class='text-center'>Which year would you like to show ?</h3>
        <select class='form-select form-select-lg col-3' id='year-selection'>`;
    years.forEach((el)=>{
      if(currentYearGl == el){
        tempOption +=`<option value='${el}' selected>${el}</option>`;
      }else{
        tempOption +=`<option value='${el}'>${el}</option>`;

      }
      
    });
      tempOption +="</select></div></div>";
      selectionDiv.innerHTML=tempOption;
      let selectedYear=doc.querySelector('#year-selection');
          selectedYear.addEventListener('change',(el)=>{
            let selectedValue=el.target.value;
            currentYearGl=selectedValue;
            generateFullYearCalendar(selectedValue,"row");
          });
}               
let days = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
//let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
let months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let generateLayout=(d)=>{
  let template="<table class='table table-bordered text-center'>";
  d.forEach((el) => {
    template +=`<thead class="table-dark">
      <tr>
      <th colspan="2"></th>
      <th>Days</th>`;
    el.monthDays.forEach((el1)=>{
      template +=`<th class="${el1.class}">${el1.weekDayH}</th>`;
    });
    template +=`
     </tr></thead><tbody>
      <tr class='table-dark'>
      <td rowspan="5" class="fs-3 align-middle"> <span class='rotate-text'> ${el.month} </span></td>
      <td rowspan="5" class="fs-3  align-middle"> <span class='rotate-text'> Groups </span></td>
      <td >#</td>
      `
      el.monthDays.forEach((el1)=>{
        template +=`<td class="${el1.class}">${el1.weekDayN}</td>`;
      });
      template +=`</tr><tr><td class="shift-A">A</td>`;
      el.A.forEach((el1)=>{template +=`<td class='${el1.class}'>${el1.shiftT}</td>`;});
      template +=`</tr><tr><td class="shift-B">B</td>`;
      el.B.forEach((el1)=>{template +=`<td class='${el1.class}'>${el1.shiftT}</td>`;});
      template +=`</tr><tr><td class="shift-C">C</td>`;
      el.C.forEach((el1)=>{template +=`<td class='${el1.class}'>${el1.shiftT}</td>`;});
      template +=`</tr><tr><td class="shift-D">D</td>`;
      el.D.forEach((el1)=>{template +=`<td class='${el1.class}'>${el1.shiftT}</td>`;});
      template +=`</tr>`;
  });
  template +=`</tbody></table>`;
doc.querySelector('.generated-result').innerHTML=template;
}
let generateTemplate = function() {
  let count = 1;
  let temp = '';
  let days = sliceDate().monthDays;
  let firstDay = sliceDate().firstDay + 1;
  temp += `
      <table class='calendar-month'>
       <tr  class='calendar-month-header'>
        <th colspan='7'>
        ${months[sliceDate().month]}
        </th>
        </tr>
       <tr class='calendar-month-days-header'>
        <td class='calendar-month-day-header'>Sun</td>
        <td class='calendar-month-day-header'>Mon</td>
        <td class='calendar-month-day-header'>Tue</td>
        <td class='calendar-month-day-header'>Wed</td>
        <td class='calendar-month-day-header'>Thr</td>
        <td class='calendar-month-day-header'>Fri</td>
        <td class='calendar-month-day-header'>Sat</td>
       </tr>
      `;
  for (let i = 1; i <= days; i++) {
    if (count == 1) {
      if (i == 1) {
        if (firstDay > 0) {
          temp += `<tr class='calendar-month-days'>`;
          for (let i = 0; i < firstDay; i++) {
            if (i == firstDay - 1) {
              temp += `
                             <td class='day'>1</td>
                             `;
            } else {
              temp += `
                             <td class='day'></td>
                             `;
            }

          }
          count = firstDay;
        } else {
          temp += `
             <tr class='calendar-month-days'>
            <td class='day'>${i}</td>
        `;
        }
      } else {
        temp += `
             <tr class='calendar-month-days'>
            <td class='day'>${i}</td>
        `;
      }

      count++;
    } else if (count == 7) {
      count = 1;
      temp += `
            <td class='day'>${i}</td>
            </tr>
             `;
    } else {
      temp += `
            <td class='day'>${i}</td>
        `;
      count++;
    }
  }
  temp += `
      </table>
      `;
  return temp;
}

let generateTemplateTable = function(date) {
  let count = 1;
  let temp = '';
  let days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()+1;
  temp += `
      <table class='calendar-month'>
       <tr  class='calendar-month-header'>
        <th colspan='7'>
        ${months[date.getMonth()]}
        </th>
        </tr>
       <tr class='calendar-month-days-header'>
        <td class='calendar-month-day-header'>Sun</td>
        <td class='calendar-month-day-header'>Mon</td>
        <td class='calendar-month-day-header'>Tue</td>
        <td class='calendar-month-day-header'>Wed</td>
        <td class='calendar-month-day-header'>Thr</td>
        <td class='calendar-month-day-header'>Fri</td>
        <td class='calendar-month-day-header'>Sat</td>
       </tr>
      `;
  for (let i = 1; i <= days; i++) {
    let dateTimeValue = new Date(date.getFullYear(), date.getMonth(), i).getTime();
    let classValue='';
    if(ramadanDays.indexOf(dateTimeValue) !=-1){
      classValue='ramadan';
    }else if(holidays.indexOf(dateTimeValue) !=-1){
      let valueIndex=holidays.indexOf(dateTimeValue);
      classValue=holidaysWithClasses[valueIndex].split(" ")[1] != undefined ? holidaysWithClasses[valueIndex].split(" ")[1]:"holiday";
    }else{
      classValue='';
    }
    if (count == 1) {
      if (i == 1) {
        if (firstDay > 0) {
          temp += `<tr class='calendar-month-days'>`;
          for (let i = 0; i < firstDay; i++) {
            if (i == firstDay - 1) {
              temp += `
                             <td class='day ${classValue}' data-date='${dateTimeValue}'>1</td>
                             `;
            } else {
              temp += `
                             <td class='day'></td>
                             `;
            }
          }
          if(firstDay-1 == 6){
              temp += `
                             </tr>
                             `;
            count=0;
          }else{
        count = firstDay;
          }
          
        } else {
          temp += `
             <tr class='calendar-month-days'>
            <td class='day ${classValue}' data-date='${dateTimeValue}'>${i}</td>
        `;
        }
      } else {
        temp += `
             <tr class='calendar-month-days'>
            <td class='day ${classValue}' data-date='${dateTimeValue}'>${i}</td>
        `;
      }
      count++;
    } else if (count == 7) {
      count = 1;
      temp += `
            <td class='day ${classValue}' data-date='${dateTimeValue}'>${i}</td>
            </tr>
             `;
    } else {
      temp += `
            <td class='day ${classValue}' data-date='${dateTimeValue}'>${i}</td>
        `;
      count++;
    }
  }
  temp += `
      </table>
      `;
  return temp;
}

let generatePerShift=function(shiftLetter,days,index){
  let temp1='';
  let temp2='';
  let shiftValues=[];
        for(let i=1;i<=days;i++){
          let dayClass='';
          let value=schedulePattern[index] == 1 ? "M" : schedulePattern[index] == 2 ? "E" : schedulePattern[index] == 3 ? "N":"OFF";
          shiftValues.push({
            shiftT:value,
            shiftL:shiftLetter,
            day:days[i],
            class:value == "OFF" ? "day-off-"+shiftLetter:"day-"+shiftLetter
          });
          temp2 +=`
          ${value == "OFF" ? "<td class='day-off-"+shiftLetter+"'>"+value:"<td class='day-"+shiftLetter+"'>"+value}</td>
            `;
            index = index + 1;
        }

        if(shiftLetter == "A"){
         AIndex=index;
        }else if(shiftLetter == "B"){
         BIndex=index;
        }else if(shiftLetter == "C"){
           CIndex=index;
        }else if(shiftLetter == "D"){
           DIndex=index;
        }

              temp1 +=`
          <tr  class='calendar-month-days'>
           <td class="shift-${shiftLetter}">${shiftLetter}</td>
            ${temp2}
          </tr>
          `;
          return shiftValues;
}

let getDatesBetweenTwoDates=function(startDate,endDate){
  let stDate=new Date(startDate).getTime();
  let enDate=new Date(endDate).getTime();
  let incrementByOneDay=24 * 60 * 60 * 1000;
  let selectedDates=[];
  while(stDate <= enDate){
    selectedDates.push({
      date:new Date(stDate),
      dateTime:stDate
    });
    stDate = stDate+incrementByOneDay;
  }
  return selectedDates;
}
let generateTemplateRow = function(date) {
  let weekDays=["SUN","MON","TUE","WED","THR","FRI","SAT"];
  let temp = '';
  let weekDaysHeader='';
  let weekDaysNumber='';
  let days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()+1;
  let month={};
  let monthDays=[];
  temp += `
      <div class='membersContainer'></div>
        `;
 for(let i=1;i<=days;i++){
          let dayClass='';
          let sDayClass='';
          let hasNote=false;
          let weekDay=weekDays[new Date(date.getFullYear(),date.getMonth(),i).getDay()];
          let selectedDay=new Date(date.getFullYear(),date.getMonth(),i);
            if(ramadanDays.indexOf(selectedDay.getTime()) !=-1){
               dayClass='ramadan';
            }else if(holidays.indexOf(selectedDay.getTime()) !=-1){
              let valueIndex=holidays.indexOf(selectedDay.getTime());
              let holidayClass=holidaysWithClasses[valueIndex].split(" ")[1] != undefined ? holidaysWithClasses[valueIndex].split(" ")[1]:"holiday";
              dayClass=holidaysWithClasses[valueIndex].split(" ")[1] != undefined ? holidaysWithClasses[valueIndex].split(" ")[1]:"holiday";
            }
            if(sholidays.indexOf(selectedDay.getTime()) !=-1){
              let valueIndex=sholidays.indexOf(selectedDay.getTime());
              sDayClass=sHolidaysWithClasses[valueIndex].split(" ")[1] != undefined ? sHolidaysWithClasses[valueIndex].split(" ")[1]:"holiday";
            }
             if(finalNotesData[selectedDay.getTime()] != undefined){
                hasNote=true;
                dayClass +=' note';
              }else{
                 hasNote=false;
              }
              
            monthDays.push({
              weekDayH:weekDay,
              weekDayN:selectedDay.getDate(),
              class:dayClass +" " + sDayClass,
              hasNote:hasNote,
              date:selectedDay.toLocaleDateString(),
              dateTime:selectedDay.getTime()
            });
 }
    month['year']=new Date(date).getFullYear();
     month["totalDays"]=days;
     month["month"]=months[date.getMonth()];
     month["monthDays"]=monthDays;
     month['A']=generatePerShift("A",days,AIndex);
     month['B']=generatePerShift("B",days,BIndex);
     month['C']=generatePerShift("C",days,CIndex);
     month['D']=generatePerShift("D",days,DIndex);

  return month;
}

let sliceDate = function() {
  let cur = new Date();
  return {
    month: cur.getMonth(),
    year: cur.getFullYear(),
    day: cur.getDate(),
    monthDays: new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate(),
    firstDay: new Date(cur.getFullYear(), cur.getMonth(), 1).getDay()
  }
}

let convertDate = function(d) {
  let cur = new Date(d);
  return `${cur.getFullYear()}-${cur.getMonth() + 1}-${cur.getDate()}`
}
function dumpCSSText(element){
  var s = '';
  var o = getComputedStyle(element);
  for(var i = 0; i < o.length; i++){
    s+=o[i] + ':' + o.getPropertyValue(o[i])+';';
  }
  return s;
}
let printDocument=function(dept,div,year){
  let selectDiv=document.querySelector('.calendar-container');
  //selectDiv.style.margin='-30px';
html2canvas(document.querySelector('.calendar-container'))
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg');
        const pdf = new jsPDF({
        orientation: 'p', // landscape
        unit: 'pt', // points, pixels won't work properly
        format: [3220, 1930] // set needed dimensions for any element
  });
        pdf.addImage(imgData, 'jpeg', 0, 0, canvas.width, canvas.height);
        pdf.save('download.pdf');
       // selectDiv.style.margin='';
      });


 


  
      /*
var doc = new jsPDF('p','mm','a4');
var width = doc.internal.pageSize.getWidth();
var height = doc.internal.pageSize.getHeight();
var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJ......';

doc.addImage(imgData, 'JPEG', 0, 0, width, height);
doc.html(document.querySelector('.calendar-container'), {
   callback: function (doc) {
     doc.save('test.pdf');
   },
   margin: [60, 60, 60, 60],
    x: 32,
    y: 32,
});

  let el=document.querySelector('.calendar-container');
   let printWindow = window.open('', '', 'height=1000,width=1600'); 
      printWindow.document.write(`
        <html>
        <head>
<style>
.calendar-month-day-header {
    background: gray;
    color: white;
}
table {
    border-collapse: collapse;
}
table td{
    border:1px solid black;
}
.categories span {
    padding: 10px;
    display: block;
    margin: 0px 16px;
}
.categories {
    display: flex;
    justify-content: center;
    margin-top:10px;
}
tr.calendar-month-days-header td {
    background: lightblue;
    padding: 5px;
}

.shift-A,.day-off-A{
  background: #00768B !important;
  color: white;
}
.shift-B,.day-off-B{
  background: #1EA0A5 !important;
  color: white;
}
.shift-C,.day-off-C{
  background: #004C48 !important;
  color: white;
}
.shift-D,.day-off-D{
  background: #B44237 !important;
  color: white;
}

tr.calendar-month-days td {
    text-align: center;
    font-size: 15px;
}

.year-selection {
    text-align: center;
}

.year-selection button {
    border: none;
    padding: 2px 20px;
    font-size: 25px;
    background: lightblue;
    color: white;
}

.year-selection button:hover {
  cursor: pointer;
    background: lightseagreen;
}

.year-selection span {
    font-size: 25px;
    color: lightblue;
}
.R{
  background: #FDB121 !important;
  color:white  !important;
}
.H{
  background: #00DFFF !important;
  color:white  !important;
}
.N{
  background: #993299 !important;
  color:white  !important;
}
.L{
  background: #407294 !important;
  color:white  !important;
}
.ramadan{
  background: #20B2AA !important;
  color:white  !important;
}
.full-calendar {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
}

table.calendar-month {
    margin: 0px;
        width: 100%;
}

tr.calendar-month-header th {
    font-size: 25px;
    background: lightskyblue;
    color: white;
    width: 100px;
    text-align: center;
}
.calendar-header{
  text-align:center;
}
</style>
        <body>
        <div class='calendar-header'>
        <h1>Shift Schedule</h1>
         <h1> ${year}</h1>
        </div>
          ${el.outerHTML}
        </body>
        </head>
        </html>
      `);

      printWindow.print();
 */
}
let loopThroughMonths=function(year,layout){
     let finalData=[];
      let temp=`<div class='full-calendar'>`;
  if(layout == 'table'){
   for(let i=0;i<12;i++){
        let starDate=new Date(year,i,1);
        temp += generateTemplateTable(starDate);
         finalData.push(temp);
    }
  }else if(layout == 'row'){
       let config=shiftConfig[year];
       AIndex=config.A;
       BIndex=config.B;
       CIndex=config.C;
       DIndex=config.D;
       for(let i=0;i<12;i++){
        let starDate=new Date(year,i,1);
        finalData.push(generateTemplateRow(starDate));
    }

  }
    return finalData;
}

let organizeDataForGoogleCalendar=function(year,selectedShift){
     let tempData=[];
     let finalData=[];
      let config=shiftConfig[year];
       AIndex=config.A;
       BIndex=config.B;
       CIndex=config.C;
       DIndex=config.D;
       for(let i=0;i<12;i++){
        let starDate=new Date(year,i,1);
        tempData.push(generateTemplateRow(starDate));
       }

       
    return finalData;
}
let notesTracker=function(status){
  setTimeout(function(){
 let elements=document.querySelectorAll('.js-note');
      Array.prototype.slice.call(elements).forEach(function(el){
        el.addEventListener('click',function(e){
            let target=e.target.getAttribute('data-date');
            selectedDayNote=target;
            status=true;
        });
      });
  },1000);
}

let prepareCalendarDataForGoogle=function(year,layout,selectedShift){
  let dates = obj.getItems('test').map(function(el){
    return new Date(el.date).getTime()
  }).sort();
  dates.forEach(function(date){
    let values=[];
  obj.getItems('test').forEach(function(em){
    if(new Date(em.date).getTime() == date){
      values.push(em);
    }
    });
    finalNotesData[date]=values;
  });
  ramadanDaysObj=getDatesBetweenTwoDates(shiftConfig[year].ramadan.startDate,shiftConfig[year].ramadan.endDate);
  ramadanDays=ramadanDaysObj.map(function(el){
      return el.dateTime;
  });
  holidaysWithClasses=shiftConfig[year].holiday;
  holidays=shiftConfig[year].holiday.map(function(el){
      return new Date(el.split(" ")[0]).getTime();
  });

  sHolidaysWithClasses=shiftConfig[year].schoolHoliday;
  sholidays=shiftConfig[year].schoolHoliday.map(function(el){
      return new Date(el.split(" ")[0]).getTime();
  });
  let months= loopThroughMonths(year,layout);
  let finalData1=[];
  months.forEach((m)=>{
    let finalData2=[];
    for(let i=0;i<m.monthDays.length;i++){
      let tempClass='';
      if(m.monthDays[i].class.trim() == "H"){
        tempClass="Holiday";
      }else if(m.monthDays[i].class.trim() == "L"){
        tempClass="Long weekend";
      }else if(m.monthDays[i].class.trim() == "N"){
        tempClass="National Day";
      }else if(m.monthDays[i].class.trim() == "R"){
        tempClass ="Rescheduled Day";
      }else if(m.monthDays[i].class.trim() == "ramadan"){
        tempClass ="Ramadan";
      }else if(m.monthDays[i].class.trim() == "ramadan"){
        tempClass ="Ramadan";
      }
      
      let tempType="";

      if(m[selectedShift][i].shiftT == "M"){
        tempType="Morning";
      }else if(m[selectedShift][i].shiftT == "E"){
        tempType="Evening";
      }else if(m[selectedShift][i].shiftT == "N"){
        tempType="Night";
      }else if(m[selectedShift][i].shiftT == "OFF"){
        tempType="DAY-OFF";
      }
        finalData2.push(
        {
          class:m.monthDays[i].class,
          date:convertDate(m.monthDays[i].date),
          weekDayH:m.monthDays[i].weekDayH,
          weekDayN:m.monthDays[i].weekDayN,
          shiftT:m[selectedShift][i].shiftT,
          shiftType:tempType,
          shiftL:m[selectedShift][i].shiftL,
          classAction:`${tempClass !='' ? tempClass +"**"+ tempType:tempType}`,
        }
      )
    }
    finalData1.push(
      {
        month:m.month,
        monthDays:m.monthDays,
        shiftLetter:selectedShift,
        shiftData:m[selectedShift],
        allData:finalData2
      }
    )
  });

  let googleCalendarData=[];

  finalData1.forEach((el)=>{
    el.allData.forEach((element)=>{
      googleCalendarData.push({
        summary:element.classAction,
        colorId:element.shiftT.trim() == "OFF" ? 10 : element.shiftT.trim() == "M" ? 7 : element.shiftT.trim() == "E" ? 5 : 1,
        start:{date: element.date},
        end:{date: element.date},
    })
    });
  });

return googleCalendarData;
}
let prepareCalendarData=function(year,layout){
  let dates = obj.getItems('test').map(function(el){
        return new Date(el.date).getTime()
      }).sort();
      dates.forEach(function(date){
        let values=[];
      obj.getItems('test').forEach(function(em){
        if(new Date(em.date).getTime() == date){
          values.push(em);
        }
        });
        finalNotesData[date]=values;
      });
      ramadanDaysObj=getDatesBetweenTwoDates(shiftConfig[year].ramadan.startDate,shiftConfig[year].ramadan.endDate);
      ramadanDays=ramadanDaysObj.map(function(el){
          return el.dateTime;
      });
      holidaysWithClasses=shiftConfig[year].holiday;
      holidays=shiftConfig[year].holiday.map(function(el){
          return new Date(el.split(" ")[0]).getTime();
      });

      sHolidaysWithClasses=shiftConfig[year].schoolHoliday;
      sholidays=shiftConfig[year].schoolHoliday.map(function(el){
          return new Date(el.split(" ")[0]).getTime();
      });
      return loopThroughMonths(year,layout);
}

let generateFullYearCalendar=function(year,layout){
  //currYear.innerHTML=year;
  let result=prepareCalendarData(year,layout);
  generateLayout(result);
}

let nextPrevButton=(prev,next,status)=>{
  
  let nextYearBT=doc.querySelector('.nextYear');
  let prevYearBT=doc.querySelector('.prevYear');
  $(nextYearBT).unbind('click').click(function() {
    if(status){
    generateFullYearCalendar(next,"row")
  }
});

$(prevYearBT).unbind('click').click(function() {
  if(status){
    generateFullYearCalendar(prev,"row")
  }
});

}
let checkNextYear=(year)=>{
  let isFound=true;
  let currentYear=year;
  let years=Object.keys(shiftConfig)
  let first=parseInt(years[0]);
  let last=parseInt(years[years.length-1]);
  let nextYearBT=doc.querySelector('.nextYear');
  let prevYearBT=doc.querySelector('.prevYear');
  console.log(shiftConfig[currentYear])
      if(shiftConfig[currentYear] == undefined){
        isFound=false;
        nextYearBT.classList.add('hidden'); 
        prevYearBT.classList.add('hidden'); 
      }else if(currYear > first && currentYear < last){
        nextYearBT.classList.remove('hidden'); 
        prevYearBT.classList.remove('hidden'); 
      }else if(currYear == first){
        prevYearBT.classList.add('hidden'); 
        nextYearBT.classList.remove('hidden'); 
      }else if(currYear == last){
        prevYearBT.classList.remove('hidden'); 
        nextYearBT.classList.add('hidden'); 
      } 

      prevYearValue=currentYear - 1;
      nextYearValue=currentYear + 1;
      nextPrevButton(prevYearValue,nextYearValue,isFound);

}


/* default {
  components:{
    CalendarListComponenet
  },
  props: {
    msg: String
  },
  data() {
    return {
      currentYear: sliceDate().year,
      currentMonth: months[sliceDate().month],
      currentDay: sliceDate().day,
      monthDays: sliceDate().monthDays,
      nextYearValue:sliceDate().year + 1,
      prevYearValue:sliceDate().year -1,
      prevYearIsDisabled:true,
      nextYearIsDisabled:false,
      layout:"row",
      result:generateFullYearCalendar(new Date().getFullYear(),'row'),
      ramadanDaysObj:[],
      dept:"Department Name",
      div:"Division Name",
      notes:finalNotesData,
      selectedNoteDay:selectedDayNote,
      showNotes:false,
    }
  },
  methods: {
    onSignIn:function(user) {
      const profile = user.getBasicProfile()
      console.log(profile)
    },
    refresh:function(){
      result=generateFullYearCalendar(new Date().getFullYear(),'row');
    },
    insertEvents:function(data){
      const calendar_name="Shift Schedule";
        let calendar_id='';
        const calendar_name_obj={
            "resource": {
              "summary": calendar_name
            }
          }

        const calendars_list=  api.client.calendar.calendarList.list({});
        let isFound=false;

        calendars_list.result.items.forEach((el)=>{
          let {summary,id}=el;
            if(summary == calendar_name){
              isFound=true;
              calendar_id=id;
            }
        });
        let added_calendar_id='';

        if(isFound){
          const delete_calendar= api.client.calendar.calendars.delete({
              "calendarId": calendar_id
          });
          const add_calendar = api.client.calendar.calendars.insert(calendar_name_obj);
          added_calendar_id=add_calendar.result.id
        }
        if(!isFound){
        const add_calendar = api.client.calendar.calendars.insert(calendar_name_obj);
        added_calendar_id=add_calendar.result.id
        }

        data.forEach(async (event)=>{
          api.client.calendar.events.insert({
          'calendarId': added_calendar_id,
          'resource': event
        });
        });
    },
    reset:function(){
      AIndex,BIndex,CIndex,DIndex=0;
      ramadanDays=[];
      holidays=[];
      sholidays=[];
      holidaysWithClasses=[];
      sHolidaysWithClasses=[];
      finalNotesData={};
      selectedDayNote='';
    },
    justOneMonth: function() {
      return generateTemplate();
    },
    generateFullYearCalendar:function(year,layout){
      reset();
      let dates = obj.getItems('test').map(function(el){
        return new Date(new Date(el.date).toISOString().split('T')[0].replace(/-/g,',')).getTime()
      }).sort();
      dates.forEach(function(date){
        let values=[];
      obj.getItems('test').forEach(function(em){
        if(new Date(new Date(em.date).toISOString().split('T')[0].replace(/-/g,',')).getTime() == date){
          values.push(em);
        }
        });
        finalNotesData[date]=values;
      });
      ramadanDaysObj=getDatesBetweenTwoDates(shiftConfig[year].ramadan.startDate,shiftConfig[year].ramadan.endDate);
      ramadanDays=ramadanDaysObj.map(function(el){
          return el.dateTime;
      });
      holidaysWithClasses=shiftConfig[year].holiday;
      holidays=shiftConfig[year].holiday.map(function(el){
          return new Date(el.split(" ")[0]).getTime();
      });
      sHolidaysWithClasses=shiftConfig[year].schoolHoliday;
      sholidays=shiftConfig[year].schoolHoliday.map(function(el){
          return new Date(el.split(" ")[0]).getTime();
      });
      return loopThroughMonths(year,layout);
    },
    nextYear:function(){
      result=generateFullYearCalendar(nextYearValue,layout);
      currentYear = nextYearValue;
      prevYearValue=currentYear - 1;
      nextYearValue=currentYear + 1;
      prevYearIsDisabled=false;
      if(shiftConfig[nextYearValue] == undefined ){
        nextYearIsDisabled = true;
      }
      notesTracker(showNotes);
    },
        prevYear:function(){
      result=generateFullYearCalendar(prevYearValue,layout);
      currentYear = prevYearValue;
      prevYearValue=currentYear - 1;
      nextYearValue=currentYear + 1;
        if(shiftConfig[nextYearValue] != undefined ){
                nextYearIsDisabled = false;
              }
      if(prevYearValue < sliceDate().year){
        prevYearIsDisabled=true;
        nextYearIsDisabled = false;
      }
      notesTracker(showNotes);
    },
    tableLayout:function(){
      result=generateFullYearCalendar(currentYear,'table');
      layout='table';
    },
    rowsLayout:function(){
      if(shiftConfig[currentYear] !=undefined){
      result=generateFullYearCalendar(currentYear,'row');
       layout='row';
      notesTracker(showNotes);
      }else{
        alert("Something is not configured correctly")
      }
    },
    showMeAlert:function(){
      result=generateFullYearCalendar(currentYear,"table");
    },
    printWindow:function(){
      let d=result;
      let letters=["A","B","C","D"];
      let finalDataToPrint=[];
      for(var i=0;i < d.length;i++){
        let mainArr=[];
        let days=[];
        let daysN=[];
        days.push({text:'',colSpan:2,style:"header1"},{},{text:"Days",style:"header1"});
        daysN.push({text:d[i].month,rowSpan:5,style:"header"},{text:"Groups",rowSpan:5,style:"header"},{text:"#",style:"header1"});
        for(var j=0;j < d[i].monthDays.length;j++){
          let tempStyle="header1";
          if(d[i].monthDays[j].class != " "){
              tempStyle=d[i].monthDays[j].class.replace(/-/g,'')
            }
             days.push(
               {
                 text: d[i].monthDays[j].weekDayH,
                 style: tempStyle.trim()
                 }
               );
             daysN.push(
               {
                 text: d[i].monthDays[j].weekDayN,
                 style: tempStyle.trim()
                 }
               );
        }
         mainArr.push(days);
         mainArr.push(daysN);
        for(var ii=0;ii<letters.length;ii++){
          let shift=[];
          shift.push({},{},{text:letters[ii],style:"shift"+letters[ii]});
          for(var jj=0;jj < d[i][letters[ii]].length;jj++){
             shift.push(
               {
                 text:d[i][letters[ii]][jj].shiftT,
                 style:d[i][letters[ii]][jj].class.replace(/-/g,'')
                 }
               );
          }
          mainArr.push(shift);
          }

  finalDataToPrint.push({
    margin:[-35,5],
    table:{
       headerRows: 6,
				 width: ['auto'],
				body: mainArr
    }
  });
      }

  finalDataToPrint.push({
    columns: [
        { width: '*', text: '' },
        {
            width: 'auto',
                table: {
                        body: [
                                [
                                {text:"Ramadan",style:"ramadan",margin:[5,5]},
                                {},
                                {text:"Rescheduled days off",style:"R",margin:[5,5]},
                                {},
                                {text:"National/Founding Day",style:"N",margin:[5,5]},
                                {},
                                {text:"Holidays",style:"H",margin:[5,5]},
                                {},
                                {text:"Weekends",style:"L",margin:[5,5]}
                                ],
                        ]
                },
                layout: 'noBorders'
        },
        { width: '*', text: '' },
    ]
});

  finalDataToPrint.push({
   table:{
       body:[
           [
              {text:'Developed by Jassem'} 
              ]
           ]
   },           
			layout: 'noBorders'
} );

      var dd = {
         info: {
	title: d[0].year + " Shift Schedule",
	author: 'https://jassemdeveloper.github.io/',
	subject: d[0].year + " Shift Schedule",
  },
       pageSize: {
        width:1165,
        height:'auto'
    },
      defaultStyle: {
    fontSize: 12,
    alignment:"center"
  },
  	   header:{
	       text:d[0].year + " Shift Schedule",
	       fontSize:30,
	       margin:[0,4],
	       bold:true,
	       alignment:"center"
	   },
    pageOrientation: 'portrait',
	content: finalDataToPrint,
  	styles: {
		    header:{
		        margin:[0,30],
		        color:"white",
		        fillColor:"#212529",
		    },
        header1:{
		        color:"white",
		        fillColor:"#212529",
		    },
		    R:{
  fillColor: "#FDB121",		        
  color:"white",
},
H:{
  fillColor: "#00DFFF",		        
  color:"white",
},
N:{
    fillColor: "#993299",		        
  color:"white",
},
L:{
    fillColor: "#407294",		        
  color:"white",
},
ramadan:{
    fillColor: "#20B2AA",		        
  color:"white",
},
shiftA:{
        fillColor: "#00768B",		        
  color:"white",
},
dayoffA:{
        fillColor: "#00768B",		        
  color:"white",
},
shiftB:{
        fillColor: "#1EA0A5",		        
  color:"white",
},
dayoffB:{
        fillColor: "#1EA0A5",		        
  color:"white",
},
shiftC:{
        fillColor: "#004C48",		        
  color:"white",
},
dayoffC:{
        fillColor: "#004C48",		        
  color:"white",
},
shiftD:{
        fillColor: "#B44237",		        
  color:"white",
},
dayoffD:{
        fillColor: "#B44237",		        
  color:"white",
}
		}
      }
     pdfMake.createPdf(dd).download(d[0].year + " Shift Schedule.pdf");
    },
    exportToGoogleCalendar:function(selectedShift){
      let data=result;
      let finalData=[];
      data.forEach((d)=>{
          d[selectedShift].forEach((element,index)=>{
              finalData.push({
                  summary:element.shiftT,
                  colorId:element.shiftT == "OFF" ? 10 : element.shiftT == "M" ? 2 : element.shiftT == "E" ? 7 : 5,
                  start:{date: d.monthDays[index].date},
                  end:{date: d.monthDays[index].date},
              })
          })
      });
      let foundData=exportToGoogleCalendar("A");
      insertEvents(foundData)
    },
    showMemebers:function(){
      //let groups1=['OMG','BPG','TCC','CDC'];
      let div=document.querySelector('.membersContainer');
      let shiftLetters=["A","B","C","D"];
      let shiftSuper=members.filter(function(m){
        if(m.role == "S"){
          return m;
        }
      });
      let groups=members.map(function(g){
        return g.group;
      }).filter(function(values,index,value){
        return value.indexOf(values) === index;
      }).filter(function(el){
        return el !=undefined;
      });
      let shiftData=[];
      shiftLetters.forEach(function(letter){
        let groupData={};
        let assingedShiftSuper='';
        groups.forEach(function(g){
          let tempArray=[];
          members.forEach(function(m){
            if(m.role == "S" && m.shift == letter && m.group == g){
              tempArray.push(m);
              assingedShiftSuper=m.name;
            }else if(m.role == "E" && m.shift == letter && m.group == g){
              tempArray.push(m);
            }
          });
          groupData['shiftSuper']=assingedShiftSuper;
          groupData[g]=tempArray;
        });
        shiftData.push({
          shift:letter,
          data:groupData
        });
      });
    
} */ 


let startProgress=function(total){
  let startProgressTrack=doc.querySelector('.progress-bar-track');
  let percent=1;
  for(let i=1;i <=total;i++){
    percent=Math.ceil(((i/total) * 100 ));
    if(percent <=100){
      startProgressTrack.style=`width:${percent}%`;
      startProgressTrack.innerHTML=`${percent}%`;
    }
  }
}

let updateProgressBar=function(count,total){
  let startProgressTrack=doc.querySelector('.progress-bar-track');
  let percent=Math.floor(((count/total) * 100 ));
    startProgressTrack.style=`width:${percent}%`;
    startProgressTrack.innerHTML=`${percent}%`;
}

async function insertEvents(shiftSchedule){
  doc.querySelector('.progress').style.display='block';
  const calendar_name="Shift Schedule";
  let calendar_id='';
  const calendar_name_obj={
      "resource": {
        "summary": calendar_name
      }
    }

  const calendars_list= await gapi.client.calendar.calendarList.list({});
  let isFound=false;

  calendars_list.result.items.forEach((el)=>{
    let {summary,id}=el;
      if(summary == calendar_name){
        isFound=true;
        calendar_id=id;
      }
  });
  let added_calendar_id='';

  if(isFound){
    const delete_calendar= await gapi.client.calendar.calendars.delete({
        "calendarId": calendar_id
    });
    const add_calendar = await gapi.client.calendar.calendars.insert(calendar_name_obj);
    added_calendar_id=add_calendar.result.id
  }
  if(!isFound){
  const add_calendar = await gapi.client.calendar.calendars.insert(calendar_name_obj);
  added_calendar_id=add_calendar.result.id
  }

  let delay=0;
  let count=1;
  doc.querySelector('.progress-title').style.display='none';
  shiftSchedule.forEach(async (event)=>{
    setTimeout(async ()=>{
      await gapi.client.calendar.events.insert({
        'calendarId': added_calendar_id,
        'resource': event
      });
      console.log(count);
      count +=1;
      updateProgressBar(count,shiftSchedule.length);
    },500+delay);
    delay +=200;
    
    /*
    await gapi.client.calendar.events.insert({
    'calendarId': added_calendar_id,
    'resource': event
  });
  */
  });

}


let generatePDFAction=function(){
  let el=doc.querySelector('#generatePDF');
  el.addEventListener('click',generatePDF);
}
let generatePDF=function(){
  let d=prepareCalendarData(currentYearGl,"row");;
  let letters=["A","B","C","D"];
  let finalDataToPrint=[];
  for(var i=0;i < d.length;i++){
    let mainArr=[];
    let days=[];
    let daysN=[];
    days.push({text:'',colSpan:2,style:"header1"},{},{text:"Days",style:"header1"});
    daysN.push({text:d[i].month,rowSpan:5,style:"header"},{text:"Groups",rowSpan:5,style:"header"},{text:"#",style:"header1"});
    for(var j=0;j < d[i].monthDays.length;j++){
      let tempStyle="header1";
      if(d[i].monthDays[j].class != " "){
          tempStyle=d[i].monthDays[j].class.replace(/-/g,'')
        }
         days.push(
           {
             text: d[i].monthDays[j].weekDayH,
             style: tempStyle.trim()
             }
           );
         daysN.push(
           {
             text: d[i].monthDays[j].weekDayN,
             style: tempStyle.trim()
             }
           );
    }
     mainArr.push(days);
     mainArr.push(daysN);
    for(var ii=0;ii<letters.length;ii++){
      let shift=[];
      shift.push({},{},{text:letters[ii],style:"shift"+letters[ii]});
      for(var jj=0;jj < d[i][letters[ii]].length;jj++){
         shift.push(
           {
             text:d[i][letters[ii]][jj].shiftT,
             style:d[i][letters[ii]][jj].class.replace(/-/g,'')
             }
           );
      }
      mainArr.push(shift);
      }

finalDataToPrint.push({
margin:[-35,5],
table:{
   headerRows: 6,
     width: ['auto'],
    body: mainArr
}
});
  }

finalDataToPrint.push({
columns: [
    { width: '*', text: '' },
    {
        width: 'auto',
            table: {
                    body: [
                            [
                            {text:"Ramadan",style:"ramadan",margin:[5,5]},
                            {},
                            {text:"Rescheduled days off",style:"R",margin:[5,5]},
                            {},
                            {text:"National/Founding Day",style:"N",margin:[5,5]},
                            {},
                            {text:"Holidays",style:"H",margin:[5,5]},
                            {},
                            {text:"Weekends",style:"L",margin:[5,5]}
                            ],
                    ]
            },
            layout: 'noBorders'
    },
    { width: '*', text: '' },
]
});

finalDataToPrint.push({
table:{
   body:[
       [
          {text:'Developed by Jassem'} 
          ]
       ]
},           
  layout: 'noBorders'
} );

  var dd = {
     info: {
title: d[0].year + " Shift Schedule",
author: 'https://jassemdeveloper.github.io/',
subject: d[0].year + " Shift Schedule",
},
   pageSize: {
    width:1165,
    height:'auto'
},
  defaultStyle: {
fontSize: 12,
alignment:"center"
},
   header:{
     text:d[0].year + " Shift Schedule",
     fontSize:30,
     margin:[0,4],
     bold:true,
     alignment:"center"
 },
pageOrientation: 'portrait',
content: finalDataToPrint,
styles: {
    header:{
        margin:[0,30],
        color:"white",
        fillColor:"#212529",
    },
    header1:{
        color:"white",
        fillColor:"#212529",
    },
    R:{
fillColor: "#FDB121",		        
color:"white",
},
H:{
fillColor: "#00DFFF",		        
color:"white",
},
N:{
fillColor: "#993299",		        
color:"white",
},
L:{
fillColor: "#407294",		        
color:"white",
},
ramadan:{
fillColor: "#20B2AA",		        
color:"white",
},
shiftA:{
    fillColor: "#00768B",		        
color:"white",
},
dayoffA:{
    fillColor: "#00768B",		        
color:"white",
},
shiftB:{
    fillColor: "#1EA0A5",		        
color:"white",
},
dayoffB:{
    fillColor: "#1EA0A5",		        
color:"white",
},
shiftC:{
    fillColor: "#004C48",		        
color:"white",
},
dayoffC:{
    fillColor: "#004C48",		        
color:"white",
},
shiftD:{
    fillColor: "#B44237",		        
color:"white",
},
dayoffD:{
    fillColor: "#B44237",		        
color:"white",
}
}
  }
 pdfMake.createPdf(dd).download(d[0].year + " Shift Schedule.pdf");
}


let exportToGoogleCalendar=async function(shiftType){
  let foundData = prepareCalendarDataForGoogle(currentYearGl,"row",shiftType);
  await insertEvents(foundData)
}

yearsSelection();
generatePDFAction();

  return {
    generateFullYearCalendar:generateFullYearCalendar,
    gapiLoaded:gapiLoaded,
    gisLoaded:gisLoaded,
    handleAuthClick:handleAuthClick,
    handleSignoutClick:handleSignoutClick,
    gapi_token_localstorage:gapi_token_localstorage,
    check_token:check_token,
    startProgress:startProgress

  }

})();

APP.generateFullYearCalendar(new Date().getFullYear(),'row');

