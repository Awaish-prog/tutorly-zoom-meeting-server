const { WebClient } = require('@slack/web-api');
require('dotenv').config()
const fs = require('fs').promises;


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

const slackIds = {
    USLACKBOT: 'Slackbot',
    U01ESV45GUT: 'Lauren Kay',
    U01EV1K2Z27: 'Google Drive',
    U01F5C5VBLH: 'Vikram Akula',
    U01F5CZ437B: 'Sivani Shankar',
    U01G8TXJ6Q6: 'Asana',
    U01HJ6G8TBL: 'Zapier',
    U01HPQJBS7L: 'Hiba fathima',
    U01HVVD43KN: 'Sivagami Ramanathan',
    U01HVVD4FEY: 'Narinder Kumar',
    U01J2DPS8F3: 'Sravan Chinthaparthi',
    U01JAQ29F8B: 'Zoom',
    U01LR8AHZND: 'Simple Poll',
    U01PEGST75G: 'Aeffia Feuerstein',
    U01SFQUT4PL: 'HubSpot',
    U01SWHAV5SR: 'GrowSurf',
    U023AHSA27P: 'Dhruva Samhith',
    U024EFM0X89: 'Google Calendar',
    U025D46TVNF: 'Ryan Aniceto',
    U025E2KU85R: 'Mark Soliman',
    U0267LVUQAE: 'Frank Serbeniuk',
    U02695VFE72: 'Aaron Galaif',
    U02AJ2H0KLJ: 'JustCall',
    U02B4QK8MBK: 'Shannon Herrera',
    U02JW127J49: 'Amelya Hensley',
    U02NAGX0JQY: 'Sharon Thomas',
    U02NYFCHE0J: 'Deepak Mooda',
    U02S69ZB9NG: 'Awaish Khan',
    U0332BS36Q3: 'Shannon Peartree',
    U03449DDTQU: 'Pooja Bharath',
    U038ZC22NCV: 'Richa Saha',
    U03F3EHS1LH: 'Trello',
    U03G1K75WR1: 'Calendly',
    U03L43L0B61: 'Jarett Bigej',
    U03L43L44AZ: 'Tejas Akula',
    U03L8QX1WUC: 'Craig Zacker',
    U03L8QX5G04: 'Krystal Navarro',
    U03L8QXLUTE: 'Cameron Marchese',
    U03LK378HDF: 'Mahrosh Gealani',
    U03M042SFEU: 'Jake Lansberg',
    U03REEKGL8N: 'Intercom Convert',
    U03SSC9HN5Q: 'Dennis Nolasco',
    U040SAZ7C1Z: 'Elijah J Gaal',
    U04117ENPQU: 'OneDrive and SharePoint',
    U042L4KGRBR: "Laine O'Donnell",
    U042L4KJN07: 'Nell Scherfling',
    U042L4KMEUF: 'Susan Carman',
    U0430M3RWD8: 'Nathan Bussey',
    U043DA4PLTT: 'Zibaa Adil',
    U044Q1KM815: 'Darshan Maheshwari',
    U049CKENHJN: 'Mira',
    U04A1K8AB6F: 'Ky Huynh',
    U04AJKL2UNQ: 'Nikhita Sareen',
    U04B09J55PT: 'William Henderson',
    U04B36CEKH9: 'Kaitlyn Eng',
    U04B5P02Z1S: 'Jacqueline Penn',
    U04NA0SC90W: 'Razaaq Adoti',
    U04V5PZ1G8P: 'Eleni Sklavenitis',
    U050W1526SC: 'Antonia Fariña',
    U057MKTGVQW: 'Rose Zhu',
    U059JQ3TV1R: 'Nicolette Profeta',
    U059PU82LHM: 'Oleksiy Meleshko',
    U05A4AYUY75: 'Shaan',
    U05A4ES0VSN: 'Hannah Go',
    U05AH3WNAEM: 'Kate Ferrick',
    U05AH3WR0L9: 'Noreen Gunnell',
    U05ALJ3J7E2: 'Charlie Fry',
    U05D06Y3R3J: 'Marcus Gutierrez',
    U05M9NXRU1J: 'Tutorly App'
  }
  


const slackTokens = {
    U02S69ZB9NG: process.env.AWAISH_TOKEN,
    U05A4ES0VSN: process.env.HANNAH_TOKEN,
    U057MKTGVQW: process.env.ROSE_TOKEN
}

async function getNotificationFromData(userId){
    if(!userId){
        return false
    }
    const data = await fs.readFile('../tutorly-zoom-meeting-server/UsersAndReads.json', 'utf8');
    const usersAndReads = JSON.parse(data);

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

async function checkNotification(eventData){
    const data = await fs.readFile('../tutorly-zoom-meeting-server/UsersAndReads.json', 'utf8');
    const usersAndReads = JSON.parse(data);

    if(usersAndReads[eventData.event.user] && usersAndReads[eventData.event.user][eventData.event.channel] && usersAndReads[eventData.event.user][eventData.event.channel].latestMessage === eventData.event.ts){
        return false
    }
    return true
}
  
async function updateUsersAndReads(eventData){
    try{
        
        const data = await fs.readFile('../tutorly-zoom-meeting-server/UsersAndReads.json', 'utf8');
        const usersAndReads = JSON.parse(data);

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


                if(!con.channel.is_member && !con.channel.is_im){
                    continue
                }

                
            

                const his = await client.conversations.history({channel: eventData.event.channel, limit: 1})

                console.log(his);

                if(his.messages && his.messages.length){
                    const channel = eventData.event.channel
                    if(!usersAndReads.hasOwnProperty(members[i])){
                        usersAndReads[members[i]] = { }
                        usersAndReads[members[i]][con.channel.is_im ? eventData.event.user : channel] = { lastRead: con.channel.last_read, latestMessage: his.messages[0].ts }
                    }
                    else{
                        usersAndReads[members[i]][con.channel.is_im ? eventData.event.user : channel] = { lastRead: con.channel.last_read, latestMessage: his.messages[0].ts }
                    }
                }
            }

            const updatedData = JSON.stringify(usersAndReads, null, 2);
            await fs.writeFile('../tutorly-zoom-meeting-server/UsersAndReads.json', updatedData);
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
        }
    }
    
    console.log(slackIds);
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

        // const result = await client.conversations.list({
        //     types: "im"
        // });
        
        // const channels = result.channels

        // for(let i = 0; i < channels.length; i++){
        //     if("U01F5CZ437B" === channels[i].user){
        //         const result = await client.conversations.history({
        //             channel: channels[i].id,
        //             limit: 10
        //         });
        //         console.log(result.messages[0].reactions);
        //     }
        // }

        // const messageResponse = await client.chat.postMessage({
        //     channel: "U01HVVD4FEY", // Use the recipient's user ID as the channel
        //     text: "api test", // The text of your message
        // });
        
        // console.log(messageResponse);

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

    // const userMapping = {
    //     'U057MKTGVQW': 'Rose Zhu',
    //     'U05A4ES0VSN': 'Hannah Go', // Add more mappings as needed
    // };

    // const result = await client.conversations.history({
    //     channel: "C02S4NANDV1",
    //     limit: 10
    //   });


    //   const messages = result.messages 

    //   for(let i = 0; i < messages.length; i++){
    //     messages[i].text = messages[i].text.replace(/<@(.*?)>/g, (match, userId) => {
    //         // Check if the userId exists in the mapping
    //         if (userMapping[userId]) {
    //           return userMapping[userId];
    //         } else {
    //           // If the userId is not in the mapping, keep the original mention
    //           return match;
    //         }
    //       });
    //     console.log(messages[i].text);
    //   }
    // const res = await client.users.list()
    // const members = res.members
    
    // for(let i = 0; i < members.length; i++){
    //     if(!members[i].deleted){
    //         console.log(members[i].real_name);
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

    // const response = await client.conversations.replies({channel: "D02S42SU919", ts: "1693217922.298639"})

    // console.log(response);

    // const res = await client.conversations.members({ channel: "D058JTG1ZPH"})
    // console.log(res);

    // const result = await client.chat.postMessage({
    //     channel: "C02S4NANDV1",
    //     text: "api",
    //     username: "Awaish Khan",
    // });

    // console.log(result);

    // https://app.tutorly.com/getReplies/U057MKTGVQW/1693532158.627789/D058JTG1ZPH/false

    // 1693233193.648019  C02S4NANDV1

    // const response = await client.conversations.replies({channel: "C02S4NANDV1" , ts: "1693562851.627199"})

    // console.log(response);
    
    }
    catch (error) {  
      console.error(error);
    }
}

async function getSlackFileUrl(req, res){
    const client = new WebClient(slackTokens[slackMembers[req.headers.email]])
    const fileUrlRes = await client.files.sharedPublicURL({ file: req.params.fileId, types: "public_channel, private_channel, mpim, im" })

}

async function postMessage(channel, userName, text, showThread, ts){
    const client = new WebClient(slackTokens[userName] ? slackTokens[userName] : slackTokens["U02S69ZB9NG"])
    
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

async function getPrivateChat(req, res){

    const id = req.params.channel
    const email = req.headers.email

    const data = await fs.readFile('../tutorly-zoom-meeting-server/UsersAndReads.json', 'utf8');
    const usersAndReads = JSON.parse(data);


    const userId = slackMembers[email]

    const lastRead = (usersAndReads[slackMembers[email]] && usersAndReads[slackMembers[email]][id]) ? usersAndReads[slackMembers[email]][id].lastRead : null 

    const client = new WebClient(slackTokens[userId] ? slackTokens[userId] : slackTokens["U02S69ZB9NG"])

    const result = await client.conversations.list({
        types: "im"
    });
    
    const channels = result.channels

    let conversationId = null

    for(let i = 0; i < channels.length; i++){
        if(id === channels[i].user){
            conversationId = channels[i].id
            const result = await client.conversations.history({
                channel: channels[i].id,
                limit: 10
            });
            const messages = result.messages
            const chat = []
            let unreadMessages = 0;
            for(let i = 0; i < messages.length; i++){

                if(lastRead && lastRead < messages[i].ts){
                    unreadMessages++
                }
               
                messages[i].text = messages[i].text.replace(/<@(.*?)>/g, (match, userId) => {
                // Check if the userId exists in the mapping
                    if (slackIds[userId]) {
                        return slackIds[userId];
                    } else {
                  // If the userId is not in the mapping, keep the original mention
                        return match;
                    }
                });
                chat.push({
                    user: messages[i].user,
                    username: messages[i].username ? messages[i].username :  slackIds[messages[i].user],
                    text: messages[i].text,
                    ts: messages[i].ts,
                    replyCount: messages[i].reply_count ? messages[i].reply_count : 0,
                    read: usersAndReads[userId] && usersAndReads[userId][id] && usersAndReads[userId][id].lastRead && usersAndReads[userId][id].lastRead < messages[i].ts,
                    files: messages[i].files
                })
                
            }

            res.json({status: 200, chat, unreadMessages, conversationId})

            const updatedData = JSON.stringify(usersAndReads, null, 2);
            await fs.writeFile('../tutorly-zoom-meeting-server/UsersAndReads.json', updatedData);

            markMessageAsReadPrivate(userId, conversationId, email, id)
        }
    }
}

async function getChat(req, res){

    const isPrivate = req.params.private

    if(isPrivate === "true"){
        await getPrivateChat(req, res)
        return
    }


    const channel = req.params.channel
    const email = req.headers.email

    const userId = slackMembers[email]

    const data = await fs.readFile('../tutorly-zoom-meeting-server/UsersAndReads.json', 'utf8');
    const usersAndReads = JSON.parse(data);

    const lastRead = (usersAndReads[slackMembers[email]] && usersAndReads[slackMembers[email]][channel]) ? usersAndReads[slackMembers[email]][channel].lastRead : null 

    console.log(channel, email);

    const client = new WebClient(slackTokens[userId] ? slackTokens[userId] : slackTokens["U02S69ZB9NG"])
    
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
        messages[i].text = messages[i].text.replace(/<@(.*?)>/g, (match, userId) => {
                // Check if the userId exists in the mapping
            if (slackIds[userId]) {
                return slackIds[userId];
            } else {
                  // If the userId is not in the mapping, keep the original mention
                return match;
            }
        });
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

    const updatedData = JSON.stringify(usersAndReads, null, 2);
    await fs.writeFile('../tutorly-zoom-meeting-server/UsersAndReads.json', updatedData);

    markMessageAsRead(userId, channel, email)
    
}

function markMessageAsReadSocket(email, channel){
    markMessageAsRead(slackMembers[email], channel, email)
}

async function markMessageAsRead(userId, channel, email){
    const data = await fs.readFile('../tutorly-zoom-meeting-server/UsersAndReads.json', 'utf8');
    const usersAndReads = JSON.parse(data);
    if(userId && usersAndReads[userId] && usersAndReads[userId][channel]){
        usersAndReads[userId][channel].lastRead = usersAndReads[userId][channel].latestMessage
        if(slackTokens[slackMembers[email]] && usersAndReads[userId][channel].latestMessage){
            const client = new WebClient(slackTokens[slackMembers[email]])
            const res = await client.conversations.mark({channel: channel, ts: usersAndReads[userId][channel].latestMessage})
        }
    
    }

    const updatedData = JSON.stringify(usersAndReads, null, 2);
    await fs.writeFile('../tutorly-zoom-meeting-server/UsersAndReads.json', updatedData);
}

async function markMessageAsReadPrivate(userId, conversationId, email, id){
    const data = await fs.readFile('../tutorly-zoom-meeting-server/UsersAndReads.json', 'utf8');
    const usersAndReads = JSON.parse(data);
    if(userId && usersAndReads[userId] && usersAndReads[userId][id]){
        usersAndReads[userId][id].lastRead = usersAndReads[userId][id].latestMessage
        if(slackTokens[slackMembers[email]] && usersAndReads[userId][id].latestMessage){
            const client = new WebClient(slackTokens[slackMembers[email]])
            const res = await client.conversations.mark({channel: conversationId, ts: usersAndReads[userId][id].latestMessage})
        }
    
    }
    const updatedData = JSON.stringify(usersAndReads, null, 2);
    await fs.writeFile('../tutorly-zoom-meeting-server/UsersAndReads.json', updatedData);
}

async function getReplies(req, res){
    const { channel, ts, conversationId, showChannels } = req.params
    console.log(channel, ts, conversationId, showChannels);

    const email = req.headers.email

    const userId = slackMembers[email]

    const client = new WebClient(slackTokens[userId] ? slackTokens[userId] : slackTokens["U02S69ZB9NG"])
    const response = await client.conversations.replies({channel: channel, ts: ts})
    console.log(response);
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

    console.log(chat);

    res.json({status: 200, chat})

}

async function getChannels(req, res){

    const email = req.params.email
    
    const userId = slackMembers[email]
    console.log("id:", userId);
    const client = new WebClient(slackTokens[userId] ? slackTokens[userId] : slackTokens["U02S69ZB9NG"])
    try{
        const response = await client.users.conversations({user: slackMembers[email], types: "public_channel, private_channel, mpim, im", limit: 999})

        const channels = response.channels

        const channelsList = []

        const membersList = []

        const data = await fs.readFile('../tutorly-zoom-meeting-server/UsersAndReads.json', 'utf8');
        const usersAndReads = JSON.parse(data);
        
    
        for(const member in slackIds){
            membersList.push({
                id: member,
                name: slackIds[member],
                read: (usersAndReads[slackMembers[email]] && usersAndReads[slackMembers[email]][member]) ? usersAndReads[slackMembers[email]][member].lastRead < usersAndReads[slackMembers[email]][member].latestMessage : false
            })
        }

        
        console.log("New Print-------------------------------------------------------------------------");
        for(let i = 0; i < channels.length; i++){
            if(channels[i].id && channels[i].name){
                channelsList.push({
                    id: channels[i].id,
                    name: channels[i].name,
                    private: channels[i].is_private,
                    read: (usersAndReads[slackMembers[email]] && usersAndReads[slackMembers[email]][channels[i].id]) ? usersAndReads[slackMembers[email]][channels[i].id].lastRead < usersAndReads[slackMembers[email]][channels[i].id].latestMessage : false
                })
                console.log(usersAndReads[slackMembers[email]]);
            }
            
        }

        res.json({status: 200, channelsList, membersList, userId: slackMembers[email], userName: slackIds[slackMembers[email]]})

        const updatedData = JSON.stringify(usersAndReads, null, 2);
        await fs.writeFile('../tutorly-zoom-meeting-server/UsersAndReads.json', updatedData);
    }
    catch(e){
        res.json({status: 404})
    }

    
}

module.exports = { populateConversationStore, getSlackFileUrl, getChannels, initializeSlackIds, getChat, getReplies, postMessage, getUserName, updateUsersAndReads, getNotification, checkNotification, markMessageAsReadSocket }