var Slackbot = require("slackbots")

var bot = new Slackbot({
    token: process.env.BOT_ACCESS_TOKEN,
    name: 'FortuneCookie'
})

//The bot will send a message when it is actively online. 
// Consider moving the postmessage to when it receives a call for attention?
// Prevent storing user names multiple times.
bot.on('start', async function () {
    var params = {
        icon_emoji: ":fortune_cookie:"
    }
    // Store list of usernames into heroku json
    var users = await bot.getUsers()
    // console.log(users)
    // users.members.map(user => {
    //     console.log(user.name, user.real_name)
    // bot.postMessageToUser('sandynism', `Hi there! Please visit our herokuapp to learn how to use FortuneCookie.`, params)
})
// })

bot.on('error', err => console.log(err))

bot.on('message', data => {
    if (data.type !== 'message') {
        return
    }
    console.log(data)
    handleMessage(data.text)
})

function handleMessage(message) {
    if (message.includes(' create a fortune')) {
        createFortune()
    } else if (message.includes(' show me the money')) {
        showFortune()
    } else if (message.includes(' help!')) {
        runHelp()
    }
}

function createFortune() {
    //dialog box for text input
    //need to grab user.name from database of names.
    var params = {
        icon_emoji: ":fortune_cookie:"
    }
    bot.postMessageToUser('sandynism', 'Reply with your fortune of choice.', params);
    //grab the text minus the @fortunecookie and store the fortune into database
    bot.on('message', data => {
        if (data.type !== 'message') {
            return
        }
        else if (data.type === 'message' && data.username !== 'FortuneCookie') {
            var str = data.text
            str = str.substring(str.indexOf(">") + 1)
            //error handle for blank spacing too.
            console.log(str)

        }
        //store the string into fortunes database.
    })

}

// function makeFortune() {
//     bot.dialog.open
// }

function showFortune() {
    console.log('$$$$$$')
    //connect to database and grab a random fortune to send to user that requests it.
    //how do we limit to one fortune a day per user?
}

function runHelp() {
    var params = {
        icon_emoji: ":question:"
    }
    bot.postMessageToChannel('fortunecookie', 'link to heroku app', params)
    bot.postMessageToUser('some-username', 'link to heroku app', params);
    bot.postMessageToGroup('some-private-group', 'link to heroku app', params);
}

module.exports = bot;