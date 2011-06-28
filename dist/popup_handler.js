PopupHandler = {
	Version: '0.2',
	CompatibleWithPrototype: '1.7'
};

if (Prototype.Version.indexOf(PopupHandler.CompatibleWithPrototype) != 0 && window.console && window.console.warn)
  console.warn("This version of Popup Handler is tested with Prototype " + PopupHandler.CompatibleWithPrototype +
                  " it may not work as expected with this version (" + Prototype.Version + ")");

var Cookie = {
	write: function(name, value) {
		var expiresAt = '';
		if (arguments.length > 2) {
			var date = new Date();
			date.setTime(date.getTime() + arguments[2]*24*60*60*1000);
			expiresAt = '; expires=' + date.toGMTString();
		}
		document.cookie = name + '=' + value + expiresAt + '; path=/';
	},

	read: function(name) {
		var cookie = document.cookie.split(';').invoke('strip').find(function(c) {
			return c.startsWith(name);
		});
		if (cookie) {
			return cookie.substring(cookie.indexOf(name + '=') + 1);
		}
		return '';
	},

	expire: function(name) {
		Cookie.write(name, '', -1);
	}
};
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
			resizable: true,
			scrollbars: false,
			directories: false
		}
	},

	windows: {},

	isActive: function(name) {
		if (Prototype.Browser.Opera) {
			var handle = window.open('', name);
			if (handle.document.body.innerHTML.blank()) {
				handle.close();
				return false;
			}
			return true;
		}
		return !!Cookie.read(Popup._cookieName(name));
	},

	makeActive: function(name) {
		if (!Prototype.Browser.Opera) {
			Cookie.write(Popup._cookieName(name), 'true');
		}
	},

	_cookieName: function(name) {
		return 'popup_' + name + '_active';
	},

	register: function() {
		if (window.name && !Prototype.Browser.Opera) {
			Popup.makeActive(window.name);
			Event.observe(window, 'unload', Popup.unregister);
		}
	},

	unregister: function() {
		if (window.name) {
			if (!Prototype.Browser.Opera) Cookie.expire(Popup._cookieName(window.name));
			Popup.windows[window.name] = null;
		}
	},

	handleFor: function(name) {
		if (Popup.isActive(name)) {
			var url = '';
			// TODO: investigate why this is needed for some IE7s and not others
      // if (Prototype.IE && parseFloat(navigator.appVersion.split('MSIE')[1]) >= 7) url = '#';
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
			Popup.windows[name] = this;
		},

		open: function() {
			this.handle = Popup.handleFor(this.name);
			if (!this.handle) {
				this.handle = window.open(this.url, this.name, this._windowOptions(), true);
				if (this.handle.Popup) {
					this.handle.Popup.register();
					Popup.makeActive(this.name);
				}
			}
			this.handle.focus();
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
		},

		onCallback: function(method) {
			if (this.options[method]) {
				this.options[method]($A(arguments).slice(1));
			}
		}
	})
};