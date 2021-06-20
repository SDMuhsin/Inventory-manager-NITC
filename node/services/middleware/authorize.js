const app = require('express')();
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
var request = require('request');
const jwtKey = 'mykey';

const roles = [
	"Student",
	"Staff",
	"Admin"
];

router.get('/return/access_level', (req, res, next) => {
	//Get token
	const token = req.cookies.token;
	console.log('GOT COOKIES',token);
	if(!token){
		return res.status(401).end();
	}
	var payload;
	try{
		payload = jwt.verify(token,jwtKey);
		console.log("PAYLOAD DECODED ", payload);
		res.json({"access_level":payload.access_level});
		
	}catch(e){
		console.log(e);
		if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return res.status(401).end()
		}
		// otherwise, return a bad request error
		return res.status(400).end()		
	}
});

//user has requested role restricted content, check auth first
router.all( '/:role/:any', (req,res,next) => {
	
	console.log('[AUTHORIZE MIDDLEWARE][TOKEN CHECK]');
	//Get token
	
	const token = req.cookies.token;
	console.log('GOT COOKIES',req.headers);
	console.log(req.cookies);
	if(!token){
		console.log("Token undefined...");
		return res.status(401).end();
	}
	var payload;
	try{
		payload = jwt.verify(token,jwtKey);
		console.log("PAYLOAD DECODED ", payload);
		req.user = payload;
		next();
		
	}catch(e){
		console.log(e);
		if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return res.status(401).end()
		}
		// otherwise, return a bad request error
		return res.status(400).end()		
	}
}
);

//User is authenticated, check if his role has access
router.all('/:role/:any', (req,res,next)=>{
	
	const logEnv = '[AUTHORIZE MIDDLEWARE][ROLE CHECK]';
	
	const userRole = req.user.access_level;
	const requestedAccess = req.params.role;
	
	//If no such role exists
	if(!roles.includes(requestedAccess)){
		console.log(logEnv + 'No such role as ' + requestedAccess);
		res.status(404).end();
	}
	
	console.log('[AUTHORIZE MIDDLEWARE][ROLE CHECK]');
	console.log( logEnv + ' Route access level required : ' + requestedAccess);
	console.log( logEnv + ' User role : ' + req.user.access_level);
	//Check if the role required to continue this path is allowed to this user
	if(requestedAccess == roles[0]){ // User has requested student content
		
		console.log('Include check');
		if(roles.includes(userRole)){
			console.log('PROCEED');
			next(); // Proceed
		}else{
			res.status(401).end();
		}
	}else if(requestedAccess == roles[1]){// User has requested staff content
		console.log(requestedAccess, userRole , [roles[0],roles[1]],[roles[1],roles[2]].includes(userRole));
		if([roles[1],roles[2]].includes(userRole)){
			//next(); // Proceed
		}else{
			res.status(401).end();
		}		
	}else if(requestedAccess == roles[2]){// User has requested staff content
		if([roles[2]].includes(userRole)){
			//next(); // Proceed
		}else{
			res.status(401).end();
		}		
	}else{
		res.status(500).end();
	}
});
module.exports = router;