const request = require('request')
const fs = require('fs-extra')
const readlineSync = require('readline-sync')
require('colors')

const requestPost = async (name, filename, private) => {
  var formData = {
    paste_code: fs.readFileSync(`./${filename}`, 'UTF8'),
    paste_name: name,
    paste_expire_date: 'N',
    paste_format: '1',
    paste_private: private == 'y' ? '1' : '0',
    submit_hidden: 'submit_hidden'
  }

  request.post({
    url: 'https://pastebin.com/post.php', 
    headers:{
      'Host': 'pastebin.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
      'Content-Type': 'multipart/form-data; boundary=---------------------------191750255913579821263945812978',
      'Referer': 'https://pastebin.com/',
      'Cookie':' __cfduid=dd66a99523d7a2ebc69f99155813e98a31589639211; PHPSESSID=61drthkvp3kg7g562lk2r8bfk0; _ga=GA1.2.274124677.1590120794; _gid=GA1.2.1223074456.1590120794; _gat_UA-58643-34=1;'
    },
      formData: formData
    },
    function optionalCallback(err, body) {
      const resLocation = body.caseless.dict.location
      if (resLocation == '/warning.php?p=1') {
        console.log(`-> ERR : You have reached your guest paste limit of 10 pastes per 24 hours`.red.bold)
      } else if (resLocation == '/index.php?e=2') {
        console.log(`-> ERR : Empty paste, please check your input file`.red.bold)
      } else {
        console.log(`-> SUCCESS : https://pastebin.com ${resLocation}`.green.bold)
      }
    }
  )
}

;(async () => {
  try {
    var name = readlineSync.question('[?] Paste Name : ')
    var filename = readlineSync.question('[?] File Name : ')
    var private = readlineSync.question('[?] Make private (y/n) : ')
    await requestPost(name, filename, private)
  } catch(err) {
    return Promise.reject(err)
  }
})()