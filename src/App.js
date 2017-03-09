import React, {Component} from 'react';
import './App.css';
import data from '../data/TestData.json';

import {css} from 'glamor';
import {DetailsList} from 'office-ui-fabric-react/lib/DetailsList';
import {SelectionMode} from 'office-ui-fabric-react/lib/Selection';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {ContextualMenu} from  'office-ui-fabric-react/lib/ContextualMenu'
import {Link} from 'office-ui-fabric-react/lib/Link'

class App extends Component {
    constructor(props) {
        super(props);
        let _items = data;
        this.state = {
            isContextMenuVisible: false,
            displayData: _items,
            actualData: _items,
            columns: this._buildColumns()
        };
    }

    _buildColumns() {
        let columns = [];
        columns.push({
            key: "assignedId",
            name: "Patient ID",
            headerClassName: "ms-font-l ms-fontColor-blue text-align-left",
            minWidth: 100,
            maxWidth: 120,
            isCollapsable: false,
            isRowHeader: true,
            isResizable: true
        });
        columns.push({
            key: "firstName",
            name: "First Name",
            headerClassName: "ms-font-l v text-align-left",
            minWidth: 100,
            maxWidth: 200,
            isCollapsable: false,
            isRowHeader: true,
            isResizable: true
        });
        columns.push({
            key: "lastName",
            name: "Last Name",
            headerClassName: "ms-font-l ms-fontColor-blue text-align-left",
            minWidth: 100,
            maxWidth: 150,
            isCollapsable: false,
            isRowHeader: true,
            isResizable: true
        });
        columns.push({
            key: "phoneNumber",
            name: "Phone Number",
            headerClassName: "ms-font-l ms-fontColor-blue text-align-left",
            minWidth: 100,
            maxWidth: 130,
            isCollapsable: false,
            isRowHeader: true,
            isResizable: true
        });
        return columns;
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
            columns: this._buildColumns()
        })
    }

    _onContextMenuDismiss() {
        this.setState({
            isContextMenuVisible: false,
            item: null
        });
    }

    _onNewAppointment() {
        console.log(event, this.state.selectedItem);
    }

    _onEditDetails() {
        console.log(event, this.state.selectedItem);
    }

    _onViewHistory() {
        console.log(event, this.state.selectedItem);
    }

    render() {
        return (
            <div className="ms-Grid">
                <div className="ms-Grid-row" { ...css({
                    backgroundColor: '#FAFAFA',
                    boxShadow: '0 0 20px rgba(192, 192, 192, .3)',
                    padding: 20
                }) }>
                    <div className="ms-Grid-col ms-u-sm9 ms-u-md9 ms-u-lg9">
            <span className="ms-font-su ms-fontColor-blue">
              Codeaholics: Office UI Fabric demo
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
