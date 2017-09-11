import * as d3 from 'd3'
import React from 'react'

export class Sunburst extends React.Component {
  componentDidMount() {
    d3.json('/data/tweets.json', (data) => {
      const depthScale = d3.scaleOrdinal(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]).domain(d3.range(4))

      const nestedTweets = d3.nest().key(d => d.user).entries(data.tweets)
      const packableTweets = {id: 'All Tweets', values: nestedTweets}

      const root = d3.hierarchy(packableTweets, d => d.values)
        .sum(d => d.retweets ? d.retweets.length + d.favorites.length + 1 : undefined)

      const partitionLayout = d3.partition().size([2 * Math.PI, 250])

      partitionLayout(root)

      const arc = d3.arc().innerRadius(d => d.y0).outerRadius(d => d.y1)

      d3.select('svg')
        .append('g')
        .attr('transform', 'translate(255, 255)')
        .selectAll('path')
        .data(root.descendants())
        .enter()
        .append('path')
        .attr('d', d => arc({
          y0: d.y0,
          y1: d.y1,
          startAngle: d.x0,
          endAngle: d.x1
        }))
        .attr('fill', d => depthScale(d.depth))
        .attr('stroke', 'black')
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
