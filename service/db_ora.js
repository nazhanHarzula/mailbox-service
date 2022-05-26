const oracledb = require('oracledb');
const fs = require('fs');
const sworm = require('sworm')

let libPath;
if (process.platform === 'win32') {           // Windows
    libPath = 'C:\\oracle\\instantclient_21_3'
}

if (libPath && fs.existsSync(libPath)) {
    oracledb.initOracleClient({ libDir: libPath });
}

const config_prod = {
    driver: "oracle",
    config: {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        connectionString: process.env.DB_CONN_STRING
    }
}

const config_dev = {
    driver: "oracle",
    config: {
        user: process.env.DB_USER_DEV,
        password: process.env.DB_PASS_DEV,
        connectionString: process.env.DB_CONN_STRING_DEV
    }
}

module.exports = {config_prod,config_dev};

// module.exports = {
//     user          : process.env.DB_USER,
  
//     // Get the password from the environment variable
//     // NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
//     // string (not recommended), or it could be prompted for.
//     // Alternatively use External Authentication so that no password is
//     // needed.
//     password      : process.env.DB_PASSWORD,
  
//     // For information on connection strings see:
//     // https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
//     connectString : process.env.DB_CONN_STRING
//   };