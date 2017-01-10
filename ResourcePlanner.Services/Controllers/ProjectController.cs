using ResourcePlanner.Services.DataAccess;
using ResourcePlanner.Services.Models;
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
    [RoutePrefix("api/project")]
    public class ProjectController : ApiController
    {
        [HttpGet]
        //[Authorize]
        [Route("get")]
        public async Task<IHttpActionResult> Get(string searchTerm = "")
        {

#if Mock
            var access = new AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#else
            var access = new AddAssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            List<IdNameGeneric> values;

            try
            {
                values = access.GetProjects(searchTerm);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(values);
        }

        [HttpGet]
        //[Authorize]
        [Route("wbs")]
        public async Task<IHttpActionResult> GetWbs(string searchTerm = "")
        {

#if Mock
            var access = new AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#else
            var access = new AddAssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            List<IdNameGeneric> values;

            try
            {
                values = access.GetWBSProjects(searchTerm);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(values);
        }

        [HttpPost]
        [Authorize]
        [Route("add")]
        public async Task<IHttpActionResult> Add(
            string projectName,
            DateTime startDate,
            DateTime endDate,
            int? customerId = null,
            string customerName = "",
            int? opportunityOwnerId = null,
            int? projectManagerId = null,
            string description = "")
        {
#if Mock
            return Ok();
#endif


            var access = new AddProjectDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));


            var project = new AddProject()
            {
                ProjectName = projectName,
                StartDate = startDate,
                EndDate = endDate,
                CustomerId = customerId,
                CustomerName = customerName,
                OpportunityOwnerId = opportunityOwnerId,
                ProjectManagerId = projectManagerId,
                Description = description
            };

            try
            {
                var projectReturn = access.AddProject(project);
                if (projectReturn == null)
                {
                    return Content(HttpStatusCode.InternalServerError, "Error retrieving added ProjectId");
                }
                return Ok(projectReturn);
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        [HttpPost]
        [Authorize]
        [Route("update")]
        public async Task<IHttpActionResult> Update(string OldWBSCode, int newProjectMasterId)
        {
#if Mock
            return Ok();
#endif


            var access = new AddProjectDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            try
            {
                var projectReturn = access.UpdateProject(OldWBSCode, newProjectMasterId);
                if (projectReturn == null)
                {
                    return Content(HttpStatusCode.InternalServerError, "Error updating WBS Code");
                }
                return Ok(projectReturn);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
