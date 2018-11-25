/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    
    return handlerInput.responseBuilder
      .speak(GAME_SOUND1 + WELCOME_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const InProgressGiftIdeaHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'&& 
        request.intent.name === 'GiftIdea' &&
        request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
   
    // Merging collected slots with slots in session attributes
    let currentIntent = handlerInput.requestEnvelope.request.intent;
    const {attributesManager,responseBuilder} = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();
    if ( sessionAttributes[currentIntent.name]) {
      const tempSlots = sessionAttributes[currentIntent.name].slots;
      for (var key in tempSlots){
        if ( tempSlots[key].value && !currentIntent.slots[key].value){
          currentIntent.slots[key] = tempSlots[key];
        }
      }
    }
    
    // Save all slots back to session
    sessionAttributes[currentIntent.name] = currentIntent;
    attributesManager.setSessionAttributes(sessionAttributes);
    
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  },
};

const CompletedGiftIdeaHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'GiftIdea';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const intentSlots = request.intent.slots;
    
    const occasion = intentSlots.occasion.value;
    const relationship = intentSlots.relationship.value;
    const name = intentSlots.name.value;
    const preference = intentSlots.preference.value;
    console.log("occasion:" + JSON.stringify(occasion));
 
    let speechOutput = "You should get "+ name +" an echo spot. Every "+ 
      relationship + " can use one, and there is a large selection of "+ 
      preference +" music included with Prime Music. Shall I order one?";

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(HELP_REPROMPT)
      .getResponse();
      
  },
};

const InProgressCardHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'&& 
        request.intent.name === 'Card' &&
        request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
  
    // Merging collected slots with slots in session attributes
    let currentIntent = handlerInput.requestEnvelope.request.intent;
    const {attributesManager,responseBuilder} = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();
    if ( sessionAttributes[currentIntent.name]) {
      const tempSlots = sessionAttributes[currentIntent.name].slots;
      for (var key in tempSlots){
        if ( tempSlots[key].value && !currentIntent.slots[key].value){
          currentIntent.slots[key] = tempSlots[key];
        }
      }
    }
    // Adding unfilled slots from other intents
    var otherIntentSlots = getSlotsFromIntent (sessionAttributes, "GiftIdea");
    for (var key in currentIntent.slots){
      if (otherIntentSlots[key] && !currentIntent.slots[key].value){
        console.log("nel");
        currentIntent.slots[key] = otherIntentSlots[key];
      }
    }
    // Save all slots to session
    sessionAttributes[currentIntent.name] = currentIntent;
    attributesManager.setSessionAttributes(sessionAttributes);
 
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  },
};

const CompletedCardHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'Card';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const intentSlots = request.intent.slots;
    const occasion = intentSlots.occasion.value;
    const name = intentSlots.name.value;
    const message = intentSlots.message.value;
    
    let speechOutput = "ok, I have a "+ occasion + " card for " + 
      name + ", with the following message: " + message;
    
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`The session ended: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('<say-as interpret-as="interjection">ouch</say-as> there was a problem with your request')
      .reprompt('there was a problem with your request')
      .getResponse();
  },
};

const SKILL_NAME = 'Gift Ideas';
const GAME_SOUND1 = "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_player1_01'/>";
const HELP_MESSAGE = 'You can say: Gift for someone or simply you can say: Cancel... ¿How can I help you?';
const HELP_REPROMPT = 'How can I help you?';
const STOP_MESSAGE = '<say-as interpret-as="interjection">okey dokey</say-as><s> see you later </s>';
const WELCOME_MESSAGE = "Welcome!. Gift Ideas Dialog recommends the perfect gift for your mom, friend, or pet. How can I help?"

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    InProgressGiftIdeaHandler,
    CompletedGiftIdeaHandler,
    InProgressCardHandler,
    CompletedCardHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();


function getSlotsFromIntent (sessionAttributes, intentName){
    var slots = {};
    if ( sessionAttributes[intentName]) {
      slots = sessionAttributes[intentName].slots;
    }
   return slots;
} 