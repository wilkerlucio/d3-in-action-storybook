import * as d3 from 'd3';
import React from 'react';

const tickSize = 450

const xScale = d3.scaleLinear().domain([1, 8]).range([20, tickSize])
const yScale = d3.scaleLinear().domain([0, 100]).range([tickSize + 10, 20])

export class LineRaw extends React.Component {
  componentDidMount() {
    d3.csv("/data/tweetdata.csv", (err, data) => {
      const blue = "#fe9a22", green = "#5eaec5", orange = "#92c463"
      const xScale = d3.scaleLinear().domain([1,10.5]).range([20,480])
      const yScale = d3.scaleLinear().domain([0,35]).range([480,20])

      const xAxis = d3.axisBottom().scale(xScale).tickSize(480).tickValues([1,2,3,4,5,6,7,8,9,10])
      d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis)
      const yAxis = d3.axisRight().scale(yScale).ticks(10).tickSize(480)
      d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis)

      d3.select("svg").selectAll("circle.tweets")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "tweets")
        .attr("r", 5)
        .attr("cx", d => xScale(d.day))
        .attr("cy", d => yScale(d.tweets))
        .style("fill", blue)

      d3.select("svg").selectAll("circle.retweets")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "retweets")
        .attr("r", 5)
        .attr("cx", d => xScale(d.day))
        .attr("cy", d => yScale(d.retweets))
        .style("fill", green)

      d3.select("svg").selectAll("circle.favorites")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "favorites")
        .attr("r", 5)
        .attr("cx", d => xScale(d.day))
        .attr("cy", d => yScale(d.favorites))
        .style("fill", orange)

      const lambdaXScale = d => xScale(d.day)
      const tweetLine = d3.line()
        .x(lambdaXScale)
        .y(d =>yScale(d.tweets))
      const retweetLine = d3.line()
        .x(lambdaXScale)
        .y(d => yScale(d.retweets))
      const favLine = d3.line()
        .x(lambdaXScale)
        .y(d => yScale(d.favorites))

      tweetLine.curve(d3.curveBasis)
      retweetLine.curve(d3.curveStep)
      favLine.curve(d3.curveCardinal)

      d3.select("svg")
        .append("path")
        .attr("d", tweetLine(data))
        .attr("fill", "none")
        .attr("stroke", blue)
        .attr("stroke-width", 2)
      d3.select("svg")
        .append("path")
        .attr("d", retweetLine(data))
        .attr("fill", "none")
        .attr("stroke", green)
        .attr("stroke-width", 2)
      d3.select("svg")
        .append("path")
        .attr("d", favLine(data))
        .attr("fill", "none")
        .attr("stroke", orange)
        .attr("stroke-width", 2)
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={500} height={500} />
  }
}
