// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";
// // import { getTickets } from "./jitbit.services.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// // ==========================================
// // SAARI MAPPINGS PURI TARAH MENTAINED HAIN
// // ==========================================
// // const VALID_HUBSPOT_PROPERTIES = [
// //   "subject", "content", "hs_pipeline", "hs_pipeline_stage", "hs_ticket_priority",
// //   "hs_ticket_category", "account_manager", "affected_component", "billing_manager",
// //   "branding", "churn_notes", "churn_reason", "churn_risk", "client_feedback_details",
// //   "client_satisfaction_rating", "collateral_specifications", "config_location",
// //   "content___messaging", "deliverables_requested", "go_live_date", "hs_resolution",
// //   "impact", "name_of_configs_changed", "nps_follow_up_answer", "nps_score"
// // ];

// // const PROPERTY_OVERRIDES = {
// //   "Subject": "subject", "Body": "content", "Category": "hs_ticket_category", "Priority": "hs_ticket_priority"
// // };

// // function formatHubSpotProperty(label) {
// //   if (!label) return "";
// //   if (PROPERTY_OVERRIDES[label]) return PROPERTY_OVERRIDES[label];
// //   return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
// // }

// // function formatHubSpotValue(hubspotKey, value) {
// //   if (value === null || value === undefined || value === "") return "";
// //   let normalizedValue = value.toString().trim();
// //   if (normalizedValue === "✓") normalizedValue = "true";

// //   // MAPPING FIELDS START
// //   if (hubspotKey === "hs_ticket_priority") {
// //     const priorityMap = { "0": "LOW", "1": "MEDIUM", "2": "HIGH", "3": "URGENT" };
// //     return priorityMap[normalizedValue] || "LOW";
// //   }
// //   if (hubspotKey === "hs_ticket_category") {
// //     const categoryMap = { "Product issue": "PRODUCT_ISSUE", "Billing issue": "BILLING_ISSUE", "Feature request": "FEATURE_REQUEST", "General inquiry": "GENERAL_INQUIRY" };
// //     return categoryMap[normalizedValue] || "GENERAL_INQUIRY";
// //   }
// //   if (hubspotKey === "impact") {
// //     const validImpacts = ["1 High - > 15 users/patients affected", "2 Med - > 5 users/patients affected", "3 Low - < 5 users/patients affected"];
// //     return validImpacts.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "account_manager") {
// //     const validAMs = ["Artera - Ausha Bouasy", "Artera - Brian Farrington", "Artera - Chelsey Lindemann", "Artera - Daniel Etienne", "Artera - Delaney Helgeson", "Artera - Evelyn Vandervoort", "Artera - Rusty McConnell", "Artera - Teresa Call", "Daniel Clark", "Jessica McNamara", "Jordan Cho", "Klara", "Kristina Brouse", "Leany Speranza", "N/A", "Relatient", "Support", "Unassigned"];
// //     return validAMs.includes(normalizedValue) ? normalizedValue : "Unassigned";
// //   }
// //   if (hubspotKey === "client_satisfaction_rating") {
// //     const validRatings = ["BAD", "GOOD", "N/A", "OKAY", "PENDING"];
// //     return validRatings.includes(normalizedValue.toUpperCase()) ? normalizedValue.toUpperCase() : "PENDING";
// //   }
// //   if (hubspotKey === "deliverables_requested") {
// //     const validDeliverables = ["Collateral", "PowerPoint", "Infographics", "Advertisement", "Booth Design", "Signage", "Interactive PDFs", "Social Media Post", "Web Carousel", "Landing Page", "Ad", "Website", "Email"];
// //     return validDeliverables.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "config_location") {
// //     const validConfigs = ["Appointment Settings", "Billing cadence", "Billing settings", "Book my Doc settings", "Bulk messages", "Client details", "Cost estimator > Charge Bundles", "Cost estimator > Rate card", "Cost estimator > Smart deposits", "Database Edit", "Email Template Change", "Ext. Demo Data > EC - Relationship type", "Ext. Demo Data > Employer", "Ext. Demo Data > Employment status", "Ext. Demo Data > Ethnicity", "Ext. Demo Data > Gender", "Ext. Demo Data > Language", "Ext. Demo Data > Marital status", "Ext. Demo Data > Occupation", "Ext. Demo Data > Race", "Ext. Demo Settings", "Kiosk in-clinic directions", "Location details", "N/A", "Other - Specified in notes", "Payer Settings", "Payments and posting", "Platform Settings", "PM integration settings", "Post demographics settings", "Pre-arrival > ECI Pathway set-up", "Pre-arrival > ECI Pathways", "Pre-arrival > Forms", "Pre-arrival > In-clinic messages", "Pre-arrival > Message cadence", "Pre-arrival > Payment settings", "Pre-arrival > Screener setup", "Pre-arrival > Visit Instructions", "Pre-arrival > Voice messages", "Provider settings", "User Management"];
// //     return validConfigs.includes(normalizedValue) ? normalizedValue : "Other - Specified in notes";
// //   }
// //   if (hubspotKey === "churn_reason") {
// //     const validChurnReasons = ["Product limitation", "Lack of integration", "Support", "Product issues", "Price", "ROI", "Leadership/Staff turnover", "Not Churning/Not at Risk"];
// //     return validChurnReasons.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "churn_risk") {
// //     const validChurnRisks = ["Medium", "High", "Save Attempt", "Churning", "Stabilized"];
// //     return validChurnRisks.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "billing_manager") {
// //     const validBillingManagers = ["Anoushka Mara", "Kavya Sri Koppula", "Rajat Vij", "Sai Tarun"];
// //     return validBillingManagers.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "branding") {
// //     const validBrands = ["Health iPASS", "Sphere", "Other"];
// //     return validBrands.includes(normalizedValue) ? normalizedValue : "Other";
// //   }
// //   if (hubspotKey === "hs_resolution") {
// //     const validResolutions = ["ISSUE_FIXED", "FEATURE_REQUEST_TRACKED", "REFUND_APPLIED", "SENT_KNOWLEDGE_DOCUMENT_LINK"];
// //     return validResolutions.includes(normalizedValue.toUpperCase()) ? normalizedValue.toUpperCase() : "";
// //   }
// //   // MAPPING FIELDS END

// //   return normalizedValue;
// // }

// // // ==========================================
// // // TARGETED SYNC LOGIC
// // // ==========================================
// // async function createTicket(ticket) {
// //   try {
// //     const mappedProperties = { hs_pipeline: "0", hs_pipeline_stage: "1" };
// //     Object.keys(ticket).forEach((key) => {
// //       const hubspotProperty = formatHubSpotProperty(key);
// //       if (VALID_HUBSPOT_PROPERTIES.includes(hubspotProperty)) {
// //         const hubspotValue = formatHubSpotValue(hubspotProperty, ticket[key]);
// //         if (hubspotValue !== "") mappedProperties[hubspotProperty] = hubspotValue;
// //       }
// //     });

// //     const response = await hubspotClient.crm.tickets.basicApi.create({ properties: mappedProperties });
// //     const ticketId = response.id;
// //     logger.info(`✅ Ticket Created: ${ticketId}`);

// //     // Association by Email
// //     if (ticket.Email) {
// //       const contactSearch = await hubspotClient.crm.contacts.searchApi.doSearch({
// //         filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: ticket.Email }] }]
// //       });
// //       if (contactSearch.results.length > 0) {
// //         await hubspotClient.crm.associations.v4.basicApi.create("tickets", ticketId, "contacts", contactSearch.results[0].id, [
// //           { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 }
// //         ]);
// //         logger.info(`🔗 Associated Contact: ${contactSearch.results[0].id}`);
// //       }
// //     }

// //     // Association by Company Name
// //     if (ticket.CompanyName) {
// //       const companySearch = await hubspotClient.crm.companies.searchApi.doSearch({
// //         filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: ticket.CompanyName }] }]
// //       });
// //       if (companySearch.results.length > 0) {
// //         await hubspotClient.crm.associations.v4.basicApi.create("tickets", ticketId, "companies", companySearch.results[0].id, [
// //           { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 }
// //         ]);
// //         logger.info(`🔗 Associated Company: ${companySearch.results[0].id}`);
// //       }
// //     }
// //     return ticketId;
// //   } catch (error) {
// //     logger.error(`❌ Sync Failed: ${error.message}`);
// //     return null;
// //   }
// // }

// // async function runSync() {
// //   const tickets = await getTickets();
// //   const targetTicket = tickets.find(t => t.IssueID === 101649335);

// //   if (targetTicket) {
// //     logger.info(`🚀 Processing Target Ticket ID: ${targetTicket.IssueID}`);
// //     await createTicket(targetTicket);
// //   } else {
// //     logger.info("Ticket not found in Jitbit.");
// //   }
// //   logger.info("🎉 Process Finished.");
// // }

// // runSync();

// // import "dotenv/config";
// // import * as hubspot from "@hubspot/api-client";
// // import logger from "../utils/logger.js";

// import {
//   getTickets,
//   getTicketDetails,
//   getTicketCustomFields,
// } from "./jitbit.services.js";

// // // ==========================================
// // // HubSpot Client
// // // ==========================================
// // const hubspotClient = new hubspot.Client({
// //   accessToken: process.env.HUBSPOT_TOKEN,
// // });

// // // ==========================================
// // // Mappings & Constants
// // // ==========================================
// // const VALID_HUBSPOT_PROPERTIES = [
// //   "subject", "content", "hs_pipeline", "hs_pipeline_stage", "hs_ticket_priority",
// //   "hs_ticket_category", "account_manager", "affected_component", "billing_manager",
// //   "branding", "churn_notes", "churn_reason", "churn_risk", "client_feedback_details",
// //   "client_satisfaction_rating", "collateral_specifications", "config_location",
// //   "content___messaging", "deliverables_requested", "go_live_date", "hs_resolution",
// //   "impact", "name_of_configs_changed", "nps_follow_up_answer", "nps_score", "issue_id"
// // ];

// // const PROPERTY_OVERRIDES = {
// //   "Subject": "subject",
// //   "Body": "content",
// //   "Category": "hs_ticket_category",
// //   "Priority": "hs_ticket_priority",
// //   "IssueID": "issue_id"
// // };

// // const PROPERTIES_TO_IGNORE = [
// //   "HubSpot ID",
// //   // Add any future fields here if HubSpot throws a "PROPERTY_DOESNT_EXIST" error
// // ];

// // // ==========================================
// // // Dynamic Formatting Helpers
// // // ==========================================
// // function formatHubSpotProperty(label) {
// //   if (!label) return "";
// //   if (PROPERTY_OVERRIDES[label]) return PROPERTY_OVERRIDES[label];
// //   return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
// // }

// // function formatHubSpotValue(hubspotKey, value) {
// //   if (value === null || value === undefined || value === "") return "";
// //   let normalizedValue = value.toString().trim();
// //   if (normalizedValue === "✓") normalizedValue = "true";

// //   // Picklist/Mapping Fields
// //   if (hubspotKey === "hs_ticket_priority") {
// //     const priorityMap = { "0": "LOW", "1": "MEDIUM", "2": "HIGH", "3": "URGENT" };
// //     return priorityMap[normalizedValue] || "LOW";
// //   }
// //   if (hubspotKey === "hs_ticket_category") {
// //     const categoryMap = { "Product issue": "PRODUCT_ISSUE", "Billing issue": "BILLING_ISSUE", "Feature request": "FEATURE_REQUEST", "General inquiry": "GENERAL_INQUIRY" };
// //     return categoryMap[normalizedValue] || "GENERAL_INQUIRY";
// //   }
// //   if (hubspotKey === "impact") {
// //     const validImpacts = ["1 High - > 15 users/patients affected", "2 Med - > 5 users/patients affected", "3 Low - < 5 users/patients affected"];
// //     return validImpacts.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "account_manager") {
// //     const validAMs = ["Artera - Ausha Bouasy", "Artera - Brian Farrington", "Artera - Chelsey Lindemann", "Artera - Daniel Etienne", "Artera - Delaney Helgeson", "Artera - Evelyn Vandervoort", "Artera - Rusty McConnell", "Artera - Teresa Call", "Daniel Clark", "Jessica McNamara", "Jordan Cho", "Klara", "Kristina Brouse", "Leany Speranza", "N/A", "Relatient", "Support", "Unassigned"];
// //     return validAMs.includes(normalizedValue) ? normalizedValue : "Unassigned";
// //   }
// //   if (hubspotKey === "client_satisfaction_rating") {
// //     const validRatings = ["BAD", "GOOD", "N/A", "OKAY", "PENDING"];
// //     return validRatings.includes(normalizedValue.toUpperCase()) ? normalizedValue.toUpperCase() : "PENDING";
// //   }
// //   if (hubspotKey === "deliverables_requested") {
// //     const validDeliverables = ["Collateral", "PowerPoint", "Infographics", "Advertisement", "Booth Design", "Signage", "Interactive PDFs", "Social Media Post", "Web Carousel", "Landing Page", "Ad", "Website", "Email"];
// //     return validDeliverables.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "config_location") {
// //     const validConfigs = ["Appointment Settings", "Billing cadence", "Billing settings", "Book my Doc settings", "Bulk messages", "Client details", "Cost estimator > Charge Bundles", "Cost estimator > Rate card", "Cost estimator > Smart deposits", "Database Edit", "Email Template Change", "Ext. Demo Data > EC - Relationship type", "Ext. Demo Data > Employer", "Ext. Demo Data > Employment status", "Ext. Demo Data > Ethnicity", "Ext. Demo Data > Gender", "Ext. Demo Data > Language", "Ext. Demo Data > Marital status", "Ext. Demo Data > Occupation", "Ext. Demo Data > Race", "Ext. Demo Settings", "Kiosk in-clinic directions", "Location details", "N/A", "Other - Specified in notes", "Payer Settings", "Payments and posting", "Platform Settings", "PM integration settings", "Post demographics settings", "Pre-arrival > ECI Pathway set-up", "Pre-arrival > ECI Pathways", "Pre-arrival > Forms", "Pre-arrival > In-clinic messages", "Pre-arrival > Message cadence", "Pre-arrival > Payment settings", "Pre-arrival > Screener setup", "Pre-arrival > Visit Instructions", "Pre-arrival > Voice messages", "Provider settings", "User Management"];
// //     return validConfigs.includes(normalizedValue) ? normalizedValue : "Other - Specified in notes";
// //   }
// //   if (hubspotKey === "churn_reason") {
// //     const validChurnReasons = ["Product limitation", "Lack of integration", "Support", "Product issues", "Price", "ROI", "Leadership/Staff turnover", "Not Churning/Not at Risk"];
// //     return validChurnReasons.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "churn_risk") {
// //     const validChurnRisks = ["Medium", "High", "Save Attempt", "Churning", "Stabilized"];
// //     return validChurnRisks.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "billing_manager") {
// //     const validBillingManagers = ["Anoushka Mara", "Kavya Sri Koppula", "Rajat Vij", "Sai Tarun"];
// //     return validBillingManagers.includes(normalizedValue) ? normalizedValue : "";
// //   }
// //   if (hubspotKey === "branding") {
// //     const validBrands = ["Health iPASS", "Sphere", "Other"];
// //     return validBrands.includes(normalizedValue) ? normalizedValue : "Other";
// //   }
// //   if (hubspotKey === "hs_resolution") {
// //     const validResolutions = ["ISSUE_FIXED", "FEATURE_REQUEST_TRACKED", "REFUND_APPLIED", "SENT_KNOWLEDGE_DOCUMENT_LINK"];
// //     return validResolutions.includes(normalizedValue.toUpperCase()) ? normalizedValue.toUpperCase() : "";
// //   }

// //   return normalizedValue;
// // }

// // // ==========================================
// // // Search Existing Ticket
// // // ==========================================
// // async function searchTicketById(issueId) {
// //   try {
// //     const response = await hubspotClient.crm.tickets.searchApi.doSearch({
// //       filterGroups: [
// //         {
// //           filters: [
// //             {
// //               propertyName: "issue_id", // Ensure 'issue_id' is a custom property on tickets in HubSpot
// //               operator: "EQ",
// //               value: issueId.toString(),
// //             },
// //           ],
// //         },
// //       ],
// //       properties: ["subject", "issue_id"],
// //     });

// //     return response.results[0] || null;
// //   } catch (error) {
// //     logger.error(`Ticket Search Failed: ${error.message}`);
// //     return null;
// //   }
// // }

// // // ==========================================
// // // Create Ticket in HubSpot
// // // ==========================================
// // async function createTicket(ticket, customFields) {
// //   try {
// //     // ==============================
// //     // Dynamic Custom Field Mapping
// //     // ==============================
// //     const mappedProperties = { hs_pipeline: "0", hs_pipeline_stage: "1", issue_id: ticket.IssueID.toString() };

// //     // Add Base Properties from Jitbit Ticket Object
// //     Object.keys(ticket).forEach((key) => {
// //       if (PROPERTIES_TO_IGNORE.includes(key)) return;

// //       const hubspotProperty = formatHubSpotProperty(key);
// //       if (VALID_HUBSPOT_PROPERTIES.includes(hubspotProperty)) {
// //         const hubspotValue = formatHubSpotValue(hubspotProperty, ticket[key]);
// //         if (hubspotValue !== "") mappedProperties[hubspotProperty] = hubspotValue;
// //       }
// //     });

// //     // Add Custom Fields dynamically
// //     customFields.forEach((field) => {
// //       if (PROPERTIES_TO_IGNORE.includes(field.FieldName)) return;

// //       const hubspotProperty = formatHubSpotProperty(field.FieldName);
// //       if (VALID_HUBSPOT_PROPERTIES.includes(hubspotProperty)) {
// //         const hubspotValue = formatHubSpotValue(hubspotProperty, field.Value);
// //         if (hubspotValue !== "") mappedProperties[hubspotProperty] = hubspotValue;
// //       }
// //     });

// //     logger.info("========== HUBSPOT TICKET PAYLOAD ==========");
// //     logger.info(JSON.stringify(mappedProperties, null, 2));

// //     const response = await hubspotClient.crm.tickets.basicApi.create({ properties: mappedProperties });
// //     const ticketId = response.id;
// //     logger.info(`✅ Ticket Created Successfully | HubSpot ID: ${ticketId}`);

// //     // ==============================
// //     // Handle Associations
// //     // ==============================
// //     if (ticket.Email) {
// //       const contactSearch = await hubspotClient.crm.contacts.searchApi.doSearch({
// //         filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: ticket.Email }] }]
// //       });
// //       if (contactSearch.results.length > 0) {
// //         await hubspotClient.crm.associations.v4.basicApi.create("tickets", ticketId, "contacts", contactSearch.results[0].id, [
// //           { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 }
// //         ]);
// //         logger.info(`🔗 Associated Contact: ${contactSearch.results[0].id}`);
// //       }
// //     }

// //     if (ticket.CompanyName) {
// //       const companySearch = await hubspotClient.crm.companies.searchApi.doSearch({
// //         filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: ticket.CompanyName }] }]
// //       });
// //       if (companySearch.results.length > 0) {
// //         await hubspotClient.crm.associations.v4.basicApi.create("tickets", ticketId, "companies", companySearch.results[0].id, [
// //           { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 }
// //         ]);
// //         logger.info(`🔗 Associated Company: ${companySearch.results[0].id}`);
// //       }
// //     }

// //     return ticketId;
// //   } catch (error) {
// //     logger.error(`❌ Ticket Sync Failed: ${ticket.Subject || ticket.IssueID}`);
// //     if (error.response) {
// //       logger.error(JSON.stringify(error.response.body, null, 2));
// //     } else {
// //       logger.error(error.message);
// //     }
// //     return null;
// //   }
// // }

// // // ==========================================
// // // Sync One Ticket Testing
// // // ==========================================
// // async function syncTicket() {
// //   try {
// //     const tickets = await getTickets();

// //     if (!tickets || tickets.length === 0) {
// //       logger.info("No tickets found.");
// //       return;
// //     }

// //     // Find Testing Ticket
// //     const ticket = tickets.find((t) => t.IssueID === 101649335);

// //     if (!ticket) {
// //       logger.info("Ticket IssueID 101649335 not found.");
// //       return;
// //     }

// //     logger.info(`🚀 Syncing Ticket: ${ticket.Subject} (${ticket.IssueID})`);

// //     // ==============================
// //     // Fetch Details & Custom Fields by IssueID
// //     // ==============================

// //     // Assuming getTicketDetails and getTicketCustomFields exist in jitbit.services.js
// //     const ticketDetails = await getTicketDetails(ticket.IssueID);
// //     const customFields = await getTicketCustomFields(ticket.IssueID);

// //     const finalTicket = {
// //       ...ticket,
// //       ...ticketDetails,
// //     };

// //     logger.info("========== FINAL TICKET DATA ==========");
// //     logger.info(JSON.stringify(finalTicket, null, 2));

// //     // ==============================
// //     // Duplicate Check
// //     // ==============================
// //     const existingTicket = await searchTicketById(finalTicket.IssueID);

// //     if (existingTicket) {
// //       logger.info(`⚠️ Ticket already exists in HubSpot. ID: ${existingTicket.id}`);
// //       return;
// //     }

// //     await createTicket(finalTicket, customFields);

// //     logger.info("✅ Test Ticket Sync Completed.");
// //   } catch (error) {
// //     logger.error(`❌ Sync Failed: ${error.message}`);
// //   }
// // }

// // // ==========================================
// // // Run
// // // ==========================================
// // async function runSync() {
// //   logger.info("🚀 Starting Jitbit → HubSpot Ticket Sync...");
// //   await syncTicket();
// //   logger.info("🎉 Process Finished.");
// // }

// // runSync();

// // export { syncTicket, runSync };

// // ==========================================
// // 1. Transform Ticket
// // Converts Jitbit JSON + Custom Fields into HubSpot Payload
// // ==========================================
// // function transformTicket(ticketRecord, customFields) {
// //   const mappedProperties = {
// //     hs_pipeline: "0",
// //     hs_pipeline_stage: "1",
// //     issue_id: ticketRecord.IssueID.toString()
// //   };

// //   return mappedProperties;
// // }

// /**
//  * Flattens Jitbit's "custom properties by IssueId" array into a simple
//  * { FieldName: Value } lookup object, so the rest of the code can just
//  * read flatCustomFields.Partner, flatCustomFields.Urgency, etc. instead
//  * of looping/searching the raw array every time.
//  *
//  * Input:
//  *   [{ FieldName: "Partner", Value: "Relatient", ... }, { FieldName: "Urgency", Value: "2 Medium...", ... }]
//  * Output:
//  *   { Partner: "Relatient", Urgency: "2 Medium..." }
//  *
//  * @param {Array} customFields - raw Jitbit custom fields array
//  * @returns {Object} flatCustomFields
//  */
// function flattenCustomFields(customFields) {
//   const flat = {};
//   (customFields || []).forEach((field) => {
//     if (!field || !field.FieldName) return;
//     flat[field.FieldName] = field.Value;
//   });
//   return flat;
// }

// /**
//  * Transforms a Jitbit ticket record + its custom fields into a HubSpot
//  * "Tickets" object properties payload.
//  *
//  * @param {Object} ticketRecord - Jitbit ticket object (IssueID, Subject, Priority, etc.)
//  * @param {Array}  customFields - Jitbit "custom properties by IssueId" array
//  *                                (each item: { FieldName, Value, Type, ... })
//  * @returns {Object} mappedProperties - ready to send as `properties` in a
//  *                    HubSpot CRM ticket create/update call
//  */
// function transformTicket(ticketRecord, customFields) {
//   console.log("Ticket Record:", ticketRecord);
//   console.log("Custom Fields:", customFields);
//   const flatCustomFields = flattenCustomFields(customFields);

//   const PRIORITY_MAP = { 0: "LOW", 1: "MEDIUM", 2: "HIGH", 3: "URGENT" };

//   const ORIGIN_MAP = {
//     Email: "EMAIL",
//     Phone: "PHONE",
//     Chat: "CHAT",
//     Web: "FORM",
//   };

//   const CUSTOM_FIELD_MAP = {
//     "Partner": "partner",
//     "Urgency": "urgency",
//     "Impact": "impact",
//     "Practice": "practice",
//     "PM/EHR": "pm_ehr",
//     "Account Manager": "account_manager",
//     "Billing Manager": "billing_manager",
//     "Go Live Date (if applicable)": "go_live_date",
//     "Affected Component": "affected_component",
//     "Patient Example(s)": "patient_examples",
//     "Root Cause": "root_cause",
//     "Resolution Code": "resolution_code",
//     "Resolution Summary": "resolution_summary",
//     "Why was that the resolution?": "why_was_that_the_resolution",
//     "Config Location": "config_location",
//     "Name of Config(s) Changed (separate with semicolon)": "name_of_configs_changed",
//     "VoC Status": "voc_status",
//     "VoC URL": "voc_url",
//     "VoC Added to Ideas Board?": "voc_added_to_ideas_board",
//     "3rd Party": "third_party",
//     "3rd Party Ticket URL / Ticket Number": "third_party_ticket_url_ticket_number",
//     "3rd Party Ticket Creation Date": "third_party_ticket_creation_date",
//     "Client Satisfaction Rating": "client_satisfaction_rating",
//     "Client Feedback Details": "client_feedback_details",
//   };

//   const DATE_ONLY_PROPERTIES = new Set([
//     "due_date",
//     "go_live_date",
//     "third_party_ticket_creation_date",
//   ]);

//   const ENUM_OPTIONS = {
//     affected_component: [
//       "3rd_party","api_incorrect_balance_pulled","api_interface_bridge_down",
//       "api_interface_bridge_incorrect_data","api_misc_write_back_issue",
//       "appt_reminders_cadence_change","appt_reminders_other",
//       "appt_reminders_verbiage_change","appt_reminders_wrong_time_not_sent",
//       "appts_add_in","appts_encounter_creation","appts_incorrect_data_in_hip",
//       "appts_not_enough_not_adding","appts_status_write_back",
//       "appts_too_many_not_cancelling","billing_config_change",
//       "billing_generation_issue","billing_generation_request",
//       "billing_incorrect_balance","billing_notifications_issue",
//       "billing_paper_statements","billing_payment_plans",
//       "config_change_add_appt_type_to_hip","config_change_add_location_to_hip",
//       "config_change_add_provider_to_hip","config_change_platform_misc_settings",
//       "demographics_config_change","demographics_posting",
//       "demographics_pulling_data","documentation_implementations",
//       "documentation_product_feature","documentation_support_troubleshooting",
//       "eci_cant_complete_check_in","eci_config_change","eci_incorrect_information",
//       "eci_telehealth_config","eci_virtual_kiosk","feedback","forms_creation",
//       "forms_kill_re_queue","forms_modification_to_form","forms_not_sent",
//       "forms_other_issue","forms_posting_issue","forms_rules_change",
//       "hardware_kiosk_orders","hardware_kiosk_troubleshooting",
//       "hardware_pax_orders","hardware_pax_troubleshooting","health_ipass_app",
//       "hip_cant_login","hip_payment_contract_changes",
//       "implementation_2_way_sms_confirm_req","implementation_bridge_certification",
//       "implementation_bridge_setup","implementation_number_hosting_request",
//       "implementation_number_purchase_request","implementation_payer_mapping",
//       "insurance_co_pay_value","insurance_cost_estimator",
//       "insurance_eligibility_status_return","insurance_payer_mapping_update",
//       "insurance_posting_issue","insurance_rate_card_change",
//       "insurance_rate_card_setup","insurance_smart_deposit",
//       "internal_support_account_issue","internal_support_account_setup",
//       "internal_support_hardware","internal_support_mfa_issue",
//       "internal_support_software","jitbit_automations","jitbit_client_setup",
//       "messaging_bulk_messaging_problem","messaging_bulk_messaging_request",
//       "messaging_email_template_change","messaging_in_clinic_message",
//       "offboarding","parent_ticket","patient_financing","patient_opened_ticket",
//       "patient_portal_incorrect_info","patient_portal_login_or_auth_fail",
//       "patient_portal_patient_wallet","patient_self_scheduling",
//       "payments_config_change","payments_modification","payments_posting",
//       "payments_processing","q_a","reports_custom_generation_request",
//       "reports_generation_error","reports_incorrect_data","sales_demo_build",
//       "sales_demo_config_update","sftp","sphere_credential_issues","training",
//       "user_interface_admin_ui","user_interface_check_in",
//       "user_interface_dashboard","user_interface_other_patient_ui",
//       "user_interface_patient_eci","user_interface_patient_portal",
//       "user_interface_patient360","user_interface_reports",
//       "users_enable_disable_sso","users_new_modify_user","users_password_reset",
//       "users_unable_to_sign_in","voc",
//     ],
//     urgency: [
//       "1 High - inability to perform work",
//       "2 Medium - impaired but can still work",
//       "3 Low - inconvenient but not broken",
//     ],
//     impact: [
//       "1 High - > 15 users/patients affected",
//       "2 Med - > 5 users/patients affected",
//       "3 Low - < 5 users/patients affected",
//     ],
//     voc_added_to_ideas_board: ["N/A", "NO", "YES"],
//     voc_status: [
//       "Accepted","Completed","Denied","In Progress","In Review",
//       "None or N/A","Submitted","VoC Priority",
//     ],
//     root_cause: [
//       "3rd Party","API Testing","Bill Balance Incorrect","Bill Generation Failure",
//       "Bill Generation Request","Bug","Client Training","Code change (Use case gap)",
//       "Config Update Requested","Documentation","Form Creation / Edit",
//       "Form Posting Failure / Other Form Issue","HiP Proactive Communication",
//       "HiP SaaS Contract","HiP Training","HW Failure","HW Request",
//       "Internal Request","Jitbit Change or Addition","Kill & Re-queue",
//       "Misconfiguration","Onboarding","Operations","Patient Mistake",
//       "Patient Ticket","Practice Mistake/Oversight","Q/A","Timeout",
//       "Unknown at this time","VoC",
//     ],
//     resolution_code: [
//       "3rd Party Fix","API Testing","Bug fix","CANT Be Resolved / No Resolution",
//       "Client Resolved Issue","Client Training","Config Change","Database Edit",
//       "Documentation","Executed New Agreement","Form Creation / Edit",
//       "Form Q/A & Validation","Full Appt Load","HiP Training","Hotfix","HW Fix",
//       "HW Net New","HW Replacement","HW Return","Jitbit Change or Addition",
//       "Kill & Re-queue","Number Purchased","Offboarding","Onboarding",
//       "Operations","Parent Ticket","Patient Ticket","Payer Mapping",
//       "Postman Data Pull","Practice Mistake","Question / Concern Answered",
//       "Retry w/o Changes","Spam / Vendor Email","Use case gap (New Code)",
//       "User Creation / Edit / PW Reset","VoC",
//     ],
//     third_party: [
//       "Amazon Web Services","Artera","Athena","CTS","eCW","Ellkay","ERO",
//       "Exscribe","Formstack","Google","GreenWay","HealthTalk AI","Instamed",
//       "Issuing Bank","Klara","Linux VPN","MedEvolve","ModMed","MotionMD","N/A",
//       "Nextech","NextGen","POS","Practice / Client","PrognoCIS","Relatient",
//       "Rippling","Sendgrid","Soti MobiControl","Televox","TransUnion/FinThrive",
//       "TrustCommerce / Sphere","Twilio","Veradigm/Allscripts","Visit Pay",
//       "WorldPay / Vantiv","xBridge","Zinniax",
//     ],

//   };

//   const PASSTHROUGH_ENUM_PROPERTIES = new Set(["practice"]);

//   // Only this property's HubSpot options are snake_case slugs.
//   const SLUGIFIED_ENUM_PROPERTIES = new Set(["affected_component"]);

//   const normalize = (s) =>
//     String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

//   const slugify = (s) =>
//     String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

//   const resolveEnumValue = (hsProperty, rawValue) => {
//     if (SLUGIFIED_ENUM_PROPERTIES.has(hsProperty)) {
//       const slug = slugify(rawValue);
//       return ENUM_OPTIONS[hsProperty]?.includes(slug) ? slug : null;
//     }

//     if (PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty)) {
//       return String(rawValue).trim();
//     }

//     const options = ENUM_OPTIONS[hsProperty];
//     if (!options) return rawValue; // not an enum we track — pass through

//     const normRaw = normalize(rawValue);
//     const match = options.find((opt) => normalize(opt) === normRaw);
//     return match ?? null;
//   };

//   const toMidnightUTC = (isoString) => {
//     if (!isoString) return null;
//     return `${isoString.split("T")[0]}T00:00:00.000Z`;
//   };

//   const mappedProperties = {
//     hs_pipeline: "0",
//     hs_pipeline_stage: "1",
//     issue_id: ticketRecord.IssueID.toString(),
//     subject: ticketRecord.Subject,
//     createdate: ticketRecord.IssueDate,
//   };

//   if (ticketRecord.DueDate) {
//     mappedProperties.due_date = toMidnightUTC(ticketRecord.DueDate);
//   }
//   if (ticketRecord.ResolvedDate) {
//     mappedProperties.closed_date = ticketRecord.ResolvedDate;
//   }
//   if (ticketRecord.Priority !== undefined && PRIORITY_MAP[ticketRecord.Priority]) {
//     mappedProperties.hs_ticket_priority = PRIORITY_MAP[ticketRecord.Priority];
//   }
//   if (ticketRecord.Origin && ORIGIN_MAP[ticketRecord.Origin]) {
//     mappedProperties.source_type = ORIGIN_MAP[ticketRecord.Origin];
//   }

//   const skippedFields = []; // collect for logging / visibility

//   Object.entries(CUSTOM_FIELD_MAP).forEach(([jitbitFieldName, hsProperty]) => {
//     const rawValue = flatCustomFields[jitbitFieldName];
//     if (rawValue === null || rawValue === undefined || rawValue === "") return;

//     if (DATE_ONLY_PROPERTIES.has(hsProperty)) {
//       mappedProperties[hsProperty] = toMidnightUTC(rawValue);
//       return;
//     }

//     const isTrackedEnum =
//       ENUM_OPTIONS[hsProperty] || PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty);

//     if (isTrackedEnum) {
//       const resolved = resolveEnumValue(hsProperty, rawValue);
//       if (resolved === null) {
//         // Don't let one bad enum value fail the whole ticket create.
//         skippedFields.push({ hsProperty, rawValue });
//         return;
//       }
//       mappedProperties[hsProperty] = resolved;
//       return;
//     }

//     mappedProperties[hsProperty] = rawValue;
//   });

//   if (skippedFields.length) {
//     console.warn(
//       `⚠️ Skipped ${skippedFields.length} unmatched enum value(s) for ticket ${ticketRecord.IssueID}:`,
//       skippedFields
//     );
//   }

//   return mappedProperties;
// }

// // ==========================================
// // 2. Create Ticket
// // Pushes the payload to HubSpot and links Contact/Company
// // ==========================================
// async function createTicket(hubspotPayload, email, companyName) {
//   try {
//     // Create Ticket
//     const response = await hubspotClient.crm.tickets.basicApi.create({ properties: hubspotPayload });
//     const ticketId = response.id;
//     logger.info(`✅ Ticket Created | HubSpot ID: ${ticketId}`);

//     // Associate Contact by Email
//     if (email) {
//       const contactSearch = await hubspotClient.crm.contacts.searchApi.doSearch({
//         filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }]
//       });
//       if (contactSearch.results.length > 0) {
//         await hubspotClient.crm.associations.v4.basicApi.create("tickets", ticketId, "contacts", contactSearch.results[0].id, [
//           { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 } // Ticket to Contact
//         ]);
//         logger.info(`🔗 Associated Contact: ${contactSearch.results[0].id}`);
//       }
//     }

//     // Associate Company by Name
//     if (companyName) {
//       const companySearch = await hubspotClient.crm.companies.searchApi.doSearch({
//         filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: companyName }] }]
//       });
//       if (companySearch.results.length > 0) {
//         await hubspotClient.crm.associations.v4.basicApi.create("tickets", ticketId, "companies", companySearch.results[0].id, [
//           { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 } // Ticket to Company
//         ]);
//         logger.info(`🔗 Associated Company: ${companySearch.results[0].id}`);
//       }
//     }

//     return ticketId;
//   } catch (error) {
//     logger.error(`❌ HubSpot Create Failed: ${error.message}`);
//     return null;
//   }
// }

// // ==========================================
// // 3. Sync Single Ticket
// // Orchestrates the entire flow for one record
// // ==========================================
// async function syncSingleTicket(ticketRecord) {
//   if (!ticketRecord || !ticketRecord.IssueID) {
//     logger.error("❌ Invalid ticket record provided. Missing IssueID.");
//     return;
//   }

//   const issueId = ticketRecord.IssueID;
//   logger.info(`🚀 Syncing Ticket ID: ${issueId}`);

//   // 2. Fetch Custom Fields
//   let customFields = [];
//   try {
//     customFields = await getTicketCustomFields(issueId);
//   } catch (err) {
//     logger.error(`⚠️ Failed to fetch custom fields: ${err.message}`);
//   }

//   // 3. Transform Data
//   const hubspotPayload = transformTicket(ticketRecord, customFields);
//   logger.info(`========== HUBSPOT PAYLOAD ==========\n  ${JSON.stringify(hubspotPayload, null, 2)}`);

//   // 4. Send to HubSpot
//   await createTicket(hubspotPayload, ticketRecord.Email, ticketRecord.CompanyName);
//   logger.info(`✅ Sync Completed for Ticket ID: ${issueId}`);
// }

// syncSingleTicket({
//         "IssueID": 101649335,
//         "Priority": 0,
//         "StatusID": 1,
//         "IssueDate": "2026-07-15T06:56:01.617Z",
//         "Subject": "Client Code - Purpose for Order",
//         "Status": "New",
//         "UpdatedByUser": false,
//         "UpdatedByPerformer": false,
//         "CategoryID": 578944,
//         "UserName": "\"><img src=x onerror=alert(1)>",
//         "Technician": "tanya.elmore@healthipass.com",
//         "FirstName": "\"><img src=x onerror=alert(1)>",
//         "LastName": "\"><img src=x onerror=alert(1)>",
//         "DueDate": "2026-07-15T18:05:00Z",
//         "TechFirstName": "Tanya",
//         "TechLastName": "Elmore",
//         "LastUpdated": "2026-07-15T06:56:05.63Z",
//         "UpdatedForTechView": false,
//         "UserID": 15478050,
//         "CompanyID": 1532588,
//         "CompanyName": "Test",
//         "AssignedToUserID": 13814395,
//         "ResolvedDate": null,
//         "SectionID": 93557,
//         "Category": "Tickets - Hardware Orders",
//         "Origin": "InPerson",
//         "Email": "mrethical006+1@gmail.com",
//         "StatusColor": "",
//         "LastUpdatedByUserID": null,
//         "LastUpdatedUsername": null,
//         "StartDate": null,
//         "TimeSpentInSeconds": 0,
//         "AISentiment": 0
//     })

//.......................................... New code add Pipeline............................................//...............................................

// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";
// // import { getTickets } from "./jitbit.services.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// import {
//   getTickets,
//   getTicketDetails,
//   getTicketCustomFields,
// } from "./jitbit.services.js";

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

// // ==========================================
// // HUBSPOT STAGES (Total: 30)
// // ==========================================
// const HUBSPOT_STAGES = {
//   // 1. CS Pipeline (4 Stages)
//   CS_PIPELINE: {
//     NEW: "1",
//     WAITING_ON_CONTACT: "2",
//     WAITING_ON_US: "3",
//     CLOSED: "4",
//   },
//   // 2. Renewal Pipeline (4 Stages)
//   RENEWAL_PIPELINE: {
//     NEW: "52285808",
//     WAITING_ON_CONTACT: "52285809",
//     WAITING_ON_US: "52285810",
//     CLOSED: "52285811",
//   },
//   // 3. Churn Risk (5 Stages)
//   CHURN_RISK: {
//     IDENTIFIED: "60435217",
//     ACTION_PLAN_CREATED: "60435218",
//     ACTIVELY_WORKING: "60435219",
//     STABILIZED: "60435220",
//     CHURNING: "60472996",
//   },
//   // 4. NPS Outreach (4 Stages)
//   NPS_OUTREACH: {
//     NEW: "164633145",
//     WAITING_ON_CONTACT: "164633146",
//     WAITING_ON_US: "164633147",
//     CLOSED: "164633148",
//   },
//   // 5. External Support (5 Stages)
//   EXTERNAL_SUPPORT: {
//     NEW: "1311981989",
//     WAITING_ON_CLIENT_REPLY: "1311981990",
//     WAITING_ON_HIP_REPLY: "1311981991",
//     IN_PROGRESS: "1311980105",
//     CLOSED: "1311981992",
//   },
//   // 6. Privacy / Data Requests (4 Stages)
//   PRIVACY_DATA_REQUESTS: {
//     NEW: "1349762646",
//     WAITING_ON_CONTACT: "1349762647",
//     WAITING_ON_US: "1349762648",
//     CLOSED: "1349762649",
//   },
//   // 7. Implementation Support (4 Stages)
//   IMPLEMENTATION_SUPPORT: {
//     NEW: "1376375895",
//     WAITING_ON_CONTACT: "1376375896",
//     WAITING_ON_US: "1376375897",
//     CLOSED: "1376375898",
//   },
// };

// //   return mappedProperties;
// // }

// /**
//  * Flattens Jitbit's "custom properties by IssueId" array into a simple
//  * { FieldName: Value } lookup object, so the rest of the code can just
//  * read flatCustomFields.Partner, flatCustomFields.Urgency, etc. instead
//  * of looping/searching the raw array every time.
//  *
//  * Input:
//  *   [{ FieldName: "Partner", Value: "Relatient", ... }, { FieldName: "Urgency", Value: "2 Medium...", ... }]
//  * Output:
//  *   { Partner: "Relatient", Urgency: "2 Medium..." }
//  *
//  * @param {Array} customFields - raw Jitbit custom fields array
//  * @returns {Object} flatCustomFields
//  */
// function flattenCustomFields(customFields) {
//   const flat = {};
//   (customFields || []).forEach((field) => {
//     if (!field || !field.FieldName) return;
//     flat[field.FieldName] = field.Value;
//   });
//   return flat;
// }

// /**
//  * Transforms a Jitbit ticket record + its custom fields into a HubSpot
//  * "Tickets" object properties payload.
//  *
//  * @param {Object} ticketRecord - Jitbit ticket object (IssueID, Subject, Priority, etc.)
//  * @param {Array}  customFields - Jitbit "custom properties by IssueId" array
//  *                                (each item: { FieldName, Value, Type, ... })
//  * @returns {Object} mappedProperties - ready to send as `properties` in a
//  *                    HubSpot CRM ticket create/update call
//  */
// function transformTicket(ticketRecord, customFields) {
//   // console.log("Ticket Record:", ticketRecord);
//   // console.log("Custom Fields:", customFields);
//   const flatCustomFields = flattenCustomFields(customFields);

//  const PRIORITY_MAP = {
//     "-1": "LOW",
//     "0": "MEDIUM",
//     "1": "HIGH",
//     "2": "URGENT"
// };

//   const ORIGIN_MAP = {
//     Email: "EMAIL",
//     Phone: "PHONE",
//     Chat: "CHAT",
//     Web: "FORM",
//   };

//   const CUSTOM_FIELD_MAP = {
//     Partner: "partner",
//     Urgency: "urgency",
//     Impact: "impact",
//     Practice: "practice",
//     "PM/EHR": "pm_ehr",
//     "Account Manager": "account_manager",
//     "Billing Manager": "billing_manager",
//     "Go Live Date (if applicable)": "go_live_date",
//     "Affected Component": "affected_component",
//     "Patient Example(s)": "patient_examples",
//     "Root Cause": "root_cause",
//     "Resolution Code": "resolution_code",
//     "Resolution Summary": "resolution_summary",
//     "Why was that the resolution?": "why_was_that_the_resolution",
//     "Config Location": "config_location",
//     "Name of Config(s) Changed (separate with semicolon)":
//       "name_of_configs_changed",
//     "VoC Status": "voc_status",
//     "VoC URL": "voc_url",
//     "VoC Added to Ideas Board?": "voc_added_to_ideas_board",
//     "3rd Party": "third_party",
//     "3rd Party Ticket URL / Ticket Number":
//       "third_party_ticket_url_ticket_number",
//     "3rd Party Ticket Creation Date": "third_party_ticket_creation_date",
//     "Client Satisfaction Rating": "client_satisfaction_rating",
//     "Client Feedback Details": "client_feedback_details",
//   };

//   const DATE_ONLY_PROPERTIES = new Set([
//     "due_date",
//     "go_live_date",
//     "third_party_ticket_creation_date",
//   ]);

//   const ENUM_OPTIONS = {
//     affected_component: [
//       "3rd_party",
//       "api_incorrect_balance_pulled",
//       "api_interface_bridge_down",
//       "api_interface_bridge_incorrect_data",
//       "api_misc_write_back_issue",
//       "appt_reminders_cadence_change",
//       "appt_reminders_other",
//       "appt_reminders_verbiage_change",
//       "appt_reminders_wrong_time_not_sent",
//       "appts_add_in",
//       "appts_encounter_creation",
//       "appts_incorrect_data_in_hip",
//       "appts_not_enough_not_adding",
//       "appts_status_write_back",
//       "appts_too_many_not_cancelling",
//       "billing_config_change",
//       "billing_generation_issue",
//       "billing_generation_request",
//       "billing_incorrect_balance",
//       "billing_notifications_issue",
//       "billing_paper_statements",
//       "billing_payment_plans",
//       "config_change_add_appt_type_to_hip",
//       "config_change_add_location_to_hip",
//       "config_change_add_provider_to_hip",
//       "config_change_platform_misc_settings",
//       "demographics_config_change",
//       "demographics_posting",
//       "demographics_pulling_data",
//       "documentation_implementations",
//       "documentation_product_feature",
//       "documentation_support_troubleshooting",
//       "eci_cant_complete_check_in",
//       "eci_config_change",
//       "eci_incorrect_information",
//       "eci_telehealth_config",
//       "eci_virtual_kiosk",
//       "feedback",
//       "forms_creation",
//       "forms_kill_re_queue",
//       "forms_modification_to_form",
//       "forms_not_sent",
//       "forms_other_issue",
//       "forms_posting_issue",
//       "forms_rules_change",
//       "hardware_kiosk_orders",
//       "hardware_kiosk_troubleshooting",
//       "hardware_pax_orders",
//       "hardware_pax_troubleshooting",
//       "health_ipass_app",
//       "hip_cant_login",
//       "hip_payment_contract_changes",
//       "implementation_2_way_sms_confirm_req",
//       "implementation_bridge_certification",
//       "implementation_bridge_setup",
//       "implementation_number_hosting_request",
//       "implementation_number_purchase_request",
//       "implementation_payer_mapping",
//       "insurance_co_pay_value",
//       "insurance_cost_estimator",
//       "insurance_eligibility_status_return",
//       "insurance_payer_mapping_update",
//       "insurance_posting_issue",
//       "insurance_rate_card_change",
//       "insurance_rate_card_setup",
//       "insurance_smart_deposit",
//       "internal_support_account_issue",
//       "internal_support_account_setup",
//       "internal_support_hardware",
//       "internal_support_mfa_issue",
//       "internal_support_software",
//       "jitbit_automations",
//       "jitbit_client_setup",
//       "messaging_bulk_messaging_problem",
//       "messaging_bulk_messaging_request",
//       "messaging_email_template_change",
//       "messaging_in_clinic_message",
//       "offboarding",
//       "parent_ticket",
//       "patient_financing",
//       "patient_opened_ticket",
//       "patient_portal_incorrect_info",
//       "patient_portal_login_or_auth_fail",
//       "patient_portal_patient_wallet",
//       "patient_self_scheduling",
//       "payments_config_change",
//       "payments_modification",
//       "payments_posting",
//       "payments_processing",
//       "q_a",
//       "reports_custom_generation_request",
//       "reports_generation_error",
//       "reports_incorrect_data",
//       "sales_demo_build",
//       "sales_demo_config_update",
//       "sftp",
//       "sphere_credential_issues",
//       "training",
//       "user_interface_admin_ui",
//       "user_interface_check_in",
//       "user_interface_dashboard",
//       "user_interface_other_patient_ui",
//       "user_interface_patient_eci",
//       "user_interface_patient_portal",
//       "user_interface_patient360",
//       "user_interface_reports",
//       "users_enable_disable_sso",
//       "users_new_modify_user",
//       "users_password_reset",
//       "users_unable_to_sign_in",
//       "voc",
//     ],
//     urgency: [
//       "1 High - inability to perform work",
//       "2 Medium - impaired but can still work",
//       "3 Low - inconvenient but not broken",
//     ],
//     impact: [
//       "1 High - > 15 users/patients affected",
//       "2 Med - > 5 users/patients affected",
//       "3 Low - < 5 users/patients affected",
//     ],
//     voc_added_to_ideas_board: ["N/A", "NO", "YES"],
//     voc_status: [
//       "Accepted",
//       "Completed",
//       "Denied",
//       "In Progress",
//       "In Review",
//       "None or N/A",
//       "Submitted",
//       "VoC Priority",
//     ],
//     root_cause: [
//       "3rd Party",
//       "API Testing",
//       "Bill Balance Incorrect",
//       "Bill Generation Failure",
//       "Bill Generation Request",
//       "Bug",
//       "Client Training",
//       "Code change (Use case gap)",
//       "Config Update Requested",
//       "Documentation",
//       "Form Creation / Edit",
//       "Form Posting Failure / Other Form Issue",
//       "HiP Proactive Communication",
//       "HiP SaaS Contract",
//       "HiP Training",
//       "HW Failure",
//       "HW Request",
//       "Internal Request",
//       "Jitbit Change or Addition",
//       "Kill & Re-queue",
//       "Misconfiguration",
//       "Onboarding",
//       "Operations",
//       "Patient Mistake",
//       "Patient Ticket",
//       "Practice Mistake/Oversight",
//       "Q/A",
//       "Timeout",
//       "Unknown at this time",
//       "VoC",
//     ],
//     resolution_code: [
//       "3rd Party Fix",
//       "API Testing",
//       "Bug fix",
//       "CANT Be Resolved / No Resolution",
//       "Client Resolved Issue",
//       "Client Training",
//       "Config Change",
//       "Database Edit",
//       "Documentation",
//       "Executed New Agreement",
//       "Form Creation / Edit",
//       "Form Q/A & Validation",
//       "Full Appt Load",
//       "HiP Training",
//       "Hotfix",
//       "HW Fix",
//       "HW Net New",
//       "HW Replacement",
//       "HW Return",
//       "Jitbit Change or Addition",
//       "Kill & Re-queue",
//       "Number Purchased",
//       "Offboarding",
//       "Onboarding",
//       "Operations",
//       "Parent Ticket",
//       "Patient Ticket",
//       "Payer Mapping",
//       "Postman Data Pull",
//       "Practice Mistake",
//       "Question / Concern Answered",
//       "Retry w/o Changes",
//       "Spam / Vendor Email",
//       "Use case gap (New Code)",
//       "User Creation / Edit / PW Reset",
//       "VoC",
//     ],
//     third_party: [
//       "Amazon Web Services",
//       "Artera",
//       "Athena",
//       "CTS",
//       "eCW",
//       "Ellkay",
//       "ERO",
//       "Exscribe",
//       "Formstack",
//       "Google",
//       "GreenWay",
//       "HealthTalk AI",
//       "Instamed",
//       "Issuing Bank",
//       "Klara",
//       "Linux VPN",
//       "MedEvolve",
//       "ModMed",
//       "MotionMD",
//       "N/A",
//       "Nextech",
//       "NextGen",
//       "POS",
//       "Practice / Client",
//       "PrognoCIS",
//       "Relatient",
//       "Rippling",
//       "Sendgrid",
//       "Soti MobiControl",
//       "Televox",
//       "TransUnion/FinThrive",
//       "TrustCommerce / Sphere",
//       "Twilio",
//       "Veradigm/Allscripts",
//       "Visit Pay",
//       "WorldPay / Vantiv",
//       "xBridge",
//       "Zinniax",
//     ],
//   };

//   const PASSTHROUGH_ENUM_PROPERTIES = new Set(["practice"]);

//   // Only this property's HubSpot options are snake_case slugs.
//   const SLUGIFIED_ENUM_PROPERTIES = new Set(["affected_component"]);

//   const normalize = (s) =>
//     String(s)
//       .trim()
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, " ")
//       .trim();

//   const slugify = (s) =>
//     String(s)
//       .trim()
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "_")
//       .replace(/^_+|_+$/g, "");

//   const resolveEnumValue = (hsProperty, rawValue) => {
//     if (SLUGIFIED_ENUM_PROPERTIES.has(hsProperty)) {
//       const slug = slugify(rawValue);
//       return ENUM_OPTIONS[hsProperty]?.includes(slug) ? slug : null;
//     }

//     if (PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty)) {
//       return String(rawValue).trim();
//     }

//     const options = ENUM_OPTIONS[hsProperty];
//     if (!options) return rawValue; // not an enum we track — pass through

//     const normRaw = normalize(rawValue);
//     const match = options.find((opt) => normalize(opt) === normRaw);
//     return match ?? null;
//   };

//   const toMidnightUTC = (isoString) => {
//     if (!isoString) return null;
//     return `${isoString.split("T")[0]}T00:00:00.000Z`;
//   };

//   // ----------------------------------------------------
//   // DYNAMIC PIPELINE ROUTING
//   // ----------------------------------------------------
//   let targetPipeline = HUBSPOT_PIPELINES.CS_PIPELINE;
//   let targetStage = HUBSPOT_STAGES.CS_PIPELINE.NEW;

//   // Route hardware tickets to External Support
//   if (ticketRecord.Category && ticketRecord.Category.includes("Hardware")) {
//     targetPipeline = HUBSPOT_PIPELINES.EXTERNAL_SUPPORT;
//     targetStage = HUBSPOT_STAGES.EXTERNAL_SUPPORT.NEW;
//   }
//   // Route implementations
//   else if (
//     ticketRecord.Category &&
//     ticketRecord.Category.includes("Implementation")
//   ) {
//     targetPipeline = HUBSPOT_PIPELINES.IMPLEMENTATION_SUPPORT;
//     targetStage = HUBSPOT_STAGES.IMPLEMENTATION_SUPPORT.NEW;
//   }

//   const mappedProperties = {
//     hs_pipeline: targetPipeline,
//     hs_pipeline_stage: targetStage,
//     issue_id: ticketRecord.IssueID.toString(),
//     subject: ticketRecord.Subject,
//     createdate: ticketRecord.IssueDate,
//   };

//   if (ticketRecord.DueDate) {
//     mappedProperties.due_date = toMidnightUTC(ticketRecord.DueDate);
//   }
//   if (ticketRecord.ResolvedDate) {
//     mappedProperties.closed_date = ticketRecord.ResolvedDate;
//   }
//   // if (ticketRecord.Priority !== undefined && PRIORITY_MAP[ticketRecord.Priority]) {
//   //   mappedProperties.hs_ticket_priority = PRIORITY_MAP[ticketRecord.Priority];
//   // }
//  if (
//     ticketRecord.Priority !== undefined &&
//     PRIORITY_MAP.hasOwnProperty(ticketRecord.Priority)
// ) {
//     mappedProperties.hs_ticket_priority = PRIORITY_MAP[ticketRecord.Priority];
// }

//   if (ticketRecord.Origin && ORIGIN_MAP[ticketRecord.Origin]) {
//     mappedProperties.source_type = ORIGIN_MAP[ticketRecord.Origin];
//   }

//   const skippedFields = []; // collect for logging / visibility

//   Object.entries(CUSTOM_FIELD_MAP).forEach(([jitbitFieldName, hsProperty]) => {
//     const rawValue = flatCustomFields[jitbitFieldName];
//     if (rawValue === null || rawValue === undefined || rawValue === "") return;

//     if (DATE_ONLY_PROPERTIES.has(hsProperty)) {
//       mappedProperties[hsProperty] = toMidnightUTC(rawValue);
//       return;
//     }

//     const isTrackedEnum =
//       ENUM_OPTIONS[hsProperty] || PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty);

//     if (isTrackedEnum) {
//       const resolved = resolveEnumValue(hsProperty, rawValue);
//       if (resolved === null) {
//         // Don't let one bad enum value fail the whole ticket create.
//         skippedFields.push({ hsProperty, rawValue });
//         return;
//       }
//       mappedProperties[hsProperty] = resolved;
//       return;
//     }

//     mappedProperties[hsProperty] = rawValue;
//   });

//   if (skippedFields.length) {
//     console.warn(
//       `⚠️ Skipped ${skippedFields.length} unmatched enum value(s) for ticket ${ticketRecord.IssueID}:`,
//       skippedFields,
//     );
//   }

//   return mappedProperties;
// }

// // ==========================================
// // 2. Create Ticket
// // Pushes the payload to HubSpot and links Contact/Company
// // ==========================================
// async function createTicket(hubspotPayload, email, companyName) {
//   try {
//     // Create Ticket
//     const response = await hubspotClient.crm.tickets.basicApi.create({
//       properties: hubspotPayload,
//     });
//     const ticketId = response.id;
//     logger.info(`✅ Ticket Created | HubSpot ID: ${ticketId}`);

//     // Associate Contact by Email
//     if (email) {
//       const contactSearch = await hubspotClient.crm.contacts.searchApi.doSearch(
//         {
//           filterGroups: [
//             {
//               filters: [
//                 { propertyName: "email", operator: "EQ", value: email },
//               ],
//             },
//           ],
//         },
//       );
//       if (contactSearch.results.length > 0) {
//         await hubspotClient.crm.associations.v4.basicApi.create(
//           "tickets",
//           ticketId,
//           "contacts",
//           contactSearch.results[0].id,
//           [
//             { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 }, // Ticket to Contact
//           ],
//         );
//         logger.info(`🔗 Associated Contact: ${contactSearch.results[0].id}`);
//       }
//     }

//     // Associate Company by Name
//     if (companyName) {
//       const companySearch =
//         await hubspotClient.crm.companies.searchApi.doSearch({
//           filterGroups: [
//             {
//               filters: [
//                 { propertyName: "name", operator: "EQ", value: companyName },
//               ],
//             },
//           ],
//         });
//       if (companySearch.results.length > 0) {
//         await hubspotClient.crm.associations.v4.basicApi.create(
//           "tickets",
//           ticketId,
//           "companies",
//           companySearch.results[0].id,
//           [
//             { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 }, // Ticket to Company
//           ],
//         );
//         logger.info(`🔗 Associated Company: ${companySearch.results[0].id}`);
//       }
//     }

//     return ticketId;
//   } catch (error) {
//     logger.error(`❌ HubSpot Create Failed: ${error.message}`);
//     return null;
//   }
// }

// // ==========================================
// // 3. Sync Single Ticket
// // Orchestrates the entire flow for one record
// // ==========================================
// async function syncSingleTicket(ticketRecord) {
//   if (!ticketRecord || !ticketRecord.IssueID) {
//     logger.error("❌ Invalid ticket record provided. Missing IssueID.");
//     return;
//   }

//   const issueId = ticketRecord.IssueID;
//   logger.info(`🚀 Syncing Ticket ID: ${issueId}`);

//   // 2. Fetch Custom Fields
//   let customFields = [];
//   try {
//     customFields = await getTicketCustomFields(issueId);
//   } catch (err) {
//     logger.error(`⚠️ Failed to fetch custom fields: ${err.message}`);
//   }

//   // 3. Transform Data
//   const hubspotPayload = transformTicket(ticketRecord, customFields);
//   logger.info(
//     `========== HUBSPOT PAYLOAD ==========\n  ${JSON.stringify(hubspotPayload, null, 2)}`,
//   );

//   // 4. Send to HubSpot
//   await createTicket(
//     hubspotPayload,
//     ticketRecord.Email,
//     ticketRecord.CompanyName,
//   );
//   logger.info(`✅ Sync Completed for Ticket ID: ${issueId}`);
// }

// syncSingleTicket({
//   IssueID: 101700899,
//   Priority: 2,
//   StatusID: 1,
//   IssueDate: "2026-07-16T10:44:41.18Z",
//   Subject: "Test",
//   Status: "New",
//   UpdatedByUser: false,
//   UpdatedByPerformer: false,
//   CategoryID: 563284,
//   UserName: '"><img src=x onerror=alert(1)>',
//   Technician: null,
//   FirstName: '"><img src=x onerror=alert(1)>',
//   LastName: '"><img src=x onerror=alert(1)>',
//   DueDate: "2026-07-16T17:00:00Z",
//   TechFirstName: null,
//   TechLastName: null,
//   LastUpdated: "2026-07-16T10:44:43.947Z",
//   UpdatedForTechView: false,
//   UserID: 15478050,
//   CompanyID: 1532588,
//   CompanyName: "Test",
//   AssignedToUserID: null,
//   ResolvedDate: null,
//   SectionID: 145956,
//   Category: "Account Management - Client Success",
//   Origin: "WhatsApp",
//   Email: "mrethical006+1@gmail.com",
//   StatusColor: "",
//   LastUpdatedByUserID: null,
//   LastUpdatedUsername: null,
//   StartDate: null,
//   TimeSpentInSeconds: 0,
//   AISentiment: 0,
// });


// ...............................New Code //...............................................


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
  // 1. CS Pipeline (4 Stages)
  CS_PIPELINE: {
    NEW: "1",
    WAITING_ON_CONTACT: "2",
    WAITING_ON_US: "3",
    CLOSED: "4",
  },
  // 2. Renewal Pipeline (4 Stages)
  RENEWAL_PIPELINE: {
    NEW: "52285808",
    WAITING_ON_CONTACT: "52285809",
    WAITING_ON_US: "52285810",
    CLOSED: "52285811",
  },
  // 3. Churn Risk (5 Stages)
  CHURN_RISK: {
    IDENTIFIED: "60435217",
    ACTION_PLAN_CREATED: "60435218",
    ACTIVELY_WORKING: "60435219",
    STABILIZED: "60435220",
    CHURNING: "60472996",
  },
  // 4. NPS Outreach (4 Stages)
  NPS_OUTREACH: {
    NEW: "164633145",
    WAITING_ON_CONTACT: "164633146",
    WAITING_ON_US: "164633147",
    CLOSED: "164633148",
  },
  // 5. External Support (5 Stages)
  EXTERNAL_SUPPORT: {
    NEW: "1311981989",
    WAITING_ON_CLIENT_REPLY: "1311981990",
    WAITING_ON_HIP_REPLY: "1311981991",
    IN_PROGRESS: "1311980105",
    CLOSED: "1311981992",
  },
  // 6. Privacy / Data Requests (4 Stages)
  PRIVACY_DATA_REQUESTS: {
    NEW: "1349762646",
    WAITING_ON_CONTACT: "1349762647",
    WAITING_ON_US: "1349762648",
    CLOSED: "1349762649",
  },
  // 7. Implementation Support (4 Stages)
  IMPLEMENTATION_SUPPORT: {
    NEW: "1376375895",
    WAITING_ON_CONTACT: "1376375896",
    WAITING_ON_US: "1376375897",
    CLOSED: "1376375898",
  },
};

/**
 * Flattens Jitbit's "custom properties by IssueId" array into a simple
 * { FieldName: Value } lookup object, so the rest of the code can just
 * read flatCustomFields.Partner, flatCustomFields.Urgency, etc. instead
 * of looping/searching the raw array every time.
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

 const PRIORITY_MAP = {
    "-1": "LOW",
    "0": "MEDIUM",
    "1": "HIGH",
    "2": "URGENT"
};

  const ORIGIN_MAP = {
    Email: "EMAIL",
    Phone: "PHONE",
    Chat: "CHAT",
    Web: "FORM",
  };

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
    "Name of Config(s) Changed (separate with semicolon)":
      "name_of_configs_changed",
    "VoC Status": "voc_status",
    "VoC URL": "voc_url",
    "VoC Added to Ideas Board?": "voc_added_to_ideas_board",
    "3rd Party": "third_party",
    "3rd Party Ticket URL / Ticket Number":
      "third_party_ticket_url_ticket_number",
    "3rd Party Ticket Creation Date": "third_party_ticket_creation_date",
    "Client Satisfaction Rating": "client_satisfaction_rating",
    "Client Feedback Details": "client_feedback_details",
  };

  const DATE_ONLY_PROPERTIES = new Set([
    "due_date",
    "go_live_date",
    "third_party_ticket_creation_date",
  ]);

  const ENUM_OPTIONS = {
    affected_component: [
      "3rd_party",
      "api_incorrect_balance_pulled",
      "api_interface_bridge_down",
      "api_interface_bridge_incorrect_data",
      "api_misc_write_back_issue",
      "appt_reminders_cadence_change",
      "appt_reminders_other",
      "appt_reminders_verbiage_change",
      "appt_reminders_wrong_time_not_sent",
      "appts_add_in",
      "appts_encounter_creation",
      "appts_incorrect_data_in_hip",
      "appts_not_enough_not_adding",
      "appts_status_write_back",
      "appts_too_many_not_cancelling",
      "billing_config_change",
      "billing_generation_issue",
      "billing_generation_request",
      "billing_incorrect_balance",
      "billing_notifications_issue",
      "billing_paper_statements",
      "billing_payment_plans",
      "config_change_add_appt_type_to_hip",
      "config_change_add_location_to_hip",
      "config_change_add_provider_to_hip",
      "config_change_platform_misc_settings",
      "demographics_config_change",
      "demographics_posting",
      "demographics_pulling_data",
      "documentation_implementations",
      "documentation_product_feature",
      "documentation_support_troubleshooting",
      "eci_cant_complete_check_in",
      "eci_config_change",
      "eci_incorrect_information",
      "eci_telehealth_config",
      "eci_virtual_kiosk",
      "feedback",
      "forms_creation",
      "forms_kill_re_queue",
      "forms_modification_to_form",
      "forms_not_sent",
      "forms_other_issue",
      "forms_posting_issue",
      "forms_rules_change",
      "hardware_kiosk_orders",
      "hardware_kiosk_troubleshooting",
      "hardware_pax_orders",
      "hardware_pax_troubleshooting",
      "health_ipass_app",
      "hip_cant_login",
      "hip_payment_contract_changes",
      "implementation_2_way_sms_confirm_req",
      "implementation_bridge_certification",
      "implementation_bridge_setup",
      "implementation_number_hosting_request",
      "implementation_number_purchase_request",
      "implementation_payer_mapping",
      "insurance_co_pay_value",
      "insurance_cost_estimator",
      "insurance_eligibility_status_return",
      "insurance_payer_mapping_update",
      "insurance_posting_issue",
      "insurance_rate_card_change",
      "insurance_rate_card_setup",
      "insurance_smart_deposit",
      "internal_support_account_issue",
      "internal_support_account_setup",
      "internal_support_hardware",
      "internal_support_mfa_issue",
      "internal_support_software",
      "jitbit_automations",
      "jitbit_client_setup",
      "messaging_bulk_messaging_problem",
      "messaging_bulk_messaging_request",
      "messaging_email_template_change",
      "messaging_in_clinic_message",
      "offboarding",
      "parent_ticket",
      "patient_financing",
      "patient_opened_ticket",
      "patient_portal_incorrect_info",
      "patient_portal_login_or_auth_fail",
      "patient_portal_patient_wallet",
      "patient_self_scheduling",
      "payments_config_change",
      "payments_modification",
      "payments_posting",
      "payments_processing",
      "q_a",
      "reports_custom_generation_request",
      "reports_generation_error",
      "reports_incorrect_data",
      "sales_demo_build",
      "sales_demo_config_update",
      "sftp",
      "sphere_credential_issues",
      "training",
      "user_interface_admin_ui",
      "user_interface_check_in",
      "user_interface_dashboard",
      "user_interface_other_patient_ui",
      "user_interface_patient_eci",
      "user_interface_patient_portal",
      "user_interface_patient360",
      "user_interface_reports",
      "users_enable_disable_sso",
      "users_new_modify_user",
      "users_password_reset",
      "users_unable_to_sign_in",
      "voc",
    ],
    urgency: [
      "1 High - inability to perform work",
      "2 Medium - impaired but can still work",
      "3 Low - inconvenient but not broken",
    ],
    impact: [
      "1 High - > 15 users/patients affected",
      "2 Med - > 5 users/patients affected",
      "3 Low - < 5 users/patients affected",
    ],
    voc_added_to_ideas_board: ["N/A", "NO", "YES"],
    voc_status: [
      "Accepted",
      "Completed",
      "Denied",
      "In Progress",
      "In Review",
      "None or N/A",
      "Submitted",
      "VoC Priority",
    ],
    root_cause: [
      "3rd Party",
      "API Testing",
      "Bill Balance Incorrect",
      "Bill Generation Failure",
      "Bill Generation Request",
      "Bug",
      "Client Training",
      "Code change (Use case gap)",
      "Config Update Requested",
      "Documentation",
      "Form Creation / Edit",
      "Form Posting Failure / Other Form Issue",
      "HiP Proactive Communication",
      "HiP SaaS Contract",
      "HiP Training",
      "HW Failure",
      "HW Request",
      "Internal Request",
      "Jitbit Change or Addition",
      "Kill & Re-queue",
      "Misconfiguration",
      "Onboarding",
      "Operations",
      "Patient Mistake",
      "Patient Ticket",
      "Practice Mistake/Oversight",
      "Q/A",
      "Timeout",
      "Unknown at this time",
      "VoC",
    ],
    resolution_code: [
      "3rd Party Fix",
      "API Testing",
      "Bug fix",
      "CANT Be Resolved / No Resolution",
      "Client Resolved Issue",
      "Client Training",
      "Config Change",
      "Database Edit",
      "Documentation",
      "Executed New Agreement",
      "Form Creation / Edit",
      "Form Q/A & Validation",
      "Full Appt Load",
      "HiP Training",
      "Hotfix",
      "HW Fix",
      "HW Net New",
      "HW Replacement",
      "HW Return",
      "Jitbit Change or Addition",
      "Kill & Re-queue",
      "Number Purchased",
      "Offboarding",
      "Onboarding",
      "Operations",
      "Parent Ticket",
      "Patient Ticket",
      "Payer Mapping",
      "Postman Data Pull",
      "Practice Mistake",
      "Question / Concern Answered",
      "Retry w/o Changes",
      "Spam / Vendor Email",
      "Use case gap (New Code)",
      "User Creation / Edit / PW Reset",
      "VoC",
    ],
    third_party: [
      "Amazon Web Services",
      "Artera",
      "Athena",
      "CTS",
      "eCW",
      "Ellkay",
      "ERO",
      "Exscribe",
      "Formstack",
      "Google",
      "GreenWay",
      "HealthTalk AI",
      "Instamed",
      "Issuing Bank",
      "Klara",
      "Linux VPN",
      "MedEvolve",
      "ModMed",
      "MotionMD",
      "N/A",
      "Nextech",
      "NextGen",
      "POS",
      "Practice / Client",
      "PrognoCIS",
      "Relatient",
      "Rippling",
      "Sendgrid",
      "Soti MobiControl",
      "Televox",
      "TransUnion/FinThrive",
      "TrustCommerce / Sphere",
      "Twilio",
      "Veradigm/Allscripts",
      "Visit Pay",
      "WorldPay / Vantiv",
      "xBridge",
      "Zinniax",
    ],
  };

  const PASSTHROUGH_ENUM_PROPERTIES = new Set(["practice"]);

  const SLUGIFIED_ENUM_PROPERTIES = new Set(["affected_component"]);

  const normalize = (s) =>
    String(s)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const slugify = (s) =>
    String(s)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  const resolveEnumValue = (hsProperty, rawValue) => {
    if (SLUGIFIED_ENUM_PROPERTIES.has(hsProperty)) {
      const slug = slugify(rawValue);
      return ENUM_OPTIONS[hsProperty]?.includes(slug) ? slug : null;
    }

    if (PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty)) {
      return String(rawValue).trim();
    }

    const options = ENUM_OPTIONS[hsProperty];
    if (!options) return rawValue;

    const normRaw = normalize(rawValue);
    const match = options.find((opt) => normalize(opt) === normRaw);
    return match ?? null;
  };

  const toMidnightUTC = (isoString) => {
    if (!isoString) return null;
    return `${isoString.split("T")[0]}T00:00:00.000Z`;
  };

  let targetPipeline = HUBSPOT_PIPELINES.CS_PIPELINE;
  let targetStage = HUBSPOT_STAGES.CS_PIPELINE.NEW;

  if (ticketRecord.Category && ticketRecord.Category.includes("Hardware")) {
    targetPipeline = HUBSPOT_PIPELINES.EXTERNAL_SUPPORT;
    targetStage = HUBSPOT_STAGES.EXTERNAL_SUPPORT.NEW;
  }
  else if (
    ticketRecord.Category &&
    ticketRecord.Category.includes("Implementation")
  ) {
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

  if (ticketRecord.DueDate) {
    mappedProperties.due_date = toMidnightUTC(ticketRecord.DueDate);
  }
  if (ticketRecord.ResolvedDate) {
    mappedProperties.closed_date = ticketRecord.ResolvedDate;
  }
 if (
    ticketRecord.Priority !== undefined &&
    PRIORITY_MAP.hasOwnProperty(ticketRecord.Priority)
) {
    mappedProperties.hs_ticket_priority = PRIORITY_MAP[ticketRecord.Priority];
}

  if (ticketRecord.Origin && ORIGIN_MAP[ticketRecord.Origin]) {
    mappedProperties.source_type = ORIGIN_MAP[ticketRecord.Origin];
  }

  const skippedFields = []; 

  Object.entries(CUSTOM_FIELD_MAP).forEach(([jitbitFieldName, hsProperty]) => {
    const rawValue = flatCustomFields[jitbitFieldName];
    if (rawValue === null || rawValue === undefined || rawValue === "") return;

    if (DATE_ONLY_PROPERTIES.has(hsProperty)) {
      mappedProperties[hsProperty] = toMidnightUTC(rawValue);
      return;
    }

    const isTrackedEnum =
      ENUM_OPTIONS[hsProperty] || PASSTHROUGH_ENUM_PROPERTIES.has(hsProperty);

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
    console.warn(
      `⚠️ Skipped ${skippedFields.length} unmatched enum value(s) for ticket ${ticketRecord.IssueID}:`,
      skippedFields,
    );
  }

  return mappedProperties;
}

// ==========================================
// 2. Create Ticket
// ==========================================
async function createTicket(hubspotPayload, email, companyName) {
  try {
    const response = await hubspotClient.crm.tickets.basicApi.create({
      properties: hubspotPayload,
    });
    const ticketId = response.id;
    logger.info(`✅ Ticket Created | HubSpot ID: ${ticketId}`);

    if (email) {
      const contactSearch = await hubspotClient.crm.contacts.searchApi.doSearch(
        {
          filterGroups: [
            {
              filters: [
                { propertyName: "email", operator: "EQ", value: email },
              ],
            },
          ],
        },
      );
      if (contactSearch.results.length > 0) {
        await hubspotClient.crm.associations.v4.basicApi.create(
          "tickets",
          ticketId,
          "contacts",
          contactSearch.results[0].id,
          [
            { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 16 }, 
          ],
        );
        logger.info(`🔗 Associated Contact: ${contactSearch.results[0].id}`);
      }
    }

    if (companyName) {
      const companySearch =
        await hubspotClient.crm.companies.searchApi.doSearch({
          filterGroups: [
            {
              filters: [
                { propertyName: "name", operator: "EQ", value: companyName },
              ],
            },
          ],
        });
      if (companySearch.results.length > 0) {
        await hubspotClient.crm.associations.v4.basicApi.create(
          "tickets",
          ticketId,
          "companies",
          companySearch.results[0].id,
          [
            { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 26 },
          ],
        );
        logger.info(`🔗 Associated Company: ${companySearch.results[0].id}`);
      }
    }

    return ticketId;
  } catch (error) {
    logger.error(`❌ HubSpot Create Failed: ${error.message}`);
    return null;
  }
}

// ==========================================
// 3. Sync Single Ticket
// ==========================================
async function syncSingleTicket(ticketRecord) {
  if (!ticketRecord || !ticketRecord.IssueID) {
    logger.error("❌ Invalid ticket record provided. Missing IssueID.");
    return;
  }

  const issueId = ticketRecord.IssueID;
  const subject = ticketRecord.Subject;
  logger.info(`🚀 Syncing Ticket ID: ${issueId}`);

  // =========================================================================
  // NAYA LOGIC: HubSpot me Search karein ki Issue_ID aur Subject pehle se hai ya nahi
  // =========================================================================
  try {
    const searchResponse = await hubspotClient.crm.tickets.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            { propertyName: "issue_id", operator: "EQ", value: issueId.toString() },
            // { propertyName: "subject", operator: "EQ", value: subject }
          ]
        }
      ]
    });

    if (searchResponse.results && searchResponse.results.length > 0) {
      // logger.info(`⏭️ Ticket already exists in HubSpot (IssueID: ${issueId}, Subject: "${subject}"). Skipping...`); 
      logger.info(`⏭️ Ticket already exists in HubSpot (IssueID: ${issueId}). Skipping...`);
      return; // Agar mil gaya to yahin se wapas laut jayega, aage ka code nahi chalega.
    }
  } catch (error) {
    logger.error(`❌ HubSpot Search Failed for IssueID ${issueId}: ${error.message}`);
    // Agar search API fail hoti hai, hum ise skip kar rahe hain taaki duplicates na bane
    return; 
  }
  // =========================================================================

  let customFields = [];
  try {
    customFields = await getTicketCustomFields(issueId);
  } catch (err) {
    logger.error(`⚠️ Failed to fetch custom fields: ${err.message}`);
  }

  const hubspotPayload = transformTicket(ticketRecord, customFields);
  logger.info(
    `========== HUBSPOT PAYLOAD ==========\n  ${JSON.stringify(hubspotPayload, null, 2)}`,
  );

  await createTicket(
    hubspotPayload,
    ticketRecord.Email,
    ticketRecord.CompanyName,
  );
  logger.info(`✅ Sync Completed for Ticket ID: ${issueId}`);
}

// ==========================================
// 4. Fetch All Tickets and Start Sync
// ==========================================
async function syncAllTickets() {
  try {
    logger.info("📡 Fetching tickets from Jitbit...");
    
    // Fetch tickets array from Jitbit
    const tickets = await getTickets();
    
    if (!tickets || tickets.length === 0) {
      logger.info("ℹ️ No tickets found to sync.");
      return;
    }

    logger.info(`📦 Found ${tickets.length} tickets. Starting bulk sync...`);

    // Loop through each ticket and sync to HubSpot
    for (const ticket of tickets) {
      await syncSingleTicket(ticket);
    }

    logger.info("🎉 All tickets successfully synced to HubSpot!");

  } catch (error) {
    logger.error(`❌ Global Sync Error: ${error.message}`);
  }
}

// Run the main process
syncAllTickets();



