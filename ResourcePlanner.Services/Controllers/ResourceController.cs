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
            string city = "", 
            string homecity = "",
            string market = "", 
            string region = "", 
            string orgUnit = "", 
            string practice = "", 
            string subpractice = "",
            string resourcemanager = "", 
            string title = "",
            string searchterm1 = "", 
            string searchterm2 = "", 
            string searchterm3 = "",
            string searchterm4 = "",
            string searchterm5 = "",
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
            pageParams.Cities = city.Replace(',', ';');
            pageParams.HomeCities = homecity.Replace(',', ';');
            pageParams.OrgUnits = orgUnit.Replace(',', ';');
            pageParams.Markets = market.Replace(',', ';');
            pageParams.Regions = region.Replace(',', ';');
            pageParams.SearchTerm1 = searchterm1;
            pageParams.SearchTerm2 = searchterm2;
            pageParams.SearchTerm3 = searchterm3;
            pageParams.SearchTerm4 = searchterm4;
            pageParams.SearchTerm5 = searchterm5;
            pageParams.Practices = practice.Replace(',', ';');
            pageParams.SubPractices = subpractice.Replace(',', ';');
            pageParams.ResourceManagers = resourcemanager.Replace(',', ';');
            pageParams.StartDate = StartDate.Value;
            pageParams.EndDate = EndDate.Value;
            pageParams.Login = HttpContext.Current.User.Identity.Name;
            pageParams.Positions = title.Replace(',',';');
            
            
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
            string city = "",
            string homecity = "",
            string market = "",
            string region = "",
            string orgUnit = "",
            string practice = "",
            string subpractice = "",
            string title = "",
            string searchterm1 = "",
            string searchterm2 = "",
            string searchterm3 = "",
            string searchterm4 = "",
            string searchterm5 = "",
            DateTime? StartDate = null,
            DateTime? EndDate = null)
        {

            var pageParams = new ResourceQuery();

            pageParams.Aggregation = agg;
            pageParams.Sort = Enums.Enums.SortOrder.LastName;
            pageParams.SortDirection = Enums.Enums.SortDirection.Asc;
            pageParams.Cities = city.Replace(',', ';');
            pageParams.HomeCities = homecity.Replace(',', ';');
            pageParams.OrgUnits = orgUnit.Replace(',', ';');
            pageParams.Markets = market.Replace(',', ';');
            pageParams.Regions = region.Replace(',', ';');
            pageParams.SearchTerm1 = searchterm1;
            pageParams.SearchTerm2 = searchterm2;
            pageParams.SearchTerm3 = searchterm3;
            pageParams.SearchTerm4 = searchterm4;
            pageParams.SearchTerm5 = searchterm5;
            pageParams.Practices = practice.Replace(',', ';');
            pageParams.SubPractices = subpractice.Replace(',', ';');
            pageParams.StartDate = StartDate.Value;
            pageParams.EndDate = EndDate.Value;
            pageParams.PageNum = 0;
            pageParams.PageSize = int.MaxValue;
            pageParams.Excel = true;
            pageParams.Login = HttpContext.Current.User.Identity.Name;
            pageParams.Positions = title.Replace(',', ';');

#if Mock
            var access = new MockDataAccess();
#else
            var access = new ResourceDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            try
            {
                var stream = await access.GetExcelStream(pageParams);
                var name = string.Format("Resource Detail {0}, {1}", pageParams.StartDate, pageParams.EndDate);
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
