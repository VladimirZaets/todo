(function(){
	var config = {
		"url": "https://todolist-114e.restdb.io/rest/",
		"content-type": "application/json",
		"x-apikey": "5943ad214b84c62d01db8baa",
		"cache-control": "no-cache"
	}

	function RestAPI(config) {
		this['url'] = config['url'];
		this['content-type'] = config['content-type'];
		this['x-apikey'] = config['x-apikey'];
		this['cache-control'] = config['cache-control'];
	}

	RestAPI.prototype.send = function (type, url, data, callback, event) {
		var xhr = new XMLHttpRequest();

		if (event) {
			event.preventDefault();
		}

		if (callback) {
			xhr.addEventListener('readystatechange', callback);
		}

		xhr.open(type, this['url'] + url, true);
		xhr.setRequestHeader("content-type", this['content-type']);
		xhr.setRequestHeader("x-apikey", this['x-apikey']);
		xhr.setRequestHeader("cache-control", this['cache-control']);
		data ? xhr.send(JSON.stringify(data)) : xhr.send();
	}

	RestAPI.prototype.POST = function(url, data, callback, event) {
		this.send('POST', url, data, callback, event)
	}
	RestAPI.prototype.DELETE = function(url, id, callback, event) {
		this.send('DELETE', url + '/' + id, null, callback, event)
	}
	RestAPI.prototype.GET = function(url, data, callback, event) {
		this.send('GET', url, data, callback, event)
	}

	registry.set('restapi', new RestAPI(config));
})()