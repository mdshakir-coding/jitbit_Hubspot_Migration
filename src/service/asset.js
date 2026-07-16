

// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";
// import { getAssets } from "./jitbit.services.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// const ASSET_OBJECT_TYPE = "2-65872643";

// // Updated to use the FieldIDs from the CustomFields API response
// const DATE_FIELD_MAPPINGS = [
//   { fieldId: 57319, hubspotProperty: "deployment_date", label: "Deployment Date" },
//   { fieldId: 57321, hubspotProperty: "decommission_date", label: "Decommission Date" },
// ];

// // Only sync assets belonging to this Jitbit company (CBSI)
// const TARGET_COMPANY_ID = 1414826;

// // Small delay helper to stay under HubSpot's rate limit (100 req / 10s)
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // Pull a Jitbit custom field's Value out of an asset's Fields array by ID safely
// function getJitbitFieldValue(asset, fieldId) {
//   // Convert both to strings in case the API returns the FieldID as a string
//   const field = asset.Fields?.find((f) => String(f.FieldID) === String(fieldId));
//   return field ? field.Value : null;
// }

// // HubSpot "date" (not datetime) properties require midnight UTC as an epoch
// // millisecond timestamp. Returns undefined for null/invalid input so the
// // property can be omitted from the payload rather than sent as garbage.
// function toHubspotDateMs(value) {
//   if (!value) return undefined;

//   const parsed = new Date(value);
//   if (Number.isNaN(parsed.getTime())) return undefined;

//   const utcMidnight = Date.UTC(
//     parsed.getUTCFullYear(),
//     parsed.getUTCMonth(),
//     parsed.getUTCDate(),
//   );

//   return String(utcMidnight);
// }

// // Ensures a HubSpot date property exists on the Asset object, creating it
// // if missing. Cheap to call repeatedly since it's cached after first check.
// const ensuredProperties = new Set();

// async function ensureDateProperty(hubspotProperty, label) {
//   if (ensuredProperties.has(hubspotProperty)) return;

//   try {
//     await hubspotClient.crm.properties.coreApi.getByName(
//       ASSET_OBJECT_TYPE,
//       hubspotProperty,
//     );
//     ensuredProperties.add(hubspotProperty);
//   } catch (error) {
//     // 404 means it doesn't exist yet — create it
//     if (error.code === 404) {
//       try {
//         await hubspotClient.crm.properties.coreApi.create(ASSET_OBJECT_TYPE, {
//           name: hubspotProperty,
//           label,
//           type: "date",
//           fieldType: "date",
//           groupName: "asset_information",
//         });
//         logger.info(`✅ Created Asset property: ${hubspotProperty}`);
//         ensuredProperties.add(hubspotProperty);
//       } catch (createError) {
//         logger.error(
//           `Property Create Error [${hubspotProperty}]: ${JSON.stringify(
//             createError.body || createError.message,
//           )}`,
//         );
//       }
//     } else {
//       logger.error(
//         `Property Lookup Error [${hubspotProperty}]: ${JSON.stringify(
//           error.body || error.message,
//         )}`,
//       );
//     }
//   }
// }

// async function ensureAssetDateProperties() {
//   for (const { hubspotProperty, label } of DATE_FIELD_MAPPINGS) {
//     await ensureDateProperty(hubspotProperty, label);
//   }
// }

// // In-memory cache so we don't repeat the same company lookups across 261 assets
// const companyCache = new Map(); // jitbit CompanyID -> hubspot company id

// // Resolved once per run: { typeId, fromObjectType, toObjectType }
// let assetCompanyAssociation = null;

// async function resolveAssetCompanyAssociation() {
//   if (assetCompanyAssociation) {
//     return assetCompanyAssociation;
//   }

//   const definitionsApi =
//     hubspotClient.crm.associations.v4.schema.definitionsApi;

//   try {
//     // Check forward direction: Asset -> Company
//     const forward = await definitionsApi.getAll(ASSET_OBJECT_TYPE, "companies");
//     if (forward.results?.length > 0) {
//       assetCompanyAssociation = {
//         typeId: forward.results[0].typeId,
//         category: forward.results[0].category,
//         fromObjectType: ASSET_OBJECT_TYPE,
//         toObjectType: "companies",
//       };
//       logger.info(
//         `ℹ️ Found existing Asset->Company association (typeId ${assetCompanyAssociation.typeId})`,
//       );
//       return assetCompanyAssociation;
//     }
//   } catch (error) {
//     logger.error(
//       `Association Lookup Error (forward): ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );
//   }

//   try {
//     // Check reverse direction: Company -> Asset
//     const reverse = await definitionsApi.getAll("companies", ASSET_OBJECT_TYPE);
//     if (reverse.results?.length > 0) {
//       assetCompanyAssociation = {
//         typeId: reverse.results[0].typeId,
//         category: reverse.results[0].category,
//         fromObjectType: "companies",
//         toObjectType: ASSET_OBJECT_TYPE,
//         reversed: true,
//       };
//       logger.info(
//         `ℹ️ Found existing Company->Asset association (typeId ${assetCompanyAssociation.typeId})`,
//       );
//       return assetCompanyAssociation;
//     }
//   } catch (error) {
//     logger.error(
//       `Association Lookup Error (reverse): ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );
//   }

//   // Nothing exists yet in either direction — create one.
//   // Uses a unique name to avoid the earlier "asset_to_company" name clash.
//   try {
//     await definitionsApi.create(ASSET_OBJECT_TYPE, "companies", {
//       name: "jitbit_asset_to_company",
//       label: "Asset to Company",
//     });

//     // Re-fetch directionally rather than trusting create()'s response order —
//     // create() returns both the forward AND inverse label in one response,
//     // and results[0] is not guaranteed to be the forward (Asset->Company) one.
//     const confirmed = await definitionsApi.getAll(ASSET_OBJECT_TYPE, "companies");

//     if (!confirmed.results?.length) {
//       throw new Error("Association created but not found on re-fetch");
//     }

//     assetCompanyAssociation = {
//       typeId: confirmed.results[0].typeId,
//       category: confirmed.results[0].category,
//       fromObjectType: ASSET_OBJECT_TYPE,
//       toObjectType: "companies",
//     };
//     logger.info(
//       `✅ Created Asset->Company association (typeId ${assetCompanyAssociation.typeId})`,
//     );
//     return assetCompanyAssociation;
//   } catch (error) {
//     logger.error(
//       `Association Create Error: ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );
//     return null;
//   }
// }

// // Find HubSpot Company for this asset. Tries name match first (reliable,
// // known-working), then falls back to the jitbit_company_id custom property
// // in case multiple companies share a name.
// async function findCompanyByJitbitId(jitbitCompanyId, fallbackName) {
//   const cacheKey = String(jitbitCompanyId);

//   if (companyCache.has(cacheKey)) {
//     return companyCache.get(cacheKey);
//   }

//   let company = null;

//   // 1. Try matching by company name
//   if (fallbackName) {
//     try {
//       const byName = await hubspotClient.crm.companies.searchApi.doSearch({
//         filterGroups: [
//           {
//             filters: [
//               {
//                 propertyName: "name",
//                 operator: "EQ",
//                 value: fallbackName,
//               },
//             ],
//           },
//         ],
//         properties: ["name"],
//         limit: 1,
//       });
//       company = byName.results?.[0] || null;
//     } catch (error) {
//       logger.error(
//         `Company Name Search Error: ${JSON.stringify(
//           error.body || error.message,
//         )}`,
//       );
//     }
//   }

//   // 2. Fall back to jitbit_company_id custom property if name match failed
//   if (!company) {
//     try {
//       const byId = await hubspotClient.crm.companies.searchApi.doSearch({
//         filterGroups: [
//           {
//             filters: [
//               {
//                 propertyName: "jitbit_company_id",
//                 operator: "EQ",
//                 value: cacheKey,
//               },
//             ],
//           },
//         ],
//         properties: ["name", "jitbit_company_id"],
//         limit: 1,
//       });
//       company = byId.results?.[0] || null;
//     } catch (error) {
//       logger.error(
//         `Company jitbit_company_id Search Error: ${JSON.stringify(
//           error.body || error.message,
//         )}`,
//       );
//     }
//   }

//   companyCache.set(cacheKey, company);
//   return company;
// }

// // Create Asset Custom Object
// async function createAsset(asset) {
//   try {
//     const properties = {
//       asset_name: asset.ModelName || "Unknown",
//       asset_type: asset.Type || "",
//       manufacturer: asset.Manufacturer || "",
//       supplier: asset.Supplier || "",
//       serial_number: asset.SerialNumber || "",
//       location: asset.Location || "",
//       comments: asset.Comments || "",
//       quantity: String(asset.Quantity || 0),
//       ticket_count: String(asset.TicketCount || 0),
//       jitbit_asset_id: String(asset.ItemID),
//       jitbit_company_id: String(asset.CompanyID),
//       disabled: String(asset.Disabled),
//     };

//     // Map Jitbit's custom Fields (Deployment date, Decommission Date, ...) using fieldId
//     // for (const { fieldId, hubspotProperty, label } of DATE_FIELD_MAPPINGS) {
//     //   const rawValue = getJitbitFieldValue(asset, fieldId);
      
//     //   // DEBUG: Log the raw value coming from Jitbit to see if it's populated and parseable
//     //   logger.info(`Asset ${asset.ItemID} | ${label} Raw Value: ${rawValue}`);

//     //   const hsDate = toHubspotDateMs(rawValue);
      
//     //   // DEBUG: Log a warning if it has a value but failed our date parser
//     //   if (rawValue && hsDate === undefined) {
//     //      logger.warn(`⚠️ Failed to parse date for Asset ${asset.ItemID}: ${rawValue}`);
//     //   }

//     //   if (hsDate !== undefined) {
//     //     properties[hubspotProperty] = hsDate;
//     //   }
//     // }

//     const response = await hubspotClient.crm.objects.basicApi.create(
//       ASSET_OBJECT_TYPE,
//       { properties },
//     );

//     logger.info(`✅ Asset Created: ${response.id} (${asset.ModelName})`);

//     return response;
//   } catch (error) {
//     logger.error(
//       `Asset Create Error [${asset.ItemID}]: ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );

//     return null;
//   }
// }

// // Asset -> Company Association
// async function associateAssetCompany(assetId, companyId, association) {
//   const attempt = async (reversed) => {
//     const [fromType, fromId, toType, toId] = reversed
//       ? [association.toObjectType, companyId, association.fromObjectType, assetId]
//       : [association.fromObjectType, assetId, association.toObjectType, companyId];

//     await hubspotClient.crm.associations.v4.basicApi.create(
//       fromType,
//       fromId,
//       toType,
//       toId,
//       [
//         {
//           associationCategory: association.category,
//           associationTypeId: association.typeId,
//         },
//       ],
//     );
//   };

//   try {
//     await attempt(association.reversed === true);
//     logger.info("✅ Asset Associated With Company");
//   } catch (error) {
//     const errorText = JSON.stringify(error.body || error.message);
//     const looksLikeWrongDirection = errorText.includes("INVALID_OBJECT_IDS");

//     if (looksLikeWrongDirection) {
//       // Self-correct: the typeId apparently pairs with the opposite direction.
//       try {
//         await attempt(association.reversed !== true);
//         association.reversed = !association.reversed; // remember for next assets
//         logger.info("✅ Asset Associated With Company (auto-corrected direction)");
//         return;
//       } catch (retryError) {
//         logger.error(
//           `Association Error (after direction retry): ${JSON.stringify(
//             retryError.body || retryError.message,
//           )}`,
//         );
//         return;
//       }
//     }

//     logger.error(
//       `Association Error: ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );
//   }
// }

// // Main Sync
// async function syncAssets() {
//   logger.info("🚀 Starting Asset Sync...");

//   const allAssets = await getAssets();
//   logger.info(`Successfully fetched ${allAssets.length} assets`);

//   const assets = allAssets.filter(
//     (asset) => asset.CompanyID === TARGET_COMPANY_ID,
//   );
//   logger.info(
//     `Filtered to ${assets.length} assets for CompanyID ${TARGET_COMPANY_ID} (CBSI)`,
//   );

//   let created = 0;
//   let skipped = 0;
//   let failed = 0;

//   const association = await resolveAssetCompanyAssociation();

//   if (!association) {
//     logger.error("❌ Could not resolve Asset<->Company association. Aborting.");
//     return;
//   }

//   await ensureAssetDateProperties();

//   for (const asset of assets) {
//     logger.info(`Processing Asset: ${asset.ItemID} (${asset.ModelName})`);

//     const company = await findCompanyByJitbitId(asset.CompanyID, asset.Company);

//     if (!company) {
//       logger.error(
//         `❌ Company not found for asset ${asset.ItemID} (Jitbit CompanyID: ${asset.CompanyID}, Name: ${asset.Company})`,
//       );
//       skipped++;
//       continue;
//     }

//     const createdAsset = await createAsset(asset);

//     if (!createdAsset) {
//       failed++;
//       continue;
//     }

//     await associateAssetCompany(createdAsset.id, company.id, association);
//     created++;

//     // Basic rate-limit courtesy between assets
//     await sleep(100);
//   }

//   logger.info(
//     `🚀 Asset Sync Completed. Created: ${created}, Skipped (no company): ${skipped}, Failed: ${failed}, Total: ${assets.length}`,
//   );
// }

// syncAssets();


// ......................................................................................................


// import "dotenv/config";
// import * as hubspot from "@hubspot/api-client";
// import logger from "../utils/logger.js";
// import { getAssets } from "./jitbit.services.js";

// const hubspotClient = new hubspot.Client({
//   accessToken: process.env.HUBSPOT_TOKEN,
// });

// const ASSET_OBJECT_TYPE = "2-65872643";

// // Updated to use the FieldIDs from the CustomFields API response
// const DATE_FIELD_MAPPINGS = [
//   { fieldId: 57319, hubspotProperty: "deployment_date", label: "Deployment Date" },
//   { fieldId: 57321, hubspotProperty: "decommission_date", label: "Decommission Date" },
// ];

// // Small delay helper to stay under HubSpot's rate limit (100 req / 10s)
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // Pull a Jitbit custom field's Value out of an asset's Fields array by ID safely
// function getJitbitFieldValue(asset, fieldId) {
//   // Convert both to strings in case the API returns the FieldID as a string
//   const field = asset.Fields?.find((f) => String(f.FieldID) === String(fieldId));
//   return field ? field.Value : null;
// }

// // HubSpot "date" (not datetime) properties require midnight UTC as an epoch
// // millisecond timestamp. Returns undefined for null/invalid input so the
// // property can be omitted from the payload rather than sent as garbage.
// function toHubspotDateMs(value) {
//   if (!value) return undefined;

//   const parsed = new Date(value);
//   if (Number.isNaN(parsed.getTime())) return undefined;

//   const utcMidnight = Date.UTC(
//     parsed.getUTCFullYear(),
//     parsed.getUTCMonth(),
//     parsed.getUTCDate(),
//   );

//   return String(utcMidnight);
// }

// // Ensures a HubSpot date property exists on the Asset object, creating it
// // if missing. Cheap to call repeatedly since it's cached after first check.
// const ensuredProperties = new Set();

// async function ensureDateProperty(hubspotProperty, label) {
//   if (ensuredProperties.has(hubspotProperty)) return;

//   try {
//     await hubspotClient.crm.properties.coreApi.getByName(
//       ASSET_OBJECT_TYPE,
//       hubspotProperty,
//     );
//     ensuredProperties.add(hubspotProperty);
//   } catch (error) {
//     // 404 means it doesn't exist yet — create it
//     if (error.code === 404) {
//       try {
//         await hubspotClient.crm.properties.coreApi.create(ASSET_OBJECT_TYPE, {
//           name: hubspotProperty,
//           label,
//           type: "date",
//           fieldType: "date",
//           groupName: "asset_information",
//         });
//         logger.info(`✅ Created Asset property: ${hubspotProperty}`);
//         ensuredProperties.add(hubspotProperty);
//       } catch (createError) {
//         logger.error(
//           `Property Create Error [${hubspotProperty}]: ${JSON.stringify(
//             createError.body || createError.message,
//           )}`,
//         );
//       }
//     } else {
//       logger.error(
//         `Property Lookup Error [${hubspotProperty}]: ${JSON.stringify(
//           error.body || error.message,
//         )}`,
//       );
//     }
//   }
// }

// async function ensureAssetDateProperties() {
//   for (const { hubspotProperty, label } of DATE_FIELD_MAPPINGS) {
//     await ensureDateProperty(hubspotProperty, label);
//   }
// }

// // In-memory cache so we don't repeat the same company lookups across 261 assets
// const companyCache = new Map(); // jitbit CompanyID -> hubspot company id

// // Resolved once per run: { typeId, fromObjectType, toObjectType }
// let assetCompanyAssociation = null;

// async function resolveAssetCompanyAssociation() {
//   if (assetCompanyAssociation) {
//     return assetCompanyAssociation;
//   }

//   const definitionsApi =
//     hubspotClient.crm.associations.v4.schema.definitionsApi;

//   try {
//     // Check forward direction: Asset -> Company
//     const forward = await definitionsApi.getAll(ASSET_OBJECT_TYPE, "companies");
//     if (forward.results?.length > 0) {
//       assetCompanyAssociation = {
//         typeId: forward.results[0].typeId,
//         category: forward.results[0].category,
//         fromObjectType: ASSET_OBJECT_TYPE,
//         toObjectType: "companies",
//       };
//       logger.info(
//         `ℹ️ Found existing Asset->Company association (typeId ${assetCompanyAssociation.typeId})`,
//       );
//       return assetCompanyAssociation;
//     }
//   } catch (error) {
//     logger.error(
//       `Association Lookup Error (forward): ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );
//   }

//   try {
//     // Check reverse direction: Company -> Asset
//     const reverse = await definitionsApi.getAll("companies", ASSET_OBJECT_TYPE);
//     if (reverse.results?.length > 0) {
//       assetCompanyAssociation = {
//         typeId: reverse.results[0].typeId,
//         category: reverse.results[0].category,
//         fromObjectType: "companies",
//         toObjectType: ASSET_OBJECT_TYPE,
//         reversed: true,
//       };
//       logger.info(
//         `ℹ️ Found existing Company->Asset association (typeId ${assetCompanyAssociation.typeId})`,
//       );
//       return assetCompanyAssociation;
//     }
//   } catch (error) {
//     logger.error(
//       `Association Lookup Error (reverse): ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );
//   }

//   // Nothing exists yet in either direction — create one.
//   // Uses a unique name to avoid the earlier "asset_to_company" name clash.
//   try {
//     await definitionsApi.create(ASSET_OBJECT_TYPE, "companies", {
//       name: "jitbit_asset_to_company",
//       label: "Asset to Company",
//     });

//     // Re-fetch directionally rather than trusting create()'s response order —
//     // create() returns both the forward AND inverse label in one response,
//     // and results[0] is not guaranteed to be the forward (Asset->Company) one.
//     const confirmed = await definitionsApi.getAll(ASSET_OBJECT_TYPE, "companies");

//     if (!confirmed.results?.length) {
//       throw new Error("Association created but not found on re-fetch");
//     }

//     assetCompanyAssociation = {
//       typeId: confirmed.results[0].typeId,
//       category: confirmed.results[0].category,
//       fromObjectType: ASSET_OBJECT_TYPE,
//       toObjectType: "companies",
//     };
//     logger.info(
//       `✅ Created Asset->Company association (typeId ${assetCompanyAssociation.typeId})`,
//     );
//     return assetCompanyAssociation;
//   } catch (error) {
//     logger.error(
//       `Association Create Error: ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );
//     return null;
//   }
// }

// // Find HubSpot Company for this asset. Tries name match first (reliable,
// // known-working), then falls back to the jitbit_company_id custom property
// // in case multiple companies share a name.
// async function findCompanyByJitbitId(jitbitCompanyId, fallbackName) {
//   const cacheKey = String(jitbitCompanyId);

//   if (companyCache.has(cacheKey)) {
//     return companyCache.get(cacheKey);
//   }

//   let company = null;

//   // 1. Try matching by company name
//   if (fallbackName) {
//     try {
//       const byName = await hubspotClient.crm.companies.searchApi.doSearch({
//         filterGroups: [
//           {
//             filters: [
//               {
//                 propertyName: "name",
//                 operator: "EQ",
//                 value: fallbackName,
//               },
//             ],
//           },
//         ],
//         properties: ["name"],
//         limit: 1,
//       });
//       company = byName.results?.[0] || null;
//     } catch (error) {
//       logger.error(
//         `Company Name Search Error: ${JSON.stringify(
//           error.body || error.message,
//         )}`,
//       );
//     }
//   }

//   // 2. Fall back to jitbit_company_id custom property if name match failed
//   if (!company) {
//     try {
//       const byId = await hubspotClient.crm.companies.searchApi.doSearch({
//         filterGroups: [
//           {
//             filters: [
//               {
//                 propertyName: "jitbit_company_id",
//                 operator: "EQ",
//                 value: cacheKey,
//               },
//             ],
//           },
//         ],
//         properties: ["name", "jitbit_company_id"],
//         limit: 1,
//       });
//       company = byId.results?.[0] || null;
//     } catch (error) {
//       logger.error(
//         `Company jitbit_company_id Search Error: ${JSON.stringify(
//           error.body || error.message,
//         )}`,
//       );
//     }
//   }

//   companyCache.set(cacheKey, company);
//   return company;
// }

// // Create Asset Custom Object
// async function createAsset(asset) {
//   try {
//     const properties = {
//       asset_name: asset.ModelName || "Unknown",
//       asset_type: asset.Type || "",
//       manufacturer: asset.Manufacturer || "",
//       supplier: asset.Supplier || "",
//       serial_number: asset.SerialNumber || "",
//       location: asset.Location || "",
//       comments: asset.Comments || "",
//       quantity: String(asset.Quantity || 0),
//       ticket_count: String(asset.TicketCount || 0),
//       jitbit_asset_id: String(asset.ItemID),
//       jitbit_company_id: String(asset.CompanyID),
//       disabled: String(asset.Disabled),
//     };

//     // Map Jitbit's custom Fields (Deployment date, Decommission Date, ...) using fieldId
//     for (const { fieldId, hubspotProperty, label } of DATE_FIELD_MAPPINGS) {
//       const rawValue = getJitbitFieldValue(asset, fieldId);
      
//       // DEBUG: Log the raw value coming from Jitbit to see if it's populated and parseable
//       logger.info(`Asset ${asset.ItemID} | ${label} Raw Value: ${rawValue}`);

//       const hsDate = toHubspotDateMs(rawValue);
      
//       // DEBUG: Log a warning if it has a value but failed our date parser
//       if (rawValue && hsDate === undefined) {
//          logger.warn(`⚠️ Failed to parse date for Asset ${asset.ItemID}: ${rawValue}`);
//       }

//       if (hsDate !== undefined) {
//         properties[hubspotProperty] = hsDate;
//       }
//     }

//     const response = await hubspotClient.crm.objects.basicApi.create(
//       ASSET_OBJECT_TYPE,
//       { properties },
//     );

//     logger.info(`✅ Asset Created: ${response.id} (${asset.ModelName})`);

//     return response;
//   } catch (error) {
//     logger.error(
//       `Asset Create Error [${asset.ItemID}]: ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );

//     return null;
//   }
// }

// // Asset -> Company Association
// async function associateAssetCompany(assetId, companyId, association) {
//   const attempt = async (reversed) => {
//     const [fromType, fromId, toType, toId] = reversed
//       ? [association.toObjectType, companyId, association.fromObjectType, assetId]
//       : [association.fromObjectType, assetId, association.toObjectType, companyId];

//     await hubspotClient.crm.associations.v4.basicApi.create(
//       fromType,
//       fromId,
//       toType,
//       toId,
//       [
//         {
//           associationCategory: association.category,
//           associationTypeId: association.typeId,
//         },
//       ],
//     );
//   };

//   try {
//     await attempt(association.reversed === true);
//     logger.info("✅ Asset Associated With Company");
//   } catch (error) {
//     const errorText = JSON.stringify(error.body || error.message);
//     const looksLikeWrongDirection = errorText.includes("INVALID_OBJECT_IDS");

//     if (looksLikeWrongDirection) {
//       // Self-correct: the typeId apparently pairs with the opposite direction.
//       try {
//         await attempt(association.reversed !== true);
//         association.reversed = !association.reversed; // remember for next assets
//         logger.info("✅ Asset Associated With Company (auto-corrected direction)");
//         return;
//       } catch (retryError) {
//         logger.error(
//           `Association Error (after direction retry): ${JSON.stringify(
//             retryError.body || retryError.message,
//           )}`,
//         );
//         return;
//       }
//     }

//     logger.error(
//       `Association Error: ${JSON.stringify(
//         error.body || error.message,
//       )}`,
//     );
//   }
// }

// // Main Sync (Testing Single Asset)
// async function syncAssets() {
//   logger.info("🚀 Starting Single Asset Sync for testing...");

//   const allAssets = await getAssets();
//   logger.info(`Successfully fetched ${allAssets.length} assets from Jitbit`);

//   // 👇 Filter exclusively for your target asset ID
//   const assets = allAssets.filter(
//     (asset) => asset.ItemID === 2540955
//   );
  
//   if (assets.length === 0) {
//       logger.error("❌ Asset 2540955 was not found in Jitbit.");
//       return;
//   }

//   logger.info(`Found Asset 2540955. Proceeding with sync...`);

//   let created = 0;
//   let skipped = 0;
//   let failed = 0;

//   const association = await resolveAssetCompanyAssociation();

//   if (!association) {
//     logger.error("❌ Could not resolve Asset<->Company association. Aborting.");
//     return;
//   }

//   await ensureAssetDateProperties();

//   for (const asset of assets) {
//     logger.info(`Processing Asset: ${asset.ItemID} (${asset.ModelName})`);

//     const company = await findCompanyByJitbitId(asset.CompanyID, asset.Company);

//     if (!company) {
//       logger.error(
//         `❌ Company not found for asset ${asset.ItemID} (Jitbit CompanyID: ${asset.CompanyID}, Name: ${asset.Company})`,
//       );
//       skipped++;
//       continue;
//     }

//     const createdAsset = await createAsset(asset);

//     if (!createdAsset) {
//       failed++;
//       continue;
//     }

//     await associateAssetCompany(createdAsset.id, company.id, association);
//     created++;

//     // Basic rate-limit courtesy between assets
//     await sleep(100);
//   }

//   logger.info(
//     `🚀 Single Asset Sync Completed. Created: ${created}, Skipped: ${skipped}, Failed: ${failed}`,
//   );
// }

// syncAssets();



// .........................................New code .............................................................


import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import logger from "../utils/logger.js";
import { 
  getAssets, 
  getCompanyDetails, 
  getCompanyCustomFields 
} from "./jitbit.services.js";

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_TOKEN,
});

// ==========================================
// Asset Constants & Variables
// ==========================================
const ASSET_OBJECT_TYPE = "2-65872643";

const DATE_FIELD_MAPPINGS = [
  { fieldId: 57319, hubspotProperty: "deployment_date", label: "Deployment Date" },
  { fieldId: 57321, hubspotProperty: "decommission_date", label: "Decommission Date" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ensuredProperties = new Set();
const companyCache = new Map(); // jitbit CompanyID -> hubspot company id
let assetCompanyAssociation = null;

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
// Company Creation Logic
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
      name: companyName || companyDetails?.Name || "Unknown Company",
      domain: companyDetails?.EmailDomain || "",
      company_id: companyId.toString(),
      ...mappedProperties,
    };

    // 2. Create Company in HubSpot
    const response = await hubspotClient.crm.companies.basicApi.create({
      properties: payload,
    });

    logger.info(`✅ Missing Company Created Successfully in HubSpot: ${payload.name} | ID: ${response.id}`);
    return { id: response.id };
  } catch (error) {
    logger.error(`❌ Failed to create missing Company [${companyId}]: ${JSON.stringify(error.response?.body || error.message)}`);
    return null;
  }
}

// ==========================================
// Asset Helpers
// ==========================================

function getJitbitFieldValue(asset, fieldId) {
  const field = asset.Fields?.find((f) => String(f.FieldID) === String(fieldId));
  return field ? field.Value : null;
}

function toHubspotDateMs(value) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return String(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

async function ensureDateProperty(hubspotProperty, label) {
  if (ensuredProperties.has(hubspotProperty)) return;
  try {
    await hubspotClient.crm.properties.coreApi.getByName(ASSET_OBJECT_TYPE, hubspotProperty);
    ensuredProperties.add(hubspotProperty);
  } catch (error) {
    if (error.code === 404) {
      try {
        await hubspotClient.crm.properties.coreApi.create(ASSET_OBJECT_TYPE, {
          name: hubspotProperty,
          label,
          type: "date",
          fieldType: "date",
          groupName: "asset_information",
        });
        logger.info(`✅ Created Asset property: ${hubspotProperty}`);
        ensuredProperties.add(hubspotProperty);
      } catch (createError) {}
    }
  }
}

async function ensureAssetDateProperties() {
  for (const { hubspotProperty, label } of DATE_FIELD_MAPPINGS) {
    await ensureDateProperty(hubspotProperty, label);
  }
}

async function resolveAssetCompanyAssociation() {
  if (assetCompanyAssociation) return assetCompanyAssociation;
  const definitionsApi = hubspotClient.crm.associations.v4.schema.definitionsApi;

  try {
    const forward = await definitionsApi.getAll(ASSET_OBJECT_TYPE, "companies");
    if (forward.results?.length > 0) {
      return (assetCompanyAssociation = {
        typeId: forward.results[0].typeId,
        category: forward.results[0].category,
        fromObjectType: ASSET_OBJECT_TYPE,
        toObjectType: "companies",
      });
    }
  } catch (error) {}

  try {
    const reverse = await definitionsApi.getAll("companies", ASSET_OBJECT_TYPE);
    if (reverse.results?.length > 0) {
      return (assetCompanyAssociation = {
        typeId: reverse.results[0].typeId,
        category: reverse.results[0].category,
        fromObjectType: "companies",
        toObjectType: ASSET_OBJECT_TYPE,
        reversed: true,
      });
    }
  } catch (error) {}

  try {
    await definitionsApi.create(ASSET_OBJECT_TYPE, "companies", {
      name: "jitbit_asset_to_company",
      label: "Asset to Company",
    });
    const confirmed = await definitionsApi.getAll(ASSET_OBJECT_TYPE, "companies");
    assetCompanyAssociation = {
      typeId: confirmed.results[0].typeId,
      category: confirmed.results[0].category,
      fromObjectType: ASSET_OBJECT_TYPE,
      toObjectType: "companies",
    };
    logger.info(`✅ Created Asset->Company association (typeId ${assetCompanyAssociation.typeId})`);
    return assetCompanyAssociation;
  } catch (error) {
    return null;
  }
}

async function findCompanyByJitbitId(companyId, fallbackName) {
  const cacheKey = String(companyId);
  if (companyCache.has(cacheKey)) return companyCache.get(cacheKey);

  let company = null;

  // 1. Search by custom property 'company_id'
  try {
    const byId = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [{ filters: [{ propertyName: "company_id", operator: "EQ", value: cacheKey }] }],
      properties: ["name", "company_id"],
      limit: 1,
    });
    company = byId.results?.[0] || null;
  } catch (error) {
    // Ignore error silently if property doesn't exist in Hubspot yet
  }

  // 2. Search by Name fallback
  if (!company && fallbackName) {
    try {
      const byName = await hubspotClient.crm.companies.searchApi.doSearch({
        filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: fallbackName }] }],
        properties: ["name"],
        limit: 1,
      });
      company = byName.results?.[0] || null;
    } catch (error) {}
  }

  if (company) companyCache.set(cacheKey, company);
  return company;
}

async function createAsset(asset) {
  try {
    const properties = {
      asset_name: asset.ModelName || "Unknown",
      asset_type: asset.Type || "",
      manufacturer: asset.Manufacturer || "",
      supplier: asset.Supplier || "",
      serial_number: asset.SerialNumber || "",
      location: asset.Location || "",
      comments: asset.Comments || "",
      quantity: String(asset.Quantity || 0),
      ticket_count: String(asset.TicketCount || 0),
      jitbit_asset_id: String(asset.ItemID),
      jitbit_company_id: String(asset.CompanyID),
      disabled: String(asset.Disabled),
    };

    for (const { fieldId, hubspotProperty } of DATE_FIELD_MAPPINGS) {
      const rawValue = getJitbitFieldValue(asset, fieldId);
      const hsDate = toHubspotDateMs(rawValue);
      if (hsDate !== undefined) properties[hubspotProperty] = hsDate;
    }

    const response = await hubspotClient.crm.objects.basicApi.create(
      ASSET_OBJECT_TYPE,
      { properties },
    );

    logger.info(`✅ Asset Created: ${response.id} (${asset.ModelName})`);
    return response;
  } catch (error) {
    logger.error(`Asset Create Error [${asset.ItemID}]: ${JSON.stringify(error.body || error.message)}`);
    return null;
  }
}

async function associateAssetCompany(assetId, companyId, association) {
  const attempt = async (reversed) => {
    const [fromType, fromId, toType, toId] = reversed
      ? [association.toObjectType, companyId, association.fromObjectType, assetId]
      : [association.fromObjectType, assetId, association.toObjectType, companyId];

    await hubspotClient.crm.associations.v4.basicApi.create(
      fromType, fromId, toType, toId,
      [{ associationCategory: association.category, associationTypeId: association.typeId }]
    );
  };

  try {
    await attempt(association.reversed === true);
    logger.info("✅ Asset Associated With Company");
  } catch (error) {
    const errorText = JSON.stringify(error.body || error.message);
    if (errorText.includes("INVALID_OBJECT_IDS")) {
      try {
        await attempt(association.reversed !== true);
        association.reversed = !association.reversed; 
        logger.info("✅ Asset Associated With Company (auto-corrected direction)");
        return;
      } catch (retryError) {}
    }
    logger.error(`Association Error: ${errorText}`);
  }
}

// ==========================================
// Main Sync Pipeline
// ==========================================

async function syncAssets() {
  logger.info("🚀 Starting Full Asset Sync...");

  const allAssets = await getAssets();
  logger.info(`Successfully fetched ${allAssets.length} assets from Jitbit`);

  if (!allAssets || allAssets.length === 0) return;

  let created = 0, skipped = 0, failed = 0;

  const association = await resolveAssetCompanyAssociation();
  if (!association) return;

  await ensureAssetDateProperties();

  for (const asset of allAssets) {
    logger.info(`Processing Asset: ${asset.ItemID} (${asset.ModelName})`);

    // 1. Search for Company in HubSpot
    let company = await findCompanyByJitbitId(asset.CompanyID, asset.Company);

    // 2. If company doesn't exist in HubSpot, fetch from Jitbit and Create
    if (!company) {
      logger.warn(`⚠️ Company not found in HubSpot. Initiating Jitbit fetch & creation for: ${asset.Company}...`);
      company = await createMissingCompany(asset.CompanyID, asset.Company);
      
      if (company) companyCache.set(String(asset.CompanyID), company);
    }

    if (!company) {
      logger.error(`❌ Could not find or create company for asset ${asset.ItemID}. Skipping Asset.`);
      skipped++;
      continue;
    }

    // 3. Create the Asset in HubSpot
    const createdAsset = await createAsset(asset);

    if (!createdAsset) {
      failed++;
      continue;
    }

    // 4. Associate the Asset with the Company
    await associateAssetCompany(createdAsset.id, company.id, association);
    created++;

    await sleep(100);
  }

  logger.info(`🚀 Full Asset Sync Completed. Created: ${created}, Skipped: ${skipped}, Failed: ${failed}`);
}

syncAssets();