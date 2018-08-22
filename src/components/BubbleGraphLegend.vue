<template>
    <div class="legend">
        <div class="legend-description">
             <h2 class="title">Come vengono gestite le spese</h2>
            <p class="description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, corporis cumque aut saepe voluptates quasi veniam.
            </p>
        </div>
        <svg class="legend-radius">
            <circle vector-effect="non-scaling-stroke" cx="137.5000000000001" cy="141.49999999999991" r="15" fill="none" stroke-width="1" stroke="rgb(190,190,190)"/>
            <circle vector-effect="non-scaling-stroke" cx="115.00000000000009" cy="160.5" r="4" fill="none" stroke-width="1" stroke="rgb(190,190,190)"/>
            <circle vector-effect="non-scaling-stroke" cx="208" cy="105.49999999999994" r="50" fill="none" stroke-width="1" stroke="rgb(190,190,190)"/>
            <g transform="matrix(1,0,0,1,68,57.5)">
            <text transform="matrix(1,0,0,1,0,12.574)" style="font-family:&quot;Roboto Mono&quot;;font-weight:100;font-size:12px;font-style:normal;fill:#000000;stroke:none;">20000 milioni</text>
            </g><g transform="matrix(1,0,0,1,42.5,112.5)">
            <text transform="matrix(1,0,0,1,0,12.574)" style="font-family:&quot;Roboto Mono&quot;;font-weight:100;font-size:12px;font-style:normal;fill:#000000;stroke:none;">500 milioni</text></g>
            <g transform="matrix(1,0,0,1,34,141.5)">
            <text transform="matrix(1,0,0,1,0,12.574)" style="font-family:&quot;Roboto Mono&quot;;font-weight:100;font-size:12px;font-style:normal;fill:#000000;stroke:none;">50 milioni</text></g>
        </svg>
       
        <div  class="legend-colors">
            <p>I colori indicano i tagli e gli incrementi dall'ultimo rendiconto spese disponibile</p> 
            <ul class="colors">
                <li class="change-dec3"></li>
                <li class="change-dec2"></li>
                <li class="change-dec1"></li>
                <li class="change-inc1"></li>
                <li class="change-inc2"></li>
                <li class="change-inc3"></li>
            </ul>
            <p></p> 
            <ul class="labels">
                <li>-25%</li>
                <li>-5%</li>
                <li>0</li>
                <li>+5%</li>
                <li>+25%</li>
            </ul>
        </div>
        
    </div>
</template>

<script>
export default {};
</script>

<style>
.legend {
  margin: 0;
  padding: 7rem 0;
  height: 100%;
  top: 0;
  width: 25rem;
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}
.legend * {
  pointer-events: all;
}

.legend-description .description {
  padding: 1rem 0;
  margin: 0;
}
.legend-radius {
  flex: 2;
}
.legend-colors .colors {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.legend-colors .labels {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.legend-colors p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.labels li {
  text-align: center;
  padding: 0;
  margin: 0;
  height: 1rem;
  width: 20%;
}

.colors li {
  padding: 0;
  margin: 0;
  height: 1rem;
  width: 16%;
}

.change-dec3 {
  background: #d84b2a;
}
.change-dec2 {
  background: #ee9586;
}
.change-dec1 {
  background: #e4b7b2;
}
.change-inc1 {
  background: #beccae;
}
.change-inc2 {
  background: #9caf84;
}
.change-inc3 {
  background: #7aa25c;
}
</style>

