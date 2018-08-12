import React from 'react';
import Bio from '../../components/bio';
import Block from '../../components/block';
import Blog from '../../components/blog';
import Cta from '../../components/cta';
import Newsletter from '../../components/newsletter';
import Post from '../../components/post';
import Sector from '../../components/sector';
import Sectors from '../../components/sectors';
import Title from '../../components/title';
import blogProps from '../../components/blog/defaults.json';
const Patterns = props => {
  return (
    <Block isMain>
      <Block>
        <Post>
          <Title heading={props.pageHeading} />
          <hr />
          <h2>Biography</h2>
          <div className="b-post__pattern">
            <Bio />
          </div>
          <h2>Blog latest</h2>
          <div className="b-post__pattern">
            <Blog {...blogProps} />
          </div>
          <h2>Call to Action</h2>
          <div className="b-post__pattern">
            <Cta />
          </div>
          <h2>Newsletter</h2>
          <div className="b-post__pattern">
            <Newsletter />
          </div>
          <h2>Sector</h2>
          <div className="b-post__pattern">
            <Sector {...Sectors.defaultProps.items[1]} />
          </div>
          <h2>Sector RTL</h2>
          <div className="b-post__pattern">
            <Sector {...Sectors.defaultProps.items[0]} />
          </div>
        </Post>
      </Block>
    </Block>
  );
};
Patterns.defaultProps = {
  pageHeading: 'Pattern Library'
};
export default Patterns;
