import Sequelize from 'sequelize';

import User from '../app/models/User';
import Store from '../app/models/Store';

import databaseConfig from '../config/database';

const models = [User, Store];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
