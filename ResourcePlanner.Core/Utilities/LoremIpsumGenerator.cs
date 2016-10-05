using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace ResourcePlanner.Core.Utilities
{
    public static class LoremIpsumGenerator
    {
        public static string LoremIpsum(int minWords, int maxWords, Random rand)
        {

            var words = new[]{"lorem", "ipsum", "dolor", "sit", "amet", "consectetuer",
            "adipiscing", "elit", "sed", "diam", "nonummy", "nibh", "euismod",
            "tincidunt", "ut", "laoreet", "dolore", "magna", "aliquam", "erat"};

            int numWords = rand.Next(maxWords - minWords) + minWords;

            StringBuilder result = new StringBuilder();
            for (int w = 0; w < numWords; w++)
            {
                if (w > 0) { result.Append(" "); }
                result.Append(words[rand.Next(words.Length)]);
            }

            return result.ToString();
        }
    }
}