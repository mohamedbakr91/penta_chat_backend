import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { GlobalConfig } from 'src/global-config/entities/global_config.entity';
import { GroupMember } from 'src/group/entities/group-member.entity';
import { Group } from 'src/group/entities/group.entity';
import { Message } from 'src/message/entities/message.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';

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

      sequelize.addModels([
        GlobalConfig,
        Project,
        User,
        Group,
        Friendship,
        GroupMember,
        Message,
      ]);

      return sequelize;
    },

    inject: [ConfigService],
  },
];
