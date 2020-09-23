const express = require('express');

const app = express();



app.listen(process.env.PORT || 3000, (err)=>{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log('listening');
    }
});

app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.get('/', (req, res)=>{
    res.render('index');
});
app.get('/about', (req, res)=>{
    res.render('about');
});

app.get('/contact-us', (req, res)=>{
    res.render('contact');
});