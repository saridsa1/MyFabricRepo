import React, {Component} from 'react';
import './App.css';
import AppointmentsApp from './App';

import {css} from 'glamor';
import {CompoundButton} from 'office-ui-fabric-react/lib/Button';
import moment from 'moment';

class BaseApp extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    _noop() {
        console.log("No operation invoked");
    }

    render() {
        let dateString = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
        let now = moment();
        let time = ((now.hour()) >= 12 ? ' PM' : ' AM');

        var greeting = (time === "AM")? "Good morning!" : "Good evening!";
        return (
            <div className="ms-Grid">
                <div className="ms-Grid-row" { ...css({
                    backgroundColor: '#2488d8',
                    boxShadow: '0 0 20px rgba(192, 192, 192, .3)',
                    padding: 20
                }) }>
                    <div className="ms-Grid-col ms-u-sm11 ms-u-md11 ms-u-lg11">
                            <span className="ms-font-su ms-fontColor-white">
                            { greeting }
                            </span>
                        <br/>
                        <span className="ms-font-xs ms-fontColor-white">{ dateString }</span>
                    </div>
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg4"></div>
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg5">
                         <br/>
                         <CompoundButton icon='Add' description='Add or delete appointments for today'> Manage appointments </CompoundButton>
                         <br/>
                         <CompoundButton icon='Add' description='Add, edit or delete patients records'> Manage patients </CompoundButton>
                    </div>
                </div>
            </div>);
    }

}

export default BaseApp;
