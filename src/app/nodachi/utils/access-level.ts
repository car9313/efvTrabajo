import { AccessLevelType } from '../enum/access-level-type.enum';

export interface AccessLevel {
  accessType: AccessLevelType;
  value?: any;
}
