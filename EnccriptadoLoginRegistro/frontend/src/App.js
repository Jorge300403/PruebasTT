import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Import para las rutas privadas
import PaginaRutaPrivada from './components/RutaPrivada';

//Import para el inicio de la pagina
import LayoutInicio from './components/LayoutInicio';
import PaginaLogin from './paginas/inicio/Login';
import PaginaRegistroOncologo from './paginas/inicio/RegistroOncologo';
import PaginaOlvidoContrasenia from './paginas/inicio/OlvidoContrasenia';
import PaginaRestablecerContrasenia from './paginas/inicio/RestablecerContrasenia';
import PaginaCorreoNoVerificado from './paginas/inicio/CorreoNoVerificado';
import PaginaCorreoVerificadoExito from './paginas/inicio/CorreoVerificadoExito';
import PaginaTokenCorreoExpirado from './paginas/inicio/TokenCorreoExpirado';
import PaginaSesionCaducada from './paginas/inicio/SesionCaducada';


//Import para el oncologo
import LayoutOncologo from './components/LayoutOncologo';
import PaginaDatosPerfil from './paginas/oncologo/DatosPerfil';
import PaginaListaPacientes from './paginas/oncologo/ListaPacientes';


//Import para el administrador
import LayoutAdministrador from './components/LayoutAdministrador';
import PaginaListaOncologos from './paginas/administrador/ListaOncologos';
import PaginaCargarDatosEntrenamiento from './paginas/administrador/CargarDatosEntrenamiento';



//Import para el paciente
import PaginaRegistroPaciente from './paginas/paciente/RegistrarPaciente';
import PaginaResultadosPaciente from './paginas/paciente/ResultadosPaciente';
import PaginaCargarDatosPaciente from './paginas/paciente/CargarDatosPaciente';



function App() {
  return (
    //Traemos todas la rutas uqe vamos a utilizar, siendo la prinicpal la del login
    //En el caso de las rutas que se tengan que hacer a travez de un login, la insertamos
    //en la parte de ruta privada, para que primero verifique el token y despues habra la pagina correspondiente
    <Router>
      <Routes>
        {/*hacemos las rutas para las paginas de inicio */}
        <Route path='/' element={<LayoutInicio />}>
          <Route index element={<PaginaLogin />} />
          <Route path='login' element={<PaginaLogin />} />
          <Route path='registro-oncologo' element={<PaginaRegistroOncologo />} />
          <Route path='olvido-contrasenia' element={<PaginaOlvidoContrasenia />} />
          <Route path='restablecer-contrasenia' element={<PaginaRestablecerContrasenia />} />
          <Route path='correo-no-verificado' element={<PaginaCorreoNoVerificado />} />
          <Route path='correo-verificado-exito' element={<PaginaCorreoVerificadoExito />} />
          <Route path='token-correo-expirado' element={<PaginaTokenCorreoExpirado />} />
          <Route path='sesion-caducada' element={<PaginaSesionCaducada />} />
        </Route>


        {/*Hacemos las rutas de las paginas del oncologo que llevan el mismo header y footer*/}
        <Route path='/oncologo' element={<PaginaRutaPrivada> <LayoutOncologo /> </PaginaRutaPrivada>}>
          <Route path='lista-pacientes' element={<PaginaListaPacientes />} />
          <Route path='datos-perfil' element={<PaginaDatosPerfil />} />
          <Route path='registrar-paciente' element={<PaginaRegistroPaciente/>} />
          <Route path='resultados-paciente' element={<PaginaResultadosPaciente />} />
          <Route path='cargar-datos-paciente' element={<PaginaCargarDatosPaciente />} />
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
