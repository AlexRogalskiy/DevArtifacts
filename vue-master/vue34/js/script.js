Vue.component('accordion', {
  render (createElement) {
    return createElement(
      'div', 
      { class: 'accordion' }, 
      this.$slots.default
    )
  }
})

Vue.component('accordion-item', {
  data () {
    return {
      sharedState: {
        expanded: false
      }
    }
  },
  
  provide () {
    return {
      accordionItemState: this.sharedState
    }
  },
  
  render (createElement) {
    return createElement(
      'div', 
      { class: 'accordion-item' }, 
      this.$slots.default
    )
  }
})

Vue.component('accordion-header', {
  inject: ['accordionItemState'],
  
  template: `
    <h2 class="accordion-header">
      <button @click="accordionItemState.expanded = !accordionItemState.expanded">
        {{ accordionItemState.expanded ? '▼' : '►' }} 
        <slot></slot>
      </button>
    </h2>
  `
})

Vue.component('accordion-panel', {
  inject: ['accordionItemState'],
  
  template: `
    <div class="accordion-panel" :class="{ expanded: accordionItemState.expanded }">
      <slot></slot>
    </div>
  `
})

const app = new Vue({
  el: '#app'
})