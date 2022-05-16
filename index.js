require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const {
	getUsers,
	deleteUser,
	blockUser,
	assignRoles,
	deleteRoles,
	updateMetadata,
	getUserById,
} = require('./routes/admin-routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUsers);
app.use(deleteUser);
app.use(blockUser);
app.use(assignRoles);
app.use(deleteRoles);
app.use(updateMetadata);
app.use(getUserById);

const port = process.env.PORT || 5500;
app.listen(port, () => {
	console.log('server running on ', port);
});

module.exports = app;
