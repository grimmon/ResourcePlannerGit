using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DocumentFormat.OpenXml;

namespace ResourcePlanner.Services.Excel
{
    public enum ExcelNumberFormat
    {
        None     = 0,
        Percent  = 1,
        Currency = 2,
        Number   = 3
    }
}
