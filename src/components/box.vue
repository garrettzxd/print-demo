<template>
    <div class="my-box" :style="boxStyle" :class="[{fill: fill},boxClass]">
        <slot>这里是BOX组件内部</slot>
    </div>
</template>

<script>
export default{
    name: 'Box',
    props: {
        boxStyle: String,
        boxClass:
        [String,Object],
        fill:Boolean
    }
}
</script>

<style scoped>
.my-box{
    margin-bottom: 3px;
    border-radius: 3px;
    width: 100%;
    box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    background: #fff;
    padding: 10px;
    box-sizing: border-box;
}
.fill{
	min-height: 900px;
}
.box{
    margin-bottom: 3px;
}
</style>