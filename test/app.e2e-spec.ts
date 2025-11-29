import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  it('/api/health (GET)', async () => {
    const response = await request(httpServer).get('/api/health').expect(200);
    const body = response.body as { status: string; timestamp: string };
    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('timestamp');
  });
});
