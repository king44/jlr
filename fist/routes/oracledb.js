/**
 * Created by Administrator on 2016/10/14.
 */
router.get('/', function (req, res, next) {

    var oracledb = require('oracledb');
    oracledb.getConnection(
        {
            user: 'system',
            password: 'jlr',
            connectString: 'localhost:1521/xe'
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.execute(
                "SELECT * from CMS_FIlE where content_id=:id",
                [1072],  // bind value for :id
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    res.render('index', {title: '查询信息：' + JSON.stringify(result.rows)});
                });
        });

});