import Vue from 'vue';
import listEntries from '@/components/listEntries';

describe('listEntries.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(listEntries);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.list-entries li:eq(0)').textContent)
      .to.equal('Test 1');
  });
});
