import * as d3 from 'd3';
import React from 'react';
import {legendColor} from 'd3-svg-legend';

const fillScale = d3.scaleOrdinal()
  .domain(["titanic", "avatar", "akira", "frozen", "deliverance", "avengers"])
  .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6", "#41a368"])

const xScale = d3.scaleLinear().domain([ 1, 8 ]).range([ 20, 470 ])
const yScale = d3.scaleLinear().domain([0, 55]).range([ 480, 20 ])

const legendA = legendColor().scale(fillScale)

function simpleStacking(lineData, lineKey) {
  let newHeight = 0

  Object.keys(lineData).every(key => {
    if (key !== "day") {
      newHeight += parseInt(lineData[key]);
      if (key === lineKey) {
        return false
      }
    }
    return true
  })

  return newHeight
}

window.simpleStacking = simpleStacking

export class StreamGraphD3 extends React.Component {
  componentDidMount() {
    d3.csv("/data/movies.csv", (err, data) => {
      Object.keys(data[0]).forEach(key => {
        if (key === "day") return

        const movieArea = d3.area()
          .x(d => xScale(d.day))
          .y0(d => yScale(simpleStacking(d, key) - d[key]))
          .y1(d => yScale(simpleStacking(d, key)))
          .curve(d3.curveBasis)

        const xAxis = d3.axisBottom().scale(xScale).tickSize(480).tickValues([1,2,3,4,5,6,7,8])
        d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis)
        const yAxis = d3.axisRight().scale(yScale).ticks(10).tickSize(480)
        d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis)

        d3.select("svg")
          .append("path")
          .attr("d", movieArea(data))
          .attr("fill", fillScale(key))
          .attr("stroke", "black")
          .attr("stroke-width", 1)

        d3.select("svg")
          .append("g")
          .attr("transform", "translate(500, 0)")
          .call(legendA)
      })
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
