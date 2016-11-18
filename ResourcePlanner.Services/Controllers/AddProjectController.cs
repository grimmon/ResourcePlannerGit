using ResourcePlanner.Services.DataAccess;
using ResourcePlanner.Services.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;


namespace ResourcePlanner.Services.Controllers
{
    public class AddProjectController : ApiController
    {
        [Authorize]
        [HttpPost]

        public async Task<IHttpActionResult> Post(
            string projectName, 
            DateTime startDate, 
            DateTime endDate, 
            int? clientId = null,
            string clientName = "", 
            int? opportunityOwner = null, 
            int? projectManager = null,
            string description = "")
        {
#if Mock
            return Ok();
#endif
            var authAccess = new AuthDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            var CurrentUser = User.Identity as ClaimsIdentity;
            var EmailClaim = CurrentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Upn);
            if (EmailClaim == null)
            {
                return Unauthorized();
            }
            if (!authAccess.CheckAuth(EmailClaim.Value, "RM"))
            {
                return Unauthorized();
            }

            var access = new AddProjectDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));


            var project = new AddProject()
            {
                ProjectName = projectName,
                StartDate = startDate,
                EndDate = endDate,
                CustomerId = clientId,
                CustomerName = clientName,
                OpportunityOwnerId = opportunityOwner,
                ProjectManagerId = projectManager,
                Description = description
            };

            try
            {
                access.AddProject(project);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }
    }
}
