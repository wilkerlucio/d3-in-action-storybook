import * as d3 from 'd3'
import React from 'react'

export class Partition extends React.Component {
  componentDidMount() {
    d3.json('/data/tweets.json', (data) => {
      const depthScale = d3.scaleOrdinal(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]).domain(d3.range(4))

      const nestedTweets = d3.nest().key(d => d.user).entries(data.tweets)
      const packableTweets = {id: 'All Tweets', values: nestedTweets}

      const root = d3.hierarchy(packableTweets, d => d.values)
        .sum(d => d.retweets ? d.retweets.length + d.favorites.length + 1 : undefined)

      const partitionLayout = d3.partition().size([500, 300]).round(2)

      partitionLayout(root)

      console.log(root.descendants());

      d3.select('svg')
        .selectAll('react')
        .data(root.descendants())
        .enter()
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        // .attr('x', d => d.y0)
        // .attr('y', d => d.x0)
        // .attr('width', d => d.y1 - d.y0)
        // .attr('height', d => d.x1 - d.x0)
        .attr('fill', d => depthScale(d.depth))
        .attr('stroke', 'black')
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
