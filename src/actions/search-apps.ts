'use server';

import { appRepository } from '../repository/app-repository';
import { ActionResult, App } from '../lib/types';

export async function searchApps(query: string, page: number): Promise<ActionResult<App[]>> {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { success: true, data: [] };
    }

    const limit = 20;
    const offset = (Math.max(1, page) - 1) * limit;
    const apps = await appRepository.search(cleanQuery, limit, offset);
    return { success: true, data: apps };
  } catch (error) {
    return { success: false, error: "Failed to search applications." };
  }
}
