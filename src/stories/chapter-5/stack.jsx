import * as d3 from 'd3'
import React from 'react'

const movies = ["titanic", "avatar", "akira", "frozen", "deliverance", "avengers"]

const fillScale = d3.scaleOrdinal()
  .domain(movies)
  .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6", "#41a368"])

export class StackChart extends React.Component {
  componentDidMount() {
    d3.csv('/data/movies.csv', (err, data) => {
      const xScale = d3.scaleLinear().domain([0, 10]).range([0, 500])
      const yScale = d3.scaleLinear().domain([-50, 50]).range([500, 0])

      const stackLayout = d3.stack().keys(movies).offset(d3.stackOffsetSilhouette).order(d3.stackOrderInsideOut)

      const stackArea = d3.area()
        .x((d, i) => xScale(i))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis)

      d3.select('svg').selectAll('path')
        .data(stackLayout(data))
        .enter()
        .append('path')
        .style('fill', d => fillScale(d.key))
        .attr('d', d => stackArea(d))
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}

export class StackBars extends React.Component {
  componentDidMount() {
    d3.csv('/data/movies.csv', (err, data) => {
      const xScale = d3.scaleLinear().domain([0, 10]).range([0, 500])
      const yScale = d3.scaleLinear().domain([0, 60]).range([480, 0])
      const heightScale = d3.scaleLinear().domain([0, 60]).range([0, 480])

      const stackLayout = d3.stack().keys(movies)

      const xAxis = d3.axisBottom(xScale).tickSize(500).tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      d3.select('svg').append('g').attr('id', 'xAxisG').call(xAxis)

      const yAxis = d3.axisRight(yScale).ticks(10).tickSize(530)
      d3.select('svg').append('g').call(yAxis)

      d3.select('svg').selectAll('g.bar')
        .data(stackLayout(data))
        .enter()
        .append('g')
        .attr('class', 'bar')
        .each(function (d) {
          d3.select(this).selectAll('rect')
            .data(d)
            .enter()
            .append('rect')
            .attr('x', (p, q) => xScale(q) + 30)
            .attr('y', p => yScale(p[1]))
            .attr('height', p => heightScale(p[1] - p[0]))
            .attr('width', 40)
            .style('fill', fillScale(d.key))
        })
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
