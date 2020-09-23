const express = require('express');

const app = express();

const mysql = require('mysql');

app.use(express.urlencoded({extended:true}));

var connection = mysql.createConnection({
    //properties... 
    connectionLimit:50, // at a time only receive 50 query requests.
    host: 'localhost',
    user:'root',
    password:'Ravi#2016',
    database:'campus'
  });
  
  connection.connect((err)=>{
      if(err){
        console.log(err);
      }
      else 
        console.log('connected');
  });

app.listen(process.env.PORT || 3000, (err)=>{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log('listening...');
    }
});

app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.get('/', (req, res)=>{

    res.render('index');
});

app.post('/',(req,res)=>{
    console.log(req.body);
    const data = req.body;
    console.log(data.email);
    
    connection.query(`insert into student values( '${data.email}' , '${data.fname}', '${data.lname}', '${data.rollno}', ${1} , 'sfnks');`, (err)=>{
        if(err){
            console.log(err);
        }    
        else
            console.log('record added')
;    });
    res.redirect('login');
    res.end();
});
app.get('/about', (req, res)=>{
    res.render('about');
});
app.get('/login',(req,res)=>{
    res.render('login');
});
app.get('/user', (req,res)=>{
    // console.log(parama)
    res.render('user',{ravi:'RAVI'});
    // console.log(data);
    
});
app.get('/contact-us', (req, res)=>{
    res.render('contact');
});
