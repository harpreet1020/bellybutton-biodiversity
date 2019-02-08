function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response){
    // Use d3 to select the panel with id of `#sample-metadata`
    console.log(response);
    var sampleData = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    sampleData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    var data = Object.entries(response);
    data.forEach(function ([key, value]) {
      sampleData.append('div').text(`${key}: ${value}`)
    });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `samples/${sample}`;
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(url).then(function (response){
    console.log(response);

    trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }
    };

    var data = [trace1];

    var layout = {
      showlegend: false,
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', data, layout);


  });
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  d3.json(url).then(function (response){
    let firstTenOtuIds = response.otu_ids.slice(0, 10);
    let firstTenOtuLabels = response.otu_labels.slice(0, 10);
    let firstTenSampleValues = response.sample_values.slice(0, 10);

    var trace1 = {
      values: firstTenSampleValues,
      labels: firstTenOtuIds,
      hovertext: firstTenOtuLabels,
      type: 'pie'
    };

    var data = [trace1];

    Plotly.newPlot('pie', data)

  });


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
