import request from 'supertest';
import app from '../index.js'; // Importa o app do backend

describe('Bike Racks API', () => {
  it('should return a list of bike racks', async () => {
    const response = await request(app).get('/bike-racks');
    expect(response.status).toBe(200); // Verifica se o status HTTP é 200
    expect(response.body).toBeInstanceOf(Array); // Verifica se o corpo da resposta é um array
    expect(response.body.length).toBeGreaterThan(0); // Verifica se há bicicletários na resposta

    // Verifica se os dados dos bicicletários estão corretos
    response.body.forEach((rack) => {
      expect(rack).toHaveProperty('id');
      expect(rack).toHaveProperty('name');
      expect(rack).toHaveProperty('location');
      expect(rack.location).toHaveProperty('lat');
      expect(rack.location).toHaveProperty('lng');
      expect(rack).toHaveProperty('availableSpots');
    });
  });
});