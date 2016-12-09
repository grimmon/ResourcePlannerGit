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
    [RoutePrefix("api/projectView")]
    public class ProjectViewController : ApiController
    {
        [HttpGet]
        [Authorize]
        public async Task<IHttpActionResult> Get(int ProjectId)
        {
#if Mock
            var access = new MockDataAccess();
#else
            var access = new ProjectPageDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            ProjectPage projectPage;
            var login = HttpContext.Current.User.Identity.Name;
            try
            {
                projectPage = access.GetProjectPage(ProjectId, login);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(projectPage);
        }

        [Route("excelexport")]
        public async Task<HttpResponseMessage> GetExcel(int ProjectId)
        {



#if Mock
            var access = new MockDataAccess();
#else
            var access = new ProjectPageDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            var login = HttpContext.Current.User.Identity.Name;
            try
            {
                var stream = await access.GetExcelStream(ProjectId, login);
                var name = string.Format("Project Data");
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

