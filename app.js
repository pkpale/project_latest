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
app.use(express.static('public'));
app.get('/', (req, res)=>{

    res.render('index');
});

app.post('/',(req,res)=>{
    console.log(req.body);
    const data = req.body;
    console.log(data.email);
    
    connection.query(`insert into student values( '${data.email}' , '${data.fname}', '${data.lname}', '${data.rollno}', ${1} , '${data.pass}');`, (err)=>{
        if(err){
            console.log(err);
        }    
        else
            console.log('record added');
    });
    res.redirect('login');
    res.end();
});
app.get('/about', (req, res)=>{
    res.render('about');
});
app.get('/login',(req,res)=>{
    res.render('login');
});
// app.get('/user',(req,res)=>{
//         res.render('user',{ravi:'RAVI'});
// });

// app.post('/user/edit', (req,res)=>{
//     // console.log(req.params.id);
//     let id=req.body.email;
//     console.log(req.body)
//     console.log(2);
//     connection.query(`select * from student_profile where emailid = "${id}"`,(err, data)=>{
//                     console.log(err);  
//                     console.log(`/user/${id}`);  
//                 //var data1;
//                 connection.query(`select * from student where emailid = '${id}'`, (err, data1)=>{
//                         if(err){
//                             console.log(err);
//                         }
//                         console.log(data1);
                              
//                         res.render('pro',{data:data1[0]});
//                 });
               
//     });
// });
app.post('/user', (req,res)=>{
    // console.log(req.params.id);
    var id=req.body.email;
  
    connection.query(`select * from student_profile where emailid = "${id}"`,(err, data)=>{
                    console.log(err);  
                    // console.log(`/user/${id}`);  
                //var data1;
                connection.query(`select * from student where emailid = '${id}'`, (err, data1)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log(data1);
                        if(data.length === 0)
                        {   
                            if(data1.length === 0)
                                res.render('index');
                            else    
                                res.render('pro',{data:data1[0]});
                        }
                    else 
                        {      
                            console.log(data[0].emailid);
                            res.render('user',{data:data[0], data1:data1[0]});
                        }

                });
               
        });
    
});

app.get('/contact-us', (req, res)=>{
    res.render('contact');
});

app.post('/user/:id', (req,res)=>{
        console.log(req.params.id);
        console.log(req.body);
        var data=req.body;
        console.log(1);
        var id = req.params.id;
        connection.query(`select * from student where emailid = '${id}'`, (err, data1)=>{        
            connection.query(`insert into student_profile values('${id}','${data1[0].fname}','${data1[0].lname}',${data.tel},'${data.location}','${data.linkedin_id}','${data.skype_id}','${data.graduation_year}','${data.gschool}','${data.gcgpa}','${data.gbranch}','${data.xiischool}','${data.xiicgpa}','${data.xschool}','${data.xcgpa}');`,(err)=>{
                if(err)
                    console.log(err);
                else
                    res.render('user',{data:req.body, data1:data1[0]});
            });
        });
   
    });
