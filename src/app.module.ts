import { Module, Post } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import * as joi from 'joi';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({  
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '158861',
      database: 'youtube-nest-project',
      autoLoadEntities: true,
      entities:[], // Array of entities or path to entity files
      synchronize: true,
    }),
    ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: joi.object({
          // APP_NAME: joi.string().default('default-app'),
          // APP_PORT: joi.number().default(3000 
          load: [appConfig],         
      })
      }),
    HelloModule, UsersModule, PostsModule, ProductsModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
