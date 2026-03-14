export type App = {
  id: string;
  github_url: string;
  owner: string;
  repo_name: string;
  created_at: Date;
  click_count: number;
};

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ParsedGitHubUrl = {
  github_url: string;
  owner: string;
  repo_name: string;
};
