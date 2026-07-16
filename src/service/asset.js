import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import logger from "../utils/logger.js";
import { getAssets } from "./jitbit.services.js";

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_TOKEN,
});

const ASSET_OBJECT_TYPE = "2-65872643";

// Jitbit Company
const COMPANY_NAME = "CBSI";

// TODO: Replace this with the actual integer ID for Asset -> Company association
// You can find this using the crm.associations.v4.schema.definitionsApi.getAll() endpoint
const ASSET_TO_COMPANY_ASSOCIATION_ID = 45; 

// Find HubSpot Company
async function findCompany(companyName) {
  try {
    const response = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "name",
              operator: "EQ",
              value: companyName,
            },
          ],
        },
      ],
      properties: ["name"],
      limit: 1,
    });

    if (response.results.length > 0) {
      return response.results[0];
    }

    return null;
  } catch (error) {
    logger.error(`Company Search Error: ${error.message}`);
    return null;
  }
}

// Create Asset Custom Object
async function createAsset(asset) {
  try {
    const response = await hubspotClient.crm.objects.basicApi.create(
      ASSET_OBJECT_TYPE,
      {
        properties: {
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
        },
      },
    );

    logger.info(`✅ Asset Created: ${response.id}`);

    return response;
  } catch (error) {
    logger.error(
      `Asset Create Error: ${JSON.stringify(
        error.response?.body || error.message,
      )}`,
    );

    return null;
  }
}

// Asset -> Company Association
async function associateAssetCompany(assetId, companyId) {
  try {
    await hubspotClient.crm.associations.v4.basicApi.create(
      ASSET_OBJECT_TYPE,
      assetId,
      "companies",
      companyId,
      [
        {
          // Custom objects typically use USER_DEFINED
          associationCategory: "USER_DEFINED", 
          associationTypeId: ASSET_TO_COMPANY_ASSOCIATION_ID,
        },
      ],
    );

    logger.info("✅ Asset Associated With Company");
  } catch (error) {
    logger.error(
      `Association Error: ${JSON.stringify(
        error.response?.body || error.message,
      )}`,
    );
  }
}

// Main Sync
async function syncAssets() {
  logger.info("🚀 Starting Asset Sync...");

  const assets = await getAssets();

  logger.info(`Successfully fetched ${assets.length} assets`);

  // Testing one asset
  const asset = assets[0];

  logger.info(`Processing Asset: ${asset.ItemID}`);

  const company = await findCompany(COMPANY_NAME);

  if (!company) {
    logger.error("❌ CBSI Company not found in HubSpot");
    return;
  }

  logger.info(`✅ HubSpot Company Found: ${company.id}`);

  const createdAsset = await createAsset(asset);

  if (createdAsset) {
    await associateAssetCompany(
      createdAsset.id,
      company.id,
    );
  }

  logger.info("🚀 Asset Sync Completed.");
}

syncAssets();