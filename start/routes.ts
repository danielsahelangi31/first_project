/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";
import { v4 as uuidv4 } from "uuid";
import './routes/asetRoutes';
import './routes/barangRoutes';
import './routes/dataSelectRoutes';
import './routes/companyRoutes';
import './routes/vesselRoutes';
import './routes/MasterPegawaiWebRoutes';
import './routes/MasterPegawaiIntegrationRoutes';
import './routes/MasterPeralatanBongkarMuatRoutes';
import './routes/MasterPeralatanApungRoutes';
import './routes/MasterDermagasRoutes';
import './routes/customerRoutes';


Route.get("testEmail", "ApiRequestController.testSend").as("testSend");
Route.get("login", "LoginController.index").as("login");
Route.post("login", "LoginController.loginProsess").as("loginProsess");
Route.get("A", "LoginController.registerProsess").as("registerProsess");
Route.post("request-api", "ApiRequestController.store").as("requestApi");
Route.get("/generate-token", "ApiMasterDataController.GenerateToken").as("generateToken");

Route.group(() => {
  Route.get("home", "HomeController.index").as("home");
  Route.get("/", async ({ response }) => {
    return response.redirect("/home");
  });
  Route.get("/download-file/:id", "FileDownloadsController.download").as("downloadFile");


  Route.post("/logout", async ({ auth, response }) => {
    await auth.use("web").logout();
    response.redirect("/login");
  }).as("logout");

  // Schema Aplicaion
  Route.resource("schema", "ScemaAplicationsController");
  Route.post("/updateSchema", "ScemaAplicationsController.updateSchema").as("updateSchema");
  Route.post("/schema/multi-store", "ScemaAplicationsController.multiStore").as("schema.multiStore");
  Route.get("/deleteSchema/:id", "ScemaAplicationsController.deleteSchema").as("deleteSchema");
  Route.get("/getEntity/:id", "ScemaAplicationsController.getEntity").as("getEntity");


  //City
  Route.get("/getCity/:id", "CitiesController.getCity").as("getCity");

  //Entity Location
  Route.resource("entity", "EntityLocationsController");
  Route.get("/deleteLocation/:id", "EntityLocationsController.destroy").as("deleteLocation");
  Route.get("/entity/paggination", "EntityLocationsController.index").as("paggination");
  Route.get("/entity-search/:id", "EntityLocationsController.entitySearch").as("searchEntity");
  //Master Customer
  // Route.group(() => {
  //   Route.get("master-customer/renewal/:id", "MasterCustomerController.getRenewal").as("renewal");
  //   Route.get("master-customer/edit/:id", "MasterCustomerController.getEdit").as("edit");
  //   Route.get("master-customer/view/:id", "MasterCustomerController.getView").as("view");
  //   Route.get("master-customer/create", "MasterCustomerController.getCreate").as("create");
  //   Route.post("master-customer/createData", "MasterCustomerController.storeData").as("storeData");
  //   Route.post("master-customer/updateData/:id", "MasterCustomerController.updateData").as("updateData");
  //   Route.get("master-customer", "MasterCustomerController.index").as("master-customer");
  //   Route.get("/deleteCustomer/:id", "MasterCustomerController.destroy");
  //   //request customer
  //   Route.post("/request-customer/approve", "MasterCustomerController.aprovalCustomer").as("requestCustomer.approve");
  //   Route.post("/request-customer/reject", "MasterCustomerController.rejectCustomer").as("requestCustomer.reject");
  //   Route.get("/request-customer/:id/approvalHistoryNext", "MasterCustomerController.approvalHistoryNext").as("customer.approvalHistoryNext");
  // }).middleware(["logR"]);

  // Role
  Route.group(() => {
    Route.get("/role", "RoleController.index").as("role.index");
    Route.get("/role/:id/edit", "RoleController.edit").as("role.edit");
    Route.post("/role", "RoleController.store").as("role.store");
    Route.post("/role/update/:id", "RoleController.update").as("role.update");
    Route.get("/role/delete/:id", "RoleController.destroy").as("role.destroy");
    Route.get("user", "UserController.index").as("user.index");
  }).prefix("/admin").as("admin");

  // approval request api
  Route.group(() => {
    Route.get("/list", "ApiRequestController.index").as("request.index");
    Route.get("/approve/:id", "ApiRequestController.approve").as("request.approve");
    Route.get("/reject/:id", "ApiRequestController.reject").as("request.reject");
  }).prefix("/api").as("api");


  //Master Setting
  Route.group(() => {

    //HeadOffice
    Route.get("/head-office", "HeadOfficeController.index").as("ho.index");
    Route.get("/head-office/:id/edit", "HeadOfficeController.edit").as("ho.edit");
    Route.post("/head-office", "HeadOfficeController.store").as("ho.store");
    Route.post("/head-office/update/:id", "HeadOfficeController.update").as("ho.update");
    Route.get("/head-office/delete/:id", "HeadOfficeController.destroy").as("ho.destroy");

    //regional
    Route.get("/regional", "RegionalController.index").as("regional.index");
    Route.get("/regional/:id/edit", "RegionalController.edit").as("regional.edit");
    Route.post("/regional", "RegionalController.store").as("regional.store");
    Route.post("/regional/update/:id", "RegionalController.update").as("regional.update");
    Route.get("/regional/delete/:id", "RegionalController.destroy").as("regional.destroy");


    //branch
    Route.get("branch/export", "BranchesController.export").as("branch.export");
    Route.post("branch/active/:id", "BranchesController.active").as("branch.active");
    Route.post("branch/inactive/:id", "BranchesController.inActive").as("branch.inactive");
    Route.post("branch/approve", "BranchesController.approve").as("branch.approve");
    Route.post("branch/reject", "BranchesController.reject").as("branch.reject");
    Route.get("branch/renewal/:id", "BranchesController.renewal").as("branch.renewal");
    Route.get("/branch/:id/approvalHistoryNext", "BranchesController.approvalHistoryNext").as("branch.approvalHistoryNext");
    Route.get("branch/view/:id", "BranchesController.view").as("branch.view");
    Route.resource("branch", "BranchesController");


    //terminal
    Route.get("terminal/export", "TerminalsController.export").as("terminal.export");
    Route.post("terminal/active/:id", "TerminalsController.active").as("terminal.active");
    Route.post("terminal/inactive/:id", "TerminalsController.inActive").as("terminal.inactive");
    Route.post("terminal/approve", "TerminalsController.approve").as("terminal.approve");
    Route.get("terminal/renewal/:id", "TerminalsController.renewal").as("terminal.renewal");
    Route.post("terminal/reject", "TerminalsController.reject").as("terminal.reject");
    Route.get("/terminal/:id/approvalHistoryNext", "TerminalsController.approvalHistoryNext").as("terminal.approvalHistoryNext");
    Route.get("terminal/view/:id", "TerminalsController.view").as("terminal.view");
    Route.resource("terminal", "TerminalsController");



  }).prefix("/master").as("master").middleware(["logR"]);
  ;

  //Approval History
  Route.get("/approval/:id/approvalHeader", "ApprovalHistoriesController.approvalHeader").as("approval.approvalHeader");
  Route.get("/approval/:id/lastApprovalHistory", "ApprovalHistoriesController.lastApprovalHistory").as("approval.lastApprovalHistory");
  Route.get("/approval/:id/approvalHistoryDetail", "ApprovalHistoriesController.approvalHistoryDetail").as("approval.approvalHistoryDetail");
  Route.get("/approval/:id/logApproval", "ApprovalHistoriesController.logApproval").as("approval.logApproval");
  Route.get("/approval-path/:id", "ApprovalHistoriesController.approvalPath").as("approval.approvalPath");


  //Master Pelabuhan
  Route.resource("master-pelabuhan", "MasterPelabuhanController");

  //Master Terminal
  Route.resource("master-terminal", "MasterTerminalController");

  // notification
  Route.get("get-notif", "NotificationsController.list").as("notif.list");
  Route.get("get-unread", "NotificationsController.unread").as("notif.unread");
  Route.get("set-read/:id", "NotificationsController.setRead").as("notif.setRead");
  Route.group(() => {
    Route.get("", "ApprovalController.index").as("approval");
  }).prefix("/approval").as("approval");

  // sap menu
  Route.group(() => {
    Route.get("index", "SapIntergrationsController.index").as("index");
    Route.get("indexKapal", "SapIntergrationsController.indexKapal").as("indexKapal");
    Route.get("create/:id", "SapIntergrationsController.create").as("createSap");
    Route.get("createKapal/:id", "SapIntergrationsController.createKapal").as("createKapalSap");
    Route.get("update/:id", "SapIntergrationsController.update").as("updateSap");
  }).prefix("/sap").as("sap");

  //Job Position Administrator
  Route.resource("job-position", "JobPositionsController").as("jobPosition");
  Route.get("delete-job-position/:id", "JobPositionsController.destroy").as("deleteJobPosition");

  //log MDM Phinnisi
  Route.get("/log-phinnisi", "MdmPhinnisiController.index").as("LogMdmPhinnisi")
  Route.post("/log-phinnisi/resend", "MdmPhinnisiController.resend").as("resend.logphinnisi")

  // log MDM RE3
  Route.get("/log-mdm-r3", "MdmRE3IntegrationsController.index").as("logMdmR3");
  Route.get("/log-mdm-r3/resend/:id", "MdmRE3IntegrationsController.resend").as("resendMdmR3");

}).middleware(["auth"]);

Route.group(() => {
  Route.post("/uploadFile", "MasterVesselsController.uploadFile");
}).prefix("/kapal");


// Route.post("/lempar-kesini", async ({ request }: HttpContextContract) => {
  
//   console.log(request.raw());
// })
// .middleware(async ({ request }, next) => {
//   const contentType = request.header('content-type')

//   if (contentType === 'application/xml') {
//     const body = request.raw()
//     const parsed = Parser.convertXMLToJSON(body)
//     request.updateBody(parsed)
//   }

//   await next()
// });

Route.post("/sendemail", "NotificationMailsController.sendnotifmail").as("sendemail");
Route.group(() => {
  //API master
  Route.post("/company", "ApiMasterDataController.MasterCompany").as("ApiMasterDataCompany");
  Route.post("/alat-apung", "ApiMasterDataController.MasterAlatApung").as("ApiMasterDataAlatApung");
  Route.post("/alat-bongkar-muat", "ApiMasterDataController.MasterAlatBongkarMuat").as("ApiMasterDataAlatBongkarMuat");
  Route.post("/customer", "ApiMasterDataController.MasterCustomer").as("ApiMasterDataCustomer");
  Route.post("/kapal", "ApiMasterDataController.MasterKapal").as("ApiMasterDataKapal");
  Route.post("/pelabuhan", "ApiMasterDataController.MasterBranch").as("ApiMasterDataBranch");
  Route.post("/terminal", "ApiMasterDataController.MasterTerminal").as("ApiMasterDataTerminal");
}).prefix("/api-master").middleware("auth:api");
// inaportnet integration
Route.group(() => {
  Route.post("/createKapal", "InaportnetIntegrationsController.createKapal").as("createKapal")
}).prefix("/inaportnet").middleware("auth:api");
// MDM R3 integration
Route.group(() => {
  Route.post("/create-customer", "MdmRE3IntegrationsController.createCustomer").as("createCustomer")
}).prefix("/mdm-re3").middleware("auth:api");

Route.get("/check-code-company", "MasterCompaniesController.findCodeCompany").as("findCode");
Route.get("/check-duplicate-api", "ApiRequestController.findDuplicateData").as("checkDuplicate");
Route.get("/check-job-position", "JobPositionsController.findJobPosition").as("checkJobPosition");
// master vendor
Route.group(()=> {
  Route.get('/', 'MasterVendorsController.index');
  Route.get('/add', 'MasterVendorsController.add');
  Route.get('/edit/:id', 'MasterVendorsController.edit');
  Route.get('/renewal/:id', 'MasterVendorsController.renewal');
  Route.get('/view/:id', 'MasterVendorsController.view');
  Route.get('/view-approved/:id', 'MasterVendorsController.viewApproved');
  Route.post('/store', 'MasterVendorsController.store');
  Route.put('/update/:id', 'MasterVendorsController.update')
  Route.put('/update-status/:id', 'MasterVendorsController.updateStatus')
  Route.post('/renewal-add/:id', 'MasterVendorsController.storeRenewal');
  Route.delete("/delete/:id", "MasterVendorsController.destroy");
  Route.post("/approval", "MasterVendorsController.approval");
  Route.post("/reject", "MasterVendorsController.reject");
  Route.get("/modal-data", "MasterVendorsController.modalData");
}).prefix('/master-vendor').middleware("auth")

// vendor integration
Route.group(() => {
  Route.post("/vendor", "MasterVendorsController.integration").as("createVendor")
}).prefix("/secure").middleware("auth:api");

Route.get("uuid", () => {
  var teks = uuidv4();
  return teks;
});

