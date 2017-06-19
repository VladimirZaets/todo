(function() {
	var config = {
		dependency: {
			constructor: ['TodoItem']
		},
		todoForm: document.querySelector('#todo'),
		todoListContainer: document.querySelector('#list'),
		todiListItemDoneClass: 'menu-item-done',
		todoListItemsClass: 'todo-list-item'
	}

	function TodoList (config) {
		this.todoForm = config.todoForm;
		this.todoListContainer = config.todoListContainer;
		this.todoListItemsClass = config.todoListItemsClass;
		this.todiListItemDoneClass = config.todiListItemDoneClass;
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

		this.tasks.forEach(function(data, index){
			result += new this.deps['TodoItem'](data).render(index + 1);
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
		this.cleanFields(this.todoForm);
		this.setListeners();
	}

	TodoList.prototype.setListeners = function () {
		Array.prototype.slice.call(document.getElementsByClassName(this.todoListItemsClass)).forEach(function(elem){
			elem.getElementsByClassName(this.todiListItemDoneClass)[0].addEventListener('click', function(event){
				var model = getItemData(elem, this.tasks);

				if (!model.status) {
					elem.classList.add('task-resolve');
				} else {
					elem.classList.remove('task-resolve');
				}
				
				model.status = !model.status;
			}.bind(this))
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