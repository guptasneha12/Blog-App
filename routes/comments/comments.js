const express=require('express');
const { createCommentCtrl, commentDetailsCtrl, deleteCommentCtrl, updateCommentCtrl } = require('../../controllers/comments/comments');
const protected=require('../../middlewares/protected');
const commentRoutes=express.Router();

// POST/api/v1/comments
commentRoutes.post('/:id',protected,createCommentCtrl);



    // GET/api/v1/comments/:id   
commentRoutes.get('/:id',commentDetailsCtrl);



       // DELETE/api/v1/comments/:id   
commentRoutes.delete('/:id',protected,deleteCommentCtrl);



           // PUT/api/v1/comments/:id   
commentRoutes.put('/:id',protected,updateCommentCtrl);


    module.exports=commentRoutes;