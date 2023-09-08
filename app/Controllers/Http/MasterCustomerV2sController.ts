import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database'
import ApprovalDetail from 'App/Models/ApprovalDetail'
import ApprovalHeader from 'App/Models/ApprovalHeader'
import ApprovalLog from 'App/Models/ApprovalLog'
import Bank from 'App/Models/Bank'
import BentukUsaha from 'App/Models/BentukUsaha'
import Cabang from 'App/Models/Cabang'
import CargoOwner from 'App/Models/CargoOwner'
import Country from 'App/Models/Country'
import CustomerGroup from 'App/Models/CustomerGroup'
import CustomerInfo from 'App/Models/CustomerInfo'
import CustomerType from 'App/Models/CustomerType'
import Mitra from 'App/Models/Mitra'
import Notification from 'App/Models/Notification'
import PaymentType from 'App/Models/PaymentType'
import RequestCustomerDocument from 'App/Models/RequestCustomerDocument'
import RequestCustomerInfo from 'App/Models/RequestCustomerInfo'
import Role from 'App/Models/Role'
import SchemaAplication from 'App/Models/SchemaAplication'
import SchemaApprovalList from 'App/Models/SchemaApprovalList'
import ServiceType from 'App/Models/ServiceType'
import ShippingLine from 'App/Models/ShippingLine'
import UsahaPelanggan from 'App/Models/UsahaPelanggan'
import User from 'App/Models/User'
import MasterCustomer from 'App/Services/MasterCustomer'
import SendMail from 'App/Services/SendMail'
import Ws from 'App/Services/Ws'
import Env from '@ioc:Adonis/Core/Env'
// import AWS from 'aws-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import excel from 'exceljs';
import Drive from '@ioc:Adonis/Core/Drive'
import { Exception } from '@adonisjs/core/build/standalone'
import RequestCustomerBilling from 'App/Models/RequestCustomerBilling'
import RequestCustomerNpwp from 'App/Models/RequestCustomerNpwp'
import RequestCustomerExpDocument from 'App/Models/RequestCustomerExpDocument'
import PivotUsahaMitra from 'App/Models/PivotUsahaMitra'
import PivotShippingLine from 'App/Models/PivotShippingLine'
import PivotCargoOwner from 'App/Models/PivotCargoOwner'
import PivotServiceType from 'App/Models/PivotServiceType'
import RequestCustomerContact from 'App/Models/RequestCustomerContact'
import PivotPaymentType from 'App/Models/PivotPaymentType'
import SapIntegration from 'App/Util/SapIntegration'
import MdmR3 from 'App/Util/MdmR3'
import CustomerNpwpv2 from 'App/Models/CustomerNpwpv2'

export default class MasterCustomerV2sController {
    public async index({ request, view, auth }: HttpContextContract) {
        let requestData = request.input('request');
        let status = request.input('status');
        let statusData;
        let customers
        if (requestData == undefined || requestData == 'active') {
            statusData = 'ACTIVE';
            if (status == 'ACTIVE' || status == undefined) {
                customers = await CustomerInfo.query()
                    .preload('npwp')
                    .preload('customerGroup')
                    .where('status', 'ACTIVE')
                    .orderBy('created_at', 'desc')
            } else if (status == 'INACTIVE') {
                customers = await CustomerInfo.query()
                    .preload('npwp')
                    .preload('customerGroup')
                    .where('status', 'INACTIVE')
                    .orderBy('created_at', 'desc')
            } else if (status == 'all') {
                customers = await CustomerInfo.query()
                    .preload('npwp')
                    .preload('customerGroup')
                    .orderBy('created_at', 'desc')
            }
        } else if (requestData == 'outstanding') {
            statusData = 'OUTSTANDING';
            if (status == 'REQUEST') {
                customers = await RequestCustomerInfo.query()
                    .preload('npwp')
                    .preload('customerGroup')
                    .where('status', 'REQUEST')
                    .orderBy('updated_at', 'desc')
            } else if (status == 'DRAFT') {
                customers = await RequestCustomerInfo.query()
                    .preload('npwp')
                    .preload('customerGroup')
                    .where('status', 'DRAFT')
                    .orderBy('updated_at', 'desc')
            } else if (status == 'REJECT') {
                customers = await RequestCustomerInfo.query()
                    .preload('npwp')
                    .preload('customerGroup')
                    .where('status', 'REJECT')
                    .orderBy('updated_at', 'desc')
            }
        }

        const [
            customer_type,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
        ] = await Promise.all([
            CustomerType.all(),
            CustomerGroup.query().orderBy('created_at', 'asc'),
            BentukUsaha.query().whereNull('category').orderBy('created_at', 'asc'),
            ServiceType.query().orderBy('name', 'asc'),
            Country.query().orderBy('country_name', 'asc'),
            Cabang.query().orderBy('name', 'asc'),
        ])

        const [req, draft, reject, active, inactive] = await Promise.all([
            Database.from('request_customer_infos').count(`* as number`).whereRaw(`"status" = 'REQUEST'`),
            Database.from('request_customer_infos').count(`* as number`).whereRaw(`"status" = 'DRAFT'`),
            Database.from('request_customer_infos').count(`* as number`).whereRaw(`"status" = 'REJECT'`),
            Database.from('customer_infos').count(`* as number`).whereRaw(`"status" = 'ACTIVE'`),
            Database.from('customer_infos').count(`* as number`).whereRaw(`"status" = 'INACTIVE'`)
        ]);

        const dataCount = {
            request: req[0],
            draft: draft[0],
            reject: reject[0],
            active: active[0],
            inactive: inactive[0]
        };

        const dataModalExport = {
            customer_type,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
        }

        return view.render("pages/customer/index",
            {
                data: customers,
                statusData, dataCount,
                dataModal: dataModalExport,
                roleId: auth?.user?.role_id
            })
    }

    public async add({ view }: HttpContextContract) {
        const [
            customer_type,
            usaha_pelanggan,
            mitra,
            shipping_line,
            cargo_owner,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
            bank,
            payment_type,
        ] = await Promise.all([
            CustomerType.all(),
            UsahaPelanggan.query().orderBy('name', 'asc'),
            Mitra.query().orderBy('name', 'asc'),
            ShippingLine.query().orderBy('name', 'asc'),
            CargoOwner.query().orderBy('name', 'asc'),
            CustomerGroup.query().orderBy('created_at', 'asc'),
            BentukUsaha.query().whereNull('category').orderBy('created_at', 'asc'),
            ServiceType.query().orderBy('name', 'asc'),
            Country.query().orderBy('country_name', 'asc'),
            Cabang.query().orderBy('name', 'asc'),
            Bank.query().orderBy('name', 'asc'),
            PaymentType.query().orderBy('name', 'asc'),
        ])
        // const customer_type = await CustomerType.all();
        // const usaha_pelanggan = await UsahaPelanggan.query().orderBy('created_at','asc')
        // const mitra = await Mitra.query().orderBy('created_at','asc')
        // const shipping_line = await ShippingLine.all()
        // const cargo_owner = await CargoOwner.all()
        // const customer_group = await CustomerGroup.query().orderBy('created_at','asc')
        // const bentuk_usaha = await BentukUsaha.query().orderBy('created_at','asc');
        // const service_type = await ServiceType.all()
        // const country = await Country.all();
        // const branch = await Cabang.query().orderBy('created_at','asc');
        // const bank = await Bank.query().orderBy('created_at','asc');
        // const payment_type = await PaymentType.query().orderBy('name', 'asc')
        // const location = await Database.from('master_companies').select('id','company_name as name').whereRaw(`"company_group" IN (SELECT gc."id"  FROM "group_companies" gc WHERE gc."type" = 'REGIONAL')`)
        return view.render("pages/customer/create", {
            customer_type,
            usaha_pelanggan,
            mitra,
            shipping_line,
            cargo_owner,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
            bank,
            payment_type,
        })
    }

    public async edit({ view, params }: HttpContextContract) {
        let id = params.id;
        let parentCustomer
        let npwpParent
        const [
            customer_type,
            usaha_pelanggan,
            mitra,
            shipping_line,
            cargo_owner,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
            bank,
            payment_type,
        ] = await Promise.all([
            CustomerType.all(),
            UsahaPelanggan.query().orderBy('name', 'asc'),
            Mitra.query().orderBy('name', 'asc'),
            ShippingLine.query().orderBy('name', 'asc'),
            CargoOwner.query().orderBy('name', 'asc'),
            CustomerGroup.query().orderBy('created_at', 'asc'),
            BentukUsaha.query().whereNull('category').orderBy('created_at', 'asc'),
            ServiceType.query().orderBy('name', 'asc'),
            Country.query().orderBy('country_name', 'asc'),
            Cabang.query().orderBy('name', 'asc'),
            Bank.query().orderBy('name', 'asc'),
            PaymentType.query().orderBy('name', 'asc'),
        ])

        let customer = await RequestCustomerInfo.query()
            .preload('bentukUsaha')
            .preload('billing')
            .preload('branch')
            .preload('cargoOwner')
            .preload('contact',  (query) => {
                query.preload('cabang')
            })
            .preload('country')
            .preload('customerGroup')
            .preload('customerType')
            .preload('document', (query) => {
                query.preload('expDocument')
            })
            .preload('mitra')
            .preload('npwp')
            .preload('postalCode')
            .preload('usahaPelanggan')
            .preload('serviceType')
            .preload('shippingLine')
            .where('id', id)
            .first()
        
        parentCustomer = await CustomerInfo.query().where('nm_perusahaan', `${customer?.parent_customer}`).first()
        npwpParent = await CustomerNpwpv2.query().where("customer_id", `${parentCustomer?.id}`).first()
        
        let link = async (fileName) => {
            let url = await Drive.getUrl(fileName)
            return url
        }

        let url = {
            spmp: customer?.document?.spmp ? await link(customer?.document?.spmp) : '',
            ket_domisili: customer?.document?.ket_domisili ? await link(customer?.document?.ket_domisili) : '',
            ktp_pemimpin_perusahaan: customer?.document?.ktp_pemimpin_perusahaan ? await link(customer?.document?.ktp_pemimpin_perusahaan) : '',
            ktp_pic: customer?.document?.ktp_pic ? await link(customer?.document?.ktp_pic) : '',
            siupal_siupkk: customer?.document?.siupal_siupkk ? await link(customer?.document?.siupal_siupkk) : '',
            siupbm: customer?.document?.siupbm ? await link(customer?.document?.siupbm) : '',
            siup_nib: customer?.document?.siup_nib ? await link(customer?.document?.siup_nib) : '',
            pmku: customer?.document?.pmku ? await link(customer?.document?.pmku) : '',
            akta_perusahaan: customer?.document?.akta_perusahaan ? await link(customer?.document?.akta_perusahaan) : '',
            ref_bank: customer?.document?.ref_bank ? await link(customer?.document?.ref_bank) : '',
            npwp: customer?.document?.npwp ? await link(customer?.document?.npwp) : '',
            pkp_non_pkp: customer?.document?.pkp_non_pkp ? await link(customer?.document?.pkp_non_pkp) : '',
            rek_asosiasi: customer?.document?.rek_asosiasi ? await link(customer?.document?.rek_asosiasi) : '',
            sktd: customer?.document?.sktd ? await link(customer?.document?.sktd) : '',
            cor_dgt: customer?.document?.cor_dgt ? await link(customer?.document?.cor_dgt) : '',
            surat_izin_pengelolaan: customer?.document?.surat_izin_pengelolaan ? await link(customer?.document?.surat_izin_pengelolaan) : '',
            skpt: customer?.document?.skpt ? await link(customer?.document?.skpt) : '',
            siopsus: customer?.document?.siopsus ? await link(customer?.document?.siopsus) : '',
        }

        return view.render("pages/customer/page/outstanding/edit", {
            customer_type,
            usaha_pelanggan,
            mitra,
            shipping_line,
            cargo_owner,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
            bank,
            payment_type,
            data: customer,
            url,
            npwpParent
        })
    }

    public async renewal({ view, params }: HttpContextContract) {
        let id = params.id;
        let parentCustomer
        let npwpParent
        const [
            customer_type,
            usaha_pelanggan,
            mitra,
            shipping_line,
            cargo_owner,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
            bank,
            payment_type,
        ] = await Promise.all([
            CustomerType.all(),
            UsahaPelanggan.query().orderBy('name', 'asc'),
            Mitra.query().orderBy('name', 'asc'),
            ShippingLine.query().orderBy('name', 'asc'),
            CargoOwner.query().orderBy('name', 'asc'),
            CustomerGroup.query().orderBy('created_at', 'asc'),
            BentukUsaha.query().whereNull('category').orderBy('created_at', 'asc'),
            ServiceType.query().orderBy('name', 'asc'),
            Country.query().orderBy('country_name', 'asc'),
            Cabang.query().orderBy('name', 'asc'),
            Bank.query().orderBy('name', 'asc'),
            PaymentType.query().orderBy('name', 'asc'),
        ])

        let customer = await CustomerInfo.query()
            .preload('bentukUsaha')
            .preload('billing')
            .preload('branch')
            .preload('cargoOwner')
            .preload('contact', (query) => {
                query.preload('cabang')
            })
            .preload('country')
            .preload('customerGroup')
            .preload('customerType')
            .preload('document', (query) => {
                query.preload('expDocument')
            })
            .preload('mitra')
            .preload('npwp')
            .preload('postalCode')
            .preload('usahaPelanggan')
            .preload('serviceType')
            .preload('shippingLine')
            .where('id', id)
            .first()

        parentCustomer = await CustomerInfo.query().where('nm_perusahaan', `${customer?.parent_customer}`).first()
        npwpParent = await CustomerNpwpv2.query().where("customer_id", `${parentCustomer?.id}`).first()

        let link = async (fileName) => {
            let url = await Drive.getUrl(fileName)
            return url
        }

        let url = {
            spmp: customer?.document?.spmp ? await link(customer?.document?.spmp) : '',
            ket_domisili: customer?.document?.ket_domisili ? await link(customer?.document?.ket_domisili) : '',
            ktp_pemimpin_perusahaan: customer?.document?.ktp_pemimpin_perusahaan ? await link(customer?.document?.ktp_pemimpin_perusahaan) : '',
            ktp_pic: customer?.document?.ktp_pic ? await link(customer?.document?.ktp_pic) : '',
            siupal_siupkk: customer?.document?.siupal_siupkk ? await link(customer?.document?.siupal_siupkk) : '',
            siupbm: customer?.document?.siupbm ? await link(customer?.document?.siupbm) : '',
            siup_nib: customer?.document?.siup_nib ? await link(customer?.document?.siup_nib) : '',
            pmku: customer?.document?.pmku ? await link(customer?.document?.pmku) : '',
            akta_perusahaan: customer?.document?.akta_perusahaan ? await link(customer?.document?.akta_perusahaan) : '',
            ref_bank: customer?.document?.ref_bank ? await link(customer?.document?.ref_bank) : '',
            npwp: customer?.document?.npwp ? await link(customer?.document?.npwp) : '',
            pkp_non_pkp: customer?.document?.pkp_non_pkp ? await link(customer?.document?.pkp_non_pkp) : '',
            rek_asosiasi: customer?.document?.rek_asosiasi ? await link(customer?.document?.rek_asosiasi) : '',
            sktd: customer?.document?.sktd ? await link(customer?.document?.sktd) : '',
            cor_dgt: customer?.document?.cor_dgt ? await link(customer?.document?.cor_dgt) : '',
            surat_izin_pengelolaan: customer?.document?.surat_izin_pengelolaan ? await link(customer?.document?.surat_izin_pengelolaan) : '',
            skpt: customer?.document?.skpt ? await link(customer?.document?.skpt) : '',
            siopsus: customer?.document?.siopsus ? await link(customer?.document?.siopsus) : '',
        }

        return view.render("pages/customer/page/approved/renewal", {
            customer_type,
            usaha_pelanggan,
            mitra,
            shipping_line,
            cargo_owner,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
            bank,
            payment_type,
            data: customer,
            url,
            npwpParent
        })
    }

    public async view({ params, view }) {
        let id = params.id;
        let npwpParent
        const customer_type = await CustomerType.all();
        const usaha_pelanggan = await UsahaPelanggan.query().orderBy('created_at', 'asc')
        const mitra = await Mitra.query().orderBy('created_at', 'asc')
        const shipping_line = await ShippingLine.all()
        const cargo_owner = await CargoOwner.all()
        const customer_group = await CustomerGroup.query().orderBy('created_at', 'asc')
        const bentuk_usaha = await BentukUsaha.query().orderBy('created_at', 'asc');
        const service_type = await ServiceType.all()
        const country = await Country.all();
        const branch = await Cabang.query().orderBy('created_at', 'asc');
        const bank = await Bank.query().orderBy('created_at', 'asc');
        const payment_type = await PaymentType.query().orderBy('name', 'asc')

        let customer = await RequestCustomerInfo.query()
            .preload('bentukUsaha')
            .preload('billing')
            .preload('branch')
            .preload('cargoOwner')
            .preload('contact',  (query) => {
                query.preload('cabang')
            })
            .preload('country')
            .preload('customerGroup')
            .preload('customerType')
            .preload('document', (query) => {
                query.preload('expDocument')
            })
            .preload('mitra')
            .preload('npwp')
            .preload('postalCode')
            .preload('usahaPelanggan')
            .preload('serviceType')
            .preload('shippingLine')
            .where('id', id)
            .first()

        npwpParent = await CustomerNpwpv2.query().where("name", `${customer?.parent_customer}`).first()

        let link = async (fileName) => {
            let url = await Drive.getUrl(fileName)
            return url
        }

        let url = {
            spmp: customer?.document?.spmp ? await link(customer?.document?.spmp) : '',
            ket_domisili: customer?.document?.ket_domisili ? await link(customer?.document?.ket_domisili) : '',
            ktp_pemimpin_perusahaan: customer?.document?.ktp_pemimpin_perusahaan ? await link(customer?.document?.ktp_pemimpin_perusahaan) : '',
            ktp_pic: customer?.document?.ktp_pic ? await link(customer?.document?.ktp_pic) : '',
            siupal_siupkk: customer?.document?.siupal_siupkk ? await link(customer?.document?.siupal_siupkk) : '',
            siupbm: customer?.document?.siupbm ? await link(customer?.document?.siupbm) : '',
            siup_nib: customer?.document?.siup_nib ? await link(customer?.document?.siup_nib) : '',
            pmku: customer?.document?.pmku ? await link(customer?.document?.pmku) : '',
            akta_perusahaan: customer?.document?.akta_perusahaan ? await link(customer?.document?.akta_perusahaan) : '',
            ref_bank: customer?.document?.ref_bank ? await link(customer?.document?.ref_bank) : '',
            npwp: customer?.document?.npwp ? await link(customer?.document?.npwp) : '',
            pkp_non_pkp: customer?.document?.pkp_non_pkp ? await link(customer?.document?.pkp_non_pkp) : '',
            rek_asosiasi: customer?.document?.rek_asosiasi ? await link(customer?.document?.rek_asosiasi) : '',
            sktd: customer?.document?.sktd ? await link(customer?.document?.sktd) : '',
            cor_dgt: customer?.document?.cor_dgt ? await link(customer?.document?.cor_dgt) : '',
            surat_izin_pengelolaan: customer?.document?.surat_izin_pengelolaan ? await link(customer?.document?.surat_izin_pengelolaan) : '',
            skpt: customer?.document?.skpt ? await link(customer?.document?.skpt) : '',
            siopsus: customer?.document?.siopsus ? await link(customer?.document?.siopsus) : '',
        }

        return view.render("pages/customer/page/outstanding/view", {
            customer_type,
            usaha_pelanggan,
            mitra,
            shipping_line,
            cargo_owner,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
            bank,
            payment_type,
            data: customer,
            url,
            npwpParent
        })
    }

    public async viewApproved({ params, view }) {
        let id = params.id;
        let npwpParent
        const customer_type = await CustomerType.all();
        const usaha_pelanggan = await UsahaPelanggan.query().orderBy('created_at', 'asc')
        const mitra = await Mitra.query().orderBy('created_at', 'asc')
        const shipping_line = await ShippingLine.all()
        const cargo_owner = await CargoOwner.all()
        const customer_group = await CustomerGroup.query().orderBy('created_at', 'asc')
        const bentuk_usaha = await BentukUsaha.query().orderBy('created_at', 'asc');
        const service_type = await ServiceType.all()
        const country = await Country.all();
        const branch = await Cabang.query().orderBy('created_at', 'asc');
        const bank = await Bank.query().orderBy('created_at', 'asc');
        const payment_type = await PaymentType.query().orderBy('name', 'asc')

        let customer = await CustomerInfo.query()
            .preload('bentukUsaha')
            .preload('billing')
            .preload('branch')
            .preload('cargoOwner')
            .preload('contact',  (query) => {
                query.preload('cabang')
            })
            .preload('country')
            .preload('customerGroup')
            .preload('customerType')
            .preload('document', (query) => {
                query.preload('expDocument')
            })
            .preload('mitra')
            .preload('npwp')
            .preload('postalCode')
            .preload('usahaPelanggan')
            .preload('serviceType')
            .preload('shippingLine')
            .where('id', id)
            .first()

        npwpParent = await CustomerNpwpv2.query().where("name", `${customer?.parent_customer}`).first()


        let link = async (fileName) => {
            let url = await Drive.getUrl(fileName)
            return url
        }

        let url = {
            spmp: customer?.document?.spmp ? await link(customer?.document?.spmp) : '',
            ket_domisili: customer?.document?.ket_domisili ? await link(customer?.document?.ket_domisili) : '',
            ktp_pemimpin_perusahaan: customer?.document?.ktp_pemimpin_perusahaan ? await link(customer?.document?.ktp_pemimpin_perusahaan) : '',
            ktp_pic: customer?.document?.ktp_pic ? await link(customer?.document?.ktp_pic) : '',
            siupal_siupkk: customer?.document?.siupal_siupkk ? await link(customer?.document?.siupal_siupkk) : '',
            siupbm: customer?.document?.siupbm ? await link(customer?.document?.siupbm) : '',
            siup_nib: customer?.document?.siup_nib ? await link(customer?.document?.siup_nib) : '',
            pmku: customer?.document?.pmku ? await link(customer?.document?.pmku) : '',
            akta_perusahaan: customer?.document?.akta_perusahaan ? await link(customer?.document?.akta_perusahaan) : '',
            ref_bank: customer?.document?.ref_bank ? await link(customer?.document?.ref_bank) : '',
            npwp: customer?.document?.npwp ? await link(customer?.document?.npwp) : '',
            pkp_non_pkp: customer?.document?.pkp_non_pkp ? await link(customer?.document?.pkp_non_pkp) : '',
            rek_asosiasi: customer?.document?.rek_asosiasi ? await link(customer?.document?.rek_asosiasi) : '',
            sktd: customer?.document?.sktd ? await link(customer?.document?.sktd) : '',
            cor_dgt: customer?.document?.cor_dgt ? await link(customer?.document?.cor_dgt) : '',
            surat_izin_pengelolaan: customer?.document?.surat_izin_pengelolaan ? await link(customer?.document?.surat_izin_pengelolaan) : '',
            skpt: customer?.document?.skpt ? await link(customer?.document?.skpt) : '',
            siopsus: customer?.document?.siopsus ? await link(customer?.document?.siopsus) : '',
        }
        
        return view.render("pages/customer/page/approved/view", {
            customer_type,
            usaha_pelanggan,
            mitra,
            shipping_line,
            cargo_owner,
            customer_group,
            bentuk_usaha,
            service_type,
            country,
            branch,
            bank,
            payment_type,
            data: customer,
            url,
            npwpParent
        })
    }

    public async store({ request, response, auth }: HttpContextContract) {

        const schemaID: string = 'b11b01d7-f3d4-48a7-8131-fe2ae01995c5';
        const master_type_id: string = 'a41588f8-97bf-4cc0-8a9f-2f252c0b54a2';
        const schema = await SchemaAplication.query().select('id').whereRaw(`"role_id" = '${auth.user?.role_id}' and "master_type_id" = '${master_type_id}'`).first();
        const entity_id = await Role.query().select('entity_id').where('id', `${auth.user?.role_id}`).first();
        const customer_number_count = await RequestCustomerInfo.query().max('no_customer').first();
        const requestCustomer = await RequestCustomerInfo.query().max('no_request').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE+7/24)`).first();
        const contact_loc = request.input('contact_loc') ? request.input('contact_loc') : []
        let affiliasi_max: number = 0;
        let no_affiliasi: any;

        const customer_info = new RequestCustomerInfo()
        customer_info.nm_perusahaan = request.input('nm_perusahaan')
        customer_info.email = request.input('email')
        customer_info.phone = request.input('phone')
        customer_info.address = request.input('address')
        customer_info.nm_pemimpin = request.input('nm_pemimpin')
        customer_info.parent_customer = request.input('parent_customer')
        customer_info.principle = request.input('principle')
        customer_info.join_date = request.input('join_date') ? new Date(request.input('join_date')) : null
        customer_info.establish_date = request.input('establish_date') ? new Date(request.input('establish_date')) : null
        customer_info.birthday_date = request.input('birthday_date') ? new Date(request.input('birthday_date')) : null
        customer_info.birthday_pemimpin_date = request.input('birthday_pemimpin_date') ? new Date(request.input('birthday_pemimpin_date')) : null
        customer_info.group_customer_id = request.input('group_customer_id')
        customer_info.customer_type_id = request.input('customer_type_id')
        customer_info.bentuk_usaha_id = request.input('bentuk_usaha_id')
        customer_info.country_id = request.input('country_id')
        customer_info.area_id = request.input('area_id')
        customer_info.branch_id = request.input('branch_id')
        customer_info.is_bebas_pajak = request.input('is_bebas_pajak')
        customer_info.tp_company = request.input('tp_company')
        customer_info.tp_nm_perusahaan = request.input('tp_nm_perusahaan')
        customer_info.no_pmku = request.input('no_pmku')
        customer_info.no_sktd = request.input('no_sktd')
        customer_info.status = request.input('status')
        customer_info.submitter = auth?.user?.id ? auth?.user?.id : ''
        customer_info.entity_id = entity_id?.entity_id ? entity_id?.entity_id : ''
        customer_info.master_type_id = master_type_id
        customer_info.schema_id = schema?.id ? schema?.id : schemaID
        customer_info.no_request = MasterCustomer.requestNumber(requestCustomer?.$extras['MAX("NO_REQUEST")'] ? requestCustomer?.$extras['MAX("NO_REQUEST")'] : '0');

        if (request.input('parent_customer')) {
            let parent_customer = request.input('parent_customer')
            const affiliasi_count = await CustomerInfo.query().max('no_affiliasi').where('parent_customer', `${parent_customer}`).first()
            no_affiliasi = await CustomerInfo.query().select('no_customer').where('nm_perusahaan', `${parent_customer}`).first()
            affiliasi_max = affiliasi_count?.$extras['MAX("NO_AFFILIASI")'] ? affiliasi_count?.$extras['MAX("NO_AFFILIASI")'] : 0;
        }

        if (request.input('tp_company') == '1') {
            customer_info.no_customer = MasterCustomer.customerNumber(customer_number_count?.$extras['MAX("NO_CUSTOMER")'] ? customer_number_count?.$extras['MAX("NO_CUSTOMER")'] : 0);
        } else {
            customer_info.no_customer = MasterCustomer.customerNumber(customer_number_count?.$extras['MAX("NO_CUSTOMER")'] ? customer_number_count?.$extras['MAX("NO_CUSTOMER")'] : 0);
            customer_info.no_affiliasi = MasterCustomer.affiliateNumber(no_affiliasi?.no_customer?.toString(), affiliasi_max);

        }

        const expDocument = new RequestCustomerExpDocument()
        expDocument.exp_ket_domisili = request.input('exp_ket_domisili') ? new Date(request.input('exp_ket_domisili')) : null;
        expDocument.exp_siupal_siupkk = request.input('exp_siupal_siupkk') ? new Date(request.input('exp_siupal_siupkk')) : null;
        expDocument.exp_siupbm = request.input('exp_siupbm') ? new Date(request.input('exp_siupbm')) : null;
        expDocument.exp_siup_nib = request.input('exp_siup_nib') ? new Date(request.input('exp_siup_nib')) : null;
        expDocument.exp_sktd = request.input('exp_sktd') ? new Date(request.input('exp_sktd')) : null;
        expDocument.exp_cor_dgt = request.input('exp_cor_dgt') ? new Date(request.input('exp_cor_dgt')) : null;
        expDocument.exp_surat_izin_pengelolaan = request.input('exp_surat_izin_pengelolaan') ? new Date(request.input('exp_surat_izin_pengelolaan')) : null;
        expDocument.exp_skpt = request.input('exp_skpt') ? new Date(request.input('exp_skpt')) : null;
        expDocument.exp_siopsus = request.input('exp_siopsus') ? new Date(request.input('exp_siopsus')) : null;
        expDocument.start_date_sktd = request.input('start_date_sktd') ? new Date(request.input('start_date_sktd')) : null;

        const trx = await Database.transaction();
        // return console.log(customer_info)
        try {
            const data = await customer_info.useTransaction(trx).save()
            const customer_related = await RequestCustomerInfo.query({ client: trx }).where("id", data?.id).first()
            if (request.input('usaha_pelanggan')) {
                await customer_related?.related('usahaPelanggan').createMany(request.input('usaha_pelanggan'))
            }
            if (request.input('mitra')) {
                await customer_related?.related('mitra').createMany(request.input('mitra'))
            }
            if (request.input('shipping_line')) {
                await customer_related?.related('shippingLine').createMany(request.input('shipping_line'))
            }
            if (request.input('cargo_owner')) {
                await customer_related?.related('cargoOwner').createMany(request.input('cargo_owner'))
            }
            if (request.input('service_type')) {
                await customer_related?.related('serviceType').createMany(request.input('service_type'))
            }
            // npwp, contact
            await customer_related?.related('npwp').create(request.input('npwp'))
            // if (request.input('contact')) {
            const contact = await customer_related?.related('contact').createMany(request.input('contact'))
            // // }
            
            // const contact_related = await RequestCustomerContact.query({ client: trx }).whereIn("id", idContact)
            // if(contact_related.length > 0) {
            //     contact_related.forEach(async function (contact, index) {
            //         await contact?.related('cabang').createMany(contact_loc.length > 0 ? contact_loc[index] : [])
            //     })
            // }
            
            // billing
            const billing = await customer_related?.related('billing').createMany(request.input('billing'))
            // const idBilling: string[] = billing ? billing?.map(data => data?.id) : []
            // const billing_related = await RequestCustomerBilling.query({ client: trx }).whereIn("id", idBilling)

            // if (billing_related.length > 0) {
            //     billing_related.forEach(async function (billing, index) {
            //         if (payment.length > 0) {
            //             await billing?.related('paymentType').createMany(payment[index])
            //         }
            //     })
            // }

            const document = await customer_related?.related('document').create(request.input('document'))
            const document_related = await RequestCustomerDocument.query({ client: trx }).where("id", document.id).first()
            await document_related?.related('expDocument').save(expDocument)

            if (request.input("status") == "REQUEST") {
                this.sendApprovedNotif("SUBMITED", "", customer_related?.no_request, auth.user?.id, schema?.id, customer_related?.submitter, master_type_id,
                    "Request Approval Master Data Pelanggan")
            }

            await trx.commit()

            if (trx.isCompleted) {
                const idContact: string[] = contact ? contact?.map(data => data?.id) : []
                const contact_related = await RequestCustomerContact.query().whereIn("id", idContact)
                contact_related.forEach(async function (contact, index) {
                    await contact?.related('cabang').createMany(contact_loc.length > 0 ? contact_loc[index] : [])
                })
            }

            let result = {
                "message": request.input('status') == "REQUEST" ? "Data Customer Berhasil Dibuat" : "Data Berhasil Disimpan Sebagai Draft",
            }

            return response.status(200).send(result)
        } catch (error) {
            await trx.rollback()
            console.log(error)
            let result = {
                "message": "Data Customer Gagal Dibuat",
                "detail": error.message
            }
            return response.status(500).send(result)
        }
    }

    public async updateData({ params, request, response, auth }: HttpContextContract) {
        const id = params.id
        const schemaID: string = 'b11b01d7-f3d4-48a7-8131-fe2ae01995c5';
        const master_type_id: string = 'a41588f8-97bf-4cc0-8a9f-2f252c0b54a2';
        const schema = await SchemaAplication.query().select('id').whereRaw(`"role_id" = '${auth.user?.role_id}' and "master_type_id" = '${master_type_id}'`).first();
        const entity_id = await Role.query().select('entity_id').where('id', `${auth.user?.role_id}`).first();
        const contact_loc = request.input('contact_loc') ? request.input('contact_loc') : []
        let affiliasi_max: number = 0;
        let no_affiliasi: any;

        const customer_info = await RequestCustomerInfo.findByOrFail("id", id)
        const npwp = await RequestCustomerNpwp.findByOrFail("request_customer_id", id)
        const document = await RequestCustomerDocument.findByOrFail("request_customer_id", id)
        const exp_document = await RequestCustomerExpDocument.findByOrFail("customer_document_id", document.id)
        customer_info.nm_perusahaan = request.input('nm_perusahaan')
        customer_info.email = request.input('email')
        customer_info.phone = request.input('phone')
        customer_info.address = request.input('address')
        customer_info.nm_pemimpin = request.input('nm_pemimpin')
        customer_info.parent_customer = request.input('parent_customer')
        customer_info.join_date = request.input('join_date') ? new Date(request.input('join_date')) : null
        customer_info.principle = request.input('principle')
        customer_info.join_date = request.input('join_date') ? new Date(request.input('join_date')) : null
        customer_info.establish_date = request.input('establish_date') ? new Date(request.input('establish_date')) : null
        customer_info.birthday_date = request.input('birthday_date') ? new Date(request.input('birthday_date')) : null
        customer_info.birthday_pemimpin_date = request.input('birthday_pemimpin_date') ? new Date(request.input('birthday_pemimpin_date')) : null
        customer_info.group_customer_id = request.input('group_customer_id')
        customer_info.customer_type_id = request.input('customer_type_id')
        customer_info.bentuk_usaha_id = request.input('bentuk_usaha_id')
        customer_info.country_id = request.input('country_id')
        customer_info.area_id = request.input('area_id')
        customer_info.branch_id = request.input('branch_id')
        customer_info.is_bebas_pajak = request.input('is_bebas_pajak')
        customer_info.tp_company = request.input('tp_company')
        customer_info.tp_nm_perusahaan = request.input('tp_nm_perusahaan')
        customer_info.no_pmku = request.input('no_pmku')
        customer_info.no_sktd = request.input('no_sktd')
        customer_info.status = request.input('status')
        customer_info.submitter = auth?.user?.id ? auth?.user?.id : ""
        customer_info.entity_id = entity_id?.entity_id ? entity_id?.entity_id : ''
        customer_info.master_type_id = master_type_id
        customer_info.schema_id = schema?.id ? schema?.id : schemaID

        if (request.input('parent_customer')) {
            let parent_customer = request.input('parent_customer')
            const affiliasi_count = await CustomerInfo.query().max('no_affiliasi').where('parent_customer', `${parent_customer}`).first()
            no_affiliasi = await CustomerInfo.query().select('no_customer').where('nm_perusahaan', `${parent_customer}`).first()
            affiliasi_max = affiliasi_count?.$extras['MAX("NO_AFFILIASI")'] ? affiliasi_count?.$extras['MAX("NO_AFFILIASI")'] : 0;
        }

        if (request.input('tp_company') == '1') {
            customer_info.no_customer = request.input('no_customer');
        } else {
            customer_info.no_customer = request.input('no_customer');
            customer_info.no_affiliasi = request.input('no_affiliasi') ? request.input('no_affiliasi') : MasterCustomer.affiliateNumber(no_affiliasi?.no_customer?.toString(), affiliasi_max);

        }
        
        const trx = await Database.transaction();
        try {
            const data = await customer_info.useTransaction(trx).save()
            await npwp.useTransaction(trx).merge(request.input('npwp')).save()
            await document.useTransaction(trx).merge(request.input('document')).save()
            await exp_document.useTransaction(trx).merge(request.input('exp_document')).save()
            // delete data pivot
            await Promise.all([
                PivotUsahaMitra.query().useTransaction(trx).where('request_customer_id', id).delete(),
                PivotUsahaMitra.query().useTransaction(trx).where('request_customer_id', id).delete(),
                PivotShippingLine.query().useTransaction(trx).where('request_customer_id', id).delete(),
                PivotCargoOwner.query().useTransaction(trx).where('request_customer_id', id).delete(),
                PivotServiceType.query().useTransaction(trx).where('request_customer_id', id).delete(),
                RequestCustomerContact.query().useTransaction(trx).where('request_customer_id', id).delete(),
                RequestCustomerBilling.query().useTransaction(trx).where('request_customer_id', id).delete(),
            ])
            // create data pivot
            const customer_related = await RequestCustomerInfo.query({ client: trx }).where("id", data?.id).first()
            if (request.input('usaha_pelanggan')) {
                request.input('usaha_pelanggan') ? await customer_related?.related('usahaPelanggan').createMany(request.input('usaha_pelanggan')) : ''
            }
            if (request.input('mitra')) {
                request.input('mitra') ? await customer_related?.related('mitra').createMany(request.input('mitra')) : ''
            }
            if (request.input('shipping_line')) {
                request.input('shipping_line') ? await customer_related?.related('shippingLine').createMany(request.input('shipping_line')) : ''
            }
            if (request.input('cargo_owner')) {
                request.input('cargo_owner') ? await customer_related?.related('cargoOwner').createMany(request.input('cargo_owner')) : ''
            }
            if (request.input('service_type')) {
                request.input('service_type') ? await customer_related?.related('serviceType').createMany(request.input('service_type')) : ''
            }

            // billing and contact contact
            // if (request.input('contact')) {
            const contact = await customer_related?.related('contact').createMany(request.input('contact'))
            const idContact: string[] = contact ? contact?.map(data => data?.id) : []
            // }
            const billing = await customer_related?.related('billing').createMany(request.input('billing'))
            // const idBilling: string[] = billing ? billing?.map(data => data?.id) : []

            if (request.input("status") == "REQUEST" && request.input("is-reject") != "REJECT") {
                this.sendApprovedNotif("SUBMITED", request.input("remarks"), customer_related?.no_request, auth.user?.id, schema?.id, customer_related?.submitter, master_type_id,
                    "Request Approval Master Data Pelanggan")
            }

            if (request.input("is-reject") == "REJECT") {
                this.sendApprovedNotif("UPDATED", request.input("remarks"), customer_related?.no_request, auth.user?.id, schema?.id, customer_related?.submitter, master_type_id,
                    "Request Approval Master Data Pelanggan")
            }

            await trx.commit()
            if (trx.isCompleted) {
                const contact_related = await RequestCustomerContact.query().whereIn("id", idContact)
                contact_related.forEach(async function (contact, index) {
                    await contact?.related('cabang').createMany(contact_loc.length > 0 ? contact_loc[index] : [])
                })
                //     const billing_related = await RequestCustomerBilling.query().whereIn("id", idBilling)
                //     billing_related.forEach(async function (billing, index) {
                //         await billing?.related('paymentType').createMany(payment.length > 0 ? payment[index] : [])
                //     })
            }

            let result = {
                "message": request.input('status') == "REQUEST" ? "Data Customer Berhasil Dibuat" : "Data Berhasil Disimpan Sebagai Draft",
            }

            return response.status(200).send(result)
        } catch (error) {
            await trx.rollback()
            console.log(error)
            let result = {
                "message": "Data Customer Gagal Dibuat",
                "detail": error.message
            }
            return response.status(500).send(result)
        }
    }

    public async storeRenewal({ request, response, auth }: HttpContextContract) {
        const schemaID: string = 'b11b01d7-f3d4-48a7-8131-fe2ae01995c5';
        const master_type_id: string = 'a41588f8-97bf-4cc0-8a9f-2f252c0b54a2';
        const schema = await SchemaAplication.query().select('id').whereRaw(`"role_id" = '${auth.user?.role_id}' and "master_type_id" = '${master_type_id}'`).first();
        const entity_id = await Role.query().select('entity_id').where('id', `${auth.user?.role_id}`).first();
        // const customer_number_count = await RequestCustomerInfo.query().max('no_customer').first();
        const requestCustomer = await RequestCustomerInfo.query().max('no_request').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE+7/24)`).first();
        const contact_loc = request.input('contact_loc') ? request.input('contact_loc') : []
        const id = request.input('customer_id')
        const customer_sap = await CustomerInfo.query().select("sap_code").where("id", id).first()
        let affiliasi_max: number = 0;
        let no_affiliasi: any;

        const customer_info = new RequestCustomerInfo()
        customer_info.nm_perusahaan = request.input('nm_perusahaan')
        customer_info.email = request.input('email')
        customer_info.phone = request.input('phone')
        customer_info.address = request.input('address')
        customer_info.nm_pemimpin = request.input('nm_pemimpin')
        customer_info.parent_customer = request.input('parent_customer')
        customer_info.principle = request.input('principle')
        customer_info.join_date = request.input('join_date') ? new Date(request.input('join_date')) : null
        customer_info.establish_date = request.input('establish_date') ? new Date(request.input('establish_date')) : null
        customer_info.birthday_date = request.input('birthday_date') ? new Date(request.input('birthday_date')) : null
        customer_info.birthday_pemimpin_date = request.input('birthday_pemimpin_date') ? new Date(request.input('birthday_pemimpin_date')) : null
        customer_info.group_customer_id = request.input('group_customer_id')
        customer_info.customer_type_id = request.input('customer_type_id')
        customer_info.bentuk_usaha_id = request.input('bentuk_usaha_id')
        customer_info.country_id = request.input('country_id')
        customer_info.area_id = request.input('area_id')
        customer_info.branch_id = request.input('branch_id')
        customer_info.is_bebas_pajak = request.input('is_bebas_pajak')
        customer_info.tp_company = request.input('tp_company')
        customer_info.tp_nm_perusahaan = request.input('tp_nm_perusahaan')
        customer_info.no_pmku = request.input('no_pmku')
        customer_info.no_sktd = request.input('no_sktd')
        customer_info.status = request.input('status')
        customer_info.reference_id = request.input('customer_id')
        customer_info.sap_code = customer_sap?.sap_code
        customer_info.submitter = auth?.user?.id ? auth?.user?.id : ""
        customer_info.entity_id = entity_id?.entity_id ? entity_id?.entity_id : ''
        customer_info.master_type_id = master_type_id
        customer_info.schema_id = schema?.id ? schema?.id : schemaID
        customer_info.no_request = MasterCustomer.requestNumber(requestCustomer?.$extras['MAX("NO_REQUEST")'] ? requestCustomer?.$extras['MAX("NO_REQUEST")'] : '0');
        if (request.input('parent_customer')) {
            let parent_customer = request.input('parent_customer')
            const affiliasi_count = await CustomerInfo.query().max('no_affiliasi').where('parent_customer', `${parent_customer}`).first()
            no_affiliasi = await CustomerInfo.query().select('no_customer').where('nm_perusahaan', `${parent_customer}`).first()
            affiliasi_max = affiliasi_count?.$extras['MAX("NO_AFFILIASI")'] ? affiliasi_count?.$extras['MAX("NO_AFFILIASI")'] : 0;
        }

        if (request.input('tp_company') == '1') {
            customer_info.no_customer = request.input('no_customer');
        } else {
            customer_info.no_customer = request.input('no_customer');
            customer_info.no_affiliasi = request.input('no_affiliasi') ? request.input('no_affiliasi') : MasterCustomer.affiliateNumber(no_affiliasi?.no_customer?.toString(), affiliasi_max);

        }
        const trx = await Database.transaction();

        try {
            const data = await customer_info.useTransaction(trx).save()
            const customer_related = await RequestCustomerInfo.query({ client: trx }).where("id", data?.id).first()
            if (request.input('usaha_pelanggan')) {
                await customer_related?.related('usahaPelanggan').createMany(request.input('usaha_pelanggan'))
            }
            if (request.input('mitra')) {
                await customer_related?.related('mitra').createMany(request.input('mitra'))
            }
            if (request.input('shipping_line')) {
                await customer_related?.related('shippingLine').createMany(request.input('shipping_line'))
            }
            if (request.input('cargo_owner')) {
                await customer_related?.related('cargoOwner').createMany(request.input('cargo_owner'))
            }
            if (request.input('service_type')) {
                await customer_related?.related('serviceType').createMany(request.input('service_type'))
            }
            // npwp, contact
            await customer_related?.related('npwp').create(request.input('npwp'))
            // if (request.input('contact')) {
            const contact = await customer_related?.related('contact').createMany(request.input('contact'))
            const idContact: string[] = contact ? contact?.map(data => data?.id) : []
            // }
            // billing
            const billing = await customer_related?.related('billing').createMany(request.input('billing'))
            // const idBilling: string[] = billing ? billing?.map(data => data?.id) : []

            const document = await customer_related?.related('document').create(request.input('document'))
            const document_related = await RequestCustomerDocument.query({ client: trx }).where("request_customer_id", data?.id ? data?.id : "").first()
            await document_related?.related('expDocument').create(request.input('exp_document'))

            if (request.input("status") == "REQUEST") {
                this.sendApprovedNotif("SUBMITED", request.input("remarks"), customer_related?.no_request, auth.user?.id, schema?.id, customer_related?.submitter, master_type_id,
                    "Request Approval Master Data Pelanggan")
            }

            await trx.commit()

            if (trx.isCompleted) {
                const contact_related = await RequestCustomerContact.query().whereIn("id", idContact)
                contact_related.forEach(async function (contact, index) {
                    await contact?.related('cabang').createMany(contact_loc.length > 0 ? contact_loc[index] : [])
                })
                // const billing_related = await RequestCustomerBilling.query().whereIn("id", idBilling)
                // billing_related.forEach(async function (billing, index) {
                //     await billing?.related('paymentType').createMany(payment.length > 0 ? payment[index] : [{payment_types_id: ''}])
                // })

                const updateData = await CustomerInfo.findByOrFail("id", id)
                updateData.is_edit = 1
                await updateData.save()
            }

            let result = {
                "message": "Data Customer Berhasil Dibuat"
            }

            return response.status(200).send(result)
        } catch (error) {
            await trx.rollback()
            console.log(error)
            let result = {
                "message": "Data Customer Gagal Dibuat",
                "detail": error.message
            }
            return response.status(500).send(result)
        }
    }

    public async destroy({ response, params, bouncer }: HttpContextContract) {
        const id = params.id
        const trx = await Database.transaction();
        try {
            const customer = await RequestCustomerInfo.findBy("id", id)

            if (customer?.reference_id) {
                const customerActive = await CustomerInfo.findBy("id", customer?.reference_id)
                await customerActive?.merge({ is_edit: 0 }).save()
            }

            const approvalHeader = await ApprovalHeader.findBy("no_request", customer?.no_request);
            const approvalLog = await ApprovalLog.findBy("request_no", customer?.no_request);

            if (approvalHeader) {
                const approvalDetail = await ApprovalDetail.findBy("header_id", approvalHeader?.id);
                await approvalDetail?.useTransaction(trx).delete();
                await approvalHeader?.useTransaction(trx).delete();
                await approvalLog?.useTransaction(trx).delete();
                await customer?.useTransaction(trx).delete();
            } else {
                await customer?.useTransaction(trx).delete();
            }

            await trx.commit();
            return response.redirect().toRoute('master-customer')
        } catch (error) {
            await trx.rollback();
            return error
        }
    }

    public async updateStatus({ request, response, params, bouncer }: HttpContextContract) {
        const id = params.id;
        const status = request.input('status');
        // await MasterCustomer.approvedRenewal('CUST20230620002')
        // return console.log('testing')
        const trx = await Database.transaction()
        try {
            const updateStatus = await CustomerInfo.findByOrFail('id', id);
            updateStatus.status = status;
            await updateStatus.useTransaction(trx).save();
            await trx.commit()
            let result = {
                message: "Status data berhasil diubah",
                data: {
                    nama: updateStatus.nm_perusahaan,
                    status: updateStatus.status
                }
            }
            return response.status(200).send(result)
        } catch (error) {
            await trx.rollback()
            let result = {
                message: "Status data gagal diubah"
            }

            return response.status(500).send(result)
        }
    }

    public async uploadFile({ request, response }: HttpContextContract) {
        // const s3 = new AWS.S3({
        //     accessKeyId: Env.get('S3_KEY'),
        //     secretAccessKey: Env.get('S3_SECRET'),
        //     region: Env.get('S3_REGION'),     
        // })

        // const params = {
        //     ACL: 'public-read',
        //     Bucket: Env.get('S3_BUCKET'),
        //     Body: fs.createReadStream(path?.tmpPath!),
        //     Key: `${nameFile}`
        // };

        let path = request.file('inputFile', {
            size: '2mb',
            extnames: ['pdf', 'PDF'],

        });
        let file = fs.readFileSync(path?.tmpPath!)
        const fieldName = request.input('fieldInput')
        const nameFile = new Date().getTime().toString() + `-` + `${fieldName}` + `-` + `${path?.clientName}`
        
        const client = new S3Client({
            region: Env.get('S3_REGION'),
            endpoint: Env.get('S3_ENDPOINT'),
            credentials: {
                accessKeyId: Env.get('S3_KEY'),
                secretAccessKey: Env.get('S3_SECRET'),
            }
        })
        const command = new PutObjectCommand({
            ACL: 'public-read',
            Bucket: Env.get('S3_BUCKET'),
            Body: file,
            Key: `${nameFile}`
            // Body: fs.createReadStream(path?.tmpPath!),
        })
        try {
            if (!path?.isValid) {
                const data = {
                    error: path?.hasErrors,
                    message: path?.errors[0].message
                }
                return response.send(data)
            }
            // const result = await s3.upload(params).promise()
            await client.send(command)
            // console.log(nameFile);
            
            return response.send(nameFile)
        } catch (error) {
            return response.send(error)
        }

    }

    public async approval({ request, response, auth }: HttpContextContract) {
        const trx = await Database.transaction()
        try {
            const noRequest = request.input("no_request");
            const remark = request.input("remark");
            // console.log(noRequest, "no request")
            // console.log(remark)
            let approvalSequence = 0;
            let approvalHeaderId = "";

            const requestCustomer = await RequestCustomerInfo.query().where('no_request', noRequest).first()
            const masterSchemaId = requestCustomer?.schema_id
            const status = requestCustomer?.status
            const submitter = requestCustomer?.submitter
            const masterType = requestCustomer?.master_type_id
            const schema = await SchemaAplication.query().where("id", `${masterSchemaId}`).preload("approvalList").first();
            const SchemaApprovalMax = await SchemaApprovalList.query().where("schema_id", `${schema?.id}`).orderBy("approval_order", "desc").first();
            const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
            const approvalRoleMandatory: any = [];
            const approvalRoleOptional: any = [];
            let step = 1;

            if (approveHeader) {
                approvalSequence = approveHeader.approval_sequence;
                step = approveHeader.step;
            }

            const nextApprovalSequece = approvalSequence + 1;
            schema?.approvalList.forEach(function (value) {
                if (value.mandatory == "1" && value.approval_order == `${nextApprovalSequece}`) {
                    approvalRoleMandatory.push(value.role_id);
                }

                if (value.mandatory == "0" && value.approval_order == `${nextApprovalSequece}`) {
                    approvalRoleOptional.push(value.role_id);
                }
            });

            if (!schema) {
                throw new Exception("Schema Not Found");
            }

            if (status == "REJECT" || status == "DRAFT") {
                throw new Exception("Data Customer Masih Dalam Perbaikan");
            }

            if (status == "ACTIVE") {
                throw new Exception("Data Customer Sudah Selesai Prosess Persetujuan");
            }

            const userApprove = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece).where("role_id", `${auth.user?.role_id}`).first();
            if (!userApprove) {
                throw new Exception("Anda Tidak Mempunyai Aksess Untuk Melakukan Approval Selanjutnya");
            }

            if (!approveHeader) {
                const approvalHeader = new ApprovalHeader();
                approvalHeader.no_request = noRequest;
                approvalHeader.total_approve = SchemaApprovalMax?.approval_order ? parseInt(SchemaApprovalMax?.approval_order) : 0;
                approvalHeader.id_submitter = `${auth.user?.id}`;
                approvalHeader.approval_sequence = 0;
                approvalHeader.step = 1;
                // approvalHeader.useTransaction(trx)
                await approvalHeader.save();
                approvalHeaderId = approvalHeader.id;
            } else {
                approvalHeaderId = approveHeader.id;
            }

            const cekApproval = await ApprovalDetail.query().where("header_id", approvalHeaderId).where("step", step).where("sequence", nextApprovalSequece).where("role_id", `${auth.user?.role_id}`).first();

            if (cekApproval) {
                throw new Exception("Anda Sudah Melakukan Approval Sebelumnya");
            }

            const approvalDetail = new ApprovalDetail();
            approvalDetail.user_id = `${auth.user?.id}`;
            approvalDetail.validation = "APPROVE";
            approvalDetail.header_id = approvalHeaderId;
            approvalDetail.remark = remark;
            approvalDetail.sequence = nextApprovalSequece;
            approvalDetail.role_id = `${auth.user?.role_id}`;
            approvalDetail.step = step;
            // approvalDetail.useTransaction(trx)
            await approvalDetail.save();

            let allowedOptional = true;
            const isMandatory = await ApprovalDetail.query().where("header_id", approvalHeaderId).whereIn("role_id", approvalRoleMandatory).where("step", step).where("sequence", nextApprovalSequece);
            if (approvalRoleOptional.length > 0) {
                const isOptional = await ApprovalDetail.query().where("header_id", approvalHeaderId).whereIn("role_id", approvalRoleOptional).where("step", step).where("sequence", nextApprovalSequece);
                if (isOptional.length == 0) {
                    allowedOptional = false;
                }
            }

            if (isMandatory.length == approvalRoleMandatory.length && allowedOptional) {
                const approvalHeader = await ApprovalHeader.findOrFail(approvalHeaderId);
                approvalHeader.approval_sequence = nextApprovalSequece;
                // approvalHeader.useTransaction(trx)
                await approvalHeader.save();
                let approvedData: any
                if (`${nextApprovalSequece}` == SchemaApprovalMax?.approval_order) {
                    if (requestCustomer?.reference_id) {
                        approvedData = await MasterCustomer.approvedRenewal(requestCustomer?.no_request)
                        await SapIntegration.update(approvedData.customer_id)
                    } else {
                        approvedData = await MasterCustomer.approvedData(requestCustomer?.no_request)
                        // send data to SAP
                        if (!requestCustomer?.sap_code) {
                            await SapIntegration.create(approvedData.customer_id)
                        } else {
                            await SapIntegration.update(approvedData.customer_id)
                        }
                    }

                    if (approvedData.message == 'success') {
                        const UpdateRequestCustomer = await RequestCustomerInfo.findOrFail(requestCustomer?.id);
                        UpdateRequestCustomer.status = "COMPLETED";
                        // UpdateRequestCustomer.useTransaction(trx)
                        await UpdateRequestCustomer.save();
                        // send data to MDMR3    
                        await MdmR3.customerToMdmR3(approvedData.customer_id)
                    }
                }

            }

            //NOTIFICATION
            const approvalLog = new ApprovalLog();
            approvalLog.request_no = noRequest;
            approvalLog.action = "APPROVED";
            approvalLog.remark = remark;
            approvalLog.created_by = `${auth.user?.id}`;
            approvalLog.useTransaction(trx)
            await approvalLog.save();

            const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schema?.id).where("approval_order", nextApprovalSequece + 1);
            let nextApprovalRoleArray: any = [];
            nextApprovalRole.forEach(function (value) {
                nextApprovalRoleArray.push(value.role_id);
            });
            const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
            let notificationData: any = [];
            nextUserApproval.forEach(async function (value) {
                notificationData.push({
                    from: `${auth.user?.id}`,
                    to: value.id,
                    request_no: noRequest,
                    master_type_id: masterType,
                    status: 'APPROVED'
                });
                Ws.io.emit('receive-notif', { userId: value.id, message: 'Request Approval Master Data Customer' });
                await SendMail.approve(value.id, submitter, masterType, noRequest);
            });
            await Notification.createMany(notificationData);

            trx.commit()
            let result = {
                message: "Berhasil Disetujui",
            }

            return response.status(200).send(result);
        } catch (error) {
            trx.rollback()
            let result = {
                "message": error.message
            };
            return response.status(500).send(result);
        }
    }

    public async reject({ request, response, auth }: HttpContextContract) {
        const trx = await Database.transaction()

        try {
            const noRequest = request.input("no_request");
            const remark = request.input("remark");
            let approvalSequence = 0;
            let approvalHeaderId = "";

            const RequestCustomer = await RequestCustomerInfo.query().where("no_request", noRequest).first();
            const masterSchemaId = RequestCustomer?.schema_id
            const status = RequestCustomer?.status
            const submitter = RequestCustomer?.submitter
            const masterType = RequestCustomer?.master_type_id
            const schema = await SchemaAplication.query().where("id", `${masterSchemaId}`).preload("approvalList").first();

            if (status == "REJECT" || status == "DRAFT") {
                throw new Exception("Data Kapal Masih Dalam Perbaikan");
            }
            if (status == "COMPLETED") {
                throw new Exception("Data Kapal Sudah Selesai Prosess Persetujuan");
            }
            const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
            const approvalRoleMandatory: any = [];


            if (approveHeader) {
                approvalSequence = approveHeader.approval_sequence;
            }

            const nextApprovalSequece = approvalSequence + 1;
            schema?.approvalList.forEach(function (value) {
                if (value.mandatory == "1" && value.approval_order == `${nextApprovalSequece}`) {
                    approvalRoleMandatory.push(value.role_id);
                }
            });
            if (!schema) {
                throw new Exception("Schema Not Found");
            }

            const userApprove = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece).where("role_id", `${auth?.user?.role_id}`).first();

            if (!userApprove) {
                throw new Exception("Anda Tidak Mempunyai Aksess Untuk Melakukan Approval Selanjutnya");
            }

            if (approveHeader) {
                approvalHeaderId = approveHeader.id;

                const cekApproval = await ApprovalDetail.query().where("header_id", approvalHeaderId).where("step", approveHeader.step).where("sequence", nextApprovalSequece).where("role_id", `${auth?.user?.role_id}`).first();

                if (cekApproval) {
                    throw new Exception("Anda Sudah Melakukan Approval Sebelumnya");
                }

                const approvalDetail = new ApprovalDetail();
                approvalDetail.user_id = `${auth?.user?.id}`;
                approvalDetail.validation = "REJECT";
                approvalDetail.header_id = approvalHeaderId;
                approvalDetail.remark = remark;
                approvalDetail.sequence = nextApprovalSequece;
                approvalDetail.role_id = `${auth?.user?.role_id}`;
                approvalDetail.step = approveHeader.step;
                approvalDetail.useTransaction(trx)
                await approvalDetail.save();

                const UpdateRequestCustomer = await RequestCustomerInfo.findOrFail(RequestCustomer?.id);
                UpdateRequestCustomer.status = "REJECT";
                UpdateRequestCustomer.useTransaction(trx)
                await UpdateRequestCustomer.save();

                const approvalHeader2 = await ApprovalHeader.findOrFail(approvalHeaderId);
                approvalHeader2.approval_sequence = 0;
                approvalHeader2.step = approveHeader.step + 1;
                approvalHeader2.useTransaction(trx)
                await approvalHeader2.save();

            } else {
                const SchemaApprovalMax = await SchemaApprovalList.query().where("schema_id", schema.id).orderBy("approval_order", "desc").first();
                const approvalHeader = new ApprovalHeader();
                approvalHeader.no_request = noRequest;
                // @ts-ignore
                approvalHeader.total_approve = SchemaApprovalMax.approval_order;
                approvalHeader.id_submitter = `${auth?.user?.id}`;
                approvalHeader.approval_sequence = 0;
                approvalHeader.step = 2;
                approvalHeader.useTransaction(trx)
                await approvalHeader.save();
                approvalHeaderId = approvalHeader.id;

                const approvalDetail = new ApprovalDetail();
                approvalDetail.user_id = `${auth?.user?.id}`;
                approvalDetail.validation = "REJECT";
                approvalDetail.header_id = approvalHeaderId;
                approvalDetail.remark = remark;
                approvalDetail.sequence = 1;
                approvalDetail.role_id = `${auth?.user?.role_id}`;
                approvalDetail.step = 1;
                approvalDetail.useTransaction(trx)
                await approvalDetail.save();

                const UpdateRequestCustomer = await RequestCustomerInfo.findOrFail(RequestCustomer?.id);
                UpdateRequestCustomer.status = "REJECT";
                UpdateRequestCustomer.useTransaction(trx)
                await UpdateRequestCustomer.save();
            }
            //NOTIFICATION
            const approvalLog = new ApprovalLog();
            approvalLog.request_no = `${RequestCustomer?.no_request}`;
            approvalLog.action = "REJECTED";
            approvalLog.remark = remark;
            approvalLog.created_by = `${auth?.user?.id}`;
            approvalLog.useTransaction(trx)
            await approvalLog.save();

            const notification = new Notification();
            notification.from = `${auth?.user?.id}`;
            notification.to = `${submitter}`;
            notification.request_no = `${RequestCustomer?.no_request}`;
            notification.master_type_id = `${masterType}`;
            notification.status = "REJECTED";
            notification.useTransaction(trx)
            await notification.save();
            Ws.io.emit("receive-notif", { userId: submitter, message: "Rejected Master Data Customer" });
            await SendMail.reject(submitter, `${auth?.user?.id}`, masterType, RequestCustomer?.no_request);

            await trx.commit()
            let result = {
                "message": "Berhasil Ditolak"
            };

            return response.status(200).send(result);

        } catch (error) {
            console.log(error)
            await trx.rollback()
            let result = {
                "message": error.message
            };
            return response.status(500).send(result);
        }
    }

    public async createExcel({ response, request }: HttpContextContract) {
        const customer_type = request.input('customer_type') ? request.input('customer_type') : ""
        const customer_group = request.input('customer_group') ? request.input('customer_group') : ""
        const bentuk_usaha = request.input('customer_type') ? request.input('customer_type') : ""
        const service_type = request.input('service_type') ? request.input('service_type') : ""
        const branch = request.input('branch') ? request.input('branch') : ""
        const country_id = request.input('country_id') ? request.input('country_id') : ""
        const billing_location = request.input('billing_location') ? request.input('billing_location') : ""
        const date_from = request.input('date_from')
        const date_to = request.input('date_to')
        const filter_flag = request.input('filter_flag')

        try {
            const workbook = new excel.Workbook()
            workbook.creator = 'PT Pelabuhan Indonesia (Persero)';
            const worksheet = workbook.addWorksheet("Master Customer");
            const worksheet2 = workbook.addWorksheet("Contact Person");

            worksheet.columns = [
                { header: 'Customer Number', key: 'no_customer', width: 25 },
                { header: 'Affiliate Number', key: 'no_affiliasi', width: 25 },
                { header: 'Nama Perusahaan', key: 'nm_perusahaan', width: 25 },
                { header: 'Email', key: 'email', width: 25 },
                { header: 'Phone', key: 'phone', width: 25 },
                { header: 'Address', key: 'address', width: 25 },
                { header: 'Area', key: 'area', width: 25 },
                { header: 'Joining Since', key: 'join_date', width: 25 },
                { header: 'Company Birthday', key: 'birthday_date', width: 25 },
                { header: 'Company Establishment', key: 'establish_date', width: 25 },
                { header: 'Pemimpin Birthday', key: 'birthday_pemimpin_date', width: 25 },
                { header: 'Pemimpin Perusahaan', key: 'nm_pemimpin', width: 25 },
                { header: 'No PMKU', key: 'no_pmku', width: 25 },
                { header: 'First Registration Branch', key: 'branch', width: 25 },
                { header: 'Jenis Pelanggan', key: 'customer_type', width: 25 },
                { header: 'Customer Group', key: 'customer_group', width: 25 },
                { header: 'Bentuk Usaha', key: 'bentuk_usaha', width: 25 },
                { header: 'Tipe Usaha Pelanggan', key: 'usaha_pelanggan', width: 25 },
                { header: 'Tipe Usaha Mitra', key: 'mitra', width: 25 },
                { header: 'Tipe Usaha ShippingLine', key: 'shipping_line', width: 25 },
                { header: 'Tipe Usaha Cargo Owner', key: 'cargo_owner', width: 25 },
                { header: 'Jenis Layanan', key: 'service_type', width: 25 },
                { header: 'NPWP', key: 'npwp', width: 25 },
                { header: 'status', key: 'status', width: 25 },
            ];

            worksheet2.columns = [
                { header: 'Customer Number', key: 'no_customer', width: 25 },
                { header: 'Affiliate Number', key: 'no_affiliasi', width: 25 },
                { header: 'Nama Perusahaan', key: 'nm_perusahaan', width: 25 },
                { header: 'Contact Name', key: 'nm_contact', width: 25 },
                { header: 'Position', key: 'job_title', width: 25 },
                { header: 'Email', key: 'email_contact', width: 25 },
                { header: 'Phone', key: 'contact_phone', width: 25 },
                { header: 'Mobile Phone', key: 'contact_mobile_phone', width: 25 },
                { header: 'Address', key: 'contact_address', width: 25 },
                { header: 'Location', key: 'contact_branch', width: 25 },
                { header: 'status', key: 'status', width: 25 },
            ];

            let cellArr: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X']
            for (let index = 0; index < cellArr.length; index++) {
                worksheet.getCell(cellArr[index] + '1').border = {
                    top: { style: 'double', color: { argb: '000000' } },
                    left: { style: 'double', color: { argb: '000000' } },
                    bottom: { style: 'double', color: { argb: '000000' } },
                    right: { style: 'double', color: { argb: '000000' } }
                };
            }

            let cellArr2: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
            for (let index = 0; index < cellArr2.length; index++) {
                worksheet2.getCell(cellArr2[index] + '1').border = {
                    top: { style: 'double', color: { argb: '000000' } },
                    left: { style: 'double', color: { argb: '000000' } },
                    bottom: { style: 'double', color: { argb: '000000' } },
                    right: { style: 'double', color: { argb: '000000' } }
                };
            }

            let infoCustomer: any = []
            let contactData: any = []
            let customers: any = []

            if (filter_flag == 1) {
                customers = await CustomerInfo.query()
                   .preload('postalCode')
                   .preload('country')
                   .preload('branch')
                   .preload('customerType')
                   .preload('customerGroup')
                   .preload('bentukUsaha')
                   .preload('usahaPelanggan', (query) => {
                       query.preload('usahaPelanggan')
                   })
                   .preload('mitra', (query) => {
                       query.preload('mitra')
                   })
                   .preload('shippingLine', (query) => {
                       query.preload('shippingLine')
                   })
                   .preload('cargoOwner', (query) => {
                       query.preload('cargoOwner')
                   })
                   .preload('serviceType', (query) => {
                       query.preload('serviceType')
                   })
                   .preload('npwp')
                   .preload('contact', (query) => {
                       query.preload('branch')
                   })
                   .where((query) => {
                       query
                       .where('customer_type_id', customer_type)
                       .orWhere('group_customer_id', customer_group)
                       .orWhere('bentuk_usaha_id', bentuk_usaha)
                       .orWhere('country_id', country_id)
                       .orWhere('branch_id', branch)
                       .orWhereHas('serviceType', (query) => {
                           query.whereHas('serviceType', (query) => {
                               query.where('service_type_id', '=', service_type)
                           })
                       })
                    //    .orWhereHas('billing', (query) => {
                    //        query.whereHas('location', (query) => {
                    //            query.where('id', '=', billing_location)
                    //        })
                    //    })
                   })
                   .andWhereRaw(`                   
                   "created_at" BETWEEN TO_DATE('${date_from ? date_from : "2000-01-01"} 12:00:00 am', 'YYYY-MM-DD HH:MI:SS am')
                   AND TO_DATE('${date_to ? date_to : "2200-12-31"} 11:59:59 pm', 'YYYY-MM-DD HH:MI:SS pm')
                   `)
                    .andWhere('status', '=', 'ACTIVE')
            } else if (filter_flag == 2) {
                customers = await CustomerInfo.query()
                    .preload('postalCode')
                    .preload('country')
                    .preload('branch')
                    .preload('customerType')
                    .preload('customerGroup')
                    .preload('bentukUsaha')
                    .preload('usahaPelanggan', (query) => {
                        query.preload('usahaPelanggan')
                    })
                    .preload('mitra', (query) => {
                        query.preload('mitra')
                    })
                    .preload('shippingLine', (query) => {
                        query.preload('shippingLine')
                    })
                    .preload('cargoOwner', (query) => {
                        query.preload('cargoOwner')
                    })
                    .preload('serviceType', (query) => {
                        query.preload('serviceType')
                    })
                    .preload('npwp')
                    .preload('contact', (query) => {
                        query.preload('branch')
                    })
                    .whereRaw(`
                "created_at" BETWEEN TO_DATE('${date_from ? date_from : "2000-01-01"} 12:00:00 am', 'YYYY-MM-DD HH:MI:SS am')
                AND TO_DATE('${date_to ? date_to : "2200-12-31"} 11:59:59 pm', 'YYYY-MM-DD HH:MI:SS pm')
                `)
                    .andWhere('status', '=', 'ACTIVE')

            } else {
                customers = await CustomerInfo.query()
                    .preload('postalCode')
                    .preload('country')
                    .preload('branch')
                    .preload('customerType')
                    .preload('customerGroup')
                    .preload('bentukUsaha')
                    .preload('usahaPelanggan', (query) => {
                        query.preload('usahaPelanggan')
                    })
                    .preload('mitra', (query) => {
                        query.preload('mitra')
                    })
                    .preload('shippingLine', (query) => {
                        query.preload('shippingLine')
                    })
                    .preload('cargoOwner', (query) => {
                        query.preload('cargoOwner')
                    })
                    .preload('serviceType', (query) => {
                        query.preload('serviceType')
                    })
                    .preload('npwp')
                    .preload('contact', (query) => {
                        query.preload('branch')
                    })
                    .where('status', '=', 'ACTIVE')
            }

            customers.forEach((customer) => {
                infoCustomer.push({
                    no_customer: customer?.no_customer,
                    no_affiliasi: customer?.no_affiliasi,
                    nm_perusahaan: customer?.nm_perusahaan,
                    email: customer?.email,
                    phone: customer?.phone,
                    address: customer?.address,
                    area: customer?.postalCode?.province + ", " + customer?.postalCode?.city + ", " + customer?.postalCode?.subdistrict + ", " + customer?.postalCode?.village,
                    join_date: customer?.join_date,
                    birthday_date: customer?.birthday_date,
                    establish_date: customer?.establish_date,
                    birthday_pemimpin_date: customer?.birthday_pemimpin_date,
                    nm_pemimpin: customer?.nm_pemimpin,
                    no_pmku: customer?.no_pmku,
                    branch: customer?.branch?.name,
                    customer_type: customer?.customerType?.name_type,
                    customer_group: customer?.customerGroup?.name,
                    bentuk_usaha: customer?.bentukUsaha?.name,
                    usaha_pelanggan: customer?.usahaPelanggan?.map(el => el?.usahaPelanggan?.name),
                    mitra: customer?.mitra?.map(el => el?.mitra?.name),
                    shipping_line: customer?.shippingLine?.map(el => el?.shippingLine?.name),
                    cargo_owner: customer?.cargoOwner?.map(el => el?.cargoOwner?.name),
                    service_type: customer?.serviceType?.map(el => el?.serviceType?.name),
                    npwp: customer?.npwp?.no_npwp,
                    status: customer?.status
                })

                contactData.push({
                    no_customer: customer?.no_customer,
                    no_affiliasi: customer?.no_affiliasi,
                    nm_perusahaan: customer?.nm_perusahaan,
                    nm_contact: customer?.contact[0].nm_contact,
                    job_title: customer?.contact[0].job_title,
                    email_contact: customer?.contact[0].email_contact,
                    contact_phone: customer?.contact[0].phone,
                    contact_mobile_phone: customer?.contact[0].mobilephone,
                    contact_address: customer?.contact[0].address,
                    location: customer?.contact[0].branch?.name,
                    status: customer?.status,
                })
            })

            infoCustomer.forEach(function (data) {
                worksheet.addRow({
                    no_customer: data?.no_customer,
                    no_affiliasi: data?.no_affiliasi,
                    nm_perusahaan: data?.nm_perusahaan,
                    email: data?.email,
                    phone: data?.phone,
                    address: data?.address,
                    area: data?.area,
                    join_date: data?.join_date,
                    birthday_date: data?.birthday_date,
                    establish_date: data?.establish_date,
                    birthday_pemimpin_date: data?.birthday_pemimpin_date,
                    nm_pemimpin: data?.nm_pemimpin,
                    no_pmku: data?.no_pmku,
                    branch: data?.branch,
                    customer_type: data?.customer_type,
                    customer_group: data?.customer_group,
                    bentuk_usaha: data?.bentuk_usaha,
                    usaha_pelanggan: data?.usaha_pelanggan,
                    mitra: data?.mitra,
                    shipping_line: data?.shipping_line,
                    cargo_owner: data?.cargo_owner,
                    service_type: data?.service_type,
                    npwp: data?.npwp,
                    status: data?.status
                })
            })

            contactData.forEach(function (data) {
                worksheet2.addRow({
                    no_customer: data?.no_customer,
                    no_affiliasi: data?.no_affiliasi,
                    nm_perusahaan: data?.nm_perusahaan,
                    nm_contact: data?.nm_contact,
                    job_title: data?.job_title,
                    email_contact: data?.email_contact,
                    contact_phone: data?.contact_phone,
                    contact_mobile_phone: data?.contact_mobile_phone,
                    contact_address: data?.contact_address,
                    location: data?.location,
                    status: data?.status,
                })
            })

            await workbook.xlsx.writeFile('public/media/template_excel_master/data_master_customer.xlsx');
            const filePath = Application.publicPath('media/template_excel_master/data_master_customer.xlsx');
            return response.download(filePath);
        } catch (error) {
            console.log(error)
        }

        // }
    }

    public async modalData({ request }: HttpContextContract) {
        try {
            let requestNumber = request.input('no_request')
            let customer = await RequestCustomerInfo.query()
                .preload('customerType')
                .preload('customerGroup')
                .preload('bentukUsaha')
                .preload('country')
                .preload('branch')
                .preload('postalCode')
                .preload('npwp')
                .preload('document', (query) => {
                    query.preload('expDocument')
                })
                .preload('contact', (query) => {
                    query.preload('cabang', (query) => {
                        query.preload('cabang')
                    })
                })
                .preload('billing', (query) => {
                    query.preload('paymentType', (query) => {
                        query.preload('payment')
                    })
                })
                .preload('usahaPelanggan', (query) => {
                    query.preload('usahaPelanggan')
                })
                .preload('mitra', (query) => {
                    query.preload('mitra')
                })
                .preload('shippingLine', (query) => {
                    query.preload('shippingLine')
                })
                .preload('cargoOwner', (query) => {
                    query.preload('cargoOwner')
                })
                .preload('serviceType', (query) => {
                    query.preload('serviceType')
                })
                .preload('user', function (query) {
                    query.preload('role')
                })
                .where('no_request', `${requestNumber}`)
                .first()

            let link = async (fileName) => {
                let url = await Drive.getUrl(fileName)
                return url
            }
            
            let requestDate = await this.formatDate(customer?.created_at)
            let state = {
                name_request: customer?.user?.name,
                dept_request: customer?.user?.role.name,
                date_request: requestDate,
                no_request: customer?.no_request,
                id: customer?.id,
                tp_company: customer?.tp_company,
                tp_nm_perusahaan: customer?.tp_nm_perusahaan,
                no_customer: customer?.no_customer,
                no_affiliasi: customer?.no_affiliasi,
                nm_perusahaan: customer?.nm_perusahaan,
                email: customer?.email,
                phone: customer?.phone,
                address: customer?.address,
                join_date: customer?.join_date ? customer?.join_date.toLocaleDateString('af-ZA') : '',
                establish_date: customer?.establish_date ? customer?.establish_date.toLocaleDateString('af-ZA') : '',
                birthday_date: customer?.birthday_date ? customer?.birthday_date.toLocaleDateString('af-ZA') : '',
                birthday_pemimpin_date: customer?.birthday_pemimpin_date ? customer?.birthday_pemimpin_date.toLocaleDateString('af-ZA') : '',
                nm_pemimpin: customer?.nm_pemimpin,
                parent_customer: customer?.parent_customer,
                country: customer?.country?.country_name,
                area: {
                    province: customer?.postalCode?.province ? customer?.postalCode?.province : '',
                    city: customer?.postalCode?.city ? customer?.postalCode?.city : '',
                    subdistrict: customer?.postalCode?.subdistrict ? customer?.postalCode?.subdistrict : '',
                    village: customer?.postalCode?.village ? customer?.postalCode?.village : '',
                    post_code: customer?.postalCode?.post_code ? customer?.postalCode?.post_code : '',
                },
                first_registration_branch: customer?.branch?.name ? customer?.branch?.name : null,
                bebas_pajak: customer?.is_bebas_pajak,
                customer_type: customer?.customerType?.name_type,
                customer_group: customer?.customerGroup?.name,
                bentuk_usaha: customer?.bentukUsaha?.name,
                usaha_pelanggan: customer?.usahaPelanggan.map((el: any) => el?.usahaPelanggan.name),
                mitra: customer?.mitra.map((el: any) => el?.mitra.name),
                shiping_line: customer?.shippingLine.map((el: any) => el?.shippingLine.name),
                cargo_owner: customer?.cargoOwner.map((el: any) => el?.cargoOwner.name),
                service_type: customer?.serviceType.map((el: any) => el?.serviceType.name),
                npwp_customer: {
                    no_npwp: customer?.npwp.no_npwp,
                    name: customer?.npwp.name,
                    address: customer?.npwp.address,
                    type: customer?.npwp.type
                },
                contacts: customer?.contact?.map((el) => {
                    return ({
                        nm_contact: el?.nm_contact,
                        email_contact: el?.email_contact,
                        job_title: el?.job_title,
                        mobilephone: el?.mobilephone,
                        phone: el?.phone,
                        address: el?.address,
                        // location: el?.branch?.name
                    })
                }),
                billing: customer?.billing?.map((el: any) => {
                    return ({
                        // nm_account: el?.nm_account,
                        // no_bank_account: el?.no_bank_account,
                        // nm_bank: el?.nm_bank,
                        no_npwp: el?.no_npwp,
                        // location_id: el?.location_id,
                        // payment_type: el?.paymentType?.map((el: any) => el?.payment?.name),
                        npwp_address: el?.npwp_address

                    })
                }),
                spmp: {
                    filename: customer?.document?.spmp ? customer?.document?.spmp : "",
                    preview: customer?.document?.spmp ?
                        await link(customer?.document?.spmp) : ""
                },
                ket_domisili: {
                    filename: customer?.document?.ket_domisili ? customer?.document?.ket_domisili : "",
                    preview: customer?.document?.ket_domisili ? await link(customer?.document?.ket_domisili) : "",
                    end_date: customer?.document?.expDocument?.exp_ket_domisili?.toLocaleDateString('af-ZA')
                },
                ktp_pemimpin_perusahaan: {
                    filename: customer?.document?.ktp_pemimpin_perusahaan ? customer?.document?.ktp_pemimpin_perusahaan : "",
                    preview: customer?.document?.ktp_pemimpin_perusahaan ? await link(customer?.document?.ktp_pemimpin_perusahaan) : "",
                },
                ktp_pic: {
                    filename: customer?.document?.ktp_pic ? customer?.document?.ktp_pic : "",
                    preview: customer?.document?.ktp_pic ? await link(customer?.document?.ktp_pic) : "",
                },
                siupal_siupkk: {
                    filename: customer?.document?.siupal_siupkk ? customer?.document?.siupal_siupkk : "",
                    preview: customer?.document?.siupal_siupkk ? await link(customer?.document?.siupal_siupkk) : "",
                    end_date: customer?.document?.expDocument?.exp_siupal_siupkk?.toLocaleDateString('af-ZA')
                },
                siupbm: {
                    filename: customer?.document?.siupbm ? customer?.document?.siupbm : "",
                    preview: customer?.document?.siupbm ? await link(customer?.document?.siupbm) : "",
                    end_date: customer?.document?.expDocument?.exp_siupbm?.toLocaleDateString('af-ZA')
                },
                siup_nib: {
                    filename: customer?.document?.siup_nib ? customer?.document?.siup_nib : "",
                    preview: customer?.document?.siup_nib ? await link(customer?.document?.siup_nib) : "",
                    end_date: customer?.document?.expDocument?.exp_siup_nib?.toLocaleDateString('af-ZA')
                },
                pmku: {
                    filename: customer?.document?.pmku ? customer?.document?.pmku : "",
                    preview: customer?.document?.pmku ? await link(customer?.document?.pmku) : "",
                    no_surat: customer?.no_pmku,
                },
                akta_perusahaan: {
                    filename: customer?.document?.akta_perusahaan ? customer?.document?.akta_perusahaan : "",
                    preview: customer?.document?.akta_perusahaan ? await link(customer?.document?.akta_perusahaan) : "",
                },
                ref_bank: {
                    filename: customer?.document?.ref_bank ? customer?.document?.ref_bank : "",
                    preview: customer?.document?.ref_bank ? await link(customer?.document?.ref_bank) : "",
                },
                npwp: {
                    filename: customer?.document?.npwp ? customer?.document?.npwp : "",
                    preview: customer?.document?.npwp ? await link(customer?.document?.npwp) : "",
                },
                pkp_non_pkp: {
                    filename: customer?.document?.pkp_non_pkp ? customer?.document?.pkp_non_pkp : "",
                    preview: customer?.document?.pkp_non_pkp ? await link(customer?.document?.pkp_non_pkp) : "",
                },
                rek_asosiasi: {
                    filename: customer?.document?.rek_asosiasi ? customer?.document?.rek_asosiasi : "",
                    preview: customer?.document?.rek_asosiasi ? await link(customer?.document?.rek_asosiasi) : "",
                },
                sktd: {
                    filename: customer?.document?.sktd ? customer?.document?.sktd : "",
                    preview: customer?.document?.sktd ? await link(customer?.document?.sktd) : "",
                    no_surat: customer?.no_sktd,
                    end_date: customer?.document?.expDocument?.exp_sktd?.toLocaleDateString('af-ZA'),
                    start_date: customer?.document?.expDocument?.start_date_sktd?.toLocaleDateString('af-ZA')
                },
                cor_dgt: {
                    filename: customer?.document?.cor_dgt ? customer?.document?.cor_dgt : "",
                    preview: customer?.document?.cor_dgt ? await link(customer?.document?.cor_dgt) : "",
                    end_date: customer?.document?.expDocument?.exp_cor_dgt?.toLocaleDateString('af-ZA')
                },
                surat_izin_pengelolaan: {
                    filename: customer?.document?.surat_izin_pengelolaan ? customer?.document?.surat_izin_pengelolaan : "",
                    preview: customer?.document?.surat_izin_pengelolaan ? await link(customer?.document?.surat_izin_pengelolaan) : "",
                    end_date: customer?.document?.expDocument?.exp_surat_izin_pengelolaan?.toLocaleDateString('af-ZA')
                },
                skpt: {
                    filename: customer?.document?.skpt ? customer?.document?.skpt : "",
                    preview: customer?.document?.skpt ? await link(customer?.document?.skpt) : "",
                    end_date: customer?.document?.expDocument?.exp_skpt?.toLocaleDateString('af-ZA')
                },
                siopsus: {
                    filename: customer?.document?.siopsus ? customer?.document?.siopsus : "",
                    preview: customer?.document?.siopsus ? await link(customer?.document?.siopsus) : "",
                    end_date: customer?.document?.expDocument?.exp_siopsus?.toLocaleDateString('af-ZA')
                },
            }

            console.log(state);
            

            return state

        } catch (error) {
            return error
        }
    }

    private async formatDate(date) {
        let strTanggal = date.toString();
        const strDay = strTanggal.substring(8, 10);
        let bulan: any;
        switch (strTanggal.substring(4, 7)) {
            case "Jan": bulan = "Januari"; break;
            case "Feb": bulan = "Febuari"; break;
            case "Mar": bulan = "Maret"; break;
            case "Apr": bulan = "April"; break;
            case "May": bulan = "Mei"; break;
            case "Jun": bulan = "Juni"; break;
            case "Jul": bulan = "Juli"; break;
            case "Aug": bulan = "Agustus"; break;
            case "Sep": bulan = "September"; break;
            case "Okt": bulan = "Oktober"; break;
            case "Nov": bulan = "November"; break;
            case "Dec": bulan = "Desember"; break;
        }
        let year = strTanggal.substring(11, 15);
        let jam = strTanggal.substring(16, 18);
        let menit = strTanggal.substring(19, 21);
        let resultDate = `${strDay} ${bulan} ${year} ${jam}.${menit}`;
        return resultDate
    }

    private async sendApprovedNotif(action: string, remark: string | null, no_request?: string | null, user_id?: string | null, schema_id?: string | null, submitter?: string | null, master_type_id?: string, message?: string) {
        // create log approval
        const approvalLog = new ApprovalLog();
        approvalLog.request_no = no_request ? no_request : "";
        approvalLog.action = action;
        approvalLog.remark = remark ? remark : "";
        approvalLog.created_by = user_id ? user_id : "";
        await approvalLog.save();

        // check users role and next user approval
        const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", `${schema_id}`).where("approval_order", "1");
        let nextApprovalRoleArray: any = [];
        nextApprovalRole.forEach(function (value) {
            nextApprovalRoleArray.push(value.role_id);
        });
        const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);

        // send notification
        let notificationData: any = [];
        nextUserApproval.forEach(async function (value) {
            notificationData.push({
                from: user_id,
                to: value.id,
                request_no: no_request,
                master_type_id: master_type_id,
                status: "APPROVED"
            });
            Ws.io.emit("receive-notif", { userId: value.id, message: `${message}` });
            // send email notification
            await SendMail.approve(value.id, submitter, master_type_id, no_request);
        });
        await Notification.createMany(notificationData);

        return true
    }
}
