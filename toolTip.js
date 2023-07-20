class Tooltip {
    constructor() {
        this.tooltip = d3.select('#chart-container')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0)
    }

    showTooltip(content, x, y, dataEducation) {
        this.tooltip
            .html(content)
            .attr('data-education', dataEducation)
            .style('opacity', 0.9)
            .style('left', x + 'px')
            .style('top', y + 'px');
    }

    hideTooltip() {
        this.tooltip.style('opacity', 0);
    }
}