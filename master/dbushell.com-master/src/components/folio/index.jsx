import React from 'react';
import Block from '../block';
import LazyImage from '../lazyimage';
import defaults from './defaults';

const FolioItem = props => {
  return (
    <li className="b-folio__item" style={{backgroundColor: props.bgColor}}>
      <a className="b-folio__link" href={props.href}>
        <span className="b-folio__label">{props.heading}</span>
        <LazyImage
          className="b-folio__image"
          src={props.imageSrc}
          alt={props.imageAlt}
        />
      </a>
    </li>
  );
};

const Folio = props => {
  return (
    <div className="c-folio">
      <Block>
        <div className="c-folio__header">
          <h2>
            <a href={props.href}>{props.heading}</a>
          </h2>
        </div>
        <div className="b-folio">
          <ul className="b-folio__list">
            {props.items.map(item => <FolioItem key={item.href} {...item} />)}
          </ul>
        </div>
      </Block>
    </div>
  );
};

Folio.defaultProps = defaults;

export default Folio;
