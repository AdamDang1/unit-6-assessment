const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const {bots, playerRecord} = require('./data');
const {shuffleArray} = require('./utils');
// const port = process.env.PORT || process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'e32088b13d6c41eba7cb9e62096969fc',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

// app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    rollbar.info('HTML served successfully');
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/styles', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.css'));
});

app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.js'));
});

app.get('/api/robots', (req, res) => {
    try {
        rollbar.info('Someone successfully loaded all the robots')
        res.status(200).send(bots)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        rollbar.error('Unable to load all the robots');
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        rollbar.log('Random bots compiled')
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        rollbar.error('Unable to load random bots')
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            rollbar.log('You lost!')
            res.status(200).send('You lost!')
        } else {
            playerRecord.wins++
            rollbar.log('You won!')
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        rollbar.error('ERROR DUELING');
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

app.use(rollbar.errorHandler());

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})