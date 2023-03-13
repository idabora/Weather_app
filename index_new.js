const express=require("express");
const app=express();
const fs=require('fs');
const https=require('https');
const bodyparser=require('body-parser');


app.set('view engine','hbs');



const PORT=process.env.PORT||'8000';
const hostname='127.0.0.1';

const homefile=fs.readFileSync('./views/home.hbs','utf-8');
app.use(bodyparser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    // res.sendFile(__dirname+"/home2.html");
    res.render("home2");
});

app.post('/home',(req,resp)=>{
    // const apikey='bbb1c00d842f9697b40ae9cca943a763';
    const city=req.body.cityname;
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bbb1c00d842f9697b40ae9cca943a763`;

    https.get(url,(res)=>{
        res.on('data',(chunk)=>{
            let dataobj=JSON.parse(chunk);
            let data=[dataobj];

            const replaceval = (tempoval, origval) => {

                var temprature = tempoval.replace("{%temprature%}", Math.round(origval.main.temp)-273);
                temprature = temprature.replace("{%tempmin%}", Math.floor(origval.main.temp_min)-273);
                temprature = temprature.replace("{%tempmax%}", Math.ceil(origval.main.temp_max)-273);
                temprature = temprature.replace("{%country%}", origval.sys.country);
                temprature = temprature.replace("{%location%}", origval.name);
                temprature = temprature.replace("{%tempstatus%}", origval.weather[0].main);

                // console.log(temprature);
                return temprature;

            }
            const realtimedata=data.map((val)=>
                replaceval(homefile,val)
            ).join("");
            // console.log(realtimedata);
            resp.write(realtimedata);
resp.end();
        })
        .on('end',(err)=>{
            if(err) return console.log('Connection lost due to some problem.');
            console.log("end");
            resp.end();
        })
    })

})


app.listen(PORT,hostname,()=>{
    console.log(`server listening at http://${hostname}:${PORT}`);
})


