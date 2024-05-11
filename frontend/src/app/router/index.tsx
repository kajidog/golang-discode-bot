import { BrowserRouter, Routes, Route } from 'react-router-dom';

import React from 'react';
import BotProtect from '../bot/BotProtect';
import Home from '../../pages/Home';
import TokenSetting from '../../pages/TokenSetting';
import UserProtect from '../accessToken/UserProtect';

type RouterProps = {};

const RouterComponent: React.FC<RouterProps> = ({}) => {
  return (
    <Routes>
      <Route path="/" element={<BotProtect />}>
        <Route path="/" element={<UserProtect />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>
      <Route path="/bot">
        <Route path="token" element={<TokenSetting />} />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
