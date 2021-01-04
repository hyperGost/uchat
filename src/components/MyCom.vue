<template>
    <div :class="{trans}" id="mycom">
        {{message}}
    </div>
</template>
<script>
export default {
    data(){
        return{
            trans:false
        }
    },
    props:{
        message:{
            default:'提示'
        }
    },
    methods:{
        show(){
            this.trans=true;
        }
    }
}
</script>
<style>
    #mycom{
        padding: 0 8px;
        height: 30px;
        background: #777;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,30%);
        border-radius: 5px;
        text-align: center;
        color: #fff;
        transition: all 0.2s ease-in-out;
        opacity: 0;
        line-height: 30px;
        z-index: 999;
    }
    #mycom.trans{
        transform: translate(-50%,-50%);
        opacity: 1;
    }
</style>