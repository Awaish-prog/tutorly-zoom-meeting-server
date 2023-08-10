const { WebClient } = require('@slack/web-api');

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
const client = new WebClient(token);

async function populateConversationStore() {
    try {
      // Call the conversations.list method using the WebClient
    //   const result = await client.conversations.list({types: "public_channel, private_channel, mpim, im", cursor: "dGVhbTpDMDJMWUVEMTZBVQ=="});
    //     // C04JF7ZPP7H
    //   const channels = result.channels
    //     // console.log(result.response_metadata);
    //     // console.log(result.channels.length);
    //   for(let i = 0; i < channels.length; i++){
    //     if(channels[i].name.toLowerCase().includes("awaish")){
    //         console.log(channels[i].name, channels[i].id);
    //     }
    //   }

    //   console.log("search over", result.response_metadata.next_cursor);

    const result = await client.chat.postMessage({
        channel: "C02S4NANDV1",
        text: "Api test"
    });

    console.log(result);

    //   const result = await client.conversations.history({
    //     channel: "C04JF7ZPP7H"
    //   });

    //   console.log(result);
    }
    catch (error) {
      console.error(error);
    }
}

function handleSlackMessage(req, res){
    console.log(req.body);
    res.status(200).send(req.body.challenge)
}

module.exports = { populateConversationStore, handleSlackMessage }