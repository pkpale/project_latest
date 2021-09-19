const express = require('express');
const crypto = require('crypto');
const app = express();
const sqlite3 = require('sqlite3').verbose();
// const mysql = require('mysql');

app.use(express.urlencoded({extended:true}));

//connecting sqlite

let db = new sqlite3.Database('./database_new.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });


// db.run('drop table employee;')
// db.run('commit;')
//   creating table student_profile
//   db.run('create table student_profile(emailid varchar(20) primary key, fname varchar(20), lname varchar(20), tel varchar(10), location varchar(20), linkedin_id varchar(50),  skype_id varchar(50),    graduation_year varchar(4),   gschool varchar(20),    gcgpa varchar(10),    gbranch varchar(20),    xiischool varchar(20),  xiicgpa varchar(10),     xschool varchar(20),    xcgpa varchar(10) );');
// db.run('drop table student');
// creating table employee 
// db.run('create table employee(emailid varchar(20) primary key, fname varchar(20), lname varchar(20), emp_id varchar(8), pass varchar(64), tel char(10), cafeteria_seat varchar(3) DEFAULT null, meeting_seat varchar(3) DEFAULT null, cubical_seat varchar(3) DEFAULT null, parking_seat varchar(3) DEFAULT null);')
console.log('print table')
console.log(db.run('select * from employee;'));

// db.run(`insert into employee values( 'ravi@sandvine.com' , 'ravi', 'sharma', '1234',  'hsdjs', '78273827382', 'null');`)
db.all('select * from employee;', (err, data) => {
    if(err)
        console.log(err);
    else console.log(data);
});

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
    db.get(`select * from employee where emailid = '${inp.email}'`, (err, data)=>{
        if(data)
            data.pass = crypto.createHash('sha256').update(data.pass).digest('hex');

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
    data.pass = crypto.createHash('sha256').update(data.pass).digest('hex');
    db.run(`insert into employee(emailid, fname, lname, emp_id, pass, tel) values( '${data.email}' , '${data.fname}', '${data.lname}', '${data.emp_id}',  '${data.pass}', '${data.tel}');`, (err)=>{
        if(err){
            console.log(err);   
        }    
        else{
            console.log('record added');
            res.json({redirect:'/login'});
        }
    });
});
app.get('/about', (req, res)=>{
    res.render('about');
});
app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/contact-us', (req, res)=>{
    res.render('contact');
});

app.get('/user/cafeteria/:id', (req, res) => {
    const id = req.params.id;
    db.get(`select * from employee where emailid = '${id}'`, (err, data)=>{
        db.all(`select cafeteria_seat from employee where emailid != '${id}' and cafeteria_seat != 'null';`, (err, data1) => {
            if (err)
                console.log(err);
            else {
               console.log(data1.length)
               res.render('cafeteria', {data:data, data1:data1});
            }
        });
    });
});
app.get('/user/:id',(req,res)=>{
    console.log(req.url);
    const id = req.params.id;
    console.log('india');
    // let data1, data;
        db.get(`select * from employee where emailid = '${id}'`, (err, data)=>{
            // db.get(`select cafeteria_seat from employee where emailid!='${id}';`, (err, data1) => {
                if (err)
                    console.log(err);
                else 
                //    console.log(data, data1," ravi")
                   res.render('home', {data:data});
            // });
        });
        
        // console.log(data, data1, 'ravi')
        // res.render('cafeteria',{data:data, data1:data1});  
});

app.post('/user/save/:id', (req, res) => {
    var id = req.params.id;
    var seat_no = (req.headers.seat_no);
    console.log(db.get('select * from employee'));
    console.log(seat_no);
    var type = (req.headers.type)
    if(type == 0){
        db.run(`update employee set cafeteria_seat = '${seat_no}' where emailid='${id}';`, (err) => {
            if (err) {
                console.log(err);
            }
        });
        console.log(db.run('select * from employee;'));
        res.json({redirect:'../'});

    }
    if(type == 1){
        db.run(`update employee set cubical_seat = '${seat_no}' where emailid='${id}';`, (err) => {
            if (err) {
                console.log(err);
            }
        });
        console.log(db.run('select * from employee;'));
        res.json({redirect:'../'});
    }

    if(type == 2){
        db.run(`update employee set meeting_seat = '${seat_no}' where emailid='${id}';`, (err) => {
            if (err) {
                console.log(err);
            }
        });
        console.log(db.run('select * from employee;'));
        res.json({redirect:'../'});

    }

    if(type == 3){
        db.run(`update employee set parking_seat = '${seat_no}' where emailid='${id}';`, (err) => {
            if (err) {
                console.log(err);
            }
        });
        console.log(db.run('select * from employee;'));
        res.json({redirect:'../'});

    }
    
    
});
app.post('/user/:id', (req,res)=>{
    console.log(req.url);
        var pass = (req.headers.password);
        var id = req.params.id;
        var obj =  {email:true, password:false, redirect:`/user/${id}`};
        console.log(obj.redirect);
        var sql = `select * from employee where emailid = '${id}';`;
        db.get(sql, (err, data)=>{        
        //    res.setHeader('content-type')
            pass = crypto.createHash('sha256').update(pass).digest('hex');

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
    db.get(`select * from employee where emailid = '${id}'`, (err, data)=>{        
        if(err)
            console.log(err);
        else
            res.redirect(`/user/${id}`);

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
        db.get(`select * from employee where emailid = '${id}'`, (err, data1)=>{
        
            if(err)
                console.log(err);
            else{
                //    connection
                    res.render('pro', {data:data1});
            }
        });
    
});

app.get('/user/parking/:id', (req, res) => {
    const id = req.params.id;
    db.get(`select * from employee where emailid = '${id}'`, (err, data)=>{
        db.all(`select parking_seat from employee where emailid != '${id}' and parking_seat != 'null';`, (err, data1) => {
            if (err)
                console.log(err);
            else {
               console.log(data1.length)
               res.render('parking', {data:data, data1:data1});
            }
        });
    });
});

app.get('/user/cubical/:id', (req, res) => {
    const id = req.params.id;
    db.get(`select * from employee where emailid = '${id}'`, (err, data)=>{
        db.all(`select cubical_seat from employee where emailid != '${id}' and cubical_seat != 'null';`, (err, data1) => {
            if (err)
                console.log(err);
            else {
               console.log(data1.length)
               res.render('cubical', {data:data, data1:data1});
            }
        });
    });
});

app.get('/user/meeting/:id', (req, res) => {
    const id = req.params.id;
    db.get(`select * from employee where emailid = '${id}'`, (err, data)=>{
        db.all(`select meeting_seat from employee where emailid != '${id}' and meeting_seat != 'null';`, (err, data1) => {
            if (err)
                console.log(err);
            else {
               console.log(data1.length)
               res.render('meeting', {data:data, data1:data1});
            }
        });
    });
});