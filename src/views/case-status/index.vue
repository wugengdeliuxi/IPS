<template>
  <div class="case-stage">
    <base-manage :type="2"></base-manage>
  </div>
</template>

<script>
import BaseManage from '@/components/Base/BaseManage'

export default {
  name: 'Status',
  components: {
    BaseManage
  }
}
</script>

<style scoped></style>
