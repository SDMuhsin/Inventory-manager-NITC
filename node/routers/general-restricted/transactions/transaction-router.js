const app = require('express')();
const router = require('express').Router();

var request = require('request');
const validRoles = ['Student','Staff','Admin'];

'use strict';
const fs = require('fs');
const dbAuth =  JSON.parse(fs.readFileSync('dbAuthData.json') );
const dbBaseUrl = 'http://'+ dbAuth.username + ':' + dbAuth.password +  '@127.0.0.1:5984/';
const findLabInventoryUrl = dbBaseUrl + '/components_global/_find';
const findComponentTemplateUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentTemplateUrl = dbBaseUrl + '/component_templates_global/';
const getComponentTemplatesUrl = dbBaseUrl + '/component_templates_global/_find';
const postComponentUrl = dbBaseUrl + '/components_global/';
const authGuard = require('../../../services/middleware/role-checker');

const putComponentUrl = dbBaseUrl + '/components_global/'; // Add id
const dbUserFindQuery = dbBaseUrl + 'users_global/_find'; 
const putTransactionsUrl = dbBaseUrl + '/transactions_global';
const findAllTransactionsUrl = dbBaseUrl + '/transactions_global/_find';

// Return all transactions
const viewTransactions = dbBaseUrl + 'transactions_global/_design/get_transactions/_view/'; // Add to this
const approvedTransactions = dbBaseUrl + 'transactions_global/_design/get_transactions/_view/approved_transaction';
const pendingTransactions = dbBaseUrl + 'transactions_global/_design/get_transactions/_view/pending_transaction';
const closedTransactions = dbBaseUrl + 'transactions_global/_design/get_transactions/_view/closed_transaction';


router.get('/view/:approval_status', function(req,res){
	const logEnv = "[TRANSACTIONS ROUTER][VIEW]";
	
	console.log(logEnv);
	
	var options = {
		url : viewTransactions + req.params.approval_status,
		json:true
	};
	
	request.get(options, (err,res2,body)=>{
		if(err){console.log(err);res.end(500).end(err);}
		else{
			console.log(logEnv + "Returned from DB...");
			console.log(logEnv + "approval status was", req.params.approval_status);
			console.log(logEnv + "approval URL was", viewTransactions + req.params.approval_status);
			res.json(body);
		}
	});
});

//Create transactions
// WARNING : CALLBACK HELL AHEAD
router.post('/create2', function(req,res){
	/*
	Expected body 
	{
	  "type": "lend",
	  "customer": "B170011EC",
	  "lender": "ADMA",
	  "comments": [
		"Test comment"
	  ],
	  "cart": [
		{
		  "component_id": "123",
		  "quantity": 5
		}
	  ]
	}
	*/
	const logEnv = "[TRANSACTIONS ROUTER][CREATE]";
	const trans = req.body;
	console.log(logEnv,trans);
	// Check if required columns exist
	if(trans.customer == undefined  || trans.cart == undefined){
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
				if(!body["docs"]){
					res.status(500).end()
				}
				else if(!body["docs"].length){
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
									trans.lender = req.user.username;
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
	
});

// Approve transaction
router.post('/approve',function(req,res){
	/* Expected body 
		{
		"_id":"qweqweqwe",
		"_rev":"qweqwe",
		"approval":APPROVED/DENIED
		}
	*/	
	//Check access level quick
	if( [validRoles[0],validRoles[1],validRoles[2]].includes(req.user.access_level) ){
	const logEnv = "[TRANSACTIONS ROUTER][APPROVE]";
	const id = req.body._id;
	console.log(logEnv+ " transaction ID : ",id);
	
	
	// Just change status to "approve...."
	// But we need status object...
	// so we need to fetch first :(
	var options = {
		url : findAllTransactionsUrl,
		json:true,
		body:{"selector":{"_id":id}}
	};	
	
	// Fetch the current version
	request.post(options, (err,res2,body) => {
		if(err){console.log(err);res.status(500).json({status:0,msg:" Couldnt find transaction or some DB error"});}
		else{
			console.log(logEnv + " Found transaction in DB");
			//console.log(logEnv + " Body" , body);
			
			// Check if transaction is already approved
			const tr = body["docs"][0];
			if(tr.status.approval_status == "APPROVED"){
				console.log(logEnv + " Transaction already approved");
				res.status(404).json({status:0,msg:"TRANSACTION ALREADY APPROVED"});
			}
			else{
				
				//CHECK IF TRANSACTION ITEMS EXIST and if there is sufficient quantity in stock
				// [ S T A R T ] 
					const items = tr.cart;
					console.log(logEnv + "Checking if following items exist", items);
					
					//Send a query with all of
					ids = [];
					for(let i = 0; i < items.length; i = i + 1){
						ids.push(items[i].component_id);
					}
					
					console.log(logEnv + " Collected ids, sending find request");
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
									// Subtract item counts from database
									//[DB LATCH START]
									for(let i = 0; i < returns.length; i = i + 1){
										returns[i].in_inventory_count = sufficientQuant[i];
									}
									var queryBody = {
										"docs":returns
									};
									var options = {
										url : putComponentUrl + '/_bulk_docs',
										json:true,
										body:queryBody
									};	
									
									//Change item counts in DB
									request.post(options, (err,res4,body4) => {
										if(err){console.log(err);res.status(500).end();}
										else{
											// Succesfully updated DB !
											console.log(logEnv + "DB update success");
											console.log(logEnv + "BODY4", body4);
											
									//		[DB LATCH END]*/
											console.log(logEnv + " Approval status" + req.body.approval_status);	
											tr.dates = {"opened":Date.now(),"closed":""},
											tr.status = {
												"approval_status": req.body.approval_status,
												"due_status": "DUE",
												"return_status": "NOT_RETURNED",
												"date": Date.now(),
												"lender":req.user.username
											};
											//add to transaction db
											if(tr.status_history.length ==0){
											
												tr.status_history = [tr.status];		
											}else{
												let temp = tr.status_history;
												temp.push(tr.status);
												tr.status_history = temp;
											}	
											var queryBody = {
												"docs":[tr]
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
									}}
									//[DB LATCH START 2]}}
									);//					[DB LATCH END 2]*/				
								}
								
								
								// Approve if required
							}
						}
					);
				// [ E N D ]
			
				/* PATCH TRANSACTION
				tr.status.approval_status = "APPROVED";
				tr.status.date = Date.now();
				tr.status.lender = req.user.username;
				tr.status_history = tr.status_history.push(tr.status);
				
				//Patch to DB (Item counts first)
				
				// Check if enough items exist
				
				var options = {
					url : putTransactionsUrl + '/_bulk_docs',
					json:true,
					body:{
					"docs":[tr]
				}
				};	
				console.log(logEnv + "transaction", tr);
				request.post(options, (err,res3,body3) => {
					if(err){console.log(err);res.status(500).json({status:0,msg:"Error patching transaction"});}
					else{
						
						console.log(logEnv + " Success approving transaction, body3",body3);
						res.status(200).json(body3);
					}}
				);*/
			}
			
		}
	}
	);}
	else{
		res.status(401).json({msg:"Students cant access this"});
	}
}
);

// Close transaction
/*
	This can be  : Full return and partial return
	Based on time stamps, we can compute whether is was due or not
	[TO DO (I think)]To the receipt : 1. APPROVAL_STATUS : APPROVED -> CLOSED
					 2. DUE_STATUS  : DUE -> CLOSED
					 3. RETURN_STATUS : FULL_RETURN / PARTIAL_RETURN / FAILED_TO_RETURN
					 
	Expected body 
	{
		"transaction_id" : "eqwddf",
		"return type" : "FULL_RETURN / PARTIAL_RETURN / FAILED_TO_RETURN",
		"return_cart" : [{"id_":2,"quantity":5}]
	}
*/
router.post('/close', function(req,res){
	const logEnv = "[TRANSACTION ROUTER][CLOSE]";
	// Check access level
	if( [validRoles[0],validRoles[1],validRoles[2]].includes(req.user.access_level) ){	
		
		console.log(logEnv + "access level verified");
		
		const body = req.body;
		// Get the receipt from db
		var options = {
			url : findAllTransactionsUrl,
			json:true,
			body:{"selector":{"_id":body.transaction_id}}
		};	
		
		// Fetch the current reciept
		console.log(logEnv + "Fetching current receipt");
		request.post(options, (err,res2,body2) => {
			if(err){console.log(err);res.status(500).json({status:0,msg:" Couldnt find transaction or some DB error"});}
			else{
				console.log(logEnv + "Receipt found");
				// Receipt obtained
				const trnsRcpt = body2["docs"][0];
				
				// Check if receipt is already closed
				if(trnsRcpt.status.approval_status == 'CLOSED'){
					console.log(logEnv + " Transaction already closed");
					res.status(400).json({msg:"transaction already closed"});
				}
				else{
					const oCart = trnsRcpt.cart;
					const rCart = req.body.return_cart;
					
					// Get items from DB
					// Add the receipt's count to their count
					// Update items to DB
					
					console.log(logEnv + " fetching original cart items from DB");
					ids = [];
					for(let i = 0; i < oCart.length; i = i + 1){
						ids.push(oCart[i].component_id);
					}
					
					console.log(logEnv + "Collected cart item ids, sending find request");
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
					request.post(options,(err,res3,body3)=>{
						if(err){console.log(err);res.status(500).end()}
						else{
							
							if(0){ // DB conflict error...
								console.log( logEnv + "Items obtained failed");
							}else{
								console.log(logEnv + "Items found");
								console.log(logEnv + "body3", body3);
								const items = body3["docs"];
								
								// Find new Update item quantities
								//Case 1 : ALL...
								console.log(logEnv + "case ALL");
								if(1){
									
									// New cart item in_inventory_count + = rCart.item.quantity
									
									// ASSUMPTION : The items come in order
									console.log(logEnv + "oCart.length == items.length ? ", oCart.length == items.length);
									for(let i = 0; i < items.length; i = i + 1){
										items[i].in_inventory_count += rCart[i].quantity; // Add returned items to inventory
										console.log(logEnv + "oCart[i].quantity - rCart[i].quantity",oCart[i].quantity - rCart[i].quantity);
										if(items[i].lost_count == undefined){
											items[i].lost_count = oCart[i].quantity - rCart[i].quantity;
										}
										else{
											items[i].lost_count += oCart[i].quantity - rCart[i].quantity; // Add missing items to inventory ledger
										}
										
									}
									console.log(logEnv + " items count updated (locally), patching to DB");
									var queryBody = {
										"docs":items
									};
									var options = {
										url : putComponentUrl + '/_bulk_docs',
										json:true,
										body:queryBody
									};	
									
									//Change item counts in DB
									request.post(options, (err,res4,body4) => {
										if(err){console.log(err);res.status(500).end();}
										else{
											if(0){}// DB patch error 
											{
												console.log(logEnv + "Item counts patched to DB")
												//Update receipt
												trnsRcpt.status.approval_status = 'CLOSED';
												trnsRcpt.status.return_status = req.body.return_type;
												
												
												const tr = trnsRcpt;
												tr.dates.closed = Date.now();//{"opened":Date.now(),"closed":""},
												tr.status.approval_status = "CLOSED";
												tr.status.lender = req.user.username;
												tr.status.date = Date.now();
												tr.status.returned = rCart; // To keep track of what was returned 
												//add to transaction db
												if(tr.status_history.length ==0){
												
													tr.status_history = [tr.status];		
												}else{
													let temp = tr.status_history;
													temp.push(tr.status);
													tr.status_history = temp;
												}	
												var queryBody = {
													"docs":[tr]
												};
												var options = {
													url : putTransactionsUrl + '/_bulk_docs',
													json:true,
													body:queryBody
												};	
												request.post(options, (err,res5,body5) => {
													if(err){console.log(err);res.status(500).end();}
													else{
														console.log(logEnv+ " Patch Transaction success !");
														console.log(logEnv + " body5 ",body5);
														// Success, transaction receipt created,
														//console.log(logEnv + "Checking if approval required",approvalRequired);
														//Transaction created, END
														res.status(200).json({status:1,msg:"success",doc_id:body5});
														// :-)
													}
												});

												
											}
										}}
									);

								}
								else{
									res.status(400).json({msg:" no return type specified"});
								}
							}
								
						}
				});
				}
			}
			}
		);
		
		
	}
	else{
		res.status(401).end();
	}

	
	
	// Case partial return
	
	// Case failed to return
});

module.exports = router