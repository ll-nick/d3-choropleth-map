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
        this.#createHTMLElements()
    }

    plot() {
        this.#createLegend()
        this.#plotData()
        this.#drawStateLines()
    }

    #drawStateLines() {
        const states = topojson.feature(this.topography, this.topography.objects.states);

        this.svg.selectAll(".state")
            .data(states.features)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", d3.geoPath())
            .attr("stroke", "white")
            .attr("stroke-width", "1.5")
            .attr("fill", "none")

        // this.svg.selectAll(".state").on("mouseover", function (event, d) {
        //     d3.select(this).attr("stroke", "red").raise();
        // })
        //     .on("mouseout", function (event, d) {
        //         d3.select(this).attr("stroke", "white");
        //     });

    }

    #createColorScale() {
        let bachelorsOrHigher = this.dataset.map(d => d.bachelorsOrHigher)
        let domain = d3.extent(bachelorsOrHigher)
        let range = d3.schemeGreens[9]
        this.colorScale = d3.scaleSequential(domain, d3.interpolateGreens)
    }

    #createHTMLElements() {
        this.tooltip = new Tooltip();

        d3.select('#chart-container')
            .append('h1')
            .attr('id', 'title')
            .text('United States Educational Attainment')

        d3.select('#chart-container')
            .append('div')
            .attr('id', 'description')
            .text('Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)')

        this.svg = d3.select('#chart-container')
            .append('svg')
            .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
    }

    #createLegend() {
        // Legend Settings
        let legendX = this.width * 0.8;
        let legendY = this.height * 0.2;
        let numBlocks = 8;
        let rectHeight = 15;
        let rectWidth = 40;

        //Add SVG Legend 
        let legend = this.svg.append("g")
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
                .attr("x", i * rectWidth)
                .attr("y", 2 * rectHeight)
                .style("text-anchor", "middle")
                .text(Math.round(minEducation + i * step) + '%');
        }
    }

    #getDataPoint(id) {
        return this.dataset.find(obj => obj.fips === id)
    }

    #plotData() {

        const counties = topojson.feature(this.topography, this.topography.objects.counties);
        this.svg.selectAll(".county")
            .data(counties.features)
            .enter()
            .append("path")
            .attr("class", "county")
            .attr("d", d3.geoPath())
            .attr("fill", d => this.colorScale(this.#getDataPoint(d.id).bachelorsOrHigher))
            .attr("data-fips", d => d.id)
            .attr("data-education", d => this.#getDataPoint(d.id).bachelorsOrHigher)
            .on('mouseover', (event, d) => {
                const dataPoint = this.#getDataPoint(d.id)
                const tooltipContent = dataPoint.area_name + ', ' +
                    dataPoint.state + ': ' +
                    dataPoint.bachelorsOrHigher + '%'
                const dataEducation = this.#getDataPoint(d.id).bachelorsOrHigher
                this.tooltip.showTooltip(tooltipContent, event.x, event.y, dataEducation);
            })
            .on('mouseout', (e) => {
                this.tooltip.hideTooltip();
            })
    }

}