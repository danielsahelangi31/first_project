import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JobPosition from 'App/Models/JobPosition'

export default class JobPositionsController {
    public async index({ view, bouncer }: HttpContextContract) {
        await bouncer.authorize("access", "view-job-position")
        const jobPositions:any = await
        JobPosition.query()

        return view.render('pages/job_position/index', {data: jobPositions})
    }

    public async create({ view }: HttpContextContract) {
        try {
            const divisi:any = await JobPosition.query().distinct('departement')
    
            return view.render('pages/job_position/create', {data: divisi})
        } catch (error) {
            return error
        }
    }

    public async store({request, session, response}: HttpContextContract) {
        try {
            const {divisi, jobPosition} = request.body();
            let divisiValue:any = divisi.find(val => val != null)
    
            const jobPosistionSave = new JobPosition()
            jobPosistionSave.name = jobPosition.toUpperCase()
            jobPosistionSave.departement = divisiValue.toUpperCase()
            jobPosistionSave.save()
            session.flash('success', {
                title: "successfully",
                message: "Data berhasil tersimpan"
            })
    
            return response.redirect().toPath('/job-position')
        } catch (error) {
            return error
        }
    }

    public async show({params, view}: HttpContextContract) {
        try {
            const id:string = params.id
            
            const jobPosition:any = await JobPosition.find(id)
            const divisi:any = await JobPosition.query().distinct('departement')

            const state = {
                jobPosition,
                divisi
            }
            return view.render('pages/job_position/edit', {data: state})
        } catch (error) {
            return error
        }
    }

    public async edit({params, response, request, session}: HttpContextContract) {
        try {
            const jobPosition = request.input('jobPosition');
            const departement = request.input('divisi');
            const departementValue = departement.find(val => val != '')
            const id:string = params.id;

            const jobPositionEdit = await JobPosition
            .query()
            .where('id', id)
            .update({
                name: jobPosition.toUpperCase(),
                departement: departementValue.toUpperCase()
            });

            if(jobPositionEdit) {
                session.flash('success', {
                    title: "Successfuly",
                    message: "Data berhasil diperbarui"
                });
            };

            return response.redirect().toPath('/job-position')
        } catch (error) {
            console.log(error);
            
        }
    }

    public async destroy({ params }: HttpContextContract) {
        try {
            const id:string = params.id;

            const jobPosition:any = await JobPosition.find(id);
            await jobPosition.delete();

            return true;
        } catch (error) {
            return error;
        }
    }

    public async findJobPosition({request}: HttpContextContract) {
        try {
            let jobPosition:string = request.input('jobPosition').toUpperCase();
            let divisi:string = request.input('divisi');
            let action:string = request.input('action');
            let jobPositionDuplicate:any
            let id:string = request.input('id')

            if(action === 'create') {
                jobPositionDuplicate = await JobPosition.query()
                    .where("name", jobPosition)
                    .where("departement", divisi)
                    .first();
            } else if(action === 'edit') {
                jobPositionDuplicate = await JobPosition.query()
                    .where('name', jobPosition)
                    .where('departement', divisi)
                    .where('id', '!=', id)
                    .first()
            }            

            return jobPositionDuplicate?true:false;
        } catch (error) {
            return error
        }
    }
}
