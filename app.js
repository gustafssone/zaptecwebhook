import express from 'express';
// Set up the express app
const app = express();

global.charge = "0";

const uuidv4 = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


// EXTERNAL
app.get('/external/' + process.env.EXTID + '/start', (req, res) => {

    
    const sessionid = uuidv4()

    if(charge == 1) {

        console.log('sending GET session id ' + sessionid)

        res.status(200).send({
            sessionId: sessionid
        })
    } else {
        
        res.status(401).send({
            success: 'false',
            status: charge
        })
    }
});

app.post('/external/' + process.env.EXTID + '/start', (req, res) => {

    
    const sessionid = uuidv4()

    if(charge == 1) {

        console.log('sending POST session id ' + sessionid)

        res.status(200).send({
            sessionId: sessionid
        })
    } else {
        
        res.status(401).send({
            success: 'false',
            status: charge
        })
    }
});


app.post('/external/' + process.env.EXTID + '/end', (req, res) => {

    console.log(req);

})

// INTERNAL
app.get('/internal/' + process.env.INTID + '/on', (req, res) => {
    charge="1";
    res.status(200).send({
        success: 'true',
        status: charge
    })
  });

  
app.get('/internal/' + process.env.INTID + '/off', (req, res) => {
    charge="0";
    res.status(200).send({
        success: 'true',
        status: charge
    })
  });
  

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});