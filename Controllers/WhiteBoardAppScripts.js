const axios = require('axios');

const scriptUrl = 'https://script.google.com/macros/s/AKfycbzme6JKjA7HAuQknQ_q8kloCbzH_ixPpGfIh1IAYSJ8scUFYKkSsHM_5elHN5KNSOhR/exec' // Replace with your actual script URL

async function createWhiteboardData(req, res) {
    const { paperName, paperLink, tutorEmail, studentEmail, dateAndTime, paperData } = req.body
    try {
        const response = await axios.post(scriptUrl, {operation: "append", paperData: [paperName, paperLink, tutorEmail, studentEmail, dateAndTime, paperData]});
        res.json({status: response.status})
    } catch (error) {
        res.json({status: 404})
    }
}

async function updateWhiteboard(paperLink, paperData){
    try {
        const response = await axios.post(scriptUrl, {operation: "updateRow", paperData: { paperLink, paperData }});
        return 200
    } catch (error) {
        return 404
    }
    
}

function getStringFromArray(arr){
    let str = ""
    for(let i = 5; i < arr.length && arr[i].length; i++){
        str += arr[i]
    }
    return str
}

async function getWhiteboardData(paperLink){
    try {
        const response = await axios.post(scriptUrl, {operation: "getRow", paperData: paperLink});
        return JSON.parse(getStringFromArray(response.data.boardData[0]))
    } catch (error) {
        console.log("error");
    }
    
}

async function deleteWhiteboardData(paperLink){
    try {
        const response = await axios.post(scriptUrl, {operation: "deleteRow", paperData: paperLink});
        console.log(response);
    } catch (error) {
        return 404
    }
    
}

module.exports = { createWhiteboardData, updateWhiteboard, getWhiteboardData, deleteWhiteboardData }