require('dotenv').config()

const { Client } = require('@notionhq/client');
const { getDashboardDataTest, appendRowInSheet, getMapleStudent } = require('./DashboardData');
const { acuity } = require('./User');
const { getMeetingsList } = require('./Meetings');
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function createNotionPage(keyTakeaways, sessionLink, homeworkLink, resourcelink, recordingsLink, studentName, userId, password){
    try{
    const viewKeyTakeaways = {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [{
          type: "text",
          text: { content: 'View Your Key Takeaways', link: null },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: 'View Your Key Takeaways',
          href: null          
        }],
        icon: { type: 'emoji', emoji: '📝' },
        color: 'gray_background',
        
      }
    }
  
    const joinZoom = {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [{
          type: 'text',
          text: { content: 'Join Your Session: ', link: null },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: 'Join Your Session: ',
          href: null
        },
        {
          type: 'text',
          text: { content: 'Zoom Link', link: sessionLink === null ? null : {url: sessionLink } },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: 'Zoom Link',
          href: sessionLink
        }
      ],
        icon: { type: 'emoji', emoji: '💻' },
        color: 'gray_background',
      }
    }
  
  
    const messageTeam = {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [{
          type: 'text',
          text: { content: 'Message the Tutorly Team or Your Tutor: ', link: null },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: 'Message the Tutorly Team or Your Tutor: ',
          href: null
        },
        {
          type: 'text',
          text: { content: '(947) 888-7044', link: { url: 'tel:19478887044'} },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: '(947) 888-7044',
          href: 'tel:19478887044'
        }
      
      ],
        icon: { type: 'emoji', emoji:  '📞'  },
        color: 'gray_background',
      }
    }
  
      const homeworkFolder = {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [ {
          type: 'text',
          text: { content: 'Homework Folder', link: { url: homeworkLink } },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: 'Homework Folder',
          href: homeworkLink
        }
      ],
        icon: { type: 'emoji', emoji:  '📂'  },
        color: 'gray_background',
      }
    }
  
    const resourcesFolder = {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [ {
          type: 'text',
          text: { content: 'Resources Folder', link: { url: resourcelink } },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: 'Resources Folder',
          href: resourcelink
        }
      ],
        icon: { type: 'emoji', emoji:  '📂'  },
        color: 'gray_background',
      }
    }
  
    const recordingsFolder = {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [ {
          type: 'text',
          text: { content: 'Session Recordings', link: { url: recordingsLink } },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: 'Session Recordings',
          href: recordingsLink
        }
      ],
        icon: { type: 'emoji', emoji:  '📂'  },
        color: 'gray_background',
      }
    }
  
    
  
    const properties = {
      title: { id: 'title', type: 'title', title: [
        {
          type: 'text',
          text: { content: `Welcome, ${studentName}!`, link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: `Welcome, ${studentName}!`,
          href: null
        }
      ]
       }
    }
  
    const divider = {
      object: "block",
      type: 'divider',
      divider: {}  
    }
  
  const listItem = {
    "object": "block",
    "type": "bulleted_list_item",
    "bulleted_list_item": { rich_text: [ 
      {
        type: 'text',
        text: {
          content: 'Remember to upload homework before each session by texting (947) 888-7044!',
          link: null
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        },
        plain_text: 'Remember to upload homework before each session by texting (947) 888-7044!',
        href: null
      }    
    ], color: 'default' }
  }

  const ixlHeading = {
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{
        "type": "text",
        "text": {
          "content": "IXL Login Info",
          "link": null
        }
      }],
      "color": "default",
      "is_toggleable": false
    }
  }

  const column1 = {
      type: "column",
      column: {
        children: [
          viewKeyTakeaways,
          divider
        ]
      }
    }
  
    for(let i = 0; i < keyTakeaways.length; i++){
      column1.column.children.push({
        object: "block",
        type: "callout",
        callout: {
          rich_text: [{
            type: "text",
            text: { content: keyTakeaways[i].name, link: { url: keyTakeaways[i].id } },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default'
            },
            plain_text: keyTakeaways[i].name,
            href: keyTakeaways[i].id    
          }],
          icon: { type: 'emoji', emoji: '📘' },
          color: 'default',
        }
      })
    }
  
    const column2 = {
      "type": "column",
      "column": {
        "children": [
          joinZoom,
          divider,
          resourcesFolder,
          divider,
          recordingsFolder,
        ]
      }
    }
    const columnList = {
      "type": "column_list",
      "column_list": {
        "children": [
          column1,
          column2
        ]
      }
    }

    const ixlLoginPage = {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [ {
          type: 'text',
          text: { content: 'Login to IXL', link: { url: "https://in.ixl.com/?partner=google&campaign=248380048&adGroup=129630696407&gclid=CjwKCAjw67ajBhAVEiwA2g_jENds_fToYWcm2DNOGi1nNRX11LHICxCIdWdygTMwotPkBbfv-ajn6xoCiakQAvD_BwE" } },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: 'Login to IXL',
          href: "https://in.ixl.com/?partner=google&campaign=248380048&adGroup=129630696407&gclid=CjwKCAjw67ajBhAVEiwA2g_jENds_fToYWcm2DNOGi1nNRX11LHICxCIdWdygTMwotPkBbfv-ajn6xoCiakQAvD_BwE"
        }
      ],
        icon: { type: 'emoji', emoji:  '🧑‍💻'  },
        color: 'gray_background',
      }
    }
    // 🗝️
    const ixlLoginCredentials = {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [ {
          type: 'text',
          text: { content: `Your credentials:\n\tLogin Id: ${userId}\n\tpassword: ${password}`, link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: `Your credentials:\n\tLogin Id: ${userId}\n\tpassword: ${password}`,
          href: null
        }
      ],
        icon: { type: 'emoji', emoji:  '🔑'  },
        color: 'gray_background',
      }
    }

    const ixlColumn1 = {
      "type": "column",
      "column": {
        "children": [
          ixlLoginPage
        ]
      }
    }

    const ixlColumn2 = {
      "type": "column",
      "column": {
        "children": [
          ixlLoginCredentials
        ]
      }
    }

    const ixlColumnList = {
      "type": "column_list",
      "column_list": {
        "children": [
          ixlColumn1,
          ixlColumn2
        ]
      }
    }
    
    // https://www.notion.so/mytutorly/3c7278b9619a418ba23476324ea2d715?v=f2c32a19364146b9af3c78b9cd318be2&pvs=4
   
    const response = await notion.pages.create({
      "parent": {
          "type": "database_id",
          "database_id": "3c7278b9619a418ba23476324ea2d715"
      },
      "cover": {
        "type": "external",
        "external": {
            "url": 'https://tinypic.host/images/2023/05/05/notionCover.png'
        }
      },
      properties: properties,
      children : [
        columnList,
        ixlHeading,
        divider,
        ixlColumnList
      ]
    });
  
    return response
    }
    catch(e){
        console.log(e);
    }
}

async function createNotionPageWithEmail(email, userId, password){
    
    // const blockId = '9094313be5344dc7891fc6205d35a530';
    // const response = await notion.blocks.retrieve({
    //   block_id: blockId,
    // });
    // console.log(response);
   // 📝
    //  const pageId = '79ae8eab8ce34141b854c174081f0eb9';
    // const responseP = await notion.pages.retrieve({ page_id: pageId });
    // const databaseId = 'd4c16cca66494a86ab62f9169254e6d9';
    // const response = await notion.databases.retrieve({ database_id: databaseId });
    try{
    const studentData = await getDashboardDataTest(email);
    const notionData = {}
    notionData["studentName"] = studentData['studentName']
    notionData["meetinglink"] = studentData['meetingLink']
    notionData["keyTakeaways"] = []
    for(let i = 0; i < studentData.files.length; i++){
      if(studentData.files[i].name.toLowerCase().includes("session recording")){
        studentData.files[i].id = "https://drive.google.com/drive/folders/" + studentData.files[i].id
        notionData["recordingLink"] = studentData.files[i].id
      }
      else if(studentData.files[i].name.toLowerCase().includes("resource")){
        studentData.files[i].id = "https://drive.google.com/drive/folders/" + studentData.files[i].id
        notionData["resourcesLink"] = studentData.files[i].id
      }
      else if(studentData.files[i].name.toLowerCase().includes("homework")){
        studentData.files[i].id = "https://drive.google.com/drive/folders/" + studentData.files[i].id
        notionData["homeworkLink"] = studentData.files[i].id
      }
      else if(studentData.files[i].name.toLowerCase().includes("key takeaway")){
        studentData.files[i].id = "https://docs.google.com/document/d/" + studentData.files[i].id
        notionData["keyTakeaways"].push(studentData.files[i])
      }
    }

    let date = (new Date()).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll("/", "-")
    date = date.substring(0, date.indexOf(","))
    if(date[1] == "-"){
      date = "0" + date
    }
    const year = date.substring(6, 10)
    const day = date.substring(3, 5)
    const month = date.substring(0, 2)

    const formattedDate = `${year}-${month}-${day}`;
    
    let meetingsList = []

    
    setTimeout(() => {
      acuity.request(`appointments?email=${email}&minDate=${formattedDate}&max=10&direction=ASC`, async function (err, r, appointments) {
        if (err) return console.error(err);
        meetingsList = getMeetingsList(appointments, true)
  
        if(notionData["meetinglink"].includes("VALUE")){
          notionData["meetinglink"] = null
        }
  
        if(meetingsList.length){
          notionData["meetinglink"] = meetingsList[0].location.substring(5, meetingsList[0].location.indexOf(" ", 5));
        }
  
        
        const page = await createNotionPage(notionData["keyTakeaways"], notionData["meetinglink"], notionData["homeworkLink"], notionData["resourcesLink"], notionData["recordingLink"], notionData["studentName"], userId, password)
  
  
      
        const link = page.url.replace("https://www.notion.so", "https://mytutorly.notion.site")
  
  
        appendRowInSheet("1-_UmQM3Q06anjIMxIzDoSE8_jtaXixCPqxtgqY7qqdg", [[notionData["studentName"], email, link]], "A:C")
  
        console.log(`Notion page created for ${email}`);
      })
    }, 10000)

    

    }
    catch(e){
        console.log(e);
    }
    
} 

async function updateNotionPage(blockId, email){
  await sleep(2000)
  const pageContent = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });
  await sleep(2000)
  const firstBlock = await notion.blocks.children.list({
    block_id: pageContent.results[0].id,
  });
  await sleep(2000)
  const firstBlockSecondColumn = await notion.blocks.children.list({
    block_id: firstBlock.results[1].id,
  });
  

  let date = (new Date()).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll("/", "-")
    date = date.substring(0, date.indexOf(","))
    if(date[1] == "-"){
      date = "0" + date
    }
    const year = date.substring(6, 10)
    const day = date.substring(3, 5)
    const month = date.substring(0, 2)

    const formattedDate = `${year}-${month}-${day}`;
    await sleep(10000)
  acuity.request(`appointments?email=${email}&minDate=${formattedDate}&max=10&direction=ASC`, async function (err, r, appointments) {
    if (err) return console.error(err);
    const meetingsList = getMeetingsList(appointments, true)

    if(meetingsList.length){
      await sleep(2000)
      const firstBlockSecondColumnFirstBlock = await notion.blocks.update({
        "block_id": firstBlockSecondColumn.results[0].id,
        callout: {
          rich_text: [{
            type: 'text',
            text: { content: 'Join Your Session: ', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default'
            },
            plain_text: 'Join Your Session: ',
            href: null
          },
          {
            type: 'text',
            text: { content: 'Zoom Link', link: {url: meetingsList[0].location.substring(5, meetingsList[0].location.indexOf(" ", 5)) } },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default'
            },
            plain_text: 'Zoom Link',
            href: meetingsList[0].location.substring(5, meetingsList[0].location.indexOf(" ", 5))
          }
        ],
          icon: { type: 'emoji', emoji: '💻' },
          color: 'gray_background',
        }
      });
      console.log(`Page updated for ${email} ${meetingsList[0]}`);
    }
    else{
      console.log(`Page update failed for ${email}, because this student does not have any upcoming meetings`);
    }
    

  })

  
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createNotionPages(){
  const studentsData = await getMapleStudent()
  for(let i = 1; i < studentsData.length; i++){
    await createNotionPageWithEmail(studentsData[i][6], studentsData[i][4], studentsData[i][5]);
    await sleep(5000);
  }

  //await createNotionPageWithEmail("emelysolis@mapleschool.org", "emelysolis3", "solis3")
}

async function updateNotionPages(){
  const studentsData = await getMapleStudent()
  for(let i = 1; i < studentsData.length; i++){
    await updateNotionPage(studentsData[i][1].substring(studentsData[i][1].length - 32 ,studentsData[i][1].length), studentsData[i][0])
    await sleep(15000);
    console.log(i);
  }

  console.log("All pages are updated...");
}
module.exports = { createNotionPageWithEmail, createNotionPages, updateNotionPages }
