<template>
  <div style="padding: 0 15px" @click="toggleClick">
    <i class="el-icon-s-unfold hamburger" :class="{ 'is-active': isActive }"></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped lang="scss">
.hamburger {
  display: inline-block;
  vertical-align: middle;
  color: $subColor;
  font-size: 20px;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
