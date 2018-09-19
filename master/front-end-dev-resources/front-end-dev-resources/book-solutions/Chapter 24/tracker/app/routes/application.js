import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    flash: function(data) {
      this.controller.set('alertMessage', data.message);
      this.controller.set('alertType', data.alertType);
      this.controller.set('isAlertShowing', true);
    }
  }
});
