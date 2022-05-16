const jwtAuthz = require('express-jwt-authz');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
let ManagementClient = require('auth0').ManagementClient;

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

exports.authConfig = authConfig;
exports.checkJwt = checkJwt;
exports.checkPermissions = checkPermissions;
exports.managementAPI = managementAPI;
