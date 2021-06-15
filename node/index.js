const PORT = 9876;

const express = require("express");
const cookieParser = require('cookie-parser');

const authrouter = require('./routers/auth/auth');
const authorizeMiddleWare = require('./services/middleware/authorize');
const authGuard = require('./services/middleware/role-checker');
const studentContentRouter = require('./routers/role-restricted-content/student/student');
const profileRouter = require('./routers/general-restricted/profile/profileRouter');
const labsRouter = require('./routers/general-restricted/labs/labsRouter');
const dbsRouter = require('./routers/general-restricted/db/dbs');
const transactionsRouter = require('./routers/general-restricted/transactions/transaction-router');
const accountsRouter = require('./routers/general-restricted/accounts/accounts-router');

const app = express();
const cors = require('cors');

const validRoles = ['Student','Staff','Admin'];
//app.use(cors({origin:'http://localhost:4200',optionsSuccessStatus:200}));

app.options('*', function (req,res) {
   console.log("OPTIONS PATH",req);
   res.setHeader('Access-Control-Allow-Credentials', true);
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //X-Requested-With,content-type
    res.sendStatus(200); 
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //X-Requested-With,content-type

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

//TEST zone
app.use('/test', [authGuard.authCheck(),authGuard.validateRole("Student")], function(req,res,next){
	console.log("SUCCESS");
	res.end();
});


//REGISTER AND LOGIN
app.use('/auth', authrouter);

app.use('/check',authorizeMiddleWare);

// RESTRICTED ACCESS
app.use('/restricted',authorizeMiddleWare); // token, role check

// Get Labs
app.use('/restricted/:role/labs',labsRouter);

//GENERAL Profile
app.use('/restricted/:role/profile', profileRouter);

//Accounts
app.use('/guarded/accounts', [authGuard.authCheck(validRoles[1])], accountsRouter);

//Transactions
app.use('/guarded/transactions',[authGuard.authCheck(),authGuard.authCheck(validRoles[1])],transactionsRouter);

app.use('/guarded/dbs', [authGuard.authCheck(),authGuard.authCheck(validRoles[2])], dbsRouter);

app.get('/', (req,res) => {
	res.send("alive");
} );

	
app.listen(PORT, () => {
  console.log('Server is listening on port:' + PORT);
});