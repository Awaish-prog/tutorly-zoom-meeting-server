require('dotenv').config()

const { Client } = require('@notionhq/client');
const { getDashboardDataTest, appendRowInSheet } = require('./DashboardData');
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function createNotionPage(keyTakeaways, sessionLink, homeworkLink, resourcelink, recordingsLink, studentName){
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
          text: { content: 'Zoom Link', link: {url: sessionLink } },
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
          messageTeam,
          divider,
          homeworkFolder,
          divider,
          listItem,
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
    
   
    const response = await notion.pages.create({
      "parent": {
          "type": "database_id",
          "database_id": "71763a2cb1cb41e59a123511defeedef"
      },
      "cover": {
        "type": "external",
        "external": {
            "url": 'https://tinypic.host/images/2023/05/05/notionCover.png'
        }
      },
      properties: properties,
      children : [
        columnList
      ]
    });
  
    return response
    }
    catch(e){
        console.log(e);
    }
}

async function createNotionPageWithEmail(email){
    
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
    
    const page = await createNotionPage(notionData["keyTakeaways"], notionData["meetinglink"], notionData["homeworkLink"], notionData["resourcesLink"], notionData["recordingLink"], notionData["studentName"])
    
    const link = page.url.replace("https://www.notion.so", "https://mytutorly.notion.site")


    appendRowInSheet("1-_UmQM3Q06anjIMxIzDoSE8_jtaXixCPqxtgqY7qqdg", [[notionData["studentName"], email, link]], "A:C")
    }
    catch(e){
        console.log(e);
    }
    
} 

module.exports = { createNotionPageWithEmail }
