<template>
    <div class="add">
        <el-dialog title="添加服务器" v-model="dialogAdd" @close="closeDialog">
            <el-form v-model="newServer">
                <el-form-item label="服务器名称">
                    <el-input v-model="newServer.name"></el-input>
                </el-form-item>
                <el-form-item label="服务器缩写">
                    <el-input v-model="newServer.shortName"></el-input>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" @click="nextStep">下一步</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'AddServer',
    props: {
        // dialogAdd: {
        //     type: Boolean,
        //     default: false,
        // }
    },
    data() {
        return {
            newServer: {
                name: '',
                shortName: ''
            }
        }
    },
    computed: {
        dialogAdd: {
            get() {
                return this.$store.state.addState
            },
            set(newVal) {
                this.$store.commit('changeAddState', newVal)
            }
        }
    },
    methods: {
        nextStep() {
            console.log('下一步')
        },
        closeDialog() {
            
        }
    }
}
</script>

<style scoped>

</style>