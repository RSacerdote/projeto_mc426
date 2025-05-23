class Reward {
  constructor(name, pointsRequired, startDate, endDate) {
    if (new.target === Reward) {
      throw new Error("Cannot instantiate abstract class Reward directly.");
    }
    this.name = name;
    this.pointsRequired = pointsRequired;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  deliver() {
    throw new Error("Method 'deliver()' must be implemented.");
  }
}

export default Reward;