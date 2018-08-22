<template>
    <div id="bubble-tooltip"  >
            <v-card-title id="tooltipTitle" class="headline grey lighten-2" primary-title><p>{{topLevel}}</p></v-card-title>
             <v-card-text id="tooltipText">
              <p>{{title}}</p>
            <!--<h3 class="tooltip">{{mission}}</h3>-->
            </v-card-text>
            <div id="numberContainer">
                <v-chip id="amount" text-color="black"><h3>{{amount}}</h3></v-chip>
                <v-chip :style="{backgroundColor:bgColor}" text-color="white"><h3>{{diff}}</h3></v-chip>  
            </div>                
    </div>
</template>
<script>
export default {
  props: {
    topLevel: String,
    title: String,
    amount: String,
    diff: String,
    bgColor: String,
    dkColor: String,
    xPos:Number,
    yPos:Number
  }
};
</script>
<style>
#bubble-tooltip {
width: 17rem;
height: 10rem;
  position: absolute;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
#tooltipTitle{
    padding: 0.1rem;
    text-align: center;
}

#tooltipTitle p{
    width:100%;
    font-size: 13px;
    margin: 0px;
}


#tooltipText {
    padding:0rem;
}
#tooltipText p {
    padding-left:1rem;
    padding-right:1rem;
    padding-top:0.5rem;
    padding-bottom:0.1rem;
    font-size: 13px;
    margin:0rem;
}
#numberContainer{
    display: flex;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: middle;
  padding-left:1rem;
    padding-right:1rem;
}

#numberContainer h3{
    display: table-cell;
    vertical-align: middle;
}
#numberContainer #amount{
    background-color: #fff;
    padding:0px;
}

</style>

