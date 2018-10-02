const app = new Vue({
	el: "#app",
	data: {
		streamers: [],
		selectedCategory: "all",
		searchStreamers: ""
	},
	methods: {
		fetchItems() {
			let initial_ids = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "csharpfritz"]

			for (let i in initial_ids) {

				let id = initial_ids[i]

				var getChannel = () => {
				  return axios.get(`https://wind-bow.glitch.me/twitch-api/channels/${id}`);
				}
				
				var getStream = () => {
				  return axios.get(`https://wind-bow.glitch.me/twitch-api/streams/${id}`);
				}
				
				axios.all([
					getChannel(),
					getStream()
				])
				  .then(axios.spread((channelResponse, streamResponse) => {
				    // all requests are now complete
				    var data = Object.assign({}, channelResponse.data, streamResponse.data) // combine json
				    // console.log(data)
				    return this.streamers.push(data)
				}));
			}
		},
		addStatus() {
			for (var i = 0; i < this.streamers.length; i++) {
				if (this.streamers[i].stream === null) {
					this.streamers[i].live_status = "offline" // add key value pair live_status: "offline" to object
				} else {
					this.streamers[i].live_status = "online"
				}
				// console.log(this.streamers[i])
			}
		}
	},
	computed: {
		filteredStreamers() {
			this.addStatus();
			
			if (this.selectedCategory === "all") {
				return this.streamers.filter((currentStreamer) => {
					let matches = true;

					if (this.searchStreamers !== "" && !currentStreamer.display_name.toLowerCase().includes(this.searchStreamers.toLowerCase())) {
						matches = false
					}
					
					if (matches === true) {
						return this.streamers;
					}
				});
			} else {
				return this.streamers.filter((currentStreamer) => {
					let matches = true;

					if (this.searchStreamers !== "" && !currentStreamer.display_name.toLowerCase().includes(this.searchStreamers.toLowerCase())) {
						matches = false
					}

					if (matches === true) {
						// filter based on live_status
						return currentStreamer.live_status === this.selectedCategory;
					}
				});
			}
		}
	},
	created() {
		this.fetchItems()
	}
})