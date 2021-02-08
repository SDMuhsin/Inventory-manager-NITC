const app = require('express')();
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
var request = require('request');
const jwtKey = 'mykey';

const validRoles = ['Student','Staff','Admin'];

function checkAuth(){
	return function(req,res,next){
		
		const logEnv = '[AUTHORIZE MIDDLEWARE][TOKEN CHECK]';
		console.log(logEnv);
		//Get token
		const token = req.cookies.token;
		console.log(logEnv + 'GOT COOKIES',token);
		if(!token){
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
	
}

function validateRole(requiredAccess){
	
	return function(req,res,next){
		
			
	const logEnv = '[AUTHORIZE MIDDLEWARE][ROLE CHECK]';
	console.log(logEnv + "Access level required", requiredAccess);
	
	const userRole = req.user.access_level;
	
	
	//If no such role exists
	if(!validRoles.includes(requiredAccess)){
		console.log(logEnv + 'No such role as ' + requiredAccess);
		res.status(404).end();
	}
	
	console.log('[AUTHORIZE MIDDLEWARE][ROLE CHECK]');
	console.log( logEnv + ' Route access level required : ' + requiredAccess);
	console.log( logEnv + ' User role : ' + userRole);
	//Check if the role required to continue this path is allowed to this user
	if(requiredAccess == validRoles[0]){ // User has requested student content
		
		console.log('Include check');
		if(validRoles.includes(userRole)){
			console.log('PROCEED');
			next(); // Proceed
		}else{
			res.status(401).end();
		}
	}else if(requiredAccess== validRoles[1]){// User has requested staff content
		//console.log(requiredAccess, userRole , [roles[0],roles[1]],[roles[1],roles[2]].includes(userRole));
		if([validRoles[1],validRoles[2]].includes(userRole)){
			next(); // Proceed
		}else{
			res.status(401).end();
		}		
	}else if(requiredAccess == validRoles[2]){// User has requested staff content
		if([validRoles[2]].includes(userRole)){
			console.log("PROCEED AS ADMIN");
			next(); // Proceed
		}else{
			res.status(401).end();
		}		
	}else{
		res.status(500).end();
	}
		
	}
}

exports.authCheck = checkAuth;
exports.validateRole = validateRole;