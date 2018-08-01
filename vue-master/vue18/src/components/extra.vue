<template>
    <div>
        <transition name="fade">
            <h1 v-if="!msg">{{ intro }}</h1>
        </transition>
        <transition name="fade">
            <h1 v-if="msg">{{ msg }}</h1>
        </transition>
    </div>
</template>

<script>
export default {
  name: "Extra",
  props: {
    msg: String
  },
  data() {
    return {
      intro: "Extra"
    };
  },
  watch: {
    msg: {
      immediate: true,
      handler(val, oldval) {
        //
      }
    }
  }
};
</script>
<style scoped>
.fade-enter-active {
  transition: opacity 1.5s;
}
.fade-leave-active {
  opacity: 0;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
