export function fillColor(val) {
    /* if (val === Infinity) {
        return '#000000'
    } */
    let color = "#D84B2A";
    if (val > -25) {
        color = "#EE9586";
    }
    if (val > -5) {
        color = "#E4B7B2";
    }
    if (val >= 0) {
        color = "#BECCAE";
    }
    if (val > 5) {
        color = "#9CAF84";
    }
    if (val > 25) {
        color = "#7AA25C";
    }
    return color;
};

export function calcCenterOfBlocks(childNodes) {
    let centers = [];
    let offset = 24;
    for (const key in childNodes) {
        if (childNodes.hasOwnProperty(key)) {
            const c = {
                x: childNodes[key].offsetLeft + childNodes[key].offsetWidth / 2,
                y: childNodes[key].offsetTop + childNodes[key].offsetHeight / 2 + offset
            };
            centers.push(c);
        }
        offset = 0;
    }
    return centers;
}

export function filterPassed(d, filters) {

    if (filters.ministeri.length && filters.missioni.length) {
        return filters.ministeri.includes(d.partitions.top_partition) && filters.missioni.includes(d.partitions.second_partition);
    }
    if (filters.ministeri.length || filters.missioni.length) {
        return (filters.ministeri.includes(d.partitions.top_partition) || filters.missioni.includes(d.partitions.second_partition))
    }
    return true;

}