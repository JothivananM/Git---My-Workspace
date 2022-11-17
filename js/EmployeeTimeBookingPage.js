let employeeTimesheetDetails = [];
let calendarEvents = [];
let eventDetails = [];
let filteredTimesheetDetails = [];
let availableTasks = [];
let availableProjects = [];
let availableActivities = [];
let availableSchools = [];
let empID = "E01", 
    empUUID = "fa163ed8-c0b4-1edd-91ab-e9359ca4d9b",
    empItemUUID = "fa163ed8-c0b4-1edd-91ab-e9359ca4d9bb";
let cardDate;

function displayTimesheet() {
    $('.select2bs4').select2({
                closeOnSelect:true,
                theme: 'bootstrap4'
        });
    $.ajax({
        type: "GET",
        url: "https://r9mjde4m5j.execute-api.eu-central-1.amazonaws.com/mock/employeebookedlist?fromdate=Enter the Fromdate&todate=Enter the Todate&employeeId=Enter the EmployeeId",
        async:false,
        dataType: "json",
        success: function(successdata) {
           employeeTimesheetDetails = successdata.body.EmployeeBookedList;
           employeeTimesheetDetails.forEach(element => {
            filteredTimesheetDetails = element.Details;
           });
           
           availableTasks = filteredTimesheetDetails.map(element => element.TaskName);
           availableProjects = filteredTimesheetDetails.map(element => element.ProjectName);
           availableActivities = filteredTimesheetDetails.map(element => element.ActivityName);
           availableSchools = filteredTimesheetDetails.map(element => element.SchoolDescription);

           bindTasks(filteredTimesheetDetails);
           bindProjects(filteredTimesheetDetails);
           bindSchools(filteredTimesheetDetails);

           calendarEvents = employeeTimesheetDetails.map(({Details, ...rest}) => {return rest});
            let j=0;
            for (let i=0; i<calendarEvents.length; i++) {
                   
                
                eventDetails[j] = {
                    start: calendarEvents[i].Date,
                    title: calendarEvents[i].ActiveHrs,
                    description: 'description for All Day Event',
                    color : "white",
                    textColor: "blue",
                };
                j=j+1;
                eventDetails[j] = {
                    start: calendarEvents[i].Date,
                    title: calendarEvents[i].ConfirmedHrs,
                    description: 'description for All Day Event',
                    color : "white",
                    textColor : "green"
                };
                j=j+1;
                eventDetails[j] = {
                    start: calendarEvents[i].Date,
                    title: calendarEvents[i].RejectedHrs,
                    description: 'description for All Day Event',
                    color : "white",
                    textColor : "red"
                }
                j=j+1;
            }
                      
            initCalender();
          
        },
        error: function (error) {
            alert('error'+error);
        }
    });
      $( "#select-task" ).autocomplete({
        source: availableTasks
      });
      $( "#select-project" ).autocomplete({
        source: availableProjects
      });
      $( ".selectActivity" ).autocomplete({
        source: availableActivities
      });
         
}

function displayTable (displayRecords) {
   
    let tr;
    $('#emp-body').html('');
  
    $.each(
      displayRecords,
      function (i, l) {
        tr = $('<tr/>');
        
        tr.append('<td><input id="select-activity" class="form-control"></td>')
  
       
        tr.append('<td><div class="ui-widget"><label for="tags">Tags: </label><input id="tags"></div></td>');
  
       
        $('#emp-body').append(tr);
      });
}

function bindTasks(params) {
    $.each(params, function (index, value) {
        $('#select-task').append('<option value="' + value.TaskID + '">' + value.TaskName + '</option>');
      }); 
}

function bindProjects(params) {
    $.each(params, function (index, value) {
        $('#select-project').append('<option value="' + value.ProjectID + '">' + value.ProjectName + '</option>');
      }); 
}

function bindSchools(params) {
    $.each(params, function (index, value) {
        $('#select-school').append('<option value="' + value.SchoolID + '">' + value.SchoolDescription + '</option>');
      }); 
}

function filterByTask () {
    var selectedProjectTask = $("#select-task").children("option:selected").text();
    if (selectedProjectTask == "") {
        alert();
        $('#select-project').find('option').remove().end().append('<option value="" selected>All</option>');
        filteredTimesheetDetails.forEach((element) => {
            $('#select-project').append('<option value="' + value.ProjectID + '">' + value.ProjectName + '</option>');
        });
    }
    else {
        let data = filteredTimesheetDetails.filter(
            (task) => task.TaskName === selectedProjectTask
        );
        
        $('#select-project').find('option').remove().end();
        $.each(data, function (index, value) {
            $('#hours').text(value.Hours);
            $('#desc').text(value.Description);
            $('#status').text(value.Status);
            $('#select-project').append('<option value="' + value.ProjectID + '">' + value.ProjectName + '</option>');
        });
    }
}

function filterByProject () {
    var selectedProjectTask = $("#select-project").children("option:selected").text();
    if (selectedProjectTask == "") {
        $('#select-task').find('option').remove().end().append('<option value="" selected>All</option>');
        filteredTimesheetDetails.forEach((element) => {
            $('#select-task').append('<option value="' + value.TaskID + '">' + value.TaskName + '</option>');
        });
    }
    else {
        let data = filteredTimesheetDetails.filter(
            (project) => project.ProjectName === selectedProjectTask
        );
        $('#select-task').find('option').remove().end();
        $.each(data, function (index, value) {
            $('#select-task').append('<option value="' + value.TaskID + '">' + value.TaskName + '</option>');
        });
    }
}

function saveTimesheet() {
    let details =  {
            
                        "EmployeeID": empID,
                        "Date": "2022-11-12",
                        "Details": [
                            {
                                "EmployeeTimeUUID": empUUID,
                                "EmployeeItemUUID": empItemUUID,
                                "TaskID": $('#select-task').find(":selected").val(),
                                "TaskName": $('#select-task').find(":selected").text(),
                                "ProjectID": $('#select-project').find(":selected").val(),
                                "ProjectName": $('#select-project').find(":selected").text(),
                                "ActivityID": "A01",
                                "ActivityName": $('#select-activity').val(),
                                "Description": $('#desc').val(),
                                "RejectionRemarks": "",
                                "Hours": $('#hours').val(),
                                "Status": $('#status').val(),
                                "SchoolID":  $('#select-project').find(":selected").val(),
                                "SchoolDescription":  $('#select-project').find(":selected").text(),
                                "Deleted": ""
                            }
                        ]
                            
                   }
                    
                
           
    
    console.log(details);

    $.ajax({
        type: 'POST',
        url:'https://r9mjde4m5j.execute-api.eu-central-1.amazonaws.com/mock/timesheetbooking',
        data: JSON.stringify(details),
        dataType: "json",
        success: function(resultData) { 
            toastr.success("Timesheet Booked Successfully.","Done!");  
         }
  });

}
    

function addRow () {
    alert();
    $("#timesheetBookingTable").each(function () {
        var tds = '<tr>';
        jQuery.each($('tr:last td', this), function () {
            tds += '<td>' + $(this).html() + '</td>';
        });
        tds += '</tr>';
        if ($('tbody', this).length > 0) {
            $('tbody', this).append(tds);
        } else {
            $(this).append(tds);
        }
    });
    let lastRow = $("#table-id").find("tr").last();
    let tdTask = lastRow.children('td:eq(0)').find('#select-task');
    let tdProject = lastRow.children('td:eq(1)').find('#select-project');
    let tdActivity = lastRow.children('td:eq(2)').find('#select-activity');
    let tdSchool = lastRow.children('td:eq(3)').find('#select-school');

    $.each(taskActivity.taskResponse, function (index, value) {
        tdTask.append('<option value="' + value.taskId + '">' + value.taskName + '</option>');
    });

    $.each(taskActivity.activityResponse, function (index, value) {
        tdActivity.append('<option value="' + value.InternalID + '">' + value.Description + '</option>');
    });
    
};


function initCalender() {
  
    let temp = '';
    var date = new Date()
    var d    = date.getDate(),
        m    = date.getMonth(),
        y    = date.getFullYear()

    var Calendar = FullCalendar.Calendar;
    var calendarEl = document.getElementById('calendar');

    var calendar = new Calendar(calendarEl, {
    contentHeight:467,
    fixedWeekCount:false,
    locale:temp,
    eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false
      },
    windowResize: function(arg) {
        // alert('The calendar has adjusted to a window resize. Current view: ' + arg.view.type);
    },
    selectable: true,
    headerToolbar: {
        right  : 'prev next today',
        center: '',
        left : 'title'
    },
    //timeZone: 'UTC',
        editable: true,
        initialView: 'dayGridMonth',
        eventMaxStack: 5,
        // initialDate: '2022-11-22',
        eventOrder: true,
        events : eventDetails,
       
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
        timeGrid: {
        dayMaxEventRows: 2, // adjust to 6 only for timeGridWeek/timeGridDay
        dayMaxEvents:2,
        
      }
    },
    eventOverlap:true,
    
   
    // eventClick: function(info) {
    //   alert('Event: ' + info.event.title);
    //   // change the border color just for fun
    //   info.el.style.borderColor = 'red';
    // },
    dateClick: function(info) {
        cardDate = info.dateStr;
        deleteCard();
        totalTasks(cardDate);
    },
    
    themeSystem: 'bootstrap',
    //Random default events
    
    editable  : false,
    droppable : false
    });

    calendar.render();
}

function totalTasks(cardDate) {
    // 2022-11-12
    // 2022-11-20
    let filteredTaskDetails = employeeTimesheetDetails.filter(element => element.Date == cardDate);
    console.log(filteredTaskDetails);
    if (filteredTaskDetails.length != 0) {

        let filteredDetails = filteredTaskDetails[0].Details;
        removeSelect();

        $.each(filteredDetails, function (index, value) { 
            // alert("Inside ForEach");
            if (index == 0) {
                $("#cardTemplate").clone().attr('id','').addClass('addedCard card-success').attr('style','display:block').insertAfter('#cardTemplate');
                
            } else {
            $("#cardTemplate").clone().attr('id','').addClass('addedCard card-success').attr('style','display:block').insertAfter('.addedCard:last');
            }
           
        });

        addSelect();

        // if (filteredTaskDetails.length > 0) {
        //     alert("Inside length");
        //     $("#cardId").clone().removeClass('addedCard card-success').addClass('card-primary newCard').appendTo(".classCards");
        // }
    } 
    else {
        addCard();
    }
}

function deleteCard() {
    $('.addedCard').remove();
    document. getElementById("cardTemplate").style.display = "none";
}

function addSelect() {  
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });
}

function removeSelect() {
    $(".select2bs4").select2('destroy'); 
}

function addCard(){
    // if (document. getElementById("cardId"). style. display == "none") {
    //     document. getElementById("cardId"). style. display = "block";
    // } else{
        removeSelect();
    $("#cardTemplate").clone().attr('id', '').addClass('addedCard card-primary').attr('style','display:block').insertAfter("#cardTemplate");
        addSelect();
    // }
   
}