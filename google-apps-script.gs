/**
 * Hopewell Health Google Apps Script
 * This script handles form submissions from the Hopewell Health website and saves them to a Google Sheet
 * Last updated: April 9, 2025
 */

// Configuration - Using your actual spreadsheet ID
const SPREADSHEET_ID = '1dj1-jx4hJXA7rQtbxdEZ2UsU7yFi468MZXwBS7x_Q5Q';
const ADMIN_EMAIL = 'admin@yourdomain.com'; // Change this to your email for notifications
const ENABLE_EMAIL_NOTIFICATIONS = false; // Set to true to enable email notifications

// Process incoming form data
function doPost(e) {
  // Set up CORS headers for cross-domain compatibility
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
  };
  
  // For preflight OPTIONS requests
  if (e.method === 'OPTIONS') {
    return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT)
      .setHeaders(headers);
  }
  
  try {
    // Log incoming request for debugging purposes
    Logger.log("Received form submission: " + (e.postData ? e.postData.contents : "No data"));
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Basic validation
    if (!data || Object.keys(data).length === 0) {
      throw new Error('No form data provided');
    }
    
    // Get the form type to determine which sheet to use
    const formType = data.formType || 'unknown';
    
    // Save data to appropriate sheet based on form type
    const result = saveToSheet(data, formType);
    
    // Send email notification if enabled
    if (ENABLE_EMAIL_NOTIFICATIONS) {
      sendEmailNotification(data, formType);
    }
    
    // Return success response with CORS headers
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Data saved successfully',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  } 
  catch (error) {
    // Log the error for debugging
    console.error('Error processing form submission: ' + error.message);
    Logger.log('Error stack: ' + error.stack);
    
    // Return error response with CORS headers
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

// Function to handle CORS preflight requests
function doGet(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
  };
  
  return ContentService.createTextOutput(JSON.stringify({
    result: 'success',
    message: 'The Hopewell Health form handler is up and running',
    timestamp: new Date().toISOString()
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders(headers);
}

// Save data to the appropriate sheet based on form type
function saveToSheet(data, formType) {
  // Get the spreadsheet using the ID
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  try {
    // Determine which sheet to use based on form type
    let sheet;
    switch (formType) {
      case 'consultation':
        sheet = getOrCreateSheet(spreadsheet, 'Consultation Requests');
        saveConsultationData(sheet, data);
        break;
        
      case 'contact':
        sheet = getOrCreateSheet(spreadsheet, 'Contact Messages');
        saveContactData(sheet, data);
        break;
        
      case 'homecare':
        sheet = getOrCreateSheet(spreadsheet, 'Home Care Requests');
        saveHomeCareData(sheet, data);
        break;
        
      case 'therapy':
        sheet = getOrCreateSheet(spreadsheet, 'Therapy Bookings');
        saveTherapyData(sheet, data);
        break;
        
      case 'medical-tourism':
        sheet = getOrCreateSheet(spreadsheet, 'Medical Tourism Inquiries');
        saveTourismData(sheet, data);
        break;
        
      default:
        sheet = getOrCreateSheet(spreadsheet, 'Other Submissions');
        saveGenericData(sheet, data);
    }
    
    // Auto-resize columns for better readability
    autoResizeColumns(sheet);
    
    return true;
  } catch (error) {
    Logger.log("Error saving to sheet: " + error.message);
    throw error; // Re-throw to handle in the main function
  }
}

// Helper function to get or create a sheet and format it properly
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  // If the sheet doesn't exist, create it with proper formatting
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    
    // Format the header row
    sheet.getRange(1, 1, 1, 20).setBackground("#4285F4").setFontColor("#FFFFFF").setFontWeight("bold");
    
    // Freeze the header row
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

// Automatically resize columns for better readability
function autoResizeColumns(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn > 0) {
    sheet.autoResizeColumns(1, lastColumn);
  }
}

// Save consultation form data
function saveConsultationData(sheet, data) {
  // Check if headers exist, if not add them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 
      'Name', 
      'Age', 
      'Email', 
      'Phone', 
      'Department', 
      'Urgency Level', 
      'Message', 
      'Privacy Agreement'
    ]);
  }
  
  // Append the data
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.age || '',
    data.email || '',
    data.phone || '',
    data.department || '',
    data.urgency || '',
    data.message || '',
    data.privacy || ''
  ]);
}

// Save contact form data
function saveContactData(sheet, data) {
  // Check if headers exist, if not add them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 
      'Name', 
      'Email', 
      'Message'
    ]);
  }
  
  // Append the data
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.message || ''
  ]);
}

// Save home care form data
function saveHomeCareData(sheet, data) {
  // Check if headers exist, if not add them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 
      'Name', 
      'Phone', 
      'Address', 
      'Service Type',
      'Preferred Time',
      'Additional Notes',
      'Has Prescription',
      'Has Lab Request',
      'Privacy Agreement'
    ]);
  }
  
  // Append the data
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    data.address || '',
    data.serviceType || '',
    data.preferredTime || '',
    data.additionalNotes || '',
    data.hasPrescription || 'No',
    data.hasLabRequest || 'No',
    data.privacy || ''
  ]);
}

// Save therapy booking form data
function saveTherapyData(sheet, data) {
  // Check if headers exist, if not add them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 
      'Full Name', 
      'Email', 
      'Phone', 
      'Preferred Date',
      'Preferred Time',
      'Session Type',
      'Concerns',
      'Privacy Agreement'
    ]);
  }
  
  // Append the data
  sheet.appendRow([
    new Date(),
    data.fullName || '',
    data.email || '',
    data.phone || '',
    data.preferredDate || '',
    data.preferredTime || '',
    data.sessionType || '',
    data.concerns || '',
    data.privacy || ''
  ]);
}

// Save medical tourism inquiry data
function saveTourismData(sheet, data) {
  // Check if headers exist, if not add them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 
      'Name', 
      'Email', 
      'Phone', 
      'Treatment Type',
      'Message',
      'Privacy Agreement'
    ]);
  }
  
  // Append the data
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.treatmentType || '',
    data.message || '',
    data.privacy || ''
  ]);
}

// Save generic form data (catch-all for other forms)
function saveGenericData(sheet, data) {
  // For forms that don't match predefined types
  
  // Check if there's any data to save
  if (Object.keys(data).length === 0) {
    throw new Error('No data provided');
  }
  
  // If this is a new sheet, create headers based on data properties
  if (sheet.getLastRow() === 0) {
    const headers = ['Timestamp', ...Object.keys(data).filter(key => key !== 'formType')];
    sheet.appendRow(headers);
  }
  
  // Prepare row data
  const rowData = [new Date()];
  
  // Get existing headers (skipping Timestamp at index 0)
  const headers = sheet.getRange(1, 2, 1, sheet.getLastColumn() - 1).getValues()[0];
  
  // Add data in correct order matching headers
  headers.forEach(header => {
    rowData.push(data[header] || '');
  });
  
  // Append the data
  sheet.appendRow(rowData);
}

// Send email notification with formatted content
function sendEmailNotification(data, formType) {
  try {
    let subject, bodyHtml;
    
    // Format the email based on form type
    switch (formType) {
      case 'consultation':
        subject = "New Consultation Request";
        bodyHtml = formatConsultationEmailBody(data);
        break;
      case 'contact':
        subject = "New Contact Form Message";
        bodyHtml = formatContactEmailBody(data);
        break;
      case 'homecare':
        subject = "New Home Care Service Request";
        bodyHtml = formatHomeCareEmailBody(data);
        break;
      case 'therapy':
        subject = "New Therapy Session Booking";
        bodyHtml = formatTherapyEmailBody(data);
        break;
      case 'medical-tourism':
        subject = "New Medical Tourism Inquiry";
        bodyHtml = formatTourismEmailBody(data);
        break;
      default:
        subject = "New Form Submission";
        bodyHtml = `<p>New form submission received:</p><pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
    
    // Send HTML email with better formatting
    GmailApp.sendEmail(
      ADMIN_EMAIL, 
      subject + " - Hopewell Health", 
      "Please view this email in HTML format", // Fallback plain text
      { 
        htmlBody: bodyHtml,
        name: "Hopewell Health Forms"
      }
    );
    
    Logger.log("Email notification sent successfully");
  } catch (error) {
    Logger.log("Failed to send email notification: " + error.message);
    // Don't throw error here - we don't want email failures to break the form submission
  }
}

// Format email bodies for different form types
function formatConsultationEmailBody(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 5px;">
      <h2 style="color: #4285F4; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Consultation Request</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Age:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.age || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.email || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.phone || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Department:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.department || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Urgency:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.urgency || 'N/A'}</td></tr>
      </table>
      <div style="margin-top: 20px;">
        <strong>Message:</strong>
        <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-top: 5px;">
          ${data.message || 'No additional message provided.'}
        </div>
      </div>
      <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated notification from your Hopewell Health website.</p>
    </div>
  `;
}

// Format email body for contact form submissions
function formatContactEmailBody(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 5px;">
      <h2 style="color: #4285F4; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Website Message</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.email || 'N/A'}</td></tr>
      </table>
      <div style="margin-top: 20px;">
        <strong>Message:</strong>
        <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-top: 5px;">
          ${data.message || 'No message content provided.'}
        </div>
      </div>
      <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated notification from your Hopewell Health website.</p>
    </div>
  `;
}

// Additional format functions for other form types
function formatHomeCareEmailBody(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 5px;">
      <h2 style="color: #4285F4; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Home Care Service Request</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.phone || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Address:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.address || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Service Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.serviceType || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Preferred Time:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.preferredTime || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Has Prescription:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.hasPrescription || 'No'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Has Lab Request:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.hasLabRequest || 'No'}</td></tr>
      </table>
      <div style="margin-top: 20px;">
        <strong>Additional Notes:</strong>
        <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-top: 5px;">
          ${data.additionalNotes || 'No additional notes provided.'}
        </div>
      </div>
      <div style="margin-top: 20px; background-color: #fff9e6; padding: 10px; border-left: 4px solid #ffcc00; border-radius: 3px;">
        <p><strong>Action Required:</strong> Contact the patient to confirm the home care service appointment.</p>
      </div>
    </div>
  `;
}

function formatTherapyEmailBody(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 5px;">
      <h2 style="color: #4285F4; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Therapy Session Booking</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.fullName || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.email || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.phone || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Preferred Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.preferredDate || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Preferred Time:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.preferredTime || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Session Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.sessionType || 'N/A'}</td></tr>
      </table>
      <div style="margin-top: 20px;">
        <strong>Concerns:</strong>
        <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-top: 5px;">
          ${data.concerns || 'No concerns provided.'}
        </div>
      </div>
      <div style="margin-top: 20px; background-color: #e6f7ff; padding: 10px; border-left: 4px solid #0099ff; border-radius: 3px;">
        <p><strong>Action Required:</strong> Add this booking to the therapy schedule and confirm with the client.</p>
      </div>
    </div>
  `;
}

function formatTourismEmailBody(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 5px;">
      <h2 style="color: #4285F4; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Medical Tourism Inquiry</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.email || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.phone || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Treatment Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.treatmentType || 'N/A'}</td></tr>
      </table>
      <div style="margin-top: 20px;">
        <strong>Message:</strong>
        <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-top: 5px;">
          ${data.message || 'No additional message provided.'}
        </div>
      </div>
      <div style="margin-top: 20px; background-color: #e8f5e9; padding: 10px; border-left: 4px solid #4caf50; border-radius: 3px;">
        <p><strong>Priority:</strong> International patient inquiry - follow up within 24 hours.</p>
      </div>
    </div>
  `;
}