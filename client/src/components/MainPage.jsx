import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

import CreateUser from './users/CreateUser';


import Users from './users/Users';
import Companies from './company/Companies';
import Card from './card/Cards';
import Zone from './zone/Zone';


const MainPage = () => {
  const [activeTab, setActiveTab] = useState('userTable');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };



  return (
        <div>
          <Header onTabChange={handleTabChange} />
          
          {/* User page */}
          {activeTab === 'userTable' && (
            <div>
              <h2>User Creation Tab</h2>
              <Users />
            </div>
          )}

          {/* Company page */}
          {activeTab === 'companyTable' && (
            <div>
              <h2>Company Creation Tab</h2>
              <Companies />
            </div>
          )}

          {/* Card page */}
          {activeTab === 'cardTable' && (
            <div>
              <h2>Card Creation Tab</h2>
              <Card />
            </div>
          )}

          {/* Zone page */}
          {activeTab === 'ZoneTable' && (
            <div>
              <h2>Zone Creation Tab</h2>
              <Zone />
            </div>
          )}
        </div>
    );
};

export default MainPage;