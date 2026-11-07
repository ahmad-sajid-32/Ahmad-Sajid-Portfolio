import * as migration_20261105_072229_initial from './20261105_072229_initial';
import * as migration_20261107_043500_socials_global from './20261107_043500_socials_global';

export const migrations = [
  {
    up: migration_20261105_072229_initial.up,
    down: migration_20261105_072229_initial.down,
    name: '20261105_072229_initial'
  },
  {
    up: migration_20261107_043500_socials_global.up,
    down: migration_20261107_043500_socials_global.down,
    name: '20261107_043500_socials_global'
  },
];
