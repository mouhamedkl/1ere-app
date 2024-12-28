import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from './../src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;
  let userId:number
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT, 10),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [User],
          synchronize: true, // Recrée les tables
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    jwtService = app.get<JwtService>(JwtService);

    // Création d'un utilisateur pour générer un token
    const user = await request(app.getHttpServer())
      .post('/auth/login')  // Remplacez '/auth/login' par le bon endpoint de connexion
      .send({
        email: 'admin@example.com',
        password: 'admin123',  // Utilisez un utilisateur valide et un mot de passe correct
      })
      .expect(201);
    
    token = user.body.access_token;  // Assurez-vous que votre backend renvoie le token dans `access_token`
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - create a user', async () => {
    console.log(token);
    
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)  // Ajout du token d'authentification
      .send({
        name:"testuser",
        email: 'testuser',
        password: 'password123',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toEqual('testuser');
  });

  it('/users (GET) - get all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)  // Ajout du token d'authentification
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users/:id (GET) - get a single user', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)  // Ajout du token d'authentification
      .send({
        name: 'testuser'
      })
      .expect(201);

    userId = createUserResponse.body.id;
    console.log('Created User ID:', userId);
    const getUserResponse = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)  // Ajout du token d'authentification
      .expect(200);

    expect(getUserResponse.body).toHaveProperty('id', userId);
  });

  it('/users/:id (DELETE) - delete a user', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'deleteuser',
        email: 'deleteuser@example.com',
        password: 'password123',
      })
      .expect(201); // Vérifiez si l'utilisateur est créé avec succès
  
    const userId = createUserResponse.body.id;
    console.log('Created User ID:', userId);
  
    // suppression de l'utilisateur
    const deleteResponse = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(200); // Attendez-vous à une réponse 200 ou 204 si la suppression réussit
  });
  
});
