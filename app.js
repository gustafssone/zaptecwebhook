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


// get all todos
app.get('/external/id', (req, res) => {

    
    const sessionid = uuidv4()

    if(charge == 1) {

        console.log('sending session id ' + sessionid)

        res.status(200).send({
            success: 'true',
            session: sessionid,
            status: charge
        })
    } else {
        
        res.status(401).send({
            success: 'false',
            status: charge
        })
    }
});

// get all todos
app.get('/internal/on', (req, res) => {
    charge="1";
    res.status(200).send({
        success: 'true',
        status: charge
    })
  });

// get all todos
app.get('/internal/off', (req, res) => {
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