// server.js -- A simple Express.js web server for serving a React.js app

import path from 'path';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportGithub from 'passport-github';
import mongoose from 'mongoose';

const connectStr = 'mongodb+srv://admin:speedgolf12345@speedgolf-bmxxt.mongodb.net/test?retryWrites=true&w=majority';
const LOCAL_PORT = 8080;
const DEPLOY_URL = "http://localhost:" + LOCAL_PORT;
const LocalStrategy = passportLocal.Strategy;
const GithubStrategy = passportGithub.Strategy;
const Schema = mongoose.Schema;

mongoose.connect(connectStr, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => {console.log(`Connected to ${connectStr}.`)},
		err => {console.error(`Error connecting to ${connectStr}: ${err}`)});

const roundSchema = new Schema({
	date: {type: Date, required: true},
	course: {type: String, required: true},
	type: {type: String, required: true, enum: ['practice','tournament']},
	holes: {type: Number, required: true, min: 1, max: 18},
	strokes: {type: Number, required: true, min: 1, max: 300},
	minutes: {type: Number, required: true, min: 1, max: 240},
	seconds: {type: Number, required: true, min: 0, max: 60},
	SGS: {type: Number,
		default:
		function(){return (this.strokes * 60) + (this.minutes * 60) + this.seconds},
		set:
		function(){return (this.strokes * 60) + (this.minutes * 60) + this.seconds}
	},
	notes: {type: String, required: true}
});

const userSchema = new Schema({
	id: {type: String, required: true}, //unique identifier for user
	username: {type: String, required: true}, //Name to be displayed within app
	password: String,
	provider: {type: String, required: true}, //strategy used to authenticate, e.g., github, local
	profileImageUrl: {type: String, required: true}, //link to profile image
	securityQuestion: String,
	securityAnswser: {type: String, required:
					() => this.securityQuestion ? true : false},
	rounds: [roundSchema]
});

const User = mongoose.model("User",userSchema);

passport.use(new LocalStrategy({passReqToCallback: true},
	//Called when user is attempting to log in with username and password. 
	//userId contains the email address entered into the form and password
	//contains the password entered into the form.
	async (req, userId, password, done) => {
		let thisUser;
		try {
			thisUser = await User.findOne({id: userId});
			if (thisUser) {
				if (thisUser.password === password) {
					return done(null, thisUser);
				} else {
					req.authError = "The password is incorrect. Please try again or reset your password.";
					return done(null, false)
				}
			} else { //userId not found in DB
				req.authError = "There is no account with email " + userId + ". Please try again.";
				return done(null, false);
			}
		} catch (err) {
			return done(err);
		}
	}
));

passport.use(new GithubStrategy({
	clientID: "b115e16e399c7aaad8f3",
	clientSecret: "71018c90217ffa7df801599c1904da98f7a78327",
	callbackURL: DEPLOY_URL + "/auth/github/callback"
	},
	async (accessToken, refreshToken, profile, done) => {
		console.log("User authenticated through GitHub! In passport callback.");
		
		//Our convention is to build userId from username and provider
		const userId = `${profile.username}@${profile.provider}`;
		
		//See if document with this unique userId exists in database
		let currentUser = await User.findOne({id: userId});
		if (!currentUser) { //Add this user to the database
			currentUser = await new User({
				id: userId,
				username: profile.username,
				provider: profile.provider,
				profileImageUrl: profile.photos[0].value
			}).save();
		}

		return done(null,currentUser);
	}
));

passport.serializeUser((user, done) => {
	console.log("In serializeUser.");
	console.log("Contents of user param: " + JSON.stringify(user));

	done(null,user.id);
});
	
//Deserialize the current user from the session
//to persistent storage.
passport.deserializeUser(async (userId, done) => {
	console.log("In deserializeUser.");

	console.log("Contents of userId param: " + userId);
	let thisUser;
	try {
		thisUser = await User.findOne({id: userId});
		console.log("User with id " + userId +
		" found in DB. User object will be available in server routes as req.user.")
		done(null,thisUser);
		} catch (err) {
		done(err);
	}
});

const app = express();
// app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(session({secret: "speedgolf", resave: false, saveUninitialized: false, cookie: {maxAge: 1000 * 60}}))
	.use(express.static(path.join(__dirname, 'client', 'build')))
	.use(passport.initialize())
	.use(passport.session());

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname,'client', 'build', 'index.html'));
});

/////////////////////
//EXPRESS APP ROUTES
/////////////////////
//AUTHENTICATE route: Uses passport to authenticate with GitHub.
//Should be accessed when user clicks on 'Login with GitHub' button on
//Log In page.
app.get('/auth/github', passport.authenticate('github'));

//CALLBACK route: GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
	(req, res) => {
	console.log("auth/github/callback reached.")
	res.redirect('/'); //sends user back to login screen;
	//req.isAuthenticated() indicates status
});

//LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.
app.get('/auth/logout', (req, res) => {
	console.log('/auth/logout reached. Logging out');
	req.logout();
	res.redirect('/');
});

//TEST route: Tests whether user was successfully authenticated.

//Should be called from the React.js client to set up app state.

app.get('/auth/test', (req, res) => {
	console.log("auth/test reached.");
	const isAuth = req.isAuthenticated();
	
	if (isAuth) {
		console.log("User is authenticated");
		console.log("User record tied to session: " + JSON.stringify(req.user));
	} else {
		//User is not authenticated
		console.log("User is not authenticated");
	}

	//Return JSON object to client with results.
	res.json({isAuthenticated: isAuth, user: req.user});
});

//LOGIN route: Attempts to log in user using local strategy

app.post('/auth/login', passport.authenticate('local', { failWithError: true }),
	(req, res) => {
		console.log("/login route reached: successful authentication.");
		//Redirect to app's main page; the /auth/test route should return true
		res.status(200).send("Login successful");
	},
	(err, req, res, next) => {
		console.log("/login route reached: unsuccessful authentication");

		if (req.authError) {
			console.log("req.authError: " + req.authError);

			res.status(401).send(req.authError);

		} else {
			res.status(401).send("Unexpected error occurred when attempting to authenticate. Please try again.");
		}
	}
);

app.get('/users/:userId', async(req, res, next) => {
	console.log("in /users route (GET) with userId = " + JSON.stringify(req.params.userId));
	try {
		let thisUser = await User.findOne({id: req.params.userId});
		if (!thisUser) {
			return res.status(400).message("No user account with specified userId was found in database.");
		} else {
			return res.status(200).json(JSON.stringify(thisUser));
		}
	} catch (err) {
		console.log()
		return res.status(400).message("Unexpected error occurred when looking up user in database: " + err);
	}
});

app.post('/users/:userid', async (req, res, next) => {
	console.log("in /users route (POST) with params = " + JSON.stringify(req.params) +
		" and body = " + JSON.stringify(req.body));
	
	if (!req.body.hasOwnProperty("password")) {
		//Body does not contain correct properties
		return res.status(400).send("/users POST request formulated incorrectly. " +
		"It must contain 'password' as field in message body.")
	}
	
	try {
		let thisUser = await User.findOne({id: req.params.userId});
		if (thisUser) { //account already exists
			return res.status(400).send("There is already an account with email '" +
				req.body.userId + "'. Please choose a different email.");
		} 
		else { //account available -- add to database
			thisUser = await new User({
				id: req.params.userId,
				password: req.body.password,
				displayName: req.params.userId,
				authStrategy: 'local',
				profileImageUrl: `https://www.gravatar.com/avatar/${md5(req.body.userId)}`,
				securityQuestion: req.body.securityQuestion,
				securityAnswer: req.body.securityAnswer,
				rounds: []
			}).save();
		
			return res.status(200).send("New account for '" + req.body.userId + "' successfully created.");
		}
	} 
	catch (err) {
		return res.status(400).send("Unexpected error occurred when adding or looking up user in database. " + err);
	}
});

app.put('/users/:userId',  async (req, res, next) => {
	console.log("in /users PUT with userId = " + JSON.stringify(req.params) + 
	  " and body = " + JSON.stringify(req.body));
	if (!req.params.hasOwnProperty("userId"))  {
		return res.status(400).send("users/ PUT request formulated incorrectly." +
			"It must contain 'userId' as parameter.");
	}
	const validProps = ['password', 'username', 'profileImageUrl', 'securityQuestion', 'securityAnswer'];
	for (const bodyProp in req.body) {
		if (!validProps.includes(bodyProp)) {
			return res.status(400).send("users/ PUT request formulated incorrectly." +
			"Only the following props are allowed in body: " +
			"'password', 'displayname', 'profileImageUrl', 'securityQuestion', 'securityAnswer'");
		} 
	}
	try {
		let status = await User.updateOne({id: req.params.userId}, 
			{$set: req.body});                            
		if (status.nModified != 1) { //Should never happen!
			res.status(400).send("User account exists in database but data could not be updated.");
		} else {
			res.status(200).send("User data successfully updated.")
		}
	} catch (err) {
		res.status(400).send("Unexpected error occurred when updating user data in database: " + err);
	}
});

app.listen(process.env.PORT || LOCAL_PORT);