var app = new Vue({
  el: "#app",

  data: {
    password: null,
    password_length: 0,
    typed: false,
    contains_lovercase: false,
    contains_number: false,
    contains_uppercase: false,
    valid_password_length: false,
    valid_password: false
  },

  methods: {
    p_len: function() {
      this.password_length = this.password.length;
      if (this.password_length > 7) {
        this.valid_password_length = true;
      } else {
        this.valid_password_length = false;
      }

      if (this.password_length > 0) {
        this.typed = true;
      } else {
        this.typed = false;
      }

      this.contains_lovercase = /[a-z]/.test(this.password);
      this.contains_number = /\d/.test(this.password);
      this.contains_uppercase = /[A-Z]/.test(this.password);

      // Check if the password is valid
      if (this.contains_lovercase == true && this.contains_number == true) {
        this.valid_password = false;
        if (
          this.contains_uppercase == true &&
          this.valid_password_length == true
        )
          this.valid_password = true;
      } else {
        this.valid_password = false;
      }
    }
  }
});
