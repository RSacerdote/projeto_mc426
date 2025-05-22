import request from 'supertest';
import app from '../index.js';

describe('Signin Endpoint', () => {
  const user = { email: 'user@email.com', password: 'rightPass' };

  // First, register the user before signin tests
  beforeAll(async () => {
    await request(app).post('/signup').send(user);
  });

  it('should return 400 if email or password is missing', async () => {
    const res = await request(app).post('/signin').send({});
    expect(res.statusCode).toBe(422);
  });

  it('should return 404 if user does not exist', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ email: 'notfound@email.com', password: 'anyPass' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  it('should return 401 for invalid password', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ email: user.email, password: 'wrongPass' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should sign in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ email: user.email, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Signin successful');
  });
});
