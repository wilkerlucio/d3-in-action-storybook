import * as d3 from 'd3'
import React from 'react'
import cloud from 'd3-cloud'

export class WordCloud extends React.Component {
  componentDidMount() {
    d3.csv('/data/worddata.csv', (err, data) => {
      const wordScale = d3.scaleLinear().domain([0, 75]).range([10, 160])
      const randomRotate = d3.scaleLinear().domain([0, 1]).range([-20, 20])

      cloud()
        .size([500, 500])
        .words(data)
        .rotate(_ => randomRotate(Math.random()))
        .fontSize(d => wordScale(d.frequency))
        .on('end', words => {
          const wordG = d3.select('svg').append('g').attr('transform', 'translate(300, 300)')

          wordG.selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', d => d.size + 'px')
            .style('fill', '#4F442B')
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
            .text(d => d.text)
        })
        .start()
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
