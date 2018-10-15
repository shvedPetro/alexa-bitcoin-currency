const Alexa = require('ask-sdk-core');
const getCurrency = require('./getCurrency');

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(`Welcome to ${enData.translation.SKILL_NAME}.`)
      .reprompt(enData.translation.HELP_MESSAGE)
      .getResponse();
  },
};

const GetCurrencyHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'GetCurrency';
  },
  async handle(handlerInput) {
      let speakOutput;
      const request = handlerInput.requestEnvelope.request;
      if (request.intent.slots.count.value && request.intent.slots.currency.value) {
          const result = await getCurrency(request.intent.slots.currency.value, request.intent.slots.count.value);
          speakOutput = `You can buy ${result} BTC`;
      }

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
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
      .speak(enData.translation.HELP_MESSAGE)
      .reprompt(enData.translation.HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(enData.translation.FALLBACK_MESSAGE)
      .reprompt(enData.translation.FALLBACK_REPROMPT)
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
      .speak(enData.translation.STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    return handlerInput.responseBuilder
      .speak(enData.translation.ERROR_MESSAGE)
      .reprompt(enData.translation.ERROR_MESSAGE)
      .getResponse();
  },
};


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    GetCurrencyHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

const enData = {
  translation: {
    SKILL_NAME: 'Bitcoin Currency',
    HELP_MESSAGE: 'You can say how much is ten usd in bitcoin, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Bitcoin Currency skill can\'t help you with that.  It can help you know how much bitcoin you can buy if you say how much is ten usd in bitcoin.',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!'
  },
};
