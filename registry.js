var registry = (function(){
	var instance = {},
		constructor = {};

		return {
			set: function (name, inst) {
				instance[name] = inst;
			},
			get: function (name) {
				return instance[name];
			},
			setConstructor: function (name, constr) {
				constructor[name] = constr;
			},
			getConstructor: function (name) {
				return constructor[name];
			},
			showInstance: function () {
				return instance;
			},
			showConstructor: function () {
				return constructor;
			}
		}
})()