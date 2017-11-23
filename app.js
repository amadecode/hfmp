const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');


const app = express();

const hbs = exphbs.create({defaultLayout: 'main'});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000,
	keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongodb.dbURI, ()=>{
	console.log('connected to mongodb');
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);

app.get('/', (req, res)=>{
	res.render("page-dashboard");
});


/*-------------------*/
app.get('/page-landing', (req, res)=>{
	res.render("page-landing", {layout:false});
});
app.get('/page-dashboard', (req, res)=>{
	res.render("page-dashboard");
});
app.get('/page-profile', (req, res)=>{
	res.render("page-profile");
});
app.get('/page-table', (req, res)=>{
	res.render("page-table");
});
app.get('/page-icon', (req, res)=>{
	res.render("page-icon");
});
app.get('/page-map', (req, res)=>{
	res.render("page-map");
});
app.get('/page-blank', (req, res)=>{
	res.render("page-blank");
});
app.get('/page-error404', (req, res)=>{
	res.render("page-error404", {layout:false});
});
/*-------------------*/

app.post('/send', (req, res) => {
	const output = `
		<p>You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
			<li>Email: ${req.body.email}</li>
			<li>Message: ${req.body.message}</li>
		</ul>
	`;
	console.log(req.body);
	res.send(output);

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth:{
			user: keys.testmail.user,
			pass: keys.testmail.pass
		}
	});

	let mailOptions = {
		from: 'cbalamanatuic@gmail.com',
		to: 'cbalamanatuic@gmail.com',
		subject: 'Test Nodemailer...',
		html: output
	};

	transporter.sendMail(mailOptions, (error, info)=>{
		if(error){
			return console.log(error);
		}
		else
			console.log(info);		
	});
});

app.listen(3000, ()=> {
	console.log('Server started...');
});


