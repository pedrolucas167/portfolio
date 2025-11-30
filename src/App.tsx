import { ThemeProvider } from './contexts';
import { Layout } from './components/layout';
import { Hero, About, TechStack, Projects, CTA, Reading, BugHunterGame, FAQ, Contact } from './components/sections';

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <TechStack />
        <About />
        <Projects />
        <CTA />
        <Reading />
        <BugHunterGame />
        <FAQ />
        <Contact />
      </Layout>
    </ThemeProvider>
  );
}
