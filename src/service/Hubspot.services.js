import axios from "axios";
import logger from "../utils/logger.js";

 async function searchCompanyByJitbitCompanyId(companyId) {
  const response = await axios.post(
    "https://api.hubapi.com/crm/v3/objects/companies/search",
    {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "jitbit_company_id", // HubSpot custom property
              operator: "EQ",
              value: String(companyId),
            },
          ],
        },
      ],
      limit: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.results[0] || null;

}

export { searchCompanyByJitbitCompanyId };