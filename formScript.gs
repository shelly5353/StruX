// פונקציה ליצירת כותרות בגיליון
function initializeSheet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // יצירת כותרות בשורה הראשונה
    sheet.getRange(1, 1, 1, 6).setValues([
      ['שם מלא', 'טלפון נייד', 'מייל', 'מתי נוח לך שנתקשר?', 'הערות נוספות', 'תאריך ושעה']
    ]);
    return true;
  } catch (error) {
    Logger.log('Error in initializeSheet: ' + error.toString());
    return false;
  }
}

// פונקציה לטיפול בבקשות GET
function doGet(e) {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setContent(JSON.stringify({
      'status': 'success',
      'message': 'הטופס מוכן לקבלת נתונים'
    }));
}

// הפונקציה הראשית שמקבלת נתונים מהאתר
function doPost(e) {
  Logger.log("doPost function called");
  Logger.log("Request data: " + JSON.stringify(e));
  
  // Handle CORS preflight
  if (e.parameter && e.parameter.cors === 'preflight') {
    return ContentService.createTextOutput()
      .setMimeType(ContentService.MimeType.JSON)
      .setContent(JSON.stringify({
        'status': 'success',
        'message': 'CORS preflight successful'
      }));
  }

  if (!e) {
    Logger.log("No event object received");
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': 'לא התקבלו נתונים'
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Handle JSON data
  try {
    var jsonData;
    
    if (e.postData && e.postData.contents) {
      Logger.log("Received postData.contents: " + e.postData.contents);
      jsonData = JSON.parse(e.postData.contents);
      Logger.log("Parsed JSON data: " + JSON.stringify(jsonData));
    } else if (e.parameter) {
      Logger.log("Received parameters: " + JSON.stringify(e.parameter));
      jsonData = e.parameter;
    } else {
      throw new Error('לא התקבלו נתונים בפורמט תקין');
    }
    
    // בדיקת תקינות הנתונים
    if (!jsonData.name || !jsonData.phone || !jsonData.email) {
      Logger.log("Missing required fields: " + JSON.stringify(jsonData));
      throw new Error('חסרים שדות חובה: שם, טלפון או אימייל');
    }
    
    var timestamp = new Date();
    
    // נסיון לגשת לגיליון הפעיל
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      Logger.log("Successfully accessed the sheet: " + sheet.getName());
    } catch (sheetError) {
      Logger.log("Error accessing sheet: " + sheetError.toString());
      throw new Error('לא ניתן לגשת לגיליון הנתונים');
    }
    
    // הוספת שורה חדשה עם הנתונים
    var rowData = [
      jsonData.name,
      jsonData.phone,
      jsonData.email,
      jsonData.callTime || '',
      jsonData.notes || '',
      timestamp
    ];
    
    Logger.log("Attempting to append row: " + JSON.stringify(rowData));
    sheet.appendRow(rowData);
    Logger.log('הנתונים נשמרו בהצלחה');

    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'הנתונים נשמרו בהצלחה'
    }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// פונקציה להגדרה ראשונית
function setup() {
  try {
    // יצירת הכותרות בגיליון
    if (initializeSheet()) {
      Logger.log('ההגדרה הראשונית הושלמה בהצלחה!');
      return true;
    } else {
      Logger.log('שגיאה בהגדרה הראשונית');
      return false;
    }
  } catch (error) {
    Logger.log('Error in setup: ' + error.toString());
    return false;
  }
}

// פונקציה לבדיקת הגיליון והרשאות
function checkSpreadsheet() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();
    var name = spreadsheet.getName();
    var url = spreadsheet.getUrl();
    var editors = spreadsheet.getEditors();
    var viewers = spreadsheet.getViewers();
    
    Logger.log('Spreadsheet Name: ' + name);
    Logger.log('Spreadsheet URL: ' + url);
    Logger.log('Active Sheet Name: ' + sheet.getName());
    
    Logger.log('Editors:');
    for (var i = 0; i < editors.length; i++) {
      Logger.log(' - ' + editors[i].getEmail());
    }
    
    Logger.log('Viewers:');
    for (var i = 0; i < viewers.length; i++) {
      Logger.log(' - ' + viewers[i].getEmail());
    }
    
    // נסיון לכתוב שורה לגיליון כדי לבדוק הרשאות
    var testRow = ['TEST', 'TEST', 'TEST', 'TEST', 'TEST', new Date()];
    sheet.appendRow(testRow);
    Logger.log('Successfully wrote test row to sheet');
    
    // מחיקת שורת הבדיקה
    var lastRow = sheet.getLastRow();
    sheet.deleteRow(lastRow);
    Logger.log('Successfully deleted test row from sheet');
    
    return {
      status: 'success',
      name: name,
      url: url,
      sheetName: sheet.getName()
    };
  } catch (error) {
    Logger.log('Error in checkSpreadsheet: ' + error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// פונקציה לטיפול בשגיאות ולבדיקת הרשאות
function testPermissions() {
  var result = checkSpreadsheet();
  Logger.log('Test result: ' + JSON.stringify(result));
  return result;
}

function onFormSubmit(e) {
  try {
    Logger.log("Form submitted!");
    
    if (!e || !e.namedValues) {
      Logger.log('No form data received');
      return;
    }

    // קבלת הנתונים מהטופס
    var namedValues = e.namedValues;
    var timestamp = new Date();
    
    // הגדרת העמודות בגיליון
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // הוספת השורה החדשה
    var rowData = [
      namedValues['שם מלא'][0],
      namedValues['טלפון נייד'][0],
      namedValues['מייל'][0],
      namedValues['מתי נוח לך שנתקשר?'][0],
      namedValues['הערות נוספות'] ? namedValues['הערות נוספות'][0] : '',
      timestamp
    ];
    
    sheet.appendRow(rowData);
    Logger.log('Data added successfully: ' + JSON.stringify(rowData));
  } catch (error) {
    Logger.log('Error in onFormSubmit: ' + error.toString());
  }
}

function createForm() {
  try {
    // יצירת טופס חדש
    var form = FormApp.create('טופס יצירת קשר');
    
    // הוספת השדות לטופס
    form.addTextItem()
        .setTitle('שם מלא')
        .setRequired(true);
        
    form.addTextItem()
        .setTitle('טלפון נייד')
        .setRequired(true);
        
    form.addTextItem()
        .setTitle('מייל')
        .setRequired(true);
        
    form.addTextItem()
        .setTitle('מתי נוח לך שנתקשר?')
        .setRequired(true);
        
    form.addParagraphTextItem()
        .setTitle('הערות נוספות');
        
    // חיבור הטופס לגיליון
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
    
    // יצירת הכותרות בגיליון
    initializeSheet();
    
    // הגדרת הטריגר אוטומטית
    var triggers = ScriptApp.getProjectTriggers();
    // מחיקת טריגרים קיימים כדי למנוע כפילויות
    triggers.forEach(function(trigger) {
      ScriptApp.deleteTrigger(trigger);
    });
    
    // יצירת טריגר חדש
    ScriptApp.newTrigger('onFormSubmit')
      .forForm(form)
      .onFormSubmit()
      .create();
      
    Logger.log('Form created successfully!');
    Logger.log('Form URL: ' + form.getPublishedUrl());
    Logger.log('Form edit URL: ' + form.getEditUrl());
    
    return {
      publishedUrl: form.getPublishedUrl(),
      editUrl: form.getEditUrl()
    };
  } catch (error) {
    Logger.log('Error creating form: ' + error.toString());
    throw error;
  }
}

// פונקציה לבדיקת הטריגרים הקיימים
function checkTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    Logger.log('Trigger ' + i + ': ' + triggers[i].getHandlerFunction());
    Logger.log('Event Type: ' + triggers[i].getEventType());
    Logger.log('Source: ' + triggers[i].getTriggerSource());
  }
} 

