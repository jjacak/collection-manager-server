const jwtAuthz = require('express-jwt-authz');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
let ManagementClient = require('auth0').ManagementClient;
const mongoose = require('mongoose');
const Collection = require('../models/collection.model');
const jwt_decode = require('jwt-decode');

mongoose.connect(process.env.MONGODB_URI);

const authConfig = {
	domain: process.env.AUTH0_DOMAIN,
	audience: process.env.AUTH0_AUDIENCE,
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
};

const managementAPI = new ManagementClient({
	domain: authConfig.domain,
	clientId: authConfig.clientId,
	clientSecret: authConfig.clientSecret,
});

const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
	}),
	audience: authConfig.audience,
	issuer: `https://${authConfig.domain}/`,
	algorithms: ['RS256'],
});

const checkPermissions = jwtAuthz(['manage:users'], {
	customScopeKey: 'permissions',
});

const editAccess = async (req, res, next) => {
	try {
		const bearerHeader = req.headers['authorization'];
		if (typeof token === undefined) {
			res.status(401).json({
				error: new Error('Unauthorized!'),
			});
		}
			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];
			const decodedToken = jwt_decode(bearerToken);
			const collection = await Collection.findOne({
				$or: [{ _id: req.params.id }, {'items._id': req.params.id }],
			});

			if (collection.owner_id === decodedToken.sub || decodedToken['http:/collection-manager-app.com/roles'].includes('admin')) {
				console.log('authorized');
				next();
			} else {
				console.log('unauthorized');
				res.status(401).json({
					error: new Error('Unauthorized!'),
				});
			}
		
	} catch (error) {
		console.log(error)
		res.status(401).json({
			error: new Error('Invalid request!'),
		});
	}
};

exports.authConfig = authConfig;
exports.checkJwt = checkJwt;
exports.checkPermissions = checkPermissions;
exports.managementAPI = managementAPI;
exports.editAccess = editAccess;
