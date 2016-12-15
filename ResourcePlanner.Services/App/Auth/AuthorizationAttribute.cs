using ResourcePlanner.Services.DataAccess;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
namespace ResourcePlanner.Services.Auth
{
    public class AuthorizationAttribute : AuthorizationFilterAttribute
    {
        private readonly Enums.Enums.Permission[] _permissions;
        private AuthDataAccess _access;

        public AuthorizationAttribute(Enums.Enums.Permission[] permissions)
        {
            _permissions = permissions;
            _access = new AuthDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));

        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {

            var hasAccess = true;
            var userPermissions =_access.PermissionsByLogin(HttpContext.Current.User.Identity.Name);

            foreach(var permission in _permissions)
            {
                if (!userPermissions.Contains(permission))
                {
                    hasAccess = false;
                }
            }

            if (!hasAccess)
            {
                var message = $"User {HttpContext.Current.User.Identity.Name} does not have permission.";
                HandleUnAuthorized(actionContext, message);
            }
        }

        private static void HandleUnAuthorized(HttpActionContext actionContext, string message)
        {
            actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, message);
            throw new HttpResponseException(actionContext.Response);
        }
    }
}