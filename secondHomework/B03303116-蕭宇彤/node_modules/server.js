var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var ObjectID = require('mongodb').ObjectID;

// 利用 mongodb 的 driver 宣告一個 MongoClient
var MongoClient = require('mongodb').MongoClient;

// 宣告要連接的主機位置
var uri = 'mongodb://140.112.28.194/b03303116';

// 設定 port 預設為 1337，若系統環境有設定則以系統環境設定為主
var port = process.env.PORT || 1337;

var server = http.createServer(function(req, res) {

    // 解析使用者要求的路徑名稱
    let urlData = url.parse(req.url);

    let action = urlData.pathname;

    console.log(action);
    console.log('method:' + req.method);
    let actionlist = action.split('/');
    console.log(actionlist);

    if (/query/i.test(actionlist[1])) {

        var productList = [];
        //建立mongodb連線連入設定位址之資料庫
        //查詢資料
        MongoClient.connect(uri, function(err, db) {
            var collection = db.collection('product');
            //使用product collection進行操作
            collection.find().toArray(function(err, docs) {
                //將找到的資料轉為陣列後傳給productList
                productList = docs;
                //關閉資料庫連線
                db.close();
                //資料處理完畢後，開始撰寫回傳值
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' //允許跨頁面js連線
                });
                res.write(JSON.stringify(productList)); //將找到的資料轉為JSON格式，並寫入回傳值中
                res.end();
            });
        });
        // var productList = [{
        //         "id": "001",
        //         "name": "米家掃地機器人",
        //         "price": 8895,
        //         "count": 1,
        //         "state": true
        //     },
        //     {
        //         "id": "002",
        //         "name": "小米體重計",
        //         "price": 665,
        //         "count": 1,
        //         "state": true
        //     },
        //     {
        //         "id": "003",
        //         "name": "小米手環2",
        //         "price": 865,
        //         "count": 1,
        //         "state": true
        //     }
        // ]

        // 這裡執行資料查詢的動作 (請自行完成)
        // TODO: db.product.find(id) 

        // res.writeHead(200, {
        //     'Content-Type': 'application/json',
        //     'Access-Control-Allow-Origin': '*'
        // });
        // res.write(JSON.stringify(productList));
        // res.end();
    } else if (/delete/i.test(actionlist[1])) {
        var id = actionlist[2];

        console.log(id);
        MongoClient.connect(uri, function(err, db) {
            var collection = db.collection('product');

            var newid = new ObjectID(id);
            collection.deleteMany({ _id: newid });
            db.close();
        })

        // 這裡執行刪除資料的動作 (請自行完成)
        // TODO: db.product.delete(id) 


        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
        });
        res.write("OK!!");
        res.end();

    } else if (/insert/i.test(actionlist[1]) && /post/i.test(req.method)) {


        // 取得 post 資料
        var data = "";
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            console.log('post data: ' + data);

            // 將 post 資料格式轉成 json
            var product = qs.parse(data);

            MongoClient.connect(uri, function(err, db) {

                var collection = db.collection('product');
                collection.insertOne({
                    'name': product.name,
                    'price': product.price,
                    'count': product.count
                });

                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write("OK!");
                res.end();
            });
        });
        // 這裡執行插入資料的動作 (請自行完成)
        // TODO: db.product.insert(product) 

    } else if (/update/i.test(actionlist[1]) && /post/i.test(req.method)) {
        // 取得 post 資料
        var data = "";
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            console.log('post data: ' + data);

            // 將 post 資料格式轉成 json
            var product = qs.parse(data);

            // 這裡執行更新資料的動作 (請自行完成)
            // TODO: db.product.update(product) 

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.write(JSON.stringify(product));
            res.end();

        })

    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Server 正常<h1>');
        res.end();
    }

});

// 啟動並等待連接
server.listen(port);
console.log('Server running at http://127.0.0.1:' + port);