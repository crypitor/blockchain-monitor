import { Connection } from 'mongoose';
import {
  ProjectMemberSchema,
  ProjectQuotaSchema,
  ProjectSchema,
} from './schemas/project.schema';

export const ProjectProviders = [
  {
    provide: 'PROJECT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Project', ProjectSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PROJECT_QUOTA_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('ProjectQuota', ProjectQuotaSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PROJECT_MEMBER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('ProjectMember', ProjectMemberSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
