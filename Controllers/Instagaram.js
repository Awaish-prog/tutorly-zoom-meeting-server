const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const { readFile } = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);

const postToInsta = async () => {

    try{
        const ig = new IgApiClient();
        ig.state.generateDevice("tutorlyedu");
        await ig.account.login("tutorlyedu", "Tutorly2023!");

        await ig.publish.photo({
            file: await readFileAsync("./Images/math anxiety.jpg"),
            caption: 'Really nice photo from the internet!', // nice caption (optional)
        });

        console.log("Done");
    }catch(e){
        console.log(e);
    }
}

module.exports = { postToInsta }