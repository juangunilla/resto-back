const express =require('express')
const router = express.Router();
const{getItems,postItem,updateItem}=require('../controllers/entregas')
const check= require('../middlewares/auth')

router.get('/', getItems)
router.put('/:_id',updateItem)
router.post('/',postItem)



module.exports=router;