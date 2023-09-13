import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import RolePermission from "App/Models/RolePermission";
import Menu from "App/Models/Menu";
import MasterType from "App/Models/MasterType";
import axios from "axios";
import { Exception } from "@poppinss/utils";
import Role from "App/Models/Role";


export default class LoginController {
  public async index({ view }: HttpContextContract) {
    const dataType = await MasterType.all();
    const state = {
      dataType: dataType
    };
    return view.render("pages/login/index", state);
  }

  public async registerProsess({ request, response }: HttpContextContract) {
    const user = new User();
    // user.email = "admin@gmail.com";
    user.email = request.input("email");
    user.role_id = request.input("role_id");
    user.name = request.input("name");
    user.password = "123456";

    // Insert to the database
    await user.save();
    // console.log(user);
    response.send(user);
  }

  public async loginProsess({ request, response, auth, session }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    const defaultPassword = "B1smill4h";
    try {
      //START PORTAL SI
      const customConfig = {
        timeout: 60000,
        headers: {
          "Content-Type": "application/json"
        }
      };
      const payload = JSON.stringify({
        application_id: "4482",
        user_name: email,
        user_password: password
      });

      const portalSi = await axios.post("http://eap-prsi.pelindo.co.id/portalsi-ws/portalsi/loginVal", payload, customConfig)
        .catch(function(error) {
          throw new Exception("Failed Connect Portal SI");

        });
      if (portalSi.data.STATUS == "E") {
        throw new Exception(portalSi.data.pesan);
      }
      const hakAksess = portalSi.data.HAKAKSES;
      const arrHakAksess = hakAksess.split(",", 1);
      const portalRoleId = arrHakAksess[0];
      const name = portalSi.data.NAMA;
      const emailNotif = portalSi.data.EMAIL;
      console.log(portalRoleId);
      const role = await Role.query().where("portal_id", portalRoleId).first();
      if (!role) {
        throw new Exception("Role Not Registered");
      }

      const user = await User.query().where("email", email).first();
      if (user) {
        const userUpdate = await User.find(user.id);
        userUpdate.email = email;
        userUpdate.password = defaultPassword;
        userUpdate.name = name;
        userUpdate.role_id = role.id;
        userUpdate.email_notif = emailNotif;
        await userUpdate.save();
      } else {
        const createUser = new User();
        createUser.email = email;
        createUser.role_id = role.id;
        createUser.name = name;
        createUser.password = defaultPassword;
        createUser.email_notif = emailNotif;
        await createUser.save();
      }
      //END PORTAL SI

      await auth.use("web").attempt(email, defaultPassword);
      // @ts-ignore
      const roleId = auth.user.role_id;
      const rolePermissionMenu = await RolePermission
        .query()
        .where("role_id", roleId).preload("permission");
      const menuArray = [];
      const permissions = [];
      rolePermissionMenu.forEach(function(value) {
        // @ts-ignore
        menuArray.push(value.permission.menu_id);
        // @ts-ignore
        permissions.push(value.permission.name);
      });
      const parentMenu = await Menu.query().whereIn("id", menuArray).withScopes((scopes) => scopes.parent()).withScopes((scopes) => scopes.active()).preload("childMenu");
      session.put("menus", parentMenu);
      session.put("menuPermission", menuArray);
      session.put("permissions", permissions);
      response.redirect("/home");
    } catch (error) {
      session.flash("errors", {
        title: "Login Failed",
        message: error.message
      });
      response.redirect("/login");
    }
  }

}
