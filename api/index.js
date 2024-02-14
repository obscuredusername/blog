const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./model/usermodel');
const PostModel= require('./model/post');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const multer= require('multer');
const upload =multer({dest:'uploads/'});
const fs= require('fs');

const salt = bcrypt.genSaltSync(10);
const secret='asdfassdsdfdfdfdffhg';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser())
app.use('/uploads',express.static(__dirname+'/uploads'));

mongoose.connect('mongodb+srv://blog:x6ZP0mCn6t7YqIev@cluster0.us702xf.mongodb.net/?retryWrites=true&w=majority'),()=>{
    console.log('db connected')
};

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });
  
  db.once('open', () => {
    console.log('MongoDB connected successfully');
  });



app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const userDoc = await User.create({ username
        , password : bcrypt.hashSync(password,salt)});
    res.json(userDoc);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});


app.post('/login', async(req,res)=>{
  
    const{username,password}= req.body;
    const userDoc = await User.findOne ({username});
    
    const okPass= bcrypt.compareSync(password,userDoc.password);
    if (okPass)
    {
      
        jwt.sign({username,id:username._id},secret, {},(err,token)=>{
      user=userDoc.username;
            if(err)throw err;
            res.cookie('token',token).json({
              id:userDoc._id,
              username,
            });
        })
    }
    else {
        res.status(400).json('Wrong Credential');
    }
})


app.get('/profile', (req, res) => {
    const {token}= req.cookies;
    jwt.verify(token, secret,{},(err,info)=>{
        if(err) throw err;
        res.json(info);
    })
    res.json(req.cookies); // Use req.cookies to access cookies
  });
  

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})


app.post('/post', upload.single('file'), (req, res) => {
  const {originalname,path}= req.file
  const parts= originalname.split('.');
  const ext= parts[parts.length-1];
  const newPath= path+'.'+ext
  fs.renameSync(path,newPath);

  const {token}= req.cookies;
  jwt.verify(token,secret,{},async(err,info)=>
  {
    if(err) throw err;
    else console.log(info);
    const {title,summary,content}= req.body;
    const postDoc=await  PostModel.create({
      title,summary,content,cover:newPath,author:info.username,
    });
    res.json(postDoc)
  })

});

app.get('/post',async(req,res)=>
{
  const posts = await PostModel.find()
  .populate('author',['username']
  
  );
    res.json(posts);
    
})


app.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await PostModel.findById(id); // Use findById to find a post by its ID
    if (postDoc) {
      res.json(postDoc);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
