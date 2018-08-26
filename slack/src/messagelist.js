import React from 'react';
import './messagelist.css';
import slackLogo from './img/images.png';
import Moment from 'moment';

function MessageList({ messagelist, tabstatus }){

    let messages = [];
    if(messagelist.length !== 0){
        if(messagelist[0].hasOwnProperty(tabstatus)){
            messages = messagelist[0];
        } else {
            messages = messagelist[1];
        }
        return(
            <React.Fragment>
                {messages[tabstatus].map(message =>
                    <li key={message.id} className="message">
                        <img src={slackLogo} className="thumbnail"/>
                        <div>
                            <span className="username">{message.name}</span> 
                            <span className="timestamp">{Moment(message.date).format('llll')}</span>
                            <div>{message.messages}</div>
                        </div>
                    </li>    
                )}
            </React.Fragment>
        );
    }
    else {
        return(
            <React.Fragment>
                Loading...
            </React.Fragment>
        );
    }
}

export default MessageList;