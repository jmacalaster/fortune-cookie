var Slackbot = require("slackbots")
var axios = require("axios")

var bot = new Slackbot({
    token: process.env.BOT_ACCESS_TOKEN,
    name: 'FortuneCookie'
})

//The bot will send a message when it is actively online. 
// Consider moving the postmessage to when it receives a call for attention?
// Prevent storing user names multiple times.
bot.on('start', async function () {
    // Store list of usernames into heroku json
    // var users = await bot.getUsers()
    // // console.log(users)
    // users.members.map(user => {
    //     console.log(user.name, user.real_name)
    // })
    console.log('online now')
})

bot.on('error', err => console.log(err))

bot.on('message', data => {
    if (data.type !== 'message') {
        return
    }
    // console.log(data)
    handleMessage(data.text)
})

function handleMessage(message) {
    if (message.includes(' create')) {
        createFortune()
    } else if (message.includes(' show fortune')) {
        showFortune()
    } else if (message.includes(' help!')) {
        runHelp()
    }
}

module.exports = bot;
