require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
let ManagementClient = require('auth0').ManagementClient;

const app = express();
app.use(cors());
app.use(express.json());

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

app.get('api/users', (req, res) => {
	managementAPI
		.getUsers()
		.then(function (users) {
			res.send(users);
		})
		.catch(function (err) {
			console.log(err);
		});
});

app.get('api/users/:id/delete', (req, res) => {
	managementAPI
		.deleteUser({ id: req.params.id })
		.then((response) => {
			res.send('User deleted!');
		})
		.catch(function (err) {
			res.send(err);
		});
});

app.get('api/users/:id/unblock', (req, res) => {
	managementAPI
		.updateUser({ id: req.params.id }, { blocked: false })
		.then((response) => {
			res.send('User unblocked!').catch((err) => {
				res.send(err);
			});
		});
});

app.get('api/users/:id/block', (req, res) => {
	managementAPI
		.updateUser({ id: req.params.id }, { blocked: true })
		.then((response) => {
			res.send('User blocked!').catch((err) => {
				res.send(err);
			});
		});
});

app.get('api/users/:id/roles', (req,res)=>{
    managementAPI.assignRolestoUser({id:req.params.id},{roles: req.data.roles}).then(response=>{
        res.send('User roles updated!').catch(err=>{
            res.send(err)
        })
    })
})

const port = process.env.PORT || 5500;
app.listen(port, () => {
	console.log('server running on ', port);
});

module.exports = app;
