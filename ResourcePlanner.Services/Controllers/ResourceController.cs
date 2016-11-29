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
using System.Web.Http;
using static ResourcePlanner.Services.Enums.Enums;

namespace ResourcePlanner.Services.Controllers
{
    [RoutePrefix("api/resource")]
    public class ResourceController : ApiController
    {
        [HttpGet]
        [Authorize]
        public async Task<IHttpActionResult> Get(
            int pageSize, 
            int pageNum, 
            TimeAggregation agg= TimeAggregation.Weekly, 
            SortOrder sortOrder = SortOrder.LastName, 
            SortDirection sortDirection = SortDirection.Asc, 
            int? city = null, 
            int? market = null, 
            int? region = null, 
            int? orgUnit = null, 
            int? practice = null, 
            int? subpractice = null, 
            string title = "",
            string searchterm1 = "", 
            string searchterm2 = "", 
            string searchterm3 = "", 
            DateTime? StartDate = null, 
            DateTime? EndDate = null,
            bool availability = false)
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
            pageParams.Availability = availability;
            pageParams.City = city;
            pageParams.OrgUnit = orgUnit;
            pageParams.Market = market;
            pageParams.Region = region;
            pageParams.SearchTerm1 = searchterm1;
            pageParams.SearchTerm2 = searchterm2;
            pageParams.SearchTerm3 = searchterm3;
            pageParams.Practice = practice;
            pageParams.SubPractice = subpractice;
            pageParams.StartDate = StartDate.Value;
            pageParams.EndDate = EndDate.Value;

            if (title != "")
            {
                pageParams.Positions = title.Split(',').Select(Int32.Parse).ToArray();
            }
            
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

        [Route("excelexport")]
        public async Task<HttpResponseMessage> GetExcel(TimeAggregation agg = TimeAggregation.Weekly,
            int? city = null,
            int? market = null,
            int? region = null,
            int? orgUnit = null,
            int? practice = null,
            int? subpractice = null,
            string title = "",
            string searchterm1 = "",
            string searchterm2 = "",
            string searchterm3 = "",
            DateTime? StartDate = null,
            DateTime? EndDate = null)
        {

            var pageParams = new ResourceQuery();

            pageParams.Aggregation = agg;
            pageParams.Sort = Enums.Enums.SortOrder.LastName;
            pageParams.SortDirection = Enums.Enums.SortDirection.Asc;
            pageParams.City = city;
            pageParams.OrgUnit = orgUnit;
            pageParams.Market = market;
            pageParams.Region = region;
            pageParams.SearchTerm1 = searchterm1;
            pageParams.SearchTerm2 = searchterm2;
            pageParams.SearchTerm3 = searchterm3;
            pageParams.Practice = practice;
            pageParams.SubPractice = subpractice;
            pageParams.StartDate = StartDate.Value;
            pageParams.EndDate = EndDate.Value;
            pageParams.PageNum = 0;
            pageParams.PageSize = int.MaxValue;
            pageParams.Excel = true;

#if Mock
            var access = new MockDataAccess();
#else
            var access = new ResourceDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            try
            {
                var stream = await access.GetExcelStream(pageParams);
                var name = string.Format("Resource Data {0}, {1}", pageParams.StartDate, pageParams.EndDate);
#if MOCK
                DelayUtility.Delay(ConfigUtility.MockMaxDelayInSeconds * 1000);
#endif
                return BuildHttpResponseMessage(stream, name);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public HttpResponseMessage BuildHttpResponseMessage(Stream stream, string name)
        {
            var result = new HttpResponseMessage(HttpStatusCode.OK);

            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(@"application/octet-stream");
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = name + ".xlsx"
            };

            return result;
        }
    }
}
