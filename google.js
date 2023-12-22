
const CLIENT_ID = '61736859691-5fmjquh8ud2skc1gvgfqogjb43ueh44a.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAK8SHAt3jUwMrywv55SaRf8JRHOhwABR0';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';
let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('signout_button').style.visibility = 'hidden';
document.getElementById('exportTo').style.visibility = 'hidden';
document.getElementById('shiftType').style.visibility = 'hidden';


let gapiLoaded = function () {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

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
    document.getElementById('authorize_button').style.visibility = 'visible';
    doc.querySelector('.progress').style.visibility='hidden';
    
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
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('exportTo').style.visibility = 'visible';
    document.getElementById('shiftType').style.visibility = 'visible';
    document.getElementById('authorize_button').style.visibility = 'hidden';

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
    document.getElementById('signout_button').style.visibility = 'hidden';
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


  const request = await gapi.client.caGlendar.events.insert({
    'calendarId': added_calendar_id,
    'resource': event1
  });

  const request1 = await gapi.client.calendar.events.insert({
    'calendarId': added_calendar_id,
    'resource': event2
  });
}





