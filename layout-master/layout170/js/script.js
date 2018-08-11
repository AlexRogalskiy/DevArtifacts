// Load feather icons - btw. check them out https://feathericons.com/

class notify {
	constructor(options) {
		this.defaultOptions = {
			themes: ["light", "dark"],
			states: ["warning", "info", "success", "error"]
		};
		this.options = Object.assign({}, this.defaultOptions, options);
		this.data = [];
		this.init();
	}
	stringToNode(string) {
		let template = document.createElement("template");
		template.innerHTML = string;
		return template.content.childNodes[0];
	}
	createNotifyField() {
		if (!document.body.querySelector(".notify")) {
			document.body.innerHTML +=
				'<div class="notify"><div class="notify__notification-container"></div></div>';
			console.log("The Notify plugin has been successfully implemented");
		}
		this.parent = document.body.querySelector(
			".notify .notify__notification-container"
		);
	}
	setEvents(element, options) {
		if (options.closable)
			element.addEventListener("click", evetns => element.remove());
		if (options.onClick)
			element.addEventListener("click", events =>
				options.onClick(element, events)
			);
		if (options.timeOnScreen)
			setTimeout(e => element.remove(), options.timeOnScreen);

		return element;
	}
	getIconElement(userIcon) {
		let icon = {
			options: userIcon,
			element: ""
		};

		Object.keys(icon.options).forEach((propName, index) => {
			if (Object.keys(icon.options).length !== 0) {
				// element
				if (icon.options.element)
					icon.element = document.createElement(icon.options.element);
				else icon.element = document.createElement("svg");
				// attr
				if (icon.options.attr)
					Object.keys(icon.options.attr).forEach((propName, index) => {
						icon.element.setAttribute(propName, icon.options.attr[propName]);
					});
				// content
				if (icon.options.content) icon.element.innerHTML = icon.options.content;
			}
		});

		return icon.element;
	}
	add(userNotificationOptions) {
		let _testTheme = selectedTheme => {
			if (this.options.themes.includes(selectedTheme)) return selectedTheme;
			else throw new Error("__ there is a problem with selected theme");
		};
		let _testState = selectedState => {
			if (this.options.states.includes(selectedState)) return selectedState;
			else throw new Error("__ there is a problem with selected state");
		};

		let userOptions = userNotificationOptions;
		let notification = {
			template: `<div class="notify__notification-box --${_testTheme(
				userOptions.theme
			)}-theme">
<div class="notify__notification-icon">${
				this.getIconElement(userOptions.icon).outerHTML
			}</div>
<div class="notify__notification-message">
	<div class="notify__notification-states">
		<div class="notify__notification-state --${_testState(
			userOptions.state
		)}"></div>
		${
			userOptions.closable
				? '<div class="notify__notification-onhover"><span>Click to hide this out!</span></div>'
				: ""
		}
	</div>
	<div class="notify__notification-description">${userOptions.description}</div>
</div>
</div>`,
			createdAt: Date.now(),
			closed: 0,
			expired: 0,
			autoClose: 0
		};

		notification.element = this.setEvents(
			this.stringToNode(notification.template),
			userOptions
		);
		this.parent.prepend(notification.element);
		userOptions.onLoad();
		this.data.push(notification);
	}
	init() {
		this.createNotifyField();
	}
}

const notifier = new notify({
	themes: ["light", "dark"],
	states: ["warning", "info", "success", "error"],
	defaults: {
		theme: 'light'
	}
});


notifier.add({
	state: "info",
	description: "There is no new notifications!",
	icon: {
		attr: { "data-feather": "bell-off" },
		element: "i",
		content: ''
	},
	theme: "light",
	closable: 0,
	delay: 0,
	timeOnScreen: 0,
	onLoad: () => feather.replace(),
	onClick: (element, events) => (element.style.opacity = .5)
});
notifier.add({
	state: "warning",
	description: "No connection",
	icon: {
		attr: { "data-feather": "cloud-off" },
		element: "i",
		content: ''
	},
	theme: "light",
	closable: 1,
	delay: 0,
	timeOnScreen: 0,
	onLoad: () => feather.replace()
	// onClick: (element, events) => (element.style.display = "none")
});
notifier.add({
	state: "success",
	description: "Message has been sent",
	icon: {
		attr: { "data-feather": "check" },
		element: "i",
		content: ''
	},
	theme: "dark",
	closable: 0,
	delay: 0,
	timeOnScreen: 0,
	onLoad: () => feather.replace(),
	onClick: (element, events) => (alert('onClick function'))
});
notifier.add({
	state: "error",
	description: "Error while saving the file",
	icon: {
		attr: { "data-feather": "file" },
		element: "i",
		content: ''
	},
	theme: "dark",
	closable: 1,
	delay: 0,
	timeOnScreen: 0,
	onLoad: () => feather.replace()
	// onClick: (element, events) => (element.style.display = "none")
});
