function saludarUsuario() {
    // Obtener el nombre de usuario del sistema
    const os = require('os');
    const nombreUsuario = os.userInfo().username;
    
    // Mostrar el saludo
    console.log(`¡Hola ${nombreUsuario}! Bienvenido/a al sistema.`);
}

// Ejecutar la función
saludarUsuario();

