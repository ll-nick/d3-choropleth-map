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
    options.padding = 20

    const plotter = new ChoroplethMapPlotter(topography, dataset, options)
    plotter.plot()
})();