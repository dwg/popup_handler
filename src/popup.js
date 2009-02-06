var Popup = {
	defaultOptions: {
		width: 500,
		height: 300,
		left: 0,
		top: 0,
		center: true,
		features: {
			menubar: false,
			toolbar: false,
			location: false,
			status: true,
			resizable: false,
			scrollbars: false,
			directories: false
		}
	},
	
	isActive: function(name) {
		return !!Cookie.read(Popup._cookieName(name));
	},
	
	makeActive: function(name) {
		Cookie.write(Popup._cookieName(name), 'true');
	},
	
	_cookieName: function(name) {
		return 'popup_' + name + '_active';
	},
	
	register: function() {
		if (window.name) {
			Popup.makeActive(window.name);
			// Note: only tested in IE6+ and FF2+
			window.onbeforeunload = function() {
				Popup.unregister();
			};
		}
	},
	
	unregister: function() {
		if (window.name) Cookie.expire(Popup._cookieName(window.name));
	},
	
	handleFor: function(name) {
		if (Popup.isActive(name)) {
			var url = '';
			if (Prototype.IE && parseFloat(navigator.appVersion.split('MSIE')[1]) >= 7) url = '#';
			return window.open(url, name);
		}
		return null;
	},
	
	Base: Class.create({
		initialize: function(url, name, options) {
			this.url = url;
			this.name = name;
			this.options = Object.extend(Object.extend({}, Popup.defaultOptions), options);
			this.open();
		},
		
		open: function() {
			this.handle = Popup.handleFor(this.name);
			if (!this.handle) {
				this.handle = window.open(this.url, this.name, this._windowOptions(), true);
				Popup.makeActive(this.name);
			}
		},
		
		_windowOptions: function() {
			var left = this.options.left;
			var top = this.options.top;
			if (this.options.center) {
				left = screen.width/2 - this.options.width/2;
				top = screen.height/2 - this.options.height/2;
			}
			var dimensions = 'width=' + this.options.width + 'px,height=' + this.options.height + 'px';
			var position = 'left=' + left + 'px,top=' + top + 'px';
			var features = $H(this.options.features).map(function(kv) {
				return kv.first() + '=' + (kv.last() ? 'yes' : 'no');
			}).join(',');
			return [dimensions, position, features].join(',');
		}
	})
};
