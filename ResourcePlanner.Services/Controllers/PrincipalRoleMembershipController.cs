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
    public class PrincipalRoleMembershipController : ApiController
    {
        [HttpPost]

        public async Task<IHttpActionResult> Add(int securityPrincipalId, int appRoleId)
        {
            var access = new PrincipalRoleMembershipDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            try
            {
                access.Add(securityPrincipalId, appRoleId);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }

        [HttpPost]

        public async Task<IHttpActionResult> Delete(int securityPrincipalId, int appRoleId)
        {
            var access = new PrincipalRoleMembershipDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            try
            {
                access.Remove(securityPrincipalId, appRoleId);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }
    }
}
