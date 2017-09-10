import * as d3 from 'd3'
import React from 'react'

export class TweetCirclePack extends React.Component {
  componentDidMount() {
    d3.json('/data/tweets.json', (data) => {
      const depthScale = d3.scaleOrdinal(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]).domain(d3.range(4))

      const nestedTweets = d3.nest().key(d => d.user).entries(data.tweets)
      const packableTweets = {id: 'All Tweets', values: nestedTweets}
      const packChart = d3.pack().padding(10)

      packChart.size([500, 500])

      const root = d3.hierarchy(packableTweets, d => d.values)
        .sum(d => d.retweets ? d.retweets.length + d.favorites.length + 1 : undefined)

      d3.select('svg')
        .append('g')
        .attr('transform', 'translate(100, 20)')
        .selectAll('circle')
        .data(packChart(root).descendants())
        .enter()
        .append('circle')
        .attr('r', d => d.r)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('fill', d => depthScale(d.depth))
        .attr('stroke', 'black')
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
