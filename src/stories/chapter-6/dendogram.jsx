import * as d3 from 'd3'
import React from 'react'

export class Dendogram extends React.Component {
  componentDidMount() {
    d3.json('/data/tweets.json', (data) => {
      const depthScale = d3.scaleOrdinal(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]).domain(d3.range(4))

      const nestedTweets = d3.nest().key(d => d.user).entries(data.tweets)
      const packableTweets = {id: 'All Tweets', values: nestedTweets}
      const treeChart = d3.tree().size([500, 500])

      const root = d3.hierarchy(packableTweets, d => d.values)

      const treeData = treeChart(root).descendants();

      d3.select('svg')
        .append('g')
        .attr('id', 'treeG')
        .attr('transform', 'translate(60, 20)')
        .selectAll('g')
        .data(treeData)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y}, ${d.x})`)

      d3.selectAll('g.node')
        .append('circle')
        .attr('r', 10)
        .style('fill', d => depthScale(d.depth))
        .style('stroke', 'white')
        .style('stroke-width', '2px')

      d3.select('#treeG').selectAll('line')
        .data(treeData.filter(d => d.parent))
        .enter().insert('line', 'g')
        .attr('x1', d => d.parent.y)
        .attr('y1', d => d.parent.x)
        .attr('x2', d => d.y)
        .attr('y2', d => d.x)
        .style('stroke', 'black')

      d3.selectAll('g.node').append('text')
        .style('text-anchor', 'middle')
        .style('fill', '#4f442b')
        .text(d => d.data.id || d.data.key || d.data.content)

      const treeZoom = d3.zoom()
        .on('zoom', _ => {
          console.log(d3.event);
          const {x, y} = d3.event.transform;

          d3.select('#treeG').attr('transform', `translate(${x}, ${y})`)
        })

      d3.select('svg').call(treeZoom)
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
