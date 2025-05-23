import request from 'supertest';
import app from '../index.js';

describe('Rewards API', () => {
  describe('POST /rewards/physical', () => {
    it('should create a physical reward', async () => {
      const rewardData = {
        name: 'Bicicleta',
        pointsRequired: 500,
        startDate: '2025-05-01',
        endDate: '2025-06-01',
        shippingAddress: 'Rua Exemplo, 123',
      };

      const response = await request(app).post('/rewards/physical').send(rewardData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', rewardData.name);
      expect(response.body).toHaveProperty('pointsRequired', rewardData.pointsRequired);
      expect(response.body).toHaveProperty('startDate', rewardData.startDate);
      expect(response.body).toHaveProperty('endDate', rewardData.endDate);
      expect(response.body).toHaveProperty('shippingAddress', rewardData.shippingAddress);
    });

    it('should return 422 if required fields are missing', async () => {
      const rewardData = {
        name: 'Bicicleta',
        pointsRequired: 500,
      };

      const response = await request(app).post('/rewards/physical').send(rewardData);

      expect(response.status).toBe(422);
      expect(response.body).toBeInstanceOf(Array); // Expect an array of validation errors
    });
  });

  describe('POST /rewards/digital', () => {
    it('should create a digital reward', async () => {
      const rewardData = {
        name: 'Cupom de Desconto',
        pointsRequired: 200,
        startDate: '2025-05-01',
        endDate: '2025-06-01',
        email: 'user@example.com',
      };

      const response = await request(app).post('/rewards/digital').send(rewardData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', rewardData.name);
      expect(response.body).toHaveProperty('pointsRequired', rewardData.pointsRequired);
      expect(response.body).toHaveProperty('startDate', rewardData.startDate);
      expect(response.body).toHaveProperty('endDate', rewardData.endDate);
      expect(response.body).toHaveProperty('email', rewardData.email);
    });

    it('should return 422 if required fields are missing', async () => {
      const rewardData = {
        name: 'Cupom de Desconto',
        pointsRequired: 200,
      };

      const response = await request(app).post('/rewards/digital').send(rewardData);

      expect(response.status).toBe(422);
      expect(response.body).toBeInstanceOf(Array); // Expect an array of validation errors
    });
  });
});