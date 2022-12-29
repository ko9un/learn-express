const express = require('express');

const app = express();
const port = process.env.PORT || 8888;

app.get('/',(req,res)=> {
  res.send('HELLO EXPRESS');
});


app.listen(port,() =>{
  console.log(`http://localhost:${port} 서버 대기중 `);
});
