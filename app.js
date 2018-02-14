// Importing needed modules
import bodyParser from 'body-parser'
import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'
import express from 'express'
import expressSession from 'express-session'
import http from 'http'
import ioRedis from 'socket.io-redis'
import logger from 'morgan'
import mongoose from 'mongoose'
import passport from 'passport'
import path from 'path'
import redis from 'redis'
import socketIo from 'socket.io'
import sticky from 'sticky-session'

// Establishing MongoDB connection
const mongoDB = 'mongodb://127.0.0.1:27017/slaicke'
mongoose.connect(mongoDB)

// Importing needed models
import User from './bin/models/user'
import Message from './bin/models/message'
import Room from './bin/models/room'
import Emote from './bin/models/emote'

// Importing needed routes
import indexRouter from './bin/routes/index'
import authRouter from './bin/routes/auth'
import messageRouter from './bin/routes/message'
import userRouter from './bin/routes/user'
import roomRouter from './bin/routes/room'
import emoteRouter from './bin/routes/emote'

// Setting needed constants
const port = process.env.PORT || '3000'
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const redisStore = connectRedis(expressSession)
const client = redis.createClient()

// Setting needed stuff
app.set('views', path.join(__dirname, 'bin/views'))
app.set('view engine', 'jade')
app.set('port', port)
app.set('socketio', io)


app.use(expressSession(
  { 
    secret: 'SecretKeyLOL',
    store: new redisStore(
      {
        host: 'localhost', 
        port: 6379, 
        client: client, 
        ttl : 260
      }
    ),
    saveUninitialized: false,
    resave: false
  }
))

// Using needed middleware
app.use(passport.initialize())
app.use(passport.session())

// Passport serialization and deserialization
// We're using the username so we won't have
// two persons with similar username
passport.serializeUser((user, done) => {
  console.log('SerializeUser')
  console.log(user)
  done(null, user)
});
passport.deserializeUser((user, done) => {
  User.find({username: user.username}, (err, user) => {
    done(err, user)
  });
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(__dirname + '/bin/public'));

// Using needed routes
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/room', roomRouter)
app.use('/message', messageRouter)
app.use('/user', userRouter)
app.use('/emote', emoteRouter)

// // Using 404's response route
// app.use((req, res, next) => {
//   var err = new Error('Page Not Found');
//   err.status = 404;
//   next(err);
// });

io.adapter(ioRedis(
  { 
    host: 'localhost',
    port: 6379
  }
))

// Establishing Socket.IO connection
io.on('connection', socket => {
  socket.emit("HELLO", { hello: 'world' });
});

// Listening on port...
server.listen(port);

module.exports = app;