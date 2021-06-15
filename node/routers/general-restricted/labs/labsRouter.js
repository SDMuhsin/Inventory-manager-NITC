const app = require('express')();
const router = require('express').Router();


var request = require('request');
const { route } = require('../profile/profileRouter');


const dbBaseUrl = 'http://admin:qwerty@127.0.0.1:5984/';
const findAllUrl = dbBaseUrl + '/labs_global/_find';
const findLabInventoryUrl = dbBaseUrl + '/components_global/_find';
const findComponentTemplateUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentTemplateUrl = dbBaseUrl + '/component_templates_global/';
const postLabUrl = dbBaseUrl + '/labs_global/';
const getComponentTemplatesUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentUrl = dbBaseUrl + '/components_global/';
const putComponentUrl = dbBaseUrl + '/components_global/'; // Add id
router.get('/', function(req,res){
	console.log('LABS ROUTER');
	var options = {
		url : findAllUrl,
		json:true,
		body:{"selector":{}}
	};
	request.post(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			res.json(body["docs"]);
		}
	});
});
router.get('/inventory/:labid', function(req,res){
	console.log('LAB Inventory ROUTER for lab', req.params.labid);
	
	var selector;
	if(req.params.labid == "all"){
		selector = {};
	}else{
		selector = {"lab_id":req.params.labid};
	}
	var options = {
		url : findLabInventoryUrl,
		json:true,
		body:{"selector":selector}
	};
	request.post(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			res.json(body["docs"]);
		}
	});
});

router.post('/create', function(req,res){
	console.log("CREATE LAB", req.body);
	// Expect body
	/*
		{
			"lab_name": "EC 01",
			"lab_description": "Lorem Ipsum",
			"active_indicator": 1,
			"create_timestamp": ""
		}
	*/
	var options =  {
		url : postLabUrl,
		json : true,
		body: req.body
	};

	request.post( options, (e,r,b) =>{

		if(e){console.log("ERROR ", e); res.json(e)}
		else{
			console.log("Lab created");
			res.status(200).json(body);
		}
	});

});

router.post('/delete', function(req,res){


	var options = {
		url : postLabUrl + req.body._id + '?rev=' + req.body._rev,
		json:true
	};	
	request.delete(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			console.log("DELETE Success...probably",body);
			res.status(200).json(body);
		}
		}
	);	
});
router.post('/inventory/components/by_ids', function(req,res){
	console.log('LAB components for component ids', req.body.component_ids);
	
	var selector;
	var options = {
		url : findLabInventoryUrl,
		json:true,
		body:{"selector":
			{
				"_id":{
					"$in":req.body.component_ids
				}
			}
		}
	};
	request.post(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			console.log("[GET COMPONENTS BY ID]" , body["docs"]);

			if(body && body["docs"]){
				res.json(body["docs"]);
			}else{
				res.status(500).end("Just refresh");
			}
		}
	});
});

router.post('/inventory/component', function(req,res){
	console.log("Lab ROUTER, add component");
	/*
	 Expecting body
	 {
		 "name":"",
		 "lab_id":"",
		 "template_id":""
		 ... other stuff ..
	 }
	*/
	//Check if this component exists for this lab
	selector = JSON.parse(JSON.stringify(req.body));
	delete selector.total_count;
	var options = {
	url : findLabInventoryUrl,
	json:true,
	body:{"selector":selector}
	};
	request.post(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			
			if(body["docs"].length == 0){
				//No dupes
				var options = {
					url : postComponentUrl,
					json:true,
					body:req.body
				};
						request.post(options, (err,res3,body2)=>{
							if(err){console.log(err);res.end(500).end(err);}
							else{
								console.log("Response to post component",body2);
								res.send(body2);
							}
						});	
			}else{
				//Dupes
				console.log("dupes");
				res.status(400).json({status:0,error:{error_code:0,error_message:"Component under the same name for the same lab already exists"}});
			}
		}
	});
	console.log(req.body);

	
});
router.post('/template', function(req,res){
	console.log("Lab ROUTER, add template");
	/*
	 Expecting body
	 {
		 "template_name":"",
		 "component_properties":[
		 {"property_name":"","property_value_type"}
		 {"property_name":"","property_value_type"}
		 ]
	 }
	*/
	console.log(req.body);
	//Step 1 : Check if this component exists
	var name = req.body.template_name;
	var options = {
		url : findComponentTemplateUrl,
		json:true,
		body:{"selector":{"template_name":name}}
	};
	
	request.post(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			console.log("Response to dup check",body);
			if(body["docs"].length == 0){
				//No duplicates
				
				
				// Post document without id
					var options = {
						url : postComponentTemplateUrl,
						json:true,
						//headers:{'Content-Type':'application/json'},
						body:req.body
					};
				request.post(options, (err,res3,body3)=>{
					if(err){console.log(err);res.end(500).end(err);}
					else{
						res.json(body3);
					}
				});
				
			}else{
				res.status(400).json({status:0,error:{error_code:0,error_message:"Component Type already exists"}})
			}
		}
	});
});

router.get('/template/all', function(req,res){
	console.log("Lab ROUTER, get templates");
	/*
	 Expecting body
	 {
		
	 }
	*/
	console.log(req.body);
	//Step 1 : Check if this name exists
	var name = req.body.template_name;
	var options = {
		url : getComponentTemplatesUrl,
		json:true,
		body:{"selector":{}}
	};
	
	request.post(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			console.log("Response to dup check",body);
			if(body["docs"].length == 0){
				//No templates found ---> Shouldnt happen...
				res.status(400).json({status:0,error:{error_code:0,error_message:"No templates found"}})
				
			}else{
				res.status(200).json(body["docs"]);
			}
		}
	});	
});

//UPDATE (PUT)
router.put('/inventory/component', function(req,res){
	console.log("Lab ROUTER, UPDATE(PUT) component");
	/*
	 Expecting body
	 {
		 _id:"",
		 stuff
	 }
	*/
	//console.log(req.body);
	

	var options = {
		url : putComponentUrl + req.body._id,
		json:true,
		body:req.body
	};	
	request.put(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			console.log("UPDATE Success...probably",body);
			res.status(200).json(body);
		}
		}
	);		

});

//DELETE 
router.post('/inventory/component/delete', function(req,res){
	console.log("Lab ROUTER, DELETE component");
	console.log("Lab ROUTER, DELETE component");
	console.log("Lab ROUTER, DELETE component");
	console.log("Lab ROUTER, DELETE component");
	console.log("Lab ROUTER, DELETE component");
	/*
	 Expecting body
	 {
		 _id:"",
		 stuff
	 }	*/
	console.log(req.body);
	console.log("Lab ROUTER, DELETE component");
	console.log("Lab ROUTER, DELETE component");
	console.log("Lab ROUTER, DELETE component");
	console.log("Lab ROUTER, DELETE component");
	console.log("Lab ROUTER, DELETE component");
	console.log("Lab ROUTER, DELETE component");

	var options = {
		url : putComponentUrl + req.body._id + '?rev=' + req.body._rev,
		json:true
	};	
	request.delete(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			console.log("DELETE Success...probably",body);
			res.status(200).json(body);
		}
		}
	);	
})
module.exports = router;