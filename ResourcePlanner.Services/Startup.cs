using Microsoft.Owin;
using Owin;
using Microsoft.Owin.Security.ActiveDirectory;
using System.Configuration;
using System.IdentityModel.Tokens;

[assembly: OwinStartup(typeof(ResourcePlanner.Services.Startup))]
namespace ResourcePlanner.Services
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
 
        public void ConfigureAuth(IAppBuilder app)
        {
            app.UseWindowsAzureActiveDirectoryBearerAuthentication(
            new WindowsAzureActiveDirectoryBearerAuthenticationOptions
            {
                Tenant = ConfigurationManager.AppSettings["ida:Tenant"],
                TokenValidationParameters = new TokenValidationParameters
                {
                    SaveSigninToken = true,
                    ValidAudience = ConfigurationManager.AppSettings["ida:Audience"],
                    ValidateIssuer = false
                }
            });
        }

    }
}