(function() {
	var config = {
		dependency: {
			constructor: ['TodoItem'],
			instances: ['restapi']
		},
		todoForm: document.querySelector('#todo'),
		todoListContainer: document.querySelector('#list'),
		todiListItemDoneClass: 'menu-item-done',
		todoListItemsClass: 'todo-list-item',
		todoListItemRemove: 'todo-list-item-remove'
	}

	function TodoList (config) {
		this.todoForm = config.todoForm;
		this.todoListContainer = config.todoListContainer;
		this.todoListItemsClass = config.todoListItemsClass;
		this.todiListItemDoneClass = config.todiListItemDoneClass;
		this.todoListItemRemove = config.todoListItemRemove;
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

		deps.instances.forEach(function(dep){
			this.dependency.instances[dep] = registry.get(dep);
		}.bind(this));
	}

	TodoList.prototype.renderItems = function () {
		var result = '';

		this.tasks.forEach(function(data, index){
			result += new this.deps['TodoItem'](data).render(index + 1);
		}.bind(this));

		this.todoListContainer.innerHTML = result;
	}

	TodoList.prototype.initialize = function () {
		this.todoForm.addEventListener('submit', this.submitHandler.bind(this));
		document.querySelector('#save').addEventListener('click', function(){
			if (this.sending) {
				return;
			}

			this.sending = true;
			this.dependency.instances.restapi.POST('tasks', this.tasks, function(data){
				if (data.target.readyState == 4) {
					this.sending = false;
					this.tasks = JSON.parse(data.target.response);
					alert('Saved');
				}
			});
		}.bind(this));

		this.dependency.instances.restapi.GET('tasks', this.tasks, function(data){
			if (data.target.readyState == 4) {
				this.tasks = JSON.parse(data.target.response);
				this.renderItems();
				this.setListeners();
			}
		}.bind(this));
	}

	TodoList.prototype.submitHandler = function (event) {
		var data;

		event.preventDefault();
		data = serialize(this.todoForm);

		if (!Object.keys(data).length) {
			return;
		}

		data.id = Date.now();

		this.tasks.push(data);
		this.renderItems();
		this.cleanFields(this.todoForm);
		this.setListeners();
	}

	TodoList.prototype.setListeners = function () {
		Array.prototype.slice.call(document.getElementsByClassName(this.todoListItemsClass)).forEach(function(elem){
			elem.getElementsByClassName(this.todoListItemRemove)[0].addEventListener('click', function(event){
				var itemData;

				event.preventDefault();
				event.stopPropagation();
				console.log(this.tasks);
				if (!window.confirm('You realy whant delete this task?')) {
					return;
				}

				itemData = removeBeElement(elem, this.tasks);
				elem.remove();

				if (itemData._id) {
					this.dependency.instances.restapi.DELETE('tasks', itemData._id, function(data) {
						if (data.target.readyState == 4) {
							alert('Deleted');
						}
						return;
					})
				} else {
					alert('Deleted');
				}
			}.bind(this));

			elem.getElementsByClassName(this.todiListItemDoneClass)[0].addEventListener('click', function(event){
				var model = getItemData(elem, this.tasks);

				event.stopPropagation();

				if (!model.status) {
					if (model.inprogress) {
						model.inprogress = false;
						elem.classList.remove('task-inprogress');
					}

					elem.classList.add('task-resolve');
				} else {
					elem.classList.remove('task-resolve');
				}
				
				model.status = !model.status;
			}.bind(this));

			elem.addEventListener('click', function(event){
				var model = getItemData(elem, this.tasks);

				if (elem.classList.contains('task-resolve')) {
					return;
				}

				removeProgress(this.tasks);

				if (!model.inprogress) {
					elem.classList.add('task-inprogress');
					model.inprogress = true;
				}
			}.bind(this));
		}.bind(this));
	}

	TodoList.prototype.cleanFields = function (form) {
		var i = 0,
			length = form.elements.length;

		for (i; i<length; i++) {
			form.elements[i].value = '';
		}
	}

	function getItemData(elem, list) {
		var id = Number(elem.getAttribute('data-message-id')),
			i = 0,
			length = list.length;

		for (i; i<length; i++) {
			if (list[i].id === id) {
				return list[i];
			}
		}
	}

	function removeBeElement(elem, list) {
			var id = Number(elem.getAttribute('data-message-id')),
			i = 0,
			length = list.length,
			result;

		for (i; i<length; i++) {
			if (list[i].id === id) {
				result = Object.assign({}, list[i]);
				list.splice(i, 1);

				return result;
			}
		}

	}

	function removeProgress(list) {
		list.forEach(function(task) {
			if (task.inprogress) {
				task.inprogress = false;
				document.querySelector('[data-message-id="'+task.id+'"]').classList.remove('task-inprogress');
			}
		}.bind(this));
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