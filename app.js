const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

/*환경변수설정*/
dotenv.config();
const app = express();
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
app.post("/login", (req, res) => {
  let { username } = req.body;
  req.session.user = { username };
  res.redirect('/');
});

/*전처리 미들웨어*/
app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  if (req.session.user === undefined) {
    req.redirect("login.html");
  } else {
    next();
  }
});
/*라우트 미들웨어*/
app.get(
  "/",
  (req, res, next) => {
    console.log("GET / 요청에서만 실행됩니다");
    next();
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
