using System.Reflection;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ErrantTowerServer.Common;

public class NonNullableRequiredSchemaFilter : ISchemaFilter
{
    private readonly NullabilityInfoContext _nullabilityContext = new();

    public void Apply(IOpenApiSchema schema, SchemaFilterContext context)
    {
        if (schema.Properties == null)
        {
            return;
        }

        foreach (var property in context.Type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            if (Nullable.GetUnderlyingType(property.PropertyType) is not null)
            {
                continue;
            }

            if (!property.PropertyType.IsValueType
                && _nullabilityContext.Create(property).WriteState == NullabilityState.Nullable)
            {
                continue;
            }

            var jsonName = char.ToLowerInvariant(property.Name[0]) + property.Name[1..];

            if (schema.Properties.ContainsKey(jsonName)
                && schema.Required is not null
                && !schema.Required.Contains(jsonName))
            {
                schema.Required.Add(jsonName);
            }
        }
    }
}
