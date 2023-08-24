const { WebClient } = require('@slack/web-api');


// Read a token from the environment variables
const token = process.env.AWAISH_TOKEN;

// Initialize
const client = new WebClient(token);

const slackMembers = {
    "aaron@tutorly.com" : "U02695VFE72",
    "aeffia@tutorly.com" : "U01PEGST75G",
    "amelya@tutorly.com" : "U02JW127J49",
    "antonia@tutorly.com" : "U050W1526SC",
    "awaish@tutorly.com" : "U02S69ZB9NG",
    "cameron@tutorly.com" : "U03L8QXLUTE",
    "charlie@tutorly.com" : "U05ALJ3J7E2",
    "craig@tutorly.com" : "U03L8QX1WUC",
    "darshan@tutorly.com" : "U044Q1KM815",
    "deepak@tutorly.com" : "U02NYFCHE0J",
    "dennis@tutorly.com" : "U03SSC9HN5Q",
    "dhruva@tutorly.com" : "U023AHSA27P",
    "ej@tutorly.com" : "U040SAZ7C1Z",
    "eleni@tutorly.com" : "U04V5PZ1G8P",
    "frank@tutorly.com" : "U0267LVUQAE",
    "hannah@tutorly.com" : "U05A4ES0VSN",
    "hiba@tutorly.com" : "U01HPQJBS7L",
    "jacqueline@tutorly.com" : "U04B5P02Z1S",
    "jake@tutorly.com" : "U03M042SFEU",
    "jarett@tutorly.com" : "U03L43L0B61",
    "kaitlyn@tutorly.com" : "U04B36CEKH9",
    "kate@tutorly.com" : "U05AH3WNAEM",
    "krystal@tutorly.com" : "U03L8QX5G04",
    "ky@tutorly.com" : "U026AB43WHW",
    "laine@tutorly.com" : "U042L4KGRBR",
    "lydia@tutorly.com" : "U01QFQ95VG8",
    "mahrosh@tutorly.com" : "U03LK378HDF",
    "marcus@tutorly.com" : "U05D06Y3R3J",
    "mark@tutorly.com" : "U025E2KU85R",
    "meredith@tutorly.com" : "U03L3FGL2TX",
    "mira@tutorly.com" : "U049CKENHJN",
    "narinder@tutorly.com" : "U01HVVD4FEY",
    "nathan@tutorly.com" : "U0430M3RWD8",
    "nell@tutorly.com" : "U042L4KJN07",
    "nikhita@tutorly.com" : "U04AJKL2UNQ",
    "noreen@tutorly.com" : "U05AH3WR0L9",
    "oleksiy@tutorly.com" : "U059PU82LHM",
    "razaaq@tutorly.com" : "U04NA0SC90W",
    "richa@tutorly.com" : "U038ZC22NCV",
    "rose@tutorly.com" : "U057MKTGVQW",
    "ryan@tutorly.com" : "U025D46TVNF",
    "shaan@tutorly.com" : "U05A4AYUY75",
    "shannon@tutorly.com" : "U02B4QK8MBK",
    "shanpeartree@tutorly.com" : "U0332BS36Q3",
    "sharon@tutorly.com" : "U02NAGX0JQY",
    "sivagami@tutorly.com" : "U01HVVD43KN",
    "sivani@tutorly.com" : "U01F5CZ437B",
    "sravan@tutorly.com" : "U01J2DPS8F3",
    "susan@tutorly.com" : "U042L4KMEUF",
    "tejas@tutorly.com" : "U03L43L44AZ",
    "vikram@tutorly.com" : "U01F5C5VBLH",
    "william@tutorly.com" : "U04B09J55PT",
    "zibaa@tutorly.com" : "U043DA4PLTT"
}

const slackIds = { }

const usersAndReads = {  }

const slackTokens = {
    U02S69ZB9NG: process.env.AWAISH_TOKEN,
    U05A4ES0VSN: process.env.HANNAH_TOKEN,
    U057MKTGVQW: process.env.ROSE_TOKEN
}

function getNotificationFromData(userId){
    if(!userId){
        return false
    }

    const channelData = usersAndReads[userId]

    if(!channelData){
        return false
    }

    const channelKeys = Object.keys(channelData)

    for(let i = 0; i < channelKeys.length; i++){
        if(channelData[channelKeys[i]].lastRead < channelData[channelKeys[i]].latestMessage){
            return true
        }
    }
    return false
}

function getNotification(req, res){
    const email = req.params.email.toLowerCase()
    const userId = slackMembers[email]

    res.json({ notify: getNotificationFromData(userId) })

}

function checkNotification(eventData){
    
    if(usersAndReads[eventData.event.user] && usersAndReads[eventData.event.user][eventData.event.channel] && usersAndReads[eventData.event.user][eventData.event.channel].latestMessage === eventData.event.ts){
        return false
    }
    return true
}
  
async function updateUsersAndReads(eventData){
    try{
        if(eventData.event){
            if(!slackTokens[eventData.event.user]){
                return
            }
            
            if(usersAndReads[eventData.event.user] && usersAndReads[eventData.event.user][eventData.event.channel] && usersAndReads[eventData.event.user][eventData.event.channel].latestMessage === eventData.event.ts){
                return
            }
            const client = new WebClient(slackTokens[eventData.event.user]);
            const mem = await client.conversations.members({channel: eventData.event.channel})
            const members = mem.members
            
            for(let i = 0; i < members.length; i++){
                if(!slackTokens[members[i]]){
                    continue
                }
                const client = new WebClient(slackTokens[members[i]]);
                const con = await client.conversations.info({channel: eventData.event.channel})

                if(!con.channel.is_member){
                    continue
                }

            

                const his = await client.conversations.history({channel: eventData.event.channel, limit: 1})

        
                if(his.messages && his.messages.length){
                    const channel = eventData.event.channel
                    if(!usersAndReads.hasOwnProperty(members[i])){
                        usersAndReads[members[i]] = { }
                        usersAndReads[members[i]][channel] = { lastRead: con.channel.last_read, latestMessage: his.messages[0].ts }
                    }
                    else{
                        usersAndReads[members[i]][channel] = { lastRead: con.channel.last_read, latestMessage: his.messages[0].ts }
                    }
                }
            }
            
        }
            
    }
    catch(e){
        console.log("Notification error");
    }
}

  

async function initializeSlackIds(){
    const result = await client.users.list()
    const members = result.members
    let user = null
    for(let i = 0; i < members.length; i++){
        if(members[i].id && members[i].real_name){
            slackIds[members[i].id] = members[i].real_name
            usersAndReads[members[i].id] = { }
        }
    }
}

function getUserName(id){
    return slackIds[id]
}

async function populateConversationStore() {
    try {
      // Call the conversations.list method using the WebClient
    //   const result = await client.conversations.list({types: "public_channel, private_channel, mpim, im", limit: 999});
    //     // C04JF7ZPP7H
    //   const channels = result.channels
    //     // console.log(result.response_metadata);
    //     // console.log(result.channels.length);
    //   for(let i = 0; i < channels.length; i++){
       
    //     const con = await client.conversations.info({channel: channels[i].id})

    //     const result = await client.conversations.history({
    //         channel: channels[i].id,
    //         limit: 1
    //     });

    //     if(con.channel.is_member && result.messages && result.messages.length){
    //         usersAndReads["U02S69ZB9NG"].push([channels[i].id, con.channel.last_read < result.messages[0].ts])
    //         console.log(channels[i].id, con.channel.last_read < result.messages[0].ts);
    //     }
    //     else{
    //         console.log("False");
    //     }
    //   }

    //   console.log(usersAndReads);



    //   console.log("search over", result.response_metadata.next_cursor);

    // const channelInfoResponse = await client.conversations.info({
    //     channel: "C03L9U5GT51"
    // });

    // console.log(channelInfoResponse.channel.last_read, new Date(channelInfoResponse.channel.last_read * 1000).toLocaleDateString(), new Date(channelInfoResponse.channel.last_read * 1000).toLocaleTimeString());

    // console.log(result);

    const result = await client.conversations.history({
        channel: "C02S4NANDV1",
        limit: 1
      });

      console.log(result.messages[0].files);

    // const res = await client.users.list()
    // const members = res.members
    // let user = null
    // for(let i = 0; i < members.length; i++){
    //     if(members[i].id && members[i].real_name){
    //         slackIds[members[i].id] = members[i].real_name
    //     }
    // }

    

    //   const messages = result.messages

    //   for(let i = 0; i < messages.length; i++){
    //     messages[i].username = slackIds[messages[i].user]
    //   }

      

      //console.log(result);

    //   const messages = result.messages

    //   for(let i = 0; i < messages.length; i++){
    //     console.log(messages[i].text);
    //     console.log("-------------------------------------------");
    //   }


    //   console.log(result);

    

    // const con = await client.users.conversations({user: user.id, types: "public_channel, private_channel, mpim, im", limit: 999})
    
    // console.log(con.channels.length);
    // const channels = con.channels
    // for(let i = 0; i < channels.length; i++){
    //     if(channels[i].name.toLowerCase().includes("sales")){
    //         console.log(channels[i]);
    //     }
    // }

    
    }
    catch (error) {
      console.error(error);
    }
}

function handleSlackMessage(req, res){
    //outer_socket.emit()

    
    //console.log(req.body);
   // res.status(200).send(req.body.challenge)
}

async function postMessage(channel, userName, text, showThread, ts){

    if(showThread){
        const result = await client.chat.postMessage({
            channel: channel,
            text: text,
            username: userName,
            thread_ts: ts
        });
    }
    else{
        const result = await client.chat.postMessage({
            channel: channel,
            text: text,
            username: userName,
        });
    }
    
}

async function getChat(req, res){

    const channel = req.params.channel
    const email = req.headers.email

    const userId = slackMembers[email]

    const lastRead = (usersAndReads[slackMembers[email]] && usersAndReads[slackMembers[email]][channel]) ? usersAndReads[slackMembers[email]][channel].lastRead : null 

    
    
    const result = await client.conversations.history({
        channel: channel,
        limit: 10
    });

    const con = await client.conversations.info({channel: channel})

    const messages = result.messages
    const chat = []

    let unreadMessages = 0;
    for(let i = 0; i < messages.length; i++){
        if(lastRead && lastRead < messages[i].ts){
            unreadMessages++
        }
        chat.push({
            user: messages[i].user,
            username: messages[i].username ? messages[i].username :  slackIds[messages[i].user],
            text: messages[i].text,
            ts: messages[i].ts,
            replyCount: messages[i].reply_count ? messages[i].reply_count : 0,
            read: con.channel.is_member && usersAndReads[userId] && usersAndReads[userId][channel] && usersAndReads[userId][channel].lastRead && usersAndReads[userId][channel].lastRead < messages[i].ts,
            files: messages[i].files
        })
    }

    res.json({status: 200, chat, unreadMessages})

    markMessageAsRead(userId, channel, email)
    
}

function markMessageAsReadSocket(email, channel){
    markMessageAsRead(slackMembers[email], channel, email)
}

async function markMessageAsRead(userId, channel, email){
    if(userId && usersAndReads[userId] && usersAndReads[userId][channel]){
        usersAndReads[userId][channel].lastRead = usersAndReads[userId][channel].latestMessage
        if(slackTokens[slackMembers[email]]){
            const client = new WebClient(slackTokens[slackMembers[email]])
            const res = await client.conversations.mark({channel: channel, ts: usersAndReads[userId][channel].latestMessage})
        }
    
    }
}

async function getReplies(req, res){
    const { channel, ts } = req.params
    const response = await client.conversations.replies({channel: channel, ts: ts})

    const messages = response.messages
    const chat = []

    for(let i = 0; i < messages.length; i++){
        chat.push({
            user: messages[i].user,
            username: messages[i].username ? messages[i].username :  slackIds[messages[i].user],
            text: messages[i].text,
            ts: messages[i].ts
        })
    }

    res.json({status: 200, chat})

}

async function getChannels(req, res){

    const email = req.params.email

    try{
        const response = await client.users.conversations({user: slackMembers[email], types: "public_channel, private_channel, mpim, im", limit: 999})

        const channels = response.channels

        const channelsList = []

        for(let i = 0; i < channels.length; i++){
            if(channels[i].id && channels[i].name){
                channelsList.push({
                    id: channels[i].id,
                    name: channels[i].name,
                    private: channels[i].is_private,
                    read: (usersAndReads[slackMembers[email]] && usersAndReads[slackMembers[email]][channels[i].id]) ? usersAndReads[slackMembers[email]][channels[i].id].lastRead < usersAndReads[slackMembers[email]][channels[i].id].latestMessage : false
                })
            }
            
        }

        res.json({status: 200, channelsList, userId: slackMembers[email], userName: slackIds[slackMembers[email]]})
    }
    catch(e){
        res.json({status: 404})
    }

    
}

module.exports = { populateConversationStore, handleSlackMessage, getChannels, initializeSlackIds, getChat, getReplies, postMessage, getUserName, updateUsersAndReads, getNotification, checkNotification, markMessageAsReadSocket }