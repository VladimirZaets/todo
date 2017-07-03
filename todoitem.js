(function () {
	var defaults = {
		itemClass: 'todo-list-item',
		itemDoneClass: 'menu-item-done',
		itemRemoveClass: 'todo-list-item-remove'		
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
		this.id = config.id;
		this.status = config.status;
		this.inprogress = config.inprogress;
		this.itemClass = config.itemClass;
		this.itemDoneClass = config.itemDoneClass;
		this.itemRemoveClass = config.itemRemoveClass;
	}

	TodoListItem.prototype.render = function (index) {
		var result = '';

		result += '<li data-message-id="'+ this.id +'" class="'+ this.itemClass;

		if (this.status) {
			result += ' task-resolve';
		}

		if (this.inprogress) {
			result += ' task-inprogress';
		}

		result += '"><div class="item-first">'+ index +': '+ this.message +'</div><div class="item-second"><span class="'+this.itemDoneClass+'">D</span><span class="'+this.itemRemoveClass+'">R</span></div></li>';

		return result;
	}

	registry.setConstructor('TodoItem', TodoListItem);
})()