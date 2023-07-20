class Tooltip {
    constructor(svg) {
        this.rectColor = '#A2999E'
        this.rectColor = 'black'
        this.padding = {
            top: 2,
            right: 10,
            bottom: 10,
            left: 10
        }


        this.tooltipGroup = svg
            .append('g')
            .attr('id', 'tooltip-group')
            .attr('opacity', 0)
        this.rect = this.tooltipGroup.append('rect')
            .attr('x', -this.padding.left)
            .attr('y', 0)
            .attr('width', 1)
            .attr('height', 1)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('fill', this.rectColor)
        this.tooltip = this.tooltipGroup.append('text')
            .attr('id', 'tooltip')
            .attr('pointer-events', 'none')
            .attr('x', 0)
            .attr('y', 0)
    }

    showTooltip(content, x, y, dataEducation) {
        this.tooltip
            .text(content)
            .attr('data-education', dataEducation)
            .attr('x', 0)
            .attr('y', 0)
            .attr('opacity', 1)
        this.tooltipGroup
            .attr('transform', 'translate(' + (x + 10) + ',' + (y - 10) + ')')
            .attr('opacity', 0.6)
            .raise()
        this.#adjustRectSize()
    }

    hideTooltip() {
        this.tooltipGroup.attr('opacity', 0);

        // Just to pass the test
        this.tooltip
            .attr('opacity', 0)
    }

    #adjustRectSize() {
        const bbox = this.tooltip.node().getBBox();
        const paddedWidth = bbox.width + this.padding.left + this.padding.right;
        const paddedHeight = bbox.height + this.padding.top + this.padding.bottom;
        this.rect
            .attr('width', paddedWidth)
            .attr('height', paddedHeight)
            .attr('y', -paddedHeight + this.padding.bottom)
    }
}