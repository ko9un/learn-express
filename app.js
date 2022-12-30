const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

/*환경변수설정*/
dotenv.config();
const app = express();
const secret = process.env.PASSWORD || process.env.COOKIE_SECRET;
const port = process.env.PORT || 8888;

/* body-parser*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/*req 어떤 요청이 들어왔는지 출력  추가적인 로그 */
app.use(morgan("dev"));
/*static 미들웨어 경로처리 */
app.use("/", express.static(path.join(__dirname, "public")));

/*cookie-parse* 세션(로그인유지) 미들웨어
AJAX 쿠키X API O
*/
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);

/*로그인 미들웨어*/
/*
브라우저 > login.html post는 데이터요청  페이지보여주는건 get요청 . 브라우저가 응답 바로는 표준 x 리다이렉트 써야함 > 성공-실패(오류출력등)마다 리다이렉트가 다름

login next가 없음
대신 res redirect로 끝냄
 */
app.post("/login", (req, res) => {
  let { username , password } = req.body;
  /*로그인 성공시*/
  if(password === secret){
  req.session.user = { username };

  //res.send('로그인성공') //리다이렉트 안하고 그냥 넘기기 경로남음  post 에서 새로고침 다시제출 문제(중복방지등) 로그인은 
  res.redirect('/'); // 경로 안남기게//  
  }else{
      //로그인 실패처리 
      res.redirect('/login.html');

  }
});


/*전처리 미들웨어*/
app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  if (req.session.user === undefined) { //로그인이 대있으면next 안대있으면 리다이렉트 
    req.redirect("/login.html");
  } else {
    next();
  }
});
/*라우트 미들웨어*/
app.get("/",(req, res, next) => {
  let user = req.session.user;
    if(user !== undefined){
      res.send(`${user.username}님 환영합니다.`); 
     //todo 로그인 정보가 있으면 환영 메세지 출력하기 
    }else{
    next();
    }
  },
  (req, res) => {
    throw new Error("에러는 에러 처리 미들웨어로 갑니다 ");
  }
);

/*에러처리미들웨어*/
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(port, () => {
  console.log(`http://localhost:${port} 서버 대기중 `);
});
