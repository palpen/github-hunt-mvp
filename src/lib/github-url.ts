import { ParsedGitHubUrl } from './types';

export function parseGitHubUrl(url: string): ParsedGitHubUrl | { error: string } {
  try {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    cleanUrl = cleanUrl.split('?')[0].split('#')[0].replace(/\.git$/, '');
    if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
    }
    
    let parsed: URL;
    try {
      parsed = new URL(cleanUrl);
    } catch {
      return { error: 'Invalid URL format. Please use https://github.com/owner/repo' };
    }

    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') {
      return { error: 'URL must be a github.com repository' };
    }

    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      return { error: 'Please provide a specific repository (e.g., owner/repo)' };
    }

    const owner = parts[0].toLowerCase();
    const repo_name = parts[1].toLowerCase();

    return {
      github_url: `https://github.com/${owner}/${repo_name}`,
      owner,
      repo_name
    };
  } catch (err) {
    return { error: 'An unexpected error occurred while parsing the URL' };
  }
}
