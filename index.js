(async () => {
    const topographyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
    const fetchTopography = fetch(topographyURL).then(response => response.json())
    const topography = await fetchTopography;

    const educationDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
    const fetcheducationData = fetch(educationDataURL).then(response => response.json())
    const dataset = await fetcheducationData;

    let options = {}
    options.width = 960
    options.height = 600
    options.padding = {
        top: 50,
        left: 0,
        bottom: 40,
        right: 100
    }


    d3.select('#chart-container')
        .append('h1')
        .attr('id', 'title')
        .text('United States Educational Attainment')

    d3.select('#chart-container')
        .append('div')
        .attr('id', 'description')
        .text('Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)')

    const plotter = new ChoroplethMapPlotter(topography, dataset, options)
    let svg = plotter.plot()
    d3.select('#chart-container')
        .node()
        .appendChild(svg)

})();