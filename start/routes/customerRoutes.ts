import Route from '@ioc:Adonis/Core/Route';

 //Master Customer v2
Route.group(() => {
    Route.get("", "MasterCustomerV2sController.index").as("master-customer");
    Route.get("/add", "MasterCustomerV2sController.add").as("add");
    Route.get("/edit/:id", "MasterCustomerV2sController.edit").as("edit");
    Route.get("/renewal/:id", "MasterCustomerV2sController.renewal").as("renewal");
    Route.get("/renewalStore", "MasterCustomerV2sController.storeRenewal").as("storeRenewal");
    Route.get("/view/:id", "MasterCustomerV2sController.view").as("view");
    Route.get("/view-approved/:id", "MasterCustomerV2sController.viewApproved").as("viewApproved");
    Route.get("/store", "MasterCustomerV2sController.store").as("store");
    Route.get("/updateData/:id", "MasterCustomerV2sController.updateData").as("updateData");
    Route.get("/updateStatus/:id", "MasterCustomerV2sController.updateStatus").as("updateStatus") .middleware("logR");
    Route.get("/delete/:id", "MasterCustomerV2sController.destroy").as("delete");
    Route.post("/approval", "MasterCustomerV2sController.approval").as("approval");
    Route.post("/reject", "MasterCustomerV2sController.reject").as("reject");
    Route.get("/create-excel", "MasterCustomerV2sController.createExcel").as("createExcel");
    Route.get("/modalData", "MasterCustomerV2sController.modalData").as("modalCustomer");
    Route.get("/npwp", "Select2sController.checkDuplicateNpwp").as("npwpCheck");
}).prefix("/master-customer").middleware("auth");


// customer util
Route.group(() => {
    Route.get("/npwp", "MasterCustomerController.npwpCheck").as("checkNpwp");
    Route.get("/modalData/:id", "MasterCustomerController.dataModal").as("modalData");
    Route.get("/updateStatus/:id", "MasterCustomerController.updateStatus");
    Route.get("/export", "MasterCustomerController.createExcelData").as("exportData");
    Route.post("/uploadFile", "MasterCustomerV2sController.uploadFile");
}).prefix("/customer");