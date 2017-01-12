using ResourcePlanner.Services.DataAccess;
using ResourcePlanner.Services.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace ResourcePlanner.Services.Controllers
{
    [RoutePrefix("api/resourcebreakdown")]
    public class ResourceBreakdownController : ApiController
    {
        [HttpGet]
        [Authorize]
        public async Task<IHttpActionResult> Get(int ResourceId, DateTime StartDate, DateTime EndDate)
        {
            
            var login = HttpContext.Current.User.Identity.Name;
#if Mock
            var access = new MockDataAccess();
#else
            var access = new ResourceBreakdownDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            ResourceBreakdown breakdown;

            try
            {
                breakdown = access.GetResourceBreakdown(ResourceId, StartDate, EndDate);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(breakdown);
        }
    }
}
