// DOM for excel file varibale
const excel_file = document.getElementById('excel_file');
// result variable
const result = document.getElementById('excel_data');

// for error
var flag = 0;

// pass mark
var passMark = 50;

// minimum subjects to pass
var minimumSubjectsToPass = 0;


// start processing Input file
function processFile() {
    result.innerHTML = '';
    flag = 0;
    hideActionBtns();

    // If file is not an excel throws error
    try {
        console.log(excel_file.files[0].type)
        readExcelFile(checkExcelOrNot());
    } catch (e) {
        document.getElementById("result_table_div").style.display = 'none';
        if (flag == 0)
            result.innerHTML = '<div class="alert alert-danger">No file choosen</div>';
        else
            result.innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';

        // If  error page will refresh by 2 seconds
        setTimeout(() => {
            goToHome();
        }, 2000);
    }
}


// file type checker
function checkExcelOrNot() {
    // this will give you input file type
    //console.log(excel_file.files[0].type);
    flag = 1;

    if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ].includes(excel_file.files[0].type)) {

        excel_file.value = '';

        return false;
    }
    return true;
}


// set range function
function setRange() {
    document.getElementById('rangeValue').innerHTML = document.getElementById("rangeInput").value;
    passMark = document.getElementById("rangeInput").value;
}

// goto Home
function goToHome() {
    location.reload();
}


// Employee class
class Employee {
    employeeId;
    employeeName;
    employeeMarks;
    employeePass;
    employeeFail;

    // Constructor
    constructor(employeeId, employeeName, employeeMarks, employeePass, employeeFail) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeMarks = employeeMarks;
        this.employeePass = employeePass;
        this.employeeFail = employeeFail;
    }
}

// Excel all heading
var headingsArray = [];
// Employee objects array
var employeeArray = [];


// reading Excel file
function readExcelFile() {

    // minimum criteria
    minimumSubjectsToPass = window.prompt("Minimum no of subjects to pass the test:");

    // file reader to read our file
    var reader = new FileReader();

    // reading entire excel file
    reader.readAsArrayBuffer(excel_file.files[0]);

    // after reading full file invoking an anonymous function
    reader.onload = function(event) {

        // Reading Excel cells which have some data
        var data = new Uint8Array(reader.result);

        // taking the result as array type
        var work_book = XLSX.read(data, { type: 'array' });

        //Excel sheet name
        var sheet_name = work_book.SheetNames;

        // Based on sheet name reading the data present in sheet into json array format
        var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 });

        // If sheet has sufficient data
        if (sheet_data.length > 0) {
            // Rows loop
            // Note: row zero contains headings and remaining rows containg data
            for (var row = 0; row < sheet_data.length; row++) {
                // Columns loop
                if (row == 0) {
                    // loop for 1st columns i.e for fields/headings
                    for (var cell = 0; cell < sheet_data[row].length; cell++) {
                        headingsArray.push(sheet_data[row][cell]);
                    }

                } else {
                    var id = "";
                    var name = "";
                    var marks = [];
                    var pass = 0;
                    var fail = 0;
                    // loop for otherthan 1st columns i.e for data
                    // Note: we are reading the data in the cells whose files are specified
                    // thatswhy we are iterating below loop for 1st row times
                    for (var cell = 0; cell < sheet_data[0].length; cell++) {
                        if (cell == 0)
                            id = sheet_data[row][cell];
                        else if (cell == 1)
                            name = sheet_data[row][cell];
                        else {
                            marks.push(sheet_data[row][cell]);
                            if (sheet_data[row][cell] >= passMark) {
                                pass = pass + 1;
                            } else {
                                fail = fail + 1;
                            }
                        }
                    }
                    var obj = new Employee(id, name, marks, pass, fail);
                    employeeArray.push(obj);
                }
            }
            //How all data processed from excel
            show();
        }
        excel_file.value = '';
    }
}


// result from excel array is stored in this array
var reportArray = [];

function show() {
    noOfSubjects();
    noOfStudentsAttended();
    noOfStudentsPassedTheExam();
    noOfStudentsFailedTheExam();
    showPassMark();
    showMinimumPassMark();
    noOfStudentsPaseedIndividulaSubjects();
    passPercentage();
    failPercentage();
    showActionBtns();
    prepareResultTable();

}


function noOfSubjects() {
    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `<p class="key">No of subjects in the test</p><p class="value">${headingsArray.length-2}</p>`;
    result.appendChild(div);
    reportArray.push(headingsArray.length - 2);
}


function noOfStudentsAttended() {
    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `<p class="key">No of students attended the test</p><p class="value">${employeeArray.length}</p>`;
    result.appendChild(div);
    reportArray.push(employeeArray.length);
}


function noOfStudentsPassedTheExam() {
    var count = 0;
    for (var i = 0; i < employeeArray.length; i++) {
        if (employeeArray[i].employeeFail == 0 || employeeArray[i].employeePass >= minimumSubjectsToPass)
            count++;
    }

    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `<p class="key">No of students passed in the test</p><p class="value">${count}</p>`;
    result.appendChild(div);
    reportArray.push(count);
}

function noOfStudentsFailedTheExam() {
    var count = 0;
    for (var i = 0; i < employeeArray.length; i++) {
        if (employeeArray[i].employeeFail != 0 && employeeArray[i].employeePass < minimumSubjectsToPass)
            count++;
    }

    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `<p class="key">No of students failed in the test</p><p class="value">${count}</p>`;
    result.appendChild(div);
    reportArray.push(count);

}

function showPassMark() {
    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `<p class="key">Pass mark for the test</p><p class="value">${passMark}</p>`;
    result.appendChild(div);
    reportArray.push(passMark);
}

function showMinimumPassMark() {
    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `<p class="key">Minimum subject to pass</p><p class="value">${minimumSubjectsToPass}</p>`;
    result.appendChild(div);
    reportArray.push(minimumSubjectsToPass);
}

function noOfStudentsPaseedIndividulaSubjects() {
    for (var i = 1; i <= headingsArray.length - 2; i++) {
        var count = 0;
        for (var j = 0; j < employeeArray.length; j++) {
            var obj = employeeArray[j];

            if (obj.employeePass == i)
                count++;
        }
        const div = document.createElement('div');
        div.className = 'box';
        div.innerHTML = `<p class="key">Students passed only ${i} subject</p><p class="value">${count}</p>`;
        result.appendChild(div);
        reportArray.push(count);
    }
}

function passPercentage() {
    var count = 0;
    for (var i = 0; i < employeeArray.length; i++) {
        if (employeeArray[i].employeeFail == 0 || employeeArray[i].employeePass >= minimumSubjectsToPass)
            count++;
    }
    var res = (count / employeeArray.length) * 100;
    res = res.toFixed(2);

    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `<p class="key">Overall pass percentage</p><p class="value">${res}%</p>`;
    result.appendChild(div);
    reportArray.push(res);
}

function failPercentage() {
    var count = 0;
    for (var i = 0; i < employeeArray.length; i++) {
        if (employeeArray[i].employeeFail != 0 && employeeArray[i].employeePass < minimumSubjectsToPass)
            count++;
    }
    var res = (count / employeeArray.length) * 100;
    res = res.toFixed(2);

    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `<p class="key">Overall fail percentage</p><p class="value">${res}%</p>`;
    result.appendChild(div);
    reportArray.push(res);
}


// Display show table and genarate excel btns
// Hide file input and process btn
function showActionBtns() {
    document.getElementById("action_btn1").style.display = 'block';
    document.getElementById("action_btn2").style.display = 'block';
    document.getElementById("slider_Area").style.display = 'none';
    document.querySelectorAll(".input_btns").forEach(a => a.style.display = "none");
}

// Hide show table and genarate excel btns
// Display file input and process btn
function hideActionBtns() {
    document.getElementById("action_btn1").style.display = 'none';
    document.getElementById("action_btn2").style.display = 'none';
    document.getElementById("slider_Area").style.display = 'flex';
    // document.querySelectorAll(".input_btns").forEach(a => a.style.display = "block");
}


function showResultTable() {
    document.getElementById("result_table_div").style.display = 'block';

}

function prepareResultTable() {


    // Tble start
    var tableStart = `<table class="table table-hover" id="result_table">`;

    // table Headings
    var tableHeadings = `<tr>`;
    for (var i = 0; i < headingsArray.length; i++) {
        tableHeadings = tableHeadings + `<th>${headingsArray[i]}</th>`;
    }
    // status (Pass/Fail)
    tableHeadings = tableHeadings + `<th>Status</th>`;
    // Percentage
    tableHeadings = tableHeadings + `<th>Percentage</th>`;
    // Grade
    tableHeadings = tableHeadings + `<th>Grade</th>`;
    // No of subjects passed
    tableHeadings = tableHeadings + `<th>Subjects Passed</th>`;
    // No of subjects failed
    tableHeadings = tableHeadings + `<th>Subjects Failed</th>`;

    tableHeadings = tableHeadings + `</tr>`;


    // table rows
    var tableRows = ``;
    for (var i = 0; i < employeeArray.length; i++) {
        var obj = employeeArray[i];

        var temp = ``;
        if (obj.employeeFail == 0) {
            temp = temp + `<tr class="passRow">`;
        } else if (obj.employeePass >= minimumSubjectsToPass) {
            temp = temp + `<tr class="partiallyPass">`;
        } else {
            temp = temp + `<tr class="failRow">`;
        }



        for (var j = 0; j < headingsArray.length; j++) {

            if (j == 0) {
                temp = temp + `<td>${obj.employeeId}</td>`;
            } else if (j == 1) {
                temp = temp + `<td>${obj.employeeName}</td>`;
            } else {
                temp = temp + `<td>${obj.employeeMarks[j-2]}</td>`;
            }
        }

        // status (Pass/Fail)
        if (obj.employeeFail == 0) {
            temp = temp + `<td>Pass</td>`;
        } else if (obj.employeePass >= minimumSubjectsToPass) {
            temp = temp + `<td>Partially pass</td>`;
        } else {
            temp = temp + `<td>Fail</td>`;
        }

        // Percentage
        var percentageOfMarks = calculatePercentage(obj.employeeMarks);
        temp = temp + `<td>${percentageOfMarks}</td>`;

        // Grade
        if (obj.employeeFail == 0) {
            temp = temp + `<td>${calculateGrade(percentageOfMarks)}</td>`;
        } else if (obj.employeeFail != 0 && obj.employeePass >= minimumSubjectsToPass) {
            temp = temp + `<td>${calculateGrade(percentageOfMarks)}</td>`;
        } else {
            temp = temp + `<td>F</td>`;
        }

        // No of subjects passed
        temp = temp + `<td>${obj.employeePass}</td>`;
        // No of subjects failed
        temp = temp + `<td>${obj.employeeFail}</td>`;


        temp = temp + `</tr>`;
        tableRows = tableRows + temp;
    }

    // Final result Content
    tableRows = tableRows + `<tr></tr>`; // empty row

    for (var i = 0; i < reportArray.length; i++) {

        // no of subject in the exam
        // no of students attended
        // no of students passed
        // no of students failed
        // pass mark for the test
        // minimum subjects to pass

        if (i == 0) {
            tableRows = tableRows + `<tr class="reportRow"><th></th><th>No of subjects in exam</th><th>${reportArray[i]}</th></tr>`;
        } else if (i == 1) {
            tableRows = tableRows + `<tr class="reportRow"><th></th><th>No of Students attended</th><th>${reportArray[i]}</th></tr>`;
        } else if (i == 2) {
            tableRows = tableRows + `<tr class="reportRow"><th></th><th>No of students passed</th><th>${reportArray[i]}</th></tr>`;
        } else if (i == 3) {
            tableRows = tableRows + `<tr class="reportRow"><th></th><th>No of students failed</th><th>${reportArray[i]}</th></tr>`;
        } else if (i == 4) {
            tableRows = tableRows + `<tr class="reportRow"><th></th><th>Pass mark</th><th>${reportArray[i]}</th></tr>`;
        } else if (i == 5) {
            tableRows = tableRows + `<tr class="reportRow"><th></th><th>Minimum Subjects to pass</th><th>${reportArray[i]}</th></tr>`;
        } else if (i > 5 && i < reportArray.length - 2) {
            tableRows = tableRows + `<tr class="reportRow"><th></th><th>No of students passed only ${i-3} subject </th><th>${reportArray[i]}</th></tr>`;
        } else if (i == reportArray.length - 2) {
            tableRows = tableRows + `<tr class="reportRow"><th></th><th>Overall Pass percentage</th><th>${reportArray[i]}</th></tr>`;
        } else if (i == reportArray.length - 1) {
            tableRows = tableRows + `<tr class="reportRow"><th></th><th>Overall Fail percentage</th><th>${reportArray[i]}</th></tr>`;
        }

    }

    // table end
    var tableEnd = `</table>`;
    document.getElementById("result_table_div").innerHTML = tableStart + tableHeadings + tableRows + tableEnd;
}


function calculatePercentage(marksList) {
    var m = 0;
    for (var i = 0; i < marksList.length; i++) {
        m = m + marksList[i];
    }

    var p = (m / (marksList.length * 100)) * 100;
    p = p.toFixed(2);
    return p;

}

function calculateGrade(percentageOfMarks) {

    if (percentageOfMarks < passMark)
        return "F";
    else if (percentageOfMarks > 90)
        return "O";
    else if (percentageOfMarks > 80)
        return "S";
    else if (percentageOfMarks > 70)
        return "A";
    else if (percentageOfMarks > 50)
        return "B";
    else if (percentageOfMarks > 40)
        return "C";
    else
        return "D";
}


function generateExcelFile() {

    function html_table_to_excel(type) {
        var data = document.getElementById('result_table');

        var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });

        XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });

        XLSX.writeFile(file, 'Exco Result.' + type);

        //document.getElementsByClassName('reportRow').style.display = 'none';
        document.querySelectorAll(".reportRow").forEach(a => a.style.display = "none");
    }
    console.log(document.getElementsByClassName('reportRow'));

    //document.getElementsByClassName('reportRow').style.display = 'block';
    document.querySelectorAll(".reportRow").forEach(a => a.style.display = "block");
    html_table_to_excel('xlsx');

}