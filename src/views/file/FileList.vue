<!--
 * @Author: smq
 * @Date: 2021/7/11
 -->
<template>
  <div v-if="files.length <= 0">
    <el-empty
      v-if="!emptyMessage"
      :description="emptyDesc"
      @contextmenu.prevent="contextMenu"
    />
    <el-result
      v-else
      icon="error"
      title="文件夹打不开qwq"
      :sub-title="emptyMessage"
    />
  </div>
  <div
    v-else
    class="selection-container"
    @contextmenu.prevent="contextMenu"
  >
    <div
      v-if="view === 'grid'"
      class="list"
    >
      <file-list-item
        v-for="f in files"
        :key="f.fileName"
        :selected="selected.get(f.fileName) === true"
        :data-filename="f.fileName"
        :file="f"
        class="item selection-item"
        @file-open="$emit('file-open', $event)"
        @clearSelection="clearSelection"
        @update:selected="selected.set(f.fileName, $event)"
      />
    </div>
  </div>
</template>

<script>
import FileListItem from '@/components/file/FileListItem.vue'
import SelectionArea from '@simonwep/selection-js'

export default {
    name: 'FileList',
    components: {FileListItem},
    props: {
        files: {
            type: Object,
            required: true
        },
        emptyMessage: {
            type: String,
            default: ''
        },
        selected: {
            type: Map,
            default: new Map()
        },
        emptyDesc: {
            type: String,
            default: '啊偶，这个文件夹是空的耶~'
        }

    },
    emits: ['file-open'],
    data() {
        return {
            view: 'grid',
            // selected: new Map(),
            selectionMode: false,
            selection: {},
        }
    },
    computed: {
        isMobile() {
            return this.$store.isMobile
        },
    },

    mounted() {
        if (!this.isMobile) {
            const selection = new SelectionArea({
                // document object - if you want to use it within an embed document (or iframe).
                document: window.document,
                class: 'selection-area',
                container: '.selection-container',
                selectables: ['.selection-item'],
                startareas: ['.selection-container'],
                boundaries: ['.selection-container'],
                startThreshold: 10,
                allowTouch: false,
                intersect: 'touch',
                overlap: 'invert',
                singleTap: {
                    allow: false,
                    intersect: 'native',
                },
                scrolling: {
                    speedDivider: 10,
                    manualSpeed: 750,
                },
            })

            selection
                .on('start', (evt) => {
                    if (!evt.event.ctrlKey && !evt.event.metaKey) {
                        this.selected.clear()
                    } else {
                        // eslint-disable-next-line no-param-reassign
                        evt.store.stored =
                            [...window.document.getElementsByClassName('selection-item')]
                                .filter((el) => {
                                    const attr = el.getAttribute('data-filename')
                                    if (attr == null)
                                        return false

                                    return this.selected.set(attr, true)
                                })
                    }
                })
                .on('move', (evt) => {
                    const {added, removed} = evt.store.changed
                    added.forEach((it) => {
                        const attr = it.getAttribute('data-filename')
                        this.selected.set(attr, true)
                    })
                    removed.forEach((it) => {
                        const attr = it.getAttribute('data-filename')
                        this.selected.set(attr, false)
                    })
                })
                .on('stop', () => {
                    selection.clearSelection()
                })

            this.selection = selection
        }
    }
    ,
    methods: {
        clearSelection() {
            this.selected.clear()
        },
        contextMenu(e) {
            this.clearSelection()
            this.$bus.emit('file-context-menu', e)
        }
    }
    ,

}
</script>

<style lang="less">

.selection-area {
  background: rgba(46, 115, 252, 0.11);
  border: 2px solid rgba(98, 155, 255, 0.81);
  border-radius: 0.1em;
}
</style>
<style
  scoped
  lang="less"
>
.selection-container {
  min-height: 100%;
  user-select: none;
}

.list {
  display: grid;
  flex-wrap: wrap;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, 180px);
  grid-gap: 8px;

  .item {
    padding: 16px 0;
  }
}

@media screen and (max-width: 768px) {
  .list {
    grid-template-columns: repeat(auto-fill, 110px);
    grid-gap: 4px;
  }

}
</style>
