import { runQuery, url, query } from "./function.js";
//
export function useData() {
  runQuery(url, query).then(results => {
    const lengthObjects = results.map(results => results.lengte.value);

    const cleanData = lengthObjects.map(size => {
      size = size.toLowerCase();
      size = size.replace(/,/g, ".");
      // regex expression which matches all characters except in between ()
      size = size.replace(size.match(/\(.*?\)/g), "");
      // regex expression which matches all characters except: l, numbers, '.' , whitespace & x
      size = size.replace(/[^l0-9\d\sx.]/g, "");

      if (typeof size === "string") {
        if (size.match("l")) {
          return size.slice(0, 7).replace(/[^0-9/.]/g, "");
        }
        if (size.match(/[ˆ(\d|+|\-)]/g) === null) {
          return size.replace(size, "");
        }

        // if first character of string is a number, slice vanaf het 3de character (omdat er geen lengtes zij van meer dan 4 cijfers)
        if (size.charAt(0) != NaN) {
          return size.slice(0, 3);
        }
      }
    });

    let dataIntoNumber = cleanData.map(Number);

    console.log(dataIntoNumber);

    const restOfData = results.map(item => {
      let newArr = {};
      newArr.title = item.title.value;
      newArr.pic = item.pic.value;
      newArr.regio = item.placeRegioName.value;
      newArr.continent = item.continentLabel.value;
      return newArr;
    });
    // for loop gemaakt met Eyup & Robert
    for (let count = 0; count < restOfData.length; count++) {
      restOfData[count].size = dataIntoNumber[count];
    }
    const restOfDataWithSize = restOfData;

    let sizesFilter = restOfDataWithSize.filter(element => {
      return !Number.isNaN(element.size);
    });
    const dataWithoutSmallValues = sizesFilter.filter(element => {
      if (element.size > 2 && element.size < 400) {
        return element.size;
      }
    
    });

    let data = dataWithoutSmallValues;
    console.log("test", data)

    // let hoogLaag = data
    // .sort(function(x, y){
    //   return d3.descending(x.size, y.size)
    // })
    // console.log(laagHoog)
    // console.log(hoogLaag)
   
    

    // tooltip samen met Gio gemaakt
    let tooltip = d3
      .select("#content")
      .append("div")
      .style("position", "fixed")
      .style("visibility", "hidden");
    const width = 100000;
    const height = 500;
    const barWidth = 70;
    const barOffset = 5;

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function(d) {
          return d.size;
        })
      ])
      .range([0, height]);

    const svg = d3
      .select("#content")
      .append("svg")
      .attr("width", width)
      .attr("height", height).append('g');

    let xScale = d3
      .scaleBand()
      .domain([d3.min(data), d3.max(data)])
      .rangeRound([0, width], 0.09);

     
      

     
    //Create bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {
        return i * (barWidth + barOffset);
      })
      .attr("y", function(d) {
        return height - d.size;
      })
      .attr("width", barWidth)
      .attr("height", function(d) {
        return d.size;
      })
  
      .on("click", d => {
        tooltip
          .style("visibility", "visible")
          .append("h3")
          .text(d.title)
          .style("font-family", `'Josefin Sans', sans-serif`)
          .append("p")
          .text("Regio: " + d.regio)
          .append("img")
          .attr("src", d.pic);
      })
      .on("mouseout", d => {
        tooltip.style("visibility", "hidden");
        if (d.size == d.size) {
          d3.select("h3").remove();
        }
      });

    // Create text on bar (length object in cm)
    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .text(function(d) {
        return d.size;
      })
      .attr("text-anchor", "middle")
      .attr("x", function(d, i) {
        return i * (barWidth + barOffset) + 37;
      })
      .attr("y", function(d) {
        return height - (d.size + 4);
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "white");
      
     
  
  // const inputValueOceanen = document.querySelector(".checkbox.Oceanen").value;
  // const inputValueAntartica = document.querySelector(".checkbox.Antarctica").value;
  // const inputValueNoordpool = document.querySelector(".checkbox.Noordpool").value;

  function update() {
    let currentContinent = this.value;
    console.log(currentContinent)
    let newdata = data;
    
    function sort(data) {
      if(currentContinent === "lowToHigh"){
        return data
        .sort(function(x, y){
          return d3.ascending(x.size, y.size);
        });
      } else if(currentContinent === "highToLow") {
        return data
        .sort(function(x, y){
          return d3.descending(x.size, y.size);
        });
      } else if(currentContinent === "all" || currentContinent === "Oceanië" || currentContinent === "Amerika" || currentContinent === "Afrika" || currentContinent === "Eurazië" || currentContinent === "Azië") {
        return data.filter(d => d.continent === currentContinent);
      }
    }
    newdata = sort(data);
    
    let rectangles = svg
      .selectAll("rect")
      .data(newdata);

    rectangles.exit()
      .remove();

    let rectangleEnter = rectangles.enter(); 

    rectangleEnter.append("rect").merge(rectangles)
    .attr("class", "bar")
    .attr("x", function(d, i) {
      return i * (barWidth + barOffset);
    })
    .attr("y", function(d) {
      return height - d.size;
    })
    .attr("width", barWidth)
    .attr("height", function(d) {
      return d.size;
    })
    .on("click", d => {
      tooltip
        .style("visibility", "visible")
        .append("h3")
        .text(d.title)
        .style("font-family", `'Josefin Sans', sans-serif`)
        .append("p")
        .text("Regio: " + d.regio)
        .append("img")
        .attr("src", d.pic);
    })
    .on("mouseout", d => {
      tooltip.style("visibility", "hidden");
      if (d.size == d.size) {
        d3.select("h3").remove();
      }
    });

    rectangles.selectAll("rect")
    .attr("x", function(d, i) {
      return i * (barWidth + barOffset);
    })
    .attr("y", function(d) {
      return height - d.size;
    })
    .attr("width", barWidth)
    .attr("height", function(d) {
      return d.size;
    })
    .on("click", d => {
      tooltip
        .style("visibility", "visible")
        .select("h3")
        .text(d.title)
        .style("font-family", `'Josefin Sans', sans-serif`)
        .select("p")
        .text("Regio: " + d.regio)
        .select("img")
        .attr("src", d.pic);
    })
    .on("mouseout", d => {
      tooltip.style("visibility", "hidden");
      if (d.size == d.size) {
        d3.select("h3").remove();
      }
    });

    let text = svg
      .selectAll("text")
      .data(newdata)

    text.exit().remove();

    let textEnter = text.enter()

    textEnter.append("text")
      .merge(text)
      .text(function(d) {
        return d.size;
      })
      .attr("text-anchor", "middle")
      .attr("x", function(d, i) {
        return i * (barWidth + barOffset) + 37;
      })
      .attr("y", function(d) {
        return height - (d.size + 8);
      });
      
    text.selectAll("text")
    .text(function(d) {
      return d.size;
    })
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
      return i * (barWidth + barOffset) + 37;
    })
    .attr("y", function(d) {
      return height - (d.size + 8);
    });
    }

  document.getElementById("lowToHigh").addEventListener("click", update);
  const options = document.querySelector('#option');
  options.addEventListener('change', update);

  document.getElementById("highToLow").addEventListener("click", update);
  });
}

useData();