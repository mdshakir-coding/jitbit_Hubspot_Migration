


function buildHubspotContactPayload(user) {
  return {
    properties: {
      username: user.Username,
      fullname: user.FullName,
      firstname: user.FirstName,
      lastname: user.LastName,
      email: user.Email?.trim(),
       company_id: user.CompanyId,
      departmentid: user.DepartmentID,
      company: user.CompanyName,
      departmentname: user.DepartmentName,
      location: user.Location,
      phone: user.Phone,


      
      
      
    }
  };
}


function buildHubspotCompanyPayload(company) {
    return {
        properties: {
        companyId: company.CompanyId,
        name: company.Name,
        notes: company.Notes,
        emaildomain: company.EmailDomain,

        }
    };
}

function buildHubspotTicketPayload(ticket) {
    return {
        properties: {
            issueid: ticket.IssueID,
            priority: ticket.Priority,
            statusid: ticket.StatusID,
            issuedate: ticket.IssueDate,
            subject: ticket.Subject,
            status: ticket.Status,
            updatedbyuser: ticket.UpdatedByUser,
            updatedbyperformer: ticket.UpdatedByPerformer,
            categoryid: ticket.CategoryID,
            username: ticket.UserName,
            technician: ticket.Technician,
            firstname: ticket.FirstName,
            lastname: ticket.LastName,
            duedate: ticket.DueDate,
            techfirstname: ticket.TechFirstName,
            techlastname: ticket.TechLastName,
            lastupdated: ticket.LastUpdated,
            updatedfortechview: ticket.UpdatedForTechView,
            userid: ticket.UserID,
            companyid: ticket.CompanyID,
            companyname: ticket.CompanyName,
            assignedtouserid: ticket.AssignedToUserID,
            resolveddate: ticket.ResolvedDate,
            sectionid: ticket.SectionID,
            category: ticket.Category,
            origin: ticket.Origin,
            email: ticket.Email,
            statuscolor: ticket.StatusColor,
            lastupdatedbyuserid: ticket.LastUpdatedByUserID,
            lastupdatedusername: ticket.LastUpdatedUsername,
            startdate: ticket.StartDate,
            timespentinseconds: ticket.TimeSpentInSeconds,
            aisentiment: ticket.AISentiment
        }
    };
}

export { buildHubspotContactPayload, buildHubspotCompanyPayload, buildHubspotTicketPayload };