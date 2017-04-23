var cp = require("child_process"),
    cors = require('cors'),
    express = require("express"),
    app = express(),
    tickEventStream = 1000,
    interval = null;

app.use(express.static(__dirname + '/public'));
app.use(cors());

app.get('/test', (req, res) => { 
    res.send({ status: 'OK' }); 
});

app.get('/stop-stream', (req, res) => {
    clearInterval(interval);
    res.send({ status:'stopped', timestamp:new Date() });
}); 

app.get('/http-stream', (req, res) => {
    // Handler for client-side disconnect 
    req.on('close', () => { 
        console.log('Client disconnected from the stream!'); 
        clearInterval(interval);
        res.end();
    });

    // Send these headers
    res.writeHead(200, { 
        'Content-Type': 'text/event-stream',
        'Cache-control': 'no-cache',
        'Connection': 'keep-alive' 
    });

    // Send numIterations of chunk data in stream way (only one request made)
    interval = setInterval(() => {
        res.write(JSON.stringify({
            sensors: {
                light: getRandomInt(0, 1000),
                temperature: getRandomInt(17, 24),
                gas: (getRandomInt(0, 1) ? true : false)
            },
            dataTimestamp: new Date()
        }));
    }, tickEventStream);
    //res.end('last-chunk');
});

getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.listen(3000);