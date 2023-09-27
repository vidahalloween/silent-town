// Characters info
const SPECIALTY_NAME_FIELD_ID = 'name';
const SPECIALTY_EMOJI_FIELD_ID = 'emoji';
const SPECIALTY_DESCRIPTION_FIELD_ID = 'description';

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

const PSICOFONISTA = {
    name: "Psicofonista",
    emoji: "🔊",
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
    description: "Los pareidólogos son expertos en encontrar caras y formas allá donde otros no ven nada. Estas formas "
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
    TAROTISTA, MEDIUM, ASTROLOGO, NUMEROLOGO, PSICOFONISTA,
    TASEOGRAFO,
    TAROTISTA, MEDIUM, ASTROLOGO, NUMEROLOGO, PSICOFONISTA,
    PAREIDOLOGO,
    TAROTISTA, MEDIUM, ASTROLOGO, NUMEROLOGO, PSICOFONISTA,
    QUIROMANTE,
    TAROTISTA, MEDIUM, ASTROLOGO, NUMEROLOGO, PSICOFONISTA,
    CEROMANTE
];

// Airtable config
const API_KEY = 'pat5Kss9nRzjRDsFh.7d03cf7cd13c5d122d9e25ccf7dd4f5626bb6ebd5fbe307811de5736e4ad473b';
const BASE_ID = 'appY1pRlJul8YV1C5';
const TABLE_NAME = 'characters';

const FIELD_AIRTABLE_ID = 'id';
const FIELD_CHARACTER_ID = 'character_id';
const FIELD_SPECIALTY_ID = 'specialty';
const FIELD_NAME_ID = 'name';
const FIELD_BACKSTORY_ID = 'backstory';
const FIELD_OBJECTS_ID = 'objects';
const FIELD_PERSONALITY_ID = 'personality';
const FIELD_QUOTES_ID = 'quotes';
const FIELD_INSPIRATIONS_ID = 'inspirations';
const FIELD_CONNECTIONS_ID = 'connections';
const FIELD_WEAK_POINS_ID = 'weak_points';

const Airtable = require('airtable');
const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

// In memory data
var userData = {};
var registeredCharacters = [];
var countdownInterval;
var updateCharacterTimeout;
var fetchCharacterInfoRetries = 0;
var previouslyAssignedCharacters = 0;
var userUpdatedSuccessfully = false;

// Start
const userId = new URLSearchParams(window.location.search).get('id');
const limitTime = new Date("Oct 1, 2023 12:00:00").getTime();

startCountdown();

if (!userId) {
    // No id - can't grant access
    console.log("No id detected. Showing incorrect URL message");
    showIncorrectUrlMessage();
} else {
    registeredCharacters['num_of_specialists'] = 0;
    fetchCharacterInfo();
}

function startCountdown() {
    const nowTime = new Date().getTime();
    const timeLeftMs = limitTime - nowTime;

    if (timeLeftMs <= 0) {
        countdownDone();
    } else {
        updateCountDown();
        countdownInterval = setInterval(updateCountDown, 1000);
    }
}

function updateCountDown() {
    const nowTime = new Date().getTime();
    const timeLeftMs = limitTime - nowTime;

    if (timeLeftMs <= 0) {
        countdownDone();
        return;
    }

    const daysLeft = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

    const daysLeftStr = (daysLeft <= 9) ? "0" + daysLeft : daysLeft;
    const hoursLeftStr = (hoursLeft <= 9) ? "0" + hoursLeft : hoursLeft;
    const minutesLeftStr = (minutesLeft <= 9) ? "0" + minutesLeft : minutesLeft;
    const secondsLeftStr = (secondsLeft <= 9) ? "0" + secondsLeft : secondsLeft;
    
    const timeLeft = `${daysLeftStr}d ${hoursLeftStr}h ${minutesLeftStr}m ${secondsLeftStr}s`;
    $('.countdown-banner').html("🎃 Quedan <strong>" + timeLeft +"</strong> para completar el personaje 🎃");
}

function countdownDone() {
    $('textarea').attr('disabled', true);
    $('input').attr('disabled', true);
    $('.countdown-banner').hide();
    $('.banner-message').html(
        "El tiempo para completar el personaje se ha acabado. Para cualquier pregunta o modificación, por favor " +
        "contacta con los game masters."
    )
    
    clearInterval(countdownInterval);
}

function showIncorrectUrlMessage() {
    $('.welcome-loading').hide();
    $('.incorrect-url-container').show();
}

function fetchCharacterInfo() {
    base(TABLE_NAME).select({
        filterByFormula: "{character_id} = '" + userId + "'",
        view: "Grid view"
    })
    .firstPage()
    .then(records => {
        console.log("Found " + records.length + " users with character ID " + userId);

        if (records.length < 1) {
            console.warn('User id ' + userId + ' not registered. Showing incorrect URL message');
            showIncorrectUrlMessage();
        } else {
            console.log('User id ' + userId + ' correctly fetched.');

            userData = extractUserDataFromRecord(records[0]);
            
            if (!userData[FIELD_SPECIALTY_ID]) {
                console.log('No specialty detected yet. Showing assignation flow');
                showAssignationFlow();
            } else {
                console.log('Specialty detected. Showing char creation flow');
                showCharacterCreationFlow();
            }
        }
    })
    .catch(error => {
        console.error(error);

        if (fetchCharacterInfoRetries < 5) {
            fetchCharacterInfoRetries++;
            console.info("Retrying to fetch character info. Attempt " + fetchCharacterInfoRetries);
            fetchCharacterInfo();
            return;
        }

        showErrorBanner();
    });
}

function extractUserDataFromRecord(record) {
    var data = {};
    data[FIELD_AIRTABLE_ID] = record.getId();
    data[FIELD_CHARACTER_ID] = record.get(FIELD_CHARACTER_ID);
    data[FIELD_NAME_ID] = record.get(FIELD_NAME_ID);
    data[FIELD_BACKSTORY_ID] = record.get(FIELD_BACKSTORY_ID);
    data[FIELD_OBJECTS_ID] = record.get(FIELD_OBJECTS_ID);
    data[FIELD_PERSONALITY_ID] = record.get(FIELD_PERSONALITY_ID);
    data[FIELD_QUOTES_ID] = record.get(FIELD_QUOTES_ID);
    data[FIELD_INSPIRATIONS_ID] = record.get(FIELD_INSPIRATIONS_ID);
    data[FIELD_CONNECTIONS_ID] = record.get(FIELD_CONNECTIONS_ID);
    data[FIELD_WEAK_POINS_ID] = record.get(FIELD_WEAK_POINS_ID);
    ALL_SPECIALTIES.forEach(function(value, key) {
        if (value[SPECIALTY_NAME_FIELD_ID] === record.get(FIELD_SPECIALTY_ID)) {
            data[FIELD_SPECIALTY_ID] = value;
        }
    });

    return data;
}

function showAssignationFlow() {
    $('.welcome-loading').hide();
    $('.assignation-container').fadeIn(500);
}

function showCharacterCreationFlow() {
    populateCharacterCreationForm();

    $('.welcome-loading').hide();
    $('.assignation-container').hide();
    $('.form-container').fadeIn(500);
}

function populateCharacterCreationForm() {
    $('#specialty-name').html(userData[FIELD_SPECIALTY_ID][SPECIALTY_NAME_FIELD_ID]);
    $('#specialty-emoji').html(userData[FIELD_SPECIALTY_ID][SPECIALTY_EMOJI_FIELD_ID]);
    $('#specialty-description').html('"' + userData[FIELD_SPECIALTY_ID][SPECIALTY_DESCRIPTION_FIELD_ID] + '"');
    
    $('#form-name-field').val(userData[FIELD_NAME_ID]);
    $('#form-backstory-field').val(userData[FIELD_BACKSTORY_ID]);
    $('#form-objects-field').val(userData[FIELD_OBJECTS_ID]);
    $('#form-personality-field').val(userData[FIELD_PERSONALITY_ID]);
    $('#form-quotes-field').val(userData[FIELD_QUOTES_ID]);
    $('#form-inspirations-field').val(userData[FIELD_INSPIRATIONS_ID]);
    $('#form-connections-field').val(userData[FIELD_CONNECTIONS_ID]);
    $('#form-weak_points-field').val(userData[FIELD_WEAK_POINS_ID]);
}

function updateUserDataFromFormFields() {
    userData[FIELD_NAME_ID] = $('#form-name-field').val();
    userData[FIELD_BACKSTORY_ID] = $('#form-backstory-field').val();
    userData[FIELD_OBJECTS_ID] = $('#form-objects-field').val();
    userData[FIELD_PERSONALITY_ID] = $('#form-personality-field').val();
    userData[FIELD_QUOTES_ID] = $('#form-quotes-field').val();
    userData[FIELD_INSPIRATIONS_ID] = $('#form-inspirations-field').val();
    userData[FIELD_CONNECTIONS_ID] = $('#form-connections-field').val();
    userData[FIELD_WEAK_POINS_ID] = $('#form-weak_points-field').val();
}

function onAssignButtonClicked() {
    $('#assign-button').attr('disabled', true).fadeOut(500)
    $('#crystal-ball-emoji').removeClass('animated-emoji').addClass('crystal-ball-loading');
    $('#crystal-ball-bg').addClass('crystal-ball-bg-loading');
    assignSpecialty();
}

function assignSpecialty() {
    previouslyAssignedCharacters = 0;

    base(TABLE_NAME).select({
        fields: [FIELD_SPECIALTY_ID],
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            if (record.get(FIELD_SPECIALTY_ID)) {
                previouslyAssignedCharacters++;
            }
        });

        fetchNextPage();
    }, function done(err) {
        if (err) {
            console.error(err);
            showErrorBanner();
            return;
        }

        const specialtyIdx = previouslyAssignedCharacters % ALL_SPECIALTIES.length;
        userData[FIELD_SPECIALTY_ID] = ALL_SPECIALTIES[specialtyIdx];

        updateCharacterSpecialty();
        checkUserUpdatedSuccessfully(6000, showCharacterCreationFlow);
    });
}

function onInputValueChanged() {
    if (updateCharacterTimeout) {
        clearTimeout(updateCharacterTimeout);
    }

    updateCharacterTimeout = setTimeout(saveCharacterData, 3000);
}

function saveCharacterData() {
    clearTimeout(updateCharacterTimeout);

    updateUserDataFromFormFields();
    updateCharacterData();
}

function checkUserUpdatedSuccessfully(timeout, callback) {
    if (userUpdatedSuccessfully) {
        callback();
        return;
    }

    setTimeout(function() { checkUserUpdatedSuccessfully(timeout, callback) }, timeout);
}

function updateCharacterSpecialty() {
    const specialtyName = userData[FIELD_SPECIALTY_ID][SPECIALTY_NAME_FIELD_ID];
    var data = {};
    data[FIELD_SPECIALTY_ID] = userData[FIELD_SPECIALTY_ID][SPECIALTY_NAME_FIELD_ID];

    console.log("Updating character specialty to " + specialtyName);

    userUpdatedSuccessfully = false;
    base(TABLE_NAME).update([{
        "id": userData[FIELD_AIRTABLE_ID],
        "fields": data
    }], function(err, records) {
        if (err) {
          console.error(err);
          showErrorBanner();
          return;
        }

        userUpdatedSuccessfully = true;
    });
}

function updateCharacterData() {
    var airtableData = {};
    Object.assign(airtableData, userData);
    delete airtableData[FIELD_AIRTABLE_ID];
    delete airtableData[FIELD_SPECIALTY_ID];

    console.log("Updating character with id " + userData[FIELD_AIRTABLE_ID]);

    userUpdatedSuccessfully = false;
    base(TABLE_NAME).update([{
        "id": userData[FIELD_AIRTABLE_ID],
        "fields": airtableData
    }], function(err, records) {
        if (err) {
          console.error(err);
          showErrorBanner();
          return;
        }

        userUpdatedSuccessfully = true;
    });
}

function showErrorBanner() {
    $('.error-banner').show();
}