const axios = require('axios');
require('dotenv').config()

const scriptUrl = process.env.SCRIPT_URL // Replace with your actual script URL

async function createWhiteboardData(req, res) {
    const { paperName, paperLink, tutorEmail, studentEmail, dateAndTime, paperData } = req.body
    try {
        const response = await axios.post(scriptUrl, {operation: "append", paperData: [paperName, paperLink, tutorEmail, studentEmail, dateAndTime, paperData]});
        res.json({status: response.status})
    } catch (error) {
        res.json({status: 500})
    }
}

async function updateWhiteboard(paperLink, paperData){
    try {
        const response = await axios.post(scriptUrl, {operation: "updateRow", paperData: { paperLink, paperData }});
        return response.status
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
        if(!response.data.boardData){
            return null
        }
        return JSON.parse(getStringFromArray(response.data.boardData[0]))
    } catch (error) {
        console.log("error");
        return null
    }
    
}

async function deleteWhiteboardData(req, res){
    const { paperLink } = req.body
    try {
        const response = await axios.post(scriptUrl, {operation: "deleteRow", paperData: paperLink});
        return response.data["status"]
    } catch (error) {
        return 404
    }
    
}

async function checkLink(paperLink){
    try {
        const response = await axios.post(scriptUrl, {operation: "checkLink", paperData: paperLink});
        return response.data["status"]
    } catch (error) {
        return 404
    }
}

async function getBoardsList(req, res){
    const { email, role } = req.body
    try {
        const response = await axios.post(scriptUrl, {operation: "getList", paperData: {email, role} });
        res.json(response.data)
    } catch (error) {
        res.json({status: 404})
    }
}

module.exports = { createWhiteboardData, updateWhiteboard, getWhiteboardData, deleteWhiteboardData, checkLink, getBoardsList }