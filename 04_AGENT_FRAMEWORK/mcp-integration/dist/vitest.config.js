import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'dist/',
                '__tests__/',
                '*.config.ts',
                '*.d.ts'
            ],
            thresholds: {
                lines: 90,
                functions: 90,
                branches: 90,
                statements: 90
            }
        },
        testTimeout: 10000,
        hookTimeout: 10000,
        teardownTimeout: 5000,
        include: ['__tests__/**/*.test.ts'],
        exclude: ['node_modules', 'dist']
    }
});
//# sourceMappingURL=vitest.config.js.map