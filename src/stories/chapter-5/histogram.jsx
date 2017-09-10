import * as d3 from 'd3'
import React from 'react'

export class Histogram extends React.Component {
  componentDidMount() {
    d3.json("/data/tweets.json", (err, data) => {
      const {tweets} = data

      const xScale = d3.scaleLinear().domain([0, 5]).range([0, 500])
      const yScale = d3.scaleLinear().domain([0, 10]).range([400, 0])
      const xAxis = d3.axisBottom().scale(xScale).ticks(5)

      const histoChart = d3.histogram()

      histoChart.domain([0, 5]).thresholds([0, 1, 2, 3, 4]).value(d => d.favorites.length)

      let histoData = histoChart(tweets)

      console.log("data", data, histoData);

      d3.select("svg")
        .selectAll("rect")
        .data(histoData).enter()
        .append("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1 - d.x0) - 2)
        .attr("height", d => 400 - yScale(d.length))
        .on('click', _ => {
          histoChart.value(d => d.retweets.length)
          histoData = histoChart(tweets)

          d3.selectAll("rect").data(histoData)
            .transition()
            .duration(500)
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("height", d => 400 - yScale(d.length));
        })
        .style("fill", "#FCD88B")

      d3.select("svg").append("g").attr("class", "x axis")
        .attr("transform", "translate(0,400)").call(xAxis)

      d3.select("g.axis").selectAll("text").attr("dx", 50)
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
