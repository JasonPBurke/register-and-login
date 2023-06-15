import { axiosPrivate } from "./APIService";

const addArtifactLinks = (artifact) => {
  if (artifact.hasFile) {
    artifact.file = axiosPrivate.baseURL + `/artifacts/${id}/file`;
  }
  delete artifact.hasFile;

  if (artifact.hasThumb) {
    artifact.thumb = axiosPrivate.baseURL + `/artifacts/${id}/thumb`;
  }
  delete artifact.hasThumb;
};

class ArtifactService {
  // Get list of artifacts
  // @param name - Name of the artifact to use as a filter
  // @param tags - Array of tags to use as a filter (OR)
  // @param ticket - TicketID to use as a filter
  // @param sortField - Field to sort results by
  // @param sortOrder - Order of sorting (only if sortField supplied)
  // @limit - Maximum number of results per page
  // @page - Page of results to return
  async getArtifacts(
    name = null,
    tags = null,
    sortField = null,
    sortOrder = "asc",
    limit = null,
    page = null
  ) {
    const result = await axiosPrivate.get("artifacts", {
      params: {
        name: name ? name : undefined,
        tags: tags ? tags : undefined,
        sortBy: sortField ? sortField + ":" + sortOrder : undefined,
        limit: limit ? limit : undefined,
        page: page ? page : undefined,
      },
    });
    result.results?.forEach((element, index) => {
      result.results[index] = addArtifactLinks(element);
    });
  }

  // Create a new Artifact with the given name and description
  // @param name - Name of the artifact
  // @param description - Description of the artifact
  // @param externalLink - URI for an externally hosted artifact (e.g. YouTube video)
  // @param tags - Array of tags associated with this artifact
  // @param file - URI from file-picker for the artifact file
  // @param thumb - URI from file-picker for the artifact thumbnail
  // @param owner - Owner of the artifact (only settable by Admins)
  async createArtifact(
    name,
    description,
    externalLink = null,
    tags = null,
    file = null,
    thumb = null,
    owner = null
  ) {
    const result = await axiosPrivate.post("artifacts", {
      name: name,
      description: description,
      externalLink: externalLink ? externalLink : undefined,
      tags: tags ? tags : undefined,
      file: file ? file : undefined,
      thumb: thumb ? thumb : undefined,
      owner: owner ? owner : undefined,
    });
    return addArtifactLinks(result);
  }

  // Get a specific artifact
  // @param id - ID of artifact to retrieve
  async getArtifact(id) {
    const result = await axiosPrivate.get(`artifacts/${id}`);
    if (result.body) {
      return addArtifactLinks(result.body);
    }
  }

  // Update the given data on the specified artifact
  // @param id - ID of artifact to update
  // @param description - Description of the artifact
  // @param externalLink - URI for an externally hosted artifact (e.g. YouTube video)
  // @param tags - Array of tags associated with this artifact
  // @param file - URI from file-picker for the artifact file
  // @param thumb - URI from file-picker for the artifact thumbnail
  // @param owner - Owner of the artifact (only settable by Admins)
  async updateArtifact(
    description = null,
    externalLink = null,
    tags = null,
    file = null,
    thumb = null,
    owner = null
  ) {
    const result = await axiosPrivate.patch(`artifacts/${id}`, {
      description: description ? description : undefined,
      externalLink: externalLink ? externalLink : undefined,
      tags: tags ? tags : undefined,
      file: file ? file : undefined,
      thumb: thumb ? thumb : undefined,
      owner: owner ? owner : undefined,
    });
    return addArtifactLinks(result);
  }

  // Delete the specified artifact
  // @param id - ID of artifact to delete
  deleteArtifact(id) {
    return axiosPrivate.delete(`artifacts/${id}`);
  }
}

const artifactService = new ArtifactService();
export default artifactService;
