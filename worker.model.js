'use strict';
//  Worker model
//  Contains methods to interact with worker data

var fs = require('fs');
var path = require('path');
var uuid = require('uuid');

var workersFilepath = path.join(__dirname, './data/workers.json');

exports.get = function(cb) {
	fs.readFile(workersFilepath, function(err, data) {
		if (err) return cb(err);
		var workers = JSON.parse(data);
		cb(null, workers);
	});
};

exports.create = function(newWorker, cb) {
	this.get((err, workers) => { // read and parse
		if (err) return cb(err);
		newWorker.id = uuid();
		if(!newWorker.photourl)
			newWorker.photourl="https://i.imgur.com/QQClBbK.png";
		workers.push(newWorker);
		this.write(workers, function() {
			cb(err, newWorker);
		});
	});
};

exports.write = function(workers, cb) {
	fs.writeFile(workersFilepath, JSON.stringify(workers), cb);
};

exports.getById = function() {}

exports.delete = function(id, cb) {
	// get the array of workers
	// remove the worker with the given id from the array
	// write the modified array back to the db
	this.get((err, workers) => {
		var length = workers.length;
		workers = workers.filter(function(worker) {
			return worker.id !== id;
		});
		if (length === workers.length) {
			cb({
				err: "Worker not found."
			});
			return;
		}
		this.write(workers, cb);
	});
};

exports.update = function(id, updatesObj, cb) {
	// find the worker with the given id
	// update that worker with the object
	// save the modified workers array to db
	// cb with updated worker
	this.get((err, workers) => {
		var updatedWorker;
		workers = workers.map(function(worker) {
			if (worker.id === id) {
				// do the update
				for (var key in updatesObj) {
					worker[key] = updatesObj[key];
				}
				updatedWorker = worker;
			}
			return worker;
		});
		if (!updatedWorker) {
			cb({
				err: "Worker not found."
			});
			return;
		}
		this.write(workers, function(err) {
			cb(err, updatedWorker)
		});
	});
};