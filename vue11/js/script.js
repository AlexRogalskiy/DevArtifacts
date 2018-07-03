new Vue({
  el: "#app",
  data() {
    return {
      textdesc: {},
      desc: "",
      image: "",
      combinedText: "",
      noText: false,
      noText2: false,
      moreInfo: false
    };
  },
  filters: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  },
  computed: {
    alttext() {
      if (Object.keys(this.textdesc).length > 0) {
        let textarr = [];
        this.textdesc.regions.forEach(region => {
          region.lines.forEach(line => {
            line.words.forEach(word => {
              textarr.push(word.text);
            });
          });
        });
        return textarr.join(" ");
      }
    }
  },
  methods: {
    apiReq(params, urlPath) {
      let uribase = `https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/${urlPath}`;

      let data, contentType;
      if (typeof this.image === "string") {
        data = { url: this.image };
        contentType = "application/json";
      } else {
        data = this.image;
        contentType = "application/octet-stream";
      }

      return axios({
        method: "post",
        url: uribase,
        data: data,
        params: params,
        headers: {
          "Content-Type": contentType,
          "Ocp-Apim-Subscription-Key": "5cd9392bcf6b4303920916aef005fd37"
        },
        validateStatus: function(status) {
          return status < 500;
        }
      });
    },
    visionReq() {
      let param1 = {
        language: "unk",
        "detectOrientation ": "true"
      };
      let param2 = {
        visualFeatures: "Categories,Description,Color",
        details: "",
        language: "en"
      };

      this.apiReq(param1, "ocr").then(response => {
        if (response.status === 200) {
          this.textdesc = response.data;
        } else {
          this.noText = true;
        }
      });

      this.apiReq(param2, "analyze").then(response => {
        if (response.status === 200) {
          this.desc = response.data.description.captions[0].text;
        } else {
          this.noText2 = true;
        }
      });
    },
    fileUpload(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.image = files[0];
      this.createImage();
      this.visionReq();
    },
    useMine() {
      this.image =
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/heygirl.jpg";
      this.visionReq();
    },
    createImage() {
      var image = new Image();
      var reader = new FileReader();

      reader.onload = e => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(this.image);
    },
    removeImage: function(e) {
      this.image = "";
      this.noText = false;
      this.noText2 = false;
      this.textdesc = {};
      this.desc = "";
      this.altText = "";
      this.combinedText = "";

      setTimeout(() => {
        this.$refs.selectimg.focus();
      }, 1000);
    }
  },
  watch: {
    desc() {
      if (this.desc === undefined) {
        this.combinedText = "";
      } else if (this.desc.length > 0) {
        if (this.alttext !== undefined && this.alttext.length > 0) {
          this.combinedText = `${this.desc}, the text says: "${this.alttext}"`;
        } else {
          this.combinedText = `${this.desc}`;
        }
      }
    }
  }
});
