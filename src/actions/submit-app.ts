'use server';

import { parseGitHubUrl } from '../lib/github-url';
import { checkGitHubRepoExists } from '../lib/github-check';
import { appRepository } from '../repository/app-repository';
import { ActionResult, App } from '../lib/types';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

const rateLimitMap = new Map<string, number[]>();

export async function submitApp(url: string): Promise<ActionResult<App>> {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    let requests = rateLimitMap.get(ip) || [];
    requests = requests.filter(time => time > hourAgo);
    
    if (requests.length >= 10) {
      return { success: false, error: "You're submitting too fast. Please try again later." };
    }
    requests.push(now);
    rateLimitMap.set(ip, requests);

    const parsed = parseGitHubUrl(url);
    if ('error' in parsed) {
      return { success: false, error: parsed.error };
    }

    const existing = await appRepository.findByUrl(parsed.github_url);
    if (existing) {
      return { success: false, error: "This repository has already been submitted!" };
    }

    const existsOnGitHub = await checkGitHubRepoExists(parsed.github_url);
    if (!existsOnGitHub) {
      return { success: false, error: "This repository doesn't seem to exist on GitHub." };
    }

    const app = await appRepository.create(parsed);
    
    revalidatePath('/');
    return { success: true, data: app };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred." };
  }
}
