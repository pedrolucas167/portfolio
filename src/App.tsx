import { ThemeProvider } from './contexts';
import { Layout } from './components/layout';
import { Hero, About, TechStack, Projects, Reading, BugHunterGame, Contact } from './components/sections';

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Reading />
        <BugHunterGame />
        <Contact />
      </Layout>
    </ThemeProvider>
  );
}
