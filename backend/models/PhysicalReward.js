import Reward from './Reward.js';

class PhysicalReward extends Reward {
  constructor(name, pointsRequired, startDate, endDate, shippingAddress) {
    super(name, pointsRequired, startDate, endDate);
    this.shippingAddress = shippingAddress;
  }

  deliver() {
    return `Delivering physical reward "${this.name}" to ${this.shippingAddress}.`;
  }
}

export default PhysicalReward;