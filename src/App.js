import React, {Component} from 'react';
import './App.css';
import data from '../data/TestData.json';
import _columns from '../data/ColumnConfig';

import {css} from 'glamor';
import {DetailsList} from 'office-ui-fabric-react/lib/DetailsList';
import {SelectionMode} from 'office-ui-fabric-react/lib/Selection';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {ContextualMenu} from  'office-ui-fabric-react/lib/ContextualMenu'
import {Link} from 'office-ui-fabric-react/lib/Link'
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

class App extends Component {
    constructor(props) {
        super(props);
        let _items = data;
        this.state = {
            isContextMenuVisible: false,
            displayData: _items,
            actualData: _items,
            columns: _columns,
            appointments : []
        };
    }

    _renderItemColumn(item, index, column) {
        let fieldContent = item[column.key];
        let patientId = item['assignedId'];
        switch (column.key) {
            case 'phoneNumber':
                fieldContent = item['personalInfo']['phoneNumber'];
                return <span data-selection-disabled={ true } data-selection-invoke={ true }
                             className={App}>{ fieldContent }</span>;
            case 'assignedId' :
                return <Link data-selection-invoke={ true }
                             onClick={ this._onItemInvoked.bind(this, event, item) }>{ patientId }</Link>;
            default:
                return <span data-selection-disabled={ true } className={App} data-selection-invoke={ true }
                             style={ {color: fieldContent} }>{ fieldContent }</span>;
        }
    }

    _onItemInvoked(event, item) {
        this.setState({
            screenTarget: event.target,
            isContextMenuVisible: true,
            selectedItem: item
        })
    }

    _onFilterChanged(text) {
        let actualDataRef = this.state.actualData;
        let filteredData = actualDataRef.filter(function (obj) {
            return obj.assignedId.toString().indexOf(text) > -1;
        });

        this.setState({
            displayData: filteredData,
            actualData: actualDataRef,
            columns: _columns
        })
    }

    _onContextMenuDismiss() {
        this.setState({
            isContextMenuVisible: false,
            screenTarget: null,
            item: null
        });
    }
    _onCalloutDismiss(){
      this.setState({
            appointmentsMenuVisible: false,
            appointmentsScreenTarget: null
      });
    }

    _onNewAppointment() {
        let _appointments = this.state.appointments;
        let appointmentAlreadyExists = false;
        for(var aptCounter = 0; aptCounter < _appointments.length && !appointmentAlreadyExists; aptCounter++){
          let value = _appointments[aptCounter];
          if(value.assignedId === this.state.selectedItem.assignedId){
              appointmentAlreadyExists = true;
          }
        }
        if(appointmentAlreadyExists){
            this.setState({
                appointmentError : true,
                appointments : _appointments
            });
        } else {
          _appointments.push(this.state.selectedItem);
          this.setState({
              appointmentError : false,
              appointments : _appointments
          });        
        }
    }

    _onEditDetails() {
        console.log(event, this.state.selectedItem);
    }

    _showAppointments(event){
      this.setState({
          appointmentsMenuVisible: true
      });
    }
    _deleteAppointment(appointment){
        let _appointments = this.state.appointments.filter(function(value, index){
            return (value.assignedId !== appointment.assignedId);
        })
        this.setState({
          appointments: _appointments
      });

    }
    _onViewHistory() {
        console.log(event, this.state.selectedItem);
    }
    _noop(){
      console.log("No operation invoked");
    }
    render() {
      let appointmentsMenuItems = [];
      if(this.state.appointmentsMenuVisible){        
         appointmentsMenuItems = this.state.appointments.map(function(value, index){
              var printName = value.firstName + (value.lastName === undefined ? "" : ", "+value.lastName) ;
              return (
                <span key={value.assignedId} className='ms-CalloutExample-subText'>
                  <p className="notification-name-link">{value.assignedId} | {printName} </p>
                  <p className="notification-delete-link"><Link data-selection-invoke={ true } onClick={this._deleteAppointment.bind(this, value)}><i className="ms-Icon ms-Icon--Delete" aria-hidden="true"></i></Link></p>
                </span>)
         }.bind(this));
      }
        return (
            <div className="ms-Grid">
                  {
                    (this.state.appointmentError) ?
                      <MessageBar messageBarType={ MessageBarType.blocked} onDismiss={this._noop.bind(this)} isMultiline={ false }>Appoinment already exists for the patient</MessageBar>
                      :
                      (null) 
                  }
                <div className="ms-Grid-row" { ...css({backgroundColor: '#FAFAFA',boxShadow: '0 0 20px rgba(192, 192, 192, .3)', padding: 20}) }>
                    <div className="ms-Grid-col ms-u-sm11 ms-u-md11 ms-u-lg11">
                        <span className="ms-font-su ms-fontColor-blue">
                          Good Morning ! 
                        </span>
                        <br/>
                        <span className="ms-font-xs ms-fontColor-blue">Thu Mar 09 2017 10:38</span>
                    </div>
                    <div className="ms-Grid-col ms-u-sm1 ms-u-md1 ms-u-lg1">
                      <br/>
                      <span className="ms-font-su ms-fontColor-blue"  ref={ (menuButton) => this._menuButtonElement = menuButton }>
                        {
                          (this.state.appointments.length > 0 ) ?                             
                            <Link data-selection-invoke={ true } onClick={this._showAppointments.bind(this, event)}>
                              <i className="ms-Icon ms-Icon--EventInfo" aria-hidden="true"><span className="badge">{this.state.appointments.length}</span></i>
                              {this.state.appointmentsMenuVisible ? 
                                <Callout className='ms-CalloutExample-callout' gapSpace={ 2 } targetElement={ this._menuButtonElement } onDismiss={ this._onCalloutDismiss.bind(this) } setInitialFocus={ true }>
                                  <div className='ms-CalloutExample-header'>
                                    <p className='ms-CalloutExample-title'>
                                        All of your appointments
                                    </p>
                                  </div>
                                  <div className='ms-CalloutExample-inner'>
                                  <div className='ms-CalloutExample-content'>
                                     {appointmentsMenuItems}
                                  </div>
                                </div>
                              </Callout>
                               : (null)}
                            </Link>                            
                           : 
                           <i className="ms-Icon ms-Icon--EventInfo" aria-hidden="true"></i>  
                        }                                                
                      </span>  
                    </div>                    
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" { ...css({paddingLeft: 20, paddingTop: 20 }) }>
                        <div>
                            <TextField label='Patient ID' onChanged={this._onFilterChanged.bind(this)}/>
                            <br/>
                            <DetailsList
                                items={ this.state.displayData }
                                setKey='set'
                                columns={ this.state.columns }
                                onRenderItemColumn={ this._renderItemColumn.bind(this) }
                                selectionMode={SelectionMode.single}/>
                        </div>
                    </div>
                </div>
                {this.state.isContextMenuVisible ? <ContextualMenu
                        target={ this.state.screenTarget }
                        isBeakVisible={ true }
                        gapSpace={ 10 }
                        directionalHintFixed={ false }
                        onDismiss={this._onContextMenuDismiss.bind(this)}
                        items={
                            [
                                {
                                    key: 'newAppointment',
                                    name: 'New Appointment',
                                    icon: 'Add',
                                    onClick: this._onNewAppointment.bind(this)
                                },
                                {
                                    key: 'editDetails',
                                    name: 'Edit details',
                                    icon: 'Edit',
                                    onClick: this._onEditDetails.bind(this)
                                },
                                {
                                    key: 'viewHistory',
                                    name: 'View History',
                                    icon: 'History',
                                    onClick: this._onViewHistory.bind(this)
                                }
                            ]
                        }
                    /> : (null)}
            </div>

        );
    }
}

export default App;
