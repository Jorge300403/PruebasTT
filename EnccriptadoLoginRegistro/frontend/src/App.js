import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaLogin from './components/Login';
import PaginaRegistroOncologo from './components/RegistroOncologo';
import PaginaListaPacientess from './components/Pacientes';
import PaginaCorreoNoVerificado from './components/CorreoNoVerificado';
import PaginaRutaPrivada from './components/RutaPrivada';
import PaginaSliderLoginRegistro from './components/ContenedorLoginRegistro';
import PaginaOlvidoContrasenia from './components/OlvidoContrasenia';
import PaginaRestablecerContrasenia from './components/RestablecerContrasenia';
import PaginaCorreoVerificadoExito from './components/CorreoVerificadoExito';


//Import para el oncologo
import LayoutOncologo from './components/LayoutOncologo';
import PaginaDatosPerfil from './paginas/DatosPerfil';
import PaginaListaPacientes from './paginas/ListaPacientes';


//Import para el administrador
import LayoutAdministrador from './components/LayoutAdministrador';
import PaginaListaOncologos from './paginas/ListaOncologos';
import PaginaCargarDatosEntrenamiento from './paginas/CargarDatosEntrenamiento';



function App() {
  return (
    //Traemos todas la rutas uqe vamos a utilizar, siendo la prinicpal la del login
    //En el caso de las rutas que se tengan que hacer a travez de un login, la insertamos
    //en la parte de ruta privada, para que primero verifique el token y despues habra la pagina correspondiente
    <Router>
      <Routes>
        <Route path="/" element={<PaginaSliderLoginRegistro />} />
        <Route path="/registro_oncologo" element={<PaginaRegistroOncologo />} />
        <Route path='/lista_pacientes' element={<PaginaRutaPrivada><PaginaListaPacientess /></PaginaRutaPrivada>} />
        <Route path='/correo-no-verificado' element={<PaginaCorreoNoVerificado></PaginaCorreoNoVerificado>} />
        <Route path='/olvido-contrasenia' element={<PaginaOlvidoContrasenia></PaginaOlvidoContrasenia>} />
        <Route path='/restablecer-contrasenia' element={<PaginaRestablecerContrasenia></PaginaRestablecerContrasenia>} />
        <Route path='/correo-verificado' element={<PaginaCorreoVerificadoExito></PaginaCorreoVerificadoExito>} />

        {/*Hacemos las rutas de las paginas del oncologo que llevan el mismo header y footer*/}
        <Route path='/oncologo' element={<PaginaRutaPrivada> <LayoutOncologo /> </PaginaRutaPrivada>}>
          <Route path='lista-pacientes' element={<PaginaListaPacientes />} />
          <Route path='datos-perfil' element={<PaginaDatosPerfil />} />
        </Route>


        {/*Hacemos las rutas de las paginas del administrador que llevan el mismo header y footer*/}
        <Route path='/administrador' element={<PaginaRutaPrivada> <LayoutAdministrador /> </PaginaRutaPrivada>}>
          <Route path='lista-oncologos' element={<PaginaListaOncologos />} />
          <Route path='cargar-datos-entrenamiento' element={<PaginaCargarDatosEntrenamiento />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
