import "dotenv/config";
import * as hubspot from "@hubspot/api-client";
import logger from "../utils/logger.js";
import { getTickets } from "./jitbit.services.js";

// ==========================================
// HubSpot Client
// ==========================================

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_TOKEN,
});

// ==========================================
// Create Ticket in HubSpot
// ==========================================

async function createTicket(ticket) {
  try {
    const response = await hubspotClient.crm.tickets.basicApi.create({
      properties: {
        subject: ticket.Subject || "",
        content: ticket.Body || "",

        hs_pipeline: "0",
        hs_pipeline_stage: "1",
      },
    });

    logger.info(
      `✅ Ticket Synced Successfully: ${ticket.Subject} | HubSpot ID: ${response.id}`,
    );

    return response.id;
  } catch (e) {
    logger.error(`❌ Ticket Sync Failed: ${ticket.Subject}`);

    if (e.response) {
      logger.error(JSON.stringify(e.response.body, null, 2));
    } else {
      logger.error(e.message);
    }

    return null;
  }
}

// ==========================================
// Sync Only One Ticket (Testing)
// ==========================================

async function syncTicket() {
  try {
    const tickets = await getTickets();

    if (!tickets || tickets.length === 0) {
      logger.info("No tickets found.");
      return;
    }

    // Only one ticket for testing
    const ticket = tickets[0];

    logger.info(`🚀 Syncing Ticket: ${ticket.Subject} (${ticket.TicketID})`);

    await createTicket(ticket);

    logger.info("✅ Test Ticket Sync Completed.");
  } catch (err) {
    logger.error(`❌ Ticket Sync Failed: ${err.message}`);
  }
}

// ==========================================
// Run
// ==========================================

async function runSync() {
  logger.info("🚀 Starting Jitbit → HubSpot Ticket Sync...");

  await syncTicket();

  logger.info("🎉 Ticket Process Finished.");
}

// ==========================================
// Direct Run
// ==========================================

runSync();

export { syncTicket, runSync };
