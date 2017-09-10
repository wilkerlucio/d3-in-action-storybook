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

storiesOf('Chapter 04', module)
  .add('Box Chart', () => <BoxRaw />)
  .add('Line Chart', () => <LineRaw />)
  .add('StreamGraph', () => <StreamGraphD3 />)

storiesOf('Chapter 05', module)
  .add('Histogram', () => <Histogram />)
  .add('Violin', () => <Violin />)
  .add('PieChart', () => <PieChart />)
  .add('StackChart', () => <StackChart />)
  .add('StackBars', () => <StackBars />)
  .add('Sankey', () => <Sankey />)
