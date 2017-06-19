(function() {
	var config = {
		dependency: {
			constructor: ['TodoItem']
		},
		todoForm: document.querySelector('#todo'),
		todoListContainer: document.querySelector('#list'),

	}

	function TodoList (config) {
		this.todoForm = config.todoForm;
		this.todoListContainer = config.todoListContainer;
		this.tasks = [];
		this.dependency = config.dependency;
		this.initDependency(config.dependency);
		this.initialize();
	}

	TodoList.prototype.initDependency = function (deps) {
		this.deps = {};
		deps.constructor.forEach(function(name){
			this.deps[name] = registry.getConstructor(name);
		}.bind(this));
	}

	TodoList.prototype.renderItems = function () {
		var result = '';

		this.tasks.forEach(function(data){
			result += new this.deps['TodoItem'](data).render();
		}.bind(this));

		this.todoListContainer.innerHTML = result;
	}

	TodoList.prototype.initialize = function () {
		this.todoForm.addEventListener('submit', this.submitHandler.bind(this));
	}

	TodoList.prototype.submitHandler = function (event) {
		var data;

		event.preventDefault();
		data = serialize(this.todoForm);
		data.id = Date.now();

		this.tasks.push(data);
		this.renderItems();
	}

	function serialize(form) {
		var data = {},
			i = 0,
			length = form.elements.length;

			for (i; i<length; i++) {
				if (form.elements[i].value) {
					data[form.elements[i].name] = form.elements[i].value;
				}
			}

			return data;
	}

	registry.set('todoList', new TodoList(config));
})()