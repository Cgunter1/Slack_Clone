import React from 'react';
import './navbar.css';

function Navbar ({tabStatus, changeTab, tabOptions}){
    return(
        <div className="navbar">
            <div className="content">
                <div className="channels">
                    CHANNELS
                    <ul className="channel-items">
                        {tabOptions[0].channels.map(data => 
                        <li key={data} className={tabStatus === data ? "current-tab":""}>
                            <span className="data"># <span onClick={changeTab(data)}>{data}</span>
                            </span>
                        </li>)}
                    </ul>
                </div>

                <div className="people">
                    PEOPLE
                    <ul className="people-items">
                        {tabOptions[0].users.map(data => 
                        <li onClick={changeTab(data)} key={data} className={tabStatus === data ? "current-tab":""}>
                            <span className="data">{data}</span>
                        </li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;