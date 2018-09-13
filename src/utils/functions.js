export function fillColor(val) {
    if (!isFinite(val)) {
        return '#AAAAAA'
    }
    let color = "#D84B2A";
    if (val > -0.25) {
        color = "#EE9586";
    }
    if (val > -0.05) {
        color = "#E4B7B2";
    }
    if (val >= 0) {
        color = "#BECCAE";
    }
    if (val > 0.05) {
        color = "#9CAF84";
    }
    if (val > 0.25) {
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

    if (filters.top_partition.length && filters.second_partition.length) {
        return filters.top_partition.includes(d.partitions.top_partition) && filters.second_partition.includes(d.partitions.second_partition);
    }
    if (filters.top_partition.length || filters.second_partition.length) {
        return (filters.top_partition.includes(d.partitions.top_partition) || filters.second_partition.includes(d.partitions.second_partition))
    }
    return true;

}