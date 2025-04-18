// פונקציה ליצירת כותרות בגיליון
function initializeSheet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // הגדרת עמודות וכותרות
    var headers = [
      'שם מלא',
      'טלפון נייד',
      'מייל', 
      'מתי נוח לך שנתקשר?',
      'הערות נוספות',
      'תאריך ושעה',
      'סטטוס טיפול'
    ];
    
    // יצירת כותרות בשורה הראשונה
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // עיצוב הגיליון
    formatSheet(sheet);
    
    // יצירת רשימה נפתחת לעמודת הסטטוס
    createStatusDropdown(sheet);
    
    // מחיקת שורות ריקות מיותרות
    var maxRows = sheet.getMaxRows();
    if (maxRows > 100) {
      sheet.deleteRows(101, maxRows - 100);
    }
    
    return true;
  } catch (error) {
    Logger.log('Error in initializeSheet: ' + error.toString());
    return false;
  }
}

// פונקציה ליצירת רשימה נפתחת לעמודת סטטוס
function createStatusDropdown(sheet) {
  try {
    // יצירת כלל אימות עבור רשימה נפתחת
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['בהמתנה', 'בטיפול', 'טופל', 'לא רלוונטי'], true)
      .setAllowInvalid(false)
      .build();
    
    // קבלת מספר השורות
    var lastRow = sheet.getLastRow();
    var rowsToAdd = Math.max(100, lastRow - 1);
    
    // החלת הכלל על עמודת הסטטוס (עמודה 7)
    sheet.getRange(2, 7, rowsToAdd, 1).setDataValidation(rule);
    
    // הגדרת ערך ברירת מחדל "בהמתנה" לכל השורות החדשות
    if (lastRow > 1) {
      var statusRange = sheet.getRange(2, 7, lastRow - 1, 1);
      var currentValues = statusRange.getValues();
      
      var needsUpdate = false;
      for (var i = 0; i < currentValues.length; i++) {
        if (!currentValues[i][0]) {
          currentValues[i][0] = 'בהמתנה';
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        statusRange.setValues(currentValues);
      }
    }
    
    return true;
  } catch (error) {
    Logger.log('Error in createStatusDropdown: ' + error.toString());
    return false;
  }
}

// פונקציה לטיפול בבקשות GET
function doGet(e) {
  return HtmlService.createHtmlOutput('<html><body><h1>שירות טפסים של StruX</h1><p>השירות פעיל ומוכן לקבלת נתונים</p></body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// פונקציה לעיצוב הגיליון
function formatSheet(sheet) {
  try {
    // מספר השורות והעמודות
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    
    // עיצוב כותרות - שורה ראשונה
    var headerRange = sheet.getRange(1, 1, 1, lastColumn);
    headerRange.setBackground('#1e73be');  // רקע כחול
    headerRange.setFontColor('#ffffff');   // צבע טקסט לבן
    headerRange.setFontWeight('bold');     // טקסט מודגש
    headerRange.setFontFamily('Heebo');    // פונט עברי
    headerRange.setFontSize(12);           // גודל פונט
    headerRange.setHorizontalAlignment('center'); // יישור אמצע
    headerRange.setVerticalAlignment('middle');   // יישור אנכי באמצע
    headerRange.setBorder(true, true, true, true, null, null, '#000000', SpreadsheetApp.BorderStyle.SOLID); // גבולות
    
    // הגדרת גובה שורת הכותרת
    sheet.setRowHeight(1, 35);  // גובה שורת כותרת
    
    // התאמת רוחב עמודות
    sheet.autoResizeColumns(1, lastColumn);
    sheet.setColumnWidth(1, 150);  // שם מלא
    sheet.setColumnWidth(2, 120);  // טלפון
    sheet.setColumnWidth(3, 180);  // מייל
    sheet.setColumnWidth(4, 200);  // מתי נוח
    sheet.setColumnWidth(5, 250);  // הערות
    sheet.setColumnWidth(6, 150);  // תאריך ושעה
    sheet.setColumnWidth(7, 120);  // סטטוס
    
    // עיצוב תאים
    if (lastRow > 1) {
      var dataRange = sheet.getRange(2, 1, lastRow - 1, lastColumn);
      dataRange.setFontFamily('Heebo');
      dataRange.setFontSize(11);
      dataRange.setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
      dataRange.setVerticalAlignment('middle');   // יישור אנכי באמצע
      
      // עיצוב עמודות ספציפיות
      sheet.getRange(2, 2, lastRow - 1, 1).setHorizontalAlignment('center');  // טלפון ממורכז
      sheet.getRange(2, 6, lastRow - 1, 1).setHorizontalAlignment('center');  // תאריך ממורכז
      sheet.getRange(2, 7, lastRow - 1, 1).setHorizontalAlignment('center');  // סטטוס ממורכז
      
      // צביעת שורות לסירוגין
      for (var i = 2; i <= lastRow; i++) {
        var rowRange = sheet.getRange(i, 1, 1, lastColumn);
        sheet.setRowHeight(i, 25);  // גובה קבוע לשורות
        
        if (i % 2 === 0) {
          rowRange.setBackground('#f3f3f3'); // אפור בהיר לשורות זוגיות
        } else {
          rowRange.setBackground('#ffffff'); // לבן לשורות אי-זוגיות
        }
      }
    }
    
    // הקפאת שורת הכותרת
    sheet.setFrozenRows(1);
    
    // עיצוב תצוגת התאריך בעמודה השישית
    if (lastRow > 1) {
      var dateColumn = sheet.getRange(2, 6, lastRow - 1, 1);
      dateColumn.setNumberFormat('dd/MM/yyyy HH:mm:ss');
    }
    
    // הוספת מסננים לכותרות
    headerRange.createFilter();
    
    Logger.log('עיצוב הגיליון הושלם בהצלחה');
    return true;
  } catch (error) {
    Logger.log('שגיאה בעיצוב הגיליון: ' + error.toString());
    return false;
  }
}

// הפונקציה הראשית שמקבלת נתונים מהאתר
function doPost(e) {
  Logger.log("doPost function called");
  
  // בדיקה אם יש נתונים
  if (!e || (!e.postData && !e.parameter)) {
    Logger.log("No data received");
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "No data received"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // קבלת הנתונים מהבקשה - אנחנו מצפים לנתונים בפורמט פרמטרים רגילים
    var jsonData = {
      name: e.parameter.name,
      phone: e.parameter.phone,
      email: e.parameter.email,
      callTime: e.parameter.callTime,
      notes: e.parameter.notes
    };
    
    Logger.log("Received data: " + JSON.stringify(jsonData));
    
    // בדיקת תקינות הנתונים
    if (!jsonData.name || !jsonData.phone || !jsonData.email) {
      Logger.log("Missing required fields: " + JSON.stringify(jsonData));
      return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Missing required fields"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var timestamp = new Date();
    
    // נסיון לגשת לגיליון הפעיל
    try {
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = spreadsheet.getSheetByName('טופס יצירת קשר');
      if (!sheet) {
        sheet = spreadsheet.insertSheet('טופס יצירת קשר');
        initializeSheet();
      }
      Logger.log("Successfully accessed the sheet: " + sheet.getName());
    } catch (sheetError) {
      Logger.log("Error accessing sheet: " + sheetError.toString());
      return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Error accessing spreadsheet"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // הוספת שורה חדשה עם הנתונים
    var rowData = [
      jsonData.name,
      jsonData.phone,
      jsonData.email,
      jsonData.callTime || '',
      jsonData.notes || '',
      timestamp,
      'בהמתנה' // ערך ברירת מחדל לעמודת הסטטוס
    ];
    
    Logger.log("Attempting to append row: " + JSON.stringify(rowData));
    sheet.appendRow(rowData);
    Logger.log('הנתונים נשמרו בהצלחה');
    
    // עיצוב הגיליון לאחר הוספת הנתונים
    formatSheet(sheet);
    
    // עדכון הרשימה הנפתחת עבור עמודת הסטטוס
    createStatusDropdown(sheet);

    // החזרת תשובת הצלחה בפורמט JSON
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    // החזרת תשובת שגיאה
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
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

// פונקציה לבדיקת הטריגרים הקיימים
function checkTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    Logger.log('Trigger ' + i + ': ' + triggers[i].getHandlerFunction());
    Logger.log('Event Type: ' + triggers[i].getEventType());
    Logger.log('Source: ' + triggers[i].getTriggerSource());
  }
}

// פונקציה למחיקת גיליונות מיותרים
function deleteExtraSheets() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = spreadsheet.getSheets();
    var mainSheet = spreadsheet.getSheetByName('טופס יצירת קשר');
    
    // מחיקת כל הגיליונות חוץ מהגיליון הראשי
    for (var i = 0; i < sheets.length; i++) {
      var sheet = sheets[i];
      if (sheet.getName() !== 'טופס יצירת קשר') {
        spreadsheet.deleteSheet(sheet);
        Logger.log('Deleted sheet: ' + sheet.getName());
      }
    }
    
    return {
      status: 'success',
      message: 'נמחקו כל הגיליונות המיותרים'
    };
  } catch (error) {
    Logger.log('Error in deleteExtraSheets: ' + error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// פונקציה לעדכון עיצוב הגיליון הקיים
function formatExistingSheet() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName('טופס יצירת קשר');
    
    if (!sheet) {
      Logger.log('הגיליון "טופס יצירת קשר" לא נמצא');
      return {
        status: 'error',
        message: 'הגיליון "טופס יצירת קשר" לא נמצא'
      };
    }
    
    // עיצוב הגיליון
    var success = formatSheet(sheet);
    
    if (success) {
      return {
        status: 'success',
        message: 'עיצוב הגיליון הושלם בהצלחה'
      };
    } else {
      return {
        status: 'error',
        message: 'אירעה שגיאה בעיצוב הגיליון'
      };
    }
  } catch (error) {
    Logger.log('Error in formatExistingSheet: ' + error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// פונקציה לשיפור תצוגת התאריך
function formatDateTimeColumn() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName('טופס יצירת קשר');
    
    if (!sheet) {
      Logger.log('הגיליון "טופס יצירת קשר" לא נמצא');
      return {
        status: 'error',
        message: 'הגיליון "טופס יצירת קשר" לא נמצא'
      };
    }
    
    var lastRow = sheet.getLastRow();
    
    if (lastRow > 1) {
      // עמודת התאריך היא העמודה השישית (F)
      var dateColumn = sheet.getRange(2, 6, lastRow - 1, 1);
      dateColumn.setNumberFormat('dd/MM/yyyy HH:mm:ss');
    }
    
    return {
      status: 'success',
      message: 'פורמט התאריך עודכן בהצלחה'
    };
  } catch (error) {
    Logger.log('Error in formatDateTimeColumn: ' + error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// פונקציה להוספת עמודת סטטוס לגיליון קיים
function addStatusColumn() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName('טופס יצירת קשר');
    
    if (!sheet) {
      Logger.log('הגיליון "טופס יצירת קשר" לא נמצא');
      return {
        status: 'error',
        message: 'הגיליון "טופס יצירת קשר" לא נמצא'
      };
    }
    
    // בדיקה אם כבר יש 7 עמודות
    var lastColumn = sheet.getLastColumn();
    
    if (lastColumn < 7) {
      // הוספת כותרת "סטטוס טיפול" לתא G1
      sheet.getRange(1, 7).setValue('סטטוס טיפול');
      
      // עיצוב הכותרת
      var headerCell = sheet.getRange(1, 7);
      headerCell.setBackground('#1e73be');
      headerCell.setFontColor('#ffffff');
      headerCell.setFontWeight('bold');
      headerCell.setFontFamily('Heebo');
      headerCell.setFontSize(12);
      headerCell.setHorizontalAlignment('center');
      headerCell.setBorder(true, true, true, true, null, null, '#000000', SpreadsheetApp.BorderStyle.SOLID);
    }
    
    // יצירת רשימה נפתחת עבור עמודת הסטטוס
    createStatusDropdown(sheet);
    
    // עיצוב מחדש של הגיליון
    formatSheet(sheet);
    
    return {
      status: 'success',
      message: 'עמודת סטטוס נוספה בהצלחה'
    };
  } catch (error) {
    Logger.log('Error in addStatusColumn: ' + error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// עדכון הפונקציה לביצוע כל פעולות העיצוב יחד
function beautifySheet() {
  var result = formatExistingSheet();
  Logger.log(result.message);
  
  var dateResult = formatDateTimeColumn();
  Logger.log(dateResult.message);
  
  var statusResult = addStatusColumn();
  Logger.log(statusResult.message);
  
  return {
    status: 'success',
    message: 'עיצוב הגיליון הושלם בהצלחה'
  };
}

// Add a function to handle OPTIONS requests
function doOptions(e) {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setContent(JSON.stringify({"status": "success"}));
} 

