const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const cors = require('cors');
const contentDisposition= require('content-disposition');

// configure static folder
app.use('/static', express.static('./static'));

// static 
app.get('/', (req, res) => { 
  res.sendFile('index.html', { root: './' });
});

app.get('/download', async (req, res) => {
  const url = req.query.url; 
  if(ytdl.validateURL(url)){
    res.status(500).send({message:'could not parse the received URL'});
  }else{
    const info = await ytdl.getInfo(req.query.url); 
    res.header({
      'Content-Disposition': contentDisposition(`${info.player_response.videoDetails.title}.mp4`), // Mask non-ANSI chars
      'Content-Transfer-Encoding': 'binary',
    });    
    ytdl(url, {format: 'mp4', quality:'highest'}).pipe(res);
  } 
});


app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});