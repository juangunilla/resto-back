const express =require('express')
const router = express.Router();
const multer= require('multer');
const{getItems,getUsuarios,postItem,profile,updateItem,updateCorreo,uploader,updateAvatar,avatar}=require('../controllers/user')
const check= require('../middlewares/auth')

//configuracion de subida
const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./img/upload/')
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 megabytes (en bytes)
      },

    filename:(req,file,cb)=>{
        cb(null,'avatar-'+Date.now()+'-'+file.originalname)
    }
})

const upload = multer({storage})

router.post('/login', getItems)
router.get('/lista', getUsuarios)
router.post('/register',postItem)
router.get('/profile/:_id',profile)
router.put('/update/:_id',updateItem)
router.put('/correo/:_id',updateCorreo)
router.post('/upload/:_id',[check.auth,upload.single('file')],uploader)
router.put('/avatar/:_id',updateAvatar)
router.get('/avatar/:file',avatar)

module.exports=router;