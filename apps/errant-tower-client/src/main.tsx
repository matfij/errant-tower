import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { AppComponent } from './app-component';

import './i18n';
import './common/styles/main.scss';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Suspense>
            <AppComponent />
        </Suspense>
    </StrictMode>,
);
