


// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// import {
//   getTickets,
//   getTicketDetails,
//   getTicketCustomFields,
// } from "./jitbit.services.js";

// // ==========================================
// // CACHE TO SPEED UP API CALLS MASSIVELY
// // ==========================================
// const contactCache = new Map();
// const companyCache = new Map();

// // ==========================================
// // ANTI-RATE LIMIT RETRY HELPER (NEW)
// // ==========================================
// // Yeh function 429 aane par automatically wait karke retry karega
// async function executeWithRetry(apiFunc, maxRetries = 3) {
//   let attempt = 0;
//   while (attempt < maxRetries) {
//     try {
//       return await apiFunc();
//     } catch (error) {
//       const isRateLimit = 
//         error.code === 429 || 
//         (error.response && error.response.statusCode === 429) || 
//         error.message.includes('429') || 
//         error.message.includes('RATE_LIMIT');

//       if (isRateLimit) {
//         attempt++;
//         const delay = attempt * 1500; // 1.5s, 3s, 4.5s wait karega
//         logger.warn(`⏳ Rate Limit Hit (429). Auto-pausing for ${delay/1000}s before retry ${attempt}...`);
//         await new Promise(resolve => setTimeout(resolve, delay));
//       } else {
//         throw error; // Koi aur bada error ho toh throw kare
//       }
//     }
//   }
//   throw new Error("Max retries reached due to rate limits.");
// }

// // ==========================================
// // HUBSPOT PIPELINES (Total: 7)
// // ==========================================
// const HUBSPOT_PIPELINES = {
//   CS_PIPELINE: "0",
//   RENEWAL_PIPELINE: "21817499",
//   CHURN_RISK: "26389570",
//   NPS_OUTREACH: "88687220",
//   EXTERNAL_SUPPORT: "875402356",
//   PRIVACY_DATA_REQUESTS: "894131088",
//   IMPLEMENTATION_SUPPORT: "907192404",
// };

// const HUBSPOT_STAGES = {
//   CS_PIPELINE: { NEW: "1", WAITING_ON_CONTACT: "2", WAITING_ON_US: "3", CLOSED: "4" },
//   RENEWAL_PIPELINE: { NEW: "52285808", WAITING_ON_CONTACT: "52285809", WAITING_ON_US: "52285810", CLOSED: "52285811" },
//   CHURN_RISK: { IDENTIFIED: "60435217", ACTION_PLAN_CREATED: "60435218", ACTIVELY_WORKING: "60435219", STABILIZED: "60435220", CHURNING: "60472996" },
//   NPS_OUTREACH: { NEW: "164633145", WAITING_ON_CONTACT: "164633146", WAITING_ON_US: "164633147", CLOSED: "164633148" },
//   EXTERNAL_SUPPORT: { NEW: "1311981989", WAITING_ON_CLIENT_REPLY: "1311981990", WAITING_ON_HIP_REPLY: "1311981991", IN_PROGRESS: "1311980105", CLOSED: "1311981992" },
//   PRIVACY_DATA_REQUESTS: { NEW: "1349762646", WAITING_ON_CONTACT: "1349762647", WAITING_ON_US: "1349762648", CLOSED: "1349762649" },
//   IMPLEMENTATION_SUPPORT: { NEW: "1376375895", WAITING_ON_CONTACT: "1376375896", WAITING_ON_US: "1376375897", CLOSED: "1376375898" },
// };

// function flattenCustomFields(customFields) {
//   const flat = {};
//   (customFields || []).forEach((field) => {
//     if (!field || !field.FieldName) return;
//     flat[field.FieldName] = field.Value;
//   });
//   return flat;
// }

// function transformTicket(ticketRecord, customFields) {
//   const flatCustomFields = flattenCustomFields(customFields);

//   const PRIORITY_MAP = { "-1": "LOW", "0": "MEDIUM", "1": "HIGH", "2": "URGENT" };
//   const ORIGIN_MAP = { Email: "EMAIL", Phone: "PHONE", Chat: "CHAT", Web: "FORM", WebApp: "FORM" }; 

//   const CUSTOM_FIELD_MAP = {
//     Partner: "partner", Urgency: "urgency", Impact: "impact", Practice: "practice",
//     "PM/EHR": "pm_ehr", "Account Manager": "account_manager", "Billing Manager": "billing_manager",
//     "Go Live Date (if applicable)": "go_live_date", "Affected Component": "affected_component",
//     "Patient Example(s)": "patient_examples", "Root Cause": "root_cause", "Resolution Code": "resolution_code",
//     "Resolution Summary": "resolution_summary", "Why was that the resolution?": "why_was_that_the_resolution",
//     "Config Location": "config_location", "Name of Config(s) Changed (separate with semicolon)": "name_of_configs_changed",
//     "VoC Status": "voc_status", "VoC URL": "voc_url", "VoC Added to Ideas Board?": "voc_added_to_ideas_board",
//     "3rd Party": "third_party", "3rd Party Ticket URL / Ticket Number": "third_party_ticket_url_ticket_number",
//     "3rd Party Ticket Creation Date": "third_party_ticket_creation_date", "Client Satisfaction Rating": "client_satisfaction_rating",
//     "Client Feedback Details": "client_feedback_details",
//   };

//   const DATE_ONLY_PROPERTIES = new Set(["due_date", "go_live_date", "third_party_ticket_creation_date"]);

//   const ENUM_OPTIONS = {
//     practice: [
//       "AAIA", "AHC", "AHI", "AID", "ALTNEC", "AMC", "AMG", "AR-ACH", "AR-AIH", "AR-ALT", "AR-ANHC", 
//       "AR-APC", "AR-APW", "AR-BSTY", "AR-CBHC", "AR-CCR", "AR-CFHC", "AR-CMP", "AR-COMP", "AR-DRCHC", 
//       "AR-DVP", "AR-EA", "AR-EH", "AR-EMG", "AR-FSA", "AR-GWM", "AR-HDMG", "AR-HPN-CC", "AR-HPN-CHS", 
//       "AR-HPN-DOHC", "AR-HPN-VV", "AR-ICC", "AR-KOC", "AR-LCH", "AR-LINC", "AR-NMA-P", "AR-NMA-T", 
//       "AR-OOA", "AR-OSP", "AR-POASNJ", "AR-PTH", "AR-PTHA", "AR-SAMA", "AR-SFMA", "ART", "AR-TMP", 
//       "AR-TSOP", "AR-WCC", "AR-WCHC", "ASNDBX", "AU", "AZLA", "BAA", "BCFWC", "BFD", "BMMS", "BMMSA", 
//       "BOWEN", "BUC", "CBSI", "CCN", "CD", "CDCSC", "CFVV", "CGT", "CHS", "CIPA", "CMG", "COAAC", 
//       "COC", "COG", "COGW", "CPSSNDBX", "CRH", "CSMG", "CUMC", "CWE", "CWHC", "DAL", "DAWM", "DDS", 
//       "DEO", "DEOA", "DGC", "DMS", "DSC", "DSP", "ECW", "ECWN", "EDE", "EIT", "ELO", "EMOG", "EPCS", 
//       "EPIC", "ESCL", "EVENT", "FDRX", "FGUP", "GCU", "GIT", "GLEC", "GLSC", "GNV", "GNV-VC", 
//       "GNV-VC-AZ", "GNV-VC-FL", "GSFA", "GTP", "GTWELL", "GWPS", "GWPSSNDBX", "GWPST", 
//       "HiP - Health iPASS", "HIPTC", "HLC", "HPT", "HSC", "HSC-A", "HVSC", "ICMG", "IMA", "JYI", 
//       "K-ABS", "K-ACS", "K-AO", "K-APC", "K-BEC", "K-BFH", "K-BFP", "K-BWH", "K-CCN", "K-CFPG", 
//       "K-CH", "K-CHP", "K-CIPA", "K-CL", "K-CMC", "K-CSNE", "K-CWH", "K-DBMG", "K-DMMD", "K-DND", 
//       "K-EBM", "K-EC", "K-EDEC", "K-EPC", "K-FAC", "K-FECV", "K-FH", "K-FWHS", "K-GC", "K-GPS", 
//       "K-GSA", "K-HMH", "K-HMM", "K-LKMD", "K-LPFM", "K-LSN", "K-MHPC", "K-NYC", "K-OBASA", "K-OHW", 
//       "K-OPSC", "K-OWGSC", "K-PA", "K-PC", "K-PGTW", "K-PM", "K-PP", "K-ROOT", "K-RSDS", "K-SD", 
//       "K-SEARK", "K-SGHP", "K-SP", "K-SSC", "K-SWC", "KT", "K-TDG", "K-VG", "LAMVA", "LAO", "LBJI", 
//       "LCO", "LHOA", "LOC", "MBJI", "MGM", "MMG", "MOC", "MOS", "MPS", "MSAO", "MSK", "Multiple", 
//       "N/A", "NAED", "ND", "NSD", "NSENT", "NST", "NWP1", "NYDG", "OBGA", "OCOK", "OCOSI", "OFH", 
//       "OLYD", "OMP", "ONE", "ORC", "ORI", "OSI", "OSMRC", "OTA", "PAA", "PAP", "Parent Ticket", 
//       "PEDA", "PHS", "PHYCIN", "PNSM", "POA", "POASNJ", "POSM", "POSMC", "PPC", "PSA", "PTHA", 
//       "QCENT", "R-ADS", "R-AOC", "R-AONE", "RAPPORE", "R-BST", "REVO / iHealth", "RFU", "RFUH", 
//       "RJH", "R-MAA", "RMMC", "R-NYS", "R-OARK", "R-OO", "R-ROC", "R-WMHS", "SAO", "SASC", "SBOA", 
//       "SDN", "SEVG", "SHG", "SHOT", "SKI", "SMS", "SOSM", "SPLG", "SSO", "STOC", "SWGA", "SWGE", 
//       "TEAM", "TG", "TGS", "TMG", "TOA", "TPC", "TPCC", "TRG", "TSO", "TV-DJP", "UAS", "UCMV", "UOC", 
//       "VCH", "VFC", "VIP", "VISD", "VOH", "VPFW", "WGF", "WWH", "yy - Klara (test)"
//     ],
//     affected_component: [
//       "3rd_party", "api_incorrect_balance_pulled", "api_interface_bridge_down", "api_interface_bridge_incorrect_data",
//       "api_misc_write_back_issue", "appt_reminders_cadence_change", "appt_reminders_other", "appt_reminders_verbiage_change",
//       "appt_reminders_wrong_time_not_sent", "appts_add_in", "appts_encounter_creation", "appts_incorrect_data_in_hip",
//       "appts_not_enough_not_adding", "appts_status_write_back", "appts_too_many_not_cancelling", "billing_config_change",
//       "billing_generation_issue", "billing_generation_request", "billing_incorrect_balance", "billing_notifications_issue",
//       "billing_paper_statements", "billing_payment_plans", "config_change_add_appt_type_to_hip", "config_change_add_location_to_hip",
//       "config_change_add_provider_to_hip", "config_change_platform_misc_settings", "demographics_config_change", "demographics_posting",
//       "demographics_pulling_data", "documentation_implementations", "documentation_product_feature", "documentation_support_troubleshooting",
//       "eci_cant_complete_check_in", "eci_config_change", "eci_incorrect_information", "eci_telehealth_config", "eci_virtual_kiosk",
//       "feedback", "forms_creation", "forms_kill_re_queue", "forms_modification_to_form", "forms_not_sent", "forms_other_issue",
//       "forms_posting_issue", "forms_rules_change", "hardware_kiosk_orders", "hardware_kiosk_troubleshooting", "hardware_pax_orders",
//       "hardware_pax_troubleshooting", "health_ipass_app", "hip_cant_login", "hip_payment_contract_changes",
//       "implementation_2_way_sms_confirm_req", "implementation_bridge_certification", "implementation_bridge_setup",
//       "implementation_number_hosting_request", "implementation_number_purchase_request", "implementation_payer_mapping",
//       "insurance_co_pay_value", "insurance_cost_estimator", "insurance_eligibility_status_return", "insurance_payer_mapping_update",
//       "insurance_posting_issue", "insurance_rate_card_change", "insurance_rate_card_setup", "insurance_smart_deposit",
//       "internal_support_account_issue", "internal_support_account_setup", "internal_support_hardware", "internal_support_mfa_issue",
//       "internal_support_software", "jitbit_automations", "jitbit_client_setup", "messaging_bulk_messaging_problem",
//       "messaging_bulk_messaging_request", "messaging_email_template_change", "messaging_in_clinic_message", "offboarding",
//       "parent_ticket", "patient_financing", "patient_opened_ticket", "patient_portal_incorrect_info", "patient_portal_login_or_auth_fail",
//       "patient_portal_patient_wallet", "patient_self_scheduling", "payments_config_change", "payments_modification", "payments_posting",
//       "payments_processing", "q_a", "reports_custom_generation_request", "reports_generation_error", "reports_incorrect_data",
//       "sales_demo_build", "sales_demo_config_update", "sftp", "sphere_credential_issues", "training", "user_interface_admin_ui",
//       "user_interface_check_in", "user_interface_dashboard", "user_interface_other_patient_ui", "user_interface_patient_eci",
//       "user_interface_patient_portal", "user_interface_patient360", "user_interface_reports", "users_enable_disable_sso",
//       "users_new_modify_user", "users_password_reset", "users_unable_to_sign_in", "voc"
//     ],
//     urgency: ["1 High - inability to perform work", "2 Medium - impaired but can still work", "3 Low - inconvenient but not broken"],
//     impact: ["1 High - > 15 users/patients affected", "2 Med - > 5 users/patients affected", "3 Low - < 5 users/patients affected"],
//     voc_added_to_ideas_board: ["N/A", "NO", "YES"],
//     voc_status: ["Accepted", "Completed", "Denied", "In Progress", "In Review", "None or N/A", "Submitted", "VoC Priority"],
//     root_cause: ["3rd Party", "API Testing", "Bill Balance Incorrect", "Bill Generation Failure", "Bill Generation Request", "Bug", "Client Training", "Code change (Use case gap)", "Config Update Requested", "Documentation", "Form Creation / Edit", "Form Posting Failure / Other Form Issue", "HiP Proactive Communication", "HiP SaaS Contract", "HiP Training", "HW Failure", "HW Request", "Internal Request", "Jitbit Change or Addition", "Kill & Re-queue", "Misconfiguration", "Onboarding", "Operations", "Patient Mistake", "Patient Ticket", "Practice Mistake/Oversight", "Q/A", "Timeout", "Unknown at this time", "VoC"],
//     resolution_code: ["3rd Party Fix", "API Testing", "Bug fix", "CANT Be Resolved / No Resolution", "Client Resolved Issue", "Client Training", "Config Change", "Database Edit", "Documentation", "Executed New Agreement", "Form Creation / Edit", "Form Q/A & Validation", "Full Appt Load", "HiP Training", "Hotfix", "HW Fix", "HW Net New", "HW Replacement", "HW Return", "Jitbit Change or Addition", "Kill & Re-queue", "Number Purchased", "Offboarding", "Onboarding", "Operations", "Parent Ticket", "Patient Ticket", "Payer Mapping", "Postman Data Pull", "Practice Mistake", "Question / Concern Answered", "Retry w/o Changes", "Spam / Vendor Email", "Use case gap (New Code)", "User Creation / Edit / PW Reset", "VoC"],
//     third_party: ["Amazon Web Services", "Artera", "Athena", "CTS", "eCW", "Ellkay", "ERO", "Exscribe", "Formstack", "Google", "GreenWay", "HealthTalk AI", "Instamed", "Issuing Bank", "Klara", "Linux VPN", "MedEvolve", "ModMed", "MotionMD", "N/A", "Nextech", "NextGen", "POS", "Practice / Client", "PrognoCIS", "Relatient", "Rippling", "Sendgrid", "Soti MobiControl", "Televox", "TransUnion/FinThrive", "TrustCommerce / Sphere", "Twilio", "Veradigm/Allscripts", "Visit Pay", "WorldPay / Vantiv", "xBridge", "Zinniax"]
//   };

//   const PASSTHROUGH_ENUM_PROPERTIES = new Set([]);
//   const SLUGIFIED_ENUM_PROPERTIES = new Set(["affected_component"]);

//   const normalize = (s) => String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
//   const slugify = (s) => String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

//   const resolveEnumValue = (hsProperty, rawValue) => {
//     if (SLUGIFIED_ENUM_PROPERTIES.has(hsProperty)) {
//       const slug = slugify(rawValue);
//       return ENUM_OPTIONS[hsProperty]?.includes(slug) ? slug : null;
//     }
//     if (PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty)) return String(rawValue).trim();
//     const options = ENUM_OPTIONS[hsProperty];
//     if (!options) return rawValue;
//     const normRaw = normalize(rawValue);
//     const match = options.find((opt) => normalize(opt) === normRaw);
//     return match ?? null;
//   };

//   const toMidnightUTC = (isoString) => isoString ? `${isoString.split("T")[0]}T00:00:00.000Z` : null;

//   let targetPipeline = HUBSPOT_PIPELINES.CS_PIPELINE;
//   let targetStage = HUBSPOT_STAGES.CS_PIPELINE.NEW;

//   if (ticketRecord.Category && ticketRecord.Category.includes("Hardware")) {
//     targetPipeline = HUBSPOT_PIPELINES.EXTERNAL_SUPPORT;
//     targetStage = HUBSPOT_STAGES.EXTERNAL_SUPPORT.NEW;
//   } else if (ticketRecord.Category && ticketRecord.Category.includes("Implementation")) {
//     targetPipeline = HUBSPOT_PIPELINES.IMPLEMENTATION_SUPPORT;
//     targetStage = HUBSPOT_STAGES.IMPLEMENTATION_SUPPORT.NEW;
//   }

//   const mappedProperties = {
//     hs_pipeline: targetPipeline,
//     hs_pipeline_stage: targetStage,
//     issue_id: ticketRecord.IssueID.toString(),
//     subject: ticketRecord.Subject,
//     createdate: ticketRecord.IssueDate,
//     sourceid: String(ticketRecord.IssueID),
//   };

//   if (ticketRecord.DueDate) mappedProperties.due_date = toMidnightUTC(ticketRecord.DueDate);
//   if (ticketRecord.ResolvedDate) mappedProperties.closed_date = ticketRecord.ResolvedDate;
//   if (ticketRecord.Priority !== undefined && PRIORITY_MAP.hasOwnProperty(ticketRecord.Priority)) mappedProperties.hs_ticket_priority = PRIORITY_MAP[ticketRecord.Priority];
//   if (ticketRecord.Origin && ORIGIN_MAP[ticketRecord.Origin]) mappedProperties.source_type = ORIGIN_MAP[ticketRecord.Origin];

//   const skippedFields = [];
//   Object.entries(CUSTOM_FIELD_MAP).forEach(([jitbitFieldName, hsProperty]) => {
//     const rawValue = flatCustomFields[jitbitFieldName];
//     if (rawValue === null || rawValue === undefined || rawValue === "") return;

//     if (DATE_ONLY_PROPERTIES.has(hsProperty)) {
//       mappedProperties[hsProperty] = toMidnightUTC(rawValue);
//       return;
//     }
//     const isTrackedEnum = ENUM_OPTIONS[hsProperty] || PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty);
//     if (isTrackedEnum) {
//       const resolved = resolveEnumValue(hsProperty, rawValue);
//       if (resolved === null) {
//         skippedFields.push({ hsProperty, rawValue });
//         return;
//       }
//       mappedProperties[hsProperty] = resolved;
//       return;
//     }
//     mappedProperties[hsProperty] = rawValue;
//   });

//   return mappedProperties;
// }

// // ==========================================
// // 2. Prepare Payload (With Retry & Caching)
// // ==========================================
// async function prepareTicketForBatch(ticketRecord) {
//   if (!ticketRecord || !ticketRecord.IssueID) return null;

//   const issueId = ticketRecord.IssueID;

//   // Duplicate Check WITH RETRY
//   try {
//     const searchResponse = await executeWithRetry(() => 
//       hubspotClient.crm.tickets.searchApi.doSearch({
//         filterGroups: [{ filters: [{ propertyName: "issue_id", operator: "EQ", value: issueId.toString() }] }]
//       })
//     );

//     if (searchResponse && searchResponse.results && searchResponse.results.length > 0) {
//       logger.info(`⏭️ Ticket already exists (IssueID: ${issueId}). Skipping...`);
//       return null; 
//     }
//   } catch (error) {
//     logger.error(`❌ HubSpot Ticket Search Failed for IssueID ${issueId}: ${error.message}`);
//     return null; 
//   }

//   // Fetch Custom Fields
//   let customFields = [];
//   try {
//     customFields = await getTicketCustomFields(issueId);
//   } catch (err) {
//     logger.error(`⚠️ Failed to fetch custom fields for ${issueId}: ${err.message}`);
//   }

//   const properties = transformTicket(ticketRecord, customFields);
//   const associations = [];

//   // Contact Search WITH RETRY & CACHE
//   if (ticketRecord.Email) {
//     const email = ticketRecord.Email.toLowerCase();
//     if (contactCache.has(email)) {
//       const cachedId = contactCache.get(email);
//       if (cachedId) associations.push({ to: { id: cachedId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 }] });
//     } else {
//       try {
//         const contactSearch = await executeWithRetry(() => 
//           hubspotClient.crm.contacts.searchApi.doSearch({
//             filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }]
//           })
//         );
//         if (contactSearch && contactSearch.results.length > 0) {
//           const contactId = contactSearch.results[0].id;
//           contactCache.set(email, contactId);
//           associations.push({ to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 }] });
//         } else {
//           contactCache.set(email, null); 
//         }
//       } catch (err) {}
//     }
//   }

//   // Company Search WITH RETRY & CACHE
//   if (ticketRecord.CompanyName) {
//     const companyName = ticketRecord.CompanyName.toLowerCase();
//     if (companyCache.has(companyName)) {
//       const cachedId = companyCache.get(companyName);
//       if (cachedId) associations.push({ to: { id: cachedId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 }] });
//     } else {
//       try {
//         const companySearch = await executeWithRetry(() => 
//           hubspotClient.crm.companies.searchApi.doSearch({
//             filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: ticketRecord.CompanyName }] }]
//           })
//         );
//         if (companySearch && companySearch.results.length > 0) {
//           const compId = companySearch.results[0].id;
//           companyCache.set(companyName, compId);
//           associations.push({ to: { id: compId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 }] });
//         } else {
//           companyCache.set(companyName, null); 
//         }
//       } catch (err) {}
//     }
//   }

//   const batchInput = { properties };
//   if (associations.length > 0) {
//     batchInput.associations = associations;
//   }
  
//   return batchInput;
// }

// // ==========================================
// // 3. Main Runner: Parallel Sync & Batch Upload
// // ==========================================
// async function syncAllTickets() {
//   try {
//     logger.info("📡 Fetching ALL tickets from Jitbit...");
    
//     const allTickets = await getTickets();

//     if (!allTickets || allTickets.length === 0) {
//       logger.info("ℹ️ No tickets found to sync.");
//       return;
//     }

//     // ===============================================
//     // START FROM A SPECIFIC INDEX TO SKIP UPLOADED ONES
//     // ===============================================
//     const START_INDEX = 3700;
//     const tickets = allTickets.slice(START_INDEX);

//     logger.info(`📦 Total ${allTickets.length} tickets found. Skipping first ${START_INDEX} tickets...`);
//     logger.info(`🚀 Processing remaining ${tickets.length} tickets in FAST PARALLEL mode...`);

//     let batchInputs = [];
//     let totalCreatedThisSession = 0;
    
//     const BATCH_UPLOAD_LIMIT = 100;
    
//     // Concurrency thodi kam ki hai taaki HubSpot gussa na ho
//     const CONCURRENCY_LIMIT = 3; 

//     for (let i = 0; i < tickets.length; i += CONCURRENCY_LIMIT) {
//       const chunkToPrepare = tickets.slice(i, i + CONCURRENCY_LIMIT);
      
//       const preparedResults = await Promise.all(
//         chunkToPrepare.map(async (ticket) => {
//           return await prepareTicketForBatch(ticket);
//         })
//       );

//       for (const result of preparedResults) {
//         if (result) {
//           batchInputs.push(result);
//         }
//       }

//       if (batchInputs.length >= BATCH_UPLOAD_LIMIT || (i + CONCURRENCY_LIMIT >= tickets.length && batchInputs.length > 0)) {
        
//         const itemsToUpload = batchInputs.splice(0, BATCH_UPLOAD_LIMIT);
        
//         try {
//           logger.info(`🚀 Firing batch creation for ${itemsToUpload.length} tickets to HubSpot...`);
          
//           await executeWithRetry(() => 
//             hubspotClient.crm.tickets.batchApi.create({
//               inputs: itemsToUpload
//             })
//           );
          
//           totalCreatedThisSession += itemsToUpload.length;
//           logger.info(`✅ Successfully batched and created! (Total Created THIS SESSION: ${totalCreatedThisSession})`);
//         } catch (error) {
//           logger.error(`❌ Batch Creation Failed: ${error.message}`);
//         }
//       }

//       // Slightly larger delay to balance speed and stability
//       await new Promise(resolve => setTimeout(resolve, 350));
//     }

//     logger.info(`🎉 Full sync operation completed successfully! Total Tickets Uploaded this session: ${totalCreatedThisSession}`);

//   } catch (error) {
//     logger.error(`❌ Global Sync Error: ${error.message}`);
//   }
// }

// // Run the main process
// syncAllTickets();




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
// CACHE TO SPEED UP API CALLS MASSIVELY
// ==========================================
const contactCache = new Map();
const companyCache = new Map();

// ==========================================
// ANTI-RATE LIMIT RETRY HELPER (NEW)
// ==========================================
// Yeh function 429 aane par automatically wait karke retry karega
async function executeWithRetry(apiFunc, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await apiFunc();
    } catch (error) {
      const isRateLimit = 
        error.code === 429 || 
        (error.response && error.response.statusCode === 429) || 
        error.message.includes('429') || 
        error.message.includes('RATE_LIMIT');

      if (isRateLimit) {
        attempt++;
        const delay = attempt * 1500; // 1.5s, 3s, 4.5s wait karega
        logger.warn(`⏳ Rate Limit Hit (429). Auto-pausing for ${delay/1000}s before retry ${attempt}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Koi aur bada error ho toh throw kare
      }
    }
  }
  throw new Error("Max retries reached due to rate limits.");
}

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

const HUBSPOT_STAGES = {
  CS_PIPELINE: { NEW: "1", WAITING_ON_CONTACT: "2", WAITING_ON_US: "3", CLOSED: "4" },
  RENEWAL_PIPELINE: { NEW: "52285808", WAITING_ON_CONTACT: "52285809", WAITING_ON_US: "52285810", CLOSED: "52285811" },
  CHURN_RISK: { IDENTIFIED: "60435217", ACTION_PLAN_CREATED: "60435218", ACTIVELY_WORKING: "60435219", STABILIZED: "60435220", CHURNING: "60472996" },
  NPS_OUTREACH: { NEW: "164633145", WAITING_ON_CONTACT: "164633146", WAITING_ON_US: "164633147", CLOSED: "164633148" },
  EXTERNAL_SUPPORT: { NEW: "1311981989", WAITING_ON_CLIENT_REPLY: "1311981990", WAITING_ON_HIP_REPLY: "1311981991", IN_PROGRESS: "1311980105", CLOSED: "1311981992" },
  PRIVACY_DATA_REQUESTS: { NEW: "1349762646", WAITING_ON_CONTACT: "1349762647", WAITING_ON_US: "1349762648", CLOSED: "1349762649" },
  IMPLEMENTATION_SUPPORT: { NEW: "1376375895", WAITING_ON_CONTACT: "1376375896", WAITING_ON_US: "1376375897", CLOSED: "1376375898" },
};

function flattenCustomFields(customFields) {
  const flat = {};
  (customFields || []).forEach((field) => {
    if (!field || !field.FieldName) return;
    flat[field.FieldName] = field.Value;
  });
  return flat;
}

function transformTicket(ticketRecord, customFields) {
  const flatCustomFields = flattenCustomFields(customFields);

  const PRIORITY_MAP = { "-1": "LOW", "0": "MEDIUM", "1": "HIGH", "2": "URGENT" };
  const ORIGIN_MAP = { Email: "EMAIL", Phone: "PHONE", Chat: "CHAT", Web: "FORM", WebApp: "FORM" }; 

  const CUSTOM_FIELD_MAP = {
    Partner: "partner", Urgency: "urgency", Impact: "impact", Practice: "practice",
    "PM/EHR": "pm_ehr", "Account Manager": "account_manager", "Billing Manager": "billing_manager",
    "Go Live Date (if applicable)": "go_live_date", "Affected Component": "affected_component",
    "Patient Example(s)": "patient_examples", "Root Cause": "root_cause", "Resolution Code": "resolution_code",
    "Resolution Summary": "resolution_summary", "Why was that the resolution?": "why_was_that_the_resolution",
    "Config Location": "config_location", "Name of Config(s) Changed (separate with semicolon)": "name_of_configs_changed",
    "VoC Status": "voc_status", "VoC URL": "voc_url", "VoC Added to Ideas Board?": "voc_added_to_ideas_board",
    "3rd Party": "third_party", "3rd Party Ticket URL / Ticket Number": "third_party_ticket_url_ticket_number",
    "3rd Party Ticket Creation Date": "third_party_ticket_creation_date", "Client Satisfaction Rating": "client_satisfaction_rating",
    "Client Feedback Details": "client_feedback_details",
  };

  const DATE_ONLY_PROPERTIES = new Set(["due_date", "go_live_date", "third_party_ticket_creation_date"]);

  const ENUM_OPTIONS = {
    account_manager: [
      "Artera - Ausha Bouasy", "Artera - Brian Farrington", "Artera - Chelsey Lindemann", 
      "Artera - Daniel Etienne", "Artera - Delaney Helgeson", "Artera - Evelyn Vandervoort", 
      "Artera - Rusty McConnell", "Artera - Teresa Call", "Daniel Clark", "Jessica McNamara", 
      "Jordan Cho", "Klara", "Kristina Brouse", "Leany Speranza", "N/A", "Relatient", 
      "Support", "Unassigned"
    ],
    practice: [
      "AAIA", "AHC", "AHI", "AID", "ALTNEC", "AMC", "AMG", "AR-ACH", "AR-AIH", "AR-ALT", "AR-ANHC", 
      "AR-APC", "AR-APW", "AR-BSTY", "AR-CBHC", "AR-CCR", "AR-CFHC", "AR-CMP", "AR-COMP", "AR-DRCHC", 
      "AR-DVP", "AR-EA", "AR-EH", "AR-EMG", "AR-FSA", "AR-GWM", "AR-HDMG", "AR-HPN-CC", "AR-HPN-CHS", 
      "AR-HPN-DOHC", "AR-HPN-VV", "AR-ICC", "AR-KOC", "AR-LCH", "AR-LINC", "AR-NMA-P", "AR-NMA-T", 
      "AR-OOA", "AR-OSP", "AR-POASNJ", "AR-PTH", "AR-PTHA", "AR-SAMA", "AR-SFMA", "ART", "AR-TMP", 
      "AR-TSOP", "AR-WCC", "AR-WCHC", "ASNDBX", "AU", "AZLA", "BAA", "BCFWC", "BFD", "BMMS", "BMMSA", 
      "BOWEN", "BUC", "CBSI", "CCN", "CD", "CDCSC", "CFVV", "CGT", "CHS", "CIPA", "CMG", "COAAC", 
      "COC", "COG", "COGW", "CPSSNDBX", "CRH", "CSMG", "CUMC", "CWE", "CWHC", "DAL", "DAWM", "DDS", 
      "DEO", "DEOA", "DGC", "DMS", "DSC", "DSP", "ECW", "ECWN", "EDE", "EIT", "ELO", "EMOG", "EPCS", 
      "EPIC", "ESCL", "EVENT", "FDRX", "FGUP", "GCU", "GIT", "GLEC", "GLSC", "GNV", "GNV-VC", 
      "GNV-VC-AZ", "GNV-VC-FL", "GSFA", "GTP", "GTWELL", "GWPS", "GWPSSNDBX", "GWPST", 
      "HiP - Health iPASS", "HIPTC", "HLC", "HPT", "HSC", "HSC-A", "HVSC", "ICMG", "IMA", "JYI", 
      "K-ABS", "K-ACS", "K-AO", "K-APC", "K-BEC", "K-BFH", "K-BFP", "K-BWH", "K-CCN", "K-CFPG", 
      "K-CH", "K-CHP", "K-CIPA", "K-CL", "K-CMC", "K-CSNE", "K-CWH", "K-DBMG", "K-DMMD", "K-DND", 
      "K-EBM", "K-EC", "K-EDEC", "K-EPC", "K-FAC", "K-FECV", "K-FH", "K-FWHS", "K-GC", "K-GPS", 
      "K-GSA", "K-HMH", "K-HMM", "K-LKMD", "K-LPFM", "K-LSN", "K-MHPC", "K-NYC", "K-OBASA", "K-OHW", 
      "K-OPSC", "K-OWGSC", "K-PA", "K-PC", "K-PGTW", "K-PM", "K-PP", "K-ROOT", "K-RSDS", "K-SD", 
      "K-SEARK", "K-SGHP", "K-SP", "K-SSC", "K-SWC", "KT", "K-TDG", "K-VG", "LAMVA", "LAO", "LBJI", 
      "LCO", "LHOA", "LOC", "MBJI", "MGM", "MMG", "MOC", "MOS", "MPS", "MSAO", "MSK", "Multiple", 
      "N/A", "NAED", "ND", "NSD", "NSENT", "NST", "NWP1", "NYDG", "OBGA", "OCOK", "OCOSI", "OFH", 
      "OLYD", "OMP", "ONE", "ORC", "ORI", "OSI", "OSMRC", "OTA", "PAA", "PAP", "Parent Ticket", 
      "PEDA", "PHS", "PHYCIN", "PNSM", "POA", "POASNJ", "POSM", "POSMC", "PPC", "PSA", "PTHA", 
      "QCENT", "R-ADS", "R-AOC", "R-AONE", "RAPPORE", "R-BST", "REVO / iHealth", "RFU", "RFUH", 
      "RJH", "R-MAA", "RMMC", "R-NYS", "R-OARK", "R-OO", "R-ROC", "R-WMHS", "SAO", "SASC", "SBOA", 
      "SDN", "SEVG", "SHG", "SHOT", "SKI", "SMS", "SOSM", "SPLG", "SSO", "STOC", "SWGA", "SWGE", 
      "TEAM", "TG", "TGS", "TMG", "TOA", "TPC", "TPCC", "TRG", "TSO", "TV-DJP", "UAS", "UCMV", "UOC", 
      "VCH", "VFC", "VIP", "VISD", "VOH", "VPFW", "WGF", "WWH", "yy - Klara (test)"
    ],
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

  const PASSTHROUGH_ENUM_PROPERTIES = new Set([]);
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
    sourceid: String(ticketRecord.IssueID),
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

  // ==========================================
  // FAILSAFE: Append dropped enum values to the ticket subject
  // so no data is permanently lost during migration
  // ==========================================
  if (skippedFields.length > 0) {
    const skippedNotes = skippedFields.map(f => `${f.hsProperty}: ${f.rawValue}`).join(" | ");
    mappedProperties.subject = `${mappedProperties.subject} [Notes: ${skippedNotes}]`;
  }

  return mappedProperties;
}

// ==========================================
// 2. Prepare Payload (With Retry & Caching)
// ==========================================
async function prepareTicketForBatch(ticketRecord) {
  if (!ticketRecord || !ticketRecord.IssueID) return null;

  const issueId = ticketRecord.IssueID;

  // Duplicate Check WITH RETRY
  try {
    const searchResponse = await executeWithRetry(() => 
      hubspotClient.crm.tickets.searchApi.doSearch({
        filterGroups: [{ filters: [{ propertyName: "issue_id", operator: "EQ", value: issueId.toString() }] }]
      })
    );

    if (searchResponse && searchResponse.results && searchResponse.results.length > 0) {
      logger.info(`⏭️ Ticket already exists (IssueID: ${issueId}). Skipping...`);
      return null; 
    }
  } catch (error) {
    logger.error(`❌ HubSpot Ticket Search Failed for IssueID ${issueId}: ${error.message}`);
    return null; 
  }

  // Fetch Custom Fields
  let customFields = [];
  try {
    customFields = await getTicketCustomFields(issueId);
  } catch (err) {
    logger.error(`⚠️ Failed to fetch custom fields for ${issueId}: ${err.message}`);
  }

  const properties = transformTicket(ticketRecord, customFields);
  const associations = [];

  // Contact Search WITH RETRY & CACHE
  if (ticketRecord.Email) {
    const email = ticketRecord.Email.toLowerCase();
    if (contactCache.has(email)) {
      const cachedId = contactCache.get(email);
      if (cachedId) associations.push({ to: { id: cachedId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 }] });
    } else {
      try {
        const contactSearch = await executeWithRetry(() => 
          hubspotClient.crm.contacts.searchApi.doSearch({
            filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }]
          })
        );
        if (contactSearch && contactSearch.results.length > 0) {
          const contactId = contactSearch.results[0].id;
          contactCache.set(email, contactId);
          associations.push({ to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 }] });
        } else {
          contactCache.set(email, null); 
        }
      } catch (err) {}
    }
  }

  // Company Search WITH RETRY & CACHE
  if (ticketRecord.CompanyName) {
    const companyName = ticketRecord.CompanyName.toLowerCase();
    if (companyCache.has(companyName)) {
      const cachedId = companyCache.get(companyName);
      if (cachedId) associations.push({ to: { id: cachedId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 }] });
    } else {
      try {
        const companySearch = await executeWithRetry(() => 
          hubspotClient.crm.companies.searchApi.doSearch({
            filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: ticketRecord.CompanyName }] }]
          })
        );
        if (companySearch && companySearch.results.length > 0) {
          const compId = companySearch.results[0].id;
          companyCache.set(companyName, compId);
          associations.push({ to: { id: compId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 }] });
        } else {
          companyCache.set(companyName, null); 
        }
      } catch (err) {}
    }
  }

  const batchInput = { properties };
  if (associations.length > 0) {
    batchInput.associations = associations;
  }
  
  return batchInput;
}

// ==========================================
// 3. Main Runner: Parallel Sync & Batch Upload
// ==========================================
async function syncAllTickets() {
  try {
    logger.info("📡 Fetching ALL tickets from Jitbit...");
    
    const allTickets = await getTickets();

    if (!allTickets || allTickets.length === 0) {
      logger.info("ℹ️ No tickets found to sync.");
      return;
    }

    // ===============================================
    // START FROM A SPECIFIC INDEX TO SKIP UPLOADED ONES
    // ===============================================
    const START_INDEX = 14200; // Adjust this index based on your needs
    const tickets = allTickets.slice(START_INDEX);

    logger.info(`📦 Total ${allTickets.length} tickets found. Skipping first ${START_INDEX} tickets...`);
    logger.info(`🚀 Processing remaining ${tickets.length} tickets in FAST PARALLEL mode...`);

    let batchInputs = [];
    let totalCreatedThisSession = 0;
    
    const BATCH_UPLOAD_LIMIT = 100;
    
    // Concurrency thodi kam ki hai taaki HubSpot gussa na ho
    const CONCURRENCY_LIMIT = 3; 

    for (let i = 0; i < tickets.length; i += CONCURRENCY_LIMIT) {
      const chunkToPrepare = tickets.slice(i, i + CONCURRENCY_LIMIT);
      
      const preparedResults = await Promise.all(
        chunkToPrepare.map(async (ticket) => {
          return await prepareTicketForBatch(ticket);
        })
      );

      for (const result of preparedResults) {
        if (result) {
          batchInputs.push(result);
        }
      }

      if (batchInputs.length >= BATCH_UPLOAD_LIMIT || (i + CONCURRENCY_LIMIT >= tickets.length && batchInputs.length > 0)) {
        
        const itemsToUpload = batchInputs.splice(0, BATCH_UPLOAD_LIMIT);
        
        try {
          logger.info(`🚀 Firing batch creation for ${itemsToUpload.length} tickets to HubSpot...`);
          
          await executeWithRetry(() => 
            hubspotClient.crm.tickets.batchApi.create({
              inputs: itemsToUpload
            })
          );
          
          totalCreatedThisSession += itemsToUpload.length;
          logger.info(`✅ Successfully batched and created! (Total Created THIS SESSION: ${totalCreatedThisSession})`);
        } catch (error) {
          logger.error(`❌ Batch Creation Failed: ${error.message}`);
        }
      }

      // Slightly larger delay to balance speed and stability
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    logger.info(`🎉 Full sync operation completed successfully! Total Tickets Uploaded this session: ${totalCreatedThisSession}`);

  } catch (error) {
    logger.error(`❌ Global Sync Error: ${error.message}`);
  }
}

// Run the main process
syncAllTickets();