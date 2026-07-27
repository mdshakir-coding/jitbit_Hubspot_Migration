

// //...........................New Code...........................//.........................
// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";

// import {
//   getCompanies,
//   getCompanyDetails,
//   getCompanyCustomFields,
// } from "./jitbit.services.js";

// // ==========================================
// // HubSpot Client
// // ==========================================

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// // ==========================================
// // Dynamic Formatting Helpers
// // ==========================================

// /**
//  * Handles Jitbit labels that do not dynamically convert to exact HubSpot internal names.
//  */
// const PROPERTY_OVERRIDES = {
//   "Engineer Responsible for Billing": "engineer_responsible_billing",
//   "ECI Notes (Pharmacy? Govt Ins no CoF? Etc)": "eci_notes",
//   "EHR is the same as PM": "ehr_is_same_as_pm",
// };

// /**
//  * These properties do not exist in your HubSpot portal.
//  * If you send them, HubSpot will reject the entire payload with a 400 error.
//  */
// const PROPERTIES_TO_IGNORE = [
//   "HubSpot ID",
//   "Uses HiP Kiosks (iPad app)",
//   // Add any future fields here if HubSpot throws a "PROPERTY_DOESNT_EXIST" error
// ];

// /**
//  * Converts a Jitbit field label into a HubSpot-compatible internal property name.
//  */
// function formatHubSpotProperty(label) {
//   if (!label) return "";

//   // 1. Check if we have an explicit override for this label
//   if (PROPERTY_OVERRIDES[label]) {
//     return PROPERTY_OVERRIDES[label];
//   }

//   // 2. Otherwise, dynamically generate the snake_case name
//   return label
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "_") // Replace spaces and special characters with underscores
//     .replace(/^_+|_+$/g, ""); // Remove trailing or leading underscores
// }

// /**
//  * Cleans up the values coming from Jitbit so HubSpot doesn't reject them.
//  */
// function formatHubSpotValue(hubspotKey, value) {
//   if (value === null || value === undefined) return "";

//   let normalizedValue = value.toString().trim();

//   // Convert Jitbit checkmarks to a string boolean
//   if (normalizedValue === "✓") {
//     normalizedValue = "true";
//   }

//   // Handle specific Picklist formatting rules for HubSpot
//   if (hubspotKey === "cost_estimator") {
//     if (normalizedValue.toLowerCase() === "true") return "Yes";
//     if (normalizedValue.toLowerCase() === "false") return "No";
//   }

//   if (
//     hubspotKey === "client_status" &&
//     normalizedValue === "Disabled / Churned"
//   ) {
//     return "Churned";
//   }

//   return normalizedValue;
// }

// // ==========================================
// // Search Existing Company (ONLY by Name)
// // ==========================================

// async function searchCompanyByName(companyName) {
//   if (!companyName) return null; // Skip if name is empty
//   try {
//     const response = await hubspotClient.crm.companies.searchApi.doSearch({
//       filterGroups: [
//         {
//           filters: [
//             {
//               propertyName: "name",
//               operator: "EQ",
//               value: companyName.trim(), // Stripping extra spaces
//             },
//           ],
//         },
//       ],
//       properties: ["name", "company_id"],
//     });

//     return response.results[0] || null;
//   } catch (error) {
//     logger.error(`Company Name Search Failed for '${companyName}': ${error.message}`);
//     return null;
//   }
// }

// // ==========================================
// // Create Company in HubSpot
// // ==========================================

// async function createCompany(company, customFields) {
//   try {
//     // ==============================
//     // Dynamic Custom Field Mapping
//     // ==============================

//     const mappedProperties = {};

//     customFields.forEach((field) => {
//       // Skip fields that do not exist in HubSpot
//       if (PROPERTIES_TO_IGNORE.includes(field.FieldName)) {
//         return;
//       }

//       // Dynamically generate the property name and clean the value
//       const hubspotProperty = formatHubSpotProperty(field.FieldName);
//       const hubspotValue = formatHubSpotValue(hubspotProperty, field.Value);

//       mappedProperties[hubspotProperty] = hubspotValue;
//     });

//     logger.info("========== DYNAMIC CUSTOM FIELD MAP ==========");
//     logger.info(JSON.stringify(mappedProperties, null, 2));

//     // ==============================
//     // HubSpot Payload
//     // ==============================

//     const payload = {
//       name: company.Name || "",
//       domain: company.EmailDomain || "",
//       company_id: company.CompanyID?.toString() || "",
//       ...mappedProperties,
//     };

//     logger.info("========== HUBSPOT PAYLOAD ==========");
//     logger.info(JSON.stringify(payload, null, 2));

//     const response = await hubspotClient.crm.companies.basicApi.create({
//       properties: payload,
//     });

//     logger.info(
//       `✅ Company Synced Successfully: ${company.Name} | HubSpot ID: ${response.id}`,
//     );

//     // return response.id;
//   } catch (error) {
//     logger.error(`❌ Company Sync Failed: ${company.Name}`);

//     if (error.response) {
//       logger.error(JSON.stringify(error.response.body, null, 2));
//     } else {
//       logger.error(error.message);
//     }

//     return null;
//   }
// }

// // ==========================================
// // Sync All Companies (Production)
// // ==========================================

// async function syncCompany() {
//   try {
//     const companies = await getCompanies();

//     if (!companies || companies.length === 0) {
//       logger.info("No companies found.");
//       return;
//     }

//     logger.info(`🚀 Found ${companies.length} companies to sync.`);

//     // Loop through all fetched companies
//     for (const company of companies) {
//       try {
//         logger.info(`🚀 Syncing Company: ${company.Name} (${company.CompanyID})`);

//         // ==============================
//         // Fetch Complete Company Details
//         // ==============================

//         const companyDetails = await getCompanyDetails(company.CompanyID);

//         // ==============================
//         // Fetch Custom Fields
//         // ==============================

//         const customFields = await getCompanyCustomFields(company.CompanyID);

//         // Merge Jitbit Company Data
//         const finalCompany = {
//           ...company,
//           ...companyDetails,
//         };

//         logger.info("========== FINAL COMPANY DATA ==========");
//         // logger.info(JSON.stringify(finalCompany, null, 2));

//         // ==============================
//         // Duplicate Check (Only by Name)
//         // ==============================

//         const existingCompany = await searchCompanyByName(finalCompany.Name);

//         if (existingCompany) {
//           logger.info(
//             `⚠️ Company already exists in HubSpot (Skipping). Name: ${existingCompany.properties.name} | ID: ${existingCompany.id}`,
//           );
//           continue; // Skip creating and move to the next company in the loop
//         }

//         await createCompany(finalCompany, customFields);

//       } catch (companyError) {
//         // Log the error for this specific company but don't stop the whole loop
//         logger.error(`❌ Failed to process company ${company.Name || company.CompanyID}: ${companyError.message}`);
//       }
//     }

//     logger.info("✅ All Companies Sync Completed.");
//   } catch (error) {
//     logger.error(`❌ Sync Failed: ${error.message}`);
//   }
// }

// // ==========================================
// // Run
// // ==========================================

// async function runSync() {
//   logger.info("🚀 Starting Jitbit → HubSpot Company Sync...");

//   await syncCompany();

//   logger.info("🎉 Process Finished.");
// }

// runSync();

// export { syncCompany, runSync };


import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import logger from "../utils/logger.js";

import {
  getCompanies,
  getCompanyDetails,
  getCompanyCustomFields,
} from "./jitbit.services.js";

// ==========================================
// HubSpot Client
// ==========================================

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_TOKEN,
});

// ==========================================
// Dynamic Formatting Helpers
// ==========================================

/**
 * Handles Jitbit labels that do not dynamically convert to exact HubSpot internal names.
 */
const PROPERTY_OVERRIDES = {
  "Engineer Responsible for Billing": "engineer_responsible_billing",
  "ECI Notes (Pharmacy? Govt Ins no CoF? Etc)": "eci_notes",
  "EHR is the same as PM": "ehr_is_same_as_pm",
};

/**
 * These properties do not exist in your HubSpot portal.
 * If you send them, HubSpot will reject the entire payload with a 400 error.
 */
const PROPERTIES_TO_IGNORE = [
  "HubSpot ID",
  "Uses HiP Kiosks (iPad app)",
  // Add any future fields here if HubSpot throws a "PROPERTY_DOESNT_EXIST" error
];

/**
 * Converts a Jitbit field label into a HubSpot-compatible internal property name.
 */
function formatHubSpotProperty(label) {
  if (!label) return "";

  // 1. Check if we have an explicit override for this label
  if (PROPERTY_OVERRIDES[label]) {
    return PROPERTY_OVERRIDES[label];
  }

  // 2. Otherwise, dynamically generate the snake_case name
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // Replace spaces and special characters with underscores
    .replace(/^_+|_+$/g, ""); // Remove trailing or leading underscores
}

/**
 * Cleans up the values coming from Jitbit so HubSpot doesn't reject them.
 */
function formatHubSpotValue(hubspotKey, value) {
  if (value === null || value === undefined) return "";

  let normalizedValue = value.toString().trim();

  // Convert Jitbit checkmarks to a string boolean
  if (normalizedValue === "✓") {
    normalizedValue = "true";
  }

  // Handle specific Picklist formatting rules for HubSpot
  if (hubspotKey === "cost_estimator") {
    if (normalizedValue.toLowerCase() === "true") return "Yes";
    if (normalizedValue.toLowerCase() === "false") return "No";
  }

  if (
    hubspotKey === "client_status" &&
    normalizedValue === "Disabled / Churned"
  ) {
    return "Churned";
  }

  return normalizedValue;
}

// ==========================================
// Search Existing Company (By SourceID)
// ==========================================

async function searchCompanyBySourceId(sourceid) {
  if (!sourceid) return null; // Skip if sourceid is empty
  
  try {
    const response = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "sourceid",
              operator: "EQ",
              value: sourceid.toString().trim(),
            },
          ],
        },
      ],
      properties: ["domain", "name", "company_id", "sourceid"],
    });

    return response.results[0] || null;
  } catch (error) {
    logger.error(`Company SourceID Search Failed for '${sourceid}': ${error.message}`);
    return null;
  }
}

// ==========================================
// Create Company in HubSpot
// ==========================================

async function createCompany(company, customFields) {
  try {
    // ==============================
    // Dynamic Custom Field Mapping
    // ==============================

    const mappedProperties = {};

    customFields.forEach((field) => {
      // Skip fields that do not exist in HubSpot
      if (PROPERTIES_TO_IGNORE.includes(field.FieldName)) {
        return;
      }

      // Dynamically generate the property name and clean the value
      const hubspotProperty = formatHubSpotProperty(field.FieldName);
      const hubspotValue = formatHubSpotValue(hubspotProperty, field.Value);

      mappedProperties[hubspotProperty] = hubspotValue;
    });

    logger.info("========== DYNAMIC CUSTOM FIELD MAP ==========");
    logger.info(JSON.stringify(mappedProperties, null, 2));

    // ==============================
    // HubSpot Payload
    // ==============================

    const payload = {
      name: company.Name || "",
      domain: company.EmailDomain || "",
      company_id: company.CompanyID?.toString() || "",
      sourceid: company.CompanyID?.toString() || "", // Mapping for sourceid
      ...mappedProperties,
    };

    logger.info("========== HUBSPOT PAYLOAD ==========");
    logger.info(JSON.stringify(payload, null, 2));

    const response = await hubspotClient.crm.companies.basicApi.create({
      properties: payload,
    });

    logger.info(
      `✅ Company Synced Successfully: ${company.Name} | HubSpot ID: ${response.id}`
    );

    // return response.id;
  } catch (error) {
    logger.error(`❌ Company Sync Failed: ${company.Name}`);

    if (error.response) {
      logger.error(JSON.stringify(error.response.body, null, 2));
    } else {
      logger.error(error.message);
    }

    return null;
  }
}

// ==========================================
// Sync All Companies (Production)
// ==========================================

async function syncCompany() {
  try {
    const companies = await getCompanies();

    if (!companies || companies.length === 0) {
      logger.info("No companies found.");
      return;
    }

    logger.info(`🚀 Found ${companies.length} companies to sync.`);

    // Loop through all fetched companies
    for (const company of companies) {
      try {
        logger.info(`🚀 Syncing Company: ${company.Name} (${company.CompanyID})`);

        // ==============================
        // Fetch Complete Company Details
        // ==============================

        const companyDetails = await getCompanyDetails(company.CompanyID);

        // ==============================
        // Fetch Custom Fields
        // ==============================

        const customFields = await getCompanyCustomFields(company.CompanyID);

        // Merge Jitbit Company Data
        const finalCompany = {
          ...company,
          ...companyDetails,
        };

        logger.info("========== FINAL COMPANY DATA ==========");
        // logger.info(JSON.stringify(finalCompany, null, 2));

        // ==============================
        // Duplicate Check (ONLY by SourceID)
        // ==============================
        
        // Match using the sourceid (CompanyID)
        const existingCompany = await searchCompanyBySourceId(finalCompany.CompanyID);

        if (existingCompany) {
          logger.info(
            `⚠️ Company already exists in HubSpot (Skipping). ID: ${existingCompany.id} | SourceID: ${existingCompany.properties.sourceid || "N/A"}`
          );
          continue; // Skip creating and move to the next company in the loop
        }

        await createCompany(finalCompany, customFields);

      } catch (companyError) {
        // Log the error for this specific company but don't stop the whole loop
        logger.error(`❌ Failed to process company ${company.Name || company.CompanyID}: ${companyError.message}`);
      }
    }

    logger.info("✅ All Companies Sync Completed.");
  } catch (error) {
    logger.error(`❌ Sync Failed: ${error.message}`);
  }
}

// ==========================================
// Run
// ==========================================

async function runSync() {
  logger.info("🚀 Starting Jitbit → HubSpot Company Sync...");

  await syncCompany();

  logger.info("🎉 Process Finished.");
}

runSync();

export { syncCompany, runSync };