import RewardFactory from './RewardFactory.js';
import DigitalReward from '../models/DigitalReward.js';

class DigitalRewardFactory extends RewardFactory {
  createReward(name, pointsRequired, startDate, endDate, email) {
    return new DigitalReward(name, pointsRequired, startDate, endDate, email);
  }
}

export default DigitalRewardFactory;