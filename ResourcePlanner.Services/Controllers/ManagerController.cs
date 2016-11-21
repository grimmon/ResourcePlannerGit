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
    public class ManagerController : ApiController
    {
        [HttpGet]
        //[Authorize]

        public async Task<IHttpActionResult> Get(string searchTerm = "")
        {

#if Mock
            var access = new AddProjectAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#else
            var access = new AddProjectDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            List<IdNameGeneric> values;

            var searchTerms = searchTerm.Split(',', ' ', '.');
            var searchTerm1 = searchTerms.Length >= 1 ? searchTerms[0] : "";
            var searchTerm2 = searchTerms.Length >= 2 ? searchTerms[1] : "";
            var searchTerm3 = searchTerms.Length >= 3 ? searchTerms[2] : "";

            try
            {
              values = access.GetManagers(searchTerm1, searchTerm2, searchTerm3);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(values);
        }
    }
}
