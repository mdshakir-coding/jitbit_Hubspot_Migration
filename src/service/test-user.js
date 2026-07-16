

// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";
// import { getUsers } from "./jitbit.services.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// async function findCompanyInHubSpot(companyName) {
//   try {
//     const response = await hubspotClient.crm.companies.searchApi.doSearch({
//       filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: companyName }] }],
//       properties: ["name"]
//     });
//     return response.results.length > 0 ? response.results[0].id : null;
//   } catch (e) {
//     return null;
//   }
// }

// async function runSync() {
//   logger.info("🚀 Starting Final Targeted Sync...");
//   const users = await getUsers();
//   const targetUser = users.find(u => u.Email === "mrethical006+1@gmail.com");

//   if (!targetUser) return;

//   try {
//     const hsCompanyId = await findCompanyInHubSpot(targetUser.CompanyName || "Test");
//     if (!hsCompanyId) {
//       logger.warn(`⚠️ Company "${targetUser.CompanyName}" Not Find Company In HubSpot.`);
//       return;
//     }

//   const properties = {
//   // Basic Information
//   firstname: targetUser.FirstName,
//   lastname: targetUser.LastName,
//   email: targetUser.Email,
//   phone: targetUser.Phone,
//   company: targetUser.CompanyName,
//   city: targetUser.Location,

//   // Custom Properties
//   full_name: targetUser.FullName,
//   client_id__sender_id_: String(targetUser.UserID ),
//   associatedcompanyid:
//     targetUser.CompanyID != null
//       ? String(targetUser.CompanyID)
//       : null,
// };

//     // 1. Contact Create/Update
//     const existing = await hubspotClient.crm.contacts.searchApi.doSearch({
//       filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: targetUser.Email }] }],
//       properties: ["email"]
//     });

//     let contactId;
//     if (existing.results.length > 0) {
//       contactId = existing.results[0].id;
//       await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
//       logger.info(`🔄 Updated contact: ${contactId}`);
//     } else {
//       const newContact = await hubspotClient.crm.contacts.basicApi.create({ properties });
//       contactId = newContact.id;
//       logger.info(`✅ Created contact: ${contactId}`);
//     }

//     // 2. Association (v4 API - Sabse stable tarika)
//     await hubspotClient.crm.associations.v4.basicApi.create("contact", contactId, "company", hsCompanyId, [
//       { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }
//     ]);
    
//     logger.info(`🎉 Successfully Associated Contact ${contactId} with Company ${hsCompanyId}`);

//   } catch (error) {
//     logger.error(`❌ Sync Failed: ${error.message}`);
//   }
// }

// runSync();




// ...............................New Code //...............................................



// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";
// import { getUsers } from "./jitbit.services.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// async function findCompanyInHubSpot(companyName) {
//   try {
//     const response = await hubspotClient.crm.companies.searchApi.doSearch({
//       filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: companyName }] }],
//       properties: ["name"]
//     });
//     return response.results.length > 0 ? response.results[0].id : null;
//   } catch (e) {
//     return null;
//   }
// }

// async function runSync() {
//   logger.info("🚀 Starting Full Sync: Jitbit to HubSpot...");
//   const users = await getUsers();
  
//   if (!users || users.length === 0) {
//     logger.warn("⚠️ No users fetched from Jitbit.");
//     return;
//   }
  
//   logger.info(`✅ Fetched ${users.length} users. Processing started...`);

//   // Loop through all users fetched from Jitbit
//   for (const targetUser of users) {
//     // Skip if email is missing to prevent HubSpot API errors
//     if (!targetUser.Email) {
//       logger.warn(`⚠️ Skipping user ID ${targetUser.UserID} because Email is missing.`);
//       continue; 
//     }

//     try {
//       const hsCompanyId = await findCompanyInHubSpot(targetUser.CompanyName || "Test");
      
//       // Original logic: If company not found, log warning and skip to next user
//       if (!hsCompanyId) {
//         logger.warn(`⚠️ Company "${targetUser.CompanyName}" Not Found In HubSpot for ${targetUser.Email}. Skipping association.`);
//         continue; 
//       }

//       const properties = {
//         // Basic Information
//         firstname: targetUser.FirstName,
//         lastname: targetUser.LastName,
//         email: targetUser.Email,
//         phone: targetUser.Phone,
//         company: targetUser.CompanyName,
//         city: targetUser.Location,

//         // Custom Properties
//         full_name: targetUser.FullName,
//         client_id__sender_id_: String(targetUser.UserID),
//         associatedcompanyid:
//           targetUser.CompanyID != null
//             ? String(targetUser.CompanyID)
//             : null,
//       };

//       // 1. Contact Create/Update
//       const existing = await hubspotClient.crm.contacts.searchApi.doSearch({
//         filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: targetUser.Email }] }],
//         properties: ["email"]
//       });

//       let contactId;
//       if (existing.results.length > 0) {
//         contactId = existing.results[0].id;
//         await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
//         logger.info(`🔄 Updated contact: ${targetUser.Email} (${contactId})`);
//       } else {
//         const newContact = await hubspotClient.crm.contacts.basicApi.create({ properties });
//         contactId = newContact.id;
//         logger.info(`✅ Created contact: ${targetUser.Email} (${contactId})`);
//       }

//       // 2. Association (v4 API - Sabse stable tarika)
//       await hubspotClient.crm.associations.v4.basicApi.create("contact", contactId, "company", hsCompanyId, [
//         { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }
//       ]);
      
//       logger.info(`🎉 Successfully Associated Contact ${contactId} with Company ${hsCompanyId}`);

//     } catch (error) {
//       // Catch error for specific user but continue the loop
//       logger.error(`❌ Sync Failed for ${targetUser.Email}: ${error.message}`);
//     }
//   }

//   logger.info("🏁 Full Sync Completed Successfully!");
// }

// runSync();



// ...............................New Code2 //..............................................

import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import logger from "../utils/logger.js";
import { 
  getUsers, 
  getCompanyDetails, 
  getCompanyCustomFields 
} from "./jitbit.services.js";

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_TOKEN,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory cache so we don't repeat the same company lookups/creations across many users
const companyCache = new Map(); 

// ==========================================
// Company Constants & Helpers
// ==========================================
const PROPERTY_OVERRIDES = {
  "Engineer Responsible for Billing": "engineer_responsible_billing",
  "ECI Notes (Pharmacy? Govt Ins no CoF? Etc)": "eci_notes",
  "EHR is the same as PM": "ehr_is_same_as_pm",
};

const PROPERTIES_TO_IGNORE = [
  "HubSpot ID",
  "Uses HiP Kiosks (iPad app)",
];

function formatHubSpotProperty(label) {
  if (!label) return "";
  if (PROPERTY_OVERRIDES[label]) {
    return PROPERTY_OVERRIDES[label];
  }
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") 
    .replace(/^_+|_+$/g, ""); 
}

function formatHubSpotValue(hubspotKey, value) {
  if (value === null || value === undefined) return "";
  let normalizedValue = value.toString().trim();

  if (normalizedValue === "✓") normalizedValue = "true";

  if (hubspotKey === "cost_estimator") {
    if (normalizedValue.toLowerCase() === "true") return "Yes";
    if (normalizedValue.toLowerCase() === "false") return "No";
  }

  if (hubspotKey === "client_status" && normalizedValue === "Disabled / Churned") {
    return "Churned";
  }
  return normalizedValue;
}

// ==========================================
// Company Search & Creation Logic
// ==========================================

async function createMissingCompany(companyId, companyName) {
  try {
    logger.info(`Fetching details from Jitbit to create missing Company: ${companyName} (${companyId})...`);
    
    // 1. Fetch Company details from Jitbit
    const companyDetails = await getCompanyDetails(companyId);
    const customFields = await getCompanyCustomFields(companyId);

    const mappedProperties = {};

    if (customFields && customFields.length > 0) {
      customFields.forEach((field) => {
        if (PROPERTIES_TO_IGNORE.includes(field.FieldName)) return;
        const hubspotProperty = formatHubSpotProperty(field.FieldName);
        const hubspotValue = formatHubSpotValue(hubspotProperty, field.Value);
        mappedProperties[hubspotProperty] = hubspotValue;
      });
    }

    const payload = {
      name: companyName?.trim() || companyDetails?.Name?.trim() || "Unknown Company",
      domain: companyDetails?.EmailDomain?.trim() || "",
      company_id: companyId.toString(),
      ...mappedProperties,
    };

    // 2. Create Company in HubSpot
    const response = await hubspotClient.crm.companies.basicApi.create({
      properties: payload,
    });

    logger.info(`✅ Missing Company Created Successfully in HubSpot: ${payload.name} | ID: ${response.id}`);
    return response.id;
  } catch (error) {
    logger.error(`❌ Failed to create missing Company [${companyId}]: ${JSON.stringify(error.response?.body || error.message)}`);
    return null;
  }
}

async function findCompanyByJitbitId(companyId, fallbackName) {
  if (!companyId) return null;
  
  const cacheKey = String(companyId);
  if (companyCache.has(cacheKey)) return companyCache.get(cacheKey);

  let hsCompanyId = null;

  // 1. Search by custom property 'company_id' first (most reliable)
  try {
    const byId = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [{ filters: [{ propertyName: "company_id", operator: "EQ", value: cacheKey }] }],
      properties: ["name", "company_id"],
      limit: 1,
    });
    if (byId.results?.length > 0) hsCompanyId = byId.results[0].id;
  } catch (error) {
    // Fails silently if property doesn't exist
  }

  // 2. Fallback search by exact Name
  if (!hsCompanyId && fallbackName) {
    try {
      const byName = await hubspotClient.crm.companies.searchApi.doSearch({
        filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: fallbackName.trim() }] }],
        properties: ["name"],
        limit: 1,
      });
      if (byName.results?.length > 0) hsCompanyId = byName.results[0].id;
    } catch (error) {}
  }

  if (hsCompanyId) companyCache.set(cacheKey, hsCompanyId);
  return hsCompanyId;
}

// ==========================================
// Main Sync Logic
// ==========================================

async function runSync() {
  logger.info("🚀 Starting Full Sync: Jitbit to HubSpot (Users & Companies)...");
  const users = await getUsers();
  
  if (!users || users.length === 0) {
    logger.warn("⚠️ No users fetched from Jitbit.");
    return;
  }
  
  logger.info(`✅ Fetched ${users.length} users. Processing started...`);

  // Loop through all users fetched from Jitbit
  for (const targetUser of users) {
    
    // Remove any accidental leading/trailing spaces from the email
    const cleanEmail = targetUser.Email ? targetUser.Email.trim() : "";

    // Skip if email is missing or empty to prevent HubSpot API errors
    if (!cleanEmail) {
      logger.warn(`⚠️ Skipping user ID ${targetUser.UserID} because Email is missing or invalid.`);
      continue; 
    }

    try {
      let hsCompanyId = null;

      // Only attempt company logic if the user actually belongs to a company in Jitbit
      if (targetUser.CompanyID) {
        // 1. Search for Company in HubSpot
        hsCompanyId = await findCompanyByJitbitId(targetUser.CompanyID, targetUser.CompanyName);

        // 2. If company doesn't exist in HubSpot, fetch from Jitbit and Create
        if (!hsCompanyId) {
          logger.warn(`⚠️ Company "${targetUser.CompanyName}" not found in HubSpot for user ${cleanEmail}. Initiating creation...`);
          hsCompanyId = await createMissingCompany(targetUser.CompanyID, targetUser.CompanyName);
          
          // Save to cache so other users from the same company don't trigger creation again
          if (hsCompanyId) companyCache.set(String(targetUser.CompanyID), hsCompanyId);
        }
      }

      // 3. Prepare Contact Properties (using cleaned values)
      const properties = {
        // Basic Information
        firstname: targetUser.FirstName ? targetUser.FirstName.trim() : "",
        lastname: targetUser.LastName ? targetUser.LastName.trim() : "",
        email: cleanEmail,
        phone: targetUser.Phone ? targetUser.Phone.trim() : "",
        company: targetUser.CompanyName ? targetUser.CompanyName.trim() : "",
        city: targetUser.Location ? targetUser.Location.trim() : "",

        // Custom Properties
        full_name: targetUser.FullName ? targetUser.FullName.trim() : "",
        client_id__sender_id_: String(targetUser.UserID),
        associatedcompanyid:
          targetUser.CompanyID != null
            ? String(targetUser.CompanyID)
            : null,
      };

      // 4. Contact Create/Update Logic
      const existing = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: cleanEmail }] }],
        properties: ["email"]
      });

      let contactId;
      if (existing.results.length > 0) {
        contactId = existing.results[0].id;
        await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
        logger.info(`🔄 Updated contact: ${cleanEmail} (${contactId})`);
      } else {
        const newContact = await hubspotClient.crm.contacts.basicApi.create({ properties });
        contactId = newContact.id;
        logger.info(`✅ Created contact: ${cleanEmail} (${contactId})`);
      }

      // 5. Association (Only if a company ID was successfully found or created)
      if (hsCompanyId) {
        await hubspotClient.crm.associations.v4.basicApi.create("contact", contactId, "company", hsCompanyId, [
          { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }
        ]);
        logger.info(`🎉 Successfully Associated Contact ${contactId} with Company ${hsCompanyId}`);
      } else if (targetUser.CompanyID) {
        logger.error(`❌ Could not associate Contact ${contactId} because Company creation failed.`);
      }

    } catch (error) {
      // Catch error for specific user but continue the loop
      logger.error(`❌ Sync Failed for ${cleanEmail}: ${error.message}`);
    }

    // Small delay to prevent hitting HubSpot API rate limits (100 req / 10 sec)
    await sleep(100);
  }

  logger.info("🏁 Full Sync Completed Successfully!");
}

runSync();