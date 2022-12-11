<template>
    <div class="progress">
        <div class="progress-bar progress-bar-striped" :class="bootstrapClass" :style="{width: percentage + '%'}"></div>
        <span class="percent">{{ percentage }}%</span>
    </div>
</template>
<script>
export default {
    props: {
        bootstrapClass: {
            type: String,
            default: 'bg-success',
        },
        percentage: {
            type: Number,
            default: 0,
        }
    }
}
</script>
<style scoped>
.progress{
    position: relative;
    width: 100%;
    height: 2em;
}

.percent{
    display: block;
    position: absolute;
    text-align: center;
    background: transparent;
    width: 100%;
    line-height: 2em;
    color: #fff;
}
</style>