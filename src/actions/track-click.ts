'use server';

import { appRepository } from '../repository/app-repository';

export async function trackClick(appId: string): Promise<void> {
  try {
    await appRepository.incrementClickCount(appId);
  } catch (error) {
    console.error("Failed to track click", error);
  }
}
