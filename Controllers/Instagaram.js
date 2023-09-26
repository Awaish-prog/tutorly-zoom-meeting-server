const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
require('dotenv').config()

const postToInsta = async (title, imgUrl, link) => {

    try{
        const ig = new IgApiClient();
        ig.state.generateDevice(process.env.INST_ID);
        await ig.account.login(process.env.INST_ID, process.env.INST_PASS);

        const imageBuffer = await get({
            url: imgUrl,
            encoding: null, 
        });

        await ig.publish.photo({
            file: imageBuffer,
            caption: title + ", blog link: " + link, // nice caption (optional)
        });

        console.log("Done");
    }catch(e){
        console.log(e);
    }
}

module.exports = { postToInsta }