using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ResourcePlanner.Core.Extensions
{
    public static class EnumerableExtensions
    {
        private static Random _rand = new Random();
        public static string Join(this IEnumerable<string> source, string separator)
        {
            var returnValue = new StringBuilder();
            source.ForEach(i => returnValue.Append(((returnValue.Length > 0) ? separator : "") + i));
            return returnValue.ToString();
        }

        public static IEnumerable<T> ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            foreach (T item in source)
            {
                action(item);
            }
            return source;
        }
        public static T Random<T>(this IEnumerable<T> source)
        {
            return Random(source, 1).First();
        }
        public static List<T> Random<T>(this IEnumerable<T> source, int numberToReturn)
        {
            List<T> returnValue = new List<T>();
            var selectedValues = new HashSet<int>();
            int max = source.Count();

            if (max <= numberToReturn)
            {
                returnValue.AddRange(source);
                numberToReturn = 0;
            }

            while (numberToReturn-- > 0)
            {
                var indexToReturn = -1;
                while (indexToReturn < 0 || selectedValues.Contains(indexToReturn)) indexToReturn = _rand.Next(0, max);
                selectedValues.Add(indexToReturn);
                returnValue.Add(source.Skip(indexToReturn).First());
            }

            return returnValue;
        }
        public static IEnumerable<T> Distinct<T, K>(this IEnumerable<T> source, Func<T, K> action)
        {
            Dictionary<K, T> distinctValues = new Dictionary<K, T>();
            foreach (T item in source)
            {
                distinctValues[action(item)] = item;
            }
            return distinctValues.Values;
        }

    }
}
