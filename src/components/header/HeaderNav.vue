<template>
  <div class="my-header-nav">
    <div class="button small" @click="$router.back()">
      <i class="el-icon-back"></i>
    </div>
    <div class="button" @click="$emit('collapse-click')">
      <i :class="icon"></i>
    </div>

    <header-breadcrumb v-if="showBreadcrumb"></header-breadcrumb>
    <div class="blank"></div>
    <div class="my-header-end">
      <el-avatar icon="el-icon-user"></el-avatar>
    </div>
  </div>
</template>

<script>
import HeaderBreadcrumb from '@/components/header/HeaderBreadcrumb.vue'

export default {
    name: 'HeaderNav',
    props: {
        collapseSide: {
            type: Boolean,
            default: true,
        },
        showBreadcrumb: {
            type: Boolean,
            default: true,
        },
    },
    components: { HeaderBreadcrumb },
    computed: {
        icon() {
            return this.collapseSide ? 'el-icon-s-unfold' : 'el-icon-s-fold'
        },
    },
}
</script>

<style scoped>

.my-header-nav {
  flex-direction: row;
  display: flex;
  align-items: center;
  height: 100%;
}

.button {
  font-size: 2em;
  color: #8a8a8a;
  margin-right: 30px;
}

.button.small {
  font-size: 1.5em;
  margin-right: 15px;
}

.button:hover {
  color: #4888d6;
}

@media screen and (max-width: 768px) {
  .button:hover, .button {
    color: #4888d6;
  }
}
.my-header-end {
  flex: 0 0 1;
}
</style>