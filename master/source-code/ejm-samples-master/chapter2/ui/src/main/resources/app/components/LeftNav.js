import React from 'react';
import { Link } from 'react-router';

export default function(props) {
  return (
    <div className="nav-pf-vertical nav-pf-vertical-with-secondary-nav ">
      <ul className="list-group">
        <li className="list-group-item active">
          <Link to="addresses">
            <span className="fa fa-envelope"></span>
            <span className="list-group-item-value">Addresses</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
