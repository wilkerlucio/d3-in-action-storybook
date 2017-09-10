import * as d3 from 'd3'
import React from 'react'

export class Violin extends React.Component {
  componentDidMount() {
    const fillScale = d3.scaleOrdinal().range(["#fcd88a", "#cf7c1c", "#93c464"]);

    const normal = d3.randomNormal();
    const sampleData1 = d3.range(100).map(d => normal());
    const sampleData2 = d3.range(100).map(d => normal());
    const sampleData3 = d3.range(100).map(d => normal());

    const histoChart = d3.histogram();

    histoChart
      .domain([ -3, 3 ])
      .thresholds([ -3, -2.5, -2, -1.5, -1,
        -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3 ])
      .value(d => d)

    const yScale = d3.scaleLinear().domain([ -3, 3 ]).range([ 400, 0 ]);
    const yAxis = d3.axisRight().scale(yScale)
      .tickSize(300);

    d3.select("svg").append("g").call(yAxis);

    const area = d3.area()
      .x0(d => -d.length)
      .x1(d => d.length)
      .y(d => yScale(d.x0))
      .curve(d3.curveCatmullRom);

    d3.select("svg")
      .selectAll("g.violin")
      .data([sampleData1, sampleData2, sampleData3])
      .enter()
      .append("g")
      .attr("transform", (d,i) => `translate(${(50 + i * 100)} , 0)`)
      .append("path")
      .style("stroke", "black")
      .style("fill", (d,i) => fillScale(i))
      .attr("d", d => area(histoChart(d)));
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
