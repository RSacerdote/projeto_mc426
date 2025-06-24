import request from 'supertest';
import app from '../index.js';

describe('Tasks API', () => {
  describe('POST /tasks', () => {
    // Teste para a Classe de Equivalência Válida (CEV 1)
    it('should create a task with valid data', async () => {
      const taskData = {
        title: 'Complete a survey',
        description: 'Fill out the new mobility survey.',
        credits: 100, // Valor da partição válida
      };
      const response = await request(app).post('/tasks').send(taskData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', taskData.title);
      expect(response.body.credits).toBe(taskData.credits);
    });

    // Testes de Análise de Valor Limite (AVL)
    it('should return 422 for credits value of 0 (Boundary: min - 1)', async () => {
      const taskData = {
        title: 'Invalid Credits Task',
        description: 'Testing boundary.',
        credits: 0, // Valor limite inválido
      };
      const response = await request(app).post('/tasks').send(taskData);
      expect(response.status).toBe(422);
    });

    it('should create a task with credits value of 1 (Boundary: min)', async () => {
      const taskData = {
        title: 'Valid Credits Task',
        description: 'Testing boundary.',
        credits: 1, // Valor limite válido
      };
      const response = await request(app).post('/tasks').send(taskData);
      expect(response.status).toBe(201);
      expect(response.body.credits).toBe(1);
    });

    // Teste para a Classe de Equivalência Inválida (CEI 2)
    it('should return 422 for non-integer credits', async () => {
      const taskData = {
        title: 'Non-integer credits',
        description: 'Testing invalid type.',
        credits: 'one hundred', // Valor da partição inválida
      };
      const response = await request(app).post('/tasks').send(taskData);
      expect(response.status).toBe(422);
    });
  });
});