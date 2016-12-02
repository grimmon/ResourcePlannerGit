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
using static ResourcePlanner.Services.Enums.Enums;

namespace ResourcePlanner.Services.Controllers
{
    public class ResourceDetailController : ApiController
    {
        [HttpGet]
        [Authorize]
        public async Task<IHttpActionResult> Get(int? ResourceId = null, TimeAggregation agg = TimeAggregation.Weekly, DateTime? StartDate = null, DateTime? EndDate = null)
        {
            if (StartDate == null)
            {
                StartDate = DateTime.Now.AddMonths(-1);
                            }
            if (EndDate == null)
            {

                EndDate = DateTime.Now.AddMonths(1);
         
            }
            if(ResourceId == null)
            {
                ResourceId = 18119;
            }
#if Mock
            var access = new MockDataAccess();
#else
            var access = new ResourceDetailDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            DetailPage detailPage;

            try
            {
                detailPage = access.GetResourceDetail(ResourceId.Value, agg, StartDate.Value, EndDate.Value);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(detailPage);
        }
    }
}
