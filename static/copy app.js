d3.json("samples.json").then(function (data) {
    console.log(data)
});

// Pull json with d3
d3.json("samples.json").then(function (data) {
    //pull names for drop-down button
    var names = data.names;
    console.log(names);
    //Attach names to drop-down using #selDataset from index.html
    d3.selectAll("#selDataset")
        .selectAll("option")
        .select('option')
        .data(names)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        })
});

// Submit Button handler
function optionChanged() {
    d3.json("samples.json").then(function (data) {
        // Select the input value from the form
        var dropDown = d3.select("#selDataset").node().value;
        console.log(dropDown);

        // clear the input value
        d3.select("#selDataset").node().value = "";

        // Build the plot with the new Test Subject
        buildPlot(dropDown);
    })
}

//     data.metadata.forEach(function (row) {
//         if (row.id === parseInt(dropDown)) {
//             console.log(row);
//             d3.select("#sample-metadata").html('');
//             var sampleData = Object.entries(row);
//             sampleData.forEach(function (sample) {
//                 console.log(sample);
//                 d3.select("#sample-metadata")
//                     .append("li")
//                     .data(sample)
//                     .text(`${sample[0]}: ${sample[1]}`)
//             })
//         }
//     })
// }


//build charts
function buildPlot(dropDown) {

    //pull the json with d3
    d3.json("samples.json").then(function (data) {

        // Grab values from the response json object to build the plots
        data.samples.forEach(function (row) {
            if (row.id === dropDown) {
                console.log(row.id);
                var sampleValue = row.sample_values;
                var otu_id = row.otu_ids;
                var label = row.otu_labels;
                console.log(sampleValue, otu_id, label);

                //build bar chart
                var bar = {
                    type: "bar",
                    orientation: 'h',
                    x: sampleValue.slice(0, 10).reverse(),
                    y: otu_id.map(id => String(`OTU ${id}`)),
                    text: row.otu_labels,
                };

                var tableData = [bar];

                //set layout for bar chart
                var layout = {
                    title: `ID ${dropDown} Data`,
                    height: 500,
                    width: 1000,
                    yaxis: {
                        autorange: true,
                    },
                    xaxis: {
                        autorange: true,
                    },
                };

                //plot bar chart
                Plotly.newPlot("bar", tableData, layout);

                var bubble = {
                    type: 'bubble',
                    x: otu_id,
                    y: sampleValue,
                    text: row.otu_labels,
                    mode: 'markers',
                    opacity: "0.5",
                    marker: {
                      size: sampleValue,
                      color: otu_id,
                      colorScale: "Earth",
                    }
                  };
                  
                  var bubbleData = [bubble];
                  
                  var layout = {
                    title: `ID ${dropDown} Data`,
                    showlegend: false,
                    zoomEnabled: true,
                    yaxis: {
                        autorange: true,
                        viewWindowMode: "pretty"
                    },
                    xaxis: {
                        autorange: true,
                        viewWindowMode: "pretty"
                    },
                    height: 600,
                    width: 1200
                  };
                  
                Plotly.newPlot('bubble', bubbleData, layout);
    
            }
                else {;}
            })
    
            data.metadata.forEach(function(row) {
                if (row.id === parseInt(dropDown)) {
                    console.log(row);
                    d3.select("#sample-metadata").html('');
                    var sampleData = Object.entries(row);
                    sampleData.forEach(function(sample) {
                        console.log(sample);
                        d3.select("#sample-metadata")
                        .append("li")
                        .data(sample)
                        .text(`${sample[0]}: ${sample[1]}`)
                    })

            }});
        });
    }
    
    // Add event listener for submit button
    d3.select("#setDataset").on("click", optionChanged);