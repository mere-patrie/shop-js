const express = require('express')
var os = require('os-utils');
var mysql = require('mysql');
var cors = require('cors');
const app = express()
app.use(cors());


// MySql
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shop"
});
con.connect();

app.get('/product-infos/:query', (req, res) => {
    var sql = req.params.query;
    con.query(sql, function (err, result) {
        res.status(200).send(result);
    });
})

app.get('/usage', (req, res) => {
    var os = require("os");
    function cpuAverage() {
        var totalIdle = 0, totalTick = 0;
        var cpus = os.cpus();
        for (var i = 0, len = cpus.length; i < len; i++) {
            var cpu = cpus[i];
            for (type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        }
        return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
    }
    var startMeasure = cpuAverage();
    setTimeout(function () {
        var endMeasure = cpuAverage();
        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;
        var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
        res.json([percentageCPU,(os.totalmem()/1000000000), (os.freemem()/1000000000)])
    }, 100);
})

app.listen(8080, () => {
    console.log("Listening on http://localhost:8000")
})

