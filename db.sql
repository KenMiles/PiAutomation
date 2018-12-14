CREATE TABLE sensor_log (
time integer,
sensor text,
tempX10 integer,
humidityX10 integer
);

create index sensor_log_idx on sensor_log(time, sensor);

CREATE TABLE switch_log (
time integer,
switch text,
status integer
);

create index switch_log_idx on switch_log(time, switch);
