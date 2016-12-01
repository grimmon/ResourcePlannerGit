using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResourcePlanner.Services.Excel
{
    public class ExceldocFactory
    {
        public static IExcelBuilder Create()
        {
            return new ExcelExample();
            //return new ExcelBuilder();
        }
    }
}