const app = require('express')();
const router = require('express').Router();


var request = require('request');


'use strict';
const fs = require('fs');
const dbAuth =  JSON.parse(fs.readFileSync('dbAuthData.json') );
const dbBaseUrl = 'http://'+ dbAuth.username + ':' + dbAuth.password +  '@127.0.0.1:5984/';
const dbUserFindQuery = dbBaseUrl + 'users_global/_find'; 
const findAllLabsUrl = dbBaseUrl + '/labs_global/_find';
const findLabInventoryUrl = dbBaseUrl + '/components_global/_find';
const findComponentTemplateUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentTemplateUrl = dbBaseUrl + '/component_templates_global/';
const postLabUrl = dbBaseUrl + '/labs_global/';
const getComponentTemplatesUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentUrl = dbBaseUrl + '/components_global/';
const putComponentUrl = dbBaseUrl + '/components_global/'; // Add id
const findTransactionsUrl = dbBaseUrl + '/transactions_global/_find';
const crypto = require('crypto');
const hashingSecret = "ARandomSecretKey";
const putTransactionsUrl = dbBaseUrl + '/transactions_global';

router.post('/transactions/', function(req,res){
    console.log("PUBLIC router, get transactions for customer ", req.body.user_registration_number);
    
    // Check if password and username matches
    const hash = crypto.createHmac('sha256', hashingSecret)
                        .update(req.body.password)
                        .digest('hex');

    var queryBody = {
                    "selector":{
                    "user_registration_number":{"$eq":req.body.user_registration_number},
                    "user_password":{"$eq":hash},
                    "user_account_approved":{"$eq":1},
                    "active_indicator":{"$eq":1}
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
            if(!body["docs"]){
                res.status(500).end("Server error");
            }
			else if( !body["docs"].length){
                res.status(401).end("User not found");
            }
            else{
                console.log("User exists, continue", body["docs"][0]["_id"]);
                var customerId = body["docs"][0]["_id"];
                request.post(options, (err,res2,body) => {
        
                    if(err){console.log(err);res.status(500).end();}
                    else{
            
                        var options = {
                            url : findTransactionsUrl,
                            json:true,
                            body:{"selector":{"customer":customerId}}
                        };	
                        // Fetch the current version
                        request.post(options, (err,res2,body) => {
                            if(err){console.log(err); res.status(500).json(err);}
                            else{
                                console.log("Found transactions", body);
                                res.status(200).json(body);
                            }
                        });
                    }
                });
            }
        }
    });

    

});


// Get all labs
router.post('/labs/all', function(req,res){
    console.log("PUBLIC router, get labs, requested by ", req.body.user_registration_number);

    // Check if password and username matches
    const hash = crypto.createHmac('sha256', hashingSecret)
                        .update(req.body.password)
                        .digest('hex');
    var queryBody = {
                    "selector":{
                    "user_registration_number":{"$eq":req.body.user_registration_number},
                    "user_password":{"$eq":hash},
                    "user_account_approved":{"$eq":1},
                    "active_indicator":{"$eq":1}
                    }
    };
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
            if(!body["docs"]){
                res.status(500).end("Server error");
            }
			else if( !body["docs"].length){
                res.status(401).end("User not found");
            }
            else{
                // Get labs 
                var options = {
                    url: findAllLabsUrl,
                    json:true,
                    body:{
                        "selector":{}
                    }
                };

                request.post(options, (err,res2,body)=>{
                    if(err){console.log(err);res.end(500).end(err);}
                    else{
                        if(!body || !body["docs"]){
                            res.status(500).end();
                        }else{
                            res.json(body["docs"]);
                        }
                    }
                });
            }
        }
    });
});
// Get lab inventory by id
router.post('/inventory/:labid', function(req,res){
	console.log('LAB Inventory ROUTER for lab', req.params.labid);
    const hash = crypto.createHmac('sha256', hashingSecret)
    .update(req.body.password)
    .digest('hex');

    var queryBody = {
    "selector":{
    "user_registration_number":{"$eq":req.body.user_registration_number},
    "user_password":{"$eq":hash},
    "user_account_approved":{"$eq":1},
    "active_indicator":{"$eq":1}
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
            if(!body["docs"]){
                res.status(500).end("server error");
            }else if( !body["docs"].length){
                res.status(401).end("user not found");
            }else{
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
                try{
                request.post(options, (err,res2,body)=>{
                    if(err){console.log(err);res.end(500).end(err);}
                    else{
                        res.json(body["docs"]);
                    }
                });
                }
                catch(e){
                    res.status(500).end();
                }

            }
        }
    });
	
});

router.post('/create/transactions', function(req,res){
	console.log('LAB Inventory ROUTER for lab', req.params.labid);
    const hash = crypto.createHmac('sha256', hashingSecret)
    .update(req.body.password)
    .digest('hex');

    var queryBody = {
    "selector":{
    "user_registration_number":{"$eq":req.body.user_registration_number},
    "user_password":{"$eq":hash},
    "user_account_approved":{"$eq":1},
    "active_indicator":{"$eq":1}
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
            if(!body["docs"]){
                res.status(500).end("server error");
            }else if( !body["docs"].length){
                res.status(401).end("user not found");
            }else{
                
                // ----------------------------------- BEGIN TRANSACTION CREATION
                const logEnv = "[TRANSACTIONS ROUTER][CREATE]";
                const trans = req.body.transaction;
                var customerId = body["docs"][0]["_id"];
                trans.customer = customerId;
                console.log(logEnv,trans);
                // Check if required columns exist
                if(trans.cart == undefined){
                    console.log(logEnv + " incomplete request");
                    res.status(404).json({status:0,msg:"Incomplete request"});
                }
                
                // Check if customer exists in DB
                    //Query DB, find user
                var queryBody = {
                    "selector":{
                    "_id":{"$eq":trans.customer},
                    "active_indicator":{"$eq":1},
                    "user_account_approved":{"$eq":1}
                    }
                };
                var options = {
                    url : dbUserFindQuery,
                    json:true,
                    body:queryBody
                };
                
                //Return all users with the same regNo
                try{
                request.post(options, (err,res2,body) => {
                        if(err){console.log(err);res.status(500).end();}
                        else{
                            if(!body["docs"].length){
                                //Customer _id does not exist
                                console.log(logEnv + " Customer does not exist");
                                res.status(400).json({status:0,msg:"Customer does not exist"});
                            }else{
                                
                                //Customer does exist
                                // PROCEED
                                // Check if items exist
                                const items = trans.cart;
                                console.log(logEnv + "Checking if following items exist", items);
                                
                                //Send a query with all of
                                ids = [];
                                for(let i = 0; i < items.length; i = i + 1){
                                    ids.push(items[i].component_id);
                                }
                                
                                console.log(logEnv + "Collected ids, sending find request");
                                var queryBody = {
                                    "selector":{
                                        "_id":{
                                            "$in":ids
                                        }
                                    }
                                };
                                var options = {
                                    url : findLabInventoryUrl,
                                    json:true,
                                    body:queryBody
                                };
                                request.post(options, (err,res3,body3) => {
                                        if(err){console.log(err);res.status(500).end();}
                                        else{
                                            console.log(logEnv + "Query results for checking if components exist");
                                            
                                            const returns = body3["docs"];
                                            //Check if all items exist AND there is sufficient quant
                                            var existsList = [];
                                            var perfect = true;
                                            var sufficientQuant = [];
                                            var sufficient = true;
                                            for(let i = 0; i < items.length; i = i + 1){
                                                let exists = false;
                                                let suff = false;
                                                for(let j = 0; j < returns.length; j = j + 1){
                                                    if(returns[j]._id == ids[i]){
                                                        exists = true;
                                                        //Check if sufficient quantity exists
                                                        sufficientQuant.push(returns[j].in_inventory_count - items[i].quantity);
                                                        if(returns[j].in_inventory_count - items[i].quantity < 0){
                                                            sufficient = false;
                                                        }
                                                    }
                                                }
                                                existsList.push(exists);
                                                if(!exists){perfect = false;}
                                            }
                                            
                                            // Inavlid items
                                            console.log(logEnv + "Those items that exist", existsList);
                                            console.log(logEnv + " Inv count - required", sufficientQuant);
                                            if(!perfect){
                                                    console.log(logEnv + "INVALID ITEMS");
                                                    res.status(400).json({status:0,msg:"INVALID ITEMS",payload:{"ids":ids,"exists":existsList}});
                                            }
                                            
                                            //Check if there are sufficient amounts of each item, if not...
                                            //...tell client which items are out of stock and by how much
                                            
                                            else if(!sufficient){
                                                    console.log(logEnv + "NO STOCK");
                                                    res.status(400).json({status:0,msg:"NO STOCK",payload:{"ids":ids,"sufficient":sufficientQuant}});
                                            }
                                            else{
                                                trans.lender = "SELF";
                                                trans.dates = {"opened":Date.now(),"closed":""},
                                                trans.status = {
                                                    "approval_status": "PENDING",
                                                    "due_status": "DUE",
                                                    "return_status": "NOT_RETURNED",
                                                    "date": Date.now(),
                                                    "lender":trans.lender
                                                };
                                                //add to transaction db
                                                trans.status_history = [trans.status];											
                                                var queryBody = {
                                                    "docs":[trans]
                                                };
                                                var options = {
                                                    url : putTransactionsUrl + '/_bulk_docs',
                                                    json:true,
                                                    body:queryBody
                                                };	
                                                request.post(options, (err,res5,body5) => {
                                                if(err){console.log(err);res.status(500).end();}
                                                else{
                                                    console.log(logEnv+ " Transaction success !");
                                                    console.log(logEnv + " body5 ",body5);
                                                    
                                                    // Success, transaction receipt created, now approve receipt if required
                                                    //console.log(logEnv + "Checking if approval required",approvalRequired);
                                                    
                                                    //Transaction created, END
                                                    
                                                    res.status(200).json({status:1,msg:"success",doc_id:body5});
                                                    // :-)
                                                }
                                                });
                        
                                            }
                                        }
                                    }
                                );

                                
                            }
                        }
                    }
                );}
                catch(e){
                    res.status(500).end();
                }
                // ----------------------------------- END TRANSACTION CREATION
            }
        }
    });  
});

module.exports = router
