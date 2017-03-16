import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './App.css';
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

class Vists extends Component {
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

    componentDidMount() {
    }

    _noop() {
        console.log("No operation invoked");
    }

    _renderItemColumn(item, index, column) {
        let fieldContent = item[column.key];
        let patientId = item['assignedId'];
        switch (column.key) {
            case 'assignedId' :
                return <Link data-selection-invoke={ true }
                             onClick={ this._onItemInvoked.bind(this, event, item) }>{ patientId }</Link>;
            default:
                return <span data-selection-disabled={ true } className={AppointmentsApp} data-selection-invoke={ true }
                             style={ {color: fieldContent} }>{ fieldContent }</span>;
        }
    }
   
    render() {
        return (
            <div className="ms-Grid">
                <div className="ms-Grid-row" { ...css({
                    backgroundColor: '#2488d8',
                    boxShadow: '0 0 20px rgba(192, 192, 192, .3)',
                    padding: 20
                }) }>
                    <div className="ms-Grid-col ms-u-sm10 ms-u-md10 ms-u-lg10">
                            <span className="ms-font-su ms-fontColor-white">
                            Good Evening !
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
                                    <i className="ms-Icon ms-Icon--Settings ms-fontColor-white" aria-hidden="true"></i>
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

}

export default Vists;
