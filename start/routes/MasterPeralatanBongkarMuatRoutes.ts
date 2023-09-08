import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
    Route.get("/alat-bongkar-muat/:id?", "MasterBongkarMuatsController.index");
    Route.get("/add-alat-bongkar-muat", "MasterBongkarMuatsController.add");
    Route.get("/edit-alat-bongkar-muat/:id", "MasterBongkarMuatsController.edit");
    Route.get("/store-alat-bongkar-muat", "MasterBongkarMuatsController.store");
    Route.get("/update-alat-bongkar-muat", "MasterBongkarMuatsController.update");
    Route.get("/delete-alat-bongkar-muat/:id", "MasterBongkarMuatsController.delete");
    Route.get("/nonaktif-alat-bongkar-muat/:id", "MasterBongkarMuatsController.nonaktif");
    Route.get("/aktif-alat-bongkar-muat/:id", "MasterBongkarMuatsController.aktif");
    Route.get("/kirim-alat-bongkar-muat/:id", "MasterBongkarMuatsController.kirim");
    Route.get("/approve-alat-bongkar-muat", "MasterBongkarMuatsController.approve");
    Route.get("/reject-alat-bongkar-muat", "MasterBongkarMuatsController.reject");
    Route.get("/view-alat-bongkar-muat/:id", "MasterBongkarMuatsController.view");
    Route.get("/excel-alat-bongkar-muat", "MasterBongkarMuatsController.writeExcel");
    Route.get("/data-alat-bongkar-muat", "MasterBongkarMuatsController.exportData");
    Route.get("/alatbm-modal-data", "MasterBongkarMuatsController.modalData");
    Route.get("/count-norequest-alatbm", "MasterBongkarMuatsController.countNoRequest");
    Route.get("/approval-order-alatbm", "MasterBongkarMuatsController.approvalOrder");
    Route.post("/upload-file/bm", "MasterBongkarMuatsController.uploadFile");
    Route.get("/download-uploaded-file/bm/:filename", "MasterBongkarMuatsController.downloadUploadedFile");
}).prefix('/master-peralatan').middleware(["auth", "logR"]);