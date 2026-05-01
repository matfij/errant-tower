export default {
    api: {
        input: './src/api/swagger.json',
        output: {
            mode: 'split',
            target: './src/api/generated/hooks.ts',
            schemas: './src/api/generated/definitions',
            client: 'react-query',
            override: {
                mutator: {
                    path: './src/api/custom-fetch.ts',
                    name: 'customFetch',
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
