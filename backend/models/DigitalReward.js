import Reward from './Reward.js';

class DigitalReward extends Reward {
  constructor(name, pointsRequired, startDate, endDate, email) {
    super(name, pointsRequired, startDate, endDate);
    this.email = email;
  }

  deliver() {
    return `Sending digital reward "${this.name}" to ${this.email}.`;
  }
}

export default DigitalReward;