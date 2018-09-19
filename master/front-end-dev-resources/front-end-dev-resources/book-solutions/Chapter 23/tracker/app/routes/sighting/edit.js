import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    var sighting = this.store.findRecord('sighting', params.sighting_id);
    var cryptids = this.store.findAll('cryptid');
    var witnesses = this.store.findAll('witness');
    return Ember.RSVP.hash({
      sighting: sighting,
      cryptids: cryptids,
      witnesses: witnesses
    });
  }
});
