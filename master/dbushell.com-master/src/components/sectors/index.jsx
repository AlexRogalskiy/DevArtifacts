import React from 'react';
import Block from '../block';
import Sector from '../sector';
import defaults from './defaults';

const Sectors = ({items}) => {
  return (
    <div className="c-sectors">
      <Block>
        <div className="c-sectors__list">
          <div className="c-sectors__item">
            <Sector {...items[0]} />
          </div>
          <div className="c-sectors__item">
            <Sector {...items[1]} />
          </div>
        </div>
      </Block>
    </div>
  );
};

Sectors.defaultProps = defaults;

export default Sectors;
