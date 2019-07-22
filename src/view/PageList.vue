<template>
    <div class="page-list">
        <div class="shadow"></div>
        <div
            :key="page.id"
            :ref="page.id"
            class="page-item"
            v-for="page in pages"
            v-show="page.id == activeId"
        />
    </div>
</template>

<script>
    import Graph from '../mxgraph/Graph'
    import themesXML from '../utils/themesXML'
    import Editor from '../mxgraph/editor'

    export default {
        props: {
            pages: {
                type: Array
            },
            activeId: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {};
        },
        components: {},
        created() {
            this.themes = themesXML();
        },
        methods: {
            createPage() {
                return this.pages.map(page => {
                    return new Graph(this.$refs[page.id][0], null, null, null, this.themes)
                });
            },
        },
        mounted() {
            this.$Editor.init(this.createPage(), this.activeId)
        }
    };
</script>

<style lang="scss">
    .page-list {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #f8f9fa;

        .page-item {
            width: 100%;
            height: 100%;
        }

        .shadow {
            position: absolute;
            top: 0;
            left: 0;
            width: 960px;
            height: 540px;
            box-shadow: 0 1px 5px 1px rgba(60, 64, 67, 0.15);
            transform-origin: 0 0;
        }
    }
</style>