<template>
    <div class="legend">
        
        <ul class="legend-colors">
            <li class="change-dec3"></li>
            <li class="change-dec2"></li>
            <li class="change-dec1"></li>
            <li class="change-inc1"></li>
            <li class="change-inc2"></li>
            <li class="change-inc3"></li>
        </ul>
        <ul class="legend-labels">
            <li>-25%</li>
            <li>-5%</li>
            <li>0</li>
            <li>+5%</li>
            <li>+25%</li>
        </ul>
    </div>
</template>

<script>
export default {};
</script>

<style>
.legend{
    margin: 0;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.legend-colors{
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.legend-colors li{
    padding: 0;
    margin:0;
    height: 1rem;
    width: 16%;
}

.change-dec3{
    background: #D84B2A;
}
.change-dec2{
    background: #EE9586;
}
.change-dec1{
    background: #E4B7B2;
}
.change-inc1{
    background: #BECCAE;
}
.change-inc2{
    background: #9CAF84;
}
.change-inc3{
    background: #7AA25C;
}

</style>

