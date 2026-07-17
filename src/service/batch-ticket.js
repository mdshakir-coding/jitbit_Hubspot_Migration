// ...............................Full Run Code //...............................................

import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import logger from "../utils/logger.js";

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_TOKEN,
});

import {
  getTickets,
  getTicketDetails,
  getTicketCustomFields,
} from "./jitbit.services.js";

// ==========================================
// HUBSPOT PIPELINES (Total: 7)
// ==========================================
const HUBSPOT_PIPELINES = {
  CS_PIPELINE: "0",
  RENEWAL_PIPELINE: "21817499",
  CHURN_RISK: "26389570",
  NPS_OUTREACH: "88687220",
  EXTERNAL_SUPPORT: "875402356",
  PRIVACY_DATA_REQUESTS: "894131088",
  IMPLEMENTATION_SUPPORT: "907192404",
};

// ==========================================
// HUBSPOT STAGES (Total: 30)
// ==========================================
const HUBSPOT_STAGES = {
  CS_PIPELINE: { NEW: "1", WAITING_ON_CONTACT: "2", WAITING_ON_US: "3", CLOSED: "4" },
  RENEWAL_PIPELINE: { NEW: "52285808", WAITING_ON_CONTACT: "52285809", WAITING_ON_US: "52285810", CLOSED: "52285811" },
  CHURN_RISK: { IDENTIFIED: "60435217", ACTION_PLAN_CREATED: "60435218", ACTIVELY_WORKING: "60435219", STABILIZED: "60435220", CHURNING: "60472996" },
  NPS_OUTREACH: { NEW: "164633145", WAITING_ON_CONTACT: "164633146", WAITING_ON_US: "164633147", CLOSED: "164633148" },
  EXTERNAL_SUPPORT: { NEW: "1311981989", WAITING_ON_CLIENT_REPLY: "1311981990", WAITING_ON_HIP_REPLY: "1311981991", IN_PROGRESS: "1311980105", CLOSED: "1311981992" },
  PRIVACY_DATA_REQUESTS: { NEW: "1349762646", WAITING_ON_CONTACT: "1349762647", WAITING_ON_US: "1349762648", CLOSED: "1349762649" },
  IMPLEMENTATION_SUPPORT: { NEW: "1376375895", WAITING_ON_CONTACT: "1376375896", WAITING_ON_US: "1376375897", CLOSED: "1376375898" },
};

/**
 * Flattens Jitbit's "custom properties by IssueId" array into a simple
 * { FieldName: Value } lookup object.
 */
function flattenCustomFields(customFields) {
  const flat = {};
  (customFields || []).forEach((field) => {
    if (!field || !field.FieldName) return;
    flat[field.FieldName] = field.Value;
  });
  return flat;
}

/**
 * Transforms a Jitbit ticket record + its custom fields into a HubSpot
 * "Tickets" object properties payload.
 */
function transformTicket(ticketRecord, customFields) {
  const flatCustomFields = flattenCustomFields(customFields);

  const PRIORITY_MAP = { "-1": "LOW", "0": "MEDIUM", "1": "HIGH", "2": "URGENT" };
  const ORIGIN_MAP = { Email: "EMAIL", Phone: "PHONE", Chat: "CHAT", Web: "FORM", WebApp: "FORM" }; 

  const CUSTOM_FIELD_MAP = {
    Partner: "partner",
    Urgency: "urgency",
    Impact: "impact",
    Practice: "practice",
    "PM/EHR": "pm_ehr",
    "Account Manager": "account_manager",
    "Billing Manager": "billing_manager",
    "Go Live Date (if applicable)": "go_live_date",
    "Affected Component": "affected_component",
    "Patient Example(s)": "patient_examples",
    "Root Cause": "root_cause",
    "Resolution Code": "resolution_code",
    "Resolution Summary": "resolution_summary",
    "Why was that the resolution?": "why_was_that_the_resolution",
    "Config Location": "config_location",
    "Name of Config(s) Changed (separate with semicolon)": "name_of_configs_changed",
    "VoC Status": "voc_status",
    "VoC URL": "voc_url",
    "VoC Added to Ideas Board?": "voc_added_to_ideas_board",
    "3rd Party": "third_party",
    "3rd Party Ticket URL / Ticket Number": "third_party_ticket_url_ticket_number",
    "3rd Party Ticket Creation Date": "third_party_ticket_creation_date",
    "Client Satisfaction Rating": "client_satisfaction_rating",
    "Client Feedback Details": "client_feedback_details",
  };

  const DATE_ONLY_PROPERTIES = new Set(["due_date", "go_live_date", "third_party_ticket_creation_date"]);

  const ENUM_OPTIONS = {
    affected_component: [
      "3rd_party", "api_incorrect_balance_pulled", "api_interface_bridge_down", "api_interface_bridge_incorrect_data",
      "api_misc_write_back_issue", "appt_reminders_cadence_change", "appt_reminders_other", "appt_reminders_verbiage_change",
      "appt_reminders_wrong_time_not_sent", "appts_add_in", "appts_encounter_creation", "appts_incorrect_data_in_hip",
      "appts_not_enough_not_adding", "appts_status_write_back", "appts_too_many_not_cancelling", "billing_config_change",
      "billing_generation_issue", "billing_generation_request", "billing_incorrect_balance", "billing_notifications_issue",
      "billing_paper_statements", "billing_payment_plans", "config_change_add_appt_type_to_hip", "config_change_add_location_to_hip",
      "config_change_add_provider_to_hip", "config_change_platform_misc_settings", "demographics_config_change", "demographics_posting",
      "demographics_pulling_data", "documentation_implementations", "documentation_product_feature", "documentation_support_troubleshooting",
      "eci_cant_complete_check_in", "eci_config_change", "eci_incorrect_information", "eci_telehealth_config", "eci_virtual_kiosk",
      "feedback", "forms_creation", "forms_kill_re_queue", "forms_modification_to_form", "forms_not_sent", "forms_other_issue",
      "forms_posting_issue", "forms_rules_change", "hardware_kiosk_orders", "hardware_kiosk_troubleshooting", "hardware_pax_orders",
      "hardware_pax_troubleshooting", "health_ipass_app", "hip_cant_login", "hip_payment_contract_changes",
      "implementation_2_way_sms_confirm_req", "implementation_bridge_certification", "implementation_bridge_setup",
      "implementation_number_hosting_request", "implementation_number_purchase_request", "implementation_payer_mapping",
      "insurance_co_pay_value", "insurance_cost_estimator", "insurance_eligibility_status_return", "insurance_payer_mapping_update",
      "insurance_posting_issue", "insurance_rate_card_change", "insurance_rate_card_setup", "insurance_smart_deposit",
      "internal_support_account_issue", "internal_support_account_setup", "internal_support_hardware", "internal_support_mfa_issue",
      "internal_support_software", "jitbit_automations", "jitbit_client_setup", "messaging_bulk_messaging_problem",
      "messaging_bulk_messaging_request", "messaging_email_template_change", "messaging_in_clinic_message", "offboarding",
      "parent_ticket", "patient_financing", "patient_opened_ticket", "patient_portal_incorrect_info", "patient_portal_login_or_auth_fail",
      "patient_portal_patient_wallet", "patient_self_scheduling", "payments_config_change", "payments_modification", "payments_posting",
      "payments_processing", "q_a", "reports_custom_generation_request", "reports_generation_error", "reports_incorrect_data",
      "sales_demo_build", "sales_demo_config_update", "sftp", "sphere_credential_issues", "training", "user_interface_admin_ui",
      "user_interface_check_in", "user_interface_dashboard", "user_interface_other_patient_ui", "user_interface_patient_eci",
      "user_interface_patient_portal", "user_interface_patient360", "user_interface_reports", "users_enable_disable_sso",
      "users_new_modify_user", "users_password_reset", "users_unable_to_sign_in", "voc"
    ],
    urgency: ["1 High - inability to perform work", "2 Medium - impaired but can still work", "3 Low - inconvenient but not broken"],
    impact: ["1 High - > 15 users/patients affected", "2 Med - > 5 users/patients affected", "3 Low - < 5 users/patients affected"],
    voc_added_to_ideas_board: ["N/A", "NO", "YES"],
    voc_status: ["Accepted", "Completed", "Denied", "In Progress", "In Review", "None or N/A", "Submitted", "VoC Priority"],
    root_cause: ["3rd Party", "API Testing", "Bill Balance Incorrect", "Bill Generation Failure", "Bill Generation Request", "Bug", "Client Training", "Code change (Use case gap)", "Config Update Requested", "Documentation", "Form Creation / Edit", "Form Posting Failure / Other Form Issue", "HiP Proactive Communication", "HiP SaaS Contract", "HiP Training", "HW Failure", "HW Request", "Internal Request", "Jitbit Change or Addition", "Kill & Re-queue", "Misconfiguration", "Onboarding", "Operations", "Patient Mistake", "Patient Ticket", "Practice Mistake/Oversight", "Q/A", "Timeout", "Unknown at this time", "VoC"],
    resolution_code: ["3rd Party Fix", "API Testing", "Bug fix", "CANT Be Resolved / No Resolution", "Client Resolved Issue", "Client Training", "Config Change", "Database Edit", "Documentation", "Executed New Agreement", "Form Creation / Edit", "Form Q/A & Validation", "Full Appt Load", "HiP Training", "Hotfix", "HW Fix", "HW Net New", "HW Replacement", "HW Return", "Jitbit Change or Addition", "Kill & Re-queue", "Number Purchased", "Offboarding", "Onboarding", "Operations", "Parent Ticket", "Patient Ticket", "Payer Mapping", "Postman Data Pull", "Practice Mistake", "Question / Concern Answered", "Retry w/o Changes", "Spam / Vendor Email", "Use case gap (New Code)", "User Creation / Edit / PW Reset", "VoC"],
    third_party: ["Amazon Web Services", "Artera", "Athena", "CTS", "eCW", "Ellkay", "ERO", "Exscribe", "Formstack", "Google", "GreenWay", "HealthTalk AI", "Instamed", "Issuing Bank", "Klara", "Linux VPN", "MedEvolve", "ModMed", "MotionMD", "N/A", "Nextech", "NextGen", "POS", "Practice / Client", "PrognoCIS", "Relatient", "Rippling", "Sendgrid", "Soti MobiControl", "Televox", "TransUnion/FinThrive", "TrustCommerce / Sphere", "Twilio", "Veradigm/Allscripts", "Visit Pay", "WorldPay / Vantiv", "xBridge", "Zinniax"]
  };

  const PASSTHROUGH_ENUM_PROPERTIES = new Set(["practice"]);
  const SLUGIFIED_ENUM_PROPERTIES = new Set(["affected_component"]);

  const normalize = (s) => String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const slugify = (s) => String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

  const resolveEnumValue = (hsProperty, rawValue) => {
    if (SLUGIFIED_ENUM_PROPERTIES.has(hsProperty)) {
      const slug = slugify(rawValue);
      return ENUM_OPTIONS[hsProperty]?.includes(slug) ? slug : null;
    }
    if (PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty)) return String(rawValue).trim();
    const options = ENUM_OPTIONS[hsProperty];
    if (!options) return rawValue;
    const normRaw = normalize(rawValue);
    const match = options.find((opt) => normalize(opt) === normRaw);
    return match ?? null;
  };

  const toMidnightUTC = (isoString) => isoString ? `${isoString.split("T")[0]}T00:00:00.000Z` : null;

  let targetPipeline = HUBSPOT_PIPELINES.CS_PIPELINE;
  let targetStage = HUBSPOT_STAGES.CS_PIPELINE.NEW;

  if (ticketRecord.Category && ticketRecord.Category.includes("Hardware")) {
    targetPipeline = HUBSPOT_PIPELINES.EXTERNAL_SUPPORT;
    targetStage = HUBSPOT_STAGES.EXTERNAL_SUPPORT.NEW;
  } else if (ticketRecord.Category && ticketRecord.Category.includes("Implementation")) {
    targetPipeline = HUBSPOT_PIPELINES.IMPLEMENTATION_SUPPORT;
    targetStage = HUBSPOT_STAGES.IMPLEMENTATION_SUPPORT.NEW;
  }

  const mappedProperties = {
    hs_pipeline: targetPipeline,
    hs_pipeline_stage: targetStage,
    issue_id: ticketRecord.IssueID.toString(),
    subject: ticketRecord.Subject,
    createdate: ticketRecord.IssueDate,
  };

  if (ticketRecord.DueDate) mappedProperties.due_date = toMidnightUTC(ticketRecord.DueDate);
  if (ticketRecord.ResolvedDate) mappedProperties.closed_date = ticketRecord.ResolvedDate;
  if (ticketRecord.Priority !== undefined && PRIORITY_MAP.hasOwnProperty(ticketRecord.Priority)) mappedProperties.hs_ticket_priority = PRIORITY_MAP[ticketRecord.Priority];
  if (ticketRecord.Origin && ORIGIN_MAP[ticketRecord.Origin]) mappedProperties.source_type = ORIGIN_MAP[ticketRecord.Origin];

  const skippedFields = [];
  Object.entries(CUSTOM_FIELD_MAP).forEach(([jitbitFieldName, hsProperty]) => {
    const rawValue = flatCustomFields[jitbitFieldName];
    if (rawValue === null || rawValue === undefined || rawValue === "") return;

    if (DATE_ONLY_PROPERTIES.has(hsProperty)) {
      mappedProperties[hsProperty] = toMidnightUTC(rawValue);
      return;
    }
    const isTrackedEnum = ENUM_OPTIONS[hsProperty] || PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty);
    if (isTrackedEnum) {
      const resolved = resolveEnumValue(hsProperty, rawValue);
      if (resolved === null) {
        skippedFields.push({ hsProperty, rawValue });
        return;
      }
      mappedProperties[hsProperty] = resolved;
      return;
    }
    mappedProperties[hsProperty] = rawValue;
  });

  if (skippedFields.length) {
    logger.warn(`⚠️ Skipped ${skippedFields.length} unmatched enum value(s) for ticket ${ticketRecord.IssueID}`);
  }

  return mappedProperties;
}

// ==========================================
// 2. Prepare Payload (Replaces single sync/create)
// ==========================================
async function prepareTicketForBatch(ticketRecord) {
  if (!ticketRecord || !ticketRecord.IssueID) return null;

  const issueId = ticketRecord.IssueID;
  const subject = ticketRecord.Subject;

  // 1. Check if Ticket Exists
  try {
    const searchResponse = await hubspotClient.crm.tickets.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            { propertyName: "issue_id", operator: "EQ", value: issueId.toString() }
            // { propertyName: "subject", operator: "EQ", value: subject }
          ]
        }
      ]
    });
    if (searchResponse.results && searchResponse.results.length > 0) {
        // logger.info(`⏭️ Ticket already exists in HubSpot (IssueID: ${issueId}, Subject: "${subject}"). Skipping...`); 
      logger.info(`⏭️ Ticket already exists (IssueID: ${issueId}). Skipping...`);
      return null;
    }
  } catch (error) {
    logger.error(`❌ HubSpot Search Failed for IssueID ${issueId}: ${error.message}`);
    return null; 
  }

  // 2. Map Properties
  let customFields = [];
  try {
    customFields = await getTicketCustomFields(issueId);
  } catch (err) {
    logger.error(`⚠️ Failed to fetch custom fields: ${err.message}`);
  }

  const properties = transformTicket(ticketRecord, customFields);
  const associations = [];

  // 3. Search and Append Associations if they exist
  if (ticketRecord.Email) {
    try {
      const contactSearch = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: ticketRecord.Email }] }]
      });
      if (contactSearch.results.length > 0) {
        associations.push({
          to: { id: contactSearch.results[0].id },
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 }] // Ticket -> Contact
        });
      }
    } catch (err) {}
  }

  if (ticketRecord.CompanyName) {
    try {
      const companySearch = await hubspotClient.crm.companies.searchApi.doSearch({
        filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: ticketRecord.CompanyName }] }]
      });
      if (companySearch.results.length > 0) {
        associations.push({
          to: { id: companySearch.results[0].id },
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 }] // Ticket -> Company
        });
      }
    } catch (err) {}
  }

  // Final payload for this iteration matching the batch creation JSON struct
  const batchInput = { properties };
  if (associations.length > 0) {
    batchInput.associations = associations;
  }

  return batchInput;
}

// ==========================================
// 3. Main Runner: Sync & Batch Upload
// ==========================================
async function syncAllTickets() {
  try {
    logger.info("📡 Fetching ALL tickets from Jitbit...");
    
    // Fetch all tickets array dynamically from your service
    const tickets = await getTickets();

    if (!tickets || tickets.length === 0) {
      logger.info("ℹ️ No tickets found to sync.");
      return;
    }

    logger.info(`📦 Found ${tickets.length} tickets. Preparing properties & associations for batch upload...`);

    const batchInputs = [];

    // Collect valid payloads for the batch
    for (const ticket of tickets) {
      const input = await prepareTicketForBatch(ticket);
      if (input) {
        batchInputs.push(input);
      }
    }

    if (batchInputs.length === 0) {
      logger.info("ℹ️ All tickets already exist or failed. Nothing to create.");
      return;
    }

    logger.info(`🚀 Starting batch creation for ${batchInputs.length} new tickets...`);

    // HubSpot's Batch Creation Limit is strictly 100 items per request
    const CHUNK_SIZE = 100;
    
    for (let i = 0; i < batchInputs.length; i += CHUNK_SIZE) {
      const chunk = batchInputs.slice(i, i + CHUNK_SIZE);
      
      try {
        const batchResponse = await hubspotClient.crm.tickets.batchApi.create({
          inputs: chunk
        });
        
        logger.info(`✅ Successfully batched and created chunk ${Math.floor(i / CHUNK_SIZE) + 1} (${chunk.length} tickets)`);
      } catch (error) {
        logger.error(`❌ Batch Creation Failed for chunk ${Math.floor(i / CHUNK_SIZE) + 1}: ${error.message}`);
      }
    }

    logger.info("🎉 Full sync operation completed successfully!");

  } catch (error) {
    logger.error(`❌ Global Sync Error: ${error.message}`);
  }
}

// Run the main process
syncAllTickets();