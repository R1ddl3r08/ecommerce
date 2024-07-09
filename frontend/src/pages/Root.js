import React, { Component } from 'react';
import { Outlet } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';

class RootLayout extends Component {
  render() {
    return (
      <>
        <MainNavigation />
        <main>
          <Outlet />
        </main>
      </>
    );
  }
}

export default RootLayout;
