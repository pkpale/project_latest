const express = require('express');
const crypto = require('crypto');
const app = express();
const sqlite3 = require('sqlite3').verbose();
// const mysql = require('mysql');

app.use(express.urlencoded({extended:true}));

//connecting sqlite

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });


  // creating table student_profile
//   db.run('create table student_profile(emailid varchar(20) primary key, fname varchar(20), lname varchar(20), tel varchar(10), location varchar(20), linkedin_id varchar(50),  skype_id varchar(50),    graduation_year varchar(4),   gschool varchar(20),    gcgpa varchar(10),    gbranch varchar(20),    xiischool varchar(20),  xiicgpa varchar(10),     xschool varchar(20),    xcgpa varchar(10) );');
// db.run('drop table student');
// creating table student 
//   db.run('create table student(emailid varchar(20) primary key, fname varchar(20), lname varchar(20), rollno varchar(20), pass varchar(64), tel char(10))')
  
  


app.listen( process.env.PORT || 3000, (err)=>{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log('listening...');
    }
});

app.set('view engine' , 'ejs');
app.use(express.static(__dirname+'/public'));
app.get('/', (req, res)=>{

    res.render('index');
});
app.post('/check', (req,res)=>{
    const inp = JSON.parse(req.headers.data);
    console.log(inp.email)
    var obj ={
        email:true,
        pass:false
    }
    db.get(`select * from student where emailid = '${inp.email}'`, (err, data)=>{
        if(data)
            data.pass = crypto.createHash('sha1').update(data.pass).digest('hex');

        if(!data) // if undefined
            obj.email = false;
        else if(inp.pass == data.pass)
            obj.pass = true;
        res.json(obj);
    });
});
app.post('/',(req,res)=>{
    const data = JSON.parse(req.headers.data);
    console.log(data.email);
    console.log(data.pass);
    data.pass = crypto.createHash('sha1').update(data.pass).digest('hex');
    db.run(`insert into student values( '${data.email}' , '${data.fname}', '${data.lname}', '${data.rollno}',  '${data.pass}', '${data.tel}');`, (err)=>{
        if(err){
            console.log(err);   
        }    
        else
            console.log('record added');
        res.json({redirect:'/login'});
    });
});
app.get('/about', (req, res)=>{
    res.render('about');
});
app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/edit/:id', (req,res)=>{
    const id = req.params.id;
    db.run(`delete from student_profile where emailid = '${id}'`, (err)=>{
        if(err){
            console.log(err);
        }
        else{
                db.get(`select * from student where emailid = '${id}'`, (err, data1)=>{
                    
                        res.render('pro',{data:data1});
                    
                });
           
        }
    });
});
app.get('/contact-us', (req, res)=>{
    res.render('contact');
});

app.get('/user/:id',(req,res)=>{
    console.log(req.url);
    const id = req.params.id;
    console.log('india');
    
    db.get(`select * from student_profile where emailid = "${id}"`,(err, data)=>{

        db.get(`select * from student where emailid = '${id}'`, (err, data1)=>{
            if(!data)
            {
                res.render('pro',{data:data1});
            }
            else{
                res.render('user',{data:data, data1:data1});
            }
            
            console.log(data);
        });
    });
});


app.post('/user/:id', (req,res)=>{
    

    console.log('2020');
    console.log(req.url);
        var pass = (req.headers.password);
        var id = req.params.id;
        console.log('****');
        var obj =  {email:true, password:false, redirect:`/user/${id}`};
        console.log(obj.redirect);
        var sql = `select * from student where emailid = '${id}';`;
        db.get(sql, (err, data)=>{        
    //    res.setHeader('content-type')
           
            pass = crypto.createHash('sha1').update(pass).digest('hex');

            console.log(sql);
    console.log(data);
            if(!data)
                obj.email = false;
            else if(data.pass == pass)
                obj.password=true;
        res.json(obj);
        // res.end();
        });
       
    });
app.post('/:id', (req,res)=>{
    const id = req.params.id;
    console.log(req.body);
    const form = req.body;
    db.get(`select * from student where emailid = '${id}'`, (err, data)=>{        
        data = data;
        db.run(`insert into student_profile values( '${data.emailid}' , '${data.fname}', '${data.lname}', '${form.tel}','${form.location}','${form.linkedin_id}', '${form.skype_id}','${form.graduation_year}','${form.gschool}','${form.gcgpa}','${form.gbranch}', '${form.xiischool}','${form.xiicgpa}','${form.xschool}','${form.xcgpa}');`, (err)=>{
            if(err){
                console.log(err);   
                console.log(data);
            }    
            else
                console.log('record added');
            res.redirect(`/user/${id}`);
        });

    });
});


app.post('/edit/:id', (req,res) =>{
    const id = req.params.id;

    const email = req.body.email;
    if(email != id)
    {
        res.json('enter correct emailid');
    }
    else
        db.get(`select * from student where emailid = '${id}'`, (err, data1)=>{
        
            if(err)
                console.log(err);
            else{
                //    connection
                    res.render('pro', {data:data1});
            }
        });
    
});