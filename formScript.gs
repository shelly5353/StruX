// פונקציה ליצירת כותרות בגיליון
function initializeSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // יצירת כותרות בשורה הראשונה
  sheet.getRange(1, 1, 1, 6).setValues([
    ['שם מלא', 'טלפון נייד', 'מייל', 'מתי נוח לך שנתקשר?', 'הערות נוספות', 'תאריך ושעה']
  ]);
}

// פונקציה לטיפול בבקשות GET
function doGet(e) {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setContent(JSON.stringify({
      'status': 'success',
      'message': 'הטופס מוכן לקבלת נתונים'
    }))
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// הפונקציה הראשית שמקבלת נתונים מהאתר
function doPost(e) {
  // Handle preflight OPTIONS request
  if (e.postData.type === "application/json") {
    try {
      Logger.log("התקבלה בקשה חדשה");
      
      // בדיקה שהתקבלו נתונים
      if (!e || !e.postData || !e.postData.contents) {
        throw new Error('לא התקבלו נתונים');
      }

      // המרת הנתונים שהתקבלו
      var data = JSON.parse(e.postData.contents);
      
      // בדיקת תקינות הנתונים
      if (!data.name || !data.phone || !data.email) {
        throw new Error('חסרים שדות חובה');
      }
      
      var timestamp = new Date();
      
      // קבלת הגיליון הפעיל
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
      // הוספת שורה חדשה עם הנתונים
      var rowData = [
        data.name,
        data.phone,
        data.email,
        data.callTime || '',
        data.notes || '',
        timestamp
      ];
      
      sheet.appendRow(rowData);
      Logger.log('הנתונים נשמרו בהצלחה: ' + JSON.stringify(rowData));

      return ContentService.createTextOutput()
        .setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify({
          'status': 'success',
          'message': 'הנתונים נשמרו בהצלחה'
        }))
        .addHeader('Access-Control-Allow-Origin', '*')
        .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        .addHeader('Access-Control-Allow-Headers', 'Content-Type');

    } catch (error) {
      Logger.log('שגיאה: ' + error.toString());
      return ContentService.createTextOutput()
        .setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify({
          'status': 'error',
          'message': error.toString()
        }))
        .addHeader('Access-Control-Allow-Origin', '*')
        .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        .addHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
  }
  
  // Handle preflight OPTIONS request
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.TEXT)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// פונקציה להגדרה ראשונית
function setup() {
  // יצירת הכותרות בגיליון
  initializeSheet();
  Logger.log('ההגדרה הראשונית הושלמה בהצלחה!');
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
