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

bot.sendMessage = function(username, message) {
    bot.postMessageToUser(username, message);
}

function handleMessage(message) {
    if (message.includes(' create')) {
        createFortune()
    } else if (message.includes(' show fortune')) {
        showFortune()
    } else if (message.includes(' help!')) {
        runHelp()
    }
}

function showFortune() {
    axios.get('https://fortune-cookie-bot.herokuapp.com/api/fortunes/')
        .then(response => {
            var fortunes = []
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].isRead === false) {
                    fortunes.push(response.data[i].text)
                }
            }
            var fortune = fortunes[Math.floor(Math.random() * fortunes.length)]
            // return fortune
            var params = {
                icon_emoji: ":fortune_cookie:"
            }
            bot.postMessageToUser('sandynism', fortune, params)
        }).catch(error => {
            console.log(error)
        })
}
//need to get this to update isRead to true


function runHelp() {
    var params = {
        icon_emoji: ":question:"
    }
    bot.postMessageToChannel('fortunecookie', 'link to heroku app', params)
    bot.postMessageToUser('some-username', 'link to heroku app', params);
    bot.postMessageToGroup('some-private-group', 'link to heroku app', params);
}

module.exports = bot;
