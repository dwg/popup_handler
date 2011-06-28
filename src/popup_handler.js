PopupHandler = {
	Version: '0.2',
	CompatibleWithPrototype: '1.7'
};

if (Prototype.Version.indexOf(PopupHandler.CompatibleWithPrototype) != 0 && window.console && window.console.warn)
  console.warn("This version of Popup Handler is tested with Prototype " + PopupHandler.CompatibleWithPrototype + 
                  " it may not work as expected with this version (" + Prototype.Version + ")");

<%= include 'cookie.js', 'popup.js' %>