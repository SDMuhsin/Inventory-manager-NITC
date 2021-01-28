const app = require('express')();
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
var request = require('request');

const dbUserFindQuery = 'http://admin:qwerty@127.0.0.1:5984/users_global/_find'; 

const roles = [
	"student",
	"staff",
	"admin"
];

router.get('/', function(req,res){
	//Query DB, find user
	var queryBody = {
		"selector":{
			"user_registration_number":{"$eq":req.user.username}
	}};
	var options = {
		url : dbUserFindQuery,
		json:true,
		body:queryBody
	};	
	console.log('VIEW PROFILE REQUEST FROM');
	console.log(req.user);
	
	//Return all users with the same regNo
	request.post(options, (err,res2,body) => {
		if(err){console.log(err);res.status(500).end();}
		else{
			//Check if such a user exists
			if(!body["docs"].length){
				console.log("NO SUCH USER");
				res.status(401).end();
			}else{
				//console.log(body["docs"][0]);
				var userWithoutPassword = {
					user_name: body["docs"][0].user_name,
					user_access_level: body["docs"][0].user_access_level,
					user_registration_number: body["docs"][0].user_registration_number,
					user_email: body["docs"][0].user_email,
					user_contact: body["docs"][0].user_contact,
					user_account_approved: body["docs"][0].user_account_approved,
					active_indicator: body["docs"][0].active_indicator
				};
				res.status(200).send(
				userWithoutPassword
				);
			}
		}
	});
});

module.exports = router;