import axios from "axios";
import logger from "../utils/logger.js";
import "dotenv/config";

const getCompanies = async () => {
  try {
    logger.info("Fetching companies from Jitbit...");

    const response = await axios.get(
      "https://healthipass.jitbit.com/helpdesk/api/Companies",
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
          Accept: "application/json",
        },
      },
    );

    logger.info(
      `Successfully fetched ${response.data?.length || 0} companies.`,
    );
    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch companies: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );
    throw error;
  }
};







const getUsers = async () => {
  try {
    logger.info("Fetching users from Jitbit...");

    const response = await axios.get(
      "https://healthipass.jitbit.com/helpdesk/api/Users",
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
          Accept: "application/json",
        },
      },
    );

    logger.info(`Successfully fetched ${response.data?.length || 0} users.`);
    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch users: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );
    throw error;
  }
};

// const getTickets = async () => {
//   try {
//     logger.info("Fetching tickets from Jitbit...");

//     const response = await axios.get(
//       "https://healthipass.jitbit.com/helpdesk/api/Tickets",
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
//           Accept: "application/json",
//         },
//       },
//     );

//     logger.info(`Successfully fetched ${response.data?.length || 0} tickets.`);
//     return response.data;
//   } catch (error) {
//     logger.error(
//       `Failed to fetch tickets: ${
//         error.response?.data
//           ? JSON.stringify(error.response.data)
//           : error.message
//       }`,
//     );
//     throw error;
//   }
// };







const getTickets = async () => {
  const limit = 300;
  let offset = 0;
  let allTickets = [];

  while (true) {
    console.log(`Fetching tickets ${offset} - ${offset + limit}`);

    const response = await axios.get(
      "https://healthipass.jitbit.com/helpdesk/api/Tickets",
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
          Accept: "application/json",
        },
        params: {
          count: limit,
          offset: offset,
        },
      }
    );

    const tickets = response.data || [];

    if (tickets.length === 0) {
      break;
    }

    allTickets.push(...tickets);

    if (tickets.length < limit) {
      break;
    }
    // return allTickets; //todo remove this line after testing

    offset += limit;
  }

  logger.info(`Total Tickets Fetched: ${allTickets.length}`);

  return allTickets;
};


async function searchCompanyById(companyId) {
  try {
    const response = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "company_id",
              operator: "EQ",
              value: companyId.toString(),
            },
          ],
        },
      ],

      properties: ["name", "company_id"],
    });

    return response.results[0] || null;
  } catch (error) {
    logger.error(error.message);
    return null;
  }
}

// ==========================================
// Fetch Jitbit Company Custom Fields
// ==========================================

async function getCompanyCustomFields(companyId) {
  try {
    const response = await axios.get(
      `${process.env.JITBIT_URL}/api/CompanyCustomFields?id=${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
        },
      },
    );

    logger.info(`Fetched Custom Fields for Company ID: ${companyId}`);

    return response.data || [];
  } catch (error) {
    logger.error(`Failed to fetch company custom fields: ${companyId}`);

    logger.error(error.response?.data || error.message);

    return [];
  }
}
// ==========================================
// Fetch Jitbit Company Details
// ==========================================

async function getCompanyDetails(companyId) {
  try {
    const response = await axios.get(
      `${process.env.JITBIT_URL}/api/Companies/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
        },
      },
    );

    logger.info(`Successfully fetched company details: ${companyId}`);

    return response.data || {};
  } catch (error) {
    logger.error(`Failed to fetch company details: ${companyId}`);

    logger.error(error.response?.data || error.message);

    return {};
  }
}




// Headers ko bahar define karein taaki sabhi functions use kar sakein
const headers = { 
  "Authorization": `Bearer ${process.env.JITBIT_API_KEY}`,
  "Content-Type": "application/json"
};


async function getTicketDetails(ticketId) {
  try {
    const response = await axios.get(`${process.env.JITBIT_URL}/api/Tickets/${ticketId}`, {
      headers
    });
    return response.data;
  } catch (error) {
    logger.error(`❌ Error fetching ticket details:`, error.message);
    return {};
  }
}



// async function getTicketCustomFields(IssueID) {
//   try {
//     const response = await axios.get(`https://healthipass.jitbit.com/api/TicketCustomFields`, {
//       params: { id: IssueID },
//       headers: {
//         'Authorization': `Bearer ${process.env.JITBIT_API_KEY}`,
//         'Accept-Encoding': 'gzip'

//       }
//     });

//     return response.data; 
//   } catch (error) {
//     logger.error(`❌ Error fetching custom fields for ${IssueID}:`, error.message);
//     return [];
//   }
// }

 async function getTicketCustomFields(issueId) {
  try {
    const { data } = await axios.get(
      "https://healthipass.jitbit.com/api/TicketCustomFields",
      {
        params: {
          id: issueId, // IssueID = Ticket ID
        },
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
          "Accept-Encoding": "gzip",
        },
      }
    );

    logger.info(`✅ Custom fields fetched for ticket ${issueId}`);
    return data;
  } catch (error) {
    logger.error(
      `❌ Error fetching custom fields for ticket ${issueId}: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`
    );
    return [];
  }
}


const getAssets = async () => {
  try {
    logger.info("Fetching assets from Jitbit...");

    const response = await axios.get(
      "https://healthipass.jitbit.com/helpdesk/api/Assets",
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
          Accept: "application/json",
        },
      },
    );

    logger.info(`Successfully fetched ${response.data?.length || 0} assets.`);
    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch assets: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`,
    );
    throw error;
  }
};

// ==========================================
// Fetch Jitbit Company By ID
// ==========================================




const getCompanyById = async (companyId) => {
  try {
    logger.info(`Fetching Jitbit company: ${companyId}`);

    const response = await axios.get(
      `${process.env.JITBIT_URL}/helpdesk/api/Companies/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.JITBIT_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    logger.info(
      `Successfully fetched Jitbit company: ${companyId}`
    );

    return response.data || null;

  } catch (error) {

    logger.error(
      `Failed to fetch Jitbit company ${companyId}: ${
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      }`
    );

    return null;
  }
};

export {
  getCompanies,
  getUsers,
  getTickets,
  searchCompanyById,
  getCompanyCustomFields,
  getCompanyDetails,
  getTicketDetails,
  getTicketCustomFields,
  getAssets,
  getCompanyById
};
