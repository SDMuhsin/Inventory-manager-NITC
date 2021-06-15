const express = require("express");
const router = express.Router();
const http = require('http');
var request = require('request');
const jwt = require('jsonwebtoken');

const dbBaseUrl = 'http://admin:qwerty@127.0.0.1:5984/';
const dbUserFindQuery = 'http://admin:qwerty@127.0.0.1:5984/users_global/_find'; 
const secretKey = "mykey";

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

const roles = ['Student','Staff','Admin'];

router.post('/register', (req,res)=>{
	
	/*
	Body contains
	username
	password
	access_level
	*/
	
	//Identify access level requested
	const requestedAccessLevel = req.body.access_level;
	const regNo = req.body.username.toUpperCase();
	if(roles.includes(requestedAccessLevel)){ // Student
			
			//Check if reg number exists
			const duplicateRegNoQuery = 'users_global/_find';
			const putUserQuery = 'users_global/';
			const queryBody = {
				"selector":{
					"user_registration_number":{"$eq":regNo}
			}};
			
			var options = {
				url : dbBaseUrl + duplicateRegNoQuery,
				json:true,
				body:queryBody
			};
			
			//Return all users with the same regNo
			request.post(options, (err,res2,body) => {
				if(err){console.log(err);res.end(500).end(err);}
				else{
					//console.log(body);
					//res.json(body);
					
					//If duplicates found
					if(body["docs"].length != 0){
						const response = {
							"status":0,
							"error":{
								"error_code":0,//Duplicates
								"error_message":"The username already exists"
							}
						};
						res.status(406).json(response);
					}
					//New user
					else{
						//Add new User
						options.url = dbBaseUrl + putUserQuery;
						options.body = {
						  "user_name": "",
						  "user_password": req.body.password,
						  "user_access_level": requestedAccessLevel,
						  "user_registration_number":regNo ,
						  "user_email": "",
						  "user_contact": "",
						  "user_account_approved": 0,
						  "active_indicator": 1,
						  "create_timestamp": ""
						};
						request.post(options,(err,res3,body3)=>{
							if(err){console.log(err);res.status(500).end()}
							else{
								//console.log(body3);
								res.status(200).json({
									"status":1,
									"error":{}
								});
							}
						});
					}
				}
			})
	}
});

router.post('/login', (req,res) =>  {
	/*
	Body contains
	username
	password
	*/
	console.log("LOGING IN");
	
	//Query db and find user
	const requestedAccessLevel = req.body.access_level;
	const regNo = req.body.username.toUpperCase();
	const userPassword = req.body.password;
	

	//Query DB, find user
	var queryBody = {
		"selector":{
			"user_registration_number":{"$eq":regNo},
			"user_password":{"$eq":req.body.password},
	}};
	var options = {
		url : dbUserFindQuery,
		json:true,
		body:queryBody
	};
	
	//Return all users with the same regNo
	request.post(options, (err,res2,body) => {
		
		if(err){console.log(err);res.status(500).end();}
		else{
			//Check if such a user exists
			if( !body["docs"].length){
				
				//No user found, check if password match issue
				queryBody["selector"] = {"user_registration_number":{"$eq":regNo}};
				options.body = queryBody;
				
				//Check for user without password
				request.post(options, (err3,res3,body3)=>{
					if(err){console.log(err);res.status(500).end();}
					else{
						if(!body3["docs"].length){
							const response = {
								"status":0,
								"error":{
									"error_code":2,//No such user
									"error_message":"No such user found"
							}
							};
							res.status(406).json(response);		
						}else{
							res.status(406).json({
								"status":0,
								"error":{
									"error_code":3,//Password incorrect
									"error_message":"Possibly incorrect password"
							}
							});
						}
					}
				});
	
			}else{
				console.log("USER EXISTS");
				//User found, check access level
				const requestedAccessLevel = body["docs"][0]["user_access_level"];
				console.log("USER ACCESS LEVEL", requestedAccessLevel);
				if(roles.includes(requestedAccessLevel)){
				token = jwt.sign(
				{
					sub: body["docs"][0]["_id"],
					username:regNo,
					access_level:requestedAccessLevel,
					verified:body["docs"][0]["user_account_approved"]
				},
				secretKey,
				{algorithm:"HS256",expiresIn:"3 hours"}
				);
				console.log('TOKEN SENT',token);
				res.cookie("token",token,{
					maxAge: 60*60*3* 1000
				});					
				res.cookie("session",{"access_level":body["docs"][0]["user_access_level"],"verified":body["docs"][0]["user_account_approved"]},{
					domain:'.app.localhost',
					path:'/',
					HttpOnly:false,
					maxAge: 60*60*3* 1000
				});
				res.status(200).json({
					"status":1,
					"error":{},
					'cookies':{"token":token,"access_level":body["docs"][0]["user_access_level"],"verified":body["docs"][0]["user_account_approved"]}
				});
			}}
		}
	});
	
	
});
module.exports = router;