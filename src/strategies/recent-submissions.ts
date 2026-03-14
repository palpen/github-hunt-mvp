import { FeedStrategy } from './feed';
import { appRepository } from '../repository/app-repository';

export const recentSubmissions: FeedStrategy = ({ limit, offset }) => {
  return appRepository.findRecent(limit, offset);
};
