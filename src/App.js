import React, {Component} from 'react';
import './App.css';
import _columns from '../data/ColumnConfig';

import {css} from 'glamor';
import ServiceURL from '../data/ServiceURL.json';
import {DetailsList} from 'office-ui-fabric-react/lib/DetailsList';
import {SelectionMode} from 'office-ui-fabric-react/lib/Selection';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {ContextualMenu} from  'office-ui-fabric-react/lib/ContextualMenu'
import {Link} from 'office-ui-fabric-react/lib/Link'
import {Callout} from 'office-ui-fabric-react/lib/Callout';
import {MessageBar, MessageBarType} from 'office-ui-fabric-react/lib/MessageBar';
import {Dialog, DialogType, DialogFooter} from 'office-ui-fabric-react/lib/Dialog';
import {Button, ButtonType} from 'office-ui-fabric-react/lib/Button';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import axios from 'axios';
import moment from 'moment';

class AppointmentsApp extends Component {
    constructor(props) {
        super(props);
        this.resetState();
        axios.defaults.headers.post['Content-Type'] = 'application/json';
    }
    reset(){
        this.resetState();
        this.getInitialData();
    }
    resetState(){
        this.state = {
            isContextMenuVisible: false,
            columns: _columns,
            appointments: [],
            loadingPatientData: true,
            screenTarget: null,
            item: null,
            appointmentsMenuVisible: false,
            appointmentsScreenTarget: null,
            settingsMenuVisible: false,
            appointmentError: false,
            addNewPatient: false
        };
    }

    getInitialData(){
        var baseServiceURL = ServiceURL["Production"]["BaseURL"]; 
        axios.get(baseServiceURL.concat("patientsInfo")).then(function (response) {

            let serverResponse = Object.keys(response.data).map(function (value, index) {
                return response.data[value];
            });
            this.setState({
                actualData: serverResponse,
                displayData: serverResponse,
                loadingPatientData: false
            })
        }.bind(this));

        axios.get(baseServiceURL.concat("appointments/byDate")).then(function (response) {
            if (response.data !== null) {
                let serverResponse = Object.keys(response.data).map(function (value, index) {
                    return response.data[value];
                });
                console.log(serverResponse);
                this.setState({
                    appointments: serverResponse
                })
            }
        }.bind(this))
    }

    componentDidMount() {
        this.getInitialData();
    }

    _renderItemColumn(item, index, column) {
        let fieldContent = item[column.key];
        let patientId = item['assignedId'];
        switch (column.key) {
            case 'phoneNumber':
                fieldContent = item['personalInfo']['phoneNumber'];
                return <span data-selection-disabled={ true } data-selection-invoke={ true }
                             className={AppointmentsApp}>{ fieldContent }</span>;
            case 'assignedId' :
                return <Link data-selection-invoke={ true }
                             onClick={ this._onItemInvoked.bind(this, event, item) }>{ patientId }</Link>;
            default:
                return <span data-selection-disabled={ true } className={AppointmentsApp} data-selection-invoke={ true }
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

    _onCalloutDismiss() {
        this.setState({
            appointmentsMenuVisible: false,
            appointmentsScreenTarget: null
        });
    }

    _onNewAppointment() {
        var baseServiceURL = ServiceURL["Production"]["BaseURL"]; 
        let _appointments = this.state.appointments;
        let appointmentAlreadyExists = false;
        for (let aptCounter = 0; aptCounter < _appointments.length && !appointmentAlreadyExists; aptCounter++) {
            let value = _appointments[aptCounter];
            if (value.assignedId === this.state.selectedItem.assignedId) {
                appointmentAlreadyExists = true;
            }
        }
        if (appointmentAlreadyExists) {
            this.setState({
                appointmentError: true,
                appointments: _appointments
            });
        } else {
            axios.post(baseServiceURL.concat("appointments/create"), JSON.stringify(this.state.selectedItem)).then(function () {
                _appointments.push(this.state.selectedItem);

                this.setState({
                    appointmentError: false,
                    appointments: _appointments
                });

            }.bind(this)).catch(function (err) {
                console.log(err);
                alert("An error occurred while saving the appointments");
            });
        }
    }

    _onEditDetails() {
        console.log(event, this.state.selectedItem);
        this.setState({
            patientDetailView: true
        });

    }

    _showAppointments() {
        this.setState({
            appointmentsMenuVisible: true
        });
    }

    _deleteAppointment(appointment) {
        var baseServiceURL = ServiceURL["Production"]["BaseURL"]; 
        axios.post(baseServiceURL.concat("appointments/delete"), JSON.stringify(appointment)).then(function () {

            let _appointments = this.state.appointments.filter(function (value, index) {
                return (value.assignedId !== appointment.assignedId);
            });
            this.setState({
                appointments: _appointments
            });


        }.bind(this)).catch(function (err) {
            console.log(err);
            alert("An error occurred while saving the appointments");
        });
    }

    _onViewHistory() {
        console.log(event, this.state.selectedItem);
    }

    _noop() {
        console.log("No operation invoked");
    }

    _dismissPatientDetailView() {
        this.setState({
            patientDetailView: false,
            addNewPatient: false
        })
    }

    _saveAllAppointments() {
        var appointments = this.state.appointments;
        var baseServiceURL = ServiceURL["Production"]["BaseURL"]; 
        axios.post(baseServiceURL.concat("appointments/create"), JSON.stringify(appointments)).then(function (response) {
            this.setState({
                appointments: [],
                appointmentsMenuVisible: false
            })
        }.bind(this)).catch(function (err) {
            console.log(err);
            alert("An error occurred while saving the appointments");
        })
    }

    _savePatientDetails(command) {
        var baseServiceURL = ServiceURL["Production"]["BaseURL"]; 
        var patientId, index;
        let actualDataRef = this.state.actualData;
        if(command === "EDIT"){
            patientId = this.state.selectedItem.assignedId;            
            index = actualDataRef.findIndex(function (obj) {
                return patientId === obj.assignedId;
            });
        } 
        if(command === "ADD"){
            patientId = "-9.99";            
        }

        let updatedData = {
            assignedId: patientId,
            firstName: this.refs.firstName.value,
            lastName: this.refs.lastName.value,
        };

        updatedData.personalInfo = {
            address: this.refs.address.value,
            phoneNumber: this.refs.phoneNumber.value,
            profession: this.refs.profession.value
        };

        axios.post(baseServiceURL.concat("updatePatientData"), JSON.stringify(updatedData)).then(function (response) {
            if(command === "EDIT"){
                actualDataRef[index].firstName = this.refs.firstName.value;
                actualDataRef[index].lastName = this.refs.lastName.value;
                actualDataRef[index].personalInfo.address = this.refs.address.value;
                actualDataRef[index].personalInfo.phoneNumber = this.refs.phoneNumber.value;
                actualDataRef[index].personalInfo.profession = this.refs.profession.value;

                this.setState({
                    displayData: actualDataRef,
                    patientDetailView: false,
                    actualData: actualDataRef
                });
            }
            if(command === "ADD"){
                this.getInitialData();
            }

        }.bind(this)).catch(function (err) {
            alert("An error occurred while saving the data");
            this.setState({
                patientDetailView: false
            });
        }.bind(this));

    }
    _showSettings(event){
        this.setState({
            settingsMenuVisible : true
        });
    }
    _onSettingsMenuDismiss(){   
        this.setState({
            settingsMenuVisible : false
        });             
    }
    _onNewPatient(){
        this.setState({
            addNewPatient: true
        })
    }
    _dismissAppointmentError(){
        this.setState({
            appointmentError: false
        });
    }
    renderAfterLoad() {
        let appointmentsMenuItems = [];
        let dateString = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');

        if (this.state.appointmentsMenuVisible) {
            appointmentsMenuItems = this.state.appointments.map(function (value) {
                let printName = value.firstName + (value.lastName === undefined ? "" : ", " + value.lastName);
                return (
                    <div key={value.assignedId} className='ms-CalloutExample-subText'>
                        <p className="notification-name-link">{value.assignedId} | {printName} </p>
                        <p className="notification-delete-link"><Link data-selection-invoke={ true }
                                                                      onClick={this._deleteAppointment.bind(this, value)}><i
                            className="ms-Icon ms-Icon--Delete" aria-hidden="true"/></Link></p>
                    </div>)
            }.bind(this));
        }
        return (<div className="ms-Grid">
            {
                (this.state.appointmentError) ?
                    <MessageBar messageBarType={ MessageBarType.blocked } onDismiss={this._dismissAppointmentError.bind(this)}
                                isMultiline={ false }>Appointment already exists for the patient</MessageBar>
                    :
                    (null)
            }
            <div className="ms-Grid-row" { ...css({
                backgroundColor: '#2488d8',
                boxShadow: '0 0 20px rgba(192, 192, 192, .3)',
                padding: 20
            }) }>
                <div className="ms-Grid-col ms-u-sm10 ms-u-md10 ms-u-lg10">
                        <span className="ms-font-su ms-fontColor-white">
                          Good Morning !
                        </span>
                    <br/>
                    <span className="ms-font-xs ms-fontColor-white">{ dateString }</span>
                </div>
                <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">                    
                    <br/>
                    <span className="ms-font-xxl ms-fontColor-white"
                          ref={ (settingsButton) => this._settingsButton = settingsButton }>
                          <Link data-selection-invoke={ true }
                                      onClick={this._showSettings.bind(this, event)}>
                                <i className="ms-Icon ms-Icon--Contact ms-fontColor-white" aria-hidden="true"></i>
                               {this.state.settingsMenuVisible ? 
                               <ContextualMenu
                                    target={ this._settingsButton }
                                    isBeakVisible={ true }
                                    gapSpace={ 2 }
                                    directionalHintFixed={ false }
                                    onDismiss={this._onSettingsMenuDismiss.bind(this)}
                                    items={
                                        [
                                            {
                                                key: 'newPatient',
                                                name: 'Add new patient',
                                                icon: 'Add',
                                                onClick: this._onNewPatient.bind(this)
                                            }                                            
                                        ]
                                    }
                                /> :
                                null}       
                          </Link>              
                    </span>
                    <span className="menu-spacing"/>
                    <span className="ms-font-xxl ms-fontColor-white"
                          ref={ (menuButton) => this._menuButtonElement = menuButton }>
                        {
                            (this.state.appointments.length > 0 ) ?
                                <Link data-selection-invoke={ true }
                                      onClick={this._showAppointments.bind(this, event)}>
                                    <i className="ms-Icon ms-Icon--Ringer ms-fontColor-white" aria-hidden="true"><span
                                        className="badge">{this.state.appointments.length}</span></i>
                                    {this.state.appointmentsMenuVisible ?
                                        <Callout className='ms-CalloutExample-callout' gapSpace={ 2 }
                                                 targetElement={ this._menuButtonElement }
                                                 onDismiss={ this._onCalloutDismiss.bind(this) }
                                                 setInitialFocus={ true }>
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
                                <i className="ms-Icon ms-Icon--Contact" aria-hidden="true"/>
                        }
                      </span>
                </div>
            </div>
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" { ...css({
                    paddingLeft: 20,
                    paddingTop: 20
                }) }>
                    <div>
                        <TextField label='Patient ID' onChanged={this._onFilterChanged.bind(this)}/>
                        <br/>
                        <div className="scrollDetailsList">
                            <DetailsList
                                items={ this.state.displayData }
                                setKey='set'
                                columns={ this.state.columns }
                                onRenderItemColumn={ this._renderItemColumn.bind(this) }
                                selectionMode={SelectionMode.single}/>
                        </div>
                    </div>
                </div>
            </div>
            {
                this.state.addNewPatient ?
                    <Dialog
                        isOpen={ true }
                        type={ DialogType.largeHeader  }
                        onDismiss={ this._dismissPatientDetailView.bind(this) }
                        title="Add new patient details"
                        isBlocking={ true }
                        containerClassName='ms-dialogMainOverride'>
                        <TextField label='First Name' ref="firstName" value={this.state.selectedItem.firstName}
                                   required={ true }/>
                        <TextField label='Last Name' ref="lastName" value={this.state.selectedItem.lastName}
                                   required={ true }/>
                        <TextField label='Phone number' ref="phoneNumber"
                                   value={this.state.selectedItem.personalInfo.phoneNumber} required={ true }/>
                        <TextField label='Address' ref="address" multiline autoAdjustHeight
                                   value={this.state.selectedItem.personalInfo.address} required={ true }/>
                        <TextField label='Profession' ref="profession"
                                   value={this.state.selectedItem.personalInfo.profession}/>

                        <DialogFooter>
                            <Button buttonType={ ButtonType.primary }
                                    onClick={ this._savePatientDetails.bind(this, "ADD") }>Save</Button>
                            <Button onClick={ this._dismissPatientDetailView.bind(this) }>Cancel</Button>
                        </DialogFooter>
                    </Dialog>
                    : (null)
            }            
            {
                this.state.patientDetailView ?
                    <Dialog
                        isOpen={ true }
                        type={ DialogType.largeHeader  }
                        onDismiss={ this._dismissPatientDetailView.bind(this) }
                        title={this.state.selectedItem.firstName}
                        isBlocking={ true }
                        containerClassName='ms-dialogMainOverride'>
                        <TextField label='First Name' ref="firstName" value={this.state.selectedItem.firstName}
                                   required={ true }/>
                        <TextField label='Last Name' ref="lastName" value={this.state.selectedItem.lastName}
                                   required={ true }/>
                        <TextField label='Phone number' ref="phoneNumber"
                                   value={this.state.selectedItem.personalInfo.phoneNumber} required={ true }/>
                        <TextField label='Address' ref="address" multiline autoAdjustHeight
                                   value={this.state.selectedItem.personalInfo.address} required={ true }/>
                        <TextField label='Profession' ref="profession"
                                   value={this.state.selectedItem.personalInfo.profession}/>

                        <DialogFooter>
                            <Button buttonType={ ButtonType.primary }
                                    onClick={ this._savePatientDetails.bind(this, "EDIT") }>Save</Button>
                            <Button onClick={ this._dismissPatientDetailView.bind(this) }>Cancel</Button>
                        </DialogFooter>
                    </Dialog>
                    : (null)
            }
            {this.state.isContextMenuVisible ? 
                <ContextualMenu
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
        </div>)

    }

    render() {
        return (
            (this.state.loadingPatientData) ?
                (<Spinner className="html-center-align" type={ SpinnerSize.large }
                          label='Loading... Patient data'/>) :
                (this.renderAfterLoad())
        )
    }
}

export default AppointmentsApp;
