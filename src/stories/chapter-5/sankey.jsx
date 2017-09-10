import * as d3 from 'd3'
import React from 'react'
import {sankey, sankeyLinkHorizontal} from 'd3-sankey'

export class Sankey extends React.Component {
  componentDidMount() {
    d3.json('/data/sitestats.json', data => {
      const layout = sankey()
        .nodeWidth(20)
        .nodePadding(200)
        .size([460, 460])
        .iterations(32)

      layout(data)

      console.log("DATA", data);

      const intensityRamp = d3.scaleLinear()
        .domain([0, d3.max(data.links, d => d.value)])
        .range(["#fcd88b", "#cf7d1c"])

      d3.select('svg').append('g')
        .attr('transform', 'translate(20, 20)')
        .attr('id', 'sankeyG')

      const svg = d3.select('#sankeyG')

      svg.selectAll('.link')
        .data(data.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', sankeyLinkHorizontal())
        .style('stroke-width', d => Math.max(1, d.width))
        .style('stroke-opacity', 0.5)
        .style('fill', 'none')
        .style('stroke', d => intensityRamp(d.value))
        .sort((a, b) => b.dy - a.dy)
        .on('mouseover', function () {
          d3.select(this).style('stroke-opacity', .8)
        })
        .on('mouseout', function () {
          d3.selectAll('path.link').style('stroke-opacity', .5)
        })

      const nodes = svg.selectAll('.node')
        .data(data.nodes)
        .enter().append('g')
        .attr('class', 'node')

      nodes.append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style('fill', '#93c464')
        .style('stroke', 'gray')

      nodes.append('text')
        .attr('x', d => d.x0 - 6)
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .style('fill', 'black')
        .text(d => d.name)
        .filter(d => d.x0 < width / 2)
        .attr('x', d => d.x1 + 6)
        .attr('text-anchor', 'start')
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
