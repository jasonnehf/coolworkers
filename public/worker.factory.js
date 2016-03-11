app.factory('WorkerFactory',function($http) {
	return {
		fetch: 	function() {
			return $http.get('/workers');
		},
		create:	function(newWorker) {
			return $http.post('/workers',newWorker);
		},
		remove:	function(oldWorker) {
			var url = `/workers/${oldWorker.id}`;
			return $http.delete(url);		//	promise
		},
		update:	function(workerEd) {
			return $http.put(`/workers/${workerEd.id}`,workerEd);
		}
	}
});