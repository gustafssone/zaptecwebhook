import express from 'express';
// Set up the express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

global.charge = "0";

const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//just for verification, should not be exposed publicly
app.get('/', (req, res) => {
    
    const sessionid = uuidv4()

    console.log('start page, sending GET session id ' + sessionid + ' for ' + parseIp(req) + ', status 200')

    res.status(200).send({
        success: 'true',
        ip: parseIp(req),
        session: sessionid
    })
});

// EXTERNAL
//GET is mostly for identifying that everything is alright in browser, should be same code as POST
app.get('/external/' + process.env.EXTID + '/start', (req, res) => {

    const sessionid = uuidv4()

    if(charge == 1) {

        console.log('sending GET session id ' + sessionid + ' for ' + parseIp(req) + ', status 200')

        res.status(200).send({
            sessionId: sessionid
        })
    } else {
        
        console.log('denied GET session id ' + sessionid + ' for ' + parseIp(req) + ', status 401')
        
        res.status(401).send({
            success: 'false',
            status: charge
        })
    }
});

//zaptec will use this one actually
app.post('/external/' + process.env.EXTID + '/start', (req, res) => {

    const sessionid = uuidv4()

    if(charge == 1) {

        console.log('sending POST session id ' + sessionid + ' for ' + parseIp(req) + ', status 200')

        res.status(200).send({
            sessionId: sessionid
        })
    } else {
        
        console.log('denied POST session id ' + sessionid + ' for ' + parseIp(req) + ', status 401')

        res.status(401).send({
            success: 'false',
            status: charge
        })
    }
});


app.post('/external/' + process.env.EXTID + '/end', (req, res) => {

    //Note: session ends when vehicle is disconnected, not when it was fully charged. The
    //reason for this is that after a charge is initially completed, the car may at any point
    //request more power, e.g. for cabin or battery heating.
    console.log('Receiving status after completed charging and disconnected vehicle');
    console.log(req.body);

    //Might add to turn off charging here...
    res.status(200).send({
        success: 'true'
    })

})

// INTERNAL
app.get('/internal/' + process.env.INTID + '/on', (req, res) => {
    charge="1";

    res.status(200).send({
        success: 'true',
        status: charge
    })
    console.log('Turned on charging from ' + parseIp(req))
  });


app.get('/internal/' + process.env.INTID + '/off', (req, res) => {

    charge="0";

    res.status(200).send({
        success: 'true',
        status: charge
    })
    console.log('Turned off charging from ' + parseIp(req))
  });
  


app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});