import { axiosPrivate } from "./APIService";

class TaskService {
  // Get list of tasks
  // @param name - Name of the task to use as a filter
  // @param stage - Stage of the task to use as a filter
  // @param ticket - TicketID to use as a filter
  // @param sortField - Field to sort results by
  // @param sortOrder - Order of sorting (only if sortField supplied)
  // @limit - Maximum number of results per page
  // @page - Page of results to return
  getTasks(
    name = null,
    stage = null,
    ticket = null,
    sortField = null,
    sortOrder = "asc",
    limit = null,
    page = null
  ) {
    return axiosPrivate.get("tasks", {
      params: {
        name: name ? name : undefined,
        stage: stage ? stage : undefined,
        ticket: ticket ? ticket : undefined,
        sortBy: sortField ? sortField + ":" + sortOrder : undefined,
        limit: limit ? limit : undefined,
        page: page ? page : undefined,
      },
    });
  }

  // Create a new Task with the given name and description
  // @param name - Name of the task
  // @param description - Description of the task
  // @param taskId - ID of the ticket this task is associated with
  // @param owner - Owner of the task (only settable by Admins)
  createTask(name, description, ticketId, owner = null) {
    return axiosPrivate
      .post("tasks", {
        name: name,
        description: description,
        ticketId: ticketId,
        owner: owner ? owner : undefined,
      });
  }

  // Get a specific task
  // @param id - ID of task to retrieve
  getTask(id) {
    return axiosPrivate.get(`tasks/${id}`);
  }

  // Update the given data on the specified task
  // @param id - ID of task to update
  // @param name - Name to set on the task
  // @param description - Description to set on the task
  // @param stage - Stage to set on the task
  // @param assigned - UserID assigned this task
  // @param due - Date this task is due
  // @param link - Link to route where this task can be completed NOTE: Do we need this?
  updateTask(id, name=null, description=null, stage=null) {
    return axiosPrivate.patch(`tasks/${id}`, {
      name: name ? name : undefined,
      description: description ? description : undefined,
      stage: stage ? stage : undefined,
      assigned: assigned ? assigned : undefined,
      due: due ? due : undefined,
      link: link ? link : undefined,
    });
  }

  // Delete the specified task
  // @param id - ID of task to delete
  deleteTask(id) {
    return axiosPrivate.delete(`tasks/${id}`);
  }
}

const taskService = new TaskService();
export default taskService;
