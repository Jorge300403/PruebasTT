import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaLogin from './components/Login';
import PaginaRegistroOncologo from './components/RegistroOncologo';
import PaginaListaPacientess from './components/Pacientes';
import PaginaCorreoNoVerificado from './components/CorreoNoVerificado';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaLogin />} />        
        <Route path="/registro_oncologo" element={<PaginaRegistroOncologo />} />
        <Route path='/lista_pacientes' element={<PaginaListaPacientess />} />
        <Route path='/correo-no-verificado' element={<PaginaCorreoNoVerificado/>} />
      </Routes>
    </Router>
  );
}

export default App;
