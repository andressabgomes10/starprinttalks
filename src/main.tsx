
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Error handling for production
const renderApp = () => {
  try {
    const container = document.getElementById("root");
    if (!container) {
      throw new Error("Root element not found");
    }
    
    const root = createRoot(container);
    root.render(<App />);
  } catch (error) {
    console.error("Failed to render app:", error);
    
    // Fallback rendering
    const container = document.getElementById("root");
    if (container) {
      container.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
          background: #f9fafb;
        ">
          <div style="text-align: center; color: #374151;">
            <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Erro ao carregar a aplicação</h1>
            <p>Por favor, recarregue a página.</p>
            <button 
              onclick="window.location.reload()" 
              style="
                margin-top: 1rem;
                padding: 0.5rem 1rem;
                background: #F59E0B;
                color: white;
                border: none;
                border-radius: 0.375rem;
                cursor: pointer;
              "
            >
              Recarregar
            </button>
          </div>
        </div>
      `;
    }
  }
};

renderApp();
  