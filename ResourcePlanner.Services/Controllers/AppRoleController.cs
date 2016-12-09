using ResourcePlanner.Services.DataAccess;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ResourcePlanner.Services.Controllers
{
    public class AppRoleController : ApiController
    {
        [HttpPost]

        public async Task<IHttpActionResult> Insert(string name, bool setAsDefault = false)
        {
            var access = new AppRoleDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            try
            {
                access.Insert(name, setAsDefault);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }

        [HttpPost]

        public async Task<IHttpActionResult> Update(int appRoleId, string name= null, bool? setAsDefault = null)
        {
            var access = new AppRoleDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            try
            {
                access.Update(appRoleId, name, setAsDefault);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }
        [HttpPost]

        public async Task<IHttpActionResult> Delete(int AppRoleId)
        {
            var access = new AppRoleDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            try
            {
                access.Delete(AppRoleId);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }
    }
}
