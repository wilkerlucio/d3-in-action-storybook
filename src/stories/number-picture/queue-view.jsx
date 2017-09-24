import * as d3 from 'd3'
import React from 'react'
import {Svg, Circle, Rect, Collection, Group} from 'number-picture'

export class QueueViewNP extends React.Component {
  render() {
    const data = [1, 3, 2, 5, 4]

    return (
      <Svg width={400} height={400}>
        <Collection data={[1, 2]}>
          <Group y={(p) => {console.log(p); return p.index * 20}}>
            <Collection data={[10, 9, 8]}>
              <Rect x={(props) => {console.log(''); return props.datum * 10}} y={0} width={5} height={5} />
            </Collection>
          </Group>
        </Collection>
      </Svg>
    )
  }
}

export class NestedCollections extends React.Component {
  render() {
    return (
      <Svg width={400} height={400}>
        <Collection data={[1, 2, 3]}>
          <Collection data={[10, 9, 8]}>
            <Rect x={(props) => props.datum * 10} y={(props) => props.index * 10} width={5} height={5} />
          </Collection>
        </Collection>
      </Svg>
    )
  }
}
