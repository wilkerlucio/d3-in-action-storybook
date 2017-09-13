import * as d3 from 'd3'
import React from 'react'

function dataText(d) {
  return d.data.content || d.data.user || d.data.key
}

export class Treemap extends React.Component {
  componentDidMount() {
    d3.json('/data/tweets.json', (data) => {
      const depthScale = d3.scaleOrdinal(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]).domain(d3.range(4))

      const nestedTweets = d3.nest().key(d => d.user).entries(data.tweets)
      const packableTweets = {id: 'All Tweets', values: nestedTweets}

      const root = d3.hierarchy(packableTweets, d => d.values)
        .sum(d => d.retweets ? d.retweets.length + d.favorites.length + 1 : undefined)

      const treemapLayout = d3.treemap().size([500, 500]).padding(d => d.depth * 5 + 5)

      treemapLayout(root)

      // const filterTreemap = d => {
      //   const newRoot = d3.hierarchy(d.data, p => p.values)
      //     .sum(p => p.retweets ? p.retweets.length + p.favorites.length + 1 : undefined);
      //
      //   treemapLayout(newRoot)
      //
      //   d3.select('svg')
      //     .selectAll('rect')
      //     .data(newRoot.descendants(), dataText)
      //     .enter()
      //     .append('rect')
      //     .style('fill', p => depthScale(p.depth))
      //     .style('stroke', 'black')
      //
      //   d3.select('svg')
      //     .selectAll('rect')
      //     .data(newRoot.descendants(), dataText)
      //     .exit()
      //     .remove()
      //
      //   d3.select('svg')
      //     .selectAll('rect')
      //     .on('click', d === root ? (p) => filterTreemap(p) : () => filterTreemap(root))
      //     .transition()
      //     .duration(1000)
      //     .attr('x', d => d.x0)
      //     .attr('y', d => d.y0)
      //     .attr('width', d => d.x1 - d.x0)
      //     .attr('height', d => d.y1 - d.y0)
      // }

      d3.select('svg')
        .selectAll('rect')
        .data(root.descendants(), dataText)
        .enter()
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => depthScale(d.depth))
        .attr('stroke', 'black')
        // .on('click', filterTreemap)
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
