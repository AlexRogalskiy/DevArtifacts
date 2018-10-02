const app = new Vue({
	el: "#app",
	data: {
		calData: {
			inputText: "",
			answer: 0
		},
		keyData: {
			96: { text: 0 },
			48: { text: 0 },
			97: { text: 1 },
			49: { text: 1 },
			98: { text: 2 },
			50: { text: 2 },
			99: { text: 3 },
			51: { text: 3 },
			100: { text: 4 },
			52: { text: 4 },
			101: { text: 5 },
			53: { text: 5 },
			102: { text: 6 },
			54: { text: 6 },
			103: { text: 7 },
			55: { text: 7 },
			104: { text: 8 },
			56: { text: 8 },
			105: { text: 9 },
			57: { text: 9 },
			110: { text: "." },
			190: { text: "." },
			107: { text: "+" },
			109: { text: "-" },
			173: { text: "-" },
			189: { text: "-" },
			106: { text: "*" },
			111: { text: "/" },
			191: { text: "/" },
		},
		// lastCal: false
	},
	methods: {
		btnText(text) {
			this.calData.inputText += text;
			// this.lastCal = false;
		},
		btnCalcAll() {
			if (this.calData.inputText !== "") {
				this.calData.answer = ("" + eval(this.calData.inputText.split("＊").join("*"))).substr(0, 9);
				this.calData.inputText = "";
				// this.lastCal = true;
			} else {
				this.calData.answer = "nothing to calculate";
			}
		},
		btnAllClear() {
			if (this.calData.inputText !== "") {
				this.calData.answer = 0;
				this.calData.inputText = "";
			} else {
				this.calData.answer = "nothing to clear";
			}
		},
		btnClearInput() {
			if (this.calData.inputText !== "") {
				this.calData.inputText = "";
			} else {
				this.calData.answer = "nothing to clear";
			}
		},
		btnBack() {
			if (this.calData.inputText !== "") {
				this.calData.inputText = this.calData.inputText.substr(0, this.calData.inputText.length - 1);
			} else {
				this.calData.answer = "can't go back"
			}
		},
		onKeyDown(event) {
			if (this.calData.answer === "nothing to clear" && this.keyData[event.keyCode] 
				|| 
				this.calData.answer === "nothing to calculate" && this.keyData[event.keyCode] 
				|| 
				this.calData.answer === "can't go back" && this.keyData[event.keyCode]) 
			{
				this.calData.answer = 0;
				this.calData.inputText += this.keyData[event.keyCode].text;
			} else if (event.keyCode === 56 && event.shiftKey) {
				this.calData.inputText += "*";
			} else if (event.keyCode === 61 && event.shiftKey || event.keyCode === 187 && event.shiftKey) {
				this.calData.inputText += "+";
			} else if (this.keyData[event.keyCode]) {
				// when a key is pressed that matches any keyCode stored in keyData, add text
				this.calData.inputText += this.keyData[event.keyCode].text;
				// console.log(event.which);
			} else if (event.keyCode === 8) {
				this.btnBack();
			} else if (event.keyCode === 13 || event.keyCode === 61 || event.keyCode === 187) {
				this.btnCalcAll();
			} else if (event.keyCode === 67) {
				this.btnClearInput();
			} else if (event.keyCode === 65) {
				this.btnAllClear();
			} else {
				console.log("invalid key - " + event.keyCode);
			}
		}
	},
	mounted:
		function() {
			window.addEventListener("keydown", this.onKeyDown);
		}
});