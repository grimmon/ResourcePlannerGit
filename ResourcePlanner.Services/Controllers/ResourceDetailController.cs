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
    public class ResourceDetailController : ApiController
    {
        [HttpGet]
        public async Task<IHttpActionResult> Get(int? ResourceIdParam = null, DateTime? StartDateParam = null, DateTime? EndDateParam = null)
        {
            DateTime StartDate;
            DateTime EndDate;
            int ResourceId;
            if (StartDateParam == null || (EndDateParam == null || ResourceIdParam == null))
            {
                StartDate = DateTime.Now.AddMonths(-1);
                EndDate = DateTime.Now.AddMonths(1);
                ResourceId = 38042;
            }
            else
            {
                StartDate = StartDateParam.Value;
                EndDate = EndDateParam.Value;
                ResourceId = ResourceIdParam.Value;
            }
#if Mock
            var access = new MockDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#else
            var access = new ResourceDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            DetailPage detailPage;

            try
            {
                detailPage = access.GetResourceDetail(ResourceId, StartDate, EndDate);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(detailPage);
        }
    }
}
