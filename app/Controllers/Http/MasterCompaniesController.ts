import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CompanyView from 'App/Models/CompanyView'
import GroupCompany from 'App/Models/GroupCompany'
import MasterCompany from 'App/Models/MasterCompany'
import MasterCompanyAccount from 'App/Models/MasterCompanyAccount'
import excel from "exceljs"


export default class MasterCompaniesController {
  public async index({ view, bouncer, request }: HttpContextContract) {
    try {
      await bouncer.authorize("access", "view-master-company")
      let status:string = request.input('status')
      let company:any

        const draftCompany = await Database.from('master_companies')
        .count('* as draft')
        .where('status', '=', 'draft')
        .first()

        const activeCompany = await Database.from('master_companies')
        .count('* as active')
        .where('status', '=', 'active')
        .first()

        const nonActiveCompany = await Database.from('master_companies')
        .count('* as non_active')
        .where('status', '=', 'non-active')
        .first()
        

        if(!status) {
          company = await CompanyView.query().orderBy('created_at', 'desc')
        } else if(status) {          
          company = await CompanyView.query()
          .where('status', `${status}`).orderBy('created_at', 'desc')
        }

        let countData:any = {
          draft: draftCompany.draft,
          active: activeCompany.active,
          non_active: nonActiveCompany.non_active
        }
        
      return view.render('pages/master_company/index', { data: company, countData })
    } catch (error) {
      return error
    }
  }

  public async create({ view, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "create-master-company")
    const groupCompany = await GroupCompany.all()

    let data = {
      groupCompany,
    }
    return view.render('pages/master_company/create', { data: data })
  }

  public async parentSearch({params}: HttpContextContract) {
    const id = params.id
    
    const companies:any = await MasterCompany.query()
    .whereRaw(`
    "company_group" = '${id}' AND "status" = 'active'
    `)
    
    return companies
  }

  public async importPage({view, request}: HttpContextContract) {
    const workbook = new excel.Workbook()

    const dataExcel = request.file("importExcel", {size: "10mb"})
    let nameFile = new Date().getTime().toString() + 'importNewFile.xls'
      
      await dataExcel?.move(Application.tmpPath('excel'), {
        name: nameFile,
        overwrite: true,
      })

      let importFile = await workbook.xlsx.readFile(`tmp/excel/${nameFile}`)  

      let explanation = importFile.getWorksheet('Data')
      
      let colComment = explanation.getColumn('A')
      
      let temp:any = []
      let tempData:any = []
      colComment.eachCell((cell, rowNumber) => {
        if (rowNumber >= 3) {
          let parent = explanation.getCell('A' + rowNumber).value
          let companyCode:any = explanation.getCell('B' + rowNumber).value
          let companyName = explanation.getCell('C' + rowNumber).value
          let companyGroup = explanation.getCell('D' + rowNumber).value
          let sapCode = explanation.getCell('E' + rowNumber).value
          let profitCenter = explanation.getCell('F' + rowNumber).value
          let errorFlag:boolean = false
          let errorDescription:string =""
          companyCode = Number(companyCode)
          
          let dataMaster:any = new Promise((resolve, reject) => {
            resolve(MasterCompany.findBy('company_code', companyCode))
          })

          tempData.push(dataMaster);
          

          if(companyCode === null || companyName === null || companyGroup === null) {
            errorFlag = true
          } 

          if(companyCode == null) {
            errorDescription += "kesalahan input company code"
          } 

          if (companyName == null) {
            errorDescription?errorDescription += ", kesalahan input company name": errorDescription += "kesalahan input company name"
          }

          if (companyGroup == null) {
            errorDescription?errorDescription += ", kesalahan input company group": errorDescription += "kesalahan input company group"
          }

            temp.push({
              id_parent: parent?parent:'-',
              company_code: companyCode?companyCode:'-',
              company_name: companyName?companyName:'-',
              company_group: companyGroup?companyGroup:'-',
              status: 'active',
              sap_code: sapCode?sapCode:'-',
              profit_center: profitCenter?profitCenter:'-',
              errorFlag,
              errorDescription
            })
          }
        })
        
        let uniqCode:any = uniqCompany(temp)
        let existData:any
        await Promise.all(tempData)
        .then((data) => {
            existData = temp.map((el:any) => {              
            let findUniqCode = findUniq(uniqCode, el.company_code)
            if(findUniqCode == true) {
              el.errorFlag = true
              el.errorDescription?el.errorDescription += ", Input company code duplicate": el.errorDescription += "Input company code duplicate"
            }
            let filtering = data.find((e:any) => e?.company_code === el.company_code)
            if(!!filtering && filtering != undefined) {
              el.errorDescription?el.errorDescription += ", Company sudah ada": el.errorDescription += "Company code sudah ada"
              return {...el, existData: true}
            } else return {...el, existData: false}
          })
        })
        .catch((error) => {
          console.log(error);
        })

        function findUniq(arr:any,checkCode:any) {
          for (let i = 0; i < arr.length; i++) {
              if (arr[i] === checkCode) {
                return true                
              }
        }
        }

        function uniqCompany(arr:any) {
          let result:any = []
          for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].company_code === arr[j].company_code) {
                result.push(arr[j].company_code)
              }
            }
          }
          return result
        }
        
        return view.render('pages/master_company/review', {dataFile : existData, nameFile: nameFile})
  }

  public async saveExcel({request, response, session}: HttpContextContract) {
    const {importExcel, status} = request.body()

    async function loopSaving() {
      const workbook = new excel.Workbook()
      let data = await workbook.xlsx.readFile(`tmp/excel/${importExcel}`)      
      let explanation = data.getWorksheet('Data')
      let colComment = explanation.getColumn('A')

      return colComment.eachCell(async (cell, rowNumber) => {
        if (rowNumber >= 3) {
          let parent = explanation.getCell('A' + rowNumber).value
          let companyCode = explanation.getCell('B' + rowNumber).value
          let companyName = explanation.getCell('C' + rowNumber).value
          let companyGroup = explanation.getCell('D' + rowNumber).value
          let sapCode = explanation.getCell('E' + rowNumber).value
          let profitCenter = explanation.getCell('F' + rowNumber).value
          
          const group:any = await GroupCompany.findBy('name', `${companyGroup}`)
          let company_parent:any
          if(parent) {
            company_parent = await CompanyView.findBy('company_name', `${parent}`)
          } else {
            company_parent = null
          }
          
          let data:any = {
            id_parent: company_parent?.id,
            company_code: companyCode,
            company_name: companyName,
            company_group: group.id,
            status: status
          }
          
          let newCompany = await MasterCompany.create(data)
          
          let companyAccount:any = {
            id_company_terminal: newCompany.id,
            profit_center: profitCenter,
            sap_code: sapCode
          }
          
          let companyAccountnoSapProfit:any = {
            id_company_terminal: newCompany.id,
            profit_center: '-',
            sap_code: '-'
          }
          
          if(sapCode && profitCenter) {
            await MasterCompanyAccount.create(companyAccount)
          } else if(sapCode = null && profitCenter == null) {
            await MasterCompanyAccount.create(companyAccountnoSapProfit)
          }
          
        }
      })
    }

    
    await loopSaving()
    .then(((data) => {
      if (status === "active") {
        session.flash("success", {
          title: "Successfully",
          message: "Data berhasil terkirim"
        })
      }
      if (status === "draft") {
        session.flash("success", {
          title: "Successfully",
          message: "Data akan disimpan sementara"
        })
      }
      return response.redirect().toPath('/master-company')
    }))
      
  }

  public async store({ request, response, session, bouncer }: HttpContextContract) {  
    try {
        await bouncer.authorize("access", "create-master-company")
        const { companyCode, status, sapCode, groupCompany, companyName, profitCenter, parentCompany } =
        request.body()

        let [duplicateGroupCompany] = await Database.rawQuery(`
        SELECT "name" FROM "group_companies" WHERE UPPER("name") LIKE UPPER(:groupName)
        `, {
          groupName:companyName
        })
        
        const company = new MasterCompany()
        company.id_parent = duplicateGroupCompany? 1 : parentCompany
        company.company_code = companyCode
        company.company_name = companyName
        company.company_group = groupCompany
        company.status = status

        await company.save()
        if (status === "active") {
          session.flash("success", {
            title: "Successfully",
            message: "Data berhasil terkirim"
          })
        }
        if (status === "draft") {
          session.flash("success", {
            title: "Successfully",
            message: "Data akan disimpan sementara"
          })
        }
        

        if(sapCode && profitCenter) {
            const companyAccount = new MasterCompanyAccount()
            companyAccount.id_company_terminal = company.id
            companyAccount.profit_center = profitCenter
            companyAccount.sap_code = sapCode
            await companyAccount.save()
            return response.redirect().toPath('/master-company')
        }

        return response.redirect().toPath('/master-company')
    } catch (error) {
      console.log(error);
      
      return error
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    try {
      await bouncer.authorize("access", "delete-master-company")
      const id = params.id

      const company:any = await MasterCompany.find(id)

      await company.delete()
      
      return true
    } catch (error) {
      return error
    }
  }

  public async show({ view, params, bouncer }: HttpContextContract) {
    try {
      await bouncer.authorize("access", "edit-master-company")
      const id = params.id
      const groupCompany = await GroupCompany.all()
      const company:any = await MasterCompany.find(id)
      const companyAccount = await MasterCompanyAccount.findBy('id_company_terminal', id)
      const parentCompany = await MasterCompany.query().whereRaw(`
        "company_group" = '${company.company_group}' AND "company_code" != ${company.company_code}
        `)
      let data = {
      groupCompany,
      company,
      parentCompany,
      companyAccount
      }

    return view.render('pages/master_company/edit', { data: data })
    } catch (error) {
      return error
    }
  }

  public async edit({request, response, params, session, bouncer}: HttpContextContract) {
    try {
      await bouncer.authorize("access", "edit-master-company")
        let id:any = params.id        
        
        const companyCode = request.input('companyCode')
        const sapCode = request.input('sapCode')
        const groupCompany = request.input('groupCompany')
        const companyName = request.input('companyName')
        const profitCenter = request.input('profitCenter')
        const parentCompany = request.input('parentCompany')
        const status = request.input('status')
        const companyAccount:any = await MasterCompanyAccount.findBy('id_company_terminal', id)

        if(companyAccount) {
          await MasterCompanyAccount
          .query()
          .where('id_company_terminal', id)
          .update(
            {
              'profit_center': profitCenter?profitCenter:null,
              'sap_code': sapCode?sapCode:null
            }
          )
        }
        
        if(!companyAccount){
            const companyAccountSave = new MasterCompanyAccount()
            companyAccountSave.id_company_terminal = id
            companyAccountSave.profit_center = profitCenter
            companyAccountSave.sap_code = sapCode
            await companyAccountSave.save()
          }

        await MasterCompany
        .query()
        .where('id', id)
        .update(
          {
            'company_code': companyCode,
            'company_name': companyName,
            'company_group': groupCompany,
            'id_parent': parentCompany,
            'status': status
          }
        )

        session.flash("success", {
          title: "Successfully",
          message: "Data berhasil diperbarui"
        })

        return response.redirect().toPath('/master-company')
    } catch (error) {
      return error
    }
  }

  public async updateStatus({response, params, session, bouncer}: HttpContextContract) {
    try {
      await bouncer.authorize('access', 'activate-master-company')
      const id = params.id
      const company = await MasterCompany.findBy('id', id)
      let statusNew:string = ""

      if(company?.status === "active") {
        statusNew = "non-active"
      } else if (company?.status === "non-active") {
        statusNew = "active"
      }

      await MasterCompany
      .query()
      .where('id', id)
      .update({status: statusNew})
      if(company) {
        session.flash("success", {
          title: "Successfully",
          message: "Status berhasil diperbarui"
        })
      }
      
      return response.redirect().toPath('/master-company')
    } catch (error) {
      return error
    }
  }

  public async companyDetail({view,params}: HttpContextContract) {
    try {
      const id = params.id
      const groupCompany = await GroupCompany.all()
      const company:any = await MasterCompany.find(id)
      const parentCompany = await MasterCompany.findBy('id', company.id_parent)
      const companyAccount = await MasterCompanyAccount.findBy('id_company_terminal', id)      
      
      let data = {
      parentCompany,
      groupCompany,
      company,
      companyAccount
      }

      return view.render('pages/master_company/detail', { data: data })
    } catch (error) {
      return error
    }
  }

  public async createExcelTemplate({response}: HttpContextContract) {
    try {
      const workbook = new excel.Workbook()
      workbook.creator = 'Pelindo Solusi Digital';
      const worksheet = workbook.addWorksheet("Data");
      const worksheet2 = workbook.addWorksheet("company_group");
      const worksheet3 = workbook.addWorksheet("parent_company");
      const groupCompany = await GroupCompany.all();

      worksheet2.columns = [
        { header: 'List Group', key: 'listGroup', width: 30 }
      ]

      worksheet3.columns = [
        { header: 'List Parent Company', key: 'listParent', width: 40 }
      ]

      function addParentCompany() {
        return new Promise((resolve, reject) => {
          resolve(CompanyView.query().where('status', 'active'))
        })
      }

      let countParent = await addParentCompany()
      .then((data:any) => {
        data.forEach((el:any) => {
          worksheet3.addRow({
            listParent: el.company_name
          })
        })
        return data.length
      })
      
      groupCompany.forEach(el => {
        worksheet2.addRow({
          listGroup: el.name
        })
      });

      worksheet.columns = [
        { header: 'Parent Company', key: 'Parent_Company', width: 25},
        { header: 'Company Code', key: 'Company_Code', width: 35 },
        { header: 'Company Name', key: 'Company_Name', width: 35},
        { header: 'Company Group', key: 'Company_Group', width: 35},
        { header: 'SAP Code', key: 'SAP_Code', width: 20},
        { header: 'Profit Center', key: 'Profit_Center', width: 20}
      ];

      let cellArr:any = ['A','B','C','D','E','F']
      for (let index = 0; index < cellArr.length; index++) {
        worksheet.getCell(cellArr[index] + '1').border = {
          top: {style:'double', color: {argb:'000000'}},
          left: {style:'double', color: {argb:'000000'}},
          bottom: {style:'double', color: {argb:'000000'}},
          right: {style:'double', color: {argb:'000000'}}
        };
      }
      
      worksheet.addRow({
        Parent_Company: 'Example: Pelindo HO', 
        Company_Code: 'Example: 110000 (Mandatory)',
        Company_Name: 'Example: Pelindo (Mandatory)',
        Company_Group: 'Example: Regional 2 (Mandatory)',
        SAP_Code: 'Example: 20111',
        Profit_Center: 'Example: PC_20111'
      })

      for (let index = 3; index < 100 ; index++) {
        worksheet.getCell('A'+`${index}`).dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: [`parent_company!$A$2:$A$${countParent}`]
        }

        worksheet.getCell('D'+`${index}`).dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: [`company_group!$A$2:$A$10`]
        }
      }

      await workbook.xlsx.writeFile('public/media/template_excel_master/template_input_master_company.xlsx');
      const filePath = Application.publicPath('media/template_excel_master/template_input_master_company.xlsx');
      return response.download(filePath);
    } catch (error) {
      console.log(error);
    }
  }

  public async findCodeCompany({request}: HttpContextContract) {
    try {      
      let code = request.input('code')
      let action = request.input('action')
      let id = request.input('id')
      let codeCompany:any
      
      if(action === 'create') {
        codeCompany = await CompanyView.findBy('code_company', code)
      } else if(action === 'edit') {
        codeCompany = await CompanyView.query()
        .where('code_company', code)
        .where('id', '!=', `${id}`)
        .first()
      }

      if(codeCompany) {
        return true
      } else if(!codeCompany){
        return false
      }
    } catch (error) {
      return error
    }
  }
}
