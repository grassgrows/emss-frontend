<template>
  <el-breadcrumb separator="/" class="my-breadcrumb">
    <el-breadcrumb-item v-for="(b,i) in displayBCs.data"
                        :key="i+ displayBCs.skipped"
                        :to="getBreadPath(b,i)">
      {{ b }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
const pathMaps = new Map()
    .set('工作台', '/workbench')
    .set('服务器', '/server/list')
    .set('用户管理', '/system/users/')
    .set('文件管理', '/files')
export default {
    name: 'header-breadcrumb',
    props: {
        maxBreadcrumb: {
            type: Number,
            default: -1,
        },
    },
    methods: {
        getBreadPath(breadcrumb, index) {
            if (this.displayBCs.skipped > 0 && index === 0) {
                if (this.displayBCs.skipped > 1) {
                    return `/files/${this.breadcrumbs[2]}`
                }
                return '/files'
            }
            if (index >= this.displayBCs.data.length - 1) {
                return null
            }
            const actualIndex = index + this.displayBCs.skipped
            if (this.$route.meta.menuIndex === '/files' && actualIndex > 1) {
                return `/files/${this.breadcrumbs.slice(2, actualIndex + 1).join('/')}`
            }
            if (typeof this.$route.meta.breadcrumbAdd === 'string' && index === this.breadcrumbs.length - 2) {
                return `/servers/${breadcrumb}`
            }
            return pathMaps.get(breadcrumb)
        },
    },
    computed: {
        breadcrumbs() {
            const { breadcrumb, breadcrumbAdd } = this.$route.meta
            if (typeof breadcrumbAdd === 'string' && typeof breadcrumb === 'function') {
                const result = breadcrumb(this.$route)
                result.push(breadcrumbAdd)
                return result
            }
            if (typeof breadcrumb === 'function') {
                return breadcrumb(this.$route)
            }
            if (typeof breadcrumb === 'undefined') {
                return []
            }
            return breadcrumb
        },
        displayBCs() {
            const data = this.breadcrumbs.map((s) => s.resizeTo(10, '..'))
            if (this.maxBreadcrumb <= 0 || this.breadcrumbs.length <= this.maxBreadcrumb) {
                return {
                    skipped: 0,
                    data,
                }
            }
            const skipped = data.length - this.maxBreadcrumb
            return {
                skipped,
                data: ['...', ...data.slice(skipped + 1)],
            }
            // let i;
            // for (i = 0; i < 2; i++) {
            //   result.splice(0, 1);
            //   if (result.length <= this.maxBreadcrumb) {
            //     return {
            //       skipped: i + 1,
            //       data: result,
            //     };
            //   }
            // }
            // return {
            //   skipped: i,
            //   data: [...result.slice(0, this.maxBreadcrumb - 1), '...'],
            // };
        },
    },
}
</script>

<style scoped>
</style>