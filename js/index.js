// Characters info
const TAROTISTA = {
    name: "Tarotista",
    emoji: "🃏",
    description: "Los tarotistas han encontrado la verdad sobre el pasado, el presente, y el futuro en las cartas. "
        + "Mediante la interpretación de sus símbolos y sus personajes, un tarotista descifra situaciones, lugares, y "
        + "sucesos ayudando así a dar respuesta a aquellos que tienen preguntas."
};

const MEDIUM = {
    name: "Médium",
    emoji: "👻",
    description: "Los médium son seres con la capacidad de trascender el plano de lo físico y lo vivo y entrar en el "
        + "más allá. Su don les permite comunicarse con aquellos que ya han dejado de existir en este mundo, "
        + "consiguiendo así contestar preguntas incluso tiempo después de que las respuestas cayeran en el olvido."
};

const ASTROLOGO = {
    name: "Astrólogo",
    emoji: "🔭",
    description: "Los astrólogos han encontrado a lo largo de la historia la verdad en los astros. Las estrellas son "
        + "causa y efecto de todo lo que ha ocurrido y ocurrirá, y en ellas, dicen, está escrito nuestro destino. "
        + "Mediante sus constelaciones, los astrólogos son capaces de entender los elementos definitorios de cada "
        + "individuo y así encontrar respuestas a las preguntas más profundas de cada ser."
};

const NUMEROLOGO = {
    name: "Numerólogo",
    emoji: "🔢",
    description: "Los numerólogos son el eslabón perdido entre el mundo racional y el espiritual. Gracias a los "
        + "números fuertemente relacionados con una persona, son capaces de calcular el significado y devenir de "
        + "todo lo que ocurre, ha ocurrido y ocurrirá a través de sus cifras."
};

const EXPERTO_PSICOFONIAS = {
    name: "Experto en psicofonías",
    emoji: "🎤",
    description: "Las psicofonías son el registro de las voces que nos llegan desde el más allá. Mediante el estudio "
        + "de una voz deambulante, el alarido último que queda atrapado en el tiempo, o el mensaje ininteligible de "
        + "quien quiere comunicarse desde otro plano, los expertos en psicofonías nos ayudan a entender qué fue y cómo "
        + "pasó."
};

const TASEOGRAFO = {
    name: "Taseógrafo",
    emoji: "🍵",
    description: "Los taseógrafos se dedican a estudiar el flujo de la vida y el tiempo. Son capaces de obtener "
        + "información a partir de los restos que quedan de todo aquello que fluye, como las hojas de té o el poso del "
        + "café."
};

const PAREIDOLOGO = {
    name: "Pareidólogo",
    emoji: "😶‍🌫️",
    description: "Los pareidólogos son expertos en encontrar formas allá donde otros no ven nada. Estas formas "
        + "místicas esconden historias grotescas impresas en manchas y borrones, imperceptibles para la mayoría pero "
        + "no para los ojos expertos de los pareidólogos."
};

const QUIROMANTE = {
    name: "Quiromante",
    emoji: "🪬",
    description: "Los quiromantes creen que el destino de una persona está escrito desde que nacen. A través de las "
        + "palmas de las manos, los quiromantes son capaces de adivinar los secretos más profundos de cada uno, así "
        + "como ver a través de verdades y mentiras aquello que más anhelan."
};

const CEROMANTE = {
    name: "Ceromante",
    emoji: "🕯️",
    description: "Los ceromantes creen en el fuego como elemento vital del universo. Mediante la lectura de aquello "
        + "que el fuego consume, los ceromantes usan velas para encontrar mensajes y símbolos ocultos en las formas de "
        + "su cera derretida."
};

const ALL_SPECIALTIES = [
    TAROTISTA, MEDIUM, ASTROLOGO, NUMEROLOGO, EXPERTO_PSICOFONIAS, TASEOGRAFO, PAREIDOLOGO, QUIROMANTE, CEROMANTE
];


// Airtable config
const API_KEY = 'pat5Kss9nRzjRDsFh.7d03cf7cd13c5d122d9e25ccf7dd4f5626bb6ebd5fbe307811de5736e4ad473b';
const BASE_ID = 'appY1pRlJul8YV1C5';
const TABLE_NAME = 'characters';

const FIELD_CHARACTER_ID = 'character_id';
const FIELD_SPECIALTY_ID = 'specialty';
const FIELD_NAME_ID = 'name';
const FIELD_BACKSTORY_ID = 'backstory';

const Airtable = require('airtable');
const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

// In memory data
var registeredCharacters = [];

// Constants
const QUERY_PARAM_ID = 'id';

// Start
const queryId = new URLSearchParams(window.location.search).get(QUERY_PARAM_ID);

if (!queryId) {
    // No id - can't grant access
    console.log("No se ha detectado id")
} else {
    fetchCharactersInfo();
}

function fetchCharactersInfo() {
    base(TABLE_NAME).select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            const id = record.get(FIELD_CHARACTER_ID);
            console.log('Retrieved', id);
            registeredCharacters[id] = record;
            registeredCharacters['length']++;
        });

        fetchNextPage();
    }, function done(err) {
        if (err) {
            console.error(err); return;
        }

        console.log("Done fetching: " + registeredCharacters);

        const characterInfo = registeredCharacters[queryId];

        if (!characterInfo) {
            console.log("Current ID not found on characters table")
        } else {
            console.log("Character found with ID " + queryId);
            const specialty = characterInfo.get(FIELD_SPECIALTY_ID);

            if (!specialty) {
                console.log("No specialty yet! Assigning one");
                getAssignedCharacter();
            } else {
                console.log("Character specialty identified: " + specialty);
            }
        }

    });
}

function getAssignedCharacter() {
    var charNum = registeredCharacters['length'] % ALL_SPECIALTIES.length;
    console.log("You'd be getting main character num " + charNum + " for characters " + registeredCharacters['length']);
    console.log("Updating your specialty to " + ALL_SPECIALTIES[charNum]['name']);
    updateCharacter(registeredCharacters[queryId].getId(), { "specialty": ALL_SPECIALTIES[charNum]['name']});
}

function updateCharacter(id, data) {
    console.log("Updating id " + id);
    base(TABLE_NAME).update([{
        "id": id,
        "fields": data
    }], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
    });
}