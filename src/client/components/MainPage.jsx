import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

import CreateUser from './users/CreateUser';


import Users from './users/Users';
import Companies from './company/Companies';


const MainPage = () => {
  const [activeTab, setActiveTab] = useState('userTable');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };



  return (
        <div>
          <Header onTabChange={handleTabChange} />
          {activeTab === 'userTable' && (
            <div>
              <h2>User Creation Tab</h2>
              <Users />
            </div>
          )}
          {activeTab === 'companyTable' && (
            <div>
              <h2>Company Creation Tab</h2>
              <Companies />
            </div>
          )}
        </div>
    );
};

export default MainPage;