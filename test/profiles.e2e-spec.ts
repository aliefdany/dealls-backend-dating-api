import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProfilesController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Authenticate and get JWT token
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/signin')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(200);

    accessToken = response.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/profiles (GET) - should retrieve a profile for swiping', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/profiles')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ tz: 'Asia/Jakarta' })
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('swiper_id');
    expect(response.body).toHaveProperty('swipee_id');
  });

  it('/api/v1/profiles (GET) - should limit swipes for regular users', async () => {
    for (let i = 0; i < 10; i++) {
      await request(app.getHttpServer())
        .get('/api/v1/profiles')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ tz: 'Asia/Jakarta' })
        .expect(200);
    }

    // 11th request should fail
    await request(app.getHttpServer())
      .get('/api/v1/profiles')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ tz: 'Asia/Jakarta' })
      .expect(429); // Too many requests
  });
});
