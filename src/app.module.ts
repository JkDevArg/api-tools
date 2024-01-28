import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager'
import { IpModule } from './ip/ip.module';
import { DomainModule } from './domain/domain.module';
import { NameModule } from './name/name.module';
import { NetworkModule } from './network/network.module';
import { DniModule } from './dni/dni.module';
import { AbuseipModule } from './abuseip/abuseip.module';
import { UrlscanModule } from './urlscan/urlscan.module';
import * as redisStore from 'cache-manager-redis-store';
import { MailModule } from './mail/mail.module';
import { WebsocketModule } from './websocket/websocket.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    IpModule,
    DomainModule,
    NameModule,
    NetworkModule,
    DniModule,
    AbuseipModule,
    UrlscanModule,
    MailModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
