import * as d3 from 'd3'
import React from 'react'
import {Svg, Circle, Collection, Group} from 'number-picture'

function csv(path) {
  return new Promise(resolve => d3.csv(path, d => resolve(d)))
}

async function prepareData() {
  const nodes = await csv("/data/nodelist.csv")
  const edges = await csv("/data/edgelist.csv")

  const nodeHash = {}

  nodes.forEach((node, x) => {
    nodeHash[node.id] = node
    node.x = parseInt(x) * 30
  })

  edges.forEach(edge => {
    edge.weight = parseInt(edge.weight)
    edge.source = nodeHash[edge.source]
    edge.target = nodeHash[edge.target]
  })

  return {nodes, edges}
}

function arc(d) {
  const draw = d3.line().curve(d3.curveBasis)
  const midX = (d.source.x + d.target.x) / 2
  const midY = (d.source.x - d.target.x)

  return draw([[d.source.x, 0], [midX, midY], [d.target.x, 0]])
}

class ArcNetworkD3 extends React.Component {
  async componentDidMount() {
    const {nodes, edges} = await prepareData()

    const root = d3.select(this.root)

    const arcG = root.append('g').attr('id', 'arcG').attr('transform', 'translate(50,250)')

    arcG.selectAll('path')
      .data(edges)
      .enter()
      .append('path')
      .attr('class', 'arc')
      .style('stroke-width', d => d.weight * 2)
      .style('opacity', .25)
      .attr('d', arc)

    arcG.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .attr('cx', d => d.x)
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={460}/>
  }
}

class ArcNetworkNumberPicture extends React.Component {
  async componentDidMount() {
    this.setState(await prepareData())
  }

  render() {
    const {nodes, edges} = this.state || {}

    if (!nodes) return null

    return (
      <Svg width={600} height={460}>
        <Group x={50} y={250}>
          <Collection data={edges}>
          </Collection>

          <Collection data={nodes}>
            <Circle cx={p => p.datum.x} r={10} className="node" />
          </Collection>
        </Group>
      </Svg>
    )
  }
}

export class ArcNetwork extends React.Component {
  render() {
    return (
      <div>
        <ArcNetworkD3/>
        <hr/>
        <ArcNetworkNumberPicture/>
      </div>
    )
  }
}
