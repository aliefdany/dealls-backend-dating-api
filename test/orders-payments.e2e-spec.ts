import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Orders and Payments (e2e)', () => {
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

  it('/api/v1/orders (POST) - should create an order', async () => {
    const orderData = { packageId: 12 };

    const response = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(orderData)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      order_id: orderData.packageId,
    });
  });

  it('/api/v1/payments (PATCH) - should process payment for an order', async () => {
    const paymentData = { orderId: 1 };

    const response = await request(app.getHttpServer())
      .patch('/api/v1/payments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(paymentData)
      .expect(200);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      status: 'PAID',
    });
  });
});
