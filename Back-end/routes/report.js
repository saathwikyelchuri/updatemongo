const express=require('express');

const {handleLoginDetails,handleUploading,handleReport,handleModel,handleMe,handleGet}=require('../controllers/report');


const router=express.Router();

router.post('/login',handleLoginDetails);
router.post('/photos',handleUploading);
router.get('/reports',handleReport);
router.post('/model',handleModel);
router.post('/me',handleMe);
router.get('/finalresult',handleGet);

module.exports=router;