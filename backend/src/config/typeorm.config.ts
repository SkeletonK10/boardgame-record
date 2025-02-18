import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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
    migrationsRun: false,
    migrations: [__dirname + '/**/migrations/*'],
    migrationsTableName: 'migrations',
  };
  return option;
}

// 마이그레이션을 위한 DataSource Config
// 빈칸에 원하는 .env의 정보를 입력하고 마이그레이션 실행

const AppDataSource = new DataSource({
  type: 'postgres',
  host: '',
  port: +'',
  username: '',
  password: '',
  database: '',
  synchronize: false,
  entities: ['/../**/*.entity.{js,ts}'],
  migrations: ['src/database/migrations/*'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
