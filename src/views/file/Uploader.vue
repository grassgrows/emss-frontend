<template>
  <div class="uploader-container">
    <el-card body-style="padding: 0">
      <div>
        <div
          class="status-bar"
          @click="toggleShrunk()"
        >
          <div class="content">
            <span class="icon"><i class="el-icon-upload" /></span>
            <span>正在上传</span>
            <span class="divider"><el-divider direction="vertical" /></span>
            <span>剩余1项</span>
          </div>
          <div class="upload-action">
            <span>
              <el-tooltip
                effect="dark"
                content="全部取消"
                placement="top"
              >
                <i class="el-icon-close" />
              </el-tooltip>
            </span>
            <span>
              <el-tooltip
                effect="dark"
                content="全部恢复"
                placement="top"
              >
                <i class="el-icon-refresh" />
              </el-tooltip>
            </span>
          </div>
        </div>
        <transition name="fade">
          <div
            v-if="!shrunk"
            class="shrunk-wrapper"
          >
            <div class="upload-content">
              <div>
                <ul>
                  <li
                    v-for="i in 10"
                    :key="i"
                  >
                    <div class="upload-progress" />
                    <div class="upload-info">
                      <div class="image">
                        <svg
                          class="filefont"
                          aria-hidden="true"
                        >
                          <use xlink:href="#icon-f-blank" />
                        </svg>
                      </div>

                      <div class="info">
                        <div class="title">
                          EngiTech-1.5.7-server.zip
                        </div>
                        <div class="status">
                          <span>10MB/100MB</span>
                          <span class="divider"><el-divider direction="vertical" /></span>
                          <span>上传中</span>
                        </div>
                      </div>
                    </div>

                    <div class="upload-action">
                      <span>
                        <el-tooltip
                          effect="dark"
                          content="取消"
                          placement="top"
                        >
                          <i class="el-icon-close" />
                        </el-tooltip>
                      </span>
                      <span>
                        <el-tooltip
                          v-if="i>3"
                          effect="dark"
                          content="恢复"
                          placement="top"
                        >
                          <i class="el-icon-refresh" />
                        </el-tooltip>
                        <el-tooltip
                          v-else
                          effect="dark"
                          content="暂停"
                          placement="top"
                        >
                          <i class="el-icon- iconfont emss-icon-pause" />
                        </el-tooltip>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="hide-button">
              <el-button
                type="text"
                @click="toggleShrunk(true)"
              >
                收起
              </el-button>
            </div>
          </div>
        </transition>
        <div
          v-if="shrunk"
          class="progress-total"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'Uploader',
    data() {
        return {
            shrunk: true
        }
    },
    methods: {
        toggleShrunk(shrunk: boolean | null = null) {
            if (shrunk != null) {
                this.shrunk = shrunk
            } else {
                this.shrunk = !this.shrunk
            }

        },
        pause(id: number | null = null) {
            console.log(id)
        },
        resume(id: number | null = null) {
            console.log(id)
        },
    }

})
</script>

<style
  scoped
  lang="less"
>
@import "../../styles/global";

.uploader-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 480px;
}

.content-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-bar {
  display: flex;
  padding: 16px 20px;

  &:hover {
    background-color: @color-btn-bg-primary;
  }

  .content {
    display: flex;
    flex: auto;
    width: 24px;
    height: 24px;
    font-size: 16px;
    align-items: flex-end;

    .divider {
      margin: 0 4px;
    }

    .icon {
      .content-center();
      margin-right: 20px;

      i {
        font-size: 22px;
      }
    }
  }


}

.upload-action {
  display: flex;
  flex-direction: row;
  flex: 0 0 auto;

  span {
    margin-left: 16px;
    box-sizing: border-box;
    background-color: @color-btn-bg-primary;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    .content-center();

    &:hover {
      background-color: @color-btn-bg-secondary;
    }

    i {
      font-size: 16px;
    }
  }
}

.upload-content {
  max-height: 65vh;
  overflow: auto;

  ul {
    padding: 0;
    margin: 0;

    li {
      list-style: none;
      padding: 16px 20px;
      display: flex;
      position: relative;


      .upload-action {
        visibility: hidden;
      }

      &:hover {
        .upload-action {
          visibility: visible;
        }
      }
    }
  }
}

.upload-info {
  flex: auto;
  display: flex;

  .image {
    margin-right: 16px;

    svg {
      height: 36px;
      width: 36px;
    }
  }

  .status {
    font-size: 14px;
    color: rgba(0, 0, 0, .25);
  }

}

.hide-button .el-button {
  width: 100%;
}


.upload-progress {
  position: absolute;
  left: 0;
  top: 3%;
  width: 30%;
  min-width: 4px;
  height: 90%;
  background-color: @color-btn-bg-primary;

  &::after {
    content: '';
    display: block;
    background-color: rgba(126, 193, 92, 0.53);
    height: 2px;
    width: 100%;
    position: absolute;
    bottom: 2px;
  }
}


.progress-total {
  &::after {
    content: '';
    display: block;
    background-color: rgba(139, 207, 104, 0.53);
    height: 3px;
    width: 60%;
    position: absolute;
    bottom: 0;
  }
}

.shrunk-wrapper {
  max-height: 80vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: max-height 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  max-height: 0;
}

</style>
