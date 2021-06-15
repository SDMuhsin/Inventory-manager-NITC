const app = require('express')();
const router = require('express').Router();

var request = require('request');
const validRoles = ['Student','Staff','Admin'];

const dbBaseUrl = 'http://admin:qwerty@127.0.0.1:5984/';
const findLabInventoryUrl = dbBaseUrl + '/components_global/_find';
const findComponentTemplateUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentTemplateUrl = dbBaseUrl + '/component_templates_global/';
const getComponentTemplatesUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentUrl = dbBaseUrl + '/components_global/';
const authGuard = require('../../../services/middleware/role-checker');

const putComponentUrl = dbBaseUrl + '/components_global/'; // Add id
const dbUserBulkUpdate = 'http://admin:qwerty@127.0.0.1:5984/users_global/_bulk_docs'; 
const dbUserFindQuery = 'http://admin:qwerty@127.0.0.1:5984/users_global/_find'; 
const putTransactionsUrl = dbBaseUrl + '/transactions_global';
const findAllTransactionsUrl = dbBaseUrl + '/transactions_global/_find';
/*
	T O  D O : Add verification selection to getActiveUsers
	T O  D O : Role restrict approve accoutns

*/
router.get('/users/all/active',function(req,res){
	
	const logEnv = "[ACCOUNTS ROUTER][GET ALL ACTIVE USERS]";
	
	const queryBody = {
	"selector":{
		"active_indicator":{"$eq":1}
	}};

	var options = {
	url : dbUserFindQuery,
	json:true,
	body:queryBody
	};

	//Return all users with the same regNo
	request.post(options, (err,res2,body) => {
	if(err){console.log(err);res.end(500).end(err);}
	else{
		console.log(logEnv + "Found users", body["docs"].length);
		res.status(200).json(body["docs"]);
	}});
});

router.get('/users/approved/:role',function(req,res){
	
	const logEnv = "[ACCOUNTS ROUTER][GET ROLE WISE APPROVED USERS]";
	
	
	
	const queryBody = {
	"selector":{
		"active_indicator":{"$eq":1},
		"user_access_level":{"$eq":req.params.role},
		"user_account_approved":{"$eq":1}
	}};

	var options = {
	url : dbUserFindQuery,
	json:true,
	body:queryBody
	};

	//Return all users with the same regNo
	request.post(options, (err,res2,body) => {
	if(err){console.log(err);res.end(500).end(err);}
	else{
		console.log(logEnv + "Found users", body["docs"].length);
		res.status(200).json(body["docs"]);
	}});
});
router.get('/users/pending/:role',function(req,res){
	
	const logEnv = "[ACCOUNTS ROUTER][GET ROLE WISE PENDING USERS]";
	
	const queryBody = {
	"selector":{
		"active_indicator":{"$eq":1},
		"user_access_level":{"$eq":req.params.role},
		"user_account_approved":{"$eq":0}
	}};

	var options = {
	url : dbUserFindQuery,
	json:true,
	body:queryBody
	};

	//Return all users with the same regNo
	request.post(options, (err,res2,body) => {
	if(err){console.log(err);res.end(500).end(err);}
	else{
		console.log(logEnv + "Found users", body["docs"].length);
		res.status(200).json(body["docs"]);
	}});
});

router.post('/users/approve',function(req,res){
	
	const logEnv = "[ACCOUNTS ROUTER][Approve users]";
	console.log(logEnv + "body :");
	console.log(req.body);
	/*
		Expected body:
		
		{
			"ids":[....]
		}
	*/
	// Find the accounts, get _rev
	// Then just bulk update

	var queryBody = {
		"selector":  { "_id" : {"$in":req.body.ids}}
	};
	console.log(logEnv + "body");
	console.log(queryBody);
	//Return all users with the same regNo
	request.post({
		url : dbUserFindQuery,
		json:true,
		body:queryBody
	}, (err,res2,body) => {
	if(err){console.log(err);res.json(err);}
	else{
		//console.log(logEnv + "Found users", body);
		
		if(body["docs"].length){
			var qb = body["docs"].map( e => { e.user_account_approved = 1;return e;} );
			var qb = {"docs":qb};
			
			console.log(logEnv + "UPdate query body", qb);
			
				request.post( {
					url : dbUserBulkUpdate,
					json:true,
					body:qb
				} ,
				(err,res2,body) => {
				if(err){console.log(err);res.json(err);}
				else{
					console.log(logEnv + "approved users", body);
					res.status(200).json(body["docs"]);
				}});
			
		}else{
			res.status(500).json(body["docs"]);
		}
	}});
});

router.post('/users/deactivate',function(req,res){
	
	const logEnv = "[ACCOUNTS ROUTER][Deactivate users]";
console.log(logEnv + "body :");
	console.log(req.body);
	/*
		Expected body:
		
		{
			"ids":[....]
		}
	*/
	// Find the accounts, get _rev
	// Then just bulk update

	var queryBody = {
		"selector":  { "_id" : {"$in":req.body.ids}}
	};
	console.log(logEnv + "body");
	console.log(queryBody);
	//Return all users with the same regNo
	request.post({
		url : dbUserFindQuery,
		json:true,
		body:queryBody
	}, (err,res2,body) => {
	if(err){console.log(err);res.json(err);}
	else{
		//console.log(logEnv + "Found users", body);
		
		if(body["docs"].length){
			var qb = body["docs"].map( e => {e.active_indicator = 0;return e;} );
			var qb = {"docs":qb};
			
			console.log(logEnv + "UPdate query body", qb);
			
				request.post( {
					url : dbUserBulkUpdate,
					json:true,
					body:qb
				} ,
				(err,res2,body) => {
				if(err){console.log(err);res.json(err);}
				else{
					console.log(logEnv + "approved users", body);
					res.status(200).json(body["docs"]);
				}});
			
		}else{
			res.status(500).json(body["docs"]);
		}
	}});
});
module.exports = router;