'use server';

import { recentSubmissions } from '../strategies/recent-submissions';
import { ActionResult, App } from '../lib/types';

export async function getFeed(page: number): Promise<ActionResult<App[]>> {
  try {
    const limit = 20;
    const offset = (Math.max(1, page) - 1) * limit;
    const apps = await recentSubmissions({ limit, offset });
    return { success: true, data: apps };
  } catch (error) {
    return { success: false, error: "Failed to fetch feed." };
  }
}
