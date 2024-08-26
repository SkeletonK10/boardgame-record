import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function TypeormConfig(configService: ConfigService) {
  const env = configService.get('NODE_ENV');

  const synchronize =
    configService.get<string>('SYNCHRONIZE') === 'true' ? true : false;
  const logging =
    configService.get<string>('DB_LOGGING') === 'true' ? true : false;
  const DB_TYPE: 'postgres' | null = 'postgres';

  const option: TypeOrmModuleOptions = {
    type: DB_TYPE,
    host: configService.get(`DB_HOST`),
    port: +configService.get(`DB_PORT`),
    username: configService.get(`DB_USERNAME`),
    password: configService.get(`DB_PASSWORD`),
    database: configService.get(`DB_DATABASE`),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    autoLoadEntities: true,
    synchronize: env === 'production' ? false : synchronize,
    useUTC: false,
    logging: logging,
    retryAttempts: env === 'production' ? 10 : 1,
  };
  return option;
}
