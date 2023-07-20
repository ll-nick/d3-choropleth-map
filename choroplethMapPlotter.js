class ChoroplethMapPlotter {
    constructor(topography, dataset, options) {
        // Store input
        if (!topography || !dataset || !options || !options.width || !options.height || !options.padding) {
            throw new Error('Invalid parameters: topography, dataset and options with width, height, and padding are required.');
        }
        this.topography = topography
        this.dataset = dataset
        this.width = options.width
        this.height = options.height
        this.padding = options.padding

        this.#createColorScale()
        this.pathGenerator = (obj) => {
            const projection = d3.geoIdentity()
                .fitSize([this.width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom], obj);
            // const projection = null
            return d3.geoPath(projection);
        }
    }

    plot() {
        let svg = d3.create('svg')
            .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
        let mapGroup = svg.append('g')
            .attr("transform", `translate(${this.padding.left}, ${this.padding.top})`);
        let tooltip = new Tooltip(mapGroup);

        this.#createLegend(svg)
        this.#plotData(mapGroup)
        this.#enableTooltipOnMouseOver(mapGroup, tooltip)
        this.#drawStateLines(mapGroup)

        return svg.node()
    }

    #createColorScale() {
        let bachelorsOrHigher = this.dataset.map(d => d.bachelorsOrHigher)
        this.colorScale = d3.scaleSequential(d3.extent(bachelorsOrHigher), d3.interpolateGreens)
    }

    #createLegend(svg) {
        // Legend Settings
        let numBlocks = 8;
        let rectHeight = 12;
        let rectWidth = 35;
        let gapToText = 2;
        let legendX = this.width - this.padding.right - rectWidth * numBlocks;
        let legendY = this.padding.top / 2;

        //Add SVG Legend 
        let legend = svg.append("g")
            .attr('transform', 'translate(' + legendX + ',' + legendY + ')')
            .attr("id", "legend");

        let minEducation = d3.min(this.dataset, (d) => d.bachelorsOrHigher);
        let maxEducation = d3.max(this.dataset, (d) => d.bachelorsOrHigher);
        let step = (maxEducation - minEducation) / numBlocks;

        //Add colored rectangles to legend
        for (var i = 0; i < numBlocks; i++) {
            legend.append("rect")
                .style("stroke", "black")
                .attr("x", i * rectWidth)
                .attr("y", 0)
                .attr("width", rectWidth)
                .attr("height", rectHeight)
                .attr("fill", this.colorScale(minEducation + i * step))
        }

        //Add text to legend
        for (var i = 0; i <= numBlocks; i++) {
            legend.append("text")
                .attr("class", "legend-label")
                .attr("x", i * rectWidth)
                .attr("y", 2 * rectHeight + gapToText)
                .style("text-anchor", "middle")
                .text(Math.round(minEducation + i * step) + '%');
        }
    }

    #plotData(svg) {
        const counties = topojson.feature(this.topography, this.topography.objects.counties);

        svg.selectAll(".county")
            .data(counties.features)
            .enter()
            .append("path")
            .attr("class", "county")
            .attr("d", this.pathGenerator(counties))
            .attr("fill", d => this.colorScale(this.#getDataPoint(d.id).bachelorsOrHigher))
            .attr("data-fips", d => d.id)
            .attr("data-education", d => this.#getDataPoint(d.id).bachelorsOrHigher)

    }

    #enableTooltipOnMouseOver(svg, tooltip) {
        svg.selectAll(".county")
            .on('mouseover', (event, d) => {
                const dataEducation = this.#getDataPoint(d.id).bachelorsOrHigher
                let [mouseXRelativeToSVG, mouseYRelativeToSVG] = d3.pointer(event, svg.node())
                tooltip.showTooltip(this.#getToolTipTextForCounty(d), mouseXRelativeToSVG, mouseYRelativeToSVG, dataEducation);
            })
            .on('mouseout', (e) => {
                tooltip.hideTooltip();
            })
    }

    #drawStateLines(svg) {
        const states = topojson.feature(this.topography, this.topography.objects.states);

        svg.selectAll('.state')
            .data(states.features)
            .enter()
            .append('path')
            .attr('class', 'state')
            .attr('d', this.pathGenerator(states))
            .attr('stroke', 'white')
            .attr('stroke-width', '1.5')
            .attr('fill', 'none')
    }

    #getDataPoint(id) {
        return this.dataset.find(obj => obj.fips === id)
    }

    #getToolTipTextForCounty(d) {
        const dataPoint = this.#getDataPoint(d.id)
        return dataPoint.area_name + ', ' +
            dataPoint.state + ': ' +
            dataPoint.bachelorsOrHigher + '%'
    }

}