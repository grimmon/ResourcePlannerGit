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
    public class ProjectController : ApiController
    {
        [HttpGet]
        [Authorize]

        public async Task<IHttpActionResult> Get(string searchTerms = "")
        {

#if Mock
            var access = new MockDropdownDataAccess();
#else
            var access = new ProjectDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            List<IdNameGeneric> projects;

            try
            {
                projects = access.GetProjects(searchTerms);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(projects);
        }
    }
}
}
