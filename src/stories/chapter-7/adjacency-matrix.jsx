import * as d3 from 'd3'
import React from 'react'
import {Svg, Rect, Text, Collection, Group} from 'number-picture'

function csv(path) {
  return new Promise(resolve => d3.csv(path, d => resolve(d)))
}

function appendStyle() {
  const css = ".grid {\n" +
    "    stroke: #9A8B7A;\n" +
    "    stroke-width: 1px;\n" +
    "    fill: #CF7D1C;\n" +
    "}\n" +
    "\n" +
    ".arc {\n" +
    "    stroke: #9A8B7A;\n" +
    "    fill: none;\n" +
    "}\n" +
    "\n" +
    ".node {\n" +
    "    fill: #EBD8C1;\n" +
    "    stroke: #9A8B7A;\n" +
    "    stroke-width: 1px;\n" +
    "}\n" +
    "\n" +
    "text {\n" +
    "        font-size: 8px;\n" +
    "      }" +
    "circle.active {\n" +
    "    fill: #FE9922;\n" +
    "}\n" +
    "\n" +
    "path.active {\n" +
    "    stroke: #FE9922;\n" +
    "}\n" +
    "\n" +
    "circle.source {\n" +
    "    fill: #93C464;\n" +
    "}\n" +
    "\n" +
    "circle.target {\n" +
    "    fill: #41A368;\n" +
    "}\n"

  d3.select('head').append('style').html(css)
}

async function prepareData() {
  const nodes = await csv("/data/nodelist.csv")
  const edges = await csv("/data/edgelist.csv")

  const edgeHash = {}

  for (const edge of edges) {
    const id = edge.source + "-" + edge.target
    edgeHash[id] = edge
  }

  const matrix = []

  nodes.forEach((source, a) => {
    nodes.forEach((target, b) => {
      const grid = {
        id: source.id + "-" + target.id,
        x: b, y: a,
        weight: 0
      }

      if (edgeHash[grid.id]) {
        grid.weight = +edgeHash[grid.id].weight
      }

      matrix.push(grid)
    })
  })

  return {matrix, nodes};
}

class AdjacencyMatrixD3 extends React.Component {
  async componentDidMount() {
    const {nodes, matrix} = await prepareData()

    const root = d3.select(this.root)

    root
      .append("g")
      .attr('transform', 'translate(50,50)')
      .attr('id', 'adjacencyG')
      .selectAll('rect')
      .data(matrix)
      .enter()
      .append('rect')
      .attr('class', 'grid')
      .attr('width', 25)
      .attr('height', 25)
      .attr('x', d => d.x * 25)
      .attr('y', d => d.y * 25)
      .style('fill-opacity', d => d.weight * 0.2)

    root
      .append('g')
      .attr('transform', 'translate(50,45)')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', (d, i) => i * 25 + 12.5)
      .text(d => d.id)
      .style('text-anchor', 'middle')

    root
      .append('g')
      .attr('transform', 'translate(45,50)')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('y', (d, i) => i * 25 + 12.5)
      .text(d => d.id)
      .style('text-anchor', 'end')

    root
      .selectAll('rect.grid').on('mouseover', d => {
      root
        .selectAll('rect').style('stroke-width', p => {
        return p.x === d.x || p.y === d.y ? '4px' : '1px';
      })
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={600} height={460}/>
  }
}

class AdjacencyMatrixNumberPicture extends React.Component {
  async componentDidMount() {
    this.setState(await prepareData())
  }

  render() {
    const {nodes, matrix} = this.state || {}

    if (!nodes) return null

    const {x, y} = this.state.selected || {}

    return (
      <Svg width={600} height={460}>
        <Group x={50} y={50}>
          <Collection data={matrix}>
            <Rect className="grid"
                  x={p => p.datum.x * 25}
                  y={p => p.datum.y * 25}
                  style={p => {
                    const width = p.datum.x === x || p.datum.y === y ? 4 : 1

                    return {"stroke-width": width}
                  }}
                  onMouseOver={e => {
                    this.setState({selected: e.datum})
                  }}
                  width={25}
                  height={25}
                  fillOpacity={p => p.datum.weight * .2}/>
          </Collection>
        </Group>

        <Group x={50} y={45}>
          <Collection data={nodes}>
            <Text datum={p => p.datum.id}
                  dx={p => p.index * 25 + 12.5}
                  textAnchor="middle"/>
          </Collection>
        </Group>

        <Group x={45} y={50}>
          <Collection data={nodes}>
            <Text datum={p => p.datum.id}
                  dy={p => p.index * 25 + 12.5}
                  textAnchor="middle"/>
          </Collection>
        </Group>
      </Svg>
    )
  }
}

export class AdjacencyMatrix extends React.Component {
  async componentDidMount() {
    appendStyle()
  }

  render() {
    return (
      <div>
        <AdjacencyMatrixD3/>
        <hr/>
        <AdjacencyMatrixNumberPicture/>
      </div>
    )
  }
}
