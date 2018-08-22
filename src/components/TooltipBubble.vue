<template>
    <div id="bubble-tooltip" >
            <div>
            <div class="tooltip-topLevel">{{topLevel}}</div>
            <hr>
            </div>
            <div class="tooltip-title">{{title}}</div>
            <!--<div class="tooltip">{{mission}}</div>-->
            <div class="grid-container">
            <div class="tooltip-amount"><h3>{{amount}}</h3></div>
            <div class="tooltip-diff"><h2>{{diff}}</h2></div>
            </div> 
           
        
    </div>
</template>
<script>
export default {
   props: {
       topLevel:String,
       title:String,
       amount:Number,
        diff: String,
        bgColor:String,
        textColor:String
   }
};
</script>
<style>
#bubble-tooltip{
    position:absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 15rem;
    width: 25rem;
    top:0;
    left:0;
    padding: 1rem;
    border-radius: 2px;
    min-width: 0;
    text-decoration: none;
    -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
    background-color: #fff;
    color: rgba(0, 0, 0, 0.87);

}
.grid-container{
    display:grid;
    grid-template-areas:
    'amount diff';
}
.tooltip-topLevel{
   
}
.tooltip-title{
}
.tooltip-amount{
    grid-area: amount;
    text-align: left;
}
.tooltip-diff{
    grid-area: diff;
    text-align: right;
}


</style>

