import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import data from '../data/TestData.json';

import { css } from 'glamor';
import { Image, ImageFit} from 'office-ui-fabric-react/lib/Image';
import { DetailsList, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ContextualMenu, DirectionalHint } from  'office-ui-fabric-react/lib/ContextualMenu'
import { Link } from 'office-ui-fabric-react/lib/Link'

class App extends Component {
  constructor(props) {
    super(props);
    var _items = data;
    this.state = {
      isContextMenuVisible: false,
      displayData : _items,
      actualData  : _items,
      columns: this._buildColumns()
    }
    this._selection = new Selection({ onSelectionChanged: this._onSelectionChanged });
  }
  _onSelectionChanged() {
    this.setState({
      selectedData: menuItem.data
    });
  }
  _buildColumns() {
    var columns = [];
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
      return <span data-selection-disabled={ true } data-selection-invoke={ true } className={App} >{ fieldContent }</span>;
    case 'assignedId' :
      return <Link data-selection-invoke={ true } onClick={ this._onItemInvoked.bind(this) }>{ patientId }</Link>;
    default:
      return <span data-selection-disabled={ true } className={App} data-selection-invoke={ true } style={ { color: fieldContent } }>{ fieldContent }</span>;
  }
 }
_onColumnClick(column) {
  console.log("Column clicked ", column);
}
_onItemInvoked(event){
    console.log("Item invoked ", event.target);
    this.setState({
      screenTarget: event.target,
      isContextMenuVisible: true
    })   
}
_onColumnHeaderContextMenu(column, event){
  console.log("Column header context menu", column);
}
_onFilterChanged(text){
  var actualDataRef = this.state.actualData;
  var filteredData = actualDataRef.filter(function(obj, index){
    return obj.assignedId.toString().indexOf(text) > -1;
  });

  this.setState({
      displayData : filteredData,
      actualData  : actualDataRef,
      columns: this._buildColumns()
  })
}
_onContextMenuDismiss() {
  this.setState({
      isContextMenuVisible: false
  });
}
_onContextMenuItemClicked(input){
  console.log(input);
}
render() {
    return (      
      <div className="ms-Grid">
        <div className="ms-Grid-row" { ...css({ backgroundColor: '#FAFAFA', boxShadow: '0 0 20px rgba(192, 192, 192, .3)', padding: 20 }) }>
          <div className="ms-Grid-col ms-u-sm9 ms-u-md9 ms-u-lg9">
            <span className="ms-font-su ms-fontColor-blue">
              Codeaholics: Office UI Fabric demo
            </span>
          </div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12" { ...css({ paddingLeft: 20, paddingTop: 20 }) }>            
            <div>              
              <TextField label='Patient ID' onChanged={this._onFilterChanged.bind(this)} />
              <br/>
              <MarqueeSelection selection={ this._selection }>
                <DetailsList
                      items={ this.state.displayData }
                      setKey='set'
                      columns={ this.state.columns }
                      onRenderItemColumn={ this._renderItemColumn.bind(this) }
                      onColumnHeaderClick={ this._onColumnClick.bind(this) }
                      onColumnHeaderContextMenu={ this._onColumnHeaderContextMenu.bind(this) } />
               </MarqueeSelection>     
            </div>
          </div>
        </div>
        {this.state.isContextMenuVisible ? <ContextualMenu
            target = { this.state.screenTarget }            
            isBeakVisible={ true }
            gapSpace={ 10 }
            directionalHintFixed={ true }
            onDismiss = {this._onContextMenuDismiss.bind(this)}            
            onClick = {this._onContextMenuItemClicked(this)}
            items={
              [
                {
                  key: 'newAppointment',
                  name: 'New Appointment',
                  icon: 'Add'
                },                
                {
                  key: 'editDetails',
                  name: 'Edit details',
                  icon: 'Edit',
                }
              ]
            }
      /> : (null)}
      </div>
      
    );
  }
}

export default App;
