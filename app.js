// Setup server, session and middleware here.
//referred professor's lecture code 8, my lab8 and professor's lecture code 10
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import session from 'express-session';
import configRoutes from './routes/index.js';

import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';
import middlewareMethods from './middleware.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

app.use('/public', staticDir);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({extended: true}));
// app.use(rewriteUnsupportedBrowserMethods);


const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
      eq: function (arg1, arg2) {
          return (arg1 == arg2);
      }
  }
});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

//took reference from lab10 ruberics
app.use(
    session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: false
    })
  );


app.use(middlewareMethods.loggingMiddleware);


//console.log("Before app is called");

configRoutes(app);

//console.log("After app is called");

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});


