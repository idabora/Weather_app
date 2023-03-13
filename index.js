const http = require('http');
const fs = require('fs');
const requests = require('requests');

const PORT = process.env.PORT || '8000';
const hostname = '127.0.0.1';


const homefile = fs.readFileSync('home.html', 'utf-8');

const server = http.createServer((req, res) => {

    if (req.url == '/') {

        requests('https://api.openweathermap.org/data/2.5/weather?q=bareilly&appid=bbb1c00d842f9697b40ae9cca943a763')
            .on('data', (chunk) => {
                let dataobj = JSON.parse(chunk);
                // console.log(dataobj);
                let data = [dataobj];
                // console.log(data[0].main.temp);
                const replaceval = (tempoval, origval) => {

                    var temprature = tempoval.replace("{%temprature%}", Math.round(origval.main.temp-273));
                    temprature = temprature.replace("{%tempmin%}", Math.floor(origval.main.temp_min)-273);
                    temprature = temprature.replace("{%tempmax%}", Math.ceil(origval.main.temp_max)-273);
                    temprature = temprature.replace("{%country%}", origval.sys.country);
                    temprature = temprature.replace("{%location%}", origval.name);
                    temprature = temprature.replace("{%tempstatus%}", origval.weather[0].main);

                    // console.log(temprature);
                    return temprature;

                }

                const realtimedata = data.map((val) =>
                    replaceval(homefile, val)
                    // console.log(val.main);
                ).join("");
                res.write(realtimedata);

                // realtimedata();
            })
            .on('end', (err) => {

                if (err) {
                    return console.log("connection lost due to some Problem");
                }
                console.log("end");
                // res.end();
            })
    }


});


server.listen(PORT, hostname, () => {
    console.log(`Server Listening at port http://${hostname}:${PORT}`)
})



