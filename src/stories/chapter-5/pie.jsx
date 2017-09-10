import * as d3 from 'd3'
import React from 'react'

export class PieChart extends React.Component {
  componentDidMount() {
    d3.json('/data/tweets.json', (data) => {
      const nestedTweets = d3.nest().key(d => d.user).entries(data.tweets)
      nestedTweets.forEach(d => {
        d.numTweets = d.values.length
        d.numFavorites = d3.sum(d.values, p => p.favorites.length)
        d.numRetweets = d3.sum(d.values, p => p.retweets.length)
      })

      const pieChart = d3.pie().value(d => d.numTweets).sort(null)
      const yourPie = pieChart(nestedTweets)

      const newArc = d3.arc().innerRadius(20).outerRadius(100)

      pieChart.value(d => d.numTweets)

      const tweetsPie = pieChart(nestedTweets)

      pieChart.value(d => d.numRetweets)

      const retweetsPie = pieChart(nestedTweets)

      nestedTweets.forEach((d,i) => {
        d.tweetsSlice = tweetsPie[i]
        d.retweetsSlice = retweetsPie[i]
      })

      const fillScale = d3.scaleOrdinal().range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F"])

      d3.select('svg')
        .append('g')
        .attr("transform","translate(250,250)")
        .selectAll("path")
        .data(yourPie)
        .enter()
        .append("path")
        .attr("d", newArc)
        .style("fill", (d, i) => fillScale(i))
        .style("stroke", "black")
        .style("stroke-width", "2px")

      d3.selectAll("path")
        .transition()
        .duration(1000)
        .attrTween("d", d => {
          return t => {
            const interpolateStartAngle = d3.interpolate(d.data.tweetsSlice.startAngle, d.data.retweetsSlice.startAngle)
            const interpolateEndAngle = d3.interpolate(d.data.tweetsSlice.endAngle, d.data.retweetsSlice.endAngle)

            d.startAngle = interpolateStartAngle(t)
            d.endAngle = interpolateEndAngle(t)

            return newArc(d)
          }
        });
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
