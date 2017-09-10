import * as d3 from 'd3';
import React from 'react';
import {Svg, Group, Line, Rect, Collection, Axis} from 'number-picture';

const tickSize = 470

const xScale = d3.scaleLinear().domain([1, 8]).range([20, tickSize])
const yScale = d3.scaleLinear().domain([0, 100]).range([tickSize + 10, 20])

class BoxStory extends React.Component {
  componentDidMount() {
    d3.csv("/data/boxplot.csv", (err, data) => {
      this.setState({data})
    })
  }

  render() {
    const {data} = (this.state || {});

    if (!data) return <div>Loading data...</div>

    return (
      <Svg width={800} height={490}>
        <Axis placement="right" scale={yScale} />
        <Axis placement="bottom" scale={xScale} />

        <Collection data={data}>
          <Group x={props => xScale(props.datum.day)}
                 y={props => yScale(props.datum.median)}>
            <Line x1={0} x2={0}
                  y1={props => yScale(props.datum.max) - yScale(props.datum.median) }
                  y2={props => yScale(props.datum.min) - yScale(props.datum.median) }
                  stroke="black" strokeWidth={4} />
            <Line x1={-10} x2={10}
                  y1={props => yScale(props.datum.max) - yScale(props.datum.median) }
                  y2={props => yScale(props.datum.max) - yScale(props.datum.median) }
                  stroke="black" strokeWidth={4} />
            <Line x1={-10} x2={10}
                  y1={props => yScale(props.datum.min) - yScale(props.datum.median) }
                  y2={props => yScale(props.datum.min) - yScale(props.datum.median) }
                  stroke="black" strokeWidth={4} />
            <Rect x={-10} y={props => yScale(props.datum.q3) - yScale(props.datum.median)}
                  width={20} height={props => yScale(props.datum.q1) - yScale(props.datum.q3)}
                  fill="white" stroke="black" strokeWidth={2} />
            <Line x1={-10} x2={10} y1={0} y2={0} stroke={"darkgray"} strokeWidth={4} />
          </Group>
        </Collection>
      </Svg>
    )
  }
}

export class BoxRaw extends React.Component {
  componentDidMount() {
    d3.csv("/data/boxplot.csv", (err, data) => {
      const yAxis = d3.axisRight().scale(yScale).ticks(8).tickSize(tickSize)
      d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis)

      const xAxis = d3.axisBottom().scale(xScale).tickSize(-tickSize).tickValues([1, 2, 3, 4, 5, 6, 7])
      d3.select("svg").append("g").attr("transform", `translate(0,${tickSize + 10})`).attr("id", "xAxisG").call(xAxis)

      d3.select('svg').selectAll('g.box')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'box')
        .attr('transform', d => `translate(${xScale(d.day)}, ${yScale(d.median)})`)
        .each(function(d,i) {
          d3.select(this)
            .append("line")
            .attr("class", "range")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", yScale(d.max) - yScale(d.median))
            .attr("y2", yScale(d.min) - yScale(d.median))
            .style("stroke", "black")
            .style("stroke-width", "4px");
          d3.select(this)
            .append("line")
            .attr("class", "max")
            .attr("x1", -10)
            .attr("x2", 10)
            .attr("y1", yScale(d.max) - yScale(d.median))
            .attr("y2", yScale(d.max) - yScale(d.median))
            .style("stroke", "black")
            .style("stroke-width", "4px")
          d3.select(this)
            .append("line")
            .attr("class", "min")
            .attr("x1", -10)
            .attr("x2", 10)
            .attr("y1", yScale(d.min) - yScale(d.median))
            .attr("y2", yScale(d.min) - yScale(d.median))
            .style("stroke", "black")
            .style("stroke-width", "4px")
          d3.select(this)
            .append("rect")
            .attr("class", "range")
            .attr("width", 20)
            .attr("x", -10)
            .attr("y", yScale(d.q3) - yScale(d.median))
            .attr("height", yScale(d.q1) - yScale(d.q3))
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", "2px")
          d3.select(this)
            .append("line")
            .attr("x1", -10)
            .attr("x2", 10)
            .attr("y1", 0)
            .attr("y2", 0)
            .style("stroke", "darkgray")
            .style("stroke-width", "4px")
        });
    })
  }

  render() {
    return <svg ref={e => this.root = e} width={800} height={490} />
  }
}
