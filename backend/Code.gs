const HEADERS = [
  "Team ID", "Event ID", "Event Name", "Team Name", "Participant Name", 
  "Email", "Phone", "Department", "Roll No", "Member 2", "Member 3", "Member 4",
  "M1", "M2", "M3", "M4", "M5", "Total", "Rank", "Status", "Created At", "Updated At"
];

const EVENT_MAPPING = [
  { id: "PP", name: "Paper Presentation" },
  { id: "PR", name: "Project Presentation" },
  { id: "VO", name: "Vox Pop - Debate" },
  { id: "WE", name: "Web Designing" },
  { id: "SH", name: "Culturals" },
  { id: "IP", name: "IPL Auction" }
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === "register") {
      return handleRegister(data);
    } else if (action === "saveMarks") {
      return handleSaveMarks(data);
    } else if (action === "generateReport") {
      return handleGenerateReport(data);
    } else if (action === "generateToppers") {
      return handleGenerateToppers();
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unknown POST action" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const eventId = e.parameter.eventId;
    
    if (action === "getRegistrations") {
      return handleGetRegistrations(eventId);
    } else if (action === "getEvaluations") {
      return handleGetEvaluations(eventId);
    } else if (action === "getCriteria") {
      return handleGetCriteria(eventId);
    } else if (action === "getResults") {
      return handleGetResults(eventId);
    } else if (action === "getEvents") {
      return handleGetEvents();
    } else if (action === "getAuditLogs") {
      return handleGetAuditLogs();
    } else if (action === "getDashboardStats") {
      return handleGetDashboardStats();
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unknown GET action" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---------------------------------------------------------
// SETUP SCRIPT
// ---------------------------------------------------------
function setupQuantum27() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. MASTER
  let masterSheet = ss.getSheetByName("MASTER");
  if (!masterSheet) {
    masterSheet = ss.insertSheet("MASTER");
    masterSheet.appendRow(HEADERS);
  } else if (masterSheet.getLastRow() === 0) {
    masterSheet.appendRow(HEADERS);
  }

  // 2. EVENT_CONFIG
  let configSheet = ss.getSheetByName("EVENT_CONFIG");
  if (!configSheet) {
    configSheet = ss.insertSheet("EVENT_CONFIG");
    configSheet.appendRow([
      "Event ID", "Event Name", "M1 Name", "M1 Max", "M2 Name", "M2 Max", 
      "M3 Name", "M3 Max", "M4 Name", "M4 Max", "M5 Name", "M5 Max"
    ]);
    
    const configData = [
      ["PP", "Paper Presentation", "Problem & Relevance", 20, "Technical Implementation", 30, "Innovation", 20, "Presentation", 20, "Time Management", 10],
      ["PR", "Project Presentation", "Problem & Relevance", 20, "Technical Implementation", 30, "Innovation", 20, "Presentation", 20, "Time Management", 10],
      ["VO", "Vox Pop - Debate", "Clarity of Thought", 25, "Argument Strength", 25, "Rebuttal", 25, "Confidence", 15, "Time Management", 10],
      ["WE", "Web Designing", "UI/UX Design", 25, "Creativity", 25, "Responsiveness", 20, "Code Quality", 20, "Functionality", 10],
      ["SH", "Culturals", "Originality", 30, "Skill Level", 30, "Audience Engagement", 20, "Overall Presentation", 20, "", 0],
      ["IP", "IPL Auction", "Bidding Strategy", 30, "Team Composition", 30, "Budget Management", 20, "Decision Making", 20, "", 0]
    ];
    
    for (const row of configData) {
      configSheet.appendRow(row);
    }
  }

  // 3. EVENT SHEETS
  for (const ev of EVENT_MAPPING) {
    let evSheet = ss.getSheetByName(ev.name);
    if (!evSheet) {
      evSheet = ss.insertSheet(ev.name);
      evSheet.appendRow(HEADERS);
    } else if (evSheet.getLastRow() === 0) {
      evSheet.appendRow(HEADERS);
    }
  }

  // 4. ALL_EVENT_TOPPERS
  let topperSheet = ss.getSheetByName("ALL_EVENT_TOPPERS");
  if (!topperSheet) {
    topperSheet = ss.insertSheet("ALL_EVENT_TOPPERS");
    topperSheet.appendRow(["Event Name", "Rank", "Team ID", "Team / Participant Name", "Total Score"]);
  } else if (topperSheet.getLastRow() === 0) {
    topperSheet.appendRow(["Event Name", "Rank", "Team ID", "Team / Participant Name", "Total Score"]);
  }

  // 5. REPORT
  let reportSheet = ss.getSheetByName("REPORT");
  if (!reportSheet) {
    reportSheet = ss.insertSheet("REPORT");
  }

  // 6. AUDIT_LOG
  let auditSheet = ss.getSheetByName("AUDIT_LOG");
  if (!auditSheet) {
    auditSheet = ss.insertSheet("AUDIT_LOG");
    auditSheet.appendRow([
      "Timestamp", "User", "Role", "Action", "Event ID", "Event Name", "Team ID", "Team Name",
      "Previous M1", "Previous M2", "Previous M3", "Previous M4", "Previous M5", "Previous Total",
      "New M1", "New M2", "New M3", "New M4", "New M5", "New Total"
    ]);
  } else if (auditSheet.getLastRow() === 0) {
    auditSheet.appendRow([
      "Timestamp", "User", "Role", "Action", "Event ID", "Event Name", "Team ID", "Team Name",
      "Previous M1", "Previous M2", "Previous M3", "Previous M4", "Previous M5", "Previous Total",
      "New M1", "New M2", "New M3", "New M4", "New M5", "New Total"
    ]);
  }
}

// ---------------------------------------------------------
// REGISTRATION
// ---------------------------------------------------------
function handleRegister(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // 10 sec timeout for concurrency

  try {
    const eventName = data.eventName;
    const eventId = data.eventId;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let masterSheet = ss.getSheetByName("MASTER");
    if (!masterSheet) {
      masterSheet = ss.insertSheet("MASTER");
      masterSheet.appendRow(HEADERS);
    }

    let eventSheet = ss.getSheetByName(eventName);
    if (!eventSheet) {
      eventSheet = ss.insertSheet(eventName);
      eventSheet.appendRow(HEADERS);
    }

    // Generate Team ID
    const prefix = eventName.substring(0, 2).toUpperCase();
    
    // Find highest existing ID in this event
    const eventData = eventSheet.getDataRange().getValues();
    let maxNumber = 0;
    
    for (let i = 1; i < eventData.length; i++) {
      const existingId = eventData[i][0];
      if (existingId && existingId.startsWith(prefix)) {
        const numPart = parseInt(existingId.substring(2), 10);
        if (!isNaN(numPart) && numPart > maxNumber) {
          maxNumber = numPart;
        }
      }
    }
    
    const nextNumber = maxNumber + 1;
    const teamId = prefix + (nextNumber < 10 ? "0" + nextNumber : nextNumber.toString());
    
    const timestamp = new Date().toISOString();
    
    const newRow = [
      teamId,
      eventId,
      eventName,
      data.teamName || "",
      data.participantName || "",
      data.email || "",
      data.phone || "",
      data.department || "",
      data.rollNo || "",
      data.member2 || "",
      data.member3 || "",
      data.member4 || "",
      "", "", "", "", "", // M1-M5
      "", // Total
      "", // Rank
      "NOT EVALUATED", // Status
      timestamp,
      timestamp
    ];
    
    masterSheet.appendRow(newRow);
    eventSheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: "Registration successful",
      teamId: teamId,
      eventId: eventId,
      eventName: eventName
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------
// GET REGISTRATIONS
// ---------------------------------------------------------
function handleGetRegistrations(eventId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("MASTER");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const registrations = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (eventId && eventId !== "all" && row[1] !== eventId) {
      continue;
    }
    
    registrations.push({
      teamId: row[0],
      registrationId: row[0], // fallback compatibility
      eventId: row[1],
      eventName: row[2],
      teamName: row[3],
      leaderName: row[4],
      leaderEmail: row[5],
      leaderPhone: row[6],
      department: row[7],
      leaderRollNo: row[8],
      status: row[19] || "pending"
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: registrations }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------
// GET EVALUATIONS
// ---------------------------------------------------------
function handleGetEvaluations(eventId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const eventName = getEventNameFromId(eventId);
  
  if (!eventName) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid event ID" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const sheet = ss.getSheetByName("MASTER");
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const evaluations = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    if (row[1] === eventId) {
      evaluations.push({
        teamId: row[0],
        eventId: row[1],
        eventName: row[2],
        teamName: row[3],
        leaderName: row[4],
        m1: row[12] === "" ? "" : Number(row[12]),
        m2: row[13] === "" ? "" : Number(row[13]),
        m3: row[14] === "" ? "" : Number(row[14]),
        m4: row[15] === "" ? "" : Number(row[15]),
        m5: row[16] === "" ? "" : Number(row[16]),
        total: row[17] === "" ? "" : Number(row[17]),
        rank: row[18],
        status: row[19] || "NOT EVALUATED",
        updatedAt: row[21]
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: evaluations }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------
// SAVE MARKS
// ---------------------------------------------------------
function handleSaveMarks(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  
  try {
    const eventId = data.eventId;
    const teamId = data.teamId;
    const user = data.user || "unknown";
    const role = data.role || "UNKNOWN";
    const eventName = getEventNameFromId(eventId);
    
    if (!eventName) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid event ID" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const eventSheet = ss.getSheetByName(eventName);
    const masterSheet = ss.getSheetByName("MASTER");
    const auditSheet = ss.getSheetByName("AUDIT_LOG");
    
    if (!eventSheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Event sheet missing" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const m1 = typeof data.m1 === 'number' ? data.m1 : 0;
    const m2 = typeof data.m2 === 'number' ? data.m2 : 0;
    const m3 = typeof data.m3 === 'number' ? data.m3 : 0;
    const m4 = typeof data.m4 === 'number' ? data.m4 : 0;
    const m5 = typeof data.m5 === 'number' ? data.m5 : 0;
    
    const total = m1 + m2 + m3 + m4 + m5;
    const timestamp = new Date().toISOString();
    
    // Read previous marks for audit
    let prevM1 = "", prevM2 = "", prevM3 = "", prevM4 = "", prevM5 = "", prevTotal = "", teamName = "";
    const sheetData = eventSheet.getDataRange().getValues();
    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][0] === teamId) {
        teamName = sheetData[i][3] || sheetData[i][4] || "";
        prevM1 = sheetData[i][12];
        prevM2 = sheetData[i][13];
        prevM3 = sheetData[i][14];
        prevM4 = sheetData[i][15];
        prevM5 = sheetData[i][16];
        prevTotal = sheetData[i][17];
        break;
      }
    }
    
    updateRowInSheet(eventSheet, teamId, m1, m2, m3, m4, m5, total, timestamp);
    
    if (masterSheet) {
      updateRowInSheet(masterSheet, teamId, m1, m2, m3, m4, m5, total, timestamp);
    }
    
    if (auditSheet) {
      auditSheet.appendRow([
        timestamp, user, role, "UPDATE_MARKS", eventId, eventName, teamId, teamName,
        prevM1, prevM2, prevM3, prevM4, prevM5, prevTotal,
        m1, m2, m3, m4, m5, total
      ]);
    }
    
    recalculateEventRanks(eventSheet);
    syncRanksToMaster(eventSheet, masterSheet, teamId);
    handleGenerateToppers();
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}

function updateRowInSheet(sheet, teamId, m1, m2, m3, m4, m5, total, timestamp) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === teamId) {
      sheet.getRange(i + 1, 13).setValue(m1);
      sheet.getRange(i + 1, 14).setValue(m2);
      sheet.getRange(i + 1, 15).setValue(m3);
      sheet.getRange(i + 1, 16).setValue(m4);
      sheet.getRange(i + 1, 17).setValue(m5);
      sheet.getRange(i + 1, 18).setValue(total);
      sheet.getRange(i + 1, 20).setValue("EVALUATED");
      sheet.getRange(i + 1, 22).setValue(timestamp);
      return;
    }
  }
}

function recalculateEventRanks(sheet) {
  const data = sheet.getDataRange().getValues();
  
  const scored = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[17] !== "" && row[17] !== null && row[19] === "EVALUATED") {
      scored.push({
        rowIndex: i + 1,
        total: Number(row[17])
      });
    }
  }
  
  scored.sort((a, b) => b.total - a.total);
  
  let currentRank = 1;
  let rankOffset = 0;
  
  for (let i = 0; i < scored.length; i++) {
    if (i > 0 && scored[i].total < scored[i-1].total) {
      currentRank += rankOffset + 1;
      rankOffset = 0;
    } else if (i > 0) {
      rankOffset++;
    }
    
    sheet.getRange(scored[i].rowIndex, 19).setValue(currentRank);
  }
}

function syncRanksToMaster(eventSheet, masterSheet, teamId) {
  if (!masterSheet) return;
  
  const eventData = eventSheet.getDataRange().getValues();
  let rank = "";
  for (let i = 1; i < eventData.length; i++) {
    if (eventData[i][0] === teamId) {
      rank = eventData[i][18];
      break;
    }
  }
  
  const masterData = masterSheet.getDataRange().getValues();
  for (let i = 1; i < masterData.length; i++) {
    if (masterData[i][0] === teamId) {
      masterSheet.getRange(i + 1, 19).setValue(rank);
      break;
    }
  }
}

// ---------------------------------------------------------
// GET RESULTS
// ---------------------------------------------------------
function handleGetResults(eventId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const eventName = getEventNameFromId(eventId);
  
  if (!eventName) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid event ID" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const sheet = ss.getSheetByName(eventName);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const results = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[19] === "EVALUATED" && row[18] !== "") {
      results.push({
        teamId: row[0],
        teamName: row[3],
        leaderName: row[4],
        total: Number(row[17]),
        rank: Number(row[18])
      });
    }
  }
  
  results.sort((a, b) => a.rank - b.rank);
  
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: results }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------
// GENERATE REPORT
// ---------------------------------------------------------
function handleGenerateReport(data) {
  const eventId = data.eventId;
  const eventName = getEventNameFromId(eventId);
  
  if (!eventName) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid event ID" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const eventSheet = ss.getSheetByName(eventName);
  
  if (!eventSheet) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Event sheet does not exist yet" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  let reportSheet = ss.getSheetByName("REPORT");
  if (!reportSheet) {
    reportSheet = ss.insertSheet("REPORT");
  }
  
  reportSheet.clear();
  
  const eventData = eventSheet.getDataRange().getValues();
  reportSheet.getRange(1, 1, eventData.length, eventData[0].length).setValues(eventData);
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------
// GENERATE TOPPERS
// ---------------------------------------------------------
function handleGenerateToppers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let topperSheet = ss.getSheetByName("ALL_EVENT_TOPPERS");
  
  if (!topperSheet) {
    topperSheet = ss.insertSheet("ALL_EVENT_TOPPERS");
  }
  
  topperSheet.clear();
  topperSheet.appendRow(["Event Name", "Rank", "Team ID", "Team / Participant Name", "Total Score"]);
  
  for (const ev of EVENT_MAPPING) {
    const sheet = ss.getSheetByName(ev.name);
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      const results = [];
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][19] === "EVALUATED" && data[i][18] !== "") {
          results.push({
            teamId: data[i][0],
            name: data[i][3] || data[i][4],
            total: Number(data[i][17]),
            rank: Number(data[i][18])
          });
        }
      }
      
      results.sort((a, b) => a.rank - b.rank);
      const top3 = results.filter(r => r.rank <= 3);
      
      top3.forEach(r => {
        topperSheet.appendRow([ev.name, r.rank, r.teamId, r.name, r.total]);
      });
      
      if (top3.length > 0) {
        topperSheet.appendRow(["", "", "", "", ""]);
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------
function getEventNameFromId(eventId) {
  const match = EVENT_MAPPING.find(e => e.id === eventId);
  return match ? match.name : null;
}

function getCriteriaList(eventId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName("EVENT_CONFIG");
  
  if (configSheet) {
    const data = configSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === eventId) {
        const criteria = [];
        if (data[i][2] && data[i][3]) criteria.push({ name: data[i][2], weight: Number(data[i][3]) });
        if (data[i][4] && data[i][5]) criteria.push({ name: data[i][4], weight: Number(data[i][5]) });
        if (data[i][6] && data[i][7]) criteria.push({ name: data[i][6], weight: Number(data[i][7]) });
        if (data[i][8] && data[i][9]) criteria.push({ name: data[i][8], weight: Number(data[i][9]) });
        if (data[i][10] && data[i][11]) criteria.push({ name: data[i][10], weight: Number(data[i][11]) });
        
        return criteria.filter(c => c.weight > 0);
      }
    }
  }
  
  return [];
}

function handleGetCriteria(eventId) {
  const criteria = getCriteriaList(eventId);
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: criteria }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleGetEvents() {
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: EVENT_MAPPING }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleGetAuditLogs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const auditSheet = ss.getSheetByName("AUDIT_LOG");
  
  if (!auditSheet) {
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = auditSheet.getDataRange().getValues();
  const logs = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    logs.push({
      timestamp: row[0],
      user: row[1],
      role: row[2],
      action: row[3],
      eventId: row[4],
      eventName: row[5],
      teamId: row[6],
      teamName: row[7],
      prevM1: row[8],
      prevM2: row[9],
      prevM3: row[10],
      prevM4: row[11],
      prevM5: row[12],
      prevTotal: row[13],
      newM1: row[14],
      newM2: row[15],
      newM3: row[16],
      newM4: row[17],
      newM5: row[18],
      newTotal: row[19]
    });
  }
  
  // Sort by timestamp descending (newest first)
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: logs }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleGetDashboardStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const masterSheet = ss.getSheetByName("MASTER");
  
  let totalRegistrations = 0;
  let totalTeams = 0;
  let totalStudents = 0;
  const eventStatsMap = {};
  
  EVENT_MAPPING.forEach(ev => {
    eventStatsMap[ev.id] = {
      eventId: ev.id,
      eventName: ev.name,
      registrations: 0,
      teams: 0,
      students: 0
    };
  });
  
  if (masterSheet) {
    const data = masterSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const evId = row[1];
      const isTeam = row[3] !== ""; // has team name
      
      // Calculate members
      let membersCount = 0;
      if (row[4]) membersCount++; // Participant/Leader name
      if (row[9]) membersCount++; // Member 2
      if (row[10]) membersCount++; // Member 3
      if (row[11]) membersCount++; // Member 4
      
      totalRegistrations++;
      if (isTeam) totalTeams++;
      totalStudents += membersCount;
      
      if (eventStatsMap[evId]) {
        eventStatsMap[evId].registrations++;
        if (isTeam) eventStatsMap[evId].teams++;
        eventStatsMap[evId].students += membersCount;
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: {
      totalRegistrations,
      totalTeams,
      totalStudents,
      totalEvents: EVENT_MAPPING.length,
      eventWiseStats: Object.values(eventStatsMap)
    }
  })).setMimeType(ContentService.MimeType.JSON);
}
