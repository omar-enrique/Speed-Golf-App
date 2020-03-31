// server.js -- A simple Express.js web server for serving a React.js app

import path from 'path';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import passportGithub from 'passport-github';

const LOCAL_PORT = 8080;
const DEPLOY_URL = "http://localhost:" + LOCAL_PORT;
const GithubStrategy = passportGithub.Strategy;

passport.use(new GithubStrategy({
	clientID: "b115e16e399c7aaad8f3",
	clientSecret: "71018c90217ffa7df801599c1904da98f7a78327",
	callbackURL: DEPLOY_URL + "/auth/github/callback"
	},
	(accessToken, refreshToken, profile, done) => {
		// TO DO: If user in profile object isn’t yet in our database, add the user here
		return done(null, profile);
	}
));

passport.serializeUser((user, done) => {
	console.log("In serializeUser.");
	//Note: The code below is just for this demo, which is not using a back-end
	//database. When we have back-end database, we would put user info into the
	//database in the callback above and only serialize the unique user id into
	//the session.
	
	let userObject = {
		id: user.username + "@github",
		username : user.username,
		provider : user.provider,
		profileImageUrl : user.photos[0].value
	};
	
	done(null, userObject);
});
	
//Deserialize the current user from the session
//to persistent storage.
passport.deserializeUser((user, done) => {
	console.log("In deserializeUser.");
	
	//TO DO: Look up the user in the database and attach their data record to
	//req.user. For the purposes of this demo, the user record received as a param
	//is just being passed through, without any database lookup.
	done(null, user);
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

app.listen(process.env.PORT || LOCAL_PORT);