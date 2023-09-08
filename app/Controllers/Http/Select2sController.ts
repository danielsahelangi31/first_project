import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PostalCode from "App/Models/PostalCode";
import CountryCode from "App/Models/CountryCode";
import Location from "App/Models/Location";
import MasterCompany from "App/Models/MasterCompany";
import City from "App/Models/City";
import Cabang from "../../Models/Cabang";
import ProvinceView from "App/Models/ProvinceView";
import VesselType from "App/Models/VesselType";
import Country from "App/Models/Country";
import Terminal from "App/Models/Terminal";
import Branch from "App/Models/Branch";
import JenisTerminal from "App/Models/JenisTerminal";
import GroupCompany from "App/Models/GroupCompany";
import GroupAlat from "App/Models/GroupAlat";
import SatuanKapasita from "App/Models/SatuanKapasita";
import PowerSource from "App/Models/PowerSource";
import TierType from "App/Models/TierType";
import SatuanCapacity from "App/Models/SatuanCapacity";
import JenisKapal from "App/Models/JenisKapal";
import Klasifikasi from "App/Models/Klasifikasi";
import JenisPropulsi from "App/Models/JenisPropulsi";
import JenisPerairan from "App/Models/JenisPerairan";
import JenisDermaga from "App/Models/JenisDermaga";
import JenisKonstruksi from "App/Models/JenisKonstruksi";
import StatusMilik from "App/Models/StatusMilik";
import CustomerInfo from "App/Models/CustomerInfo";
import CustomerNpwpv2 from "App/Models/CustomerNpwpv2";
import BentukUsaha from "App/Models/BentukUsaha";
import RequestCustomerNpwp from "App/Models/RequestCustomerNpwp";
import CustomerBilling from "App/Models/CustomerBilling";
import RequestCustomerBilling from "App/Models/RequestCustomerBilling";
import Bank from "App/Models/Bank";


export default class Select2sController {
  public async postalcode({ request, response }: HttpContextContract) {
    const params = request.input("search");
    const postalCodes = await PostalCode.query()
      .whereRaw(`upper("country") like upper('%${params}%')`)
      .orWhereRaw(`upper("province") like upper('%${params}%')`)
      .orWhereRaw(`upper("city") like upper('%${params}%')`)
      .orWhereRaw(`upper("subdistrict") like upper('%${params}%')`)
      .orWhereRaw(`upper("village") like upper('%${params}%')`)
      .orWhereRaw(`upper("post_code") like upper('%${params}%')`).limit(50);
    return response.send(postalCodes);
  }

  public async province({ request, response }: HttpContextContract) {
    const params = request.input("search");
    const provinceView = await ProvinceView.query().whereRaw(`upper("province") like upper('%${params}%')`)
    console.log(provinceView);
    return response.send(provinceView);
  }

  public async city({ request, response }: HttpContextContract) {
    const params:string = request.input("search")? request.input("search"): "";
    const city = await PostalCode.query()
      .select('city')
      .min('id')
      .whereRaw(`upper("city") like upper('%${params}%')`)
      .groupBy('city')
      .limit(10);
    const data:any[] = city?.map(data => {
      return {
        city: data?.city,
        id: data?.$extras[`MIN("ID")`]
      }
    })
    return response.send(data);
  }

  public async portcode({ request, response }: HttpContextContract) {
    const portCodes = await CountryCode.query()
      .whereRaw(`upper("name") like upper('%${request.input("search")}%')`)
      .orWhereRaw(`upper("code") like upper('%${request.input("search")}%')`)
      .limit(50);
    return response.send(portCodes);
  }

  public async cityCode({ request, response }: HttpContextContract) {
    const portCodes = await City.query()
      .whereRaw(`upper("city_name") like upper('%${request.input("search")}%')`)
      .orWhereRaw(`upper("city_code") like upper('%${request.input("search")}%')`)
      .limit(50);
    return response.send(portCodes);
  }

  public async entityLocation({ response, request }: HttpContextContract) {
    const location_id = request.input("location_id");
    const location = await Location.findOrFail(location_id);
    const entities = await Location.query().select("id", "name").whereNot("id", location_id).where("level", "<", location.level);
    return response.send(entities);
  }


  public async companyByGroup({ response, request }: HttpContextContract) {
    const groupId = request.input("group_id");
    const company = await MasterCompany.query().select("id", "company_name").where("company_group", groupId);
    return response.send(company);
  }


  public async headerBranch({ response, request }: HttpContextContract) {
    const regionalId = request.input("regional_id");

    const headerBranch = await Cabang.query().select("id", "name").where("regional_id", regionalId);
    return response.send(headerBranch);
  }

  public async checkDuplicateNpwp({response, request}: HttpContextContract) {    
    const params = request.input("search");
    let isEdit = request.input('isEdit') ? request.input('isEdit') : '';
    
    let npwp:object| null 
    let npwp_billing: object| null

    if (isEdit == '1'){
      npwp = await CustomerNpwpv2.query().where("no_npwp",`${params}`).first()
      if (!npwp) {
        npwp_billing = await CustomerBilling.query()
        .where("no_npwp",`${params}`)
        .andWhere("flag_npwp_billing",1)
        .first()
      }
    }else {
      npwp = await RequestCustomerNpwp.query().where("no_npwp",`${params}`)
      .andWhereHas('RequestCustomerInfo',(query)=>{
        query.whereNot('status','DRAFT')
        query.andWhereNot('status','REJECT')
      })
      .first()
      if (!npwp) {
        console.log("masuk npwp biling")
        npwp_billing = await RequestCustomerBilling.query()
        .where("no_npwp",`${params}`)
        .andWhere("flag_npwp_billing",1)
        .andWhereHas('RequestCustomerInfo',(query)=>{
          query.whereNot('status','DRAFT')
          query.andWhereNot('status','REJECT')
        })
        .first()
      }
    }

    let result: object = {}

    if(npwp?.no_npwp){
      result = {
        message: "NPWP sudah terdaftar",
        no_npwp: npwp?.no_npwp,
        name: npwp?.name
      }
    } else if (npwp_billing?.no_npwp){
      result = {
        message: "NPWP sudah terdaftar",
        no_npwp: npwp_billing?.no_npwp,
        name: npwp_billing?.nm_account
      }
    } else {
      result = {
        message: "NPWP belum terdaftar"
      }
    }
    return response.send(result)
  }

  public async parentCompany({response, request}: HttpContextContract) {
    const params = request.input("search");
    
    // console.log(params);
    
    // const parentCompany = await CustomerBasicInfo.query().whereRaw(`upper("company_name") like upper('%${params}%')`).andWhereRaw(`"parent_company" is null`).andWhere("status","ACTIVE").limit(25);
    const parentCompany = await CustomerInfo.query().whereRaw(`upper("nm_perusahaan") like upper('%${params}%')`).andWhereRaw(`"parent_customer" is null`).andWhere("status","ACTIVE").limit(25);
    return response.send(parentCompany)
  }

  public async parentNpwp({response, request}: HttpContextContract) {
    const params = request.input("search");
    // console.log(params);
    const parentCompany = await CustomerInfo.query().whereRaw(`upper("nm_perusahaan") like upper('%${params}%')`).andWhereRaw(`"parent_customer" is null`).first();
    const npwp = await CustomerNpwpv2.query().where("customer_id",`${parentCompany?.id}`)
    return response.send(npwp)
  }

  public async bentukUsahaCategory({response, request}: HttpContextContract) {
    const params = request.input("search");
    let bentukUsaha
    // console.log(params);
    if(params == 'Lainnya') {
      bentukUsaha = await BentukUsaha.query().whereRaw(`upper("category") like upper('%${params}%')`).andWhereRaw(`"category" is not null`);
    } else {
      bentukUsaha = await BentukUsaha.query().whereNull('category')
    }
    return response.send(bentukUsaha)
  }

  public async tipeKapal({response,request}:HttpContextContract){
      const params = request.input("jenisKapal")

      const tipeKapal = await VesselType.query().select("tipe_kapal").distinct('tipe_kapal').where("jn_kapal",params)
      return response.send(tipeKapal)
  } 

  public async spesifikKapal({response,request}:HttpContextContract){
    const params = request.input("tipeKapal")

    const spesifikKapal = await VesselType.query().select("id","spesifik_kapal").where("tipe_kapal",params)
    return response.send(spesifikKapal)
  }

  public async namaPelabuhan({response}:HttpContextContract){
    const pelabuhan = await Branch.query().preload("regional").preload("postalcode").preload("city", function(query) {
                          query.preload("country");
                      }).where("status", "ACTIVE").orderBy("port_name", "asc");
    return response.send(pelabuhan);
  }

  public async namaTerminal({response,request}:HttpContextContract){
    const params = request.input("nama_pelabuhan");
    if(params) {
      const pelabuhan = await Branch.query().select("id").where("name", params);
      const terminal = await Terminal.query().preload("jenisTerminal").where("status", "ACTIVE").where("branch_id", pelabuhan[0].id).orderBy("name", "asc");
      return response.send(terminal);
    } else {
      const terminal = await Terminal.query().preload("jenisTerminal").where("status", "ACTIVE").orderBy("name", "asc");
      return response.send(terminal);
    }
  }

  public async tipeLayananUtama({response}:HttpContextContract){
    const tipe = await JenisTerminal.query().orderBy("name", "asc");
    response.send(tipe);
  }

  public async entityPeralatan({response}:HttpContextContract){
    const groupCompany = await GroupCompany.query().orderBy('sort_no', 'asc');
    response.send(groupCompany);
  }

  public async kepemilikanAsetPeralatan({response}:HttpContextContract){
    const com = await MasterCompany.query().whereNotIn('company_group', ['5a4bfc54-adf3-48bf-8a10-43ba8615327e', 'd47bb444-4b12-4d31-ac18-fad08fba4086', '69d07ab2-8d39-4277-94bd-1d8286798017', '5c46ea27-5fbf-4bbf-b855-98f369c30934']).orderBy('company_name', 'asc');
    response.send(com);
  }

  public async lokasiKepemilikanPeralatan({response}:HttpContextContract){
    const cabang = await MasterCompany.query().whereIn('company_group', ['5a4bfc54-adf3-48bf-8a10-43ba8615327e', 'd47bb444-4b12-4d31-ac18-fad08fba4086', '69d07ab2-8d39-4277-94bd-1d8286798017', '5c46ea27-5fbf-4bbf-b855-98f369c30934']).orderBy('company_name', 'asc');
    response.send(cabang);
  }

  public async lokasiFisikPeralatan({response}:HttpContextContract){
    const cabang2 = await Cabang.query().whereRaw(`"name" not like '%Sub%'`).orderBy('name', 'asc');
    response.send(cabang2);
  }

  public async classDescriptionPeralatan({response}:HttpContextContract){
    const groupAlat = await GroupAlat.query().orderBy('kode_alat', 'asc');
    response.send(groupAlat);
  }

  public async satuanKapasitasBm({response}:HttpContextContract){
    const satuanKapasitas = await SatuanKapasita.query().orderBy('sort_no', 'asc');
    response.send(satuanKapasitas);
  }

  public async powerSourceBm({response}:HttpContextContract){
    const powerSource = await PowerSource.query().orderBy('sort_no', 'asc');
    response.send(powerSource);
  }

  public async tierTypeBm({response}:HttpContextContract){
    const tierType = await TierType.query().orderBy('sort_no', 'asc');
    response.send(tierType);
  }
  
  public async satuanCapacityBm({response}:HttpContextContract){
    const satuanCapacity = await SatuanCapacity.query().orderBy('name', 'asc');
    response.send(satuanCapacity);
  }

  public async jenisKapalAp({response}:HttpContextContract){
    const jenisKapal = await JenisKapal.query().orderBy('sort_no', 'asc');
    response.send(jenisKapal);
  }

  public async klasifikasiAp({response}:HttpContextContract){
    const klasifikasi = await Klasifikasi.query().orderBy('sort_no', 'asc');
    response.send(klasifikasi);
  }

  public async jenisPropulsiAp({response}:HttpContextContract){
    const jenisPropulsi = await JenisPropulsi.query().orderBy('sort_no', 'asc');
    response.send(jenisPropulsi);
  }

  public async jenisPerairanDm({response}:HttpContextContract){
    const jenisPerairan = await JenisPerairan.query().orderBy('name', 'asc');
    response.send(jenisPerairan);
  }

  public async jenisDermagaDm({response}:HttpContextContract){
    const jenisDermaga = await JenisDermaga.query().orderBy('name', 'asc');
    response.send(jenisDermaga);
  }

  public async jenisKonstruksiDm({response}:HttpContextContract){
    const jenisKonstruksi = await JenisKonstruksi.query().orderBy('name', 'asc');
    response.send(jenisKonstruksi);
  }

  public async statusMilikDm({response}:HttpContextContract){
    const statusMilik = await StatusMilik.query().orderBy('name', 'asc');
    response.send(statusMilik);
  }

  public async country({response}:HttpContextContract){
    const country = await Country.query().orderBy('country_name', 'asc');
    response.send(country);
  }

  public async bank({request,response}:HttpContextContract){
    const params = request.input("search");
    const bank = await Bank.query()
    .whereRaw(`upper("name") like upper('%${params}%')`)
    .limit(50);
    response.send(bank);
  }
  // public async countryCode({response, request}:HttpContextContract ) {
  //   const countryId = request.input('id')
  //   const countryCode = await Country
  // }
}
