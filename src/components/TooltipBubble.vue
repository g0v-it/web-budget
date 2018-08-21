<template>
    <div id="bubble-tooltip"  >
        <div id="bubble-tooltipContainer">
            <div class="tooltip-topLevel">{{topLevel}}</div>
            <hr>
            <div class="tooltip-title">{{title}}</div>
            <!--<div class="tooltip">{{mission}}</div>-->
            <div class="tooltip-valuesContainer">
                <span class="tooltip-value">{{amount}}</span>
                <span class="tooltip-diff" v-bind:style="{color:color}">{{diff}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
   props: {
       topLevel:String,
       title:String,
       amount:Number,
        diff: Number,
        color:String
   }
};
</script>
<style>
#bubble-tooltip{
    position:absolute;
    z-index: 2;
    top:0;
    left:0;
}
</style>

