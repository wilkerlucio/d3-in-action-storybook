import * as d3 from 'd3'
import React from 'react'

class ForcePlayBee extends React.Component {
  async componentDidMount() {
    const root = d3.select(this.root)
    const roleScale = d3.scaleOrdinal().range(["#75739F", "#41A368", "#FE9922"])

    const sampleData = d3.range(300).map(() =>
      ({r: 2, value: 200 + d3.randomNormal()() * 50}))

    const updateNetwork = () => {
      root.selectAll('circle').attr('cx', d => d.y).attr('cy', d => d.x)
    }

    const force = d3.forceSimulation()
      .force("collision", d3.forceCollide(d => d.r))
      .force("x", d3.forceX(100))
      .force("y", d3.forceY(d => d.value).strength(3))
      .nodes(sampleData)
      .on("tick", updateNetwork)

    root.selectAll('circle')
      .data(sampleData)
      .enter()
      .append('circle')
      .style('fill', (d, i) => roleScale(i))
      .attr('r', d => d.r)
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={480}/>
  }
}

class ForcePlayBubble extends React.Component {
  async componentDidMount() {
    const root = d3.select(this.root)
    const roleScale = d3.scaleOrdinal().range(["#75739F", "#41A368", "#FE9922"])

    const sampleData = d3.range(100).map((d, i) => ({r: 50 - i * .5}))

    const manyBody = d3.forceManyBody().strength(10)
    const center = d3.forceCenter(250, 250)

    const updateNetwork = () => {
      root.selectAll('circle').attr('cx', d => d.x).attr('cy', d => d.y)
    }

    const force = d3.forceSimulation(sampleData)
      .force('charge', manyBody)
      .force('center', center)
      .force('collision', d3.forceCollide(d => d.r))
      .on('tick', updateNetwork)

    root.selectAll('circle')
      .data(sampleData)
      .enter()
      .append('circle')
      .style('fill', (d, i) => roleScale(i))
      .attr('r', d => d.r)
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={480}/>
  }
}

export class ForcePlay extends React.Component {
  render() {
    return (
      <div>
        <ForcePlayBubble/>
        <hr/>
        <ForcePlayBee/>
      </div>
    )
  }
}
