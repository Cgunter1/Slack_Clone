import React from 'react';
import PropTypes from 'prop-types';
import './navbar.css';

function Navbar ({tabStatus, changeTab, tabOptions}){
    return(
        <div className="navbar">
            <div className="content">
                <div className="channels">
                  <div className="nav-header">
                    <h3>
                      CHANNELS
                    </h3>
                    <h4>
                      Close
                    </h4>
                  </div>
                    <ul className="channel-items">
                        {tabOptions[0].channels.map(data => 
                        <li onClick={changeTab(data)} key={data} className={tabStatus === data ? "current-tab":""}>
                            <div className="data">{data}</div>
                        </li>)}
                    </ul>
                </div>

                <div className="people">
                    PEOPLE
                    <ul className="people-items">
                        {tabOptions[0].users.map(data => 
                        <li onClick={changeTab(data)} key={data} className={tabStatus === data ? "current-tab":""}>
                            <div className="data">{data}</div>
                        </li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

Navbar.propTypes = {
    tabStatus: PropTypes.string.isRequired,
    changeTab: PropTypes.func.isRequired,
    tabOptions: PropTypes.array.isRequired,
}

export default Navbar;
