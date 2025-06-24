import RewardFactory from './RewardFactory.js';
import PhysicalReward from '../models/PhysicalReward.js';

class PhysicalRewardFactory extends RewardFactory {
  createReward(name, pointsRequired, startDate, endDate, shippingAddress) {
    return new PhysicalReward(name, pointsRequired, startDate, endDate, shippingAddress);
  }
}

export default PhysicalRewardFactory;