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
