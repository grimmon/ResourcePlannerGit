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
    public class ProjectViewController : ApiController
    {
        [HttpGet]
        [Authorize]
        public async Task<IHttpActionResult> Get(int? ProjectId = null)
        {
            if (ProjectId == null)
            {
                ProjectId = 44981;
            }
#if Mock
            var access = new MockDataAccess();
#else
            var access = new ProjectPageDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            ProjectPage projectPage;

            try
            {
                projectPage = access.GetProjectPage(ProjectId.Value);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(projectPage);
        }
    }
}
