import Route from "@ioc:Adonis/Core/Route";

Route.group(()=>{
    // recieve data from sap or centra
    Route.post("/insert-pegawai-new", "PegawaiSapCentrasController.insertPegawaiNew");
    Route.post("/insert-pegawai-secondary-assignment", "PegawaiSapCentrasController.insertPegawaiSecondaryAssignment");
    Route.post("/insert-pegawai-action", "PegawaiSapCentrasController.insertPegawaiAction");
    Route.post("/insert-pegawai-previous-employment", "PegawaiSapCentrasController.insertPegawaiPreviousEmployment");
    Route.post("/insert-pegawai-family", "PegawaiSapCentrasController.insertPegawaiFamily");
    Route.post("/insert-pegawai-education", "PegawaiSapCentrasController.insertPegawaiEducation");
    Route.post("/insert-pegawai-discipline", "PegawaiSapCentrasController.insertPegawaiDiscipline");
    Route.post("/insert-pegawai-addresses", "PegawaiSapCentrasController.insertPegawaiAddresses");
    Route.post("/insert-struktur-organisasi-new", "PegawaiSapCentrasController.insertStrukturOrganisasiNew");
    Route.post("/insert-perubahan-organisasi-new", "PegawaiSapCentrasController.insertPerubahanOrganisasiNew");
    Route.post("/insert-disability", "PegawaiSapCentrasController.insertDisability");
    Route.post("/insert-cuti-sppd", "PegawaiSapCentrasController.insertCutiSppd");
    Route.post("/insert-pelaksana-harian", "PegawaiSapCentrasController.insertPelaksanaHarian");
    Route.post("/insert-cause-of-death", "PegawaiSapCentrasController.insertCauseOfDeath");

    // send data to other app
    Route.get("/get-pegawai-new/:id?", "PegawaiSyncsController.SyncPegawaiNew");
    Route.get("/get-pegawai-secondary-assignment/:id?", "PegawaiSyncsController.SyncPegawaiSecondaryAssignment");
    Route.get("/get-pegawai-action/:id?", "PegawaiSyncsController.SyncPegawaiAction");
    Route.get("/get-pegawai-previous-employment/:id?", "PegawaiSyncsController.SyncPegawaiPreviousEmployment");
    Route.get("/get-pegawai-family/:id?", "PegawaiSyncsController.SyncPegawaiFamily");
    Route.get("/get-pegawai-education/:id?", "PegawaiSyncsController.SyncPegawaiEducation");
    Route.get("/get-pegawai-discipline/:id?", "PegawaiSyncsController.SyncPegawaiDiscipline"); 
    Route.get("/get-pegawai-addresses/:id?", "PegawaiSyncsController.SyncPegawaiAddresses"); 
    Route.get("/get-struktur-organisasi/:id?", "PegawaiSyncsController.SyncStrukturOrganisasi"); 
    Route.get("/get-perubahan-organisasi/:id?", "PegawaiSyncsController.SyncPerubahanOrganisasi"); 
}).prefix("/master-pegawai").middleware(['auth:api']);