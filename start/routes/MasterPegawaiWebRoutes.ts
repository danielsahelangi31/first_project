import Route from "@ioc:Adonis/Core/Route";

Route.group(()=>{
    // for web app
    Route.get("/main/:company_id?", "MasterPegawaisController.main");
    Route.get("/company-chart/:company_id?", "MasterPegawaisController.companyChart");
    Route.get("/list-employee/:pbtxt?", "MasterPegawaisController.listEmployee");
    Route.get("/data-list-employee/:pbtxt?", "MasterPegawaisController.dataListEmployee");
    Route.get("/employee-chart", "MasterPegawaisController.employeeChart");
    Route.get("/list-company", "MasterPegawaisController.listCompany");
    Route.get("/data-list-company", "MasterPegawaisController.dataListCompany");
    Route.get("/detail-employee/:pernr?/:pbtxt?", "MasterPegawaisController.detailEmployee");
    Route.get("/data-list-detail-employee/:pernr?", "MasterPegawaisController.listDetailEmployee");
}).prefix("/master-pegawai").middleware(["auth", "logR"]);
