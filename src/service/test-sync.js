import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import axios from "axios";
import logger from "../utils/logger.js";

// Initialize HubSpot Client
const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

// Custom Object ID (Update this to your actual schema ID from HubSpot)
const ASSET_OBJECT_TYPE_ID = "pYOUR_ASSET_SCHEMA_ID";

// Helper: Convert Jitbit date strings to HubSpot's required UNIX timestamp format safely
const formatHubSpotDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).getTime().toString();
};

// Asset Data
const jitbitAsset = {
  AssignedUsers: [],
  Fields: [
    { Value: null, FieldName: "Deployment date", FieldID: 57319 },
    { Value: null, FieldName: "Decommission Date", FieldID: 57321 },
  ],
  ItemID: 973043,
  Manufacturer: "Apple",
  Supplier: "TPG",
  ModelName: "iPad1792",
  Type: "iPad",
  SerialNumber: "F9FG9HL9Q1GC",
  Location: "Englewood",
  Comments: "N/A",
  Quantity: 1,
  Company: "CBSI",
  CompanyID: 1414826,
  Disabled: false,
};

// ==========================================
// 1. RAW JITBIT DATA PAYLOADS
// ==========================================
const jitbitCompany = {
  CompanyID: 1517988,
  Name: "Abacustechnology",
  Notes: null,
  EmailDomain: "abacustechnology.com",
};

const jitbitUser = {
  UserID: 14442966,
  Username: " jcrawford@olyderm.com",
  FullName: "Jenaya Crawford",
  FirstName: "Jenaya",
  LastName: "Crawford",
  Email: "jcrawford@olyderm.com",
  CompanyId: 1414107,
  DepartmentID: null,
  IsAdmin: false,
  Disabled: false,
  LastSeen: "2026-05-26T21:22:00Z",
  CompanyName: "OLYD - Olympic Dermatology",
  DepartmentName: null,
  Location: "",
  Phone: "",
};

const jitbitTicket = {
  IssueID: 99146385,
  Priority: 0,
  StatusID: 2,
  IssueDate: "2026-05-08T17:26:12.35Z",
  Subject: "AR - ICC - Discrete Form Build",
  Status: "In progress",
  UpdatedByUser: false,
  UpdatedByPerformer: true,
  CategoryID: 578943,
  UserName: "Daniel.Clark@healthipass.com",
  Technician: "tanya.elmore@healthipass.com",
  FirstName: "Daniel",
  LastName: "Clark",
  DueDate: "2026-07-09T13:26:00Z",
  TechFirstName: "Tanya",
  TechLastName: "Elmore",
  LastUpdated: "2026-07-08T09:46:49.397Z",
  UpdatedForTechView: false,
  UserID: 10489123,
  CompanyID: 1087975,
  CompanyName: "Health iPASS",
  AssignedToUserID: 13814395,
  ResolvedDate: null,
  SectionID: 145956,
  Category: "Account Management - Implementations",
  Origin: "WebApp",
  Email: "daniel.clark@healthipass.com",
  StatusColor: "",
  LastUpdatedByUserID: 5481479,
  LastUpdatedUsername: "Rambabu",
  StartDate: null,
  TimeSpentInSeconds: 2700,
  AISentiment: 0,
};

// ==========================================
// 2. SYNC FUNCTIONS (Exported)
// ==========================================

async function syncCompany() {
  try {
    const response = await hubspotClient.crm.companies.basicApi.create({
      properties: {
        name: jitbitCompany.Name,
        domain: jitbitCompany.EmailDomain,
        jitbit_company_id: jitbitCompany.CompanyID.toString(),
        jitbit_notes: jitbitCompany.Notes || "",
        jitbit_email_domain: jitbitCompany.EmailDomain || "",
      },
    });
    logger.info(`✅ Company Synced! HubSpot ID: ${response.id}`);
  } catch (e) {
    logger.error(`❌ Company Sync Failed: ${e.message}`);
    if (e.response) logger.error(JSON.stringify(e.response.body, null, 2));
  }
}

async function syncContact() {
  try {
    const response = await hubspotClient.crm.contacts.basicApi.create({
      properties: {
        email: jitbitUser.Email,
        firstname: jitbitUser.FirstName,
        lastname: jitbitUser.LastName,
        company: jitbitUser.CompanyName,
        phone: jitbitUser.Phone || "",

        jitbit_user_id: jitbitUser.UserID.toString(),
        jitbit_username: jitbitUser.Username.trim(),
        jitbit_full_name: jitbitUser.FullName,
        jitbit_company_id: (jitbitUser.CompanyId || "").toString(),
        jitbit_department_id: (jitbitUser.DepartmentID || "").toString(),
        jitbit_department_name: jitbitUser.DepartmentName || "",
        jitbit_is_admin: jitbitUser.IsAdmin.toString(),
        jitbit_disabled: jitbitUser.Disabled.toString(),
        jitbit_last_seen: formatHubSpotDate(jitbitUser.LastSeen),
        jitbit_location: jitbitUser.Location || "",
      },
    });
    logger.info(`✅ Contact Synced! HubSpot ID: ${response.id}`);
  } catch (e) {
    logger.error(`❌ Contact Sync Failed: ${e.message}`);
    if (e.response) logger.error(JSON.stringify(e.response.body, null, 2));
  }
}

async function syncTicket() {
  try {
    const response = await hubspotClient.crm.tickets.basicApi.create({
      properties: {
        subject: jitbitTicket.Subject,
        createdate: formatHubSpotDate(jitbitTicket.IssueDate),
        hs_ticket_priority: "LOW",
        content: `Category: ${jitbitTicket.Category} | Technician: ${jitbitTicket.Technician}`,

        jitbit_issue_id: jitbitTicket.IssueID.toString(),
        jitbit_status_id: jitbitTicket.StatusID.toString(),
        jitbit_status: jitbitTicket.Status || "",
        jitbit_updated_by_user: jitbitTicket.UpdatedByUser.toString(),
        jitbit_updated_by_performer: jitbitTicket.UpdatedByPerformer.toString(),
        jitbit_category_id: jitbitTicket.CategoryID.toString(),
        jitbit_user_name: jitbitTicket.UserName || "",
        jitbit_technician: jitbitTicket.Technician || "",
        jitbit_first_name: jitbitTicket.FirstName || "",
        jitbit_last_name: jitbitTicket.LastName || "",
        jitbit_due_date: formatHubSpotDate(jitbitTicket.DueDate),
        jitbit_tech_first_name: jitbitTicket.TechFirstName || "",
        jitbit_tech_last_name: jitbitTicket.TechLastName || "",
        jitbit_last_updated: formatHubSpotDate(jitbitTicket.LastUpdated),
        jitbit_updated_for_tech_view:
          jitbitTicket.UpdatedForTechView.toString(),
        jitbit_user_id: jitbitTicket.UserID.toString(),
        jitbit_company_id: jitbitTicket.CompanyID.toString(),
        jitbit_company_name: jitbitTicket.CompanyName || "",
        jitbit_assigned_to_user_id: jitbitTicket.AssignedToUserID.toString(),
        jitbit_resolved_date: formatHubSpotDate(jitbitTicket.ResolvedDate),
        jitbit_section_id: jitbitTicket.SectionID.toString(),
        jitbit_category: jitbitTicket.Category || "",
        jitbit_origin: jitbitTicket.Origin || "",
        jitbit_email: jitbitTicket.Email || "",
        jitbit_status_color: jitbitTicket.StatusColor || "",
        jitbit_last_updated_by_user_id: (
          jitbitTicket.LastUpdatedByUserID || ""
        ).toString(),
        jitbit_last_updated_username: jitbitTicket.LastUpdatedUsername || "",
        jitbit_start_date: formatHubSpotDate(jitbitTicket.StartDate),
        jitbit_time_spent_in_seconds:
          jitbitTicket.TimeSpentInSeconds.toString(),
        jitbit_ai_sentiment: jitbitTicket.AISentiment.toString(),
      },
    });
    logger.info(`✅ Ticket Synced! HubSpot ID: ${response.id}`);
  } catch (e) {
    logger.error(`❌ Ticket Sync Failed: ${e.message}`);
    if (e.response) logger.error(JSON.stringify(e.response.body, null, 2));
  }
}

// Association Type ID (Aapne verify kar liya hoga, agar "1" hai toh ye sahi hai)
const ASSOC_TYPE_ID = 1;
// ADDED: Asset Sync Function
async function syncAsset() {
  try {
    const depDate = jitbitAsset.Fields.find(
      (f) => f.FieldName === "Deployment date",
    )?.Value;
    const decDate = jitbitAsset.Fields.find(
      (f) => f.FieldName === "Decommission Date",
    )?.Value;

    const response = await hubspotClient.crm.objects.basicApi.create(
      ASSET_OBJECT_TYPE_ID,
      {
        properties: {
          model_name: jitbitAsset.ModelName,
          serial_number: jitbitAsset.SerialNumber,
          asset_type: jitbitAsset.Type,
          manufacturer: jitbitAsset.Manufacturer,
          supplier: jitbitAsset.Supplier,
          location: jitbitAsset.Location,
          quantity: jitbitAsset.Quantity.toString(),
          asset_notes: jitbitAsset.Comments,
          jitbit_asset_id: jitbitAsset.ItemID.toString(),
          jitbit_deployment_date: formatHubSpotDate(depDate),
          jitbit_decommission_date: formatHubSpotDate(decDate),
        },
      },
    );
    logger.info(`✅ Asset Synced! HubSpot ID: ${response.id}`);
  } catch (e) {
    logger.error(`❌ Asset Sync Failed: ${e.message}`);
  }
}

// 1. Sync Objects
const hsAssetId = await syncAsset();
  const hsContactId = await syncContact(); 
  const hsTicketId = await syncTicket();

  // 2. Perform Associations if IDs exist
  if (hsAssetId) {
    const batchInputs = [];

    if (hsContactId) {
      batchInputs.push({
        _from: { id: hsAssetId },
        to: { id: hsContactId },
        type: { associationCategory: "USER_DEFINED", associationTypeId: ASSOC_TYPE_ID },
      });
    }

    if (hsTicketId) {
      batchInputs.push({
        _from: { id: hsAssetId },
        to: { id: hsTicketId },
        type: { associationCategory: "USER_DEFINED", associationTypeId: ASSOC_TYPE_ID },
      });
    }

    if (batchInputs.length > 0) {
      try {
        await hubspotClient.crm.associations.v4.batchApi.create(
          ASSET_OBJECT_TYPE_ID, 
          "batch/create", 
          { inputs: batchInputs }
        );
        logger.info(`🔗 Successfully associated Asset ${hsAssetId} with entities.`);
      } catch (e) {
        logger.error(`❌ Association Failed: ${e.message}`);
      }
    }
  }
  



// ==========================================
// 3. EXECUTION (Self-invoking if run directly)
// ==========================================

async function runSync() {
  logger.info("Starting Jitbit -> HubSpot Sync Test...");
  await syncCompany();
  await syncContact();
  await syncTicket();
//   await syncAsset(); // Added
  logger.info("Sync Test Complete.");
}

// Only run this automatically if the file is executed directly
// (Useful for testing without breaking imports in other files)
if (process.argv[1] && process.argv[1].endsWith("test-sync.js")) {
  runSync();
}

export { syncCompany, syncContact, syncTicket, runSync, syncAsset };
