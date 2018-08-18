import React from 'react';
import styled, { keyframes } from 'styled-components';

export const Icon = styled.svg`
  width: 30px;
  height: 35px;
  margin: 0 5px;
`;

const CheckIcon = (props) => (
  <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 27">
    <g fill="none" fillRule="evenodd" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path fill="#D8DDEF" stroke="#D8DDEF" strokeWidth="1.1" d="M20.437 25.202V26H1v-1.0638h.0084V1h12l7.4286 6.915v17.287zM13.0084 1v7.0652h7.4286" strokeLinecap="round" strokeLinejoin="round"/>
      <path stroke="#8BC34A" strokeWidth="1.44" d="M7.556 17.735l1.5 2.222 4.5-4"/>
    </g>
  </Icon>
)

export default CheckIcon;