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

//check if isRead
// get/receive the json data, do dialog box to force create fortune, app.put("/api/fortunes/:id/read" -- need to call this to update to isRead in routes

function createFortune() {
    //dialog box for text input
    axios.post('https://slack.com/api/dialog.open')
    bot.on('message', async data => {
        if (data.type !== 'message') {
            return
        }
        //grab the text minus the @fortunecookie and store the fortune into the route/ database
        else if (data.type === 'message' && data.username !== 'FortuneCookie') {
            var str = data.text
            str = str.substring(str.indexOf(">") + 1)
            console.log(str)

            await axios.post('https://fortune-cookie-bot.herokuapp.com/api/fortunes/', {
                text: str,
                isRead: true
            }).then(response => {
                showFortune()
                console.log(response)
            }).catch(function (error) {
                console.log(error);
            })
        }
    })
}

//use slash command create to open a dialog box
// function createFortune() {
//     //dialog box for text input
//     //need to grab user.name from database of names.
//     var params = {
//         icon_emoji: ":fortune_cookie:"
//     }
//     bot.postMessageToUser('sandynism', 'Reply with your fortune of choice.', params);
//     //grab the text minus the @fortunecookie and store the fortune into the route/ database
//     bot.on('message', async data => {
//         if (data.type !== 'message') {
//             return
//         }
//         else if (data.type === 'message' && data.username !== 'FortuneCookie') {
//             var str = data.text
//             str = str.substring(str.indexOf(">") + 1)
//             console.log(str)

//             await axios.post('https://fortune-cookie-bot.herokuapp.com/api/fortunes/', {
//                 text: str,
//                 isRead: true
//             }).then(response => {
//                     showFortune()
//                     console.log(response)
//                 }).catch(function (error) {
//                     console.log(error);
//                 })
//         }
//     })
// }


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

// {
//     "text": "Would you like to create a fortune?",
//     "attachments": [
//         {
//             "text": "Please make a selection.",
//             "fallback": "Please select yes or no.",
//             "callback_id": "wopr_game",
//             "color": "#3AA3E3",
//             "attachment_type": "default",
//             "actions": [
//                 {
//                     "name": "create",
//                     "text": "Create Fortune",
//                     "type": "button",
//                     "value": "post"
//                 },
//                 {
//                     "name": "read",
//                     "text": "View Fortune",
//                     "type": "button",
//                     "value": "get"
//                 },
//                 {
//                     "name": "help",
//                     "text": "Help!",
//                     "style": "danger",
//                     "type": "button",
// 					"url": "https://fortune-cookie-bot.herokuapp.com/",
//                     "value": "link"
// 				}]
//      }]
// }
