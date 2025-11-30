import { ThemeProvider } from './contexts';
import { Layout } from './components/layout';
import { Hero, About, Projects, TechStack, BugHunterGame, Reading, Contact } from './components/sections';

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <About />
        <BugHunterGame />
        <Projects />
        <TechStack />
        <Reading />
        <Contact />
      </Layout>
    </ThemeProvider>
  );
}
