const getUsers = require('express').Router();
const deleteUser = require('express').Router();
const blockUser = require('express').Router();
const assignRoles = require('express').Router();
const deleteRoles = require('express').Router();
const updateMetadata = require('express').Router();
const getUserById = require('express').Router();


const {
	checkJwt,
	checkPermissions,
	managementAPI,
} = require('../middleware/auth');

getUsers.get('/users', checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.getUsers()
		.then(function (users) {
			res.send(users);
		})
		.catch(function (err) {
			res.send(err);
		});
});

deleteUser.get('/users/:id/delete', checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.deleteUser({ id: req.params.id })
		.then((response) => {
			res.send('User deleted!');
		})
		.catch(function (err) {
			res.send(err);
		});
});

blockUser.patch('/users/:id', checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.updateUser({ id: req.params.id }, req.body)
		.then((response) => {
			res.send('User blocked!');
		})
		.catch(function (err) {
			res.send(err);
		});
});

assignRoles.post('/users/:id/roles', checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.assignRolestoUser({ id: req.params.id }, req.body)
		.then((response) => {
			res.send('Roles updated');
		})
		.catch(function (err) {
			res.send(err);
		});
});
deleteRoles.post(
	'/users/:id/deleteroles',
	checkJwt,
	checkPermissions,
	(req, res) => {
		managementAPI
			.removeRolesFromUser({ id: req.params.id }, req.body)
			.then((response) => {
				res.send('Roles updated');
			})
			.catch(function (err) {
				res.send(err);
			});
	}
);
updateMetadata.patch(
	'/users/:id/metadata',
	checkJwt,
	checkPermissions,
	(req, res) => {
		managementAPI
			.updateAppMetadata({ id: req.params.id }, req.body)
			.then((response) => {
				res.send('data updated');
			})
			.catch(function (err) {
				res.send(err);
			});
	}
);

getUserById.get('/users/:id', checkJwt, checkPermissions, (req, res) => {
	managementAPI
		.getUser({ id: req.params.id })
		.then((user) => {
			res.send(user);
		})
		.catch(function (err) {
			res.send(err);
		});
});

module.exports= {
	getUsers,deleteUser,blockUser,assignRoles,deleteRoles,updateMetadata,getUserById
}