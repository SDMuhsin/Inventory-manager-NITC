const app = require('express')();
const router = require('express').Router();


var request = require('request');


const dbBaseUrl = 'http://admin:qwerty@127.0.0.1:5984/';
const findAllUrl = dbBaseUrl + '/labs_global/_find';
const findLabInventoryUrl = dbBaseUrl + '/components_global/_find';
const findComponentTemplateUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentTemplateUrl = dbBaseUrl + '/component_templates_global/';
const getComponentTemplatesUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentUrl = dbBaseUrl + '/components_global/';
const putComponentUrl = dbBaseUrl + '/components_global/'; // Add id

const necessaryDBs = ["component_templates_global","components_global","items_global","labs_global","transactions_global","users_global"]

router.put('/make/:labname', function(req,res){
    console.log("dbs ROUTER, make dbs, make db : ", req.params.labname);
    
    var options = {
		url : dbBaseUrl + '_all_dbs'
	};

	request.get(options, (err,res2,body)=>{
		if(err){console.log("ERROR");res.end(500).end(err);}
		else{
            
            body = JSON.parse(body);
            console.log("dbs ROUTER, completed  check dbs : Response from DB : ", body);
            var o = {"status":0,"msg":""};
            
            // Check if DB already exists
            console.log("Exists ? ", body.includes(req.params.labname));
            if( body.includes(req.params.labname)){
                // All exists
                o["msg"] = "Already exists";
                res.json(o);
            }else{
                
                var options2 = {
                    url : dbBaseUrl + req.params.labname
                };            
                // Make it
                console.log("Making db ", req.params.labname);
                request.put( options2, (e3,r3, b3) =>{
                    if(e3){console.log("ERROR");res.end(500).end(err);}
                    else{
                        console.log("Made db....ig..",b3);
                        b3 = JSON.parse(b3);

                        if(!b3["error"] && req.params.labname == 'users_global'){
                            // Need to make default account
                            var ob = {
                                "_id": "9c61da29289e604db0daf3cbff00a8eb",
                                "_rev": "2-0a685312a6b675d222b488426b08dbae",
                                "user_name": "",
                                "user_password": "admin",
                                "user_access_level": "Admin",
                                "user_registration_number": "ADMIN",
                                "user_email": "",
                                "user_contact": "",
                                "user_account_approved": 1,
                                "active_indicator": 1,
                                
                              };
                              var options2 = {
                                url : dbBaseUrl + 'users_global',
                                body : ob
                              };     
                              request.post( options2, (e4,r4,b4) =>{
                                if(e3){console.log("ERROR");res.end(500).end(err);}
                                else{
                                    console.log("Created new admin user, response", b4);
                                }
                              });
                        }
                        else{
                            if(b3["error"]){
                                o["msg"] = b3["error"];
                                res.json(o);
                            }else{
                                o["status"] = 1;
                                res.json(o);
                            }
                        }
                    }

                });
            }
            
		}
	});
});

router.get('/check', function(req,res){
	console.log("dbs ROUTER, check dbs");
    var options = {
		url : dbBaseUrl + '_all_dbs'
	};

	request.get(options, (err,res2,body)=>{
		if(err){console.log("ERROR");res.end(500).end(err);}
		else{
            //console.log("dbs ROUTER, check dbs : Response from DB : ", res2);
            body = JSON.parse(body);
            
            var o = {};
            flag = 0;
            for(let i = 0; i < necessaryDBs.length; i++){
                o[necessaryDBs[i]] = body.includes( necessaryDBs[i]);
                if( !o[necessaryDBs[i]]){
                    flag = 1;
                }
            }
            
            res.json(o);
		}
	});
});

module.exports = router;