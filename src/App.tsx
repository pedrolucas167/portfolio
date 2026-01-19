import { Layout } from './components/layout';
import { Hero, About, TechStack, Projects, Reading, Game3D, Contact } from './components/sections';

export default function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Reading />
      <Game3D />
      <Contact />
    </Layout>
  );
}
