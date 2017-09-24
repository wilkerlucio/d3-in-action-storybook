import React from 'react';

import { storiesOf } from '@storybook/react';

import {BoxRaw} from './chapter-4/box'
import {LineRaw} from './chapter-4/lines'
import {StreamGraphD3} from './chapter-4/streamgraph'
import {Histogram} from './chapter-5/histogram'
import {Violin} from "./chapter-5/violin";
import {PieChart} from "./chapter-5/pie";
import {StackBars, StackChart} from "./chapter-5/stack";
import {Sankey} from "./chapter-5/sankey";
import {WordCloud} from "./chapter-5/word-cloud";
import {TweetCirclePack} from "./chapter-6/tweet-circle-pack";
import {Dendogram} from "./chapter-6/dendogram";
import {Radial} from "./chapter-6/radial";
import {Partition} from "./chapter-6/partition";
import {Sunburst} from "./chapter-6/sunburst";
import {Treemap} from "./chapter-6/treemap";
import {OmFlame} from "./experiments/om-flamegraph";
import {AdjacencyMatrix} from "./chapter-7/adjacency-matrix";
import {QueueViewNP} from "./number-picture/queue-view";
import {ArcNetwork} from "./chapter-7/arc";
import {ForcePlay} from "./chapter-7/force";
import {ForceNetwork} from "./chapter-7/force-network";

storiesOf('Chapter 04 - Chart Components', module)
  .add('Box Chart', () => <BoxRaw />)
  .add('Line Chart', () => <LineRaw />)
  .add('StreamGraph', () => <StreamGraphD3 />)

storiesOf('Chapter 05 - Layouts', module)
  .add('Histogram', () => <Histogram />)
  .add('Violin', () => <Violin />)
  .add('PieChart', () => <PieChart />)
  .add('StackChart', () => <StackChart />)
  .add('StackBars', () => <StackBars />)
  .add('Sankey', () => <Sankey />)
  .add('WordCloud', () => <WordCloud />)

storiesOf('Chapter 06 - Hierachical', module)
  .add('TweetCirclePack', () => <TweetCirclePack/>)
  .add('Dendogram', () => <Dendogram/>)
  .add('Radial', () => <Radial/>)
  .add('Partition', () => <Partition/>)
  .add('Sunburst', () => <Sunburst/>)
  .add('Treemap', () => <Treemap/>)

storiesOf('Chapter 07 - Network', module)
  .add('AdjacencyMatrix', () => <AdjacencyMatrix/>)
  .add('ArcNetwork', () => <ArcNetwork/>)
  .add('ForcePlay', () => <ForcePlay/>)
  .add('ForceNetwork', () => <ForceNetwork/>)

storiesOf('Experiments', module)
  .add('OmFlame', () => <OmFlame data="/data/om-bogus-run.json"/>)
  .add('OmFlame Dino', () => <OmFlame data="/data/flame/dino.json"/>)
  .add('OmFlame Abrams', () => <OmFlame data="/data/flame/abrams.json"/>)

storiesOf('Number Picture', module)
  .add('QueueViewNP', () => <QueueViewNP/>)
