import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Navbar from './navbar.js';
import MessageList from './messagelist.js';
import channelData from './data/channeldata.json';
import userData from './data/userdata.json';
import tabOptions from './data/tab-options.json';
import * as Scroll from 'react-scroll';

let scroll = Scroll.animateScroll;

class SlackMessage extends React.Component {

    componentDidMount(){
        let that = this;
        setTimeout( function(){
        let messages = that.state.messages.slice();

        messages.push(channelData[0]);
        messages.push(userData[0]);

        that.setState({
            messages: messages,
        });
        }, 2000);
        this.scrollBottom();
    }

    constructor(props){
        super(props);

        this.state = {
            messages: [], // {name, date, message, id}, An array of arrays of channel messages.
            // So the zeroth index of the messages array contains all the messages for the general channel.
            // general channel: 0, help channel: 1, react channel: 2, ...
            tab: 'general',
            userinput: '',
        };

        this.changeTab = this.changeTab.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    scrollBottom() {
        scroll.scrollToBottom();
    }

    handleChange(event){
        this.setState({
            userinput: event.target.value,
        });
    }

    handleSubmit(event){
        if(event.key === 'Enter' && this.state.userinput !== ''){
            let newMessage = {
                'name': 'Myself',
                'id': Math.round((Math.random()*1000)),
                'messages': this.state.userinput,
                'date': Date.now(),
            }
            let messages = this.state.messages.slice();
            let tab = this.state.tab;
            if(messages[0].hasOwnProperty(tab)){
                messages[0][tab].push(newMessage); // This tab is for the channels
            } else {
                messages[1][tab].push(newMessage); // This tab is for the individual users
            }
            this.setState({
                messages:messages,
                userinput: '',
            });
             this.scrollBottom();
        }
    }

    changeTab(event){
        let tab = event.target.textContent;
        this.setState({
             tab: tab,
        });
        this.scrollBottom();
    }

    render(){
        console.log(this.state.messages);
        return(
            <React.Fragment>
                <Navbar 
                    tabStatus={this.state.tab} 
                    changeTab={() => this.changeTab}
                    tabOptions={tabOptions}/>
                <div className="message-list">
                    <ul className="message-line">
                        <MessageList messagelist={this.state.messages} tabstatus={this.state.tab}/>
                    </ul>
                </div>
                <div className="input-block">
                    <input onChange={this.handleChange}
                    value={this.state.userinput} 
                    onKeyPress={this.handleSubmit} 
                    placeholder="Type your message here. Press Enter to send."
                    type="text" 
                    className="input"/>
                </div>
            </React.Fragment>
        );
    }
}

ReactDOM.render(<SlackMessage />, document.getElementById('root'));