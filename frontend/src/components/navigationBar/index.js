import React from 'react';
import { GITHUB, LINKEDIN, PORTFOLIO } from '../../utils/constants';

import './index.css';

export const NavigationBar = () => {
  return (
    <div className="navigation__wrapper">
      <span className="navigation__title">OSARO DEMO</span>
      <ul className="navigation__list">
        <li className="navigation__item">
          <a href={GITHUB} target="_blank">
            GitHub
          </a>
        </li>
        <li className="navigation__item">
          <a href={LINKEDIN} target="_blank">
            LinkedIn
          </a>
        </li>
        <li className="navigation__item">
          <a href={PORTFOLIO} target="_blank">
            Portfolio
          </a>
        </li>
      </ul>
    </div>
  );
};
