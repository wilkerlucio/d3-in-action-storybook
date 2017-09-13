import * as d3 from 'd3'
import React from 'react'
import flame from 'd3-flame-graph'

export class OmFlame extends React.Component {
  componentDidMount() {
    const flameGraph = flame()
      .width(960)

    d3.json(this.props.data, (error, data) => {
      if (error) return console.warn(error)
      d3.select(this.root)
        .datum(data)
        .call(flameGraph)
    })
  }

  render() {
    return <div ref={e => this.root = e} />
  }
}
