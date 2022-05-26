const router = require('express').Router();
const fs = require('fs');
const dotenv = require('dotenv');
const dbConfig = require('../../service/db_ora');
const config = require('../../service/dbConfig');

const sworm = require('sworm');
const oracledb = require('oracledb');
dotenv.config(); // Harus dipaling atas sebelum code lain jalan, karena Environment Variable bisa tidak terbaca oleh code lain.
const getDbConfig = require('../../service/getDbConfig');
const { createProxyMiddleware } = require('http-proxy-middleware');

    // sample proxy
    router.post('/proxy_image', (req, res) => {
        const apiProxy = createProxyMiddleware('http://localhost:8080', { target: 'http://google.com' });
        return res.json({"status" : "success"});
    });

    // get data login
    router.post('/authentication_user',async (req,res)=>{

        let connection;

        try {
          // Get a non-pooled connection
          console.log(config);

          connection = await oracledb.getConnection(config);

          console.log('Connection was successful!');

          const result = await connection.execute(
            `BEGIN
               GGGG_MB_MOBILE_PKG.GET_DETAIL_USER(:cursor, :p_nik, :p_password);
             END;`,
            {
                p_nik : { type: oracledb.STRING, val:req.body.nik, dir: oracledb.BIND_IN},
                p_password : { type: oracledb.STRING, val:req.body.password, dir: oracledb.BIND_IN},
              cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            },
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

          const resultSet1 = result.outBinds.cursor;

          console.log("Cursor metadata:");
          console.log(resultSet1.metaData);

          let rows1 = await resultSet1.getRows();  // no parameter means get all rows
          if(rows1 != null){
            rows1 = rows1[0];
          }

          await resultSet1.close();                 // always close the ResultSet

          return res.json(rows1);

        } catch (err) {
          console.error(err);
        } finally {
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error(err);
            }
          }
        }
        })

    // get data Mailbox
    router.post('/fetch_mailbox',async (req,res)=>{

    let connection;

    console.log(req.body.lembaga);

    try {
      // Get a non-pooled connection
      console.log(config);

      connection = await oracledb.getConnection(config);
  
      console.log('Connection was successful!');

      const result = await connection.execute(
        `BEGIN
           GGGG_MB_MOBILE_PKG.FETCH_DATA_MAILBOX(:cursor, :p_lembaga);
         END;`,
        {
            p_lembaga : { type: oracledb.STRING, val:req.body.lembaga, dir: oracledb.BIND_IN},
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        {outFormat: oracledb.OUT_FORMAT_OBJECT});

      const resultSet1 = result.outBinds.cursor;
  
      console.log("Cursor metadata:");
      console.log(resultSet1.metaData);

      const rows1 = await resultSet1.getRows();  // no parameter means get all rows
      console.log(rows1);

      await resultSet1.close();                 // always close the ResultSet
  
      return res.json(rows1);


    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
    })

    // get data Agenda
    router.post('/fetch_agenda',async (req,res)=>{

        let connection;
    
        console.log(req.body.lembaga);
    
        try {
          // Get a non-pooled connection
          connection = await oracledb.getConnection(config);
      
          console.log('Connection was successful!');
    
          const result = await connection.execute(
            `BEGIN
               GGGG_MB_MOBILE_PKG.FETCH_DATA_AGENDA(:cursor, :p_nama_penerima);
             END;`,
            {
                p_nama_penerima : { type: oracledb.STRING, val:req.body.nama_penerima, dir: oracledb.BIND_IN},
              cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            },
            {outFormat: oracledb.OUT_FORMAT_OBJECT});
      
          const resultSet1 = result.outBinds.cursor;
      
          console.log("Cursor metadata:");
          console.log(resultSet1.metaData);
      
          const rows1 = await resultSet1.getRows();  // no parameter means get all rows
          console.log(rows1);
      
          await resultSet1.close();                 // always close the ResultSet
      
          return res.json(rows1);
        } catch (err) {
          console.error(err);
        } finally {
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error(err);
            }
          }
        }
             
    
        })

          // update data mailbox
router.post('/sync_mailbox',async (req,res)=>{

    let connection;


    try {
      // Get a non-pooled connection
      connection = await oracledb.getConnection(config);
  
      console.log('Connection was successful!');

      let arrayRequest = req.body.values;

      for(let i=0; i < arrayRequest.length; i++){

          console.log("ID DTL : "+arrayRequest[i].pmb_dtl_id);
//          console.log("PENERIMA SURAT : "+arrayRequest[i].pnm_penerima_surat);
//          console.log("ID KURIR : "+arrayRequest[i].pkd_kurir_pengirim);
//          console.log("NAMA KURIR : "+arrayRequest[i].pnm_kurir_pengirim);
//          console.log("Tanggal : "+arrayRequest[i].ptgl_user_terima);
//          console.log("TTD : "+arrayRequest[i].pttd_penerima);
//          console.log("Gambar : "+arrayRequest[i].pgbr_penerima);

          let result = await connection.execute(
            `BEGIN
               GGGG_MB_MOBILE_PKG.gggg_update_mailbox(:pmb_dtl_id, :pnm_penerima_surat, :pttd_penerima, :pgbr_penerima, :pkd_kurir_pengirim, :pnm_kurir_pengirim, :ptgl_user_terima);
             END;`,
            {
                pmb_dtl_id : { type: oracledb.NUMBER, val:arrayRequest[i].pmb_dtl_id, dir: oracledb.BIND_IN},
                pnm_penerima_surat : { type: oracledb.STRING, val:arrayRequest[i].pnm_penerima_surat, dir: oracledb.BIND_IN},
                pttd_penerima : { type: oracledb.BUFFER, val:Buffer.from(arrayRequest[i].pttd_penerima, 'base64'), dir: oracledb.BIND_IN},
                pgbr_penerima : { type: oracledb.BUFFER, val:Buffer.from(arrayRequest[i].pgbr_penerima, 'base64'), dir: oracledb.BIND_IN},
                pkd_kurir_pengirim : { type: oracledb.NUMBER, val:arrayRequest[i].pkd_kurir_pengirim, dir: oracledb.BIND_IN},
                pnm_kurir_pengirim : { type: oracledb.STRING, val:arrayRequest[i].pnm_kurir_pengirim, dir: oracledb.BIND_IN},
                ptgl_user_terima : { type: oracledb.DATE, val:new Date(arrayRequest[i].ptgl_user_terima), dir: oracledb.BIND_IN}
            },
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

            console.log(result);

      }
//      console.log("Cursor metadata:");
//      console.log(resultSet1.metaData);
//      const resultSet1 = result.outBinds.cursor;
//      const rows1 = await resultSet1.getRows();  // no parameter means get all rows
//      console.log(rows1);
  
//      await resultSet1.close();                 // always close the ResultSet
  
      return res.status(200).json({status :true,message:"Updated"})
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
    })




module.exports = router;