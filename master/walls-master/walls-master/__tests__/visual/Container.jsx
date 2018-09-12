import React from 'react'
import { NavLink } from 'react-router-dom'

import Walls from '../../index'

import routes from './routes'

const Container = () => (
  <Walls routes={routes}>
    <nav>
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/foo">Foo</NavLink></li>
        <li><NavLink to="/bar">Bar</NavLink></li>
      </ul>
    </nav>
  </Walls>
)

export default Container
