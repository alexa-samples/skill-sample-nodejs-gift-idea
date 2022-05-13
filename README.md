# Advanced Alexa Skills Using Dialog Management 

# ** This repository has been archived **
This repository is still available as a point-in-time reference, but no further updates or support will be prioritized.

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/fact/header._TTH_.png" />

## What You Will Learn
*  [AWS Lambda](http://aws.amazon.com/lambda)
*  [Alexa Skills Kit (ASK)](https://developer.amazon.com/alexa-skills-kit)
*  Using the [Dialog Management Features](https://developer.amazon.com/alexa-skills-kit/dialog-management)
*  Voice User Interface (VUI) Design


## What You Will Need
*  [Amazon Developer Portal Account](http://developer.amazon.com)
*  [Amazon Web Services Account](http://aws.amazon.com/)
*  The sample code on [GitHub](https://github.com/alexa/skill-sample-nodejs-fact).
*  A basic understanding of Node.js.

## What Your Skill Will Do
This simple "Gift Ideas" Skill will teach you how to use advance dialog management techniques. Pay special attention on the "addDelegateDirective" that enable your skill to trigger the "User Utterances" for slot filling 

User: Alexa, open gift idea dialog
Alexa: Welcome to Gift Ideas Dialog...
User: I need a birthday gift
<Triggers the "GiftIdea" intent that requires: name, relationship, preference and occasion and fills occasion given the fact that name, relationshio and preference are required too, the lamba function returns "addDelegateDirective(currentIntent)" to fill the missing slots until request.DialogState is "Completed">



