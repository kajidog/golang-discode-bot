import { BrowserRouter, Routes, Route } from 'react-router-dom';

import React from 'react';
import BotProtect from '../bot/BotProtect';
import Home from '../../pages/Home';
import TokenSetting from '../../pages/TokenSetting';
import UserProtect from '../accessToken/UserProtect';
import UserDictionary from '../../pages/setting/UserDoctonary';
import { Layout } from '../../layout/Layout';
import SoundPage from '../../pages/SoundPage';
import { DifyPage } from '../../pages/DifyPage';

type RouterProps = {};

const RouterComponent: React.FC<RouterProps> = ({}) => {
  return (
    <Routes>
      <Route path="/" element={<BotProtect />}>
        <Route path="/" element={<UserProtect />}>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sound" element={<SoundPage />} />
            <Route path="/dify" element={<DifyPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="/bot">
        <Route path="token" element={<TokenSetting />} />
      </Route>
      <Route path="/setting">
        <Route path="user_dictionary" element={<UserDictionary />} />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
