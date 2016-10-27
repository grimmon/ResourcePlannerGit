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
    public class AddAssignmentController : ApiController
    {
        public async Task<IHttpActionResult> Post(int ResourceId, int ProjectId, double Hours, DateTime StartDate, DateTime EndDate)
        {


            var access = new AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            var asgn = new AddAssignment()
            {
                ResourceId = ResourceId,
                ProjectId = ProjectId,
                Hours = Hours,
                StartDate = StartDate,
                EndDate = EndDate
            };

            try
            {
                access.AddAssignment(asgn);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }
    }
}
