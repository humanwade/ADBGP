import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.ORACLE_HOST})(PORT=${process.env.ORACLE_PORT}))(CONNECT_DATA=(SID=${process.env.ORACLE_SID})))`
};

export async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}
// async function testConnection() {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     console.log(' Success to Oracle DB connection!');
//     const result = await connection.execute('SELECT * FROM GP_LMS_LOAN_FINES');
//     console.log('result:', result.rows);
//   } catch (err) {
//     console.error('connection failed: ', err);
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error('connection failed:', err);
//       }
//     }
//   }
// }

// testConnection();