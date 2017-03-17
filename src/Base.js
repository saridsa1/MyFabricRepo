import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './App.css';
import ServiceURL from '../data/ServiceURL.json';
import _columns from '../data/AppointmentsColumnConfig';
import SweetAlert from 'react-swal';
import {css} from 'glamor';
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
import TestData from '../data/TestData.json';

/**
 * TODO:
 * 1. Once visit details are added we need to remove them from the list of appointments
 * 2.
 */
class Visits extends Component {
    constructor(props) {
        super(props);
        this.resetState();
        axios.defaults.headers.post['Content-Type'] = 'application/json';        
    }

    resetState(){
        this.state = {
            isContextMenuVisible: false,
            columns: _columns,
            appointments: [],
            actualDataRef : [],
            patientDetailView: false,
            loadingAppointmentsData: true,
            screenTarget: null,
            item: null,
            appointmentsMenuVisible: false,
            appointmentsScreenTarget: null,
            settingsMenuVisible: false,
            addNewPatient: false
        };
    }

    _showSettings(event){
        this.setState({
            settingsMenuVisible : true
        });
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
    componentDidMount() {
        this.setState({
            appointments: TestData,
            actualDataRef: TestData,
            loadingAppointmentsData: false
        });
    }

    _noop() {
        console.log("No operation invoked");
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
    _onItemInvoked(event, item) {
        this.setState({
            screenTarget: event.target,
            isContextMenuVisible: true,
            selectedItem: item
        })
    }

    _renderItemColumn(item, index, column) {
        let fieldContent = item[column.key];
        let patientId = item['assignedId'];
        switch (column.key) {
            case 'assignedId' :
                return <Link data-selection-invoke={ true }
                             onClick={ this._onItemInvoked.bind(this, event, item) }>{ patientId }</Link>;
            default:
                return <span data-selection-disabled={ true } data-selection-invoke={ true }
                             style={ {color: fieldContent} }>{ fieldContent }</span>;
        }
    }

    _onContextMenuDismiss() {
        this.setState({
            isContextMenuVisible: false,
            screenTarget: null,
            item: null
        });
    }
    _onSettingsMenuDismiss(){   
        this.setState({
            settingsMenuVisible : false
        });             
    }
    _onNewVisit(){
        this.setState({
            newAppointmentVisible: true
        })
    }
    _saveVisitDetails(){
        var assignedId = this.state.selectedItem.assignedId;
        var filteredData = this.state.appointments.filter(function(input, index){
            return assignedId !== input.assignedId;
        });
        /**
         * 1. Make and AJAX call to the server to remove the record from visitsByDate 
         * 2. Add visit details to visitsByPatient 
         */
        var reason = this.refs.visitReason.value;
        var prescription = this.refs.prescription.value;

        var payload = {
            assignedId : assignedId,
            visitReason: reason,
            prescription: prescription,            
        }
        this.setState({
            appointments: filteredData,
            newAppointmentVisible: false
        })
        console.log(JSON.stringify(payload));
    }
    _dismissAppointmentDialog(){
        this.setState({
            newAppointmentVisible: false
        })
    }
    _onEditDetails(){
        console.log("New visit clicked");
    }
    _onViewHistory(){
        console.log("New visit clicked");
    }
    _renderAfterLoad(){
        let dateString = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
        let visitDialogHeader = "";
        if(this.state.newAppointmentVisible)
            visitDialogHeader = "Add visit details for "+ this.state.selectedItem.firstName;
        return (
            <div className="ms-Grid">
                <div className="ms-Grid-row" { ...css({
                    backgroundColor: '#2488d8',
                    boxShadow: '0 0 20px rgba(192, 192, 192, .3)',
                    padding: 20
                }) }>
                    <div className="ms-Grid-col ms-u-sm11 ms-u-md11 ms-u-lg11">
                            <span className="ms-font-su ms-fontColor-white">
                            Good Evening !
                            </span>
                        <br/>
                        <span className="ms-font-xs ms-fontColor-white">{ dateString }</span>
                    </div>
                    <div className="ms-Grid-col ms-u-sm1 ms-u-md1 ms-u-lg1">                    
                        <br/>
                        <span className="ms-font-xxl ms-fontColor-white pull-right"
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
                                    items={ this.state.appointments }
                                    setKey='set'
                                    columns={ this.state.columns }
                                    onRenderItemColumn={ this._renderItemColumn.bind(this) }
                                    selectionMode={SelectionMode.single}/>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.newAppointmentVisible ?
                       <Dialog
                            isOpen={ true }
                            type={ DialogType.largeHeader  }
                            onDismiss={ this._dismissAppointmentDialog.bind(this) }
                            title={visitDialogHeader}
                            isBlocking={ true }
                            containerClassName='ms-dialogMainOverride'>
                            <TextField label='Reason for visit' ref="visitReason" multiline autoAdjustHeight
                                    value="" required={ true }/>
                            <TextField label='Prescription' ref="prescription" multiline autoAdjustHeight
                                    value="" required={ true }/>            
                            <DialogFooter>
                                <Button buttonType={ ButtonType.primary }
                                        onClick={ this._saveVisitDetails.bind(this) }>Save</Button>
                                <Button onClick={ this._dismissAppointmentDialog.bind(this) }>Cancel</Button>
                            </DialogFooter>
                        </Dialog>
                    :
                    (null)
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
                {
                    this.state.addNewPatient ?
                        <Dialog
                            isOpen={ true }
                            type={ DialogType.largeHeader  }
                            onDismiss={ this._dismissPatientDetailView.bind(this) }
                            title="Add new patient details"
                            isBlocking={ true }
                            containerClassName='ms-dialogMainOverride'>
                            <TextField label='First Name' ref="firstName" value="" required={ true }/>
                            <TextField label='Last Name' ref="lastName" value="" required={ true }/>
                            <TextField label='Phone number' ref="phoneNumber" value="" required={ true }/>
                            <TextField label='Address' ref="address" multiline autoAdjustHeight value="" required={ true }/>
                            <TextField label='Profession' ref="profession" value=""/>

                            <DialogFooter>
                                <Button buttonType={ ButtonType.primary }
                                        onClick={ this._savePatientDetails.bind(this, "ADD") }>Save</Button>
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
                                    key: 'addVisit',
                                    name: 'Add visit details',
                                    icon: 'Add',
                                    onClick: this._onNewVisit.bind(this)
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
                    /> 
                    : (null)
                }           
            </div>
        )        
    }

    render() {
        return (
            (this.state.loadingAppointmentsData) ?
                (<Spinner className="html-center-align" type={ SpinnerSize.large }
                          label='Loading... appointments'/>) :
                (this._renderAfterLoad())
        )
    }

}

export default Visits;