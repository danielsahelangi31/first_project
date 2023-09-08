import Route from '@ioc:Adonis/Core/Route';

// Master Company
Route.group(() => {
    Route.post("/master-company/review-page", "MasterCompaniesController.importPage").as("MasterCompanyImport");
    Route.post("/master-company/save-excel", "MasterCompaniesController.saveExcel").as("savingExcel");
    Route.resource("master-company", "MasterCompaniesController").as("MasterCompany");
    Route.get("/master-company/detail/:id", "MasterCompaniesController.companyDetail").as("CompanyDetail");
    Route.get("/template-master-company", "MasterCompaniesController.createExcelTemplate").as("MasterCompanyDownloadTemplate");
    Route.get("/master-company/delete/:id", "MasterCompaniesController.destroy").as("MasterCompanyDestroy");
    Route.get("/master-company/status/:id", "MasterCompaniesController.updateStatus").as("MasterCompanyUpdateStatus");
    Route.get("/create-template", "MasterCompaniesController.createExcelTemplate").as("masterCompanyCreateTemplate");
    Route.get("/getParent/:id", "MasterCompaniesController.parentSearch").as("getParent");
}).middleware(['auth']);