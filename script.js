
window.addEventListener("load", function(){
    let numPoke = 1;
    let inputNumLCD = "";
    // Carga inicial (Bulbasaur)
    cargarPokemonCompleto(numPoke);

    // --- 1. BOTÓN AVANZAR ---
    let btnAvanzar = document.getElementsByClassName("boton-avanzar")[0];
    if(btnAvanzar) {
        btnAvanzar.addEventListener("click", function(e){
            e.preventDefault();
            numPoke = avanzar(numPoke);
            inputNumLCD = numPoke.toString(); // Sincroniza la entrada LCD
            actualizarLCD(inputNumLCD, numPoke);
            cargarPokemonCompleto(numPoke);
        });
    }

    // --- 2. BOTÓN RETROCEDER ---
    let btnRetroceder = document.getElementsByClassName("boton-retroceder")[0];
    if(btnRetroceder) {
        btnRetroceder.addEventListener("click", function(e){
            e.preventDefault();
            numPoke = retroceder(numPoke);
            inputNumLCD = numPoke.toString(); // Sincroniza la entrada LCD
            actualizarLCD(inputNumLCD, numPoke);
            cargarPokemonCompleto(numPoke);
        });
    }

    // --- 3. TECLADO NUMÉRICO EXTERNO (Botones con clase 'btn-num' y atributo 'data-val') ---
    let botonesNumericos = document.querySelectorAll(".num");
    botonesNumericos.forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            let valor = this.getAttribute("data-value");

            if (inputNumLCD.length < 4) {
                inputNumLCD += valor;
                actualizarLCD(inputNumLCD, numPoke);
            }
            
        });
    });

    // --- 4. BOTÓN INICIO (ENCENDER / APAGAR PANTALLA) ---
    let btnInicio = document.getElementsByClassName("boton-inicio")[0];
    if(btnInicio) {
        btnInicio.addEventListener("click", function(e){
            e.preventDefault();
            let ventana = document.getElementsByClassName("ventana")[0];
            let pantalla = document.getElementsByClassName("pantalla")[0];
            let image = document.getElementsByClassName('imagenPokemon')[0];

            if(ventana.classList.contains("apagado")){
                ventana.classList.remove("apagado");
                if (pantalla) pantalla.style.display = "";
                if (image) image.style.display = "";
            } else {
                ventana.classList.add("apagado");
                if (pantalla) pantalla.style.display = "none";
                if (image) image.style.display = "none";
            }
        });
    }

    let btnLimpiar = document.getElementsByClassName("lcd-btn-clear")[0];
    btnLimpiar.addEventListener("click", function(e){
        e.preventDefault();
        clearInput();

    });

    let btnBuscar = document.getElementsByClassName("lcd-btn-search")[0];
    btnBuscar.addEventListener("click", function(e){
        e.preventDefault();
        ejecutarBusqueda();

    });


    function clearInput() {
        inputNumLCD = "";
        actualizarLCD("", numPoke);
    }

    function ejecutarBusqueda() {
        if (inputNumLCD !== "") {
            let idBuscado = parseInt(inputNumLCD, 10);
            if (idBuscado >= 1 && idBuscado <= 1025) {
                numPoke = idBuscado;
                inputNumLCD = "";
                cargarPokemonCompleto(numPoke);
            } else {
                alert("ID fuera de rango (1 - 1025)");
                clearInput();
            }
        }
    }

    function actualizarLCD(texto) {
        let lcdDisplay = document.getElementById("lcd-input-value");
        if (lcdDisplay) {
            lcdDisplay.textContent = texto !== "" ? texto : numPoke;
        }
    }
});

// Función auxiliar para refrescar la minipantalla LCD superior

// --- FUNCIONES DE NAVEGACIÓN SECUENCIAL ---
function avanzar(numPoke){
    numPoke++;
    if(numPoke > 1025){
        numPoke = 1025;
    }
    return numPoke;
}

function retroceder(numPoke){
    numPoke--;
    if(numPoke < 1){
        numPoke = 1;
    }
    return numPoke;
}

// Diccionario de colores oficiales según el tipo
const coloresTipos = {
    grass: '#78C850',
    poison: '#A040A0',
    fire: '#F08030',
    flying: '#A890F0',
    water: '#6890F0',
    bug: '#A8B820',
    normal: '#A8A878',
    electric: '#F8D030',
    ground: '#E0C068',
    fairy: '#EE99AC',
    fighting: '#C03028',
    psychic: '#F85888',
    rock: '#B8A038',
    steel: '#B8B8D0',
    ice: '#98D8D8',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848'
};

// --- LLAMADA COMPLETA A LA POKEAPI ---
function cargarPokemonCompleto(numPoke) {
    // 1. Datos Principales (Stats, Tipos, Nombre, Peso, Altura, Sprite)
    fetch("https://pokeapi.co/api/v2/pokemon/" + numPoke)
        .then(response => response.json())
        .then(data => {
            
            // Imagen principal
            let imagen = document.getElementsByClassName('imagenPokemon')[0];
            if (imagen) imagen.src = data.sprites.front_default;

            // Mostrar el ID exacto tal cual (#1, #2, #25) y Nombre
            let idDisplay = document.getElementById('pokemon-id-display');
            let nameDisplay = document.getElementById('pokemon-name-display');
            if (idDisplay) idDisplay.textContent = `#${data.id}`;
            if (nameDisplay) nameDisplay.textContent = data.name.toUpperCase();

            // RENDERIZADO DE TIPOS (Soporta 1 o 2 tipos)
            let typesContainer = document.getElementById('pokemon-types-container');
            if (typesContainer) {
                typesContainer.innerHTML = ''; // Limpiar tipos previos

                data.types.forEach(typeInfo => {
                    let badge = document.createElement('span');
                    badge.className = 'type-badge';
                    
                    let nombreTipoIngles = typeInfo.type.name;
                    badge.textContent = nombreTipoIngles.substring(0, 4).toUpperCase();
                    
                    // Asigna el color dinámico del tipo
                    badge.style.backgroundColor = coloresTipos[nombreTipoIngles] || '#f7ba14';
                    badge.style.color = '#000';

                    typesContainer.appendChild(badge);
                });
            }

            // Datos Físicos (Altura en metros, Peso en kg)
            let altDisplay = document.getElementById('info-altura');
            let pesoDisplay = document.getElementById('info-peso');
            if (altDisplay) altDisplay.textContent = `${(data.height / 10).toFixed(1)} m`;
            if (pesoDisplay) pesoDisplay.textContent = `${(data.weight / 10).toFixed(1)} kg`;

            // Mapeo de Estadísticas base
            let hp = data.stats.find(s => s.stat.name === 'hp').base_stat;
            let atk = data.stats.find(s => s.stat.name === 'attack').base_stat;
            let def = data.stats.find(s => s.stat.name === 'defense').base_stat;
            let atkS = data.stats.find(s => s.stat.name === 'special-attack').base_stat;
            let defS = data.stats.find(s => s.stat.name === 'special-defense').base_stat;
            let spd = data.stats.find(s => s.stat.name === 'speed').base_stat;

            let valHp = document.getElementById('val-hp');
            let valAtk = document.getElementById('val-atk');
            let valDef = document.getElementById('val-def');
            let valAtkS = document.getElementById('val-atkS');
            let valDefS = document.getElementById('val-defS');
            let valSpd = document.getElementById('val-spd');

            if (valHp) valHp.textContent = hp;
            if (valAtk) valAtk.textContent = atk;
            if (valDef) valDef.textContent = def;
            if (valAtkS) valAtkS.textContent = atkS;
            if (valDefS) valDefS.textContent = defS;
            if (valSpd) valSpd.textContent = spd;

            // Renderizado de las barras verdes segmentadas
            renderizarBarra('bar-hp', hp);
            renderizarBarra('bar-atk', atk);
            renderizarBarra('bar-def', def);
            renderizarBarra('bar-atkS', atkS);
            renderizarBarra('bar-defS', defS);
            renderizarBarra('bar-spd', spd);
        });

    // 2. Datos de Especie y Descripción en Español
    fetch("https://pokeapi.co/api/v2/pokemon-species/" + numPoke)
        .then(response => response.json())
        .then(speciesData => {
            
            // Buscar especie en Español
            let especieEs = speciesData.genera.find(g => g.language.name === 'es');
            let espDisplay = document.getElementById('info-especie');
            if (espDisplay) {
                espDisplay.textContent = especieEs ? especieEs.genus : speciesData.genera[0].genus;
            }

            // Buscar descripción en Español
            let descEs = speciesData.flavor_text_entries.find(f => f.language.name === 'es');
            let descDisplay = document.getElementById('info-descripcion');
            if (descDisplay) {
                let textoLimpio = descEs 
                    ? descEs.flavor_text.replace(/\n|\f|\r/g, ' ') 
                    : "Sin descripción disponible en español.";
                descDisplay.textContent = `"${textoLimpio}"`;
            }
        });
}

// Función auxiliar para dibujar los 15 bloques de cada barra de estadística
function renderizarBarra(elementId, valorActual, valorMaximo = 255) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    container.innerHTML = '';
    const totalBloques = 12;
    const bloquesActivos = Math.min(totalBloques, Math.round((valorActual / valorMaximo) * totalBloques));

    // Determinar la clase de color según los rangos pedidos
    let colorClass = 'color-rojo';
    
    if (valorActual < 40) {
        colorClass = 'color-rojo';
    } else if (valorActual >= 40 && valorActual < 60) {
        colorClass = 'color-naranja';
    } else if (valorActual >= 60 && valorActual < 100) {
        colorClass = 'color-amarillo';
    } else if (valorActual >= 100 && valorActual < 130) {
        colorClass = 'color-verde';
    } else if (valorActual >= 130) {
        colorClass = 'color-esmeralda';
    }

    for (let i = 0; i < totalBloques; i++) {
        const block = document.createElement('div');
        // Si el bloque está activo, le sumamos la clase del color correspondiente
        block.className = 'block' + (i < bloquesActivos ? ` active ${colorClass}` : '');
        container.appendChild(block);
    }
}


// function avanzar(numPoke){
//     numPoke++;
//     if(numPoke > 1025){
//         numPoke = 1025;
//     }
//     return numPoke;
// }
// function retroceder(numPoke){
//     numPoke--;
//     if(numPoke < 1){
//         numPoke = 1;
//     }
//     return numPoke;
// }

// function encender(){
    
// }

// function apagar(){
    
// }

// function ponerImgPokemon(numPoke){
//     fetch("https://pokeapi.co/api/v2/pokemon/"+ numPoke).then((response) => {
//         response.json().then((value) => {
//             console.log(value)
//             let img;
//             imagen = document.getElementsByClassName('imagenPokemon')[0];
//             img = value.sprites.front_default;
//             imagen.src = img;
//             // console.log(imagen)

//             // TODO: sacar los datos de las stats, nombre, numero, descripcion, tipo/s, 
//         });
//     });
// }




