const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.user = require('../../models/users.js')(sequelize, Sequelize);
db.role = require('../../models/role.js')(sequelize, Sequelize);
// db.books = require('../../models/books.model.js')(sequelize, Sequelize);
// db.books_issued = require('../../models/books_issued.model.js')(sequelize, Sequelize);
  
db.role.belongsToMany(db.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId'});
db.user.belongsToMany(db.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});

// db.books_issued.belongsTo(db.books, {
//   as: 'books',
//   foreignKey: 'bookId',
//   onDelete: 'CASCADE',
// });

// db.books_issued.belongsTo(db.user, {
//   as: 'user',
//   foreignKey: 'userId',
//   onDelete: 'CASCADE',
// });

// db.user.hasMany(db.books_issued, {
//   as:'borrowed_books',
//   foreignKey: 'userId'
// });



module.exports = db;