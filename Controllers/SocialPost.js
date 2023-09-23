const SocialPost = require('social-post-api')
require('dotenv').config()


const social = new SocialPost(process.env.SOCIAL_POST_API_KEY)

const getPostData = (title, imgUrl, link) => {
    return {
        post: title + ", article link: " + link,
        media_urls: [imgUrl],
        platforms: ["facebook"]
    }
}

const postToSocials = async (title, imgUrl, link) => {
    const content = getPostData(title, imgUrl, link)
    const json = await social.post(content).catch(console.error)

    console.log(json);
}


module.exports = { postToSocials }