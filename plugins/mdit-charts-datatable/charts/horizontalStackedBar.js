


 let chart = function(d3, element, _data, options) {
     // Fix our data
     var max = 0;
     let o = [];
     for (var i = 0 ; i < _data.length; i++) {
         
        var item = {
            name: _data[i].name,
            total: 0
        };
        for (var j = 0; j < _data[i].values.length; j++) {
            item[_data[i].legend[j]] = parseFloat(_data[i].values[j]);
            item.total += parseFloat(_data[i].values[j]);
        }
        if (item.total > max) max = item.total;
        o.push(item);
     }
 const svg = element.append("svg")
   .attr("width", 500)
   .attr("height", 50*_data.length+75)

 const margin = {top: 20, right: 20, bottom: 30, left: 40}
 const width = 400 - margin.left - margin.right
 const height = 50 * _data.length
 const g = svg.append('g')
     .attr('transform', `translate(${margin.left}, ${margin.top})`)
 
 const x = d3.scaleLinear()
     .domain([0, max])
     .range([1, width]).nice()
 
 const y = d3.scaleBand()
     .domain(_data.map(d => d.name))
     .range([0, height])
     .padding(0.1)
     var z = d3.scaleOrdinal()
     .range(["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177"].reverse());
     g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(_data[0].legend)(o))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y(d.data.name); })	    //.attr("x", function(d) { return x(d.data.State); })
      .attr("x", function(d) { return x(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })	
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("height", y.bandwidth());						    //.attr("width", x.bandwidth());	

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
      .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
	  .attr("transform", "translate(0,"+height+")")				// New line
      .call(d3.axisBottom(x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(_data[0].legend.slice().reverse())
    .enter().append("g")
    //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	 .attr("transform", function(d, i) { return "translate(120," + ( i * 40) + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
     return true;
 
//     var x = d3.scaleBand()
//     	.domain(nestData.map(d => d.key))
//     	.rangeRound([0, width])
//     	.paddingInner(0.05)
    
//     var y = d3.scaleLinear()
//     	.domain([0, d3.max(nestData, d => d.value.total)])
//     	.rangeRound([height, 0]).nice()
 
 var z = d3.scaleOrdinal()
     .range(["#dbdbdb", "#00b774", "#fe434f"]);
 
 g.append('g')
     .attr('class', 'axis x-axis')
     .attr('transform', `translate(0, ${height})`)
     .call(d3.axisBottom(x))
 
 g.append('g')
     .attr('class', 'axis y-axis')
     .call(d3.axisLeft(y).ticks(null, 's'))
 
 g.append('g')
       .selectAll('g')
     .data(d3.stack().keys(_data[0].legend)(o
     ))
         .enter().append("g")
       .attr("fill", function(d) { return z(d.key); })
       .selectAll("rect")
   .data(d => {
       return d;
    })
       .enter().append("rect")
         .attr('x', d => x(d[0]))
         .attr('y', d => y(d.data.name))
         .attr('height', y.bandwidth())
         .attr('width', d => {
             return (x(d[1]) - x(d[0]))
         })
//       	.attr('x', d => x(d.data.package))
//       	.attr('y', d => y(d[1]))
//       	.attr('height', d => (y(d[0]) - y(d[1])))
//       	.attr('width', x.bandwidth())
var legend = g.append("g")
.attr("font-family", "sans-serif")
.attr("font-size", 10)
.attr("text-anchor", "end")
.selectAll("g")
.data(_data[0].legend.slice().reverse())
.enter().append("g")
//.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
.attr("transform", function(d, i) { return "translate(-50," + (300 + i * 20) + ")"; });

legend.append("rect")
.attr("x", width - 19)
.attr("width", 19)
.attr("height", 19)
.attr("fill", z);

legend.append("text")
.attr("x", width - 24)
.attr("y", 9.5)
.attr("dy", "0.32em")
.text(function(d) { return d; });
 };

module.exports = function(element, d3, options) {
    return function(data) {
        return chart(d3, element, data, options);
    };

};