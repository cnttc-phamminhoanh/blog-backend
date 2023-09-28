import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_TYPE as any,
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USER,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: ['dist/database/entity.js'],
      migrations: ['dist/database/migrations/*.js'],
      synchronize: false,
    }),
    UserModule,
    AuthModule,
  ],
  providers: [ConfigService]
})
export class AppModule {}
