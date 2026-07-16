using System.Reflection;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ErrantTowerServer.Common
{
    public class NonNullableRequiredSchemaFilter : ISchemaFilter
    {
        private readonly NullabilityInfoContext _nullabilityContext = new();

        public void Apply(IOpenApiSchema schema, SchemaFilterContext context)
        {
            if (schema.Properties == null)
                return;

            foreach (var property in context.Type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                // Skip nullable value types (int?, bool?, etc.)
                if (Nullable.GetUnderlyingType(property.PropertyType) is not null)
                    continue;

                // Skip nullable reference types (string?, Foo?)
                if (!property.PropertyType.IsValueType &&
                    _nullabilityContext.Create(property).WriteState == NullabilityState.Nullable)
                    continue;

                var jsonName = char.ToLowerInvariant(property.Name[0]) + property.Name[1..];

                if (!schema.Required.Contains(jsonName))
                {
                    schema.Required.Add(jsonName);
                }
            }
        }
    }
}
