<!--
 * @Author: smq
 * @Date: 2021/7/9
 -->
<template>
  <el-card :body-style="{ padding: '0px'}"
           shadow="always">
    <div class="card-container">
      <div class="card-header">
        <div>{{ header }}</div>
        <template v-if="typeof icon !== 'undefined'">
          <div class="blank"></div>
          <div class="header-icon"><i :class="icon"></i></div>
        </template>
      </div>
      <div class="card-subheader">
        <slot name="subheader"></slot>
      </div>
      <div class="card-content">
        <slot></slot>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
    name: 'CommonInfoCard',
    props: ['header', 'icon'],
}
</script>

<style scoped>
.card-container {
  height: 180px;
  padding: 16px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  display: flex;
}

.card-header .header-icon {
  margin-right: 4px;
}

.card-subheader {
  color: rgba(0, 0, 0, .55);
  font-size: 12px;
  margin: 0 0 8px 8px;
}

.card-content {
  flex: 1 1 0;
  padding-top: 8px;
}
</style>