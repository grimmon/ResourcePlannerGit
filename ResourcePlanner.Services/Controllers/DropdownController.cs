﻿using ResourcePlanner.Services.DataAccess;
using ResourcePlanner.Services.Models;
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
    public class DropdownController : ApiController
    {
        [HttpGet]
        [Authorize]

        public async Task<IHttpActionResult> Get()
        {
           
#if Mock
            var access = new MockDropdownDataAccess();
#else
            var access = new DropdownDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
#endif
            List<DropdownValue> dropdowns;

            try
            {
                dropdowns = access.GetDropdownValues();
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(dropdowns);
        }
    }
}
