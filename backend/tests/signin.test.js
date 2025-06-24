// Dentro do arquivo backend/tests/signin.test.js
import request from 'supertest';
import app from '../index.js';

describe('Signin Endpoint', () => {
  const user = { email: 'test.signin@email.com', password: 'rightPassword' };

  // Pre-condição: garantir que o usuário de teste exista
  beforeAll(async () => {
    await request(app).post('/signup').send(user);
  });

  // Teste para a Classe de Equivalência Válida (CEV 1)
  it('should sign in successfully with correct credentials', async () => {
    const res = await request(app).post('/signin').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Signin successful');
  });

  // Teste para a Classe de Equivalência Inválida (CEI 1)
  it('should return 404 if user does not exist', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ email: 'not.found@email.com', password: 'anyPassword' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  // Teste para a Classe de Equivalência Inválida (CEI 2)
  it('should return 401 for invalid password', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ email: user.email, password: 'wrongPassword' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
  
  // Teste para a Classe de Equivalência Inválida (CEI 3)
  it('should return 422 if email or password is missing', async () => {
    // Sub-caso 1: Senha faltando
    let res = await request(app).post('/signin').send({ email: user.email });
    expect(res.statusCode).toBe(422);

    // Sub-caso 2: Email faltando
    res = await request(app).post('/signin').send({ password: user.password });
    expect(res.statusCode).toBe(422);
  });
});