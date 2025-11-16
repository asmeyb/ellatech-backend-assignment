import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import * as joi from 'joi';

@Module({  
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DB_HOST: joi.string().default('localhost'),
        DB_PORT: joi.number().default(5432),
        DB_USERNAME: joi.string().default('postgres'),
        DB_PASSWORD: joi.string().required(),
        DB_NAME: joi.string().default('inventory_db'),
        PORT: joi.number().default(3000),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // Disable in production, use migrations
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
      }),
    }),
    UsersModule,
    ProductsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
