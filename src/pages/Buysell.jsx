import React from 'react';
import BuysellNavbar from './BuysellNavbar';
import SlidingBooks from './SlindingBooks';

function Buysell() {
  return (
    <div>

      <BuysellNavbar />

      {/* Reduced space above SlidingBooks */}
      <div className="mt-[-200px]">   
        <SlidingBooks />
      </div>

    </div>
  );
}

export default Buysell;
