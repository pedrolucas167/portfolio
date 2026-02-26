import { lazy, Suspense } from 'react';
import { Layout } from './components/layout';
import { Hero, About, TechStack, Projects, Contact } from './components/sections';

// Lazy load heavy components
const Game3D = lazy(() => import('./components/sections/Game3D').then(m => ({ default: m.Game3D })));

function GameLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-[#64748b]">Carregando jogo...</div>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Suspense fallback={<GameLoading />}>
        <Game3D />
      </Suspense>
      <Contact />
    </Layout>
  );
}
