'use strict';
var express = require('express');
var router = express.Router();
var Worker = require('./worker.model');

router.get('/', function(req, res) {
	Worker.get(function(err, workers) {
		if(err) {
			res.status(400).send(err);
			return;
		}
		res.send(workers);
	});
});

router.get('/:id', function(req, res) {
	var id = req.params.id;
	Worker.get(function(err, workers) {
		if(err) {
			res.status(400).send(err);
			return;
		}
		var worker = workers.find(function(obj) {
			return obj.id === id;
		});
		if(!worker) {
			res.status(404).send({
				err: "Worker not found"
			});
			return;
		}
		res.send(worker);
	});
});

router.post('/', function(req, res) {
	var newWorker = req.body;
	Worker.create(newWorker, function(err, savedWorker) {
		if(err) {
			res.status(400).send(err);
		} else {
			res.send(savedWorker);
		}
	});
});

router.delete('/:id', function(req, res) {
	var id = req.params.id;
	Worker.delete(id, function(err) {
		if(err) {
			res.status(400).send(err);
		} else {
			res.send();
		}
	});
});

router.put('/:id', function(req, res) {
	var id = req.params.id;
	var updatesObj = req.body;
	Worker.update(id, updatesObj, function(err, updatedWorker) {
		if(err) {
			res.status(400).send(err);
		} else {
			res.send(updatedWorker);
		}
	});
});

module.exports = router;
