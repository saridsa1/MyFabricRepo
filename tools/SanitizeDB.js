/**
 * Created by satyasumansaridae on 3/10/17.
 */
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./homeo-907d3-export.json', 'utf8'));

var imagesPatientMap = data.map(function (value) {
    if (value.displayImage) {
        return {
            assignedId: value.assignedId,
            displayImage: value.displayImage
        }
    } else if (value.personalInfo.displayImage) {
        return {
            assignedId: value.assignedId,
            displayImage: value.displayImage
        }
    }
});

var patientInfo = {};
data.map(function (value) {
    var personalInfo = {
        address: "",
        phoneNumber: "",
        profession: "",
        age: ""
    };
    if (value.personalInfo) {
        var address = (value.personalInfo.address != undefined) ? value.personalInfo.address : "";
        var phoneNumber = (value.personalInfo.phoneNumber != undefined) ? value.personalInfo.phoneNumber : "";
        var profession = (value.personalInfo.profession != undefined) ? value.personalInfo.profession : "";
        var age = (value.personalInfo.age != undefined) ? value.personalInfo.age : "";

        personalInfo = {
            address: address,
            phoneNumber: phoneNumber,
            profession: profession,
            age: age
        }
    }
    patientInfo[value.assignedId] = {
        assignedId: value.assignedId,
        createdDate: value.createdDate,
        firstName: value.firstName,
        lastName: value.lastName,
        personalInfo: personalInfo
    };
    return "";
});

var seperatedData = {
    PatientInfo: patientInfo,
    PatientImages: imagesPatientMap
};

fs.writeFile("./PatientData.json", JSON.stringify(seperatedData), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

