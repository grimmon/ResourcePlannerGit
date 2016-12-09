using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using ResourcePlanner.Services.DataAccess;

namespace ResourcePlanner.Services.Controllers
{
    public class SecurityPrincipalController : ApiController
    {
        [HttpPost]

        public async Task<IHttpActionResult> Insert(string login)
        {
            var access = new SecurityPrincipalDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            try
            {
                access.Insert(login);
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
            var access = new SecurityPrincipalDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
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
