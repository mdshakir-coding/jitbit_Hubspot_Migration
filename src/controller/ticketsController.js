import logger from "../utils/logger.js";
import { getTickets } from "../service/jitbit.services.js";
import{buildHubspotTicketPayload} from "../utils/All.Payload.js";

async function syncTickets() {
  try {
    const allTickets = await getTickets();

    if (!allTickets || allTickets.length === 0) {
      logger.info("No tickets found.");
      return;
    }

    const ticket = allTickets[1]; // Sirf first ticket
    logger.info(`[Tickets] Ticket Record:: ${JSON.stringify(ticket, null, 2)}`);

    const hubspotTicket = buildHubspotTicketPayload(ticket);

    logger.info(
      `[HubSpot Payload]:: ${JSON.stringify(hubspotTicket, null, 2)}`
    );


  } catch (error) {
    logger.error(`Error during user sync: ${error.message}`);
  }
}

export { syncTickets };