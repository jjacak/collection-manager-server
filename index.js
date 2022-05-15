require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwtAuthz = require('express-jwt-authz');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
let ManagementClient = require('auth0').ManagementClient;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authConfig = {
	domain: process.env.AUTH0_DOMAIN,
	audience: process.env.AUTH0_AUDIENCE,
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
};

const checkJwt = jwt({
	// Provide a signing key based on the key identifier in the header and the signing keys provided by your Auth0 JWKS endpoint.
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
	}),

	// Validate the audience (Identifier) and the issuer (Domain).
	audience: authConfig.audience,
	issuer: `https://${authConfig.domain}/`,
	algorithms: ['RS256'],
});

const checkPermissions = jwtAuthz(['manage:users'], {
	customScopeKey: 'permissions',
});

const managementAPI = new ManagementClient({
	domain: authConfig.domain,
	clientId: authConfig.clientId,
	clientSecret: authConfig.clientSecret,
});

app.get('/users', checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.getUsers()
		.then(function (users) {
			res.send(users);
		})
		.catch(function (err) {
			console.log(err);
		});
});

app.get('/users/:id/delete', checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.deleteUser({ id: req.params.id })
		.then((response) => {
			res.send('User deleted!');
		})
		.catch(function (err) {
			res.send(err);
		});
});

app.patch('/users/:id', checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.updateUser({ id: req.params.id }, req.body)
		.then((response) => {
			res.send('User blocked!');
		})
		.catch(function (err) {
			res.send(err);
		});
	
});

app.post('/users/:id/roles',checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.assignRolestoUser({ id: req.params.id }, req.body)
		.then((response) => {
			res.send('Roles updated');
		})
		.catch(function (err) {
			res.send(err);
		});
	
});
app.post('/users/:id/deleteroles',checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.removeRolesFromUser({ id: req.params.id }, req.body)
		.then((response) => {
			res.send('Roles updated');
		})
		.catch(function (err) {
			res.send(err);
		});
	
});
app.patch('/users/:id/metadata',checkJwt, checkPermissions, (req, res) => {
	console.log(req.body)
	managementAPI
		.updateAppMetadata({ id: req.params.id }, req.body)
		.then((response) => {
			res.send('data updated');
		})
		.catch(function (err) {
			res.send(err);
		});
	
});


const port = process.env.PORT || 5500;
app.listen(port, () => {
	console.log('server running on ', port);
});

module.exports = app;
