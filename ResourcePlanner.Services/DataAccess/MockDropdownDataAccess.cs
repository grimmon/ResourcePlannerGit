using ResourcePlanner.Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.DataAccess
{
    public class MockDropdownDataAccess
    {
        static List<DropdownValue> _dropdownValues = new List<DropdownValue>();

        static MockDropdownDataAccess()
        {
            _dropdownValues.Add(new DropdownValue{Id =6674, Name="Practice"                  , Category = "OrgUnit"  });
            _dropdownValues.Add(new DropdownValue{Id =6675, Name="NONE"                      , Category = "OrgUnit"  });
            _dropdownValues.Add(new DropdownValue{Id =6676, Name="ICS"                       , Category = "OrgUnit"  });
            _dropdownValues.Add(new DropdownValue{Id =6677, Name="ITS"                       , Category = "OrgUnit"  });
            _dropdownValues.Add(new DropdownValue{Id =6679, Name="East"                      , Category = "Region"   });
            _dropdownValues.Add(new DropdownValue{Id =6680, Name="Central"                   , Category = "Region"   });
            _dropdownValues.Add(new DropdownValue{Id =6681, Name="West"                      , Category = "Region"   });
            _dropdownValues.Add(new DropdownValue{Id =6682, Name="Northeast"                 , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6683, Name="Texas"                     , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6684, Name="Pacwest"                   , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6685, Name="Southeast"                 , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6687, Name="Mid Atlantic"              , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6688, Name="TOLA"                      , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6689, Name="New England"               , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6690, Name="North Central"             , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6691, Name="Ohio Valley"               , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6692, Name="JPMC Market"               , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6693, Name="Metro Midwest"             , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6694, Name="Southwest"                 , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6695, Name="NY Metro"                  , Category = "Market"   });
            _dropdownValues.Add(new DropdownValue{Id =6696, Name="Chicago"                   , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6698, Name="Dallas"                    , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6699, Name="Columbus"                  , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6700, Name="Other"                     , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6701, Name="Los Angeles"               , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6702, Name="DC"                        , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6703, Name="San Jose"                  , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6704, Name="Phoenix"                   , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6705, Name="Phoenix, AZ"               , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6706, Name="New York"                  , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6707, Name="Minneapolis"               , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6708, Name="Tampa"                     , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6709, Name="Atlanta"                   , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6710, Name="Houston"                   , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6711, Name="Boston"                    , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6712, Name="St.Louis"                  , Category = "City"     });
            _dropdownValues.Add(new DropdownValue{Id =6713, Name="Data Center"               , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue{Id =6715, Name="PMO"                       , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue{Id =6716, Name="Office Productivity"       , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue{Id =6717, Name="Collaboration"             , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue{Id =6718, Name="Multi - site / Deployment" , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue{Id =6719, Name="Resident Programs"         , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue{Id =6720, Name="Onsite Programs"           , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue{Id =6721, Name="Networking"                , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue{Id =6722, Name="VTSP"                      , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue{Id =6723, Name="Command Center"            , Category = "Practice" });
            _dropdownValues.Add(new DropdownValue() { Category = "agg", Name = "Weekly" });
            _dropdownValues.Add(new DropdownValue() { Category = "agg", Name = "Monthly" });
            _dropdownValues.Add(new DropdownValue() { Category = "agg", Name = "Quarterly" });
            _dropdownValues.Add(new DropdownValue() { Category = "agg", Name = "Daily" });
        }

        public List<DropdownValue> GetDropdownValues()
        {
            return _dropdownValues;
        }
    }
}