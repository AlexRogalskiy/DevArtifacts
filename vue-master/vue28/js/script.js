new Vue({
  el: "#app",
  data() {
    return {
      totalWidth: 0,
      title: 'Vue.js Form',
      registerLabel: 'Register',
      items: [
        {
          id: 0,
          model: "",
          type: 'text',
          placeholder: 'First Name'
        },
        {
          id: 1,
          model: "",
          type: 'text',
          placeholder: 'Last Name'
        },
        {
          id: 2,
          model: "",
          type: 'email',
          placeholder: 'Email Address'
        },
        {
          id: 3,
          model: "",
          type: 'password',
          placeholder: 'Password'
        }
      ]
    }
  },
  methods: {
    calculateForm() {
      const input = document.getElementsByTagName('input')
      const allInputs = input.length;
      let touchedInput = 0;
      
      for (let i = 0; i < allInputs; i++) {
        if ((input[i].value)) {
          touchedInput++;
        }
      }
  
      this.totalWidth = Math.round(touchedInput / allInputs * 100);
    }
  }
})