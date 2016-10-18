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
    [RoutePrefix("/api/resource")]
    public class ResourceController : ApiController
    {
        [HttpGet]


        public async Task<IHttpActionResult> Get(int pageSize, int pageNum, TimeAggregation agg= TimeAggregation.Weekly, SortOrder sortOrder = SortOrder.LastName, SortDirection sortDirection = SortDirection.Asc, int? city = null, int? market = null, int? region = null, int? orgUnit = null, int? practice = null, string position = null, DateTime? StartDate = null, DateTime? EndDate = null)
        {

            if (StartDate == null)
            {
                StartDate = DateTime.Now.AddMonths(-1);
            }

            if (EndDate == null)
            {
                EndDate = DateTime.Now.AddMonths(1);
            }

            var pageParams = new ResourceQuery();

            pageParams.Aggregation = agg;
            pageParams.Sort = sortOrder;
            pageParams.SortDirection = sortDirection;
            pageParams.PageSize = pageSize;
            pageParams.PageNum = pageNum;
            pageParams.City = city;
            pageParams.OrgUnit = orgUnit;
            pageParams.Market = market;
            pageParams.Region = region;
            pageParams.Position = position;
            pageParams.Practice = practice;
            pageParams.StartDate = StartDate.Value;
            pageParams.EndDate = EndDate.Value;
            
#if Mock
            var access = new MockDataAccess();
#else
            var access = new ResourceDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif

            ResourcePage resourcePage;

            try
            {
                resourcePage = access.GetResourcePage(pageParams);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(resourcePage);
        }
    }
}
