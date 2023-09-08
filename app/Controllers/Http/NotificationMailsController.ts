import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class NotificationMailsController {
    public async sendnotifmail({request}: HttpContextContract) {
        
        const {email_to, subject, messageText} = request.body();   
        const emailFrom = 'info@example.com'
        await Mail.send((message) => {
            message
              .from(emailFrom)
              .to(email_to)
              .subject(subject)
              .htmlView('emails/notifications', { name: 'Virk' , messageText: messageText})
          })
        
          return 'success'
      
      }
}
