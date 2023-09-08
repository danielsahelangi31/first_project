import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from '@ioc:Adonis/Lucid/Database';
import Entity from 'App/Models/Entity';
import JobTitle from "App/Models/JobTitle";
import GroupCompany from "App/Models/GroupCompany";
import MasterCompany from "App/Models/MasterCompany";

export default class EntityLocationsController {
    public async index({ view, bouncer }: HttpContextContract) {
        await bouncer.authorize("access", "view-entity")
        const entity:any = await 
        Entity.query()
        .preload('groupCompany')
        .preload('masterCompany')
        .preload('jobTitle')
        .orderBy('created_at', 'desc')
        

        let data = entity.map((element:any) => {
          return {
            entity_name: element.masterCompany.company_name,
            id: element.id,
            location_name: element.groupCompany.name,
            job_title: element.jobTitle.name,
            departement: element.jobTitle.departement,
            alias: element.title_alias
          }
        })
                
        return view.render('pages/location/index', 
        {
          data: data,
        })
      }

      //add Entity
      public async create({view, bouncer}: HttpContextContract) {
        await bouncer.authorize("access", "create-entity")
        const groupCompany:any = await GroupCompany.all()
        const company:any = await MasterCompany.all()
        const JobTitles = await JobTitle.query().orderBy('departement', 'asc');
        let data = {
          groupCompany,
          company,
          JobTitles
        }
                
        return view.render('pages/location/create', { data: data, HO: data });  
      }

      
      public async store({ request, response, session, bouncer }: HttpContextContract) {
          const {jobTitle, entityName, idLocation, alias} = request.body(); 
        try {
            await bouncer.authorize("access", "create-entity")
            const existEntity = await Entity.query()
            .whereRaw(`
            "id_entity" = '${entityName}' AND "id_job_title" = '${jobTitle}'
            `)
            
            if (existEntity.length > 0 ) {
              session.flash('errors', {
              title: "failed",
              message: "Data Entity sudah tersedia"
              })

            return response.redirect().toPath('/entity/create')
            }
            
            const entity = new Entity()
            entity.id_location = idLocation
            entity.id_entity = entityName
            entity.id_job_title = jobTitle
            entity.title_alias = alias.toUpperCase()
            entity.save()
            session.flash('success', {
              title: "successfully",
              message: "Data berhasil tersimpan"
            })
            return response.redirect().toPath('/entity')
        } catch (error) {
          return error
        }
      }

      //update
      public async show({params, view, bouncer}: HttpContextContract) {
        const idEntity = params.id

        try {
        await bouncer.authorize("access", "edit-entity")
        const entity = await Entity
        .query()
        .preload('groupCompany')
        .preload('masterCompany')
        .preload('jobTitle')
        .where('id', idEntity)

        let companyGroupId:any = entity[0].id_location
        
        const groupCompany:any = await GroupCompany.all()
        const company:any = await MasterCompany
        .query()
        .where('company_group', companyGroupId)

        const JobTitles = await JobTitle.query().orderBy('departement', 'asc');

        let data = {
          entity,
          groupCompany,
          company,
          JobTitles
        }
        
        return view.render('pages/location/edit', {data: data, id: idEntity}); 
        } catch (error) {          
            return error
        }

      }

      public async edit({ request, response, params, session }: HttpContextContract) {
        try {
          const id = params.id
          const job_title  = request.input('jobTitle')
          const id_location = request.input('idLocation')
          const entity_name = request.input('entityName')
          const job_title_alias = request.input('alias')
          
          const entity = await Entity
          .query()
          .where('id', id)
          .update({
            id_location: id_location,
            id_entity: entity_name,
            id_job_title: job_title,
            title_alias: job_title_alias.toUpperCase()
          })
          
          if (entity) {
            session.flash('success', {
              title: "Successfuly",
              message: "Data berhasil diperbarui"
            })
          }
          
          return response.redirect().toPath('/entity')
        } catch (error) { 
          return error
          
        }
      }

      //findEntity
      public async entitySearch({params}: HttpContextContract) {
        const locationId = params.id
        
        const companies:any = await MasterCompany.query()
        .where('company_group', locationId)
        
        return companies
      }

      //destroy entity
      public async destroy ({ params, bouncer }: HttpContextContract) {
        try {
          await bouncer.authorize("access", "delete-entity")
          const id = params.id
          
          const entity:any = await Entity.find(id)
          await entity.delete()

          return true
        } catch (error) {
          return error
        }
      }

}