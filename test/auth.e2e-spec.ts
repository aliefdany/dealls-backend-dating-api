import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/signup (POST) - should create a new user', async () => {
    const userData = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send(userData)
      .expect(200);

    expect(response.body).toMatchObject({
      username: userData.username,
    });
  });

  it('/api/v1/auth/signin (POST) - should authenticate a user', async () => {
    const loginData = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/signin')
      .send(loginData)
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toMatchObject({
      username: loginData.username,
    });
  });
});
