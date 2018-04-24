# GateKeeper: a drum machine, of sorts

## Summary
GateKeeper is a drum machine which can take any sound and use it to create a rhythm.

## Motivation
Popular music has changed a lot over the past century or so, but one thing that has remained oddly static is the set of drum sounds used to provide rhythm. The kick, snare, hi-hat, and other "real" drum sounds have remained the default sounds for many tracks, and although there are many flavours of each, their essence has survived the transition from acoustic drums to analogue and then digital drum machines.

While researching how to synthesise drum sounds without using samples, I realised that a lot of synthetic drum sounds are created from fairly simple sound sources, such as white noise or a sine wave. This made me wonder about the possibility of feeding other, more complex sounds through a series of effects to create unusual drum sounds which fulfil a similar percussive role to the kick, snare, hi-hat, etc, but which sound noticeably different.

## Installation
This project uses the excellent [React Webpack Template](https://github.com/react-webpack-generators/react-webpack-template), so the installation instructions are pretty much the same as listed there. Basically, do:
```
npm install
npm start
```
The drum machine should then be running at [http://localhost:8000](http://localhost:8000).
