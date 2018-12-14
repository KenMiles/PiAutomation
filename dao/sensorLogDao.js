const config = require("../config.js");
const onShutdown = require('../onShutdown.js');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(config.db_path, (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  else {
    console.log('Connected to the in-memory SQlite database.');
  }
});

onShutdown(() => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}, "Sensor Log Database");

//insert into sensor_log(time, sensor, tempx10, humidityx10) values(strftime('%s','now'), 'test', 200, 560);
//select  datetime(time,'unixepoch'), sensor, tempx10 / 10.0, humidityx10/10.0 from sensor_log;

function recordSensorData(sensor, temp, humidity) {
  db.run(`INSERT INTO sensor_log(time, sensor, tempx10, humidityx10) values(strftime('%s','now'),?,?,?)`, [sensor, Math.round(temp * 10), Math.round(humidity * 10)], function (err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
}

function recordSwitchStatus(name, status) {
  db.run(`INSERT INTO switch_log(time, switch, status) values(strftime('%s','now'),?,?)`, [name, status?1:0], function (err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
}

function Dao() {
  return {
    RecordSensor: recordSensorData,
    RecordSwitchStatus: recordSwitchStatus
  };
}

module.exports = Dao();
