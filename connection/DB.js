const sql = require('mssql');

const config = {
  user: 'user',
  password: 'user',
  server: 'localhost\\SQLEXPRESS',
  database: 'clinic',
  options: {
    trustedConnection: true,
    enableArithAbort:true
  },
  port: 63193
}

const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
  console.log('Connected to MSSQL');
  return pool;
}).catch(err => console.log('Database Connection Failed! Bad Config: ', err))
module.exports = {
  sql, poolPromise
}
