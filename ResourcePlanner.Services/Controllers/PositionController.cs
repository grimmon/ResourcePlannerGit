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
    public class PositionController : ApiController
    {
        [HttpGet]
        //[Authorize]

        public async Task<IHttpActionResult> Get(string searchTerm = "")
        {

#if Mock
            var access = AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#else
            var access = new AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            List<IdNameGeneric> values;

            try
            {
                values = access.GetPositions(searchTerm);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(values);
        }
    }
}
