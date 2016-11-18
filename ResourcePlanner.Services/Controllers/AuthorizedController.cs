using ResourcePlanner.Services.DataAccess;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;

namespace ResourcePlanner.Services.Controllers
{
    public class AuthorizedController : ApiController
    {
        public async Task<IHttpActionResult> Get()
        {
#if Mock
            return Ok();
#endif
            var authAccess = new AuthDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            var CurrentUser = User.Identity as ClaimsIdentity;
            var EmailClaim = CurrentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Upn);
            if (EmailClaim == null)
            {
                return Unauthorized();
            }
            if (!authAccess.CheckAuth(EmailClaim.Value, "RM"))
            {
                return Unauthorized();
            }
            return Ok(true);
        }
    }
}
