<!--
 * @Author: smq
 * @Date: 2021/7/11
 -->
<template>
  <div class="selection-container">
    <div
      v-if="view === 'grid'"
      class="list"
    >
      <file-list-item
        v-for="f in files"
        :key="f.fileName"
        v-model:selected="selected[f.fileName]"
        class="item selection-item"
        :data-filename="f.fileName"
        :file="f"
      />
    </div>
  </div>
</template>

<script>
import FileListItem from '@/components/file/FileListItem.vue'
import SelectionArea from '@simonwep/selection-js'
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'FileList',
    components: {FileListItem},
    props: {
        files: {
            type: Object,
            require: true
        }

    },
    data() {
        return {
            view: 'grid',
            selected: {},
            selectionMode: false,
            selection: {},
        }
    }
    ,
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
                        this.selected = new Map()
                    } else {
                        // eslint-disable-next-line no-param-reassign
                        evt.store.stored =
                            [...window.document.getElementsByClassName('selection-item')]
                                .filter((el) => {
                                    const attr = el.getAttribute('data-filename')
                                    if (attr == null)
                                        return false

                                    return this.selected.get(attr) === true
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
                        this.selected.set(attr, true)
                    })
                }).on('stop', () => {
                    selection.clearSelection()
                })

            this.selection = selection
        }
    }
    ,
    methods: {}
    ,

})
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
