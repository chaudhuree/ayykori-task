const { readdirSync } = require("fs");
const path = require("path");
require('dotenv').config();
require('express-async-errors'); //no need any try catch for this package
const express = require('express');
const app = express();
const morgan = require('morgan');
// const scheduleTask = require('./utils/scheduler');

// let globalRequestCount = 0;
// // global counter middleware
// const globalRequestCounter= (req, res, next) => {
//   globalRequestCount++;
//   next();
// }
// // Reset the global counter every minute
// scheduleTask('1m', () => {
//   globalRequestCount = 0;
// });
// setInterval(() => {
//   globalRequestCount = 0;
// }, 60 * 1000); // 1 minute

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs:  60 * 1000, // 1 minute
    max: 100, // limit each IP to 10 requests per windowMs
    handler: (req, res) => {
      // note: if user is loggedin then show the coun value from db
      // show the global request count value
      res.status(429).json({ error: 'Too Many Requests,Try Again After Some Time' });
    },
  })
);
app.use(express.json());
app.use(morgan("dev"))
app.use(cors());
app.use(xss());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({crossOriginResourcePolicy: false}))

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// globalRequestCounter middleware
// app.use(globalRequestCounter);

// routes middleware
readdirSync("./routes").map(r => app.use("/api/v1", require(`./routes/${r}`))) 

// routes
app.get('/', (req, res) => {
  res.send('server is running');
});

//db connection
const connectDB = require('./db/connect');
const scheduleTask = require("./utils/scheduler");


//if no route found
app.use(notFoundMiddleware);
//if error found custom error handler
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();