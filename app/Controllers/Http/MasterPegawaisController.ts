import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import GroupCompany from 'App/Models/GroupCompany';

export default class MasterPegawaisController {

    public async main({ view, params }: HttpContextContract) {
        const company_id = params.company_id ? params.company_id : '';
        return view.render('pages/master_pegawai/page/main.edge', {company_id : company_id});
    }


    public async listEmployee({ view, params }: HttpContextContract) {
        let pegawai: any, company: any, total_pegawai: any;
        
        if(params.pbtxt) {
            const sql_total_pegawai = `SELECT count(*)AS total 
                                       FROM (SELECT DISTINCT sp."cname" 
                                             FROM "safm_pegawai" sp 
                                             JOIN "safm_perubahan_organisasi" spo ON sp."pernr" = spo."pernr"
                                             WHERE spo."pbtxt" = '${String(params.pbtxt).replace(/-/g, " ")}')`;
            total_pegawai = await Database.rawQuery(sql_total_pegawai);
            company = await Database.from('safm_perubahan_organisasi').where("pbtxt", String(params.pbtxt).replace(/-/g, " "));
            company = company != null ? company[0].pbtxt : 'PT ...';
        } else {
            const sql_total_pegawai = `SELECT count(*)AS total 
                                       FROM (SELECT DISTINCT sp."cname" 
                                             FROM "safm_pegawai" sp 
                                             JOIN "safm_perubahan_organisasi" spo ON sp."pernr" = spo."pernr")`;
            total_pegawai = await Database.rawQuery(sql_total_pegawai);
            company = 'PT Pelabuhan Indonesia (Persero)';
        }
        
        const data = {
            pegawai : pegawai,
            jumlah_pegawai: total_pegawai[0].TOTAL + 1,
            company : company,
            pbtxt: params.pbtxt ? params.pbtxt : ''
        }
        
        return view.render('pages/master_pegawai/page/list_employee.edge', data);
    }


    public async dataListEmployee({response, request, params}: HttpContextContract) {
        const start = request.input("start");
        const length = request.input("length");
        const draw = request.input("draw");
        const search = request.input("search").value;
        const contains_comma = String(search).includes(",") || String(search).includes("'");

        let param = '';
        if(contains_comma) {
            const filter_array = String(search).split(",");

            for(let i = 0; i < filter_array.length; i++) {
                if(i == filter_array.length - 1) {
                    param += `LOWER("safm_perubahan_organisasi"."pktxt") LIKE '${filter_array[i]}%'`
                } else {
                    param += `LOWER("safm_perubahan_organisasi"."pktxt") LIKE '${filter_array[i]}%' OR `
                }
            }
        }
        
        let employee, total;
        if(params.pbtxt) {
            if(search != '') {
                if(contains_comma) {
                    employee = await Database.from('safm_pegawai')
                                        .join('safm_perubahan_organisasi', 'safm_perubahan_organisasi.pernr', '=', 'safm_pegawai.pernr')
                                        .distinct('safm_pegawai.cname')
                                        .select("safm_perubahan_organisasi.pktxt", "safm_perubahan_organisasi.btrtx", "safm_perubahan_organisasi.pernr")
                                        .where("safm_perubahan_organisasi.pbtxt",  String(params.pbtxt).replace(/-/g, " "))
                                        .andWhereRaw(`(${param})`)
                                        .offset(start)
                                        .limit(length)
                    
                    const sql_total_pegawai = `SELECT count(*)AS total 
                                               FROM (SELECT DISTINCT "safm_pegawai"."cname" 
                                                     FROM "safm_pegawai" 
                                                     JOIN "safm_perubahan_organisasi" ON "safm_pegawai"."pernr" = "safm_perubahan_organisasi"."pernr"
                                                     WHERE "safm_perubahan_organisasi"."pbtxt" = '${String(params.pbtxt).replace(/-/g, " ")}'
                                                     AND (${param}))`;
                    total = await Database.rawQuery(sql_total_pegawai);
                } else {
                    employee = await Database.from('safm_pegawai')
                                        .join('safm_perubahan_organisasi', 'safm_perubahan_organisasi.pernr', '=', 'safm_pegawai.pernr')
                                        .distinct('safm_pegawai.cname')
                                        .select("safm_perubahan_organisasi.pktxt", "safm_perubahan_organisasi.btrtx", "safm_perubahan_organisasi.pernr")
                                        .whereRaw(`LOWER("safm_pegawai"."cname") LIKE '%${String(search).toLowerCase()}%' AND "safm_perubahan_organisasi"."pbtxt" = '${String(params.pbtxt).replace(/-/g, " ")}' 
                                                   OR LOWER("safm_perubahan_organisasi"."pktxt") LIKE '%${String(search).toLowerCase()}%' AND "safm_perubahan_organisasi"."pbtxt" = '${String(params.pbtxt).replace(/-/g, " ")}' 
                                                   OR LOWER("safm_perubahan_organisasi"."btrtx") LIKE '%${String(search).toLowerCase()}%' AND "safm_perubahan_organisasi"."pbtxt" = '${String(params.pbtxt).replace(/-/g, " ")}'`)
                                        .offset(start)
                                        .limit(length)
                    
                    const sql_total_pegawai = `SELECT count(*)AS total 
                                               FROM (SELECT DISTINCT sp."cname" 
                                                     FROM "safm_pegawai" sp 
                                                     JOIN "safm_perubahan_organisasi" spo ON sp."pernr" = spo."pernr"
                                                     WHERE spo."pbtxt" = '${String(params.pbtxt).replace(/-/g, " ")}'
                                                     AND LOWER(sp."cname") LIKE '%${String(search).toLowerCase()}%' 
                                                     OR LOWER(spo."pktxt") LIKE '%${String(search).toLowerCase()}%' 
                                                     OR LOWER(spo."btrtx") LIKE '%${String(search).toLowerCase()}%')`;
                    total = await Database.rawQuery(sql_total_pegawai);
                }
            } else {
                employee = await Database.from('safm_pegawai')
                                    .join('safm_perubahan_organisasi', 'safm_perubahan_organisasi.pernr', '=', 'safm_pegawai.pernr')
                                    .distinct('safm_pegawai.cname')
                                    .select("safm_perubahan_organisasi.pktxt", "safm_perubahan_organisasi.btrtx", "safm_perubahan_organisasi.pernr")
                                    .where("safm_perubahan_organisasi.pbtxt",  String(params.pbtxt).replace(/-/g, " "))
                                    .offset(start)
                                    .limit(length)
                
                const sql_total_pegawai = `SELECT count(*)AS total 
                                           FROM (SELECT DISTINCT sp."cname" 
                                                 FROM "safm_pegawai" sp 
                                                 JOIN "safm_perubahan_organisasi" spo ON sp."pernr" = spo."pernr"
                                                 WHERE spo."pbtxt" = '${String(params.pbtxt).replace(/-/g, " ")}')`;
                total = await Database.rawQuery(sql_total_pegawai);
            }
        } else {
            if(search != '') {
                if(contains_comma) {
                    employee = await Database.from('safm_pegawai')
                                    .join('safm_perubahan_organisasi', 'safm_perubahan_organisasi.pernr', '=', 'safm_pegawai.pernr')
                                    .distinct('safm_pegawai.cname')
                                    .select("safm_perubahan_organisasi.pktxt", "safm_perubahan_organisasi.btrtx", "safm_perubahan_organisasi.pernr")
                                    .whereRaw(param)
                                    .offset(start)
                                    .limit(length);
                    
                    const sql_total_pegawai = `SELECT count(*)AS total 
                                               FROM (SELECT DISTINCT "safm_pegawai"."cname" 
                                                     FROM "safm_pegawai" 
                                                     JOIN "safm_perubahan_organisasi" ON "safm_pegawai"."pernr" = "safm_perubahan_organisasi"."pernr"
                                                     WHERE ${param})`;
                    total = await Database.rawQuery(sql_total_pegawai);
                } else {
                    employee = await Database.from('safm_pegawai')
                                    .join('safm_perubahan_organisasi', 'safm_perubahan_organisasi.pernr', '=', 'safm_pegawai.pernr')
                                    .distinct('safm_pegawai.cname')
                                    .select("safm_perubahan_organisasi.pktxt", "safm_perubahan_organisasi.btrtx", "safm_perubahan_organisasi.pernr")
                                    .whereRaw(`LOWER("safm_pegawai"."cname") LIKE '%${String(search).toLowerCase()}%' 
                                               OR LOWER("safm_perubahan_organisasi"."pktxt") LIKE '%${String(search).toLowerCase()}%' 
                                               OR LOWER("safm_perubahan_organisasi"."btrtx") LIKE '%${String(search).toLowerCase()}%'`)
                                    .offset(start)
                                    .limit(length);
                    
                    const sql_total_pegawai = `SELECT count(*)AS total 
                                               FROM (SELECT DISTINCT sp."cname" 
                                                     FROM "safm_pegawai" sp 
                                                     JOIN "safm_perubahan_organisasi" spo ON sp."pernr" = spo."pernr"
                                                     WHERE LOWER(sp."cname") LIKE '%${String(search).toLowerCase()}%' 
                                                     OR LOWER(spo."pktxt") LIKE '%${String(search).toLowerCase()}%' 
                                                     OR LOWER(spo."btrtx") LIKE '%${String(search).toLowerCase()}%')`;
                    total = await Database.rawQuery(sql_total_pegawai);
                }
            } else {
                employee = await Database.from('safm_pegawai')
                                .join('safm_perubahan_organisasi', 'safm_perubahan_organisasi.pernr', '=', 'safm_pegawai.pernr')
                                .distinct('safm_pegawai.cname')
                                .select("safm_perubahan_organisasi.pktxt", "safm_perubahan_organisasi.btrtx", "safm_perubahan_organisasi.pernr")
                                .offset(start)
                                .limit(length);
                
                const sql_total_pegawai = `SELECT count(*)AS total 
                                           FROM (SELECT DISTINCT sp."cname" 
                                                 FROM "safm_pegawai" sp 
                                                 JOIN "safm_perubahan_organisasi" spo ON sp."pernr" = spo."pernr")`;
                total = await Database.rawQuery(sql_total_pegawai);

            }
            
        }

        for(let i = 0; i < employee.length; i++) {
            employee[i]['nomor'] = i + 1 + Number(start);
        }

        const respon = {
            draw : draw,
            recordsTotal : total[0].TOTAL == 0 ? 0 : total[0].TOTAL + 1,
            recordsFiltered : total[0].TOTAL == 0 ? 0 : total[0].TOTAL + 1,
            data : employee
        }

        response.json(respon);
    }


    public async detailEmployee({ view, params }: HttpContextContract) {
        const pegawai = await Database
                            .from('safm_pegawai')
                            .join('safm_perubahan_organisasi', 'safm_pegawai.pernr', '=', 'safm_perubahan_organisasi.pernr')
                            .select('safm_pegawai.*', 'safm_perubahan_organisasi.*')
                            .where('safm_pegawai.pernr', params.pernr);
        
        // tanggal ulang tahun
        let phnumber='', pegawaiBirth = '';
        if(pegawai[0].gbdat != undefined) {
            const birthYear = new Date(pegawai[0].gbdat).getFullYear();
            const birthMonth = new Date(pegawai[0].gbdat).getMonth();
            const birthDay = new Date(pegawai[0].gbdat).getDate();
            pegawaiBirth = birthMonth < 10 ? `${birthDay}-0${birthMonth}-${birthYear}` : `${birthDay}-0${birthMonth}-${birthYear}`;
        }
        
        // tanggal ulang tahun
        if(pegawai[0].phnumber != undefined && pegawai[0].phnumber != null) {
            const digit1 = String(pegawai[0].phnumber).substring(0, 4);
            const digit2 = String(pegawai[0].phnumber).substring(4, 8);
            const digit3 = String(pegawai[0].phnumber).substring(8, 12);
            phnumber = `${digit1}-${digit2}-${digit3}`;
        }
        
        const data = {
            pegawai_birth : pegawaiBirth,
            phone_number: phnumber,
            pegawai : pegawai[0],
            pernr : params.pernr,
            pbtxt : params.pbtxt == undefined ? '' : params.pbtxt
        }

        return view.render('pages/master_pegawai/page/detail_employee.edge', data);
    }


    public async listDetailEmployee({ request, response, params }: HttpContextContract) {
        const draw = request.input('draw');
        const start = request.input("start");
        const length = request.input("length");
        
        const pegawai = await Database
                            .from('safm_perubahan_organisasi')
                            .orderBy('begda', 'desc')
                            .where('pernr', params.pernr)
                            .offset(start)
                            .limit(length);

        for(let i = 0; i < pegawai.length; i++) {
            if(i == 0) {
                pegawai[i]['periode'] = `${new Date(pegawai[i].begda).getFullYear()}-Now`;
            } else if(new Date(pegawai[i].begda).getFullYear() == new Date(pegawai[i-1].begda).getFullYear()) {
                pegawai[i]['periode'] = new Date(pegawai[i].begda).getFullYear();
            } else {
                pegawai[i]['periode'] = `${new Date(pegawai[i].begda).getFullYear()}-${new Date(pegawai[i-1].begda).getFullYear()}`;
            }
            pegawai[i]['jenis_perusahaan'] = 'BUMN';
            pegawai[i]['nomor'] = i + 1 + Number(start);
        }

        const sql_total_pegawai = `SELECT count(*)AS total 
                                   FROM "safm_perubahan_organisasi"
                                   WHERE "pernr" = ${params.pernr}`;
        const total = await Database.rawQuery(sql_total_pegawai);
        
        const respon = {
            draw : draw,
            recordsTotal : total[0].TOTAL == 0 ? 0 : total[0].TOTAL + 1,
            recordsFiltered : total[0].TOTAL == 0 ? 0 : total[0].TOTAL + 1,
            data : pegawai
        }

        response.json(respon);
    }


    public async listCompany({ view }: HttpContextContract) {
        return view.render('pages/master_pegawai/page/list_company.edge');
    }


    public async dataListCompany({ response, request }: HttpContextContract) {
        
        const search = String(request.input("search").value).toLowerCase();
        const start = request.input("start");
        const length = request.input("length");

        let company: any, total: any;
        if(search != '') {
            company = await Database.from('safm_perubahan_organisasi')
                                .join('master_companies', 'master_companies.company_name', 'like', 'safm_perubahan_organisasi.pbtxt')
                                .distinct('safm_perubahan_organisasi.pbtxt')
                                .whereRaw(`LOWER("safm_perubahan_organisasi"."pbtxt") LIKE '%${search}%'`)
                                .orderBy('safm_perubahan_organisasi.pbtxt', 'asc')
                                .offset(start)
                                .limit(length);
            
            const sql_total = `SELECT COUNT(*) AS TOTAL 
                               FROM (SELECT DISTINCT(spo."pbtxt")
                                     FROM "safm_perubahan_organisasi" spo
                                     JOIN "master_companies" mc
                                     ON mc."company_name" LIKE spo."pbtxt"
                                     WHERE LOWER(spo."pbtxt") LIKE '%${search}%')`;
    
            total = await Database.rawQuery(sql_total);

        } else {
            company =  await Database.from('safm_perubahan_organisasi')
                                .join('master_companies', 'master_companies.company_name', 'like', 'safm_perubahan_organisasi.pbtxt')
                                .distinct('safm_perubahan_organisasi.pbtxt')
                                .orderBy('safm_perubahan_organisasi.pbtxt', 'asc')
                                .offset(start)
                                .limit(length);
    
            const sql_total = `SELECT COUNT(*) AS TOTAL 
                               FROM (SELECT DISTINCT(spo."pbtxt")
                                     FROM "safm_perubahan_organisasi" spo
                                     JOIN "master_companies" mc
                                     ON mc."company_name" LIKE spo."pbtxt")`;
     
            total = await Database.rawQuery(sql_total);
        }

        for(let i = 0; i < company.length; i++) {
            company[i]['nomor'] = i + 1 + Number(request.input("start"));
            company[i]['jenis_perusahaan'] = 'BUMN';
            company[i]['action'] =  `<a href="/master-pegawai/list-employee/${String(company[i].pbtxt).replace(/ /g, '-')}"><i class="fa fa-eye" style="color:#00A3FF;"></i></a>`;
        }

        const respon = {
            "draw" : request.input("draw"),
            "recordsTotal" : total[0].TOTAL,
            "recordsFiltered" : total[0].TOTAL,
            "data" : company
        }
        
        response.json(respon);
    }


    public async companyChart({ request, params }: HttpContextContract) {

        const filter  = request.input('filter');

        const no_filter = Object.values(filter).indexOf('true') == -1;
        
        let org: any;

        const company_id = no_filter && params.company_id != undefined ? params.company_id : '';
        
        if(company_id != '') {
            org = await Database.from('group_companies')
                            .join('master_companies', 'master_companies.company_group', '=', 'group_companies.id')
                            .select('group_companies.name as group_company', 'master_companies.company_name')
                            .whereRaw(`"group_companies"."id" = '${company_id}' AND "master_companies"."id_parent" != '1' OR "group_companies"."id" = '${company_id}' AND "master_companies"."id_parent" IS NULL`)
                            .limit(4);
        } else {
            org = await GroupCompany.query().select("id", "name", "type", "level").orderBy("sort_no", "asc");
        }
        
        let img_pelindo = '<img class="avatar" src="/media/pegawai/img/pelindo2.svg" crossorigin="anonymous" />';
        
        const child:any[] = [];
        
        const node =  {
            id : 0,
            name : '',
            title : '',
            children : child
        }

        let header1: any, header2: any, header: any;
        
        if(company_id != '') {
            console.log(org[0].group_company);
            node.id = 0;
            node.name = img_pelindo;
            node.title = org[0].group_company == 'Head Office' ? 'Non Cluster' : org[0].group_company;
            header = node.children;
        } else {
            
            if(filter.head_office == 'true' || no_filter) {

                if((filter.regional == 'true' && filter.subholding == 'true' && filter.noncluster == 'true') || no_filter) {
                    node.children.push(
                        {
                            id: 1,
                            name : img_pelindo,
                            title : 'Regional',
                            children : [] 
                        }, 
                        {
                            id: 2,
                            name : img_pelindo,
                            title : 'Subholding',
                            children : []
                        },
                        {
                            id: 3,
                            name : `<a href="/master-pegawai/main/${org[0].id}"><img class="avatar" src="/media/pegawai/img/pelindo2.svg" crossorigin="anonymous" /></a>`,
                            title : 'Non Cluster',
                            children : []
                        }
                    );

                    header1 = node.children[0].children;
                    header2 = node.children[1].children;
                } else {

                    if(filter.regional == 'true' || no_filter) {
                        node.children.push(
                            {
                                id: 1,
                                name : img_pelindo,
                                title : 'Regional',
                                children : [] 
                            }
                        );
                        header1 = node.children[0].children;
                    }

                    if(filter.subholding == 'true' || no_filter) {
                        node.children.push(
                            {
                                id: 2,
                                name : img_pelindo,
                                title : 'Subholding',
                                children : [] 
                            }
                        );
                        header2 = node.children[0].children;
                    }

                    if(filter.noncluster == 'true' || no_filter) {
                        node.children.push(
                            {
                                id: 3,
                                name : `<a href="/master-pegawai/main/${org[0].id}"><img class="avatar" src="/media/pegawai/img/pelindo2.svg" crossorigin="anonymous" /></a>`,
                                title : 'Non Cluster',
                                children : [] 
                            }
                        );
                    }
                }
            }
        }
        
        for(let i = 0; i < org.length; i++) {
            if(company_id != '') {
                const new_node = {
                    id : i,
                    name : img_pelindo,
                    title : org[i].company_name,
                    children : []
                };
                
                header.push(new_node);
            } else {
                if(i == 0) {
                    if(filter.head_office == 'true' || no_filter) {
                        node.id = i;
                        node.name = img_pelindo,
                        node.title = org[i].name;
                    }
                } else {
                    const new_node = {
                        id : i,
                        name : `<a href="/master-pegawai/main/${org[i].id}"><img class="avatar" src="/media/pegawai/img/pelindo2.svg" crossorigin="anonymous" /></a>`,
                        title : org[i].name,
                        children : []
                    };
    
                    if(org[i].level == org[i - 1].level && org[i].type == org[i - 1].type) {
                        continue;
                    }
    
                    if(org[i].type == "REGIONAL") {
                        if(filter.regional == 'true' || no_filter) {
                            header1.push(new_node);
                        }
                    } else {
                        if(filter.subholding == 'true' || no_filter) {
                            header2.push(new_node);
                        }
                    }
    
                    for(let x = 0; x < org.length; x++) {
                        if(org[i].level == org[x].level && org[i].type == org[x].type) {
                            if(i == x) {
                                continue;
                            } else {
                                const same_node = {
                                    id : x,
                                    name : `<a href="/master-pegawai/main/${org[x].id}"><img class="avatar" src="/media/pegawai/img/pelindo2.svg" crossorigin="anonymous" /></a>`,
                                    title : org[x].name,
                                    children : []
                                };
        
                                if(org[i].type == "REGIONAL") {
                                    if(filter.regional == 'true' || no_filter) {
                                        header1.push(same_node);
                                    }
                                } else {
                                    if(filter.subholding == 'true' || no_filter) {
                                        header2.push(same_node);
                                    }
                                }
                            }
                        }    
                    }
                    
                    if(org[i].type == "REGIONAL") {
                        if(filter.regional == 'true' || no_filter) {
                            header1 = header1[0]['children'];
                        }
                    } else {
                        if(filter.subholding == 'true' || no_filter) {
                            header2 = header2[0]['children'];
                        }
                    }
    
                }

            }
               
        }
        
        return node;
    }

}
