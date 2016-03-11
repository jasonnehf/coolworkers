'use strict';
//	referencing a pre-existing module (no 2nd arg provided)
var app = angular.module("workerApp");
app.controller('workerCtrl', function($scope, WorkerFactory) {
	WorkerFactory.fetch().then(function(res) {
		// console.log('res: ', res);
		$scope.workers = res.data;
	}, function(err) {
		console.error('err: ', err);
	});

	$scope.validateInputs = function(incoming) {
		if(incoming && incoming.fname && incoming.lname && incoming.position)
			return true;
		return false;
	}

	$scope.addWorker = function() {
		if(!$scope.validateInputs($scope.newWorker))	{
			$("input:invalid").effect( "shake", {times:2, distance:10,direction:"up"}, 166 );
			return;
		}

		WorkerFactory.create($scope.newWorker).then(function(res) {
			// console.log('res: ', res);
			$('#new-worker-modal').modal('hide');
			$scope.workers.push(res.data);
			$scope.newWorker = undefined;
		}, function(err) {
			console.error('err: ', err);
		});
	}
	$scope.removeWorker = function(worker) {
		WorkerFactory.remove(worker)
		.then(function(worker) {
			//success!
			WorkerFactory.fetch().then(function(res) {
				// console.log('res: ', res);
				$scope.workers = res.data;
			}, function(err) {
				console.error('err: ', err);
			});

		}, function(err) {
			console.error(err)
		});
	}
	$scope.editWorker = function(worker) {
		$scope.workerEd = angular.copy(worker);
	}
	$scope.confirmDelete = function(worker) {
		swal({
			title: "Delete Worker?",
			text: "Are you sure you want to delete this co-worker?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "red",
			confirmButtonText: "Delete that jerk.",
			cancelButtonText: "Wat? Ahh! No!",
			closeOnConfirm: false,
			closeOnCancel: true
		}, function(isConfirm) {
			if(isConfirm) {
				swal.close();
				$scope.removeWorker(worker);
			} else {
			}

		});
	}
	$scope.confirmEdit = function() {
		debugger;
		if(!$scope.validateInputs($scope.workerEd))	{
			$("input:invalid").effect( "shake", {times:2, distance:10,direction:"up"}, 166 );
			return;
		}
		swal({
			title: "Edit Worker?",
			text: "Are you sure you want to edit this co-worker?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "blue",
			confirmButtonText: "Yarp.",
			cancelButtonText: "...Narp?",
			closeOnConfirm: false,
			closeOnCancel: true
		}, function(isConfirm) {
			if(isConfirm) {

				$scope.commitEdit();
				$('#edit-worker-modal').modal('hide');
				swal.close();
			} else {
			}

		});
	}

	$scope.cancelEditing = function() {
		$scope.workerEd=undefined;
		$scope.newWorker=undefined;
	}

	$scope.commitEdit = function() {
		WorkerFactory.update($scope.workerEd).then(function() {
			$scope.workers.splice($scope.workers.findIndex(e => e.id === $scope.workerEd.id), 1, angular.copy($scope.workerEd));
			$scope.workerEd = undefined;

		});
	}
});
