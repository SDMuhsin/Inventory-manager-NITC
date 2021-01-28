const app = require('express')();
const router = require('express').Router();
const cookieParser = require('cookie-parser');

router.all( '/', (req,res,next)=>{
	console.log('[STUDENT CONTENT ROUTER][GATEWAY]');
	res.status(200).end();
});

module.exports = router;