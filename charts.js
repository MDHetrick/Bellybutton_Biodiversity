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
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
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

    // // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleSelection = samplesArray.filter(sampleObj => sampleObj.id == sample)
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);

    //  5. Create a variable that holds the first sample in the array.
    var result = sampleSelection[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otuIDs = result.otu_ids;
        var otuLabels  = result.otu_labels;
        var sampleValues  = result.sample_values;
        console.log(sampleValues)
        var wrapText = otuLabels.map(label => label.replaceAll(";", '; <br>' ));

        var sortedOtuLabels  = otuLabels.slice(0,11).reverse();   
        var sortedSampleValues  = sampleValues.slice(0,11).reverse();
        var sortedOtuIDs = otuIDs.map(ID => `OTU ID ${ID}`).slice(0,11).reverse();
        var wrapTextSorted = sortedOtuLabels.map(label => label.replaceAll(";", '; <br>' ));
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = sortedOtuLabels;
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sortedSampleValues,
      y: sortedOtuIDs,
      text: wrapTextSorted,
      hovertemplate:
      "<b>Bacteria Label: </b> <br> <i>%{text}</i>", 
      type: "bar",
      orientation: "h"      
    };
    var data = [barData]
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      autosize: false,
      width: 500,
      height: 500,
      title: "Top 10 bacteria cultures found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
    }};
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, barLayout);
      // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: wrapText,
      hovertemplate:
      "<b>Bacteria Label: </b> <br> <i>%{text}</i>",
      mode: 'markers',
      marker: {
        color: otuIDs,
        colorscale: "Bluered",
        size: sampleValues,
        opacity: 0.6
        //dictionary that defines size/color/colorscale
      }   
  }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        // xaxis: "OTU ID" ?>?? cannot add axis???
        // yaxis: "YACIS TITLE"
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
      // Filter the data for the object with the desired sample number
    
      var result = resultArray[0];
      var frequency = result.wfreq
      var gaugeData = [{
        value: frequency,
        type: "indicator", 
        mode: "gauge+number", 
        gauge: {
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
       title: "Belly Button Washing Frequency"
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
