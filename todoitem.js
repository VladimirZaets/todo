(function () {
	var defaults = {
		itemClass: 'todo-list-item'
	}

	function extend(obj1, obj2) {
		for (key in obj2) {
			obj1[key] = obj2[key];
		}

		return obj1;
	}

	function TodoListItem (config) {
		config = extend(config, defaults);

		this.message = config.message;
		this.itemClass = config.itemClass;
	}

	TodoListItem.prototype.render = function () {
		var result = '';

		result += '<li class="'+ this.itemClass +'"><div class="item-first">'+ this.message +'</div></li>';

		return result;
	}

	registry.setConstructor('TodoItem', TodoListItem);
})()