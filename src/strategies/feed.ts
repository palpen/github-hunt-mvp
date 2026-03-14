import { App } from '../lib/types';

export type FeedStrategy = (options: { limit: number; offset: number }) => Promise<App[]>;
