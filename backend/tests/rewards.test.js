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

  // Testes de Equivalência e Limite para Recompensas Físicas
  describe('POST /rewards/physical - Equivalence and Boundary Tests', () => {
    const baseReward = {
      name: 'Garrafa de Água',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      shippingAddress: 'Rua da Unicamp, 1000',
    };

    // Teste de Análise de Valor Limite (AVL)
    it('should return 422 when pointsRequired is 0 (Boundary: min - 1)', async () => {
      const rewardData = { ...baseReward, pointsRequired: 0 };
      const response = await request(app).post('/rewards/physical').send(rewardData);
      expect(response.status).toBe(422);
      expect(response.body[0]).toContain('"pointsRequired" must be greater than or equal to 1');
    });

    it('should create a physical reward when pointsRequired is 1 (Boundary: min)', async () => {
      const rewardData = { ...baseReward, pointsRequired: 1 };
      const response = await request(app).post('/rewards/physical').send(rewardData);
      expect(response.status).toBe(201);
      expect(response.body.pointsRequired).toBe(1);
    });
    
    // Teste para a Classe de Equivalência Inválida (CEI 2)
    it('should return 422 for non-numeric pointsRequired', async () => {
      const rewardData = { ...baseReward, pointsRequired: 'cem' };
      const response = await request(app).post('/rewards/physical').send(rewardData);
      expect(response.status).toBe(422);
    });
  });
});