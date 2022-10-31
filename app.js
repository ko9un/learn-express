const express = require('express'); //const 변하지 않는 함수 다른언어는 import from// npm에 있는 패키지 or node에있는 패키지 이름 // morgan cookie parser express session 익스프레스 미들웨어  
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session =require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const app = express();
app.set('port',process.env.PORT || 3000);
app.set('view engine', 'html');

nunjucks.configure('views',{
    express: app,
    watch: true,
});

app.use(morgan('dev'));
app.use('/',express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly: true,
        secure: false,
    },
    name:'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req,res,next)=>{
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다. `);
  error.status = 404;
  next(error);
});



app.use((err,rwq,res,next)=>{
  res.locals.message= err.message;
  res.locals.error = process.env.NODE_NEV !=='production' ?err :{};
  res.status(err.status || 500);
  res.render('error');

});

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'/index.html'));
});

app.listen(app.get('port'),() =>{
    let port = app.get('port');
    console.log(`http://localhost:${port} 에서 대기중`);

});

