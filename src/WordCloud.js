import { Component, PropTypes } from 'react';
import ReactFauxDom from 'react-faux-dom';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const fill = d3.scaleOrdinal(d3.schemeCategory10);

const defaultFontSizeMapper = word => word.value;
const defaultRotate = word => word.value % 180 - 90; // eslint-disable-line no-mixed-operators

class WordCloud extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })).isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    padding: PropTypes.number,
    font: PropTypes.string,
    fontSizeMapper: PropTypes.func,
    rotate: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.func,
    ]),
  }

  static defaultProps = {
    width: 700,
    height: 600,
    padding: 5,
    font: 'serif',
    fontSizeMapper: defaultFontSizeMapper,
    rotate: defaultRotate,
  }

  componentWillMount() {
    this.wordCloud = ReactFauxDom.createElement('div');
  }

  render() {
    const { data, width, height, padding, font, fontSizeMapper, rotate } = this.props;
    const wordCounts = data.map(
      text => ({ ...text })
    );

    const layout = cloud()
      .size([width, height])
      .font(font)
      .words(wordCounts)
      .padding(padding)
      .rotate(rotate)
      .fontSize(fontSizeMapper)
      .on('end', words => {
        d3.select(this.wordCloud)
          .append('svg')
          .attr('width', layout.size()[0])
          .attr('height', layout.size()[1])
          .append('g')
          .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', d => `${d.size}px`)
          .style('font-family', 'Impact')
          .style('fill', (d, i) => fill(i))
          .attr('text-anchor', 'middle')
          .attr('transform',
            d => `translate(${[d.x, d.y]})rotate(${d.rotate})`
          )
          .text(d => d.text);
      });

    layout.start();

    return this.wordCloud.toReact();
  }
}


export default WordCloud;
