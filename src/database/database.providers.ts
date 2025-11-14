import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { GlobalConfig } from 'src/global-config/entities/global_config.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',

    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        logging: false,
        username: configService.get('dbUser'),
        port: configService.get('dbPort'),
        host: configService.get('dbHost'),
        database: configService.get('dbName'),
        password: configService.get('dbPassword'),
        pool: {
          max: 20,
          min: 1,
          acquire: 120000,
          idle: 15000,
        },
      });

      sequelize.addModels([GlobalConfig]);

      return sequelize;
    },

    inject: [ConfigService],
  },
];
