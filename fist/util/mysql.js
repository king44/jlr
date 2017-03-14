/**
 * Created by 04259 on 2017-03-01.
 */
var mysql = require('mysql');

var TEST_DATABASE = 'nodejs';
var TEST_TABLE = 'user';

//创建连接
var sql_client = mysql.createConnection({
    host:'ec2-54-255-166-71.ap-southeast-1.compute.amazonaws.com',
    post:'3306',
    user: 'root',
    password: 'photonman',
    debug:'true'
});

sql_client.connect();
sql_client.query("use " + TEST_DATABASE);

/*sql_client.query(
 'SELECT * FROM '+TEST_TABLE,
 function selectCb(err, results, fields) {
 if (err) {
 throw err;
 }

 if(results)
 {
 for(var i = 0; i < results.length; i++)
 {
 console.log("%d\t%s\t%s", results[i].id, results[i].name, results[i].age);
 }
 }
 sql_client.end();
 }
 );*/

sql_client.insertSql = function(tableName,args){
    var val = "";
    for (var i= 1 ;i<arguments.length;i++){
        val += "\'";
        val+=arguments[i]
        val +="\'";
        if(i!=arguments.length-1){
            val +=',';
        }
    }

    // var val = "\'"+u+"\',\'"+p+"\',\'"+c+"\',\'"+l+"\'";
    var sql_commond = "INSERT INTO "+tableName+" VALUES ("+val+")";
  //  console.log('-sql_commond--->>',sql_commond)
    sql_client.query(
        //"INSERT INTO 'user' ('user', 'psw', 'create_date', 'last_login_date') VALUES ("+val+")"
        // "INSERT INTO 'user' values('user','ww3','2017-11-11','2017-11-12');"
        sql_commond

    );
    // sql_client.end();
}

module.exports  = sql_client;