


function buildHubspotContactPayload(user) {
  return {
    properties: {
        email: user.Email,
        firstname: user.FirstName,
        lastname: user.LastName,
        company: user.CompanyName,
        phone: user.Phone || "",
        jitbit_user_id: user.UserID.toString(),
        jitbit_username: user.Username.trim(),
        jitbit_full_name: user.FullName,
        jitbit_company_id: (user.CompanyId || "").toString(),
        jitbit_department_id: (user.DepartmentID || "").toString(),
        jitbit_department_name: user.DepartmentName || "",
        jitbit_is_admin: user.IsAdmin.toString(),
        jitbit_disabled: user.Disabled.toString(),
        jitbit_last_seen: formatHubSpotDate(user.LastSeen),
        jitbit_location: user.Location || "",

      
      
      
    }
  };
}


function buildHubspotCompanyPayload(company) {
    return {
        properties: {
            companyid: company.CompanyID.toString(),
         name: company.Name,
        domain: company.EmailDomain,
        jitbit_company_id: company.CompanyID.toString(),
        jitbit_notes: company.Notes || "",
        jitbit_email_domain: company.EmailDomain || "",
        }
    };
}

function buildHubspotTicketPayload(ticket) {
    return {
        properties: {
           subject: ticket.Subject,
        createdate: formatHubSpotDate(ticket.IssueDate),
        hs_ticket_priority: "LOW",
        content: `Category: ${ticket.Category} | Technician: ${ticket.Technician}`,

        jitbit_issue_id: ticket.IssueID.toString(),
        jitbit_status_id: ticket.StatusID.toString(),
        jitbit_status: ticket.Status || "",
        jitbit_updated_by_user: ticket.UpdatedByUser.toString(),
        jitbit_updated_by_performer: ticket.UpdatedByPerformer.toString(),
        jitbit_category_id: ticket.CategoryID.toString(),
        jitbit_user_name: ticket.UserName || "",
        jitbit_technician: ticket.Technician || "",
        jitbit_first_name: ticket.FirstName || "",
        jitbit_last_name: ticket.LastName || "",
        jitbit_due_date: formatHubSpotDate(ticket.DueDate),
        jitbit_tech_first_name: ticket.TechFirstName || "",
        jitbit_tech_last_name: ticket.TechLastName || "",
        jitbit_last_updated: formatHubSpotDate(ticket.LastUpdated),
        jitbit_updated_for_tech_view:
          ticket.UpdatedForTechView.toString(),
        jitbit_user_id: ticket.UserID.toString(),
        jitbit_company_id: ticket.CompanyID.toString(),
        jitbit_company_name: ticket.CompanyName || "",
        jitbit_assigned_to_user_id: ticket.AssignedToUserID.toString(),
        jitbit_resolved_date: formatHubSpotDate(ticket.ResolvedDate),
        jitbit_section_id: ticket.SectionID.toString(),
        jitbit_category: ticket.Category || "",
        jitbit_origin: ticket.Origin || "",
        jitbit_email: ticket.Email || "",
        jitbit_status_color: ticket.StatusColor || "",
        jitbit_last_updated_by_user_id: (
          ticket.LastUpdatedByUserID || ""
        ).toString(),
        jitbit_last_updated_username: ticket.LastUpdatedUsername || "",
        jitbit_start_date: formatHubSpotDate(ticket.StartDate),
        jitbit_time_spent_in_seconds:
          ticket.TimeSpentInSeconds.toString(),
        jitbit_ai_sentiment: ticket.AISentiment.toString(),
        }
    };
}



function buildHubspotAssetPayload(jitbitAsset) {
  return {
    properties: {
            model_name: jitbitAsset.ModelName,
          serial_number: jitbitAsset.SerialNumber,
          asset_type: jitbitAsset.Type,
          manufacturer: jitbitAsset.Manufacturer,
          supplier: jitbitAsset.Supplier,
          location: jitbitAsset.Location,
          quantity: jitbitAsset.Quantity.toString(),
          asset_notes: jitbitAsset.Comments,
          jitbit_asset_id: jitbitAsset.ItemID.toString(),
          jitbit_deployment_date: formatHubSpotDate(depDate),
          jitbit_decommission_date: formatHubSpotDate(decDate),
        

      
      
      
    }
  };
}


export { buildHubspotContactPayload, 
    buildHubspotCompanyPayload,
     buildHubspotTicketPayload, buildHubspotAssetPayload };