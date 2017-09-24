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

function forceTick() {
  d3.selectAll("line.link")
    .attr("x1", d => d.source.x)
    .attr("x2", d => d.target.x)
    .attr("y1", d => d.source.y)
    .attr("y2", d => d.target.y);
  d3.selectAll("g.node")
    .attr("transform", d => `translate(${d.x},${d.y})`);
}

export class ForceNetwork extends React.Component {
  async componentDidMount() {
    const {nodes, edges} = await prepareData()

    const root = d3.select(this.root)

    const marker = root.append('defs')
      .append('marker')
      .attr('id', 'triangle')
      .attr('refX', 12)
      .attr('refY', 6)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('markerWidth', 12)
      .attr('markerHeight', 18)
      .attr('orient', 'auto')
      .style('fill', '#93C464')
      .append('path')
      .attr('d', 'M 0 0 12 6 0 12 3 6')

    const roleScale = d3.scaleOrdinal()
      .domain(["contractor", "employee", "manager"])
      .range(["#75739F", "#41A368", "#FE9922"]);

    const linkForce = d3.forceLink()

    const forceTick = () => {
      root.selectAll("line.link")
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y);

      root.selectAll("g.node")
        .attr("transform", d => `translate(${d.x},${d.y})`);
    }

    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-40))
      .force('center', d3.forceCenter(300, 300))
      .force('link', linkForce)
      .on('tick', forceTick)

    simulation.force('link').links(edges)

    root.selectAll('line.link')
      .data(edges, d => `${d.source.id}-${d.target.id}`)
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', '#93C464')
      .style('opacity', .5)
      .style('stroke-width', d => d.weight)

    root.selectAll("line").attr("marker-end", "url(#triangle)");

    const nodeEnter = root.selectAll('g.node')
      .data(nodes, d => d.id)
      .enter()
      .append('g')
      .attr('class', 'node')

    nodeEnter.append('circle')
      .attr('r', 5)
      .style('fill', d => roleScale(d.role))

    nodeEnter.append('text')
      .style('text-anchor', 'middle')
      .attr('y', 15)
      .text(d => d.id)
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={600}/>
  }
}
