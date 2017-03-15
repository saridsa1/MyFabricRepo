import React from 'react';
import ReactDOM from 'react-dom';
import BaseApp from './Base';

import moment from 'moment';
import './index.css';


let now = moment();
let time = ((now.hour()) >= 12 ? ' PM' : ' AM');
console.log(time);
//if (time.trim() === 'AM') {
    ReactDOM.render(
        <BaseApp />,
        document.getElementById('root')
    );
//}
