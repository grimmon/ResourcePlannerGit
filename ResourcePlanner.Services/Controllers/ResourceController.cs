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
        public async Task<IHttpActionResult> Get(int pageSize, int pageNum, TimeAggregation agg= TimeAggregation.Weekly, SortOrder sortOrder = SortOrder.LastName, SortDirection sortDirection = SortDirection.Desc, string city = null, string market = null, string region = null, string orgUnit = null, string practice = null, string position = null, DateTime? StartDateParam = null, DateTime? EndDateParam = null)
        {
            DateTime StartDate;
            DateTime EndDate;

            if (StartDateParam == null || EndDateParam == null)
            {
                StartDate = DateTime.Now.AddMonths(-1);
                EndDate = DateTime.Now.AddMonths(1);
            }
            else
            {
                StartDate = StartDateParam.Value;
                EndDate = EndDateParam.Value;
            }

            var pageParams = new ResourceQuery();

            pageParams.Aggregation = agg;
            pageParams.Sort = sortOrder;
            pageParams.SortDirection = sortDirection;
            pageParams.PageSize = pageSize;
            pageParams.PageNum = pageNum;
            pageParams.City = city != null ? Array.ConvertAll(city.Split(','), s => int.Parse(s)) : new int[1];
            pageParams.OrgUnit = orgUnit != null ? Array.ConvertAll(orgUnit.Split(','), s => int.Parse(s)) : new int[1];
            pageParams.Market = market != null ? Array.ConvertAll(market.Split(','), s => int.Parse(s)) : new int[1];
            pageParams.Region = region != null ? Array.ConvertAll(region.Split(','), s => int.Parse(s)) : new int[1];
            pageParams.Position = position != null ? position.Split(',') : new string[1];
            pageParams.Practice = practice != null ? Array.ConvertAll(practice.Split(','), s => int.Parse(s)) : new int[1];
            pageParams.StartDate = StartDate;
            pageParams.EndDate = EndDate;
            
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
