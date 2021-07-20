<!--
 * @Author: Neko-pararo
 * @Date: 2021/7/17
 -->

<template>
  <!--  TODO:实现文件名导入在“输入文件名”中-->

  <el-button
      type="text"
      @click="outerVisible = true"
  >
    这是一个文件名 Dialog
  </el-button>
  <!--外层dialog-->
  <el-dialog
      v-model="outerVisible"
      title="这是一个文件名"
      custom-class="file-editor-dialog"
  >
    <!-- 输入框放在body -->

    <div class="outer">
      <div class="input-container">
        <!--        <el-input-->
        <!--            type="textarea"-->
        <!--            placeholder="请输入内容"-->
        <!--            class="textarea"-->
        <!--            resize="none"-->
        <!--            :disabled="true"-->
        <!--            rows="50"-->
        <!--        >-->
        <!--        </el-input>-->
        <ace-input class="textarea"/>

        <div class="toolbox">
          <div class="button-edit">
            <el-button
                icon="el-icon-edit"
                circle
            />
          </div>
          <div class="button-download">
            <el-button
                icon="el-icon-download"
                circle
            />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import AceInput from '@/components/common/AceInput'

export default {
    components: {AceInput},
    data() {
        return {
            value: '',
            outerVisible: false,
            innerVisible: false
        }
    },
    mounted() {
    }
}
</script>
<style lang="less">


.file-editor-dialog {
  .el-dialog__body {

    @media screen and (max-width: 728px) {
      padding: 0 5px 5px;
    }
  }

  width: 80% !important;
  margin: 2vh auto !important;

  @media screen and (max-width: 728px) {
    margin: 8vh auto !important;
    width: 95% !important;
  }
}


</style>
<style scoped lang="less">
.input-container {
  position: relative;
  height: 100%;
}

.textarea {
  width: 100%;
  height: 100%;
}

.outer {
  height: 75vh;
}


.toolbox {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;

  div[class^=button-] {
    margin: 5px 0;
  }

}


.button-edit {
  right: 0;

}
</style>
