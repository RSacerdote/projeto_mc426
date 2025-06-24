// Importa explicitamente as funções globais do Jest para compatibilidade com Módulos ES
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';

// Usamos a forma moderna e explícita de mock
jest.unstable_mockModule('axios', () => ({
  default: {
    get: jest.fn(),
  },
}));

// Importamos dinamicamente os módulos APÓS a configuração do mock
const { default: axios } = await import('axios');
const { default: app } = await import('../index.js');

describe('GET /route', () => {
  // Limpa o mock antes de cada teste
  beforeEach(() => {
    axios.get.mockClear();
  });

  it('should return a route with coordinates and distance', async () => {
    const startCoordinates = '-47.065,-22.817';
    const endCoordinates = '-47.070,-22.819';

    const mockOrsResponse = {
      data: {
        features: [
          {
            geometry: { coordinates: [[-47.065, -22.817], [-47.070, -22.819]] },
            properties: { summary: { distance: 1500 } },
          },
        ],
      },
    };
    
    axios.get.mockResolvedValue(mockOrsResponse);

    const response = await request(app).get(`/route?start=${startCoordinates}&end=${endCoordinates}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('coordinates');
    expect(response.body).toHaveProperty('distance', 1500);
    expect(response.body.coordinates[0]).toEqual([-22.817, -47.065]);
  });

  it('should return 400 if start or end coordinates are missing', async () => {
    const response = await request(app).get('/route?start=-47.065,-22.817');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Coordenadas de início e fim são obrigatórias.');
  });

  it('should return 500 if the external OpenRouteService API fails', async () => {
    const startCoordinates = '-47.065,-22.817';
    const endCoordinates = '-47.070,-22.819';

    axios.get.mockRejectedValue(new Error('ORS API is down'));

    const response = await request(app).get(`/route?start=${startCoordinates}&end=${endCoordinates}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Não foi possível calcular a rota.');
  });
});