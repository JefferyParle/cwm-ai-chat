import ChatBot from './components/ChatBot';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="p-4 h-screen w-screen">
        <ChatBot />
      </div>
    </ThemeProvider>
  );
}

export default App;
