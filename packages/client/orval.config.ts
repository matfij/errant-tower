export default {
    api: {
        input: "./src/api-old/swagger.json",
        output: {
            mode: "split",
            target: "./src/api-old/generated/hooks.ts",
            schemas: "./src/api-old/generated/definitions",
            client: "react-query",
            override: {
                mutator: {
                    path: "./src/api-old/custom-fetch.ts",
                    name: "customFetch",
                },
                query: {
                    useQuery: true,
                },
                mutation: {
                    useMutation: true,
                },
            },
        },
    },
};
