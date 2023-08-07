require("dotenv").config()

const express = require('express');
const cors = require('cors');
const htaccess = require('express-htaccess-middleware');


const app = express()
app.use(cors({
    credentials:true
}));

app.use(htaccess({
    file: __dirname + '/.htaccess'
  }));


require('./models/index')
// const {isAuthorize} = require('./middleware/auth')

app.use(express.json());

const {isAuthorize} = require('./middleware/Auth')


app.use(express.static('public'))

const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'./public/image'))

    },


    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname
        cb(null,name)

    }
})

const filefilter = (req,file,cb)=>{
    (file.mimetype == 'image/jpeg'  ||file.mimetype == 'image/png'  )?
    cb(null,true):cb(null,false)
}
    
 const upload = multer({storage :storage,
    filefilter:filefilter})

    const bodyParser = require('body-parser')
    app.use(bodyParser.json())
   
 var categoryController = require('./controllers/category')
 var productController = require('./controllers/productController')
 var adminController = require('./controllers/adminController')
 var userController = require('./controllers/userController')



//admin API's
 app.post('/add-categories',upload.single('image'),categoryController.add_categories)
 app.get('/get_category/:category_id',categoryController.get_category)
 app.patch('/update-categories/:category_id',upload.single('image'),categoryController.update_category)
 app.delete('/delete_category/:category_id',categoryController.delete_category)
 app.post('/createProduct/:category_id',upload.single('image'),productController.createProduct)
 app.get('/getProductById/:product_id',productController.getProductById)
 app.patch('/updateProduct/:product_id',upload.single('image'),productController.updateProduct)
 app.delete('/deleteProduct/:product_id',productController.deleteProduct)
 app.get('/getProductsByCategoryId/:category_id',productController.getProductsByCategoryId)
 app.post('/Admin_signup',adminController.Admin_signup)
 app.get('/Admin_login',adminController.Admin_login)

 //userAPI
 app.get('/getAllUsers',adminController.getAllUsers)
 app.get('/getUsersByMonth/:month',adminController.getUsersByMonth)
 app.post('/signupUsers',userController.signupUsers)
 app.post('/verifyOTP/:id',userController.verifyOTP)
 app.post('/savePassword/',userController.savePassword)
 app.post('/loginUser/',userController.loginUser)
 app.post('/addUserDetails/', isAuthorize,userController.addUserDetails)
 app.post('/userLogout/', isAuthorize,userController.userLogout)
 app.post('/changePassword/',userController.changePassword)
 app.post('/searchProduct/',userController.searchProduct)
 app.post('/resendEmail/',userController.resendEmail)
 app.post('/addToCart/',isAuthorize,userController.addToCart)
 app.get('/getUserDetails/',isAuthorize,userController.getUserDetails)
 app.get('/getUserCart/',isAuthorize,userController.getUserCart)

 

 

 

 

 

 

 

 

 


 





app.get('/api', (req, res) => {
    res.send(' hello world')
})




const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log('app will running on port 8000 ');
})
