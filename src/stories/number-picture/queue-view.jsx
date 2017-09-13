import * as d3 from 'd3'
import React from 'react'
import {Svg, Circle, Rect, Collection} from 'number-picture'

export class QueueViewNP extends React.Component {
  render() {
    const data = [1, 3, 2, 5, 4]

    return (
      <Svg width={400} height={400}>
        <Collection data={data}>
          <Collection data={(props) => d3.range(props.datum)}>
            <Rect x={(props) => props.datum * 20 + 10} y={(props) => props.index * 30 + 10} width={20} height={20} />
          </Collection>
        </Collection>
      </Svg>
    )
  }
}
