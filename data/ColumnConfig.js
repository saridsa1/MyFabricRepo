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
module.exports = columns;