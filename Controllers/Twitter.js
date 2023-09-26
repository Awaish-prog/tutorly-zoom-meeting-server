const { TwitterApi } = require('twitter-api-v2')
const { get } = require('request-promise');
require('dotenv').config()



const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
})


async function tweet(title, imgUrl, link){
    try{
        // await rwClient.v2.tweet("Tutorly Api test")

        const imageBuffer = await get({
            url: imgUrl,
            encoding: null, 
        });

        const mediaIds = await Promise.all([
            // file path
            client.v1.uploadMedia(Buffer.from(imageBuffer), { type: 'png' }),
            
          ]);
          
          // mediaIds is a string[], can be given to .tweet
          await client.v2.tweet({
            text: title + ", blog link: " + link,
            media: { media_ids: mediaIds }
          });
    }
    catch(e){
        console.log(e);
    }
}

module.exports = { tweet }