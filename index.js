import loader from './loader.vue'

export default {
    install (Vue, options) {
        Vue.mixin({
            components:{
                loader
            }
        })
    }
}