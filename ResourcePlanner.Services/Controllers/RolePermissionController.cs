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
    public class RolePermissionController : ApiController
    {
        [HttpPost]

        public async Task<IHttpActionResult> Add(int permissionId, int appRoleId)
        {
            var access = new RolePermissionDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            try
            {
                access.Add(permissionId, appRoleId);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }

        [HttpPost]

        public async Task<IHttpActionResult> Delete(int permissionId, int appRoleId)
        {
            var access = new RolePermissionDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            try
            {
                access.Remove(permissionId, appRoleId);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }
    }
}
