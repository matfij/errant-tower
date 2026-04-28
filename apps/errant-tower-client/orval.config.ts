export default {
    api: {
        input: './src/api/swagger.json',
        output: {
            mode: 'split',
            target: './src/api/generated.ts',
            schemas: './src/api/definitions',
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
