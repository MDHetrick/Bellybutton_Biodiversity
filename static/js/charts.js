function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    // buildCharts(firstSample);
    buildMetadata(firstSample);
    buildCharts(firstSample)
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
  
  // 3. Create a variable that holds the samples array. 
  var samplesArray = data.samples;
  var metadata = data.metadata;
  
  // 4. Create a variable that filters the samples for the object with the desired sample number.
  var sampleSelection = samplesArray.filter(sampleObj => sampleObj.id == sample)
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  
  //  5. Create a variable that holds the first sample in the array.
  var result = sampleSelection[0];
  
  // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var otuIDs = result.otu_ids;
  var otuLabels  = result.otu_labels;
  var sampleValues  = result.sample_values;
  var wrapText = otuLabels.map(label => label.replaceAll(";", '; <br>' ));
  var sortedOtuLabels  = otuLabels.slice(0,11).reverse();   
  var sortedSampleValues  = sampleValues.slice(0,11).reverse();
  var sortedOtuIDs = otuIDs.map(ID => `OTU ID ${ID}`).slice(0,11).reverse();
  var wrapTextSorted = sortedOtuLabels.map(label => label.replaceAll(";", '; <br>' ));
  
  // 7. Create the yticks for the bar chart.
  var yticks = sortedOtuLabels;
  var config = {responsive: true}
  
  // 8. Create the trace for the bar chart. 
  var barData = {
    x: sortedSampleValues,
    y: sortedOtuIDs,
    text: wrapTextSorted,
    hovertemplate:
      "<b>Bacteria Label: </b> <br> <i>%{text}</i><extra></extra>", 
    type: "bar",
    orientation: "h",
    marker: {color: 'rgb(166,206,227)'}    
  };
    var data = [barData]
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "Top 10 bacterial cultures found"},
      xaxis: {title: "number of something"},
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
    }};
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, barLayout, config);
    
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: wrapText,
      hovertemplate:
      "<b>Bacteria Label: </b> <br> <i>%{text}</i><extra></extra>",
      mode: 'markers',
      marker: {
        color: otuIDs,
        colorscale:  [[0, 'rgb(166,206,227)'], [0.25, 'rgb(31,120,180)'], [0.45, 'rgb(178,223,138)'], [0.65, 'rgb(51,160,44)'], [0.85, 'rgb(251,154,153)'], [1, 'rgb(227,26,28)']],
        size: sampleValues,
        opacity: 0.6        
      }   
  }];
  
  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "Bacterial Cultures Per Sample",
    xaxis: {title: "OTU ID"} 
  };
  
  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout, config);

  // Filter the data for the object with the desired sample number  
  var result = resultArray[0];
  var frequency = result.wfreq
  var gaugeData = [{
    value: frequency,
    type: "indicator", 
    mode: "gauge+number", 
    gauge: {
      bar: {color: "black"},
      axis: {range: [null, 10]},
      steps:[ 
        {range: [0,2], color: "red"},
        {range: [2,4], color: "orange"},
        {range: [4,6], color: "yellow"},
        {range: [6,8], color: "lightgreen"},
        {range: [8,10], color: "green"}
      ]
    }}];
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    title: "Belly Button Washing Frequency <br> (number of times per week)"
  };
  
  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);
  });
};
