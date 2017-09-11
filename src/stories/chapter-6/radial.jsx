import * as d3 from 'd3'
import React from 'react'

function project(x, y) {
  const angle = x / 90 * Math.PI
  const radius = y
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

export class Radial extends React.Component {
  componentDidMount() {
    d3.json('/data/tweets.json', (data) => {
      const depthScale = d3.scaleOrdinal(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]).domain(d3.range(4))

      const nestedTweets = d3.nest().key(d => d.user).entries(data.tweets)
      const packableTweets = {id: 'All Tweets', values: nestedTweets}
      const treeChart = d3.tree().size([200, 200])

      const root = d3.hierarchy(packableTweets, d => d.values)

      const treeData = treeChart(root).descendants();

      d3.select('svg')
        .append('g')
        .attr('id', 'treeG')
        .attr('transform', 'translate(250, 250)')
        .selectAll('g')
        .data(treeData)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${project(d.x, d.y)})`)

      d3.selectAll('g.node')
        .append('circle')
        .attr('r', 10)
        .style('fill', d => depthScale(d.depth))
        .style('stroke', 'white')
        .style('stroke-width', '2px')

      d3.select('#treeG').selectAll('line')
        .data(treeData.filter(d => d.parent))
        .enter().insert('line', 'g')
        .attr('x1', d => project(d.parent.x, d.parent.y)[0])
        .attr('y1', d => project(d.parent.x, d.parent.y)[1])
        .attr('x2', d => project(d.x, d.y)[0])
        .attr('y2', d => project(d.x, d.y)[1])
        .style('stroke', 'black')

      d3.selectAll('g.node').append('text')
        .style('text-anchor', 'middle')
        .style('fill', '#4f442b')
        .text(d => d.data.id || d.data.key || d.data.content)

      const treeZoom = d3.zoom()
        .on('zoom', _ => {
          const {x, y} = d3.event.transform;

          d3.select('#treeG').attr('transform', `translate(${x + 250}, ${y + 250})`)
        })

      d3.select('svg').call(treeZoom)
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
