const API_BASE_PATH = "data";

async function fetchResource(resource) {
  const url = `${API_BASE_PATH}/${resource}`;
  let response;
  try {
    response = await fetch(url);
  } catch (networkErr) {
    throw new Error(`Network error while fetching ${resource}: ${networkErr.message}`);
  }
  if (!response.ok) {
    throw new Error(`Failed to load ${resource} (status ${response.status})`);
  }
  try {
    return await response.json();
  } catch (parseErr) {
    throw new Error(`Failed to parse ${resource} as JSON: ${parseErr.message}`);
  }
}

export function getProfile() {
  return fetchResource("profile.json");
}

export function getSkills() {
  return fetchResource("skills.json");
}

export function getProjects() {
  return fetchResource("projects.json");
}

export function getContact() {
  return fetchResource("contact.json");
}

export function getBlogPosts() {
  return fetchResource("blog.json");
}