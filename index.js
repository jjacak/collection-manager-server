require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require("mongoose");
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
app.use(express.urlencoded({ extended: true }));

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost:27017/collection-manager'
);

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
