const http = require('http');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const newdatabase = require('./newdatabase');

// Importa rotas
const Session = require('./routes/SessionRoute');
const Users = require('./routes/UsersRoute');
const Products = require('./routes/ProductsRoute');
const Report = require('./routes/ReportRoute');
const Category = require('./routes/CategoryRoute');
let config = {};

if (process.env.BASE_ENV == 'PRODUCTION') {
  config = require('./config-prod.json');
  console.log('STARTING PRODUCTION');
} else {
  config = require('./config-dev.json');
  console.log('STARTING DEVELOPMENT');
}

const port = config.port;

// middleware
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.text({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(config.cors)); // { origin: 'http://yourapp.com' }
app.use(express.static('public'));

// rotas
app.use('/Session', Session);
app.use('/Users', Users);
app.use('/Products', Products);
app.use('/Report', Report);
app.use('/Category', Category);

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

const httpServer = http.createServer(app);

newdatabase.connect().then(() => {
  httpServer.listen(port, () => {
    console.log('Base-Backend Server running on port ' + port);
  });
});
