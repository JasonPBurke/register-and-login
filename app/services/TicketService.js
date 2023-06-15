import { axiosPrivate } from "./APIService";

class TicketService {
  // Get list of tickets
  // @param name - Name of the ticket to use as a filter
  // @param stage - Stage of the ticket to use as a filter
  // @param sortField - Field to sort results by
  // @param sortOrder - Order of sorting (only if sortField supplied)
  // @limit - Maximum number of results per page
  // @page - Page of results to return
  getTickets(
    name = null,
    stage = null,
    sortField = null,
    sortOrder = "asc",
    limit = null,
    page = null
  ) {
    return axiosPrivate.get("tickets", {
      params: {
        name: name ? name : undefined,
        stage: stage ? stage : undefined,
        sortBy: sortField ? sortField + ":" + sortOrder : undefined,
        limit: limit ? limit : undefined,
        page: page ? page : undefined,
      },
    });
  }

  // Create a new Ticket with the given name and description
  // @param name - Name of the ticket
  // @param description - Description of the ticket
  // @param owner - Owner of the ticket (only settable by Admins)
  createTicket(name, description, owner = null) {
    return axiosPrivate
      .post("tickets", {
        name: name,
        description: description,
        owner: owner ? owner : undefined,
      });
  }

  // Get a specific ticket
  // @param id - ID of ticket to retrieve
  getTicket(id) {
    return axiosPrivate.get(`tickets/${id}`);
  }

  // Update the given data on the specified ticket
  // @param id - ID of ticket to update
  // @param name - Name to set on the ticket
  // @param description - Description to set on the ticket
  // @param stage - Stage to set on the ticket
  updateTicket(id, name=null, description=null, stage=null) {
    return axiosPrivate.patch(`tickets/${id}`, {
      name: name ? name : undefined,
      description: description ? description : undefined,
      stage: stage ? stage : undefined,
    });
  }

  // Delete the specified ticket
  // @param id - ID of ticket to delete
  deleteTicket(id) {
    return axiosPrivate.delete(`tickets/${id}`);
  }
}

const ticketService = new TicketService();
export default ticketService;
