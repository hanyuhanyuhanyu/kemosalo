const exec = require('child_process').exec
process.env.KEMOSALO_TEST = 'TESTING'
const date = new Date(Date.now() + 1000*60*60*9)
const outputfile_name = `endurance_${date.getYear()}_${date.getMonth()+1}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_tester_log`
const outputfile_name = `endurance_${date.getYear()}_${date.getMonth()+1}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_server_log`
exec('node ../bin/www') 
delete process.env.KEMOSALO_TEST
