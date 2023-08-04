const axios = require('axios');
const { createBitPaperData } = require('./WhiteBoardAppScripts');
require('dotenv').config()

const apiUrl = 'https://api.bitpaper.io/public/api/v1/paper';

const apiToken = process.env.BIT_PAPER_KEY; 

const createPaper = async (req, res) => {
  const { paperName, tutorEmail, studentEmail, dateAndTime } = req.body
  const paperData = {
    name: paperName
  };

  try {
    
    const response = await axios.post(apiUrl, paperData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    // Handle the response
    (response && response.status === 201) ? res.json({status: 200, data: response.data}) : res.json({status: 401})
    createBitPaperData(paperName, response.data.id_saved_paper + " " + response.data.urls.guest + " " + response.data.urls.admin, tutorEmail, studentEmail, dateAndTime)
  } catch (error) {
    // Handle errors
    res.json({status: 401})
  }
}

const deleteBitpaper = async (req, res) => {
    const paperId = req.body.paperid
    try {
      const response = await axios.delete(apiUrl + "/" + paperId, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      });
  
      // Handle the response
      console.log('Paper deleted:', response);
    } catch (error) {
      // Handle errors
      console.error('Error deleting paper:', error.message);
    }
  };

module.exports = { createPaper, deleteBitpaper }
