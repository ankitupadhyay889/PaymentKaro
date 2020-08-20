const express = require('express') 
const bodyparser = require('body-parser') 
const path = require('path') 
const app = express() 
  
var Publishable_Key = "Publish Key"
var Secret_Key = "Stripe Secret Key"
  
const stripe = require('stripe')(Secret_Key) 
  
const port = process.env.PORT || 3000 
  
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 
  
// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 
  
app.get('/', function(req, res){ 
    res.render('Home', { 
       key: Publishable_Key 
    }) 
}) 
  
app.post('/payment', function(req, res){ 
  
    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'Ankit Upadhyay', 
        address: { 
            line1: 'Sundarpur Varanasi', 
            postal_code: '221005', 
            city: 'Varanasi', 
            state: 'Uttar Pradesh', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 
  
        return stripe.charges.create({ 
            amount: 2500,     // Charing Rs 25 
            description: 'Web Development Product', 
            currency: 'INR', 
            customer: customer.id 
        }); 
    }) 
    .then((charge) => { 
        res.send("Success")  // If no error occurs 
    }) 
    .catch((err) => { 
        res.send(err)       // If some error occurs 
    }); 
}) 
  
app.listen(port, function(error){ 
    if(error) throw error 
    console.log("Server created Successfully") 
}) 