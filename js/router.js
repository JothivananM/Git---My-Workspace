let pagePath;

const route = (event) => {
    event = event || window.event;
    event.preventDefault();

    var href = "";

    if (event.target.nodeName === 'I' || event.target.nodeName === 'P') {
        href = event.target.parentNode.href;
    }

    else {
        href = event.target.href;
    }

    
    pagePath = event.currentTarget.id;
    // window.history.pushState({}, "", href);
    handleLocation(pagePath);
};

const generateTable = (data,TableName) =>{

    if (TableName == "timesheetBookingTable") {
        $("#"+TableName).DataTable({
            "responsive": true,
            "lengthChange": false,
            "autoWidth": false,
            "pageLength":2,
            "paging": true,
            "searching": true,
            "ordering": true,
            "info": true,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
           
            data: data,
    
            columns:[
                {
                    data:'TaskName' ,
                    render : function (data, type) {
                        return '<select><option>'+data[1]+'</option><select>';
                    }
                    
            },
                { data:'ProjectName' },
                { data:'ActivityName' },
                { data:'SchoolDescription' },
                { data:'Hours' },
                { data:'Description' },
                { data:'Status' }
            ],
        }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');;

    } else {
        $("#"+TableName).DataTable({
            "responsive": true,
            "lengthChange": false,
            "autoWidth": false,
            "pageLength":2,
            "paging": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "buttons": [
                {
                    "extend": 'excel',
                    "text": '<i class="fa fa-file-excel" ></i>',
                    "titleAttr" :'Save current page',
                    "exportOptions": {
                        "modifier": {
                            "page": 'current'
                        }
                    }
                },
                {
                    "extend": 'excel',
                    "text": '<i class="fa fa-download" aria-hidden="true"></i>',
                    "titleAttr" :'Download All Pages'
                },
                // {
                //     "extend": 'alert',
                //     "text": 'alert'
                // },
                // {
                //     "extend": 'search',
                //     "text": 'Search'
                // },
            ],
            data: data,
    
            columns:[
                { data:'Date' },
                { data:'TaskName' },
                { data:'ProjectName' },
                { data:'ActivityName' },
                { data:'SchoolDescription' },
                { data:'Hours' },
                { data:'Description' }
            ],
        }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    }

    
    
}

// const routes = {
//     "error": "/pages/error.html",
//     "/login": "/pages/login.html",
//     "/": "/pages/EmployeeTimeBookingPage.html",
//     "/Manager ConfirmationPage": "/pages/ManagerTimesheetConfirmationPage.html",
//     "/ProfilePage": "/pages/ProfilePage.html",
//     "/index.html": "/pages/EmployeeTimeBookingPage.html",
//     "/Buyer ResponsiblePage":"/pages/BuyerResponsibleReportingApprovalPage.html",
//     "/Employee ReportingPage": "/pages/EmployeeReportingPage.html",
//     "/Employee TimeBookingPage": "/pages/EmployeeTimeBookingPage.html",
//     "/Manager PayrollPage": "/pages/ManagerPayrollProcessingPage.html",
//     "/Supplier ContractPage": "/pages/SupplierContractReportingPage.html",
//     "/Supplier Reporting StatusPage":"/pages/SupplierReportingStatusPage.html",
//     "/Supplier POReportingPage":"/pages/SupplierPOReportingPage.html"
// };

const handleLocation = async (path) => {
   if (path == undefined || path == "") {
        path = "EmployeeTimeBookingPage";
   }
 
    const route = '/pages/'+path+'.html';
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;

    if(path==="EmployeeReportingPage")
    {
        userlist();   
    }
    else if(path==="ProfilePage")
    {
        profile();   
    }
    else if (path === "EmployeeTimeBookingPage") {
        
        displayTimesheet();
    }
   
};

// window.onpopstate = handleLocation;
window.route = route;
handleLocation();

